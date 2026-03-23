import { useParams } from "react-router-dom"
import { useState } from "react"

export default function GrievanceDetail() {
  const { id } = useParams()

  // dummy data (later backend se aayega)
  const grievance = {
    id,
    title: "Garbage not collected",
    category: "Sanitation",
    location: "Sector 12, Delhi",
    description:
      "Garbage has been lying on the street for 3 days. Health risk increasing.",
    images: [
      "https://via.placeholder.com/300",
      "https://via.placeholder.com/300",
    ],
    tags: ["#sanitation", "#publicHealth"],
  }

  const [upvotes, setUpvotes] = useState(10)
  const [downvotes, setDownvotes] = useState(2)
  const [comments, setComments] = useState([
    "Same issue here",
    "Municipality is useless",
  ])
  const [newComment, setNewComment] = useState("")

  function addComment() {
    if (!newComment.trim()) return
    setComments(prev => [...prev, newComment])
    setNewComment("")
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow space-y-6">

      <h1 className="text-2xl font-bold">{grievance.title}</h1>

      <p className="text-gray-500">
        {grievance.category} • {grievance.location}
      </p>

      {/* Images */}
      <div className="flex gap-3 overflow-x-auto">
        {grievance.images.map((img, i) => (
          <img
            key={i}
            src={img}
            className="w-48 h-32 object-cover rounded"
          />
        ))}
      </div>

      {/* Description */}
      <p className="text-gray-700">{grievance.description}</p>

      {/* Tags */}
      <div className="flex gap-2 flex-wrap">
        {grievance.tags.map((tag, i) => (
          <span
            key={i}
            className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Votes */}
      <div className="flex gap-6">
        <button onClick={() => setUpvotes(upvotes + 1)}>👍 {upvotes}</button>
        <button onClick={() => setDownvotes(downvotes + 1)}>👎 {downvotes}</button>
      </div>

      {/* Comments */}
      <div className="space-y-3">
        <h2 className="font-semibold">Comments</h2>

        {comments.map((c, i) => (
          <div key={i} className="bg-gray-100 p-2 rounded text-sm">
            {c}
          </div>
        ))}

        <div className="flex gap-2">
          <input
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Add a comment"
            className="border px-2 py-1 rounded w-full"
          />
          <button
            onClick={addComment}
            className="bg-blue-600 text-white px-3 rounded"
          >
            Post
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4">
        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Donate
        </button>
        <button className="bg-purple-600 text-white px-4 py-2 rounded">
          Volunteer
        </button>
      </div>
    </div>
  )
}