'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

const tagsList = [
  'Tough Grader', 'Get Ready To Read', 'Participation Matters', 'Extra Credit',
  'Group Projects', 'Amazing Lectures', 'Clear Grading Criteria', 'Gives Good Feedback',
  'Inspirational', 'Lots Of Homework', 'Hilarious', 'Beware Of Pop Quizzes',
  'So Many Papers', 'Caring', 'Respected', 'Lecture Heavy', 'Test Heavy',
  'Graded By Few Things', 'Accessible Outside Class', 'Online Savvy',
]

export default function ReviewForm({ taId }: { taId: number }) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { id: schoolId } = useParams()

  const [schoolDomain, setSchoolDomain] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const [formData, setFormData] = useState({
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
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTagToggle = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : prev.tags.length < 3
          ? [...prev.tags, tag]
          : prev.tags,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch(`/api/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, taId: Number(taId) }),
    })

    if (res.ok) {
      setSubmitted(true)
      setFormData({
        courseCode: '',
        rating: '',
        difficulty: '',
        takeAgain: '',
        forCredit: '',
        usedTextbook: '',
        attendance: '',
        grade: '',
        tags: [],
        comment: '',
      })
      setTimeout(() => {
        router.push(`/tas/${taId}`)
      }, 1500)
    }
  }

  const userDomain = session?.user?.email?.split('@')[1]?.toLowerCase()
  const canSubmit = session && userDomain && schoolDomain && userDomain === schoolDomain

  useEffect(() => {
    const fetchSchoolDomain = async () => {
      try {
        const res = await fetch(`/api/tas/${taId}/school`)
        if (!res.ok) throw new Error('Failed to fetch school domain')
        const data = await res.json()
        setSchoolDomain(data.domain)
      } catch (err) {
        console.error('Error fetching school domain:', err)
        setSchoolDomain(null) // Or maybe set an error state
      }
    }
    fetchSchoolDomain()
  }, [taId])
  

  if (status === 'loading' || !schoolDomain) return <p>Loading...</p>
  if (!session) return <p className="text-center text-red-600">You must be signed in to leave a review.</p>
  if (!canSubmit) return (
    <p className="text-center text-red-600">
      You can only leave reviews for TAs from your school.
    </p>
  )

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow space-y-8">
      <h2 className="text-2xl font-bold text-center text-gray-800">Leave a Review</h2>

      {/* Course Code & Ratings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input
        type="text"
        name="courseCode"
        value={formData.courseCode}
        onChange={(e) => {
          const rawValue = e.target.value
          const formatted = rawValue
            .toUpperCase()
            .replace(/([A-Z]+)\s*([0-9]+)/, '$1$2')

          setFormData((prevData) => ({
            ...prevData,
            courseCode: formatted,
          }))
        }}
        required
        placeholder="Enter Course Code (e.g., CSE120)"
        className={`w-full p-2 border rounded ${!formData.courseCode ? 'text-gray-500' : 'text-black'}`}
      />



        <input
          type="number"
          name="rating"
          min={1}
          max={5}
          value={formData.rating}
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
          value={formData.difficulty}
          onChange={handleChange}
          placeholder="Difficulty (1–5)"
          className="w-full p-2 border rounded"
          required
        />
      </div>

      {/* Select Questions */}
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
            value={formData[name as keyof typeof formData]}
            onChange={handleChange}
            required
            className={`w-full p-2 border rounded ${!formData[name as keyof typeof formData] ? 'text-gray-500' : 'text-black'}`}
          >
            <option value="" disabled hidden>{label}</option>
            {name === 'grade'
              ? ['A', 'B', 'C', 'D', 'F', 'Pass', 'Fail'].map(g => <option key={g}>{g}</option>)
              : ['Yes', 'No'].map(opt => <option key={opt}>{opt}</option>)}
          </select>
        ))}
      </div>

      {/* Tags */}
      <div>
        <p className="font-medium mb-2">Select up to 3 tags</p>
        <div className="flex flex-wrap gap-2">
          {tagsList.map(tag => {
            const selected = formData.tags.includes(tag)
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
                disabled={formData.tags.length >= 3 && !selected}
              >
                {tag}
              </button>
            )
          })}
        </div>
      </div>

      {/* Comment Box */}
      <div>
        <textarea
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          placeholder="What do you want others to know about this TA?"
          className="w-full p-3 border rounded text-sm"
          rows={5}
          maxLength={350}
          required
        />
        <p className="text-sm text-gray-500 text-right mt-1">
          {formData.comment.length}/350 characters
        </p>
      </div>

      {/* Submit */}
      <div className="flex justify-center">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
        >
          Submit Rating
        </button>
      </div>

      {submitted && <p className="text-green-600 font-semibold text-center">✅ Review submitted successfully!</p>}
    </form>
  )
}
