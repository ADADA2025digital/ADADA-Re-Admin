import { useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Dashboard } from "@/pages/Dashboard"
import { Properties as Products } from "@/pages/Properties"
import { Analytics } from "@/pages/Analytics"
import { Orders } from "@/pages/Orders"
import { Customers } from "@/pages/Customers"
import { Inventory } from "@/pages/Inventory"
import { Marketing } from "@/pages/Marketing"
import { Reports } from "@/pages/Reports"
import { Staff } from "@/pages/Staff"
import { Roles } from "@/pages/Roles"
import { Settings } from "@/pages/Settings"
import { Support } from "@/pages/Support"
import { Profile } from "@/pages/Profile"
import { Notifications } from "@/pages/Notifications"
import { Login } from "@/pages/Login"
import { PropertyTypes } from "@/pages/PropertyTypes"
import { PropertyAgents } from "@/pages/PropertyAgents"
import { Contacts } from "@/pages/Contacts"
import { AgentMessages } from "@/pages/AgentMessages"
import { NotFound } from "@/pages/NotFound"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { Toaster } from "@/components/ui/sonner"

function App() {
  useEffect(() => {
    const theme = localStorage.getItem("theme")
    if (theme === "dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Dashboard Routes */}
        <Route path="/*" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/properties" element={<Products />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/marketing" element={<Marketing />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/staff" element={<Staff />} />
                <Route path="/roles" element={<Roles />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/support" element={<Support />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/property-types" element={<PropertyTypes />} />
                <Route path="/property-agents" element={<PropertyAgents />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/agent-messages" element={<AgentMessages />} />
                
                {/* 404 Route for unmatched paths inside dashboard */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </DashboardLayout>
          </ProtectedRoute>
        } />
      </Routes>
      <Toaster richColors position="top-right" />
    </BrowserRouter>
  )
}

export default App
