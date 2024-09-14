// utils/moodMapping.ts
export interface AudioFeatures {
  danceability: number;
  energy: number;
  valence: number;
}

export const determineMood = (features: AudioFeatures): string => {
  const { valence, danceability, energy } = features;

  // Pumped Up
  if (valence > 0.6 && danceability > 0.6 && energy > 0.6) {
    return "Pumped Up";
  }

  // Slutty
  if (valence > 0.6 && danceability > 0.6 && energy < 0.4) {
    return "Slutty";
  }

  // Blissful
  if (valence > 0.6 && danceability < 0.4 && energy < 0.4) {
    return "Blissful";
  }

  // Vibin
  if (valence > 0.4 && valence <= 0.6 && danceability > 0.4 && danceability <= 0.6 && energy > 0.4 && energy <= 0.6) {
    return "Vibin";
  }

  // Down Bad
  if (valence < 0.4 && danceability < 0.4 && energy < 0.4) {
    return "Down Bad";
  }

  // Fighting Demons
  if (valence < 0.4 && danceability > 0.6 && energy > 0.6) {
    return "Fighting Demons";
  }

  // Trappin'
  if (valence > 0.4 && valence <= 0.6 && danceability > 0.6 && energy > 0.6) {
    return "Trappin'";
  }

  // Chilling
  if (valence > 0.4 && valence <= 0.6 && danceability < 0.4 && energy < 0.4) {
    return "Chilling";
  }

  // In the Trenches
  if (valence < 0.4 && danceability > 0.4 && energy > 0.4) {
    return "In the Trenches";
  }

  // Sassy
  if (valence > 0.6 && valence <= 0.8 && danceability > 0.4 && danceability <= 0.6 && energy > 0.4 && energy <= 0.6) {
    return "Sassy";
  }

  // Petty
  if (valence < 0.4 && danceability > 0.6 && energy > 0.4 && energy <= 0.6) {
    return "Petty";
  }

  // Dailed In
  if (valence > 0.4 && valence <= 0.6 && danceability > 0.6 && energy > 0.4 && energy <= 0.6) {
    return "Dailed In";
  }

  // White Woman
  if (valence > 0.6 && valence <= 0.8 && danceability > 0.4 && danceability <= 0.6 && energy > 0.4 && energy <= 0.6) {
    return "White Woman";
  }

  // Default mood if no conditions are met
  return "Neutral";
};

export const moodColors: { [key: string]: string } = {
  "Pumped Up": "#ff5722",
  Slutty: "#e91e63",
  Blissful: "#4caf50",
  Vibin: "#9c27b0",
  "Down Bad": "#3f51b5",
  "Fighting Demons": "#f44336",
  "Trappin'": "#ff9800",
  Chilling: "#2196f3",
  "In the Trenches": "#00bcd4",
  Sassy: "#cddc39",
  Petty: "#795548",
  "Dailed In": "#607d8b",
  "White Woman": "#ffffff",
  Neutral: "#9e9e9e",
};
