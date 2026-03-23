import { Link } from "react-router-dom"

export default function GrievanceCard({
  grievance,
  onVote,
  userId,
  onStatusChange,
  onEdit
}) {
  const {
    _id,
    title,
    category,
    location,
    description,
    votes = [],
    user,
    createdAt,
    status = "Open"
  } = grievance

  // 🔹 Check if current user owns this grievance
  const isOwner = user === userId || user?._id === userId

  const handleVote = () => {
    if (onVote) onVote(_id)
  }

  const handleStatusChange = (e) => {
    if (onStatusChange) {
      onStatusChange(_id, e.target.value)
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-3">
      
      {/* 🔹 Title + Status */}
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold">{title}</h3>

        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            status === "open"
              ? "bg-red-100 text-red-600"
              : status === "in-progress"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-green-100 text-green-600"
          }`}
        >
          {status}
        </span>
      </div>

      {/* 🔹 Category + Location */}
      <p className="text-sm text-gray-500">
        {category} • {location}
      </p>

      {/* 🔹 Description */}
      <p className="text-gray-700 text-sm line-clamp-2">
        {description}
      </p>

      {/* 🔹 Actions */}
      <div className="flex items-center justify-between">
        
        {/* Vote */}
        <button
          onClick={handleVote}
          className="flex items-center gap-1 text-gray-600 hover:text-blue-600"
        >
          👍 {votes.length}
        </button>

        {/* User */}
        <div className="text-xs text-gray-500">
          {user?.phone && `By ${user.phone}`}
        </div>
      </div>

      {/* 🔹 Owner Controls */}
      {isOwner && (
        <div className="flex items-center gap-3 mt-2">

          {/* Edit */}
          <button
            onClick={() => onEdit && onEdit(_id)}
            className="text-blue-600 text-sm hover:underline"
          >
            Edit
          </button>

          {/* Status Change */}
          <select
            value={status}
            onChange={handleStatusChange}
            className="border px-2 py-1 text-sm rounded"
          >
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      )}

      {/* 🔹 View Details */}
      <Link
        to={`/grievances/${_id}`}
        className="text-blue-600 text-sm inline-block hover:underline"
      >
        View Details →
      </Link>
    </div>
  )
}