import React from 'react'
import Link from "next/link";

export default function CreativeGuideSection() {
  const steps = [
    {
      title: 'Describe Your Idea',
      description: 'Start by typing a text prompt or uploading an image to generate the base of your video.'
    },
    {
      title: 'Choose a model',
      description: 'Select from Google Veo 3, Kling, Runway, Seedance, Wan AI, PixVerse, or MiniMax to generate a video adapted to your needs.'
    },
    {
      title: 'Generate and download',
      description: "Once you're happy with the result, download your AI-generated video."
    }
  ]

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-medium text-center mb-14 text-gray-900">
          How to be <span className="font-bold">creative</span> with <span className="font-bold">visory</span>
        </h2>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          {/* Image Column */}
          <div className="order-1">
            <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="/images/landing/be-creative.jpg" 
                alt="Vintage Sony film projector"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Steps Column */}
          <div className="order-1 md:order-2 space-y-10">
            {steps.map((step, index) => (
              <div key={index} className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900">
                  {step.title}
                </h3>
                <p className="text-xl text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
            <Link href="/login">
            <button className="px-10 py-4 text-lg font-semibold text-gray-900 bg-white border-2 border-gray-900 rounded-full hover:bg-gray-900 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl">
                Get Started Now!
            </button>
            </Link> 
        </div>
      </div>
    </section>
  )
}