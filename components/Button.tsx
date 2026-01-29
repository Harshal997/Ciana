import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "./constants/colors";

const Button = ({
  children,
  onPress,
  gradientArray = [colors.mediumBlue, colors.teal, colors.lightBlue],
}: any) => {
  return (
    <Pressable
      style={({ pressed }) => [
        // styles.button,
        // { backgroundColor: colors.lightBlue },
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <LinearGradient
        style={styles.button}
        colors={gradientArray}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        {typeof children === "string" ? (
          <Text style={styles.text}>{children}</Text>
        ) : (
          children
        )}
      </LinearGradient>
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 18,
    minWidth: 90,
    paddingVertical: 4,
    borderRadius: 3,
    marginBottom: 12,
  },
  text: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  pressed: {
    opacity: 0.75,
  },
});
