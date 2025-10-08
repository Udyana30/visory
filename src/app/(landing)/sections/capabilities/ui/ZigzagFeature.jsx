import Image from "next/image";

export default function ZigzagFeature({ items }) {
  return (
    <div className="bg-[#3A3A3A] rounded-2xl p-10 md:p-12 lg:p-30 shadow-[0_8px_16px_rgba(0,0,0,0.3)]">
      <div className="max-w-6xl mx-auto space-y-16 md:space-y-20">
        {items.map((item, i) => {
          const isImageLeft = i % 2 === 0;
          return (
            <div
              key={i}
              className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12 lg:gap-16"
            >
              {isImageLeft ? (
                <>
                  <ImageBlock src={item.image} alt={item.title} />
                  <TextBlock title={item.title} description={item.description} />
                </>
              ) : (
                <>
                  <TextBlock title={item.title} description={item.description} />
                  <ImageBlock src={item.image} alt={item.title} />
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ImageBlock({ src, alt }) {
  return (
    <div className="w-full md:w-1/2">
      <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.4)] group cursor-pointer">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-2000 ease-out group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    </div>
  );
}

function TextBlock({ title, description }) {
  return (
    <div className="w-full md:w-1/2">
      <h3 className="text-2xl lg:text-3xl font-bold mb-3 text-white">
        {title}
      </h3>
      <p className="text-gray-300 text-base lg:text-lg leading-relaxed">
        {description}
      </p>
    </div>
  );
}
