import Roadmap from '@/components/landing/roadmap'
import Header from '@/components/landing/header'
import Banner from '@/components/landing/banner'
import Footer from '@/components/landing/footer'
import About from '@/components/landing/about'
import Hero from '@/components/landing/hero'

export default function Home() {
  return (
    <div className='bg-minimal min-h-screen'>
      <Header />
      <main>
        <Hero />
        <About />
        <Banner />
        <Roadmap />
      </main>
      <Footer />
    </div>
  )
} 