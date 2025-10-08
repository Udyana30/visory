export default function TextToSpeechLayout({ children }) {
    return (
      <div className="p-8">
        <header className="mb-2 ml-8">
          <h1 className="text-3xl font-bold text-gray-900">Text to Speech</h1>
          <p className="mt-2 text-md text-gray-600">
            Create realistic and natural-sounding voiceovers from your text using AI.
          </p>
        </header>
        <main>
          {children}
        </main>
      </div>
    );
  }
    