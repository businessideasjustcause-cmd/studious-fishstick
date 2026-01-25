import { useState } from 'react'
import NavHeader from '../components/NavHeader'
import { Mail } from 'lucide-react'
import Dropdown from '../components/Dropdown'

export default function Contact() {
  const [orgType, setOrgType] = useState(null)

  return (
    <div className="bg-slate-50 min-h-screen font-sans animate-fade-in-up">
      <NavHeader currentPage="contact" />

      <main className="pt-24">
        <div className="max-w-3xl mx-auto py-20 px-6">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Contact Sales</h1>
          <p className="text-slate-600 mb-10">For districts, networks, and large deployments.</p>

          <div className="bg-white border border-slate-200 rounded-xl p-8">
            <form className="space-y-6">
              <input className="w-full border px-4 py-2 rounded-lg" placeholder="First name" />
              <input className="w-full border px-4 py-2 rounded-lg" placeholder="Last name" />
              <input className="w-full border px-4 py-2 rounded-lg" placeholder="Work email" />
              <Dropdown
                label="Organization Type"
                options={[
                  { label: 'School', value: 'school' },
                  { label: 'District', value: 'district' },
                  { label: 'Charter Network', value: 'charter' },
                ]}
                value={orgType}
                onChange={setOrgType}
              />
              <textarea rows={4} className="w-full border px-4 py-2 rounded-lg" placeholder="Tell us about your needs" />

              <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                Contact Sales
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}