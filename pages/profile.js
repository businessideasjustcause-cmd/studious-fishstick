import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import { getUserProfile } from '../lib/supabase'

export default function Profile({ session, loading: appLoading }) {
  const router = useRouter()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Redirect if not logged in
  useEffect(() => {
    if (!appLoading && !session) {
      router.push('/landing')
    }
  }, [session, appLoading, router])

  // Fetch user profile
  useEffect(() => {
    if (session?.user?.id) {
      loadProfile()
    }
  }, [session?.user?.id])

  const loadProfile = async () => {
    setLoading(true)
    const { data } = await getUserProfile(session.user.id)
    if (data) {
      setProfile(data)
    }
    setLoading(false)
  }

  return (
    <Layout session={session} loading={appLoading}>
      <div className="p-8 animate-fade-in-up-1">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Your account information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl animate-fade-in-up-2">
          {loading ? (
            <div className="text-center py-8 text-gray-600">Loading profile...</div>
          ) : (
            <div className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <div className="text-lg text-gray-900 bg-gray-50 p-3 rounded">
                  {session?.user?.email}
                </div>
              </div>

              {/* User ID */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">User ID</label>
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded font-mono break-all">
                  {session.user?.id}
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    {profile?.role || 'user'}
                  </span>
                </div>
              </div>

              {/* Account Created */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Account Created</label>
                <div className="text-lg text-gray-900 bg-gray-50 p-3 rounded">
                  {session.user?.created_at 
                    ? new Date(session.user.created_at).toLocaleDateString()
                    : 'Unknown'
                  }
                </div>
              </div>

              {/* Help Text */}
              <div className="pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  To manage your account further, you can use the Supabase dashboard or contact support.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}