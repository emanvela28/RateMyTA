import Image from 'next/image'

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">About RateMyTA</h1>

      <p className="text-gray-700 text-lg leading-relaxed mb-6">
        RateMyTA is a platform designed to help students share honest feedback
        about their Teaching Assistants (TAs). Whether it’s helping students understand complex concepts,
        offering timely support, or just being a great lab partner, they play a crucial role in education,
        and they deserve recognition.
      </p>

      <p className="text-gray-700 text-lg leading-relaxed mb-8">
        Students can rate TAs based on their helpfulness, grading difficulty,
        availability, and more. Our goal is to help future students make
        informed decisions and give TAs constructive feedback to grow in their teaching journey.
      </p>

      <Image
        src="/shubham-sharan-Z-fq3wBVfMU-unsplash.jpg"
        alt="Students in a classroom"
        width={1200}
        height={800}
        className="rounded-xl shadow-lg"
        priority
      />
    </main>
  )
}
