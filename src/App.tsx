import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Layout } from '@/components/layout/Layout'
import { LoginPage } from '@/pages/Login'
import { DashboardPage } from '@/pages/Dashboard'
import { ProductsPage } from '@/pages/Products'
import { BillingPage } from '@/pages/Billing'
import { InvoicePage } from '@/pages/Invoice'
import { ReportsPage } from '@/pages/Reports'
import { LowStockPage } from '@/pages/LowStock'
import { SettingsPage } from '@/pages/Settings'
import { SetupHealthPage } from '@/pages/SetupHealth'

export default function App() {
  const initialize = useAuthStore((s) => s.initialize)

  useEffect(() => {
    void initialize()
  }, [initialize])

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <Layout>
              <ProductsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/billing"
        element={
          <ProtectedRoute>
            <Layout>
              <BillingPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Layout>
              <ReportsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/low-stock"
        element={
          <ProtectedRoute>
            <Layout>
              <LowStockPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Layout>
              <SettingsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/setup-health"
        element={
          <ProtectedRoute>
            <Layout>
              <SetupHealthPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/invoice/:id"
        element={
          <ProtectedRoute>
            <InvoicePage />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
