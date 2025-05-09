const express = require('express');
const session = require('express-session');
const multer = require('multer');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');  // Import the cors package
const { query } = require('./db');  // Import the query function
const path = require('path');

const app = express();
const upload = multer();
const port = 5000;

require('dotenv').config();

// CORS Configuration
const corsOptions = {
    origin: 'http://localhost:8081',  // Allow the frontend to make requests
    methods: ['GET', 'POST', 'PUT', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,  // Allows cookies to be sent with the request
};
app.use(cors(corsOptions));

app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use((req, res, next) => {
    res.locals.sessionData = req.session;
    next();
});

app.use(cookieParser());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'local-bucket')));

app.use('/local-bucket', express.static(path.join(__dirname, 'local-bucket')));
// API endpoint to validate session token
app.post('/api/validate-token', async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = decoded;

        const selectSql = 'SELECT id, first_name, last_name, email, creation_timestamp FROM gimmcheckout_users WHERE id = ?';
        try {
            const result = await query(selectSql, [req.user.userId]);
            req.user = result[0];
            res.status(200).json({ message: 'Token validated successfully', user: req.user });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'An error occurred' });
        }
    });
});

// API endpoint to log in
app.post('/api/login',
    upload.none(),
    check('username').notEmpty().withMessage('Username is required'),
    check('password').notEmpty().withMessage('Password is required'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Enter username and password',
                errors: errors.array(),
            });
        }

        let { username, password } = req.body;

        const selectSql = 'SELECT * FROM gimmcheckout_users WHERE email = ?';
        try {
            const result = await query(selectSql, [username]);
            if (result.length > 0) {
                const user = result[0];
                if (bcrypt.compareSync(password, user.password)) {
                    req.session.user = { userId: user.id };
                    
                    const tokenExpiration = req.body['remember-me'] === 'true' ? '7d' : '1d';
                    const token = jwt.sign(
                        { userId: user.id },
                        process.env.JWT_SECRET,
                        { expiresIn: tokenExpiration }
                    );
                    return res.status(200).json({
                        message: 'Login successful',
                        token, // ✅ Send token back in response
                        userId: user.id, // optional: send user info
                        level: user.user_permission
                    });
                } else {
                    return res.status(400).json({ message: 'Invalid username or password' });
                }
            } else {
                return res.status(400).json({ message: 'Invalid username or password' });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'An error occurred' });
        }
    }
);


app.post("/api/register", upload.none(),
    check('first-name').notEmpty().withMessage('First name is required'),
    check('last-name').notEmpty().withMessage('Last name is required'),
    check('email').isEmail().withMessage('Invalid email format'),
    check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/[A-Z]/).withMessage('Password must contain at least one capital letter')
        .matches(/\d/).withMessage('Password must contain at least one number')
        .matches(/[\W_]/).withMessage('Password must contain at least one symbol'),
    check('confirm-password').custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match'),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    message: 'Request fields or files are invalid.',
                    errors: errors.array(),
                });
            }

            const plainTextPassword = req.body.password;
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(plainTextPassword, salt);

            // Using the query function from db.js
            const insertSql = `INSERT INTO gimmcheckout_users (first_name, last_name, email, password, creation_timestamp) VALUES (?, ?, ?, ?, ?)`;
            const queryParams = [req.body['first-name'], req.body['last-name'], req.body.email, hash, new Date().toISOString()];

            // Execute the query using the query helper from db.js
            await query(insertSql, queryParams);

            return res.status(200).json({ message: 'User registered' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'An error occurred' });
        }
    });

app.post('/api/check-token', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ message: 'Token required' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Optional: Check user exists
        const userId = decoded.userId;
        const result = await query('SELECT id FROM gimmcheckout_users WHERE id = ?', [userId]);

        if (result.length === 0) {
            return res.status(401).json({ message: 'Invalid user' });
        }

        // Token is valid and user exists
        return res.status(200).json({ message: 'Token valid' });

    } catch (err) {
        console.error("Token verification failed:", err);
        return res.status(401).json({ message: 'Invalid token' });
    }
});

app.post('/api/user_details', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;
        const selectSql = `SELECT first_name, last_name FROM gimmcheckout_users WHERE id = ?`;
        const result = await query(selectSql, [userId]);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'An error occurred' });
    }
})



app.post('/api/user-devices', async (req, res) => {
    // Get the token from the Authorization header
    const token = req.headers.authorization?.split(' ')[1]; // The token is after 'Bearer'

    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Extract the userId from the decoded token
        const userId = decoded.userId; // Assuming 'userId' is a field in your token

        const selectSql = `
            SELECT
                l.id AS loan_id,
                l.due_date,
                l.borrow_datetime,
                d.device_number AS device_number,
                t.description as description,
                t.device_name,
                t.image_url
            FROM gimmcheckout_loans l
            INNER JOIN gimmcheckout_devices d ON l.device_id = d.id
            INNER JOIN gimmcheckout_device_types t ON d.device_type_id = t.id
            WHERE l.borrower_id = ?
              AND l.return_datetime IS NULL
        `;

        // Query the database using the userId
        const result = await query(selectSql, [userId]);

        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'An error occurred' });
    }
});

