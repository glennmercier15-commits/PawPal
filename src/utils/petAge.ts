export function getPetStage(totalDaysPlayed: number) {
  if (totalDaysPlayed < 3)  return { stage: 'baby',  label: '🐣 Baby',   scale: 0.6 };
  if (totalDaysPlayed < 10) return { stage: 'child', label: '🐥 Child',  scale: 0.8 };
  if (totalDaysPlayed < 21) return { stage: 'teen',  label: '🐦 Teen',   scale: 0.95};
  return                           { stage: 'adult', label: '🦋 Adult',  scale: 1.0 };
}
