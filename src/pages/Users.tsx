import { Users as UsersIcon, UserCheck, Mail, Calendar } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useUsers } from "@/hooks/useFirestore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Users = () => {
  const { data: users, loading, error } = useUsers(50);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const stats = {
    totalUsers: users.length,
    verifiedUsers: users.filter(user => user.isEmailVerified).length,
    newUsersThisMonth: users.filter(user => {
      const userDate = new Date(user.createdAt);
      const currentDate = new Date();
      return userDate.getMonth() === currentDate.getMonth() && 
             userDate.getFullYear() === currentDate.getFullYear();
    }).length,
    activeUsers: users.filter(user => user.eventsAttended > 0).length,
  };

  if (error) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <main className="flex-1 p-6">
            <div className="text-center text-red-500">
              Error loading users: {error}
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1 p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-foreground hover:bg-accent" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">User Management</h1>
                <p className="text-muted-foreground">Manage and monitor user accounts</p>
              </div>
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Export Users
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="bg-card border border-border">
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-20" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-3 w-24" />
                  </CardContent>
                </Card>
              ))
            ) : (
              <>
                <Card className="bg-card border border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                    <UsersIcon className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{stats.totalUsers}</div>
                    <p className="text-xs text-green-500">All registered users</p>
                  </CardContent>
                </Card>

                <Card className="bg-card border border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Verified</CardTitle>
                    <UserCheck className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{stats.verifiedUsers}</div>
                    <p className="text-xs text-green-500">
                      {((stats.verifiedUsers / stats.totalUsers) * 100).toFixed(1)}% verified
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-card border border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">New This Month</CardTitle>
                    <Calendar className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{stats.newUsersThisMonth}</div>
                    <p className="text-xs text-blue-500">Recently joined</p>
                  </CardContent>
                </Card>

                <Card className="bg-card border border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
                    <Mail className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{stats.activeUsers}</div>
                    <p className="text-xs text-purple-500">With event attendance</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Users Table */}
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <UsersIcon className="h-5 w-5" />
                All Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-4 w-[150px]" />
                      </div>
                      <Skeleton className="h-4 w-[80px]" />
                      <Skeleton className="h-4 w-[60px]" />
                    </div>
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-muted-foreground">User</TableHead>
                      <TableHead className="text-muted-foreground">Email</TableHead>
                      <TableHead className="text-muted-foreground">Status</TableHead>
                      <TableHead className="text-muted-foreground">Events Attended</TableHead>
                      <TableHead className="text-muted-foreground">Rating</TableHead>
                      <TableHead className="text-muted-foreground">Joined</TableHead>
                      <TableHead className="text-muted-foreground">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} className="border-border hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={user.photoURL || undefined} />
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                {getInitials(user.displayName || user.email)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-foreground">
                                {user.displayName || 'No name'}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                ID: {user.id.slice(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-foreground">
                            {user.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Badge 
                              variant={user.isEmailVerified ? "default" : "secondary"}
                              className="w-fit"
                            >
                              {user.isEmailVerified ? 'Verified' : 'Unverified'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-foreground font-medium">
                            {user.eventsAttended}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className="text-sm text-foreground">
                              {user.rating || 0}
                            </span>
                            <span className="text-yellow-500">★</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-foreground">
                            {formatDate(user.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-border hover:bg-accent"
                            >
                              View
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Users; 