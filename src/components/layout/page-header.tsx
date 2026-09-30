import * as React from 'react'
import { cn } from '@/lib/utils'

export function PageHeader({
  title,
  left,
  right,
  className,
}: {
  title: React.ReactNode
  left?: React.ReactNode
  right?: React.ReactNode
  className?: string
}) {
  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex items-center gap-2 border-b border-border bg-background/95 px-4 pb-3 backdrop-blur-sm [padding-top:calc(0.75rem+env(safe-area-inset-top))]',
        className,
      )}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-start">{left}</div>
      <h1 className="flex flex-1 items-center truncate text-lg font-semibold leading-none">
        {title}
      </h1>
      <div className="flex h-11 shrink-0 items-center justify-end gap-1">{right}</div>
    </header>
  )
}
