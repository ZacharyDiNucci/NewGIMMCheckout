import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
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
});

export default styles;