import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Signup from './pages/signup.tsx'
import Signin from './pages/signin.tsx'
import Conversation from './pages/conversation.tsx'
import AuthSuccess from './pages/authloader.tsx'
import SettingsLayout from './pages/settings/layout.tsx'
import ProfileSettings from './pages/settings/profile.tsx'
import HistorySettings from './pages/settings/history.tsx'
import ModelsSettings from './pages/settings/models.tsx'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/signin" replace />;
  return <>{children}</>;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/auth/success' element={<AuthSuccess />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/signin' element={<Signin />} />
        <Route path="/c/:conversationId" element={<ProtectedRoute><Conversation /></ProtectedRoute>} />

        {/* Settings routes */}
        <Route
          path='/settings/profile'
          element={
            <ProtectedRoute>
              <SettingsLayout>
                <ProfileSettings />
              </SettingsLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path='/settings/history'
          element={
            <ProtectedRoute>
              <SettingsLayout>
                <HistorySettings />
              </SettingsLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path='/settings/models'
          element={
            <ProtectedRoute>
              <SettingsLayout>
                <ModelsSettings />
              </SettingsLayout>
            </ProtectedRoute>
          }
        />

        {/* Redirect old /profile to new settings page */}
        <Route path='/profile' element={<Navigate to="/settings/profile" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
