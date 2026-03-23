import { Link } from "react-router-dom"

export default function Hero() {
  return (
    <section className="bg-white rounded-lg shadow p-8 mt-8">
      <h2 className="text-3xl font-bold mb-4">
        Public Grievance Platform
      </h2>

      <p className="text-gray-600 mb-6">
        Raise issues that matter. Vote on public concerns.
      </p>

      <div className="flex gap-4 flex-wrap">
        <Link
          to="/raise"
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          Raise a Grievance
        </Link>

        <Link
          to="/grievances"
          className="bg-gray-200 text-gray-800 px-5 py-2 rounded hover:bg-gray-300"
        >
          View Grievances
        </Link>

      </div>
    </section>
  )
}