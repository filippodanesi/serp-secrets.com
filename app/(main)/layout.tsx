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
      <a href="#main-content" className="skip-to-content">Skip to content</a>
      <div className="container">
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}
