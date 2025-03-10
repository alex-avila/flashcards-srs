import { Header } from "@/app/components/ui/header"
import { Footer } from "@/app/components/ui/footer"

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Header isLanding />
      <main className="flex-1 p-4">{children}</main>
      <Footer />
    </>
  )
}
