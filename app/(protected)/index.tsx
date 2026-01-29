import Button from "@/components/Button";
import { supabase } from "@/lib/supabase";
import { CIANA_THEMES, CianaTheme } from "@/utils/sessions";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Animated,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const Sessions = () => {
  const router = useRouter();
  const [prevSessions, setPrevSessions] = useState<any>();
  const todaysIndex = Math.floor(Math.random() * CIANA_THEMES.length);
  console.log("todaySIndex", todaysIndex);
  const [todaysTheme, setTodaysTheme] = useState(
    CIANA_THEMES.at(todaysIndex) ?? CIANA_THEMES[0],
  );
  const [themes, setThemes] = useState(
    CIANA_THEMES.filter((t: CianaTheme) => t.id !== todaysTheme?.id),
  );

  const connectToSupabase = async () => {
    await supabase
      .from("sessions")
      .select("*")
      .then((res) => {
        console.log("supabase connected", res);
        setPrevSessions(res.data);
      });
  };

  useEffect(() => {
    connectToSupabase();
  }, []);

  const handlePress = (theme: CianaTheme) => {
    router.navigate({
      pathname: "/Sessions",
      params: { themeId: theme.id },
    });
  };

  return (
    <Animated.ScrollView style={styles.container}>
      <Animated.View>
        <ImageBackground
          source={todaysTheme?.image}
          alt="serene image"
          style={styles.todaysImage}
        >
          <View style={styles.todaysThemeContainer}>
            <Text style={styles.todaysThemeText}>Featured Session</Text>
            <Text
              style={[
                styles.todaysThemeText,
                { fontWeight: "600", fontSize: 32 },
              ]}
            >
              {todaysTheme?.name}
            </Text>
            <Text style={styles.todaysThemeText}>
              {todaysTheme?.environment}
            </Text>
            <Button onPress={() => handlePress(todaysTheme)}>
              Start Session
            </Button>
          </View>
        </ImageBackground>
      </Animated.View>
      <Text style={styles.headingText}>Explore Sessions</Text>
      <ScrollView
        contentContainerStyle={styles.themeContainer}
        horizontal
        contentInsetAdjustmentBehavior="automatic"
      >
        {themes.map((theme: CianaTheme) => {
          return (
            <Pressable key={theme.id} onPress={() => handlePress(theme)}>
              <ImageBackground
                borderRadius={16}
                style={styles.theme}
                source={theme.image}
              >
                <View style={styles.themeButton}>
                  <Text style={styles.todaysThemeText}>{theme.name}</Text>
                </View>
              </ImageBackground>
            </Pressable>
          );
        })}
      </ScrollView>
      <Text style={styles.headingText}>Recent Sessions</Text>
      <ScrollView
        contentContainerStyle={styles.themeContainer}
        contentInsetAdjustmentBehavior="automatic"
      >
        {prevSessions &&
          prevSessions.length > 0 &&
          prevSessions.map((theme: CianaTheme) => {
            console.log("the theme is", theme);
            const currentTheme = CIANA_THEMES.find(
              (ct) => ct.id === theme.theme_id,
            );
            return (
              <Pressable
                style={styles.recentTheme}
                key={theme.id}
                // onPress={() => handlePress(theme)}
              >
                <ImageBackground
                  borderRadius={16}
                  style={styles.recentTheme}
                  alt="image"
                  source={currentTheme!.image ?? CIANA_THEMES[0].image}
                >
                  <View style={styles.themeButton}>
                    <Text style={[styles.todaysThemeText, { fontSize: 20 }]}>
                      {theme.name}
                    </Text>
                  </View>
                </ImageBackground>
              </Pressable>
            );
          })}
      </ScrollView>
    </Animated.ScrollView>
  );
};

export default Sessions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  themeButton: {
    paddingBottom: 16,
    overflow: "hidden",
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    experimental_backgroundImage:
      "linear-gradient(to bottom, rgba(0,0,0,0.3), rgb(0, 0, 0, 0.6))",
    borderRadius: 16,
  },
  todaysImage: {
    height: 400,
    width: "100%",
  },
  themeContainer: {
    padding: 16,
    columnGap: 8,
    rowGap: 12,
  },
  todaysThemeContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    rowGap: 12,
    experimental_backgroundImage:
      "linear-gradient(to bottom, rgba(0,0,0,0.3), rgb(0, 0, 0, 0.6))",
  },
  todaysThemeText: {
    fontSize: 16,
    color: "#FFF",
    textAlign: "center",
    fontWeight: "600",
  },
  headingText: {
    padding: 16,
    fontWeight: "600",
    fontSize: 24,
  },
  theme: {
    overflow: "hidden",
    height: 120,
    width: 160,
  },
  recentTheme: {
    overflow: "hidden",
    height: 160,
    width: "100%",
  },
});
