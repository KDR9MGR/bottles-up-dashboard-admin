
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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

interface Event {
  id: number;
  name: string;
  date: string;
  venue: string;
  attendees: number;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  category: string;
  description: string;
}

const initialEvents: Event[] = [
  {
    id: 1,
    name: "Wine Tasting Night",
    date: "2024-06-15",
    venue: "Downtown Cellar",
    attendees: 45,
    status: "upcoming",
    category: "Wine",
    description: "An exclusive wine tasting event featuring premium selections."
  },
  {
    id: 2,
    name: "Craft Beer Festival",
    date: "2024-06-20",
    venue: "City Park",
    attendees: 200,
    status: "upcoming",
    category: "Beer",
    description: "Annual craft beer festival with local breweries."
  },
  {
    id: 3,
    name: "Cocktail Masterclass",
    date: "2024-06-10",
    venue: "Mixology Bar",
    attendees: 30,
    status: "completed",
    category: "Cocktails",
    description: "Learn to make professional cocktails from expert bartenders."
  },
  {
    id: 4,
    name: "Whiskey Appreciation",
    date: "2024-06-25",
    venue: "The Barrel Room",
    attendees: 60,
    status: "upcoming",
    category: "Whiskey",
    description: "Discover the art of whiskey tasting and pairing."
  },
];

export function EventsTable() {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    name: "",
    date: "",
    venue: "",
    attendees: 0,
    status: "upcoming",
    category: "",
    description: ""
  });

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setNewEvent(event);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingEvent) {
      setEvents(events.map(e => e.id === editingEvent.id ? { ...newEvent as Event, id: editingEvent.id } : e));
      toast({
        title: "Event Updated",
        description: "Event has been successfully updated.",
      });
    } else {
      const id = Math.max(...events.map(e => e.id)) + 1;
      setEvents([...events, { ...newEvent as Event, id }]);
      toast({
        title: "Event Created",
        description: "New event has been successfully created.",
      });
    }
    setIsDialogOpen(false);
    setEditingEvent(null);
    setNewEvent({
      name: "",
      date: "",
      venue: "",
      attendees: 0,
      status: "upcoming",
      category: "",
      description: ""
    });
  };

  const handleDelete = (id: number) => {
    setEvents(events.filter(e => e.id !== id));
    toast({
      title: "Event Deleted",
      description: "Event has been successfully deleted.",
      variant: "destructive"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming": return "bg-blue-500";
      case "ongoing": return "bg-green-500";
      case "completed": return "bg-gray-500";
      case "cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <Card className="bg-card border border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-foreground">Events Management</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => {
                setEditingEvent(null);
                setNewEvent({
                  name: "",
                  date: "",
                  venue: "",
                  attendees: 0,
                  status: "upcoming",
                  category: "",
                  description: ""
                });
              }}
            >
              Add New Event
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border border-border max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                {editingEvent ? "Edit Event" : "Create New Event"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-foreground">Event Name</Label>
                  <Input
                    id="name"
                    value={newEvent.name || ""}
                    onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
                    className="bg-input border-border text-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor="date" className="text-foreground">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newEvent.date || ""}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                    className="bg-input border-border text-foreground"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="venue" className="text-foreground">Venue</Label>
                  <Input
                    id="venue"
                    value={newEvent.venue || ""}
                    onChange={(e) => setNewEvent({...newEvent, venue: e.target.value})}
                    className="bg-input border-border text-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor="attendees" className="text-foreground">Max Attendees</Label>
                  <Input
                    id="attendees"
                    type="number"
                    value={newEvent.attendees || 0}
                    onChange={(e) => setNewEvent({...newEvent, attendees: parseInt(e.target.value) || 0})}
                    className="bg-input border-border text-foreground"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category" className="text-foreground">Category</Label>
                  <Input
                    id="category"
                    value={newEvent.category || ""}
                    onChange={(e) => setNewEvent({...newEvent, category: e.target.value})}
                    className="bg-input border-border text-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor="status" className="text-foreground">Status</Label>
                  <Select 
                    value={newEvent.status || "upcoming"} 
                    onValueChange={(value) => setNewEvent({...newEvent, status: value as Event["status"]})}
                  >
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
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
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="border-border text-foreground hover:bg-accent"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {editingEvent ? "Update" : "Create"} Event
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-muted/50">
                <TableHead className="text-muted-foreground">Event Name</TableHead>
                <TableHead className="text-muted-foreground">Date</TableHead>
                <TableHead className="text-muted-foreground">Venue</TableHead>
                <TableHead className="text-muted-foreground">Attendees</TableHead>
                <TableHead className="text-muted-foreground">Category</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id} className="border-border hover:bg-muted/50">
                  <TableCell className="font-medium text-foreground">{event.name}</TableCell>
                  <TableCell className="text-foreground">{event.date}</TableCell>
                  <TableCell className="text-foreground">{event.venue}</TableCell>
                  <TableCell className="text-foreground">{event.attendees}</TableCell>
                  <TableCell className="text-foreground">{event.category}</TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(event.status)} text-white`}>
                      {event.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(event)}
                        className="border-border text-foreground hover:bg-accent"
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(event.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
