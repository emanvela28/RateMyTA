'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import NavButtons from '@/components/NavButtons'
import debounce from 'lodash.debounce'

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

  const { data: session, status } = useSession()
  const [schoolDomain, setSchoolDomain] = useState<string | null>(null)
  const [schoolName, setSchoolName] = useState<string | null>(null)
  const [userSchoolName, setUserSchoolName] = useState<string | null>(null)
  const [userSchoolId, setUserSchoolId] = useState<number | null>(null)
  const [showSuccess, setShowSuccess] = useState(false);
  const [formDisabled, setFormDisabled] = useState(false);

  const [existingTA, setExistingTA] = useState<any>(null)

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

  const userDomain = session?.user?.email?.split('@')[1]?.toLowerCase()
  const canSubmit = session && userDomain && schoolDomain && userDomain === schoolDomain

  useEffect(() => {
    const fetchSchool = async () => {
      const res = await fetch(`/api/schools/${schoolId}/domain`)
      const data = await res.json()
      setSchoolDomain(data.domain)
      setSchoolName(data.name)

      if (userDomain) {
        const domainRes = await fetch(`/api/schools/domain/${userDomain}`)
        const domainData = await domainRes.json()
        setUserSchoolName(domainData.name)
        setUserSchoolId(domainData.id)
      }
    }
    fetchSchool()
  }, [schoolId, userDomain])

  const searchTA = debounce(async (name: string) => {
    if (!name.trim()) return setExistingTA(null)

    const res = await fetch(`/api/tas/search?name=${encodeURIComponent(name)}&schoolId=${schoolId}`);

    if (!res.ok) {
      setExistingTA(null);
      return;
    }

    const data = await res.json();
    const match = data.find((ta: any) => ta.name.toLowerCase() === name.toLowerCase())
    setExistingTA(match || null)
  }, 300)

  useEffect(() => {
    searchTA(form.name)
  }, [form.name])

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
    if (existingTA) {
      router.push(`/tas/${existingTA.id}`)
      return
    }

    const res = await fetch(`/api/schools/${schoolId}/new-ta`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, schoolId, pending: true }),
    })

    if (res.ok) {
      setShowSuccess(true);
      setFormDisabled(true);
    }
  }

  if (status === 'loading' || !schoolDomain) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-opacity-50 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading page...</p>
        </div>
      </main>
    )
  }

  if (!session) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white border shadow-lg rounded-xl p-8 max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            You must be signed in to submit a TA and review.
          </h2>
          <p className="text-gray-600 mb-6">
            Please log in using your school email to continue.
          </p>
          <a
            href="/api/auth/signin"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Log In
          </a>
        </div>
      </main>
    )
  }

  if (!canSubmit) {
    const userSchoolUrl = `/schools/${userSchoolId}`
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white border shadow-lg rounded-xl p-8 max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            You can only submit reviews for your own school.
          </h2>
          <p className="text-gray-600 mb-6">
            Your email is associated with{' '}
            <strong className="text-blue-700">{userSchoolName ?? userDomain}</strong>. <br />
            Please visit your school’s page to leave a review.
          </p>
          {userSchoolId && (
            <a
              href={userSchoolUrl}
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Go to My School Page
            </a>
          )}
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">Add a TA & Review</h1>

        {showSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded mb-4">
            <p className="font-semibold">TA submitted for approval!</p>
            <p className="text-sm">Once approved, their page will be published for reviews.</p>
          </div>
        )}

        {existingTA ? (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 p-4 rounded">
            <p className="mb-2 font-semibold">This TA may already exist:</p>
            <a href={`/tas/${existingTA.id}`} className="text-blue-600 underline">
              {existingTA.name} — View Reviews
            </a>
          </div>
        ) : (
          !formDisabled && (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* TA Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="name" value={form.name} onChange={handleChange} placeholder="TA Name" required className="w-full p-2 border rounded" />
                <input name="department" value={form.department} onChange={handleChange} placeholder="Department" required className="w-full p-2 border rounded" />
                <input name="courseCode" value={form.courseCode} onChange={handleChange} placeholder="Course Code (e.g. CS101)" required className="w-full p-2 border rounded" />
              </div>

              {/* Ratings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="number" name="rating" min={1} max={5} value={form.rating} onChange={handleChange} placeholder="Rating (1–5)" className="w-full p-2 border rounded" required />
                <input type="number" name="difficulty" min={1} max={5} value={form.difficulty} onChange={handleChange} placeholder="Difficulty (1–5)" className="w-full p-2 border rounded" required />
              </div>

              {/* Selects */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[{ name: 'takeAgain', label: 'Would you take this TA again?' }, { name: 'forCredit', label: 'Was this class for credit?' }, { name: 'usedTextbook', label: 'Did the TA use a textbook?' }, { name: 'attendance', label: 'Was attendance mandatory?' }, { name: 'grade', label: 'Grade Received' }].map(({ name, label }) => (
                  <select key={name} name={name} value={form[name as keyof typeof form]} onChange={handleChange} required={name === 'grade'} className={`w-full p-2 border rounded ${!form[name as keyof typeof form] ? 'text-gray-500' : 'text-black'}`}>
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
                  {TAGS.map(tag => {
                    const selected = form.tags.includes(tag)
                    return (
                      <button type="button" key={tag} onClick={() => handleTagToggle(tag)} className={`px-3 py-1 rounded-full text-sm border transition duration-150 ${selected ? 'bg-blue-100 text-blue-700 border-blue-400 hover:bg-blue-200' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`} disabled={form.tags.length >= 3 && !selected}>
                        {tag}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Comment */}
              <div>
                <textarea name="comment" value={form.comment} onChange={handleChange} placeholder="Write your review..." rows={5} className="w-full p-3 border rounded text-sm" maxLength={350} required />
                <p className="text-sm text-gray-500 text-right mt-1">{form.comment.length}/350 characters</p>
              </div>

              {/* Submit */}
              <div className="flex justify-center pt-2">
                <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200">
                  Submit TA & Review
                </button>
              </div>
            </form>
          )
        )}

        <NavButtons schoolId={Number(schoolId)} />
      </div>
    </main>
  )
}