import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function CompleteProfile() {
  const navigate = useNavigate()

  const [profile, setProfile] = useState({
    name: "",
    username: "",
    email: "",
    gender: "",
    bio: "",
    avatar: "",
  })

  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // 🧠 Load existing user data (if any)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token")

        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await res.json()

        if (res.ok) {
          setProfile({
            name: data.name || "",
            username: data.username || "",
            email: data.email || "",
            gender: data.gender || "",
            bio: data.bio || "",
            avatar: data.avatar || "",
          })
        }
      } catch (err) {
        console.log("Fetch profile error", err)
      }
    }

    fetchProfile()
  }, [])

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    setLoading(true)
    setError("")

    try {
      const token = localStorage.getItem("token")

      const res = await fetch("http://localhost:5000/api/auth/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      })

      const data = await res.json()

      if (res.ok) {
        setEditing(false)
      } else {
        setError(data.message || "Something went wrong")
      }

    } catch (err) {
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow w-full max-w-md">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Your Profile
        </h2>

        {/* Avatar */}
        <div className="flex justify-center mb-4">
          <img
            src={
              profile.avatar ||
              "https://via.placeholder.com/100"
            }
            alt="avatar"
            className="w-24 h-24 rounded-full object-cover border"
          />
        </div>

        {/* Inputs */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={profile.name}
          onChange={handleChange}
          disabled={!editing}
          className="w-full border px-4 py-2 rounded mb-3"
        />

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={profile.username}
          onChange={handleChange}
          disabled={!editing}
          className="w-full border px-4 py-2 rounded mb-3"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={profile.email}
          onChange={handleChange}
          disabled={!editing}
          className="w-full border px-4 py-2 rounded mb-3"
        />

        <select
          name="gender"
          value={profile.gender}
          onChange={handleChange}
          disabled={!editing}
          className="w-full border px-4 py-2 rounded mb-3"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <textarea
          name="bio"
          placeholder="About you..."
          value={profile.bio}
          onChange={handleChange}
          disabled={!editing}
          className="w-full border px-4 py-2 rounded mb-3"
        />

        <input
          type="text"
          name="avatar"
          placeholder="Profile Image URL"
          value={profile.avatar}
          onChange={handleChange}
          disabled={!editing}
          className="w-full border px-4 py-2 rounded mb-3"
        />

        {error && (
          <p className="text-red-500 text-sm text-center mb-3">
            {error}
          </p>
        )}

        {/* Buttons */}
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            Edit Profile
          </button>
        ) : (
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        )}

      </div>
    </div>
  )
}