import { ThemeProvider } from './modules/common/design-system/themeContext';
import { FooterFrame } from './modules/common/frames/footer.frame';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { Login } from './modules/auth/components/login.component';
import { AuthProvider } from './modules/common/services/auth/authProvider';
import { RequireAuth } from './modules/common/services/auth/requireAuth';
import { RequireNoAuth } from './modules/common/services/auth/requireNoAuth';
import { PageFrame } from './modules/common/frames/page.frame';
import { HealthCheck } from './modules/common/services/auth/healthCheck';

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route
                            path="/login"
                            element={
                                <RequireNoAuth>
                                    <Login />
                                    <FooterFrame />
                                </RequireNoAuth>
                            }
                        />
                        <Route
                            path="/*"
                            element={
                                <RequireAuth>
                                    <HealthCheck />
                                    <PageFrame />
                                </RequireAuth>
                            }
                        />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
