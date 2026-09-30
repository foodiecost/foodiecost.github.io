import { Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function SettingsLinkButton() {
  const navigate = useNavigate()
  return (
    <Button variant="ghost" size="icon" aria-label="Настройки" onClick={() => navigate('/settings')}>
      <Menu className="size-5" />
    </Button>
  )
}
