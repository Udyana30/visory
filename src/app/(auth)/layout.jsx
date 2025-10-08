import Link from "next/link";

export default function AuthLayout({ children }) {
    return (
      <div className="min-h-screen flex bg-white relative overflow-hidden">
        <img
          src="/images/corner.png"
          alt="Brush Decoration Top"
          className="absolute top-[-40px] right-[-20px] w-40 md:w-70 lg:w-70 pointer-events-none select-none rotate-270"
        />
        <img
          src="/images/corner.png"
          alt="Brush Decoration Bottom"
          className="absolute bottom-[-20px] right-[-40px] w-40 md:w-70 lg:w-70 pointer-events-none select-none"
        />
  
        <div className="hidden lg:flex lg:w-1/2 relative h-screen p-6">
          <div className="relative w-full h-full rounded-br-[80px] overflow-hidden">
            <img
              src="/images/auth-bg.jpg"
              alt="Building sculpture"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 rounded-2xl"></div>
            <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">

                <Link href="/" className="hover:opacity-80 transition-opacity">
                <h1 className="text-4xl font-bold cursor-pointer">visory</h1>
                </Link>

                <h2 className="text-2xl font-medium leading-tight">
                Turn your words into<br />
                compelling visual stories<br />
                with the power of AI.
                </h2>

            </div>
          </div>
        </div>
  
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4">
          {children}
        </div>
      </div>
    );
  }
  