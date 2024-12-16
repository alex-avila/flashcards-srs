// based on wanikani's system: https://knowledge.wanikani.com/wanikani/srs-stages/

const TIMINGS = [
  4 * 60 * 60 * 1000, // 4 hours
  8 * 60 * 60 * 1000, // 8 hours
  24 * 60 * 60 * 1000, // 1 day
  2 * 24 * 60 * 60 * 1000, // 2 days
  7 * 24 * 60 * 60 * 1000, // 1 week
  2 * 7 * 24 * 60 * 60 * 1000, // 2 weeks
  4 * 7 * 24 * 60 * 60 * 1000, // 1 month
  4 * 4 * 7 * 24 * 60 * 60 * 1000, // 4 months
]

const TIMINGS_DEMO = [
  30, // 30 seconds
  60, // 1 minute
  5 * 60, // 5 minutes
  ...TIMINGS,
]

export function calculateSrsLevel(
  currentLevel: number,
  incorrectCount: number
): number {
  const incorrectAdjustment = Math.ceil(incorrectCount / 2)
  const penaltyFactor = currentLevel >= 5 ? 2 : 1

  return Math.max(1, currentLevel + incorrectAdjustment * penaltyFactor)
}

export function getSrsTiming(level: number) {
  return TIMINGS[level]
}

// demo srs explanation:
// demo decks have cards that start at level -4 then switch to regular timings when they reach level 0
// level -4
// level -3 -> 30 seconds -> level -2
// level -2 -> 60 seconds -> level -1
// level -1 -> 5 minutes -> level 0
// regular cards
// level 0 (to level 1 immediately after learning)
// level 1 -> 4 hours -> level 2
// level 2 -> 8 hours -> level 3
// level 3 -> 1 day -> level 4
export function calculateSrsLevelDemo(
  currentLevel: number,
  incorrectCount: number
): number {
  if (currentLevel < 0) {
    return incorrectCount > 0
      ? Math.max(-3, currentLevel - 1)
      : currentLevel + 1
  }

  return calculateSrsLevel(currentLevel, incorrectCount)
}

export function getSrsTimingDemo(level: number) {
  return TIMINGS_DEMO[level]
}
