import { prisma } from '@/lib/prisma'
import Link from 'next/link'

type Props = {
  searchParams: { q: string }
}

export default async function SearchPage({ searchParams }: Props) {
  const query = searchParams.q?.toLowerCase() || ''

  const [tas, schools] = await Promise.all([
    prisma.tA.findMany({
      where: {
        name: { contains: query },
      },
      include: { school: true },
    }),
    prisma.school.findMany({
      where: {
        name: { contains: query },
      },
    }),
  ])

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#eef3fb] to-[#dee9f8] relative">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: "url('/tra-nguyen-TVSRWmnW8Us-unsplash.jpg')" }}
      />

      {/* Frosted Glass Card */}
      <div className="relative z-10 max-w-3xl mx-auto px-10 py-12 sm:px-6 sm:py-8 bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl mt-16 border border-gray-300">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center">
          Search Results for &quot;{query}&quot;
        </h1>

        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>🎓</span> TAs
          </h2>
          {tas.length === 0 ? (
            <p className="text-lg text-gray-600">No matching TAs found.</p>
          ) : (
            <ul className="space-y-5">
              {tas.map((ta) => (
                <li key={ta.id} className="bg-white/90 p-5 shadow-md rounded-xl hover:shadow-lg transition-shadow border border-gray-200">
                  <Link
                    href={`/tas/${ta.id}`}
                    className="font-semibold text-blue-600 hover:underline text-xl"
                  >
                    {ta.name}
                  </Link>
                  <p className="text-base text-gray-500 mt-2">
                    Teaching at{' '}
                    <Link
                      href={`/schools/${ta.schoolId}`}
                      className="text-blue-500 hover:underline"
                    >
                      {ta.school.name}
                    </Link>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>🏫</span> Schools
          </h2>
          {schools.length === 0 ? (
            <p className="text-lg text-gray-600">No matching schools found.</p>
          ) : (
            <ul className="space-y-5">
              {schools.map((school) => (
                <li key={school.id} className="bg-white/90 p-5 shadow-md rounded-xl hover:shadow-lg transition-shadow border border-gray-200">
                  <Link
                    href={`/schools/${school.id}`}
                    className="font-semibold text-blue-600 hover:underline text-xl"
                  >
                    {school.name}
                  </Link>
                  <p className="text-base text-gray-500 mt-2">{school.location}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  )
}
