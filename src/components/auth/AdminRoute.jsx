import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'
import { useUser } from '../../hooks/useUser.js'
import { PageSkeleton } from '../ui/Skeleton.jsx'

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL

export function AdminRoute({ children }) {
  const { user: fbUser, loading: authLoading } = useAuth()
  const { user: profile, loading: profileLoading } = useUser()
  const loading = authLoading || profileLoading

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-50 p-8 dark:bg-brand-950">
        <PageSkeleton />
      </div>
    )
  }

  const isAdmin =
    profile?.role === 'admin' ||
    fbUser?.email === ADMIN_EMAIL

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}
