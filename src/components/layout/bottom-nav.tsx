import { ChefHat, CircleDollarSign, Wheat } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { to: '/', label: 'Артикули', icon: ChefHat, end: true },
  { to: '/ingredients', label: 'Съставки', icon: Wheat, end: false },
  { to: '/other-costs', label: 'Други разходи', icon: CircleDollarSign, end: false },
]

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-center">
      <div className="w-full max-w-lg border-t border-border bg-card/95 backdrop-blur-sm [padding-bottom:env(safe-area-inset-bottom)]">
        <ul className="flex items-stretch">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <li key={to} className="flex-1">
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center gap-1 py-2.5 text-xs font-medium text-muted-foreground transition-colors',
                    isActive && 'text-foreground',
                  )
                }
              >
                <Icon className="size-5" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
