'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

const tagsList = [
  'Tough Grader', 'Get Ready To Read', 'Participation Matters', 'Extra Credit',
  'Group Projects', 'Amazing Lectures', 'Clear Grading Criteria', 'Gives Good Feedback',
  'Inspirational', 'Lots Of Homework', 'Hilarious', 'Beware Of Pop Quizzes',
  'So Many Papers', 'Caring', 'Respected', 'Lecture Heavy', 'Test Heavy',
  'Graded By Few Things', 'Accessible Outside Class', 'Online Savvy',
]

export default function ReviewForm() {
  const { id } = useParams()
  const router = useRouter()

  const [formData, setFormData] = useState({
    courseCode: '',
    rating: 5,
    difficulty: 3,
    takeAgain: '',
    forCredit: '',
    usedTextbook: '',
    attendance: '',
    grade: '',
    tags: [] as string[],
    comment: '',
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTagToggle = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch(`/api/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, taId: Number(id) }),
    })
  
    if (res.ok) {
      setSubmitted(true)
      setFormData({
        courseCode: '',
        rating: 5,
        difficulty: 3,
        takeAgain: '',
        forCredit: '',
        usedTextbook: '',
        attendance: '',
        grade: '',
        tags: [],
        comment: '',
      })
  
      // ✅ Redirect after a brief delay
      setTimeout(() => {
        router.push(`/tas/${id}`)
      }, 1500) // 1.5s delay to let user see confirmation
    }
  }
  

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow space-y-6">

      <select name="courseCode" value={formData.courseCode} onChange={handleChange} required className="w-full p-2 border rounded">
        <option value="">Select Course Code</option>
        <option value="CS101">CS101</option>
        <option value="MATH221">MATH221</option>
        <option value="ENG200">ENG200</option>
      </select>

      <label>
        Rating (1 = Awful, 5 = Awesome)
        <input type="number" name="rating" min={1} max={5} value={formData.rating} onChange={handleChange} className="w-full border p-2 rounded" />
      </label>

      <label>
        Difficulty (1 = Easy, 5 = Hard)
        <input type="number" name="difficulty" min={1} max={5} value={formData.difficulty} onChange={handleChange} className="w-full border p-2 rounded" />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label>Take Again?
          <select name="takeAgain" value={formData.takeAgain} onChange={handleChange} required className="w-full p-2 border rounded">
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>

        <label>For Credit?
          <select name="forCredit" value={formData.forCredit} onChange={handleChange} required className="w-full p-2 border rounded">
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>

        <label>Used Textbook?
          <select name="usedTextbook" value={formData.usedTextbook} onChange={handleChange} required className="w-full p-2 border rounded">
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>

        <label>Attendance?
          <select name="attendance" value={formData.attendance} onChange={handleChange} required className="w-full p-2 border rounded">
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>
      </div>

      <label>
        Grade
        <select name="grade" value={formData.grade} onChange={handleChange} required className="w-full p-2 border rounded">
          <option value="">Select grade</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
          <option value="F">F</option>
        </select>
      </label>

      <div>
        <p className="font-semibold mb-2">Select up to 3 tags:</p>
        <div className="flex flex-wrap gap-2">
          {tagsList.map(tag => (
            <button
              type="button"
              key={tag}
              onClick={() => handleTagToggle(tag)}
              className={`px-3 py-1 rounded-full text-sm border ${
                formData.tags.includes(tag) ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
              }`}
              disabled={formData.tags.length >= 3 && !formData.tags.includes(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <textarea
        name="comment"
        value={formData.comment}
        onChange={handleChange}
        placeholder="What do you want others to know about this TA?"
        className="w-full p-3 border rounded"
        rows={4}
        maxLength={350}
        required
      />

      <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
        Submit Rating
      </button>


      {submitted && <p className="text-green-600 font-semibold">✅ Review submitted successfully!</p>}
    </form>
  )
}
