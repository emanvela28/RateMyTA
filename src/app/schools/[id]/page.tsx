import { prisma } from '@/lib/prisma'
import TASectionClient from '@/components/TASectionClient'
import NavButtons from '@/components/NavButtons'
import Link from 'next/link'

export default async function SchoolPage(props: { params: { id: string } }) {
  const { id } = props.params; // ✅ unwrap safely
  const schoolId = Number(id);


  const school = await prisma.school.findUnique({
    where: { id: schoolId },
    include: { tas: true },
  })

  if (!school) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">School not found.</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-2">{school.name}</h1>
        <p className="text-center text-gray-600 mb-6">{school.location}</p>

        {/* 💬 Add a button to leave a review */}
        <div className="flex justify-center mb-6">
          <Link
            href={`/schools/${school.id}/new-ta`}
            className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition"
          >
            Add a TA & Review
          </Link>
        </div>

        {/* TA List and Search */}
        <TASectionClient schoolId={school.id} tas={school.tas} />
        <NavButtons />
      </div>
    </main>
  )
}
