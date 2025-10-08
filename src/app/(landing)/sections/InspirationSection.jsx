export default function InspirationSection() {
    const inspirationItems = [
      {
        id: 1,
        image: "🏙️",
        title: "Urban Landscapes",
        category: "Architecture"
      },
      {
        id: 2,
        image: "🐶",
        title: "Pet Stories",
        category: "Lifestyle"
      },
      {
        id: 3,
        image: "🏡",
        title: "Real Estate",
        category: "Property"
      },
      {
        id: 4,
        image: "👤",
        title: "Portrait Stories",
        category: "People"
      },
      {
        id: 5,
        image: "🔥",
        title: "Action Scenes",
        category: "Dynamic"
      },
      {
        id: 6,
        image: "👨‍💼",
        title: "Business Content",
        category: "Professional"
      },
      {
        id: 7,
        image: "☕",
        title: "Product Showcase",
        category: "Commercial"
      },
      {
        id: 8,
        image: "🚗",
        title: "Automotive",
        category: "Vehicles"
      }
    ];
  
    const steps = [
      {
        title: "Describe Your Vision",
        description: "Simply type what you want to create or upload an image. Let your creativity guide you."
      },
      {
        title: "Choose a model",
        description: "Select from Google Veo 2, Kling, Runway, Luma, or Pika Labs. Each offers unique capabilities tailored to your specific video needs."
      },
      {
        title: "Generate and download",
        description: "Once you're happy with the result, download your AI-generated video."
      }
    ];
  
    return (
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Inspiration Showcase
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get a glimpse of the stunning visual stories you can create in minutes.
            </p>
          </div>
  
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
            {inspirationItems.map((item) => (
              <div key={item.id} className="group cursor-pointer">
                <div className="aspect-square bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg overflow-hidden mb-3 hover:scale-105 transition-transform duration-300">
                  <div className="w-full h-full flex items-center justify-center text-4xl md:text-6xl">
                    {item.image}
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.category}</p>
                </div>
              </div>
            ))}
          </div>
  
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How to be creative with visory
              </h2>
            </div>
  
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-6">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
  
            <div className="text-center mt-12">
              <button className="bg-gray-900 text-white px-8 py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors">
                Get Started Now!
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }