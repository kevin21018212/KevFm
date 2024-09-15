export interface AudioFeatures {
  danceability: number;
  energy: number;
  valence: number;
  genres: string[];
}

export const determineMood = (features: AudioFeatures): string => {
  const { valence, danceability, energy, genres } = features;

  const isHipHop = genres.some(
    (genre) => genre.toLowerCase().includes("hip hop") || genre.toLowerCase().includes("rap")
  );
  const isPop = genres.some((genre) => genre.toLowerCase().includes("pop"));
  const isRock = genres.some((genre) => genre.toLowerCase().includes("rock"));
  const isElectronic = genres.some(
    (genre) => genre.toLowerCase().includes("electronic") || genre.toLowerCase().includes("edm")
  );

  // Pumped Up
  if (valence > 0.6 && danceability > 0.6 && energy > 0.6) {
    return isHipHop ? "Hyped" : "Pumped Up";
  }

  // Chillwave (for electronic, relaxing genres)
  if (valence > 0.5 && danceability > 0.5 && energy < 0.5 && isElectronic) {
    return "Chillwave";
  }

  // Melancholic (low valence, high danceability, and low energy)
  if (valence < 0.4 && danceability > 0.6 && energy < 0.5) {
    return "Melancholic";
  }

  // Groovin'
  if (valence > 0.5 && danceability > 0.7 && energy > 0.5 && isPop) {
    return "Groovin'";
  }

  // Blissful
  if (valence > 0.5 && danceability < 0.5 && energy < 0.5) {
    return "Blissful";
  }

  // Vibin'
  if (valence > 0.4 && valence <= 0.7 && danceability > 0.4 && danceability <= 0.7 && energy > 0.4 && energy <= 0.7) {
    return isRock ? "Chilling" : "Vibin'";
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
  if (valence > 0.3 && valence <= 0.7 && danceability > 0.5 && energy > 0.5) {
    return "Trappin'";
  }

  // Chilling
  if (valence > 0.3 && valence <= 0.7 && danceability < 0.5 && energy < 0.5) {
    return "Chilling";
  }

  // Sassy
  if (valence > 0.5 && valence <= 0.8 && danceability > 0.4 && danceability <= 0.7 && energy > 0.3 && energy <= 0.7) {
    return "Sassy";
  }

  // Petty
  if (valence < 0.4 && danceability > 0.6 && energy > 0.4 && energy <= 0.7) {
    return "Petty";
  }

  // Dailed In
  if (valence > 0.4 && valence <= 0.7 && danceability > 0.5 && energy > 0.3 && energy <= 0.7) {
    return "Dailed In";
  }

  // White Woman
  if (valence > 0.5 && valence <= 0.8 && danceability > 0.4 && danceability <= 0.7 && energy > 0.3 && energy <= 0.7) {
    return "White Woman";
  }

  // Default fallback
  return "Neutral";
};
export const moodColors: { [key: string]: string } = {
  "Pumped Up": "#ff5722", // Deep Orange
  Slutty: "#e91e63", // Pink
  Blissful: "#4caf50", // Green
  Vibin: "#9c27b0", // Purple
  "Down Bad": "#3f51b5", // Indigo
  "Fighting Demons": "#f44336", // Red
  "Trappin'": "#ff9800", // Orange
  Chilling: "#2196f3", // Blue
  "In the Trenches": "#00bcd4", // Cyan
  Sassy: "#cddc39", // Lime
  Petty: "#795548", // Brown
  "Dailed In": "#607d8b", // Blue Grey
  "White Woman": "#ffffff", // White
  Neutral: "#9e9e9e", // Grey
  Hyped: "#ff4500", // Orange-Red
  Chillwave: "#40e0d0", // Turquoise
  Melancholic: "#8b0000", // Dark Red
  Groovin: "#ff69b4", // Hot Pink
};
