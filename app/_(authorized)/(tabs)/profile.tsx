import { Button, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { useAuthSession } from "@/providers/AuthProvider";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

const profile = () => {
  const { signOut, token } = useAuthSession();
  const [tokenInUi, setTokenInUi] = useState<null | string | undefined>(null);

  const logout = () => {
    signOut();
  };

  const callApi = () => {
    setTokenInUi(token?.current);
  };

  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button title={"Logout"} onPress={logout} />
      <ThemedView
        style={{
          paddingTop: 20,
        }}
      />
      <ThemedText>Make an API call with the stored AUTH token</ThemedText>
      <Button title={"Call API"} onPress={callApi} />
      {tokenInUi && (
        <ThemedText>{`Your API access token is ${tokenInUi}`}</ThemedText>
      )}
    </ThemedView>
  );
};

export default profile;

const styles = StyleSheet.create({});
