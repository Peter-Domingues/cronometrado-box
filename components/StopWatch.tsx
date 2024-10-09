import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, Dimensions } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
} from "react-native-reanimated";
import { formatTime } from "@/helpers/timer.helper";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const Stopwatch = ({ loopDuration = 60 }) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  const radius = 80; // Circle radius
  const strokeWidth = 10;

  const circumference = 2 * Math.PI * radius;
  const progress = useSharedValue(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let interval: any;
    if (running) {
      interval = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
        progress.value = (elapsedTime % loopDuration) / loopDuration;
      }, 1000);
    } else if (!running && elapsedTime !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [running, elapsedTime, loopDuration]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  const startStopHandler = () => {
    setRunning((prevRunning) => !prevRunning);
  };

  const resetHandler = () => {
    setElapsedTime(0);
    progress.value = 0;
    setRunning(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.svgContainer}>
        <Svg
          width={(radius + strokeWidth) * 2}
          height={(radius + strokeWidth) * 2}
          viewBox={`0 0 ${(radius + strokeWidth) * 2} ${
            (radius + strokeWidth) * 2
          }`}
        >
          <Defs>
            <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#FFD700" stopOpacity="1" />
              <Stop offset="100%" stopColor="#FF4500" stopOpacity="1" />
            </LinearGradient>
          </Defs>

          <Circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="#e6e6e6"
            strokeWidth={strokeWidth}
            fill="none"
          />

          <AnimatedCircle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="url(#grad)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            animatedProps={animatedProps}
            strokeLinecap="round"
          />
        </Svg>

        <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button title={running ? "Stop" : "Start"} onPress={startStopHandler} />
        <Button title="Reset" onPress={resetHandler} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  svgContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    width: 200,
    height: 200,
  },
  timerText: {
    position: "absolute",
    fontSize: 40,
    color: "#FFD700",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    top: "42%",
    left: "0%",
    right: "0%",
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    width: 200,
  },
});

export default Stopwatch;
