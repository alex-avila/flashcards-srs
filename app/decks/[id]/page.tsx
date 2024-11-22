import { decks } from "@/db/placeholder"
export default async function ViewDeckPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id
  const deck = decks.find(deck => deck.id === id)
  // handle scenario in which deck isn't found based on id param
  return <div>View: {deck?.name}</div>
}
