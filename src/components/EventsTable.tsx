import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useEvents } from "@/hooks/useFirestore";
import { Event } from "@/types/firestore";
import { CalendarDays, MapPin, Users } from "lucide-react";

export function EventsTable() {
  const { data: events, loading, error } = useEvents(20);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: "",
    venue: "",
    capacity: 0,
    bookedSeats: 0,
    status: "active",
    description: "",
    featured: false,
    price: 0,
  });

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setNewEvent(event);
    setIsDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 border-green-200";
      case "inactive": return "bg-gray-100 text-gray-800 border-gray-200";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getOccupancyPercentage = (booked: number, capacity: number) => {
    return capacity > 0 ? (booked / capacity) * 100 : 0;
  };

  const getOccupancyColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 70) return "text-yellow-600";
    return "text-green-600";
  };

  if (error) {
    return (
      <Card className="bg-card border border-border">
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            Error loading events: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-foreground flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Events Management
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and monitor all events
          </p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={() => {
            setEditingEvent(null);
            setNewEvent({
              title: "",
              venue: "",
              capacity: 0,
              bookedSeats: 0,
              status: "active",
              description: "",
              featured: false,
              price: 0,
            });
            setIsDialogOpen(true);
          }}
        >
          Add New Event
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[80px]" />
              </div>
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground">Event</TableHead>
                <TableHead className="text-muted-foreground">Date & Venue</TableHead>
                <TableHead className="text-muted-foreground">Occupancy</TableHead>
                <TableHead className="text-muted-foreground">Price</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => {
                const occupancyPercentage = getOccupancyPercentage(event.bookedSeats, event.capacity);
                return (
                  <TableRow key={event.id} className="border-border hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <div className="font-medium text-foreground flex items-center gap-2">
                          {event.title}
                          {event.featured && (
                            <Badge variant="secondary" className="text-xs">Featured</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                          {event.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm text-foreground flex items-center gap-1">
                          <CalendarDays className="h-3 w-3" />
                          {formatDate(event.date)}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.venue}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Users className="h-3 w-3" />
                          <span className={getOccupancyColor(occupancyPercentage)}>
                            {event.bookedSeats}/{event.capacity}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {occupancyPercentage.toFixed(1)}% full
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-foreground">
                        {formatCurrency(event.price)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`${getStatusColor(event.status)} capitalize`}
                      >
                        {event.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(event)}
                          className="border-border hover:bg-accent"
                        >
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card border border-border max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {editingEvent ? "Edit Event" : "Create New Event"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title" className="text-foreground">Event Title</Label>
                <Input
                  id="title"
                  value={newEvent.title || ""}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="venue" className="text-foreground">Venue</Label>
                <Input
                  id="venue"
                  value={newEvent.venue || ""}
                  onChange={(e) => setNewEvent({...newEvent, venue: e.target.value})}
                  className="bg-input border-border text-foreground"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price" className="text-foreground">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={newEvent.price || 0}
                  onChange={(e) => setNewEvent({...newEvent, price: parseFloat(e.target.value)})}
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="capacity" className="text-foreground">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={newEvent.capacity || 0}
                  onChange={(e) => setNewEvent({...newEvent, capacity: parseInt(e.target.value)})}
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="status" className="text-foreground">Status</Label>
                <Select 
                  value={newEvent.status} 
                  onValueChange={(value) => setNewEvent({...newEvent, status: value})}
                >
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="description" className="text-foreground">Description</Label>
              <Textarea
                id="description"
                value={newEvent.description || ""}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                className="bg-input border-border text-foreground"
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                checked={newEvent.featured || false}
                onChange={(e) => setNewEvent({...newEvent, featured: e.target.checked})}
                className="rounded border-border"
              />
              <Label htmlFor="featured" className="text-foreground">Featured Event</Label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              className="border-border hover:bg-accent"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                toast({
                  title: "Note",
                  description: "This is a demo. Real database operations would be implemented here.",
                });
                setIsDialogOpen(false);
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {editingEvent ? "Update" : "Create"} Event
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
