import Header from "@/components/ui/header"
import Decks from "@/components/ui/decks"

export default function Dashboard() {
  return (
    <div>
      <Header />
      <div className="p-4">
        <Decks />
      </div>
    </div>
  )
}
