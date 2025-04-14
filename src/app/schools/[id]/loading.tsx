'use client'

import Image from 'next/image'

export default function SchoolLoading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Image
        src="/pencil.gif"
        alt="Loading..."
        width={80}
        height={80}
        className="animate-spin"
      />
    </div>
  )
}
