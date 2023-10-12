import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Rick and Morty',
  description: 'Pesquisa dos personagens da série Rick And Morty',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <head>
        <title>Rick and Morty</title>
        <link rel="icon" href="/images/logo.jpeg" sizes="64x64" type="image/png"></link>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
