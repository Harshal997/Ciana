import { useUser } from "@clerk/clerk-expo";
import { useConversation } from "@elevenlabs/react-native";
import React from "react";
import { Button, StyleSheet, View } from "react-native";

const Session = () => {
  const { user } = useUser();
  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to conversation");
    },
  });

  const startConversation = async () => {
    try {
      await conversation.startSession({
        agentId: process.env.EXPO_PUBLIC_AGENT_ID,
        dynamicVariables: {
          user_name: user?.firstName || "User",
          session_title: "My First Session",
          session_description: "This is a test session",
        },
      });
    } catch (e) {
      console.error("Failed to start conversation:", e);
    }
  };

  const stopConversation = async () => {
    try {
      await conversation.endSession();
    } catch (e) {
      console.error("Failed to stop conversation:", e);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Start Conversation" onPress={startConversation} />
      <Button
        title="Stop Conversation"
        onPress={stopConversation}
        color={"rgb(240,60,92)"}
      />
    </View>
  );
};

export default Session;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginVertical: 10,
  },
});
