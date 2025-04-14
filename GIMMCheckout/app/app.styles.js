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
      headerText: {
        fontWeight: 'bold',
        color: '#000',
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
});

export default styles;