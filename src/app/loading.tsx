'use client'

import Image from 'next/image'

export default function GlobalLoading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Image
        src="/pencil.gif" // 👈 Replace with your own gif or image
        alt="Loading..."
        width={80}
        height={80}
        className="animate-spin"
      />
    </div>
  )
}
