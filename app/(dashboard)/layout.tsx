import Header from "@/app/components/ui/header"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Header />
      <main className="p-4">{children}</main>
    </>
  )
}
