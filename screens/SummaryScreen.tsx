import Button from "@/components/Button";
import { colors } from "@/components/constants/colors";
import { supabase } from "@/lib/supabase";
import { CIANA_THEMES } from "@/utils/sessions";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SummaryScreen = () => {
  const router = useRouter();
  const { user } = useUser();
  const { themeId, conversationId } = useLocalSearchParams();
  const theme = CIANA_THEMES.find((t) => t.id === themeId);
  const gradients: readonly [string, string, string] = [
    theme!.gradient[0],
    theme!.gradient[1],
    theme!.gradient[2],
  ];
  type Conversation = {
    status?: string;
    metadata?: {
      call_duration_secs?: number;
      system__time_utc?: string;
    };
    analysis?: {
      transcript_summary?: string;
    };
    conversation_initiation_client_data?: {
      dynamic_variables?: {
        system__time?: string;
      };
    };
  };

  const [conversation, setConversation] = useState<Conversation | undefined>();

  async function fetchConversationDetails(conversationId: string) {
    const res = await fetch(
      `/api/conversations?conversation_id=${conversationId}`,
    );

    if (!res.ok) {
      throw new Error("Failed to fetch conversation details");
    }

    return res.json();
  }

  async function saveAndContinue() {
    await supabase.from("sessions").insert({
      user_id: user?.id,
      name: theme?.name,
      theme_id: themeId,
      conversation_id: conversationId ?? "",
    });
    router.replace("/(protected)");
  }

  useEffect(() => {
    const load = async () => {
      try {
        const result = await fetchConversationDetails(
          conversationId.toString(),
        );
        console.log("Conversation data:", JSON.stringify(result));
        setConversation(result);
      } catch (e) {
        console.error(e);
      }
    };

    load();
  }, []);

  // if (!conversation) {
  //   return (
  //     <View style={styles.pendingContainer}>
  //       <ActivityIndicator color={colors.mediumBlue} />
  //     </View>
  //   );
  // }

  return (
    <SafeAreaView style={styles.container}>
      {/* <Gradient toBottom gradient={gradients} /> */}
      {/* <ScrollView
        style={styles.container}
        // contentInsetAdjustmentBehavior="automatic"
      > */}
      {conversation?.status === "pending" && (
        <View style={styles.pendingContainer}>
          <View style={styles.details}>
            <View style={styles.buttonContainer}></View>
            <Text style={styles.headerText}>
              {" "}
              We are processing your call...
            </Text>
            <Text style={styles.text}> This may take a few minutes</Text>
          </View>
          <View style={[styles.buttonContainer, { marginVertical: 12 }]}>
            <ActivityIndicator color={colors.mediumBlue} />
            <Button onPress={fetchConversationDetails}>Refresh</Button>
            <Button gradientArray={theme?.gradient} onPress={saveAndContinue}>
              Save and Continue
            </Button>
          </View>
        </View>
      )}
      {conversation?.status === "failed" ? (
        <View style={[styles.pendingContainer, { rowGap: 10 }]}>
          <Pressable
            onPress={saveAndContinue}
            style={({ pressed }) => [styles.back, pressed && { opacity: 0.5 }]}
          >
            <Ionicons name="chevron-back" color="#000" size={20} />
            <Text style={styles.backText}>Go Back</Text>
          </Pressable>
          <MaterialIcons name="error" color={colors.lightBlue} size={24} />
          <Text style={styles.headerText}>There was an error</Text>
        </View>
      ) : (
        <>
          <ScrollView
            contentContainerStyle={[styles.container, { padding: 16 }]}
          >
            <View style={styles.details}>
              <View style={styles.buttonContainer}></View>
              <Text style={[styles.headerText, { fontSize: 28 }]}>
                {theme?.name}
              </Text>
              <Text style={styles.text}>{theme?.environment}</Text>
            </View>
            <Text style={[styles.headerText, { marginTop: 12 }]}>Details</Text>
            <View style={styles.conversationDetails}>
              <Text style={styles.text}>
                {conversation?.metadata?.call_duration_secs}
              </Text>
              <Text style={styles.text}>
                {
                  conversation?.conversation_initiation_client_data
                    ?.dynamic_variables?.system__time
                }
              </Text>
            </View>
            <View>
              <Text style={[styles.headerText, { marginBottom: 10 }]}>
                Transcript
              </Text>
              <Text style={[styles.text, { marginBottom: 18 }]}>
                {conversation?.analysis?.transcript_summary?.trim()}
              </Text>
            </View>
            <View style={styles.buttonContainer}>
              <Button
                style={{ marginVertical: 10 }}
                gradientArray={theme?.gradient}
                onPress={saveAndContinue}
              >
                Save and Continue
              </Button>
            </View>
          </ScrollView>
        </>
      )}
      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

export default SummaryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pendingContainer: {
    padding: 16,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  details: {
    rowGap: 12,
  },
  conversationDetails: {
    rowGap: 12,
    marginVertical: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  text: {
    fontSize: 18,
    fontWeight: "400",
    letterSpacing: 0.5,
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    rowGap: 12,
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
    color: "#000",
    fontSize: 17,
    fontWeight: "600",
  },
});
