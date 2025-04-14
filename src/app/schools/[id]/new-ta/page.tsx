'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import NavButtons from '@/components/NavButtons'

const TAGS = [
  'Tough Grader', 'Get Ready To Read', 'Participation Matters', 'Extra Credit',
  'Group Projects', 'Amazing Lectures', 'Clear Grading Criteria', 'Gives Good Feedback',
  'Inspirational', 'Lots Of Homework', 'Hilarious', 'Beware Of Pop Quizzes',
  'So Many Papers', 'Caring', 'Respected', 'Lecture Heavy', 'Test Heavy',
  'Graded By Few Things', 'Accessible Outside Class', 'Online Savvy'
]

export default function NewTAReview({ params }: { params: { id: string } }) {
  const schoolId = params.id
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    department: '',
    courseCode: '',
    rating: 5,
    difficulty: 3,
    takeAgain: 'Yes',
    forCredit: 'Yes',
    usedTextbook: 'Yes',
    attendance: 'Yes',
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
  
      // Redirect to the TA's profile page
      router.push(`/tas/${taId}`)
    } else {
      console.error('❌ TA creation failed')
      // Optionally: show a toast or inline error message
    }
  }  
  

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-xl mx-auto bg-white shadow rounded-xl p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">Add a TA & Review</h1>
        <form onSubmit={handleSubmit} className="space-y-4">

          <input name="name" value={form.name} onChange={handleChange} placeholder="TA Name" required className="w-full p-2 border rounded" />
          <input name="department" value={form.department} onChange={handleChange} placeholder="Department" required className="w-full p-2 border rounded" />
          <input name="courseCode" value={form.courseCode} onChange={handleChange} placeholder="Course Code (e.g. CS101)" required className="w-full p-2 border rounded" />

          <label className="block">Rating (1–5)
            <input type="number" name="rating" min={1} max={5} value={form.rating} onChange={handleChange} className="w-full p-2 border rounded" />
          </label>

          <label className="block">Difficulty (1–5)
            <input type="number" name="difficulty" min={1} max={5} value={form.difficulty} onChange={handleChange} className="w-full p-2 border rounded" />
          </label>

          <select name="takeAgain" value={form.takeAgain} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="">Would you take this TA again?</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>

          <select name="forCredit" value={form.forCredit} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="">Was this class for credit?</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>

          <select name="usedTextbook" value={form.usedTextbook} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="">Did this TA use a textbook?</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>

          <select name="attendance" value={form.attendance} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="">Was attendance mandatory?</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>

          <select name="grade" value={form.grade} onChange={handleChange} required className="w-full p-2 border rounded">
            <option value="">Select grade received</option>
            <option>A</option><option>B</option><option>C</option><option>D</option><option>F</option><option>Pass</option><option>Fail</option>
          </select>

          <div>
            <p className="font-medium mb-2">Select up to 3 tags</p>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((tag) => (
                <label key={tag} className="text-sm border rounded px-3 py-1 cursor-pointer bg-gray-100">
                  <input
                    type="checkbox"
                    checked={form.tags.includes(tag)}
                    onChange={() => handleTagToggle(tag)}
                    className="mr-1"
                  />
                  {tag}
                </label>
              ))}
            </div>
          </div>

          <textarea
            name="comment"
            value={form.comment}
            onChange={handleChange}
            placeholder="Write your review..."
            rows={5}
            className="w-full p-2 border rounded"
            maxLength={350}
            required
          />

          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
            Submit TA & Review
          </button>
        </form>
        <NavButtons />
      </div>
    </main>
  )
}
