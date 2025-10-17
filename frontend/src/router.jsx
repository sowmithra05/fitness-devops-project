import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Activities from './pages/Activities'
import Goals from './pages/Goals'
import Progress from './pages/Progress'
import Nutrition from './pages/Nutrition'
import Login from './pages/Login'
import Signup from './pages/Signup'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Dashboard /> },
      { path: '/profile', element: <Profile /> },
      { path: '/activities', element: <Activities /> },
      { path: '/goals', element: <Goals /> },
      { path: '/progress', element: <Progress /> },
      { path: '/nutrition', element: <Nutrition /> },
      { path: '/login', element: <Login /> },
      { path: '/signup', element: <Signup /> }
    ]
  }
])