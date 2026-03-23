import { Link } from "react-router-dom"
import { FaUserCircle } from "react-icons/fa"

export default function Navbar() {
  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      
      <h1 className="text-xl font-bold text-blue-600">PGP</h1>

      <div className="flex items-center gap-6">

        <Link to="/hero">
          <button className="text-gray-600 hover:text-blue-600">
            Home
          </button>
        </Link>

        <Link to="/grievances">
          <button className="text-gray-600 hover:text-blue-600">
            Grievances
          </button>
        </Link>

        {/* 👇 USER ICON */}
        <Link to="/complete-profile">
          <FaUserCircle className="text-2xl text-gray-600 hover:text-blue-600 cursor-pointer" />
        </Link>

      </div>
    </nav>
  )
}