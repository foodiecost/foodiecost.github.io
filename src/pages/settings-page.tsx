import { ArrowLeft, Download, Laptop, Moon, Sun, Upload } from 'lucide-react'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useTheme } from '@/hooks/use-theme'
import { applyImportPayload, buildExportPayload, downloadExportFile, parseImportFile } from '@/lib/export-import'
import type { ThemeMode } from '@/lib/types'
import { useData } from '@/store/data-provider'

const THEME_OPTIONS: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Светла', icon: Sun },
  { value: 'dark', label: 'Тъмна', icon: Moon },
  { value: 'auto', label: 'Автоматично (по устройство)', icon: Laptop },
]

export function SettingsPage() {
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  const { reloadAll } = useData()
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [status, setStatus] = React.useState<string | null>(null)

  async function handleExport() {
    const payload = await buildExportPayload()
    downloadExportFile(payload)
    setStatus('Файлът беше изтеглен.')
  }

  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const text = await file.text()
      const payload = parseImportFile(text)
      await applyImportPayload(payload)
      await reloadAll()
      setStatus('Данните бяха импортирани успешно.')
    } catch (error) {
      setStatus(error instanceof Error ? `Грешка: ${error.message}` : 'Грешка при импортиране.')
    }
  }

  const activeOption = THEME_OPTIONS.find((o) => o.value === theme) ?? THEME_OPTIONS[2]

  return (
    <div>
      <PageHeader
        title="Настройки"
        left={
          <Button variant="ghost" size="icon" aria-label="Назад" onClick={() => navigate(-1)}>
            <ArrowLeft className="size-5" />
          </Button>
        }
      />

      <div className="flex flex-col gap-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Тема</CardTitle>
            <CardDescription>Изберете светъл, тъмен или автоматичен режим.</CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              items={THEME_OPTIONS}
              value={theme}
              onValueChange={(value) => setTheme(value as ThemeMode)}
            >
              <SelectTrigger>
                <SelectValue>
                  <span className="flex items-center gap-2">
                    <activeOption.icon className="size-4" />
                    {activeOption.label}
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {THEME_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <span className="flex items-center gap-2">
                      <option.icon className="size-4" />
                      {option.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Данни</CardTitle>
            <CardDescription>
              Експортирайте всички съставки и артикули в JSON файл, или импортирайте такъв файл.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="size-4" />
              Експорт в JSON
            </Button>
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              <Upload className="size-4" />
              Импорт от JSON
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={handleImportFile}
            />
            {status && <p className="text-sm text-muted-foreground">{status}</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
