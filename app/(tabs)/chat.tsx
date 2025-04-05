import {
  Button,
  FlatList,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import axiosInstance from "@/lib/axiosInstance";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Pusher from "pusher-js/react-native";
import Echo from "laravel-echo";
import { token } from "@/lib/axiosInstance";

const Chat = () => {
  const [data, setData] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const insets = useSafeAreaInsets();

  const fetchMessages = async () => {
    try {
      const response = await axiosInstance.get("/conversations/1/messages");
      setData(response.data.data); // asumsi responsenya ada `data.data`
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    try {
      await axiosInstance.post("/conversations/1/messages", {
        body: message,
        type: "text",
      });
      setMessage("");
      fetchMessages(); // refresh setelah kirim
    } catch (err) {
      console.log(err.response.data);
      console.error("Failed to send message", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    // Pusher.logToConsole = true;

    const PusherClient = new Pusher("g604hzvvdj4f3srgnpbb", {
      cluster: "mt1", // tetap isi walaupun tidak dipakai
      wsHost: "reverb.bogordev.my.id",
      wsPort: 443,
      wssPort: 443,
      forceTLS: true,
      enabledTransports: ["ws", "wss"], // biar fleksibel
      disableStats: true,
      authEndpoint: "https://app.bogordev.my.id/broadcasting/auth",
      auth: {
        headers: {
          Authorization: `Bearer ${token}`, // token user
          Accept: "application/json",
        },
      },
    });

    let echo = new Echo({
      broadcaster: "reverb",
      client: PusherClient,
    });

    echo
      .private("conversation.1")
      .listen("MessageSent", (e) => {
        // console.log(e);
        setData((prev) => [...prev, e.message]);
      })
      .error((e) => {
        console.error(e);
      });

    return () => {
      echo.leave("conversation.1");
    };
  }, []);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top + 24 }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ThemedText style={styles.header}>Chat</ThemedText>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ThemedView style={styles.messageBubble}>
            <ThemedText>{item.body}</ThemedText>
          </ThemedView>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <ThemedView style={styles.inputContainer}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Tulis pesan..."
          style={styles.input}
        />
        <Button title="Kirim" onPress={handleSend} />
      </ThemedView>
    </KeyboardAvoidingView>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 18,
    marginBottom: 12,
  },
  messageBubble: {
    padding: 12,
    // backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  inputContainer: {
    position: "absolute",
    bottom: 24,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
});
