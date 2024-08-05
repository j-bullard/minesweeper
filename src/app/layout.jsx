export const metadata = {
  title: 'Minesweeper',
  description: 'A classic minesweeper game built with React',
}

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  )
}
