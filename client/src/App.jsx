import React, { useState } from "react"
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import Login from "./components/Login"
import Layout from "./components/Layout"
import Dashboard from "./components/Dashboard"
import UserManagement from "./components/UserManagement"
import LeadManagement from "./components/LeadManagement"
import Booking from "./components/Booking"
import Settings from "./components/Settings"
import Welcome from "../src/page/welcome"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState("")

  const handleLogin = (role) => {
    setIsAuthenticated(true)
    setUserRole(role)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUserRole("")
  }

  return (
    <Router>
      <Routes>
        <Route
         path="/"
         element={<Welcome/>}
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />}
        />
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <Layout userRole={userRole} onLogout={handleLogout}>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  {userRole === "Admin" && <Route path="/users" element={<UserManagement />} />}
                  <Route path="/leads" element={<LeadManagement />} />
                  <Route path="/booking" element={<Booking />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  )
}

export default App

