import { Inter } from 'next/font/google'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'
import ThemeRegistry from './components/ThemeRegistry'
import Navigation from './components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Speech Therapy Practice',
  description: 'AI-powered speech therapy practice application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <ThemeRegistry>
            <Navigation />
            <main>{children}</main>
          </ThemeRegistry>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
} 