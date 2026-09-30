import * as React from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { SettingsLinkButton } from '@/components/layout/settings-link-button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useData } from '@/store/data-provider'

export function OtherCostsPage() {
  const { settings, updateSettings } = useData()
  const [labor, setLabor] = React.useState(String(settings.laborRatePerHour))
  const [electricity, setElectricity] = React.useState(String(settings.electricityPricePerKwh))
  const [ovenPower, setOvenPower] = React.useState(String(settings.ovenPowerKw))

  React.useEffect(() => {
    setLabor(String(settings.laborRatePerHour))
    setElectricity(String(settings.electricityPricePerKwh))
    setOvenPower(String(settings.ovenPowerKw))
  }, [settings])

  function commit(field: 'laborRatePerHour' | 'electricityPricePerKwh' | 'ovenPowerKw', value: string) {
    const parsed = Number.parseFloat(value)
    if (!Number.isFinite(parsed) || parsed < 0) return
    updateSettings({ ...settings, [field]: parsed })
  }

  return (
    <div>
      <PageHeader title="Други разходи" left={<SettingsLinkButton />} />

      <div className="flex flex-col gap-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Труд</CardTitle>
            <CardDescription>Колко струва 1 час ръчен труд.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="labor-rate">Цена на труда (лв./час)</Label>
              <Input
                id="labor-rate"
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                value={labor}
                onChange={(e) => setLabor(e.target.value)}
                onBlur={(e) => commit('laborRatePerHour', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ток</CardTitle>
            <CardDescription>
              Използва се за оценка на разхода за печене, спрямо времето за печене на артикула.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="electricity-price">Цена на тока (лв./kWh)</Label>
              <Input
                id="electricity-price"
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                value={electricity}
                onChange={(e) => setElectricity(e.target.value)}
                onBlur={(e) => commit('electricityPricePerKwh', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="oven-power">Мощност на фурна (kW)</Label>
              <Input
                id="oven-power"
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                value={ovenPower}
                onChange={(e) => setOvenPower(e.target.value)}
                onBlur={(e) => commit('ovenPowerKw', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
