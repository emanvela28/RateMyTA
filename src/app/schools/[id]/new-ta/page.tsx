'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import NavButtons from '@/components/NavButtons'

const TAGS = [
  'Tough Grader', 'Get Ready To Read', 'Participation Matters', 'Extra Credit',
  'Group Projects', 'Amazing Lectures', 'Clear Grading Criteria', 'Gives Good Feedback',
  'Inspirational', 'Lots Of Homework', 'Hilarious', 'Beware Of Pop Quizzes',
  'So Many Papers', 'Caring', 'Respected', 'Lecture Heavy', 'Test Heavy',
  'Graded By Few Things', 'Accessible Outside Class', 'Online Savvy'
]

export default function NewTAReview() {
  const { id: schoolId } = useParams() as { id: string }
  const router = useRouter()

  const [form, setForm] = useState({
    name: '',
    department: '',
    courseCode: '',
    rating: '',
    difficulty: '',
    takeAgain: '',
    forCredit: '',
    usedTextbook: '',
    attendance: '',
    grade: '',
    tags: [] as string[],
    comment: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleTagToggle = (tag: string) => {
    setForm((prev) => {
      const tags = prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : prev.tags.length < 3
          ? [...prev.tags, tag]
          : prev.tags
      return { ...prev, tags }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch(`/api/schools/${schoolId}/new-ta`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, schoolId }),
    })

    if (res.ok) {
      const data = await res.json()
      const taId = data.ta.id
      router.push(`/tas/${taId}`)
    } else {
      console.error('❌ TA creation failed')
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">Add a TA & Review</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* TA Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="TA Name"
              required
              className="w-full p-2 border rounded"
            />
            <input
              name="department"
              value={form.department}
              onChange={handleChange}
              placeholder="Department"
              required
              className="w-full p-2 border rounded"
            />
            <input
              name="courseCode"
              value={form.courseCode}
              onChange={handleChange}
              placeholder="Course Code (e.g. CS101)"
              required
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Ratings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="number"
              name="rating"
              min={1}
              max={5}
              value={form.rating}
              onChange={handleChange}
              placeholder="Rating (1–5)"
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="number"
              name="difficulty"
              min={1}
              max={5}
              value={form.difficulty}
              onChange={handleChange}
              placeholder="Difficulty (1–5)"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Select-style Questions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'takeAgain', label: 'Would you take this TA again?' },
              { name: 'forCredit', label: 'Was this class for credit?' },
              { name: 'usedTextbook', label: 'Did the TA use a textbook?' },
              { name: 'attendance', label: 'Was attendance mandatory?' },
              { name: 'grade', label: 'Grade Received' },
            ].map(({ name, label }) => (
              <select
                key={name}
                name={name}
                value={form[name as keyof typeof form]}
                onChange={handleChange}
                required={name === 'grade'}
                className={`w-full p-2 border rounded ${!form[name as keyof typeof form] ? 'text-gray-500' : 'text-black'}`}
              >
                <option value="" disabled hidden>{label}</option>
                {name === 'grade'
                  ? ['A', 'B', 'C', 'D', 'F', 'Pass', 'Fail'].map(g => <option key={g}>{g}</option>)
                  : ['Yes', 'No'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            ))}
          </div>

          {/* Tags */}
          <div>
            <p className="font-medium mb-2">Select up to 3 tags</p>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((tag) => {
                const selected = form.tags.includes(tag)
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1 rounded-full text-sm border transition duration-150 ${
                      selected
                        ? 'bg-blue-100 text-blue-700 border-blue-400 hover:bg-blue-200'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                    disabled={form.tags.length >= 3 && !selected}
                  >
                    {tag}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Comment */}
          <div>
            <textarea
              name="comment"
              value={form.comment}
              onChange={handleChange}
              placeholder="Write your review..."
              rows={5}
              className="w-full p-3 border rounded text-sm"
              maxLength={350}
              required
            />
            <p className="text-sm text-gray-500 text-right mt-1">
              {form.comment.length}/350 characters
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
            >
              Submit TA & Review
            </button>
          </div>
        </form>

        <NavButtons schoolId={Number(schoolId)} />
      </div>
    </main>
  )
}
