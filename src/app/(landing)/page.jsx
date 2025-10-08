import PromptSection from './sections/PromptSection'
import CapabilitiesSection from './sections/capabilities'
import InspirationSection from './sections/InspirationSection'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <PromptSection />
        <CapabilitiesSection />
        <InspirationSection />
      </main>
    </div>
  )
}
