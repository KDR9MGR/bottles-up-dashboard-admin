import { Store, CheckCircle, XCircle, Clock } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useVendors } from "@/hooks/useSupabase";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Vendors = () => {
  const { data: vendors, loading, error } = useVendors();

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(dateStr));
  };

  const getInitials = (name: string | null, email: string) => {
    if (name) return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    return email[0].toUpperCase();
  };

  const getRoleBadge = (role: string | null) => {
    switch (role) {
      case 'admin': return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Admin</Badge>;
      case 'vendor': return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Vendor</Badge>;
      case 'promoter': return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Promoter</Badge>;
      default: return <Badge variant="secondary">{role || 'Unknown'}</Badge>;
    }
  };

  const stats = {
    total: vendors.length,
    onboarded: vendors.filter(v => v.onboarding_completed).length,
    withStripe: vendors.filter(v => v.stripe_account_id).length,
    admins: vendors.filter(v => v.role === 'admin').length,
  };

  if (error) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <main className="flex-1 p-6">
            <div className="text-center text-red-500">Error loading vendors: {error}</div>
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
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-foreground hover:bg-accent" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Vendors</h1>
              <p className="text-muted-foreground">Manage vendor accounts</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="bg-card border border-border">
                  <CardHeader className="pb-2"><Skeleton className="h-4 w-20" /></CardHeader>
                  <CardContent><Skeleton className="h-8 w-16 mb-2" /><Skeleton className="h-3 w-24" /></CardContent>
                </Card>
              ))
            ) : (
              <>
                <Card className="bg-card border border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Vendors</CardTitle>
                    <Store className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{stats.total}</div>
                    <p className="text-xs text-muted-foreground">Registered vendors</p>
                  </CardContent>
                </Card>
                <Card className="bg-card border border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Onboarded</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{stats.onboarded}</div>
                    <p className="text-xs text-muted-foreground">Completed onboarding</p>
                  </CardContent>
                </Card>
                <Card className="bg-card border border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
                    <Clock className="h-4 w-4 text-yellow-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{stats.total - stats.onboarded}</div>
                    <p className="text-xs text-muted-foreground">Awaiting onboarding</p>
                  </CardContent>
                </Card>
                <Card className="bg-card border border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Stripe Connected</CardTitle>
                    <XCircle className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{stats.withStripe}</div>
                    <p className="text-xs text-muted-foreground">Payment enabled</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Table */}
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Store className="h-5 w-5" /> All Vendors
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-muted-foreground">Vendor</TableHead>
                      <TableHead className="text-muted-foreground">Email</TableHead>
                      <TableHead className="text-muted-foreground">Phone</TableHead>
                      <TableHead className="text-muted-foreground">Role</TableHead>
                      <TableHead className="text-muted-foreground">Onboarding</TableHead>
                      <TableHead className="text-muted-foreground">Stripe</TableHead>
                      <TableHead className="text-muted-foreground">Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendors.map((vendor) => (
                      <TableRow key={vendor.id} className="border-border hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={vendor.logo_url || undefined} />
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                {getInitials(vendor.business_name, vendor.email)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-foreground">{vendor.business_name || 'No name'}</div>
                              <div className="text-xs text-muted-foreground">ID: {vendor.id.slice(0, 8)}…</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-foreground">{vendor.email}</TableCell>
                        <TableCell className="text-sm text-foreground">{vendor.phone || '—'}</TableCell>
                        <TableCell>{getRoleBadge(vendor.role)}</TableCell>
                        <TableCell>
                          {vendor.onboarding_completed
                            ? <Badge className="bg-green-100 text-green-800">Complete</Badge>
                            : <Badge variant="outline" className="text-yellow-700">Pending</Badge>}
                        </TableCell>
                        <TableCell>
                          {vendor.stripe_account_id
                            ? <Badge className="bg-blue-100 text-blue-800">Connected</Badge>
                            : <Badge variant="outline">Not connected</Badge>}
                        </TableCell>
                        <TableCell className="text-sm text-foreground">{formatDate(vendor.created_at)}</TableCell>
                      </TableRow>
                    ))}
                    {vendors.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                          No vendors found
                        </TableCell>
                      </TableRow>
                    )}
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

export default Vendors;
