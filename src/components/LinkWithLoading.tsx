'use client'

import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useLoading } from './LoadingContext'

type Props = {
  href: string
  children: ReactNode
  className?: string
}

export default function LinkWithLoading({ href, children, className }: Props) {
  const router = useRouter()
  const { setLoading } = useLoading()

  const handleClick = () => {
    setLoading(true)
    router.push(href)
  }

  return (
    <div onClick={handleClick} className={className} role="link">
      {children}
    </div>
  )
}
