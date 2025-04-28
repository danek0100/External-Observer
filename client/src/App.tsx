import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { Login } from './pages/Login'
import { authService } from './services/auth'

// Lazy-loaded components
const Layout = lazy(() => import('./components/Layout'))
const Home = lazy(() => import('./pages/Home'))
const Notes = lazy(() => import('./pages/Notes'))
const NoteDetail = lazy(() => import('./pages/NoteDetail'))
const NoteEdit = lazy(() => import('./pages/NoteEdit'))
const ZettelCreate = lazy(() => import('./components/ZettelCreate'))

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const token = authService.getToken()
    return token ? <>{children}</> : <Navigate to="/login" />
}

function App() {
    return (
        <Router>
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
                        <Route index element={<Home />} />
                        <Route path="notes" element={<Notes />} />
                        <Route path="notes/new" element={<ZettelCreate />} />
                        <Route path="notes/:id" element={<NoteDetail />} />
                        <Route path="notes/:id/edit" element={<NoteEdit />} />
                    </Route>
                </Routes>
            </Suspense>
        </Router>
    )
}

export default App 