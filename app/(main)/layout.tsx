import { ThemeProvider } from '../components/ThemeProvider'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { PersonJsonLd, WebSiteJsonLd } from '../components/JsonLd'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider>
      <PersonJsonLd />
      <WebSiteJsonLd />
      <div className="container">
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}
