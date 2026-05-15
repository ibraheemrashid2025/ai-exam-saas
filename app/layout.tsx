import './globals.css' // <-- Ye line sab se upar honi chahiye

export const metadata = {
  title: 'AI Exam Generator',
  description: 'Professional AI Assessment Tool',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50">{children}</body>
    </html>
  )
}