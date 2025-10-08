export default function SectionHeader() {
    return (
      <div className="text-center">
        <div className="inline-block">
          <div className="flex items-center gap-6 mb-2">
            <h2 className="text-3xl md:text-4xl font-bold">
              <span className="font-bold">visory</span>
              <span className="font-light ml-1.5">capabilities</span>
            </h2>
            <div className="hidden md:block w-0.5 h-12 bg-white"></div>
            <p className="hidden md:block text-gray-300 text-left max-w-md">
              Everything you need to create high-quality,
              <br />
              physically accurate videos in one place.
            </p>
          </div>
          <p className="md:hidden text-gray-300 text-center mt-4">
            Everything you need to create high-quality,
            <br />
            physically accurate videos in one place.
          </p>
        </div>
      </div>
    );
  }
  