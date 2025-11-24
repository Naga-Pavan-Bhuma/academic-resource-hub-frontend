export const LEVELS = [
  { key: "starter", name: "Starter", threshold: 0, color: "gray" },
  { key: "bronze", name: "Bronze", threshold: 200, color: "amber" },
  { key: "silver", name: "Silver", threshold: 500, color: "gray-300" },
  { key: "gold", name: "Gold", threshold: 1000, color: "yellow-400" },
  { key: "legend", name: "Legend", threshold: 2500, color: "purple-500" },
];

export const getCurrentLevel = (points) => {
  let level = LEVELS[0];
  for (const l of LEVELS) {
    if (points >= l.threshold) level = l;
  }
  return level;
};

export const getNextLevel = (points) => {
  const index = LEVELS.findIndex((l) => points < l.threshold);
  return LEVELS[index] || null;
};
