import bgImage from "./assets/bg.jpg"
import { MapPin } from "lucide-react"

export default function App() {
  return (
    <>
    {/*atasan*/}

      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-[1280px] h-[80px] bg-white shadow-md z-50 rounded-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <h1 
        className="text-2xl font-bold text-blue-600 cursor-pointer"
        >
        <a href="/">SmartWare</a>
          </h1>

        {/* Menu */}
        <nav className="hidden md:flex gap-6 text-gray-700 font-medium">
          <a href="#how-it-works" className="hover:text-blue-600">
            How it works
          </a>
          <a href="#find-storage" className="hover:text-blue-600">
            Find storage
          </a>
          <a href="#become-host" className="hover:text-blue-600">
            Become a host
          </a>
        </nav>

        {/* Tombol */}
        <div className="flex gap-4">
          <button className="px-4 py-2 text-gray-600 hover:text-blue-600">
            Log in
          </button>
          <button className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Sign up
          </button>
        </div>
      </div>
      </header>
      <div className="w-full">


      {/* Hero Section / backgrond awal */}
      
      <section
        className="h-screen w-full bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${bgImage})` }}
        >

        {/*text tengah*/}

        <div className="absolute top-[200px] left-1/2 -translate-x-1/2 max-w-[90ch] text-center">
        <h1 className="text-6xl font-extrabold font-serif text-white leading-tight">
          Parking & storage <br /> made friendly
        </h1>
        <p className="mt-7 font-reguler text-3xl font-roboto text-white">
          Enjoy savings. Cancel any month.
        </p>
      </div>
      
        {/* Search Box */}
        <div className="absolute top-[450px] left-1/2 -translate-x-1/2">
        <div className="flex items-center bg-white/70 backdrop-blur-md p-2 rounded-full shadow-lg w-[700px] h-[70px] max-w-full">
          {/* Icon */}
          <MapPin className="text-gray-500 ml-3" size={28} />

          <input
            type="text"
            placeholder="Enter address"
            className="flex-1 bg-transparent text-xl px-3 py-2 text-black-700 focus:outline-none"
          />
          <button className="flex items-center justify-center bg-blue-600 text-white font-semibold text-xl px-4 py-2 rounded-full hover:bg-blue-700 transition w-[150px] h-[57px]">
            Search
          </button>
        </div>
      </div>
      </section>

      {/* Content Section */}
      <section className="h-screen bg-blue-100 flex items-center justify-center">
        <h2 className="text-4xl font-bold text-gray-800">
          Konten setelah scroll 🚀
        </h2>
      </section>

      <section className="h-screen bg-white flex items-center justify-center">
        <p className="text-xl text-gray-600">Section ketiga di sini</p>
      </section>
      </div>
    </>
  )
}
