import { HashRouter, Route, Routes } from 'react-router-dom'
import { BottomNav } from '@/components/layout/bottom-nav'
import { IngredientsPage } from '@/pages/ingredients-page'
import { ItemEditorPage } from '@/pages/item-editor-page'
import { ItemsPage } from '@/pages/items-page'
import { OtherCostsPage } from '@/pages/other-costs-page'
import { SettingsPage } from '@/pages/settings-page'
import { DataProvider } from '@/store/data-provider'

function AppLayout() {
  return (
    <div className="mx-auto min-h-dvh w-full max-w-lg bg-background pb-[calc(4.5rem+env(safe-area-inset-bottom))] sm:border-x sm:border-border sm:shadow-sm">
      <Routes>
        <Route path="/" element={<ItemsPage />} />
        <Route path="/items/new" element={<ItemEditorPage />} />
        <Route path="/items/:id" element={<ItemEditorPage />} />
        <Route path="/ingredients" element={<IngredientsPage />} />
        <Route path="/other-costs" element={<OtherCostsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
      <BottomNav />
    </div>
  )
}

export default function App() {
  return (
    <DataProvider>
      <HashRouter>
        <AppLayout />
      </HashRouter>
    </DataProvider>
  )
}
