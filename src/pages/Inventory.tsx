import { Package, DollarSign, TrendingUp, AlertTriangle } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useInventory, useBottleCategories } from "@/hooks/useFirestore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Inventory = () => {
  const { data: inventory, loading, error } = useInventory(50);
  const { data: categories } = useBottleCategories();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStockLevel = (stock: number, minStock: number) => {
    if (stock <= 0) return 'out-of-stock';
    if (stock <= minStock) return 'low-stock';
    if (stock <= minStock * 2) return 'medium-stock';
    return 'high-stock';
  };

  const getStockColor = (level: string) => {
    switch (level) {
      case 'out-of-stock': return 'bg-red-100 text-red-800 border-red-200';
      case 'low-stock': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'medium-stock': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'high-stock': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const stats = {
    totalItems: inventory.length,
    totalValue: inventory.reduce((sum, item) => sum + (item.price * (item.stock || item.quantity || 0)), 0),
    lowStockItems: inventory.filter(item => {
      const stock = item.stock || item.quantity || 0;
      const minStock = item.minStock || 5;
      return stock <= minStock;
    }).length,
    featuredItems: inventory.filter(item => item.featured).length,
  };

  if (error) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <main className="flex-1 p-6">
            <div className="text-center text-red-500">
              Error loading inventory: {error}
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
                <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
                <p className="text-muted-foreground">Track and manage your bottle inventory</p>
              </div>
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Add New Item
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
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Items</CardTitle>
                    <Package className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{stats.totalItems}</div>
                    <p className="text-xs text-green-500">All inventory items</p>
                  </CardContent>
                </Card>

                <Card className="bg-card border border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
                    <DollarSign className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{formatCurrency(stats.totalValue)}</div>
                    <p className="text-xs text-green-500">Inventory value</p>
                  </CardContent>
                </Card>

                <Card className="bg-card border border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{stats.lowStockItems}</div>
                    <p className="text-xs text-yellow-500">Items need restock</p>
                  </CardContent>
                </Card>

                <Card className="bg-card border border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Featured</CardTitle>
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{stats.featuredItems}</div>
                    <p className="text-xs text-blue-500">Featured items</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Inventory Table */}
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Package className="h-5 w-5" />
                Inventory Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-16 w-16 rounded" />
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
                      <TableHead className="text-muted-foreground">Product</TableHead>
                      <TableHead className="text-muted-foreground">Category</TableHead>
                      <TableHead className="text-muted-foreground">Price</TableHead>
                      <TableHead className="text-muted-foreground">Stock</TableHead>
                      <TableHead className="text-muted-foreground">Volume</TableHead>
                      <TableHead className="text-muted-foreground">Status</TableHead>
                      <TableHead className="text-muted-foreground">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventory.map((item) => {
                      const stock = item.stock || item.quantity || 0;
                      const minStock = item.minStock || 5;
                      const stockLevel = getStockLevel(stock, minStock);
                      
                      return (
                        <TableRow key={item.id} className="border-border hover:bg-muted/50">
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              {item.imageUrl ? (
                                <img 
                                  src={item.imageUrl} 
                                  alt={item.name}
                                  className="h-16 w-16 rounded object-cover"
                                />
                              ) : (
                                <div className="h-16 w-16 rounded bg-muted flex items-center justify-center">
                                  <Package className="h-8 w-8 text-muted-foreground" />
                                </div>
                              )}
                              <div>
                                <div className="font-medium text-foreground flex items-center gap-2">
                                  {item.brand} {item.name}
                                  {item.featured && (
                                    <Badge variant="secondary" className="text-xs">Featured</Badge>
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {item.description}
                                </div>
                                {item.tags && (
                                  <div className="flex gap-1 mt-1">
                                    {item.tags.slice(0, 2).map((tag, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-foreground">
                              {item.categoryId || item.category || 'Uncategorized'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-foreground">
                              {formatCurrency(item.price)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="text-foreground font-medium">{stock}</div>
                              {item.minStock && (
                                <div className="text-xs text-muted-foreground">
                                  Min: {item.minStock}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-foreground">
                              {item.volume}{item.unit || 'ml'}
                            </div>
                            {item.alcoholContent && (
                              <div className="text-xs text-muted-foreground">
                                {item.alcoholContent}% ABV
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={`${getStockColor(stockLevel)} capitalize`}
                            >
                              {stockLevel.replace('-', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
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
          </Card>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Inventory; 