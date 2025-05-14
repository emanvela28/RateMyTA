'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import NavButtons from '@/components/NavButtons'
import { debounce } from 'lodash'
import { moderateName, moderateText } from '@/lib/moderation'

const TAGS = [
  'Tough Grader', 'Get Ready To Read', 'Participation Matters', 'Extra Credit',
  'Group Projects', 'Amazing Lectures', 'Clear Grading Criteria', 'Gives Good Feedback',
  'Inspirational', 'Lots Of Homework', 'Hilarious', 'Beware Of Pop Quizzes',
  'So Many Papers', 'Caring', 'Respected', 'Lecture Heavy', 'Test Heavy',
  'Graded By Few Things', 'Accessible Outside Class', 'Online Savvy'
]

interface ModerationResult {
  valid: boolean | 'flagged'
  reason?: string
}

export default function NewTAReview() {
  const { id: schoolId } = useParams() as { id: string }
  const router = useRouter()

  const { data: session, status } = useSession()
  const [schoolDomain, setSchoolDomain] = useState<string | null>(null)
  const [schoolName, setSchoolName] = useState<string | null>(null)
  const [userSchoolName, setUserSchoolName] = useState<string | null>(null)
  const [userSchoolId, setUserSchoolId] = useState<number | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [formDisabled, setFormDisabled] = useState(false)
  const [existingTA, setExistingTA] = useState<any>(null)
  const [similarTAs, setSimilarTAs] = useState<any[]>([])
  const [moderationErrors, setModerationErrors] = useState<{
    name: ModerationResult
    comment: ModerationResult
  }>({
    name: { valid: true },
    comment: { valid: true }
  })

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
    if (!name.trim()) {
      setExistingTA(null)
      setSimilarTAs([])
      setModerationErrors(prev => ({ ...prev, name: { valid: true } }))
      return
    }

    const nameCheck = moderateName(name)
    setModerationErrors(prev => ({ ...prev, name: nameCheck }))

    if (nameCheck.valid === false) {
      setExistingTA(null)
      setSimilarTAs([])
      return
    }

    try {
      const res = await fetch(`/api/tas/search?name=${encodeURIComponent(name)}&schoolId=${schoolId}`)
      
      if (!res.ok) throw new Error(`Search failed: ${res.status}`)

      const data = await res.json()
      const match = data.find((ta: any) => ta.name.toLowerCase() === name.toLowerCase())
      const similar = data.filter((ta: any) => 
        !match && 
        ta.name.toLowerCase().includes(name.toLowerCase()) && 
        ta.name.toLowerCase() !== name.toLowerCase()
      )

      setExistingTA(match || null)
      setSimilarTAs(similar.slice(0, 3))
    } catch (error) {
      console.error('TA search error:', error)
      setExistingTA(null)
      setSimilarTAs([])
    }
  }, 300)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
  
    let newValue = value;
  
    // Auto-format the course code input
    if (name === 'courseCode') {
      newValue = value.toUpperCase().replace(/\s+/g, '');
    }
  
    setForm(prev => ({ ...prev, [name]: newValue }));
  
    if (name === 'name') {
      searchTA(value);
    }
  };
  

  const handleCommentChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target
    setForm(prev => ({ ...prev, comment: value }))
    
    if (value.length > 10) {
      const result = await moderateText(value, { strict: true })
      setModerationErrors(prev => ({
        ...prev,
        comment: result
      }))
    } else {
      setModerationErrors(prev => ({
        ...prev,
        comment: { valid: true }
      }))
    }
  }

  const handleTagToggle = (tag: string) => {
    setForm(prev => {
      const tags = prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
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

    // Final client-side validation
    const nameCheck = moderateName(form.name)
    const commentCheck = await moderateText(form.comment, { strict: true })
    
    setModerationErrors({
      name: nameCheck,
      comment: commentCheck
    })

    // Block if any are explicitly false
    if (nameCheck.valid === false || commentCheck.valid === false) {
      return
    }

    setFormDisabled(true)

    try {
      const res = await fetch(`/api/schools/${schoolId}/new-ta`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...form, 
          schoolId, 
          pending: nameCheck.valid === 'flagged' || commentCheck.valid === 'flagged'
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Submission failed')
      }

      const result = await res.json()
      setShowSuccess(true)
      
      // Clear form if successful
      if (!result.data.pending) {
        setForm({
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
          tags: [],
          comment: '',
        })
      }
    } catch (error) {
      console.error('Submission error:', error)
      alert(error instanceof Error ? error.message : 'Submission failed')
      setFormDisabled(false)
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
            Please visit your school's page to leave a review.
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
          <div className={`
            ${moderationErrors.name.valid === 'flagged' || moderationErrors.comment.valid === 'flagged'
              ? 'bg-yellow-100 border-yellow-400 text-yellow-800'
              : 'bg-green-100 border-green-400 text-green-800'
            } border px-4 py-3 rounded mb-4`
          }>
            <p className="font-semibold">
              {moderationErrors.name.valid === 'flagged' || moderationErrors.comment.valid === 'flagged'
                ? 'Submission received and pending approval'
                : 'Submission successful!'
              }
            </p>
            <p className="text-sm">
              {moderationErrors.name.valid === 'flagged' || moderationErrors.comment.valid === 'flagged'
                ? 'Your submission will be reviewed before publishing'
                : 'The TA page is now available'
              }
            </p>
          </div>
        )}

        {existingTA ? (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 p-4 rounded">
            <p className="mb-2 font-semibold">This TA already exists:</p>
            <a href={`/tas/${existingTA.id}`} className="text-blue-600 underline">
              {existingTA.name} — View Reviews
            </a>
          </div>
        ) : (
          !formDisabled && (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* TA Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="TA Name"
                    required
                    className={`w-full p-2 border rounded ${
                      moderationErrors.name.valid === false 
                        ? 'border-red-500' 
                        : moderationErrors.name.valid === 'flagged'
                          ? 'border-yellow-500'
                          : 'border-gray-300'
                    }`}
                  />
                  {moderationErrors.name.valid === false && (
                    <p className="text-red-500 text-sm mt-1">{moderationErrors.name.reason}</p>
                  )}
                  {moderationErrors.name.valid === 'flagged' && (
                    <p className="text-yellow-600 text-sm mt-1">
                      {moderationErrors.name.reason || 'Name requires review'}
                    </p>
                  )}
                </div>
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

              {similarTAs.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded">
                  <p className="font-medium mb-2">Did you mean:</p>
                  <ul className="space-y-1">
                    {similarTAs.map(ta => (
                      <li key={ta.id}>
                        <a
                          href={`/tas/${ta.id}`}
                          className="hover:underline"
                          onClick={(e) => {
                            e.preventDefault()
                            setForm(prev => ({ ...prev, name: ta.name }))
                            searchTA(ta.name)
                          }}
                        >
                          {ta.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

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

              {/* Selects */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'takeAgain', label: 'Would you take this TA again?' },
                  { name: 'forCredit', label: 'Was this class for credit?' },
                  { name: 'usedTextbook', label: 'Did the TA use a textbook?' },
                  { name: 'attendance', label: 'Was attendance mandatory?' },
                  { name: 'grade', label: 'Grade Received' }
                ].map(({ name, label }) => (
                  <select
                    key={name}
                    name={name}
                    value={form[name as keyof typeof form]}
                    onChange={handleChange}
                    required={name === 'grade'}
                    className={`w-full p-2 border rounded ${
                      !form[name as keyof typeof form] ? 'text-gray-500' : 'text-black'
                    }`}
                  >
                    <option value="" disabled hidden>
                      {label}
                    </option>
                    {name === 'grade'
                      ? ['A', 'B', 'C', 'D', 'F', 'Pass', 'Fail'].map(g => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))
                      : ['Yes', 'No'].map(opt => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
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
                  onChange={handleCommentChange}
                  placeholder="Write your review..."
                  rows={5}
                  className={`w-full p-3 border rounded text-sm ${
                    moderationErrors.comment.valid === false 
                      ? 'border-red-500' 
                      : moderationErrors.comment.valid === 'flagged'
                        ? 'border-yellow-500'
                        : 'border-gray-300'
                  }`}
                  maxLength={350}
                  required
                />
                <div className="flex justify-between mt-1">
                  {moderationErrors.comment.valid === false && (
                    <p className="text-red-500 text-sm">{moderationErrors.comment.reason}</p>
                  )}
                  {moderationErrors.comment.valid === 'flagged' && (
                    <p className="text-yellow-600 text-sm">
                      {moderationErrors.comment.reason || 'Content requires review'}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 ml-auto">
                    {form.comment.length}/350 characters
                  </p>
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-center pt-2">
                <button
                  type="submit"
                  disabled={
                    moderationErrors.name.valid === false ||
                    moderationErrors.comment.valid === false ||
                    formDisabled ||
                    form.tags.length === 0 ||
                    !form.rating ||
                    !form.difficulty ||
                    !form.grade
                  }
                  className={`px-6 py-3 rounded-lg font-semibold transition duration-200 ${
                    moderationErrors.name.valid === false ||
                    moderationErrors.comment.valid === false ||
                    formDisabled ||
                    form.tags.length === 0 ||
                    !form.rating ||
                    !form.difficulty ||
                    !form.grade
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {formDisabled 
                    ? 'Submitting...' 
                    : moderationErrors.name.valid === 'flagged' || 
                      moderationErrors.comment.valid === 'flagged'
                      ? 'Submit for Review'
                      : 'Submit TA & Review'}
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