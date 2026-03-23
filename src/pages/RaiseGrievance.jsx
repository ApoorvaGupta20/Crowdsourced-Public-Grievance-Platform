import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function RaiseGrievance() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: "",
    category: "Sanitation",
    location: "",
    description: "",
    image: null,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file,
      }))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!formData.title || !formData.description || !formData.location) {
      setError("Please fill in all required fields")
      return
    }

    setLoading(true)
    setError("")

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setError("Please login to raise a grievance")
        navigate('/login')
        return
      }

      const response = await fetch('http://localhost:5000/api/grievances', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          location: formData.location,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        navigate('/grievances')
      } else {
        setError(data.message || "Failed to submit grievance")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-md p-8">

        <h1 className="text-2xl font-bold mb-1">
          Raise a Grievance
        </h1>
        <p className="text-gray-500 mb-6">
          Report a public issue so others can support it.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Title */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">
              Grievance Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Garbage not collected for 3 days"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Category */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option>Sanitation</option>
              <option>Water</option>
              <option>Roads</option>
              <option>Noise</option>
              <option>Electricity</option>
            </select>
          </div>

          {/* Location */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Area / City"
              className="border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div>

          {/* Description */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Describe the issue in detail"
              className="border border-gray-300 rounded-lg px-3 py-2 resize-none"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">
              Upload Image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="border border-gray-300 rounded-lg px-3 py-2"
            />

            {formData.image && (
              <img
                src={URL.createObjectURL(formData.image)}
                alt="Preview"
                className="mt-3 h-32 w-auto rounded-lg border object-cover"
              />
            )}
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-3">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Grievance"}
          </button>

        </form>
      </div>
    </div>
  )
}