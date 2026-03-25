import { Bell, Save, Settings2, Store, Ticket } from 'lucide-react'
import { useEffect, useState } from 'react'
import { BUSINESS_TYPES, type BusinessType } from '@/lib/constants'

export function SettingsPage() {
  const [saved, setSaved] = useState(false)
  const [lowStockAlerts, setLowStockAlerts] = useState(true)
  const [dailySalesEmail, setDailySalesEmail] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [businessType, setBusinessType] = useState<BusinessType>('general')

  useEffect(() => {
    setDisplayName(localStorage.getItem('shopflow-display-name') ?? '')
    const storedType = (localStorage.getItem('shopflow-business-type') as BusinessType | null) ?? 'general'
    setBusinessType(BUSINESS_TYPES.includes(storedType) ? storedType : 'general')
  }, [])

  return (
    <div className="space-y-5 pb-8">
      <section className="app-panel overflow-hidden">
        <div className="flex items-center gap-3 border-b border-[#edf1f7] px-6 py-5">
          <Store className="text-[#2f66de]" size={28} />
          <h2 className="text-2xl font-semibold text-[#1f2b46]">Shop Configuration</h2>
        </div>

        <div className="space-y-4 p-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <label className="space-y-2">
              <span className="text-base font-semibold text-[#394b68]">Shop Name</span>
              <input className="w-full rounded-2xl border border-[#dfe6f2] bg-[#f8fafd] px-4 py-3 text-base" defaultValue="ShopFlow Retail Hub" />
            </label>
            <label className="space-y-2">
              <span className="text-base font-semibold text-[#394b68]">GSTIN Number</span>
              <input className="w-full rounded-2xl border border-[#dfe6f2] bg-[#f8fafd] px-4 py-3 text-base" defaultValue="29AAAAA0000A1Z5" />
            </label>
          </div>

          <label className="space-y-2">
            <span className="text-base font-semibold text-[#394b68]">Business Address</span>
            <textarea className="h-28 w-full resize-none rounded-2xl border border-[#dfe6f2] bg-[#f8fafd] px-4 py-3 text-base" defaultValue="123 Business Hub, MG Road, Bangalore, KA - 560001" />
          </label>

          <div className="grid gap-4 lg:grid-cols-2">
            <label className="space-y-2">
              <span className="text-base font-semibold text-[#394b68]">Display Name</span>
              <input
                className="w-full rounded-2xl border border-[#dfe6f2] bg-[#f8fafd] px-4 py-3 text-base"
                placeholder="Name shown on top panel"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </label>
            <label className="space-y-2">
              <span className="text-base font-semibold text-[#394b68]">Business Type</span>
              <select
                className="w-full rounded-2xl border border-[#dfe6f2] bg-[#f8fafd] px-4 py-3 text-base"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value as BusinessType)}
              >
                {BUSINESS_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="app-panel overflow-hidden">
          <div className="flex items-center gap-3 border-b border-[#edf1f7] px-6 py-5">
            <Ticket className="text-[#584be7]" size={28} />
            <h3 className="text-2xl font-semibold text-[#1f2b46]">Invoice Settings</h3>
          </div>

          <div className="space-y-5 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-base font-semibold text-[#1f2b46]">Default Tax Rate</p>
                <p className="text-sm text-[#6f7f98]">Pre-select tax for new items</p>
              </div>
              <select className="rounded-xl border border-[#dfe6f2] bg-[#f8fafd] px-4 py-2 text-lg font-semibold text-[#2f66de]">
                <option>18%</option>
                <option>12%</option>
                <option>5%</option>
              </select>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-base font-semibold text-[#1f2b46]">Invoice Prefix</p>
                <p className="text-sm text-[#6f7f98]">Prefix for bill numbers</p>
              </div>
              <input className="w-24 rounded-xl border border-[#dfe6f2] bg-[#f8fafd] px-3 py-2 text-center text-base font-semibold text-[#1f2b46]" defaultValue="INV" />
            </div>
          </div>
        </section>

        <section className="app-panel overflow-hidden">
          <div className="flex items-center gap-3 border-b border-[#edf1f7] px-6 py-5">
            <Bell className="text-[#ef3f67]" size={28} />
            <h3 className="text-2xl font-semibold text-[#1f2b46]">Notifications</h3>
          </div>

          <div className="space-y-5 p-6">
            <div className="flex items-center justify-between">
              <p className="text-base font-semibold text-[#1f2b46]">Low Stock Alerts</p>
              <button
                type="button"
                onClick={() => setLowStockAlerts((v) => !v)}
                className={`relative h-8 w-14 rounded-full transition ${lowStockAlerts ? 'bg-[#2f66de]' : 'bg-[#d6deea]'}`}
              >
                <span className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${lowStockAlerts ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-base font-semibold text-[#1f2b46]">Daily Sales Email</p>
              <button
                type="button"
                onClick={() => setDailySalesEmail((v) => !v)}
                className={`relative h-8 w-14 rounded-full transition ${dailySalesEmail ? 'bg-[#2f66de]' : 'bg-[#d6deea]'}`}
              >
                <span className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${dailySalesEmail ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </section>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-3xl bg-[#2f66de] px-8 py-4 text-base font-bold text-white shadow-[0_12px_28px_rgba(47,102,222,0.35)]"
          onClick={() => {
            localStorage.setItem('shopflow-display-name', displayName.trim())
            localStorage.setItem('shopflow-business-type', businessType)
            window.dispatchEvent(new Event('shopflow-preferences-updated'))
            setSaved(true)
            setTimeout(() => setSaved(false), 1600)
          }}
        >
          <Save size={24} />
          Save All Changes
        </button>
      </div>

      {saved ? (
        <div className="rounded-2xl border border-[#ccebdd] bg-[#e8f7ef] px-4 py-3 text-base font-semibold text-[#107853]">Settings saved.</div>
      ) : null}

      <div className="hidden">
        <Settings2 />
      </div>
    </div>
  )
}
