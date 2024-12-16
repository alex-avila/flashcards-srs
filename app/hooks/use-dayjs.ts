import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

export function useDayjs() {
  dayjs.extend(relativeTime)

  return dayjs
}
