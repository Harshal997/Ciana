import Button from "@/components/Button";
import Gradient from "@/components/Gradient";
import { brightnessPermission } from "@/utils/brightness";
import { CIANA_THEMES } from "@/utils/sessions";
import { useUser } from "@clerk/clerk-expo";
import { useConversation } from "@elevenlabs/react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Brightness from "expo-brightness";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const Session = () => {
  const { user } = useUser();
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [reRender, setReRender] = useState(false);
  const { themeId } = useLocalSearchParams();
  const theme = CIANA_THEMES.find((t) => t.id === themeId) ?? CIANA_THEMES[0];
  const gradients: readonly [string, string, string] = [
    theme.gradient[0],
    theme.gradient[1],
    theme.gradient[2],
  ];
  const conversation = useConversation({
    onConnect: ({ conversationId }) => {
      console.log("Connected to conversation");
      setConversationId(conversationId);
    },
    clientTools: {
      handleSetBrightness: async (parameters: unknown) => {
        const { brightnessValue } = parameters as { brightnessValue: number };
        console.log("Brightness adjustment requested:", brightnessValue);
        const brightnessGranted = await brightnessPermission();
        if (brightnessGranted) {
          await Brightness.setSystemBrightnessAsync(brightnessValue);
          return brightnessValue;
        }
      },
    },
  });

  const startConversation = async () => {
    if (isStarting) return;
    try {
      await conversation.startSession({
        agentId: process.env.EXPO_PUBLIC_AGENT_ID,
        dynamicVariables: {
          user_name: user?.username || "there",
          session_title: theme.name,
          session_description: theme.environment,
        },
      });
      setReRender(!reRender);
    } catch (e) {
      console.error("Failed to start conversation:", e);
      router.navigate({
        pathname: "/(protected)/Summary",
        params: { conversationId, themeId: theme.id },
      });
    } finally {
      setIsStarting(false);
    }
  };

  const endConversation = async () => {
    try {
      await conversation.endSession();
      setReRender(!reRender);
    } catch (e) {
      console.error("Failed to stop conversation:", e);
    } finally {
      router.navigate({
        pathname: "/(protected)/Summary",
        params: { conversationId, themeId: theme.id },
      });
    }
  };

  useEffect(() => {
    if (
      conversation.status === "connecting" ||
      conversation.status === "connected"
    ) {
      setIsStarting(true);
    } else {
      setIsStarting(false);
    }
  }, [conversation.status]);

  return (
    <View style={styles.container}>
      <Gradient
        gradient={gradients}
        isSpeaking={
          conversation.status === "connected" ||
          conversation.status === "connecting"
        }
      />
      <Pressable
        onPress={() => router.back()}
        style={({ pressed }) => [styles.back, pressed && { opacity: 0.5 }]}
      >
        <Ionicons name="chevron-back" color="#FFF" size={20} />
        <Text style={styles.backText}>Go Back</Text>
      </Pressable>
      <View style={styles.themeInfo}>
        <Text style={{ fontSize: 32, fontWeight: "600" }}>{theme?.name}</Text>
        <Text style={{ fontSize: 22, fontWeight: "500", opacity: 0.5 }}>
          {theme?.mood}
        </Text>
      </View>
      <Button
        gradientArray={theme?.gradient}
        onPress={isStarting ? endConversation : startConversation}
      >
        {isStarting ? "Stop Session" : "Start Session"}
      </Button>
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
  themeInfo: {
    marginVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    rowGap: 8,
  },
  back: {
    position: "absolute",
    top: 50,
    left: 25,
    zIndex: 1,
    flexDirection: "row",
    columnGap: 10,
    alignItems: "center",
  },
  backText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "600",
  },
});
