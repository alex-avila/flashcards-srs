import Link from "next/link"
import { Button } from "@/app/components/ui/button"
import {
  Brain,
  Keyboard,
  Settings,
  Clock,
  BookOpen,
  Layers,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default async function LandingPage() {
  return (
    <div className="my-10">
      <div className="mb-12 text-center">
        <h2 className="mb-3 text-3xl font-bold">
          Learn Vocabulary with Smarter Flashcards
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Create decks of SRS-powered flashcards to learn vocabulary efficiently
          with a system that adapts to you
        </p>
        <div className="mt-6">
          <Button asChild size="lg" className="text-lg">
            <Link href="/signup">
              <div className="flex items-center gap-2">Start learning now</div>
            </Link>
          </Button>
        </div>
      </div>

      <section className="mb-16">
        <h3 className="sr-only">Features</h3>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              icon: Clock,
              title: "SRS",
              description:
                "Words appear just when you need to review them, reinforcing memory efficiently.",
            },
            {
              icon: Keyboard,
              title: "Type your answers",
              description:
                "No multiple-choice guessing. Recall and reinforce vocabulary.",
            },
            {
              icon: Settings,
              title: "Customization",
              description:
                "Create your own decks, flashcards, and control the settings to tailor study sessions to your needs.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="rounded-lg border border-muted px-6 py-5 shadow-md"
            >
              <div className="flex items-start gap-2">
                <h4 className="mb-2 text-xl font-medium">{feature.title}</h4>
                <feature.icon className="ml-auto h-5 w-5" />
              </div>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h3 className="mb-4 text-center text-2xl font-semibold">
          How it works
        </h3>
        <p className="mb-8 text-center text-muted-foreground">
          You may simply follow these steps after creating an account.
        </p>
        <div className="space-y-4">
          {[
            {
              icon: BookOpen,
              title: "Create a deck",
              description:
                "Build your own decks with flashcards with content you want to learn.",
              note: "All new accounts include a Demo deck with fast SRS timings to test how it works and three other fully functional decks for Japanese Hiragana, Japanese Katakana, and Korean Hangul Alphabet.",
            },
            {
              icon: Brain,
              title: "Study in short sessions",
              description:
                "Learn 5 cards at a time, so it never feels overwhelming",
              note: "By default you're limited to 3 lessons per day and each lesson consists of 5 flashcards. This can be customized through deck settings.",
            },
            {
              icon: Layers,
              title: "Smarter reviews with flashcard levels",
              description:
                "Flashcards reviews are spaced out for optimal retention based on the level of each flashcard.",
              note: (
                <>
                  Uses a spaced repetition system that aims to make cards
                  available for review right before you forget them. The SRS
                  timings increase as you level up each card (until a max
                  level). Levels increase or decrease based on correct or
                  incorrect answers. View the timings in the{" "}
                  <Link
                    className="underline"
                    href="https://github.com/alex-avila/flashcards-srs/blob/78719ede3c41caf5db3ba03c9c22c5056f4d3c20/app/lib/utils/srs.ts#L3-L12"
                  >
                    source code.
                  </Link>
                </>
              ),
            },
          ].map((step, index) => (
            <div
              key={index}
              className="flex items-start gap-5 rounded-lg bg-muted p-6 max-md:flex-col md:gap-6"
            >
              <div className="flex items-center gap-4">
                <step.icon className="h-12 w-12 flex-shrink-0 text-primary" />
                <h4 className="mb-2 text-xl font-medium md:hidden">
                  {step.title}
                </h4>
              </div>
              <Separator className="bg-muted-foreground/20 md:hidden" />
              <div className="max-w-3xl">
                <h4 className="mb-2 text-xl font-medium max-md:hidden">
                  {step.title}
                </h4>
                <p className="mb-2">{step.description}</p>
                <p className="text-sm text-muted-foreground">{step.note}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="text-center">
        <Button
          asChild
          size="lg"
          className="text-md underline md:text-lg"
          variant="link"
        >
          <Link href="/signup">
            <div className="flex items-center gap-2">
              Start building your vocabulary today
            </div>
          </Link>
        </Button>
      </div>
    </div>
  )
}
