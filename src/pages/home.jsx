import { useNavigate } from "react-router-dom"

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">
          Public Grievance Platform
        </h1>

        <p className="text-gray-600 mb-8 max-w-md">
          Raise issues. Support causes. Make noise where it matters.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700"
        >
          Get Started
        </button>
      </div>
    </div>
  )
}