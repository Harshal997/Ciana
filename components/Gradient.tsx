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
import { colors } from "./constants/colors";

interface GradientProps {
  isSpeaking?: boolean;
  isQuite?: boolean;
  toTop?: boolean;
  toBottom?: boolean;
}

const Gradient = ({
  isSpeaking = false,
  isQuite,
  toTop,
  toBottom,
}: GradientProps) => {
  const { width, height } = Dimensions.get("window");
  const translateY = useAnimatedValue(0);
  const scale = useAnimatedValue(0);
  const scaleLoop = useAnimatedValue(1);

  const translateAnim = (easingFn: (value: number) => number) => {
    Animated.timing(translateY, {
      toValue: 1,
      duration: 1200,
      easing: easingFn,
      useNativeDriver: true,
    }).start(() => {
      if(isSpeaking) {
        scaleLoopAnim(Easing.linear);
      } else {
        scaleAnim(Easing.inOut(Easing.ease));
      }
    });
  };

  const scaleAnim = (easingFn: (value: number) => number) => {
    Animated.timing(scale, {
      toValue: 1.8,
      duration: 2000,
      easing: easingFn,
      useNativeDriver: true,
    }).start();
  };

  const scaleLoopAnim = (easingFn: (value: number) => number) => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleLoop, {
          toValue: 1.8,
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
      }
    );
    anim.start();
  };

  const startAnimations = () => {
    translateAnim(Easing.ease);
    if (isSpeaking) {
      // scaleLoopAnim(Easing.ease);
      // return;
    }
    // scaleAnim(Easing.inOut(Easing.ease));
  };

  useEffect(() => {
    startAnimations();
  }, []);

  const interpolateHeight = translateY.interpolate({
    inputRange: [0, 1],
    outputRange: isSpeaking ? [height / 2, height-100] : [height / 2, 0],
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
          colors={[colors.teal, colors.lightBlue]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[
            styles.gradient,
            {
              height: 120,
              width: 120,
              justifyContent: "center",
              filter: "blur(11px)",
              alignItems: "center",
            },
          ]}
        >
          <LinearGradient
            colors={[colors.mediumBlue, colors.teal]}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.gradient,
            ]}
          ></LinearGradient>
        </LinearGradient>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100,
    width: 100,
    // filter: 'blur(18px)',
    alignSelf: "center",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  gradient: {
    height: 65,
    width: 65,
    borderRadius: 100,
  },
});

export default Gradient;
