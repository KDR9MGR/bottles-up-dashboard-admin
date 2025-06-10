
import { Calendar, ChartBar, User, Settings } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { StatsCard } from "@/components/StatsCard";
import { EventsChart } from "@/components/EventsChart";
import { EventsTable } from "@/components/EventsTable";

const Index = () => {
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
                <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back to your event management panel</p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Events"
              value="248"
              change="+12.5%"
              icon={Calendar}
              trend="up"
            />
            <StatsCard
              title="Active Users"
              value="1,234"
              change="+8.2%"
              icon={User}
              trend="up"
            />
            <StatsCard
              title="Revenue"
              value="$45,678"
              change="+15.3%"
              icon={ChartBar}
              trend="up"
            />
            <StatsCard
              title="Avg. Rating"
              value="4.8"
              change="+0.2"
              icon={Settings}
              trend="up"
            />
          </div>

          {/* Charts */}
          <EventsChart />

          {/* Events Table */}
          <EventsTable />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
