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
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Search Results for "{query}"</h1>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">TAs</h2>
        {tas.length === 0 ? (
          <p className="text-gray-500">No matching TAs found.</p>
        ) : (
          <ul className="space-y-4">
            {tas.map((ta) => (
              <li key={ta.id} className="bg-white p-4 shadow rounded">
                <Link
                  href={`/tas/${ta.id}`}
                  className="font-semibold text-blue-600 hover:underline text-lg"
                >
                  {ta.name}
                </Link>
                <p className="text-sm text-gray-500">
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
        <h2 className="text-lg font-semibold mb-2">Schools</h2>
        {schools.length === 0 ? (
          <p className="text-gray-500">No matching schools found.</p>
        ) : (
          <ul className="space-y-4">
            {schools.map((school) => (
              <li key={school.id} className="bg-white p-4 shadow rounded">
                <Link
                  href={`/schools/${school.id}`}
                  className="font-semibold text-blue-600 hover:underline text-lg"
                >
                  {school.name}
                </Link>
                <p className="text-sm text-gray-500">{school.location}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
