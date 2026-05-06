import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Signup from './pages/signup.tsx'
import Signin from './pages/signin.tsx'
import Conversation from './pages/conversation.tsx'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/signin" replace />;
  return <>{children}</>;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<App/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/signin' element={<Signin/>}/>
      <Route path="/c/:conversationId" element={<ProtectedRoute><Conversation/></ProtectedRoute>}/>
    </Routes>
    </BrowserRouter>
  </StrictMode>,
)
