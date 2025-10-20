import PromptSection from './sections/prompt'
import CapabilitiesSection from './sections/capabilities'
import InspirationSection from './sections/inspiration'
import CreativeGuideSection from './sections/CreativeGuideSection'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <PromptSection />
        <CapabilitiesSection />
        <InspirationSection />
        <CreativeGuideSection />
      </main>
    </div>
  )
}
