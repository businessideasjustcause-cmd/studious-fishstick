import Layout from '../components/Layout'

export default function Billing({ session, loading: appLoading }) {
  if (appLoading) return <div className="flex items-center justify-center min-h-screen text-gray-600">Loading…</div>
  if (!session) return null

  return (
    <Layout session={session} loading={appLoading}>
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow border border-gray-200 mt-8">
        <h1 className="text-3xl font-bold mb-4 text-slate-900">Billing</h1>
        <p className="text-slate-700 mb-6">Manage your subscription, payment methods, and invoices here.</p>
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded border border-slate-200">
            <h2 className="text-lg font-semibold mb-2">Subscription</h2>
            <p className="text-slate-600">You are currently on the <span className="font-bold">Free</span> plan.</p>
            <button className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">Upgrade</button>
          </div>
          <div className="p-4 bg-slate-50 rounded border border-slate-200">
            <h2 className="text-lg font-semibold mb-2">Payment Methods</h2>
            <p className="text-slate-600">No payment methods on file.</p>
            <button className="mt-3 px-4 py-2 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition">Add Payment Method</button>
          </div>
          <div className="p-4 bg-slate-50 rounded border border-slate-200">
            <h2 className="text-lg font-semibold mb-2">Invoices</h2>
            <p className="text-slate-600">No invoices found.</p>
          </div>
        </div>
      </div>
    </Layout>
    
  )
}
