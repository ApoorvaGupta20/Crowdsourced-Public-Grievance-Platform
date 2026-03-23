import { useState, useEffect } from "react"
import GrievanceCard from "../components/GrievanceCard"
import { jwtDecode } from "jwt-decode"

export default function ViewGrievances() {
  const [activeTab, setActiveTab] = useState("your")
  const [grievances, setGrievances] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const token = localStorage.getItem("token")
  let userId = null

  try {
    if (token) {
      const decoded = jwtDecode(token)
      userId = decoded.id
    }
  } catch (err) {
    console.error("Invalid token")
  }

  useEffect(() => {
    fetchGrievances()
  }, [])

  const fetchGrievances = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("http://localhost:5000/api/grievances")
      const data = await response.json()

      if (response.ok) {
        setGrievances(data)
      } else {
        setError("Failed to load grievances")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (grievanceId) => {
    try {
      if (!token) {
        setError("Please login to vote")
        return
      }

      const response = await fetch(
        `http://localhost:5000/api/grievances/${grievanceId}/vote`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.ok) {
        fetchGrievances()
      } else {
        const data = await response.json()
        setError(data.message || "Failed to vote")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    }
  }

  // 🔥 NEW: HANDLE STATUS CHANGE
  const handleStatusChange = async (grievanceId, newStatus) => {
    try {
      if (!token) {
        setError("Please login")
        return
      }

      const response = await fetch(
        `http://localhost:5000/api/grievances/${grievanceId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      )

      if (response.ok) {
        fetchGrievances()
      } else {
        const data = await response.json()
        setError(data.message || "Failed to update status")
      }
    } catch (error) {
      setError("Network error while updating status")
    }
  }

  // 🔹 FILTER LOGIC
  const yourGrievances = grievances.filter(
    (g) => g.user === userId || g.user?._id === userId
  )

  const forYouGrievances = grievances.filter(
    (g) => g.user !== userId && g.user?._id !== userId
  )

  const displayedGrievances =
    activeTab === "your" ? yourGrievances : forYouGrievances

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">View Grievances</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("your")}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === "your"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Your Grievances
        </button>

        <button
          onClick={() => setActiveTab("foryou")}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === "foryou"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          For You
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Content */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading grievances...</p>
          </div>
        ) : displayedGrievances.length ? (
          displayedGrievances.map((grievance) => (
            <GrievanceCard
              key={grievance._id}
              grievance={grievance}
              onVote={handleVote}
              userId={userId}
              onStatusChange={handleStatusChange} // ✅ FIXED NAME
              onEdit={(id) => console.log("Edit", id)}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">
            No grievances found.
          </p>
        )}
      </div>
    </div>
  )
}