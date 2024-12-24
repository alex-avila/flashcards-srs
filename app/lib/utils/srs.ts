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

// when a card gets to level 4, no new timing will be found and that will be considered a retired card
const TIMINGS_DEMO = [
  30 * 1000, // 30 seconds
  60 * 1000, // 1 minute
  5 * 60 * 1000, // 5 minutes
]

function srsTimingTypeToTiming(srsTimingType: string) {
  if (srsTimingType === "demo") {
    return TIMINGS_DEMO
  }

  return TIMINGS
}

export function getMaxSrsLevel(srsTimingType: string) {
  return srsTimingTypeToTiming(srsTimingType).length + 1
}

export function calculateSrsLevel(
  currentLevel: number,
  incorrectCount: number
): number {
  const incorrectAdjustment = Math.ceil(incorrectCount / 2)
  const penaltyFactor = currentLevel >= 5 ? 2 : 1

  return Math.max(1, currentLevel + 1 - incorrectAdjustment * penaltyFactor)
}

export function getSrsTimingIfNotMax(
  srsTimingsType: string,
  newLevel: number
): number | false {
  const timings = srsTimingTypeToTiming(srsTimingsType)
  const foundTiming = timings[newLevel - 1]

  return foundTiming || false
}

export function calculateSrs(
  srsTimingsType: string,
  currentLevel: number,
  incorrectCount: number
) {
  const srsLevel = calculateSrsLevel(currentLevel, incorrectCount)
  const srsTiming = getSrsTimingIfNotMax(srsTimingsType, srsLevel)

  return { srsLevel, srsTiming, isMax: !srsTiming }
}
