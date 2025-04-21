import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: '#333', // dark background
        padding: 16,
      },
    containerLight: {
      flex: 1,
        justifyContent: "center",
        backgroundColor: '#ccc',
        padding: 16,
        borderRadius: 10,
    },
      title: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 20,
      },
      input: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        borderRadius: 5,
      },
      errorText: {
        color: "red",
        marginBottom: 12,
        fontSize: 14,
      },
      headerRow: {
        flexDirection: 'row',
        backgroundColor: '#ccc',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#999',
      },
      itemRow: {
        flexDirection: 'row',
        backgroundColor: '#e6e8f0',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#999',
      },
      buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between', // or 'center', 'space-around'
        padding: 10,
      },
      columnHeader: {
        fontWeight: 'bold',
        color: '#000',
      },
      header: {
        marginTop: 10,
        marginBottom: 20,
        alignItems: 'center',
      },
      
      welcome: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
      },

      welcomeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
      },

      logoutButton: {
        backgroundColor: '#fff',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 10,
      },
      
      logoutButtonText: {
        color: '#333',
        fontSize: 16,
        fontWeight: 'bold',
      },
      
      date: {
        fontSize: 16,
        color: '#b0b0b0',
        marginTop: 4,
        fontWeight:'bold',
        marginBottom: 20,
      },
      
      prompt: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
        textAlign: 'center',
      },
      itemText: {
        color: '#000',
      },
      nameColumn: {
        flex: 2,
        paddingHorizontal: 5,
      },
      countColumn: {
        flex: 1,
        textAlign: 'center',
      },
      dueColumn: {
        flex: 1.5,
        textAlign: 'right',
        paddingRight: 5,
      },
      modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay
      },
      modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: "white",
        borderRadius: 10,
        alignItems: "center",
      },
      modalText: {
        fontSize: 16,
        marginBottom: 20,
      },
      modalImage: {
        width: 100,
        height: 100,
        marginBottom: 15,
      },

      loginScreenContainer: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#3a3a3a",
        padding: 20,
        alignItems: "center",
      },
      loginHeader: {
        fontSize: 36,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 40,
      },
      loginInput: {
        width: "100%",
        height: 48,
        backgroundColor: "#e6e8f0",
        borderRadius: 5,
        paddingHorizontal: 12,
        marginBottom: 16,
        fontSize: 16,
      },
      loginButton: {
        width: "100%",
        backgroundColor: "#a0a3ad",
        paddingVertical: 12,
        borderRadius: 5,
        alignItems: "center",
        marginBottom: 16,
      },
      loginButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 18,
      },
      loginLinkText: {
        color: "#fff",
        textDecorationLine: "underline",
        fontSize: 16,
      },

      techButton: {
        flex: 1,
        margin: 10,
        backgroundColor: '#ccc',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
      },
      typeImage: {
        width: '100%',
        height: 0,
        paddingBottom: '100%',
        borderRadius: 10,
      },
      techImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
      },
      techText: {
        marginTop: 10,
        color: '#333',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
      },
      techRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      techTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
      },
      listContent: {
        paddingBottom: 20,
      },
      deviceText: {
        marginTop: 5,
        fontSize: 14,
        fontWeight: 'bold',
      },
      deviceButton: {
        backgroundColor: 'white',
        height: 150,
        marginBottom: 15,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
      },
      typeButton: {
        flex: 1,
        backgroundColor: 'white',
        margin: 10,
        marginBottom: 15,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
      },
      deviceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
      },

      pastDueDate: {
        borderWidth: 2,
        borderColor: 'red',
        borderRadius: 8,
        padding: 0,
      },

      modalButtonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
      },
      button: {
        marginHorizontal: 10,
      },
});

export default styles;
