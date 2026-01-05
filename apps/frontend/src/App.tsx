import { ThemeProvider } from './modules/common/design-system/ThemeContext'
import { FooterFrame } from './modules/common/frames/Footer.frame'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { Login } from './modules/auth/components/Login.component'
import { AuthProvider } from './modules/common/services/auth/AuthProvider';
import { RequireAuth } from './modules/common/services/auth/RequireAuth'
import { RequireNoAuth } from './modules/common/services/auth/RequireNoAuth'
import { PageFrame } from './modules/common/frames/Page.frame'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={
              <RequireNoAuth>
                <Login />
                <FooterFrame />
              </RequireNoAuth>
            } />
            <Route path="/*" element={
              <RequireAuth>
                <PageFrame />
              </RequireAuth>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
