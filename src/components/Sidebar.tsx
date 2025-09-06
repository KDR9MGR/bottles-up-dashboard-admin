import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Users,
  Store,
  Building2,
  CalendarDays,
  Menu,
  X,
  Home,
  ChevronRight
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import SidePanel from './SidePanel';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'email' | 'select';
  options?: string[];
}

interface TableRow {
  id: string;
  [key: string]: any;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openPanel, setOpenPanel] = useState<string | null>(null);

  // Sample data for different panels
  const usersData: TableRow[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'active' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'user', status: 'inactive' }
  ];

  const vendorsData: TableRow[] = [
    { id: '1', name: 'ABC Supplies', contact: 'contact@abc.com', category: 'Electronics', status: 'active' },
    { id: '2', name: 'XYZ Corp', contact: 'info@xyz.com', category: 'Furniture', status: 'pending' }
  ];

  const clubsData: TableRow[] = [
    { id: '1', name: 'Tech Club', members: '25', category: 'Technology', status: 'active' },
    { id: '2', name: 'Sports Club', members: '40', category: 'Sports', status: 'active' }
  ];

  const eventsData: TableRow[] = [
    { id: '1', title: 'Annual Meeting', date: '2024-02-15', location: 'Main Hall', status: 'upcoming' },
    { id: '2', title: 'Workshop', date: '2024-02-20', location: 'Room 101', status: 'planning' }
  ];

  // Column definitions for different panels
  const usersColumns: TableColumn[] = [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'role', label: 'Role', type: 'select', options: ['admin', 'user', 'moderator'] },
    { key: 'status', label: 'Status', type: 'select', options: ['active', 'inactive', 'pending'] }
  ];

  const vendorsColumns: TableColumn[] = [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'contact', label: 'Contact', type: 'email' },
    { key: 'category', label: 'Category', type: 'select', options: ['Electronics', 'Furniture', 'Supplies', 'Services'] },
    { key: 'status', label: 'Status', type: 'select', options: ['active', 'pending', 'inactive'] }
  ];

  const clubsColumns: TableColumn[] = [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'members', label: 'Members', type: 'text' },
    { key: 'category', label: 'Category', type: 'select', options: ['Technology', 'Sports', 'Arts', 'Academic'] },
    { key: 'status', label: 'Status', type: 'select', options: ['active', 'inactive'] }
  ];

  const eventsColumns: TableColumn[] = [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'date', label: 'Date', type: 'text' },
    { key: 'location', label: 'Location', type: 'text' },
    { key: 'status', label: 'Status', type: 'select', options: ['upcoming', 'planning', 'completed', 'cancelled'] }
  ];

  const handlePanelToggle = (panelType: string) => {
    setOpenPanel(openPanel === panelType ? null : panelType);
  };

  const handleSave = (panelType: string, row: TableRow) => {
    console.log(`Saving ${panelType}:`, row);
    // Here you would typically make an API call to save the data
  };

  const handleDelete = (panelType: string, id: string) => {
    console.log(`Deleting ${panelType} with id:`, id);
    // Here you would typically make an API call to delete the data
  };

  const handleAdd = (panelType: string, row: Omit<TableRow, 'id'>) => {
    console.log(`Adding new ${panelType}:`, row);
    // Here you would typically make an API call to add the data
  };

  const getPanelData = (panelType: string) => {
    switch (panelType) {
      case 'users': return { data: usersData, columns: usersColumns };
      case 'vendors': return { data: vendorsData, columns: vendorsColumns };
      case 'clubs': return { data: clubsData, columns: clubsColumns };
      case 'events': return { data: eventsData, columns: eventsColumns };
      default: return { data: [], columns: [] };
    }
  };

  const navigationItems = [
    {
      title: 'Dashboard',
      icon: Home,
      path: '/',
      description: 'Overview and analytics',
      panelType: null
    },
    {
      title: 'Users',
      icon: Users,
      path: '/users',
      description: 'Manage user accounts',
      panelType: 'users'
    },
    {
      title: 'Vendors',
      icon: Store,
      path: '/vendors',
      description: 'Vendor management',
      panelType: 'vendors'
    },
    {
      title: 'Clubs',
      icon: Building2,
      path: '/clubs',
      description: 'Club administration',
      panelType: 'clubs'
    },
    {
      title: 'Events',
      icon: CalendarDays,
      path: '/events',
      description: 'Event management',
      panelType: 'events'
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 z-50 h-full bg-gray-900 border-r border-gray-800 transition-all duration-300 ease-in-out",
        "lg:relative lg:translate-x-0",
        isCollapsed ? "-translate-x-full lg:w-16" : "translate-x-0 w-64"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          {!isCollapsed && (
            <h2 className="text-xl font-bold text-white">Bottles Up</h2>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <div key={item.path} className="flex items-center">
                <Button
                  variant="ghost"
                  className={cn(
                    "flex-1 justify-start text-left transition-colors",
                    "text-gray-300 hover:text-white hover:bg-gray-800",
                    isActive && "bg-gray-800 text-white",
                    isCollapsed ? "px-2" : "px-3"
                  )}
                  onClick={() => handleNavigation(item.path)}
                >
                  <Icon className={cn("h-4 w-4", isCollapsed ? "" : "mr-3")} />
                  {!isCollapsed && (
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{item.title}</span>
                      <span className="text-xs text-gray-400">{item.description}</span>
                    </div>
                  )}
                </Button>
                {!isCollapsed && item.panelType && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePanelToggle(item.panelType!)}
                    className={cn(
                      "ml-2 p-1 transition-colors",
                      openPanel === item.panelType
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "text-gray-400 hover:bg-gray-700 hover:text-white"
                    )}
                    title={`Open ${item.title} Panel`}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="text-xs text-gray-500 text-center">
              Admin Dashboard v1.0
            </div>
          </div>
        )}
      </div>

      {/* Side Panels */}
      {openPanel && (
        <SidePanel
          isOpen={!!openPanel}
          onClose={() => setOpenPanel(null)}
          title={navigationItems.find(item => item.panelType === openPanel)?.title || ''}
          columns={getPanelData(openPanel).columns}
          data={getPanelData(openPanel).data}
          onSave={(row) => handleSave(openPanel, row)}
          onDelete={(id) => handleDelete(openPanel, id)}
          onAdd={(row) => handleAdd(openPanel, row)}
        />
      )}
    </>
  );
};

export default Sidebar;