import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  useAnimatedValue,
  View,
} from "react-native";

interface GradientProps {
  gradient: readonly [string, string, string];
  isSpeaking?: boolean;
  isQuite?: boolean;
  isAuth?: boolean;
  toTop?: boolean;
  toBottom?: boolean;
}

const Gradient = ({
  gradient,
  isSpeaking = false,
  isQuite,
  isAuth,
  toTop,
  toBottom,
}: GradientProps) => {
  const { width, height } = Dimensions.get("window");
  const translateY = useAnimatedValue(0);
  const scale = useAnimatedValue(0);
  const scaleLoop = useAnimatedValue(1);

  const translateAnim = (
    easingFn: (value: number) => number,
    animation: string,
  ) => {
    Animated.timing(translateY, {
      toValue: 1,
      duration: isSpeaking ? 800 : 1200,
      easing: easingFn,
      useNativeDriver: true,
    }).start(() => {
      if (animation === "second" && isSpeaking) {
        scaleLoopAnim(Easing.linear);
      } else if (!isSpeaking && animation === "first") {
        scaleAnim(isAuth ? 1.2 : 2, Easing.linear, "none");
      }
    });
  };

  const scaleAnim = (
    scaleTo: number,
    easingFn: (value: number) => number,
    animation: string,
  ) => {
    Animated.timing(scale, {
      toValue: scaleTo,
      duration: 2000,
      easing: easingFn,
      useNativeDriver: true,
    }).start(() => {
      if (animation === "first" && isSpeaking) {
        translateAnim(Easing.inOut(Easing.ease), "second");
      }
    });
  };

  const scaleLoopAnim = (easingFn: (value: number) => number) => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleLoop, {
          toValue: 1.4,
          duration: 1000,
          easing: easingFn,
          useNativeDriver: true,
        }),
        Animated.timing(scaleLoop, {
          toValue: 1,
          duration: 1000,
          easing: easingFn,
          useNativeDriver: true,
        }),
      ]),
      {
        resetBeforeIteration: true,
      },
    );
    anim.start();
  };

  const startAnimations = () => {
    translateY.setValue(0);
    scale.setValue(0);
    scaleLoop.setValue(1);
    if (isSpeaking) {
      scaleAnim(1, Easing.linear, "first");
    } else {
      translateAnim(Easing.inOut(Easing.ease), "first");
    }
  };

  useEffect(() => {
    startAnimations();
  }, [isSpeaking]);

  const interpolateHeight = translateY.interpolate({
    inputRange: [0, 1],
    outputRange: isSpeaking
      ? [0, height - 100]
      : toBottom
        ? [height / 2, 0]
        : [height, 0],
  });

  const interpolateScale = scale.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2],
  });

  // const interpolateLoopScale = scale.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: [1, 1.3],
  // });

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View
        style={[
          styles.container,
          {
            transform: [
              { translateY: interpolateHeight },
              { scale: isSpeaking ? scaleLoop : interpolateScale },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={gradient}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[
            styles.gradient,
            {
              height: 150,
              width: 150,
              justifyContent: "center",
              filter: "blur(10px)",
              alignItems: "center",
            },
          ]}
        >
          <LinearGradient
            colors={gradient}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={[styles.gradient, { filter: "blur(9px)" }]}
          ></LinearGradient>
        </LinearGradient>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 160,
    width: 160,
    // filter: 'blur(18px)',
    alignSelf: "center",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  gradient: {
    height: 80,
    width: 80,
    borderRadius: 100,
  },
});

export default Gradient;
