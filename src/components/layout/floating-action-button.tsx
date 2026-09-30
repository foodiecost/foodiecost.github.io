import { Plus } from 'lucide-react'
import * as React from 'react'
import { cn } from '@/lib/utils'

export function FloatingActionButton({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        'fixed z-40 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform active:scale-95',
        'right-[max(1rem,calc(50%-15rem))] bottom-[calc(4.5rem+env(safe-area-inset-bottom))]',
        className,
      )}
      {...props}
    >
      <Plus className="size-6" />
    </button>
  )
}
