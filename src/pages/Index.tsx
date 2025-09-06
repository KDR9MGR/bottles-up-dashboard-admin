import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, Users, Building2, Store, AlertCircle, LogOut, User } from "lucide-react"
import { useDashboardStats, useIsAdmin } from "@/hooks/useSupabase"
import { useAuth } from '../hooks/useAuth'
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useState } from "react"
import Sidebar from "@/components/Sidebar"

const Index = () => {
  const { stats, loading, error } = useDashboardStats()
  const { isAdmin, loading: adminLoading } = useIsAdmin()
  const { user, signOut } = useAuth()
  const [loggingOut, setLoggingOut] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const isLoading = loading || adminLoading

  // Show error if not admin
  if (!adminLoading && !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <Alert className="max-w-md bg-gray-900 border-gray-800">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-gray-300">
            Access denied. You need admin privileges to view this dashboard.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Show error if there's a data fetching error
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <Alert className="max-w-md bg-gray-900 border-gray-800">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-gray-300">
            Error loading dashboard data: {error}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        <div className="p-4 lg:p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl lg:text-3xl font-bold text-white">Admin Dashboard</h1>
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-400">
                  <User className="h-4 w-4" />
                  <span>{user?.email}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    setLoggingOut(true)
                    try {
                      await signOut()
                    } catch (error) {
                      console.error('Logout error:', error)
                    } finally {
                      setLoggingOut(false)
                    }
                  }}
                  disabled={loggingOut}
                  className="flex items-center space-x-2 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">{loggingOut ? 'Signing out...' : 'Sign Out'}</span>
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {/* Total Users Card */}
              <Card className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {isLoading ? (
                      <Skeleton className="h-8 w-16 bg-gray-700" />
                    ) : (
                      stats.totalUsers.toLocaleString()
                    )}
                  </div>
                  <CardDescription className="text-xs text-gray-400">
                    Registered users in the system
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Total Vendors Card */}
              <Card className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Total Vendors</CardTitle>
                  <Store className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {isLoading ? (
                      <Skeleton className="h-8 w-16 bg-gray-700" />
                    ) : (
                      stats.totalVendors.toLocaleString()
                    )}
                  </div>
                  <CardDescription className="text-xs text-gray-400">
                    Active vendors on the platform
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Total Clubs Card */}
              <Card className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Total Clubs</CardTitle>
                  <Building2 className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {isLoading ? (
                      <Skeleton className="h-8 w-16 bg-gray-700" />
                    ) : (
                      stats.totalClubs.toLocaleString()
                    )}
                  </div>
                  <CardDescription className="text-xs text-gray-400">
                    Registered clubs in the system
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Total Events Card */}
              <Card className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Total Events</CardTitle>
                  <CalendarDays className="h-4 w-4 text-orange-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {isLoading ? (
                      <Skeleton className="h-8 w-16 bg-gray-700" />
                    ) : (
                      stats.totalEvents.toLocaleString()
                    )}
                  </div>
                  <CardDescription className="text-xs text-gray-400">
                    Total events created
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            {/* Additional Info Card */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Dashboard Overview</CardTitle>
                <CardDescription className="text-gray-400">
                  Welcome to the Bottles Up admin dashboard. Here you can view key metrics and manage your platform.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-400">
                  <p>This dashboard shows real-time data from your Supabase database.</p>
                  <p className="mt-2">Access is restricted to admin users only.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Index
