import { useState } from 'react'

export function SettingsPage() {
  const [saved, setSaved] = useState(false)

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Settings</h1>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded border border-slate-200 bg-white p-4">
          <h2 className="font-semibold">Shop Details</h2>
          <div className="mt-3 grid gap-2 text-sm">
            <input className="rounded border px-3 py-2" placeholder="Shop Name" />
            <input className="rounded border px-3 py-2" placeholder="Address" />
            <input className="rounded border px-3 py-2" placeholder="GSTIN" />
            <input className="rounded border px-3 py-2" placeholder="Phone" />
          </div>
        </section>

        <section className="rounded border border-slate-200 bg-white p-4">
          <h2 className="font-semibold">Invoice Numbering</h2>
          <div className="mt-3 grid gap-2 text-sm">
            <input className="rounded border px-3 py-2" placeholder="Prefix (e.g., INV)" />
            <input className="rounded border px-3 py-2" placeholder="Starting Number" />
          </div>
        </section>

        <section className="rounded border border-slate-200 bg-white p-4">
          <h2 className="font-semibold">Tax Configuration</h2>
          <div className="mt-3 grid gap-2 text-sm">
            <input className="rounded border px-3 py-2" placeholder="Default GST %" />
          </div>
        </section>

        <section className="rounded border border-slate-200 bg-white p-4">
          <h2 className="font-semibold">User Management</h2>
          <div className="mt-3 grid gap-2 text-sm">
            <input className="rounded border px-3 py-2" placeholder="Staff Email" />
            <select className="rounded border px-3 py-2"><option>admin</option><option>staff</option><option>viewer</option></select>
          </div>
        </section>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          className="rounded bg-blue-600 px-4 py-2 text-white"
          onClick={() => {
            setSaved(true)
            setTimeout(() => setSaved(false), 1500)
          }}
        >
          Save Settings
        </button>
        <button type="button" className="rounded border px-4 py-2">Download CSV Backup</button>
      </div>

      {saved ? <p className="text-sm text-emerald-700">Settings saved.</p> : null}
    </div>
  )
}
