import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Dashboard } from './pages/Dashboard'
import { PrivateRoute } from './components/PrivateRoute'
import { WantedList } from './pages/WantedList'
import { WantedDetail } from './pages/WantedDetail'
import { NewsFeed } from './pages/NewsFeed'
import { NewsDetail } from './pages/NewsDetail'
import { SagasList } from './pages/SagasList'
import { SagaStoryPage } from './pages/SagaStory'
import { NotFound } from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/wanted"
        element={
          <PrivateRoute>
            <WantedList />
          </PrivateRoute>
        }
      />
      <Route
        path="/wanted/:id"
        element={
          <PrivateRoute>
            <WantedDetail />
          </PrivateRoute>
        }
      />
      <Route
        path="/news"
        element={
          <PrivateRoute>
            <NewsFeed />
          </PrivateRoute>
        }
      />
      <Route
        path="/news/:id"
        element={
          <PrivateRoute>
            <NewsDetail />
          </PrivateRoute>
        }
      />
      <Route
        path="/sagas"
        element={
          <PrivateRoute>
            <SagasList />
          </PrivateRoute>
        }
      />
      <Route
        path="/sagas/:id"
        element={
          <PrivateRoute>
            <SagaStoryPage />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
