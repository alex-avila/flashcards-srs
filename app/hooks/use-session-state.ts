import { useReducer } from "react"

interface SessionStateState {
  phase: "interrogation" | "answered" | "finished"
  wasCorrect?: boolean
}

type SessionStateAction =
  | { type: "START_NEXT" }
  | { type: "ANSWER"; wasCorrect: boolean }
  | { type: "FINISH"; wasCorrect: boolean }

// reducer manages data that we use to determine the UI states in a centralized place
// and provides minimal abstraction via actions types to simplify the logic in the component
function sessionStateReducer(
  state: SessionStateState,
  action: SessionStateAction
): SessionStateState {
  const { type } = action

  switch (type) {
    case "START_NEXT": {
      return { phase: "interrogation" }
    }
    case "ANSWER": {
      return { phase: "answered", wasCorrect: action.wasCorrect }
    }
    case "FINISH": {
      return { phase: "finished", wasCorrect: action.wasCorrect }
    }
    default: {
      throw new Error(`Unknown action type ${type}`)
    }
  }
}

export function useSessionState() {
  const [state, dispatch] = useReducer(sessionStateReducer, {
    phase: "interrogation",
  })

  // helper variables
  const isAnswered = state.phase !== "interrogation"
  const isFinished = state.phase === "finished"

  return { state, dispatch, isAnswered, isFinished }
}
