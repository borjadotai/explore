import { StyleSheet, TextInput } from "react-native";
import { Text, View } from "../../components/Themed";
import { Button } from "react-native-elements";
import { supabase } from "../../lib/supabase";
import { useState } from "react";

export default function ProfileScreen() {
  const [email, setEmail] = useState("");

  async function signInWithEmail() {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
    });
    console.log(data);
  }

  return (
    <View style={styles.container}>
      <TextInput
        value={email}
        onChangeText={(email) => setEmail(email)}
        placeholder={"Emmail"}
        style={styles.input}
      />
      <Button onPress={signInWithEmail} title="Log in" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#ffffff",
  },
  input: {
    width: 250,
    height: 44,
    padding: 10,
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: "#e8e8e8",
  },
});
