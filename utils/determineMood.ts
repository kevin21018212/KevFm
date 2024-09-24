export const moodColors: { [key: string]: string } = {
  Hyped: "#FF5733", // Bright Red-Orange
  Clubbin: "#FFD700", // Gold
  Chillwave: "#48C9B0", // Teal
  Melancholic: "#34495E", // Dark Blue-Grey
  "Groovin'": "#FF33FF", // Hot Pink
  Blissful: "#F4D03F", // Soft Yellow
  "Vibin'": "#7DCEA0", // Light Green
  "Down Bad": "#2E4053", // Dark Slate
  "Fighting Demons": "#C0392B", // Deep Red
  "Trappin'": "#9B59B6", // Purple
  Chilling: "#3498DB", // Sky Blue
  Sassy: "#F39C12", // Bright Orange
  Petty: "#E74C3C", // Crimson
  "Dailed In": "#1ABC9C", // Bright Turquoise
  "White Woman": "#F7F9F9", // Off-white
  Neutral: "#BDC3C7", // Light Grey
};

const moodKeywords: { [mood: string]: string[] } = {
  Hyped: ["hype", "party", "rap trap", "bad bitch anthem", "kanye west"],
  Clubbin: ["pop", "dance", "electronic", "trap", "party", "dance electronic", "electropop"],
  Chillwave: ["dream pop", "psychedelic soul", "cloud rap", "vaportrap", "neo-soul", "synthpop"],
  Melancholic: [
    "melancholic",
    "jazz rap",
    "conscious hip hop",
    "abstract hip hop",
    "smooth",
    "detroit",
    "alternative hip hop",
  ],
  "Groovin'": ["funk", "g-funk", "soul", "house", "dance", "electronic", "alternative rnb"],
  Blissful: ["neo-soul", "rnb soul", "rythem and blues", "new jazz", "smooth soul", "in love", "art pop"],
  "Vibin'": ["chill", "ambient", "cloud rap", "experimental hip hop", "neo-soul", "kenyan"],
  "Down Bad": ["southern hip hop", "gangsta rap", "melancholic", "west coast hip hop", "underground hip hop"],
  "Fighting Demons": ["rap", "trap", "hip-hop", "rap trap", "aggressive", "gangsta rap"],
  "Trappin'": ["trap", "hip house", "rap", "southern hip hop", "detroit", "psychedelic", "hip hop"],
  Chilling: ["chill", "neo-soul", "jazz rap", "indie", "synthpop", "cloud rap", "vaportrap"],
  Sassy: ["sassy", "confident", "bold", "cheerful", "bad bitch anthem", "kenyan"],
  Petty: ["petty", "jealous", "resentful", "angry", "experimental hip hop", "abstract hip hop"],
  "Dailed In": ["rnb", "rap", "neutral", "various", "alternative hip hop", "cloud rap"],
  Neutral: ["neutral", "background", "instrumental", "ambient", "neo-soul", "alternative rnb"],
};

// Tags that are too broad should not count for much unless combined with others
const largeGenres = ["rap", "hip hop", "trap", "pop", "rnb", "hip-hop", "hiphop"];

/**
 * Determines the mood based on aggregated tag counts.
 * @param tagCounts - An object mapping tag names to their counts.
 * @returns The determined mood as a string.
 */
export const determineMood = (tagCounts: { [tag: string]: number }): string => {
  const moodScores: { [mood: string]: number } = {};

  Object.keys(moodKeywords).forEach((mood) => {
    moodScores[mood] = 0;

    moodKeywords[mood].forEach((keyword) => {
      // If the tag is from largeGenres, only count if it's combined with smaller tags
      if (tagCounts[keyword]) {
        if (largeGenres.includes(keyword)) {
          moodScores[mood] += tagCounts[keyword] * 0.1; // Reduce weight of large genres
        } else {
          moodScores[mood] += tagCounts[keyword]; // Full weight for niche tags
        }
      }
    });
  });

  // Determine the mood with the highest score
  let determinedMood = "Neutral";
  let maxScore = 0;

  Object.entries(moodScores).forEach(([mood, score]) => {
    if (score > maxScore) {
      maxScore = score;
      determinedMood = mood;
    }
  });

  return determinedMood;
};
