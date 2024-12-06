import { useReducer } from "react"
import { Card } from "@/app/db/schema"

interface CardActionsState {
  card?: Card
  mode: "create" | "view" | "edit" | "delete" | "idle"
}

type CardAction =
  | { type: "START_CREATE" }
  | { type: "VIEW"; card: Card }
  | { type: "START_EDIT"; card: Card }
  | { type: "DELETE"; card: Card }
  | { type: "RESET" }

function reducer(
  state: CardActionsState,
  action: CardAction
): CardActionsState {
  switch (action.type) {
    case "START_CREATE": {
      return { mode: "create" }
    }
    case "VIEW": {
      if (!action.card) {
        throw new Error(`card is required for ${action.type} action`)
      }
      return {
        mode: "view",
        card: action.card,
      }
    }
    case "START_EDIT": {
      if (!action.card) {
        throw new Error(`card is required for ${action.type} action`)
      }
      return {
        mode: "edit",
        card: action.card,
      }
    }
    case "DELETE": {
      if (!action.card) {
        throw new Error(`card is required for ${action.type} action`)
      }
      return {
        mode: "delete",
        card: action.card,
      }
    }
    case "RESET":
    default: {
      return { mode: "idle" }
    }
  }
}

export const useCardActions = (initialState: CardActionsState) =>
  useReducer(reducer, initialState)
