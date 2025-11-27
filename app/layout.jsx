export const metadata = {
  title: 'React Hello World',
  description: 'A simple React.js hello world application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}




