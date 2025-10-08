import Image from "next/image";

export default function CapabilityCard({ title, description, image }) {
  return (
    <div className="bg-[#3A3A3A] rounded-2xl p-10 flex flex-col md:flex-row gap-8 items-center hover:transform transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-[0_8px_16px_rgba(0,0,0,0.3)]">
      <div className="relative w-full md:w-48 h-48 rounded-2xl overflow-hidden border-4 border-white/90 shadow-[0_0_10px_rgba(255,255,255,0.3)] flex-shrink-0">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 192px"
          className="object-cover"
        />
      </div>
      <div className="flex-1">
        <h3 className="text-2xl md:text-3xl font-bold mb-3">{title}</h3>
        <p className="text-gray-300 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
