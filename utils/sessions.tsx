export type CianaTheme = {
  id: string;
  name: string;
  environment: string;
  mood: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  gradient: string[];
  image: any;
};

export const CIANA_THEMES: CianaTheme[] = [
  {
    id: "verdant-stillness",
    name: "Verdant Stillness",
    environment: "Forest",
    mood: "Grounding · Anxiety Relief",
    colors: {
      primary: "#1F3D2B",
      secondary: "#4F7C5A",
      accent: "#DDEEE3",
    },
    gradient: ["#1F3D2B", "#4F7C5A", "#DDEEE3"],
    image: require("../assets/images/themes/verdant-stillness.jpg"),
  },

  {
    id: "riverbreath",
    name: "Riverbreath",
    environment: "River",
    mood: "Release · Flow",
    colors: {
      primary: "#0F3D3E",
      secondary: "#2F8F9D",
      accent: "#E6F6F7",
    },
    gradient: ["#0F3D3E", "#2F8F9D", "#E6F6F7"],
    image: require("../assets/images/themes/riverbreath.jpg"),
  },

  {
    id: "dusk-horizon",
    name: "Dusk Horizon",
    environment: "Sunset Sky",
    mood: "Wind Down · Reflection",
    colors: {
      primary: "#1B1F3B",
      secondary: "#6D5DF6",
      accent: "#F1C6D3",
    },
    gradient: ["#1B1F3B", "#6D5DF6", "#F1C6D3"],
    image: require("../assets/images/themes/dusk-horizon.jpg"),
  },

  {
    id: "amber-silence",
    name: "Amber Silence",
    environment: "Candlelight",
    mood: "Focus · Introspection",
    colors: {
      primary: "#1A1A1A",
      secondary: "#C47A2C",
      accent: "#F5D7A1",
    },
    gradient: ["#1A1A1A", "#C47A2C", "#F5D7A1"],
    image: require("../assets/images/themes/amber-silence.jpg"),
  },

  {
    id: "moonwater",
    name: "Moonwater",
    environment: "Night Lake",
    mood: "Deep Rest · Sleep",
    colors: {
      primary: "#0B132B",
      secondary: "#8FAADC",
      accent: "#E8F0FF",
    },
    gradient: ["#0B132B", "#8FAADC", "#E8F0FF"],
    image: require("../assets/images/themes/moonwater.jpg"),
  },

  {
    id: "sand-and-breath",
    name: "Sand & Breath",
    environment: "Desert",
    mood: "Clarity · Breathwork",
    colors: {
      primary: "#D8B58A",
      secondary: "#C98C70",
      accent: "#F7EFE5",
    },
    gradient: ["#D8B58A", "#C98C70", "#F7EFE5"],
    image: require("../assets/images/themes/sand-and-breath.jpg"),
  },
];
