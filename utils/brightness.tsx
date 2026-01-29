import * as Brightness from "expo-brightness";

export const brightnessPermission = async () => {
  const { status } = await Brightness.requestPermissionsAsync();
  if (status === "granted") {
    return true;
  } else {
    return false;
  }
};
