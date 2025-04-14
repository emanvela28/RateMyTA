import { prisma } from '@/lib/prisma'
import TASectionClient from '@/components/TASectionClient'
import NavButtons from '@/components/NavButtons'


export default async function SchoolPage({ params }: { params: { id: string } }) {
  const schoolId = Number(params.id)

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

        {/* Inject the client component for dynamic TA search */}
        <TASectionClient schoolId={school.id} tas={school.tas} />
        <NavButtons />
      </div>
    </main>
  )
}
