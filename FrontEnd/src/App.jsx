/**
 * APP.JSX - MAIN APPLICATION FILE
 * ================================
 * 
 * PURPOSE:
 * This is the main entry point of our React application.
 * It sets up routing using React Router so users can navigate between different pages.
 * 
 * ROUTING STRUCTURE:
 * 1. /login → Shows Login page (Sign In)
 * 2. /signup → Shows Signup page (Create Account)
 * 3. / (root) → Automatically redirects to /login
 * 
 * HOW ROUTING WORKS:
 * - <Router> wraps the entire app to enable navigation
 * - <Routes> defines all available routes
 * - <Route> sets path and which component to show
 * - <Navigate> redirects from one path to another
 * 
 * FLOW:
 * User visits app → Root path "/" → Gets redirected to "/login" → Login page shows
 * OR
 * User clicks "Sign Up" link → Goes to "/signup" → Signup page shows
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import Nutrition from './pages/Nutrition'
import Vaccines from './pages/Vaccines'
import Feeding from './pages/Feeding'
import Growth from './pages/Growth'
import StageSelect from './pages/StageSelect'
import './App.css'

/**
 * APP COMPONENT
 * =============
 * Main component that sets up routing for the entire application
 */
function App() {
  return (
    // Router: Enables all React Router functionality
    <Router>
      {/* Routes: Container for all route definitions */}
      <Routes>
        {/* Route 0: Welcome / Stage selection */}
        <Route path="/welcome" element={<StageSelect />} />

        {/* Route 1: Home Page (Dashboard) */}
        {/* Path: /home → Shows <Home /> component */}
        <Route path="/home" element={<Home />} />
        
        {/* Route 2: Login Page */}
        {/* Path: /login → Shows <Login /> component */}
        <Route path="/login" element={<Login />} />
        
        {/* Route 3: Signup Page */}
        {/* Path: /signup → Shows <Signup /> component */}
        <Route path="/signup" element={<Signup />} />

        {/* Route 4: Nutrition Page */}
        {/* Path: /nutrition → Shows <Nutrition /> component */}
        <Route path="/nutrition" element={<Nutrition />} />

        {/* Route 5: Vaccines Page */}
        {/* Path: /vaccines → Shows <Vaccines /> component */}
        <Route path="/vaccines" element={<Vaccines />} />

        {/* Route 6: Feeding Page */}
        {/* Path: /feeding → Shows <Feeding /> component */}
        <Route path="/feeding" element={<Feeding />} />

        {/* Route 7: Growth Page */}
        {/* Path: /growth → Shows <Growth /> component */}
        <Route path="/growth" element={<Growth />} />
        
        {/* Route 8: Root Path Redirect */}
        {/* Path: / (any other path) → Redirect to /login */}
        {/* replace: replaces history entry so user can't go back to "/" */}
        <Route path="/" element={<Navigate to="/welcome" replace />} />
        <Route path="*" element={<Navigate to="/welcome" replace />} />
      </Routes>
    </Router>
  )
}

export default App
