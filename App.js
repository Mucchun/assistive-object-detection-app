import React, { useRef, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Speech from "expo-speech";

const OBJECTS = [
  "bottle",
  "chair",
  "cup",
  "book",
  "laptop",
  "person",
  "table",
  "door",
  "cell phone",
];

export default function App() {
  const cameraRef = useRef(null);

  const [selectedObject, setSelectedObject] = useState("bottle");
  const [screen, setScreen] = useState("home");
  const [permission, requestPermission] = useCameraPermissions();
  const [lastResult, setLastResult] = useState("No scan yet.");

  const selectObject = (item) => {
    setSelectedObject(item);
    Speech.speak(`Selected ${item}`);
  };

  const startDetection = async () => {
    const result = await requestPermission();

    if (!result.granted) {
      Alert.alert(
        "Camera permission denied",
        "Please enable camera permission for Expo Go in iPhone Settings."
      );
      Speech.speak("Camera permission denied. Please enable camera access.");
      return;
    }

    Speech.speak(`Starting detection for ${selectedObject}`);
    setLastResult("Camera started. Press Scan Now.");
    setScreen("camera");
  };

  const stopDetection = () => {
    Speech.speak("Stopping detection");
    setScreen("home");
  };

  const fakeScan = async () => {
    try {
      if (!cameraRef.current) {
        setLastResult("Camera is not ready.");
        Speech.speak("Camera is not ready.");
        return;
      }

      setLastResult("Scanning image...");
      Speech.speak("Scanning");

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.5,
      });

      console.log("Photo captured:", photo.uri);

      const message = `${selectedObject} scan captured. Real object detection model will be added next.`;
      setLastResult(message);
      Speech.speak(message);
    } catch (error) {
      console.log("Photo error:", error);
      setLastResult("Could not scan. Try again.");
      Speech.speak("Could not scan. Try again.");
    }
  };

  const speakLeft = () => {
    const message = `${selectedObject} detected on your left. It is near.`;
    setLastResult(message);
    Speech.speak(message);
  };

  const speakAhead = () => {
    const message = `${selectedObject} detected ahead. It is near.`;
    setLastResult(message);
    Speech.speak(message);
  };

  const speakRight = () => {
    const message = `${selectedObject} detected on your right. It is near.`;
    setLastResult(message);
    Speech.speak(message);
  };

  if (screen === "camera") {
    return (
      <View style={styles.cameraContainer}>
        <CameraView ref={cameraRef} style={styles.camera} facing="back" />

        <View style={styles.overlay}>
          <Text style={styles.overlayTitle}>Finding: {selectedObject}</Text>

          <Text style={styles.overlayText}>{lastResult}</Text>

          <TouchableOpacity style={styles.scanButton} onPress={fakeScan}>
            <Text style={styles.buttonText}>Scan Now</Text>
          </TouchableOpacity>

          <View style={styles.row}>
            <TouchableOpacity style={styles.smallButton} onPress={speakLeft}>
              <Text style={styles.buttonText}>Left</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.smallButton} onPress={speakAhead}>
              <Text style={styles.buttonText}>Ahead</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.smallButton} onPress={speakRight}>
              <Text style={styles.buttonText}>Right</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.stopButton} onPress={stopDetection}>
            <Text style={styles.buttonText}>Stop Detection</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assistive Object Detection</Text>

      <Text style={styles.subtitle}>Select the object you want to find.</Text>

      <ScrollView contentContainerStyle={styles.objectList}>
        {OBJECTS.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.objectButton,
              selectedObject === item && styles.selectedObjectButton,
            ]}
            onPress={() => selectObject(item)}
          >
            <Text style={styles.objectButtonText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.startButton} onPress={startDetection}>
        <Text style={styles.startButtonText}>Start Detection</Text>
      </TouchableOpacity>

      <Text style={styles.selectedText}>Selected object: {selectedObject}</Text>

      <Text style={styles.permissionText}>
        Camera permission: {permission?.granted ? "Granted" : "Not granted"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111827",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 17,
    color: "#d1d5db",
    textAlign: "center",
    marginBottom: 24,
  },
  objectList: {
    alignItems: "center",
    paddingBottom: 20,
  },
  objectButton: {
    backgroundColor: "#374151",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginBottom: 10,
    minWidth: 190,
    alignItems: "center",
  },
  selectedObjectButton: {
    backgroundColor: "#2563eb",
  },
  objectButtonText: {
    color: "white",
    fontSize: 18,
    textTransform: "capitalize",
  },
  startButton: {
    backgroundColor: "#16a34a",
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginTop: 10,
  },
  startButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  selectedText: {
    color: "#d1d5db",
    marginTop: 20,
    fontSize: 16,
    textTransform: "capitalize",
  },
  permissionText: {
    color: "#9ca3af",
    marginTop: 10,
    fontSize: 14,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    bottom: 30,
    left: 16,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.75)",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
  },
  overlayTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textTransform: "capitalize",
  },
  overlayText: {
    color: "#d1d5db",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 16,
  },
  scanButton: {
    backgroundColor: "#16a34a",
    paddingVertical: 13,
    paddingHorizontal: 26,
    borderRadius: 10,
    marginBottom: 10,
    minWidth: 190,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  smallButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginHorizontal: 4,
  },
  stopButton: {
    backgroundColor: "#dc2626",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 10,
    minWidth: 190,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
});