app.put('/api/user-devices', async (req, res) => {

    console.log("Hello");
    // Get the token from the Authorization header
    const token = req.headers.authorization?.split(' ')[1]; // The token is after 'Bearer'
    const item = req.headers.authorization?.split(' ')[2];
    

    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Extract the userId from the decoded token
        const userId = decoded.userId; // Assuming 'userId' is a field in your token

        const item = req.body.item;

        const checkOutDate = new Date();
        const dueDate = new Date(checkOutDate);
        dueDate.setDate(dueDate.getDate()+14); // Set due date to 14 days in the future

        const insertSql = `
            INSERT INTO gimmcheckout_loans (
                device_id,
                borrower_id,
                reserve_datetime,
                borrow_datetime,
                due_date)
            VALUES (?, ?, ?, ?, ?)
        `;

        let insertParams = [
            item.device_id,
            userId,
            req.body.reserveDate,
            checkOutDate,
            dueDate
        ];
        console.log(insertParams);

        // Query the database using the userId
        const result = await query(insertSql, insertParams);

        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'An error occurred' });
    }
});

app.delete('/api/user-devices', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }

    try {
        console.log("Start");
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const item = req.body.item;
        console.log(item);
        if (!item || !item.device_number) {
            return res.status(400).json({ message: 'Item device_id is required' });
        }

        const deleteSql = `
            DELETE FROM gimmcheckout_loans
            WHERE id = ?
        `;
        console.log("Running query");
        const result = await query(deleteSql, item.loan_id);
        console.log("complete");
        console.log(result);

        return res.status(200).json({ message: 'Item removed successfully', result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'An error occurred' });
    }
});

app.get('/api/item-categories', async (req, res) => {
    const selectSql = 'SELECT * FROM gimmcheckout_item_categories';

    try {
        const result = await query(selectSql);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'An error occurred' });
    }
});

app.get('/api/device-types', async (req, res) => {
    const categoryId = parseInt(req.query.categoryId, 10);
    const selectSql = 'SELECT * FROM gimmcheckout_device_types WHERE category_id = ?';

    try {
        const result = await query(selectSql, [categoryId]);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'An error occurred' });
    }
});

app.get('/api/device/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const selectSql = `
  SELECT 
    d.id AS device_id,
    d.device_number AS device_number,
    d.device_type_id,
    t.id AS type_id,
    t.device_name,
    t.image_url,
    t.description
  FROM gimmcheckout_devices d
  INNER JOIN gimmcheckout_device_types t ON d.device_type_id = t.id
  WHERE d.device_type_id = ?
`;
    try {
        const result = await query(selectSql, [id]);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'An error occurred' });
    }
})

app.get('/api/loaned-devices', async (req, res) => {
  const selectSql = `
    SELECT
      l.id AS loan_id,
      l.due_date,
      l.borrow_datetime,
      d.device_number,
      t.description,
      t.device_name,
      t.image_url,
      u.first_name,
      u.last_name
    FROM gimmcheckout_loans l
    INNER JOIN gimmcheckout_devices d ON l.device_id = d.id
    INNER JOIN gimmcheckout_device_types t ON d.device_type_id = t.id
    LEFT JOIN gimmcheckout_users u ON l.borrower_id = u.id
    WHERE l.return_datetime IS NULL
  `;

  try {
    const result = await query(selectSql);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching all loaned devices:', error);
    return res.status(500).json({ message: 'An error occurred while fetching devices' });
  }
});

app.get('/api/loaned-devices/by-type', async (req, res) => {
    const { typeId } = req.query;
  
    if (!typeId) {
      return res.status(400).json({ message: 'typeId is required' });
    }
  
    const selectSql = `
      SELECT
        l.id AS loan_id,
        l.due_date,
        l.borrow_datetime,
        d.device_number,
        t.description,
        t.device_name,
        t.image_url
      FROM gimmcheckout_loans l
      INNER JOIN gimmcheckout_devices d ON l.device_id = d.id
      INNER JOIN gimmcheckout_device_types t ON d.device_type_id = t.id
      WHERE l.return_datetime IS NULL AND d.device_type_id = ?
    `;
  
    try {
      const result = await query(selectSql, [typeId]);
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching loaned devices by type:', error);
      return res.status(500).json({ message: 'An error occurred while fetching devices' });
    }
  });

  app.patch('/api/return', async (req, res) => {
    const loanId = parseInt(req.query.loanId, 10);
    if (isNaN(loanId)) {
      return res.status(400).json({ error: 'Invalid loan ID' });
    }
  
    const updateSql = 'UPDATE gimmcheckout_loans SET return_datetime = CURRENT_TIMESTAMP WHERE id = ?';

    try {
      const result = await query(updateSql, [loanId]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Loan not found' });
      }
      res.json({ message: 'Loan marked as returned' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    }
  });
    
  
app.get('/api/all-devices', async (req, res) => {

    const selectSql = 'SELECT * FROM gimmcheckout_devices';

    // const selectSql = `
    //   SELECT
    //     l.id AS loan_id,
    //     l.due_date,
    //     l.borrow_datetime,
    //     d.device_number,
    //     t.description,
    //     t.device_name,
    //     t.image_url
    //   FROM gimmcheckout_loans l
    //   INNER JOIN gimmcheckout_devices d ON l.device_id = d.id
    //   INNER JOIN gimmcheckout_device_types t ON d.device_type_id = t.id
    // `;
  
    try {
      const result = await query(selectSql);
      console.log(result);
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching loaned devices:', error);
      return res.status(500).json({ message: 'An error occurred while fetching loaned devices' });
    }
  });

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
