import { prisma } from '@/lib/prisma'
import TASectionClient from '@/components/TASectionClient'
import NavButtons from '@/components/NavButtons'
import Link from 'next/link'

type PageProps = {
  params: {
    id: string
  }
}

export default async function SchoolPage({ params }: PageProps) {
  // Await the params promise before accessing its properties
  const { id } = await params
  const schoolId = Number(id)

  if (isNaN(schoolId)) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">Invalid school ID.</p>
      </main>
    )
  }

  const school = await prisma.school.findUnique({
    where: { id: schoolId },
    include: {
      tas: {
        where: { pending: false }, // ✅ Only fetch approved TAs
      },
    },
  })
  

  if (!school) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">School not found.</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      {/* Add padding-top to push content below nav bar */}
      <div className="pt-16"> {/* Adjust this value based on your nav bar height */}
        <div 
          className="fixed inset-0 -z-10" // This will position the background behind everything
          style={{
            backgroundImage: "url('/priscilla-du-preez-ggeZ9oyI-PE-unsplash.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        
        {/* Content container */}
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4"> {/* Adjust min-h calculation based on nav bar height */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 max-w-3xl w-full text-center shadow-lg">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{school.name}</h1>
            <p className="text-gray-600 mb-6">{school.location}</p>

            <div className="flex justify-center mb-6">
              <Link
                href={`/schools/${school.id}/new-ta`}
                className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition"
              >
                Add a TA & Review
              </Link>
            </div>

            <TASectionClient schoolId={school.id} tas={school.tas} />
            <NavButtons />
          </div>
        </div>
      </div>
    </main>
  )
}