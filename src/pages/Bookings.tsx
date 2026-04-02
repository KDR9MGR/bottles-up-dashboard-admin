import { BookOpen, Building2, CalendarDays, DollarSign } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useClubsBookings, useEventsBookings } from "@/hooks/useSupabase";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const statusClass: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-800 border-green-200',
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
  completed: 'bg-blue-100 text-blue-800 border-blue-200',
};

const StatusBadge = ({ status }: { status: string | null }) => {
  const cls = statusClass[status?.toLowerCase() ?? ''] ?? '';
  return <Badge variant="outline" className={`${cls} capitalize`}>{status || 'Unknown'}</Badge>;
};

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return '—';
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(dateStr));
};

const formatCurrency = (amount: number | null) => {
  if (amount == null) return '—';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const Bookings = () => {
  const { data: clubBookings, loading: clubLoading, error: clubError } = useClubsBookings();
  const { data: eventBookings, loading: eventLoading, error: eventError } = useEventsBookings();

  const loading = clubLoading || eventLoading;
  const error = clubError || eventError;

  const totalRevenue =
    clubBookings.reduce((s, b) => s + (b.total_amount ?? 0), 0) +
    eventBookings.reduce((s, b) => s + (b.total_amount ?? 0), 0);

  const confirmedCount =
    clubBookings.filter(b => b.status === 'confirmed').length +
    eventBookings.filter(b => b.status === 'confirmed').length;

  if (error) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <main className="flex-1 p-6">
            <div className="text-center text-red-500">Error loading bookings: {error}</div>
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
              <h1 className="text-3xl font-bold text-foreground">Bookings</h1>
              <p className="text-muted-foreground">Club and event booking management</p>
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
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
                    <BookOpen className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{clubBookings.length + eventBookings.length}</div>
                    <p className="text-xs text-muted-foreground">All time</p>
                  </CardContent>
                </Card>
                <Card className="bg-card border border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Club Bookings</CardTitle>
                    <Building2 className="h-4 w-4 text-purple-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{clubBookings.length}</div>
                    <p className="text-xs text-muted-foreground">Club reservations</p>
                  </CardContent>
                </Card>
                <Card className="bg-card border border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Event Bookings</CardTitle>
                    <CalendarDays className="h-4 w-4 text-orange-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{eventBookings.length}</div>
                    <p className="text-xs text-muted-foreground">Event tickets</p>
                  </CardContent>
                </Card>
                <Card className="bg-card border border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{formatCurrency(totalRevenue)}</div>
                    <p className="text-xs text-muted-foreground">{confirmedCount} confirmed</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="clubs">
            <TabsList>
              <TabsTrigger value="clubs">Club Bookings ({clubBookings.length})</TabsTrigger>
              <TabsTrigger value="events">Event Bookings ({eventBookings.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="clubs">
              <Card className="bg-card border border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Building2 className="h-5 w-5" /> Club Bookings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {clubLoading ? (
                    <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border">
                          <TableHead className="text-muted-foreground">Confirmation</TableHead>
                          <TableHead className="text-muted-foreground">Contact</TableHead>
                          <TableHead className="text-muted-foreground">Date</TableHead>
                          <TableHead className="text-muted-foreground">Guests</TableHead>
                          <TableHead className="text-muted-foreground">Type</TableHead>
                          <TableHead className="text-muted-foreground">Amount</TableHead>
                          <TableHead className="text-muted-foreground">Payment</TableHead>
                          <TableHead className="text-muted-foreground">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clubBookings.map((b) => (
                          <TableRow key={b.id} className="border-border hover:bg-muted/50">
                            <TableCell className="text-sm font-mono text-foreground">{b.confirmation_code || b.id.slice(0, 8)}</TableCell>
                            <TableCell>
                              <div className="text-sm text-foreground">{b.contact_email || '—'}</div>
                              {b.contact_phone && <div className="text-xs text-muted-foreground">{b.contact_phone}</div>}
                            </TableCell>
                            <TableCell className="text-sm text-foreground">{formatDate(b.booking_date)}</TableCell>
                            <TableCell className="text-sm text-foreground">{b.guest_count ?? '—'}</TableCell>
                            <TableCell className="text-sm text-foreground capitalize">{b.booking_type || '—'}</TableCell>
                            <TableCell className="text-sm text-foreground">{formatCurrency(b.total_amount)}</TableCell>
                            <TableCell><StatusBadge status={b.payment_status} /></TableCell>
                            <TableCell><StatusBadge status={b.status} /></TableCell>
                          </TableRow>
                        ))}
                        {clubBookings.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center text-muted-foreground py-8">No club bookings found</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="events">
              <Card className="bg-card border border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <CalendarDays className="h-5 w-5" /> Event Bookings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {eventLoading ? (
                    <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border">
                          <TableHead className="text-muted-foreground">Confirmation</TableHead>
                          <TableHead className="text-muted-foreground">Contact</TableHead>
                          <TableHead className="text-muted-foreground">Date</TableHead>
                          <TableHead className="text-muted-foreground">Tickets</TableHead>
                          <TableHead className="text-muted-foreground">Amount</TableHead>
                          <TableHead className="text-muted-foreground">Payment</TableHead>
                          <TableHead className="text-muted-foreground">Check-in</TableHead>
                          <TableHead className="text-muted-foreground">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {eventBookings.map((b) => (
                          <TableRow key={b.id} className="border-border hover:bg-muted/50">
                            <TableCell className="text-sm font-mono text-foreground">{b.confirmation_code || b.id.slice(0, 8)}</TableCell>
                            <TableCell>
                              <div className="text-sm text-foreground">{b.contact_email || '—'}</div>
                              {b.contact_phone && <div className="text-xs text-muted-foreground">{b.contact_phone}</div>}
                            </TableCell>
                            <TableCell className="text-sm text-foreground">{formatDate(b.booking_date)}</TableCell>
                            <TableCell className="text-sm text-foreground">{b.ticket_quantity ?? '—'}</TableCell>
                            <TableCell className="text-sm text-foreground">{formatCurrency(b.total_amount)}</TableCell>
                            <TableCell><StatusBadge status={b.payment_status} /></TableCell>
                            <TableCell className="text-sm text-foreground">{b.check_in_time ? formatDate(b.check_in_time) : '—'}</TableCell>
                            <TableCell><StatusBadge status={b.status} /></TableCell>
                          </TableRow>
                        ))}
                        {eventBookings.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center text-muted-foreground py-8">No event bookings found</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Bookings;
