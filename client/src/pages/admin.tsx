import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { ArrowLeft, Users, Calendar, Utensils, Image, Phone, Clock, Settings, Grid3x3, MapPin, RefreshCw, Columns, Check, X } from "lucide-react";
import type { Booking, Table, MenuCategory, MenuItem, GalleryImage, ContactInfo, OpeningHours, SystemSetting, RestaurantLocation } from "@shared/schema";
import TableManagement from "@/components/TableManagement";
import LocationManagement from "@/components/LocationManagement";
import FloorPlanElementsManagement from "@/components/FloorPlanElementsManagement";

export default function Admin() {
  const { user, isLoading } = useAuth();
  const isAuthenticated = !!user;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Booking list view column selection state
  const [visibleColumns, setVisibleColumns] = useState({
    customerName: true,
    customerEmail: true,
    customerPhone: false,
    date: true,
    time: true,
    partySize: true,
    status: true,
    specialRequests: false,
    tableId: true,
    locationId: true,
    createdAt: false,
  });

  // Remove useEffect redirects - handled by render logic below

  const { data: bookings, isLoading: bookingsLoading } = useQuery<Booking[]>({
    queryKey: ["/api/admin/bookings"],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const { data: tables, isLoading: tablesLoading } = useQuery<Table[]>({
    queryKey: ["/api/tables"],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const { data: menuCategories } = useQuery<MenuCategory[]>({
    queryKey: ["/api/menu/categories"],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const { data: menuItems } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu/items"],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const { data: galleryImages } = useQuery<GalleryImage[]>({
    queryKey: ["/api/gallery"],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const { data: contactInfo } = useQuery<ContactInfo[]>({
    queryKey: ["/api/contact"],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const { data: openingHours } = useQuery<OpeningHours[]>({
    queryKey: ["/api/hours"],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const { data: registrationSetting } = useQuery<SystemSetting>({
    queryKey: ["/api/admin/settings/registration_enabled"],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const { data: locations } = useQuery<RestaurantLocation[]>({
    queryKey: ["/api/locations"],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  // Booking status update mutation
  const updateBookingStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiRequest("PATCH", `/api/admin/bookings/${id}`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/bookings"] });
      toast({
        title: "Success",
        description: "Booking status updated successfully",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to update booking status",
        variant: "destructive",
      });
    },
  });

  // Menu Category mutations
  const createCategoryMutation = useMutation({
    mutationFn: async (categoryData: { name: string; displayOrder: number }) => {
      const response = await apiRequest("POST", "/api/admin/menu/categories", categoryData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu/categories"] });
      toast({
        title: "Success",
        description: "Menu category created successfully.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/auth";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create menu category.",
        variant: "destructive",
      });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/admin/menu/categories/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu/categories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/menu/items"] });
      toast({
        title: "Success",
        description: "Menu category deleted successfully.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/auth";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete menu category.",
        variant: "destructive",
      });
    },
  });

  // Menu Item mutations
  const createItemMutation = useMutation({
    mutationFn: async (itemData: { categoryId: string; name: string; description: string; price: string; displayOrder: number }) => {
      const response = await apiRequest("POST", "/api/admin/menu/items", itemData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu/items"] });
      toast({
        title: "Success",
        description: "Menu item created successfully.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/auth";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create menu item.",
        variant: "destructive",
      });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/admin/menu/items/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu/items"] });
      toast({
        title: "Success",
        description: "Menu item deleted successfully.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/auth";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete menu item.",
        variant: "destructive",
      });
    },
  });

  const createTableMutation = useMutation({
    mutationFn: async (tableData: { name: string; capacity: number; xPosition: number; yPosition: number }) => {
      const response = await apiRequest("POST", "/api/admin/tables", tableData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tables"] });
      toast({
        title: "Success",
        description: "Table created successfully.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/auth";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create table.",
        variant: "destructive",
      });
    },
  });

  // Contact info mutations
  const createContactMutation = useMutation({
    mutationFn: async (contactData: { type: string; label: string; value: string; displayOrder: number }) => {
      const response = await apiRequest("POST", "/api/admin/contact", contactData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contact"] });
      toast({
        title: "Success",
        description: "Contact information created successfully.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/auth";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create contact information.",
        variant: "destructive",
      });
    },
  });

  const deleteContactMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/admin/contact/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contact"] });
      toast({
        title: "Success",
        description: "Contact information deleted successfully.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/auth";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete contact information.",
        variant: "destructive",
      });
    },
  });

  // Opening hours mutations
  const createHoursMutation = useMutation({
    mutationFn: async (hoursData: { dayOfWeek: number; dayName: string; openTime: string; closeTime: string; isClosed: boolean }) => {
      const response = await apiRequest("POST", "/api/admin/hours", hoursData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hours"] });
      toast({
        title: "Success",
        description: "Opening hours created successfully.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/auth";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create opening hours.",
        variant: "destructive",
      });
    },
  });

  const updateHoursMutation = useMutation({
    mutationFn: async ({ id, ...hoursData }: { id: string; openTime: string; closeTime: string; isClosed: boolean }) => {
      const response = await apiRequest("PUT", `/api/admin/hours/${id}`, hoursData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hours"] });
      toast({
        title: "Success",
        description: "Opening hours updated successfully.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/auth";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update opening hours.",
        variant: "destructive",
      });
    },
  });

  // Settings mutations
  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value, description }: { key: string; value: string; description?: string }) => {
      const response = await apiRequest("POST", "/api/admin/settings", { key, value, description });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings/registration_enabled"] });
      toast({
        title: "Success",
        description: "Setting updated successfully.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/auth";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update setting.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-calluna-cream">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-calluna-brown mx-auto mb-4"></div>
          <p className="text-calluna-charcoal">Loading...</p>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-calluna-cream">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-calluna-brown mx-auto"></div>
          <p className="mt-4 text-calluna-charcoal">Loading...</p>
        </div>
      </div>
    );
  }

  // Show access denied for non-admin users
  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-calluna-cream">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="text-center">
              <h1 className="text-2xl font-playfair font-bold text-calluna-brown mb-4">Access Denied</h1>
              <p className="text-calluna-charcoal mb-6">Admin access required to view this page.</p>
              <Link href="/">
                <Button className="bg-calluna-brown hover:bg-calluna-orange">
                  Return Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-calluna-cream">
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Site
                </Button>
              </Link>
              <h1 className="text-2xl font-playfair font-bold text-calluna-brown">Admin Panel</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-calluna-charcoal">Welcome, {user.firstName}</span>
              <Button variant="outline" onClick={() => window.location.href = "/api/auth/logout"}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="grid w-full grid-cols-9">
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="tables" className="flex items-center gap-2">
              <Grid3x3 className="h-4 w-4" />
              Tables
            </TabsTrigger>
            <TabsTrigger value="tableManagement" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Table Mgmt
            </TabsTrigger>
            <TabsTrigger value="locations" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Locations
            </TabsTrigger>
            <TabsTrigger value="menu" className="flex items-center gap-2">
              <Utensils className="h-4 w-4" />
              Menu
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Gallery
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Contact
            </TabsTrigger>
            <TabsTrigger value="hours" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Hours
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-calluna-brown">Recent Bookings</CardTitle>
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <Columns className="h-4 w-4" />
                          Columns
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Show Columns</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem
                          checked={visibleColumns.customerName}
                          onCheckedChange={(checked) => 
                            setVisibleColumns(prev => ({ ...prev, customerName: checked }))
                          }
                        >
                          Customer Name
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={visibleColumns.customerEmail}
                          onCheckedChange={(checked) => 
                            setVisibleColumns(prev => ({ ...prev, customerEmail: checked }))
                          }
                        >
                          Email
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={visibleColumns.customerPhone}
                          onCheckedChange={(checked) => 
                            setVisibleColumns(prev => ({ ...prev, customerPhone: checked }))
                          }
                        >
                          Phone
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={visibleColumns.date}
                          onCheckedChange={(checked) => 
                            setVisibleColumns(prev => ({ ...prev, date: checked }))
                          }
                        >
                          Date
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={visibleColumns.time}
                          onCheckedChange={(checked) => 
                            setVisibleColumns(prev => ({ ...prev, time: checked }))
                          }
                        >
                          Time
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={visibleColumns.partySize}
                          onCheckedChange={(checked) => 
                            setVisibleColumns(prev => ({ ...prev, partySize: checked }))
                          }
                        >
                          Party Size
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={visibleColumns.status}
                          onCheckedChange={(checked) => 
                            setVisibleColumns(prev => ({ ...prev, status: checked }))
                          }
                        >
                          Status
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={visibleColumns.specialRequests}
                          onCheckedChange={(checked) => 
                            setVisibleColumns(prev => ({ ...prev, specialRequests: checked }))
                          }
                        >
                          Special Requests
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={visibleColumns.tableId}
                          onCheckedChange={(checked) => 
                            setVisibleColumns(prev => ({ ...prev, tableId: checked }))
                          }
                        >
                          Table
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={visibleColumns.locationId}
                          onCheckedChange={(checked) => 
                            setVisibleColumns(prev => ({ ...prev, locationId: checked }))
                          }
                        >
                          Location
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={visibleColumns.createdAt}
                          onCheckedChange={(checked) => 
                            setVisibleColumns(prev => ({ ...prev, createdAt: checked }))
                          }
                        >
                          Created At
                        </DropdownMenuCheckboxItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        queryClient.invalidateQueries({ queryKey: ["/api/admin/bookings"] });
                        toast({
                          title: "Refreshed",
                          description: "Bookings list has been updated",
                        });
                      }}
                      disabled={bookingsLoading}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className={`h-4 w-4 ${bookingsLoading ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {bookingsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-calluna-brown mx-auto mb-4"></div>
                    <p>Loading bookings...</p>
                  </div>
                ) : bookings && bookings.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-calluna-sand">
                          {visibleColumns.customerName && (
                            <th className="text-left p-3 font-semibold text-calluna-brown">Customer Name</th>
                          )}
                          {visibleColumns.customerEmail && (
                            <th className="text-left p-3 font-semibold text-calluna-brown">Email</th>
                          )}
                          {visibleColumns.customerPhone && (
                            <th className="text-left p-3 font-semibold text-calluna-brown">Phone</th>
                          )}
                          {visibleColumns.date && (
                            <th className="text-left p-3 font-semibold text-calluna-brown">Date</th>
                          )}
                          {visibleColumns.time && (
                            <th className="text-left p-3 font-semibold text-calluna-brown">Time</th>
                          )}
                          {visibleColumns.partySize && (
                            <th className="text-left p-3 font-semibold text-calluna-brown">Party Size</th>
                          )}
                          {visibleColumns.status && (
                            <th className="text-left p-3 font-semibold text-calluna-brown">Status</th>
                          )}
                          {visibleColumns.specialRequests && (
                            <th className="text-left p-3 font-semibold text-calluna-brown">Special Requests</th>
                          )}
                          {visibleColumns.tableId && (
                            <th className="text-left p-3 font-semibold text-calluna-brown">Table</th>
                          )}
                          {visibleColumns.locationId && (
                            <th className="text-left p-3 font-semibold text-calluna-brown">Location</th>
                          )}
                          {visibleColumns.createdAt && (
                            <th className="text-left p-3 font-semibold text-calluna-brown">Created At</th>
                          )}
                          <th className="text-left p-3 font-semibold text-calluna-brown">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.slice(0, 20).map((booking) => (
                          <tr key={booking.id} className="border-b border-calluna-cream hover:bg-calluna-cream/50 transition-colors">
                            {visibleColumns.customerName && (
                              <td className="p-3 text-calluna-charcoal font-medium">{booking.customerName}</td>
                            )}
                            {visibleColumns.customerEmail && (
                              <td className="p-3 text-calluna-charcoal text-sm">{booking.customerEmail}</td>
                            )}
                            {visibleColumns.customerPhone && (
                              <td className="p-3 text-calluna-charcoal text-sm">{booking.customerPhone || 'N/A'}</td>
                            )}
                            {visibleColumns.date && (
                              <td className="p-3 text-calluna-charcoal">{booking.date}</td>
                            )}
                            {visibleColumns.time && (
                              <td className="p-3 text-calluna-charcoal">{booking.time}</td>
                            )}
                            {visibleColumns.partySize && (
                              <td className="p-3 text-calluna-charcoal text-center">{booking.partySize}</td>
                            )}
                            {visibleColumns.status && (
                              <td className="p-3">
                                <Badge 
                                  variant={booking.status === 'confirmed' ? 'default' : 
                                    booking.status === 'unconfirmed' ? 'secondary' : 'destructive'}
                                  className="text-xs"
                                >
                                  {booking.status}
                                </Badge>
                              </td>
                            )}
                            {visibleColumns.specialRequests && (
                              <td className="p-3 text-calluna-charcoal text-sm max-w-48 truncate" title={booking.specialRequests || ''}>
                                {booking.specialRequests || 'None'}
                              </td>
                            )}
                            {visibleColumns.tableId && (
                              <td className="p-3 text-calluna-charcoal text-sm">
                                {tables?.find(table => table.id === booking.tableId)?.name || 'N/A'}
                              </td>
                            )}
                            {visibleColumns.locationId && (
                              <td className="p-3 text-calluna-charcoal text-sm">
                                {locations?.find(location => location.id === booking.locationId)?.name || 'N/A'}
                              </td>
                            )}
                            {visibleColumns.createdAt && (
                              <td className="p-3 text-calluna-charcoal text-sm">
                                {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A'}
                              </td>
                            )}
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                {booking.status === 'unconfirmed' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateBookingStatusMutation.mutate({
                                      id: booking.id,
                                      status: 'confirmed'
                                    })}
                                    disabled={updateBookingStatusMutation.isPending}
                                    className="flex items-center gap-1 text-green-600 hover:text-green-700 border-green-600 hover:border-green-700"
                                  >
                                    <Check className="h-3 w-3" />
                                    Confirm
                                  </Button>
                                )}
                                {booking.status !== 'cancelled' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateBookingStatusMutation.mutate({
                                      id: booking.id,
                                      status: 'cancelled'
                                    })}
                                    disabled={updateBookingStatusMutation.isPending}
                                    className="flex items-center gap-1 text-red-600 hover:text-red-700 border-red-600 hover:border-red-700"
                                  >
                                    <X className="h-3 w-3" />
                                    Cancel
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center py-8 text-calluna-charcoal">No bookings found.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tables" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-calluna-brown">Add New Table</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    createTableMutation.mutate({
                      name: formData.get('name') as string,
                      capacity: parseInt(formData.get('capacity') as string),
                      xPosition: parseInt(formData.get('xPosition') as string),
                      yPosition: parseInt(formData.get('yPosition') as string),
                    });
                  }} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Table Name</Label>
                      <Input id="name" name="name" placeholder="T1, T2, etc." required />
                    </div>
                    <div>
                      <Label htmlFor="capacity">Capacity</Label>
                      <Input id="capacity" name="capacity" type="number" min="1" max="12" placeholder="4" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="xPosition">X Position</Label>
                        <Input id="xPosition" name="xPosition" type="number" min="0" placeholder="0" required />
                      </div>
                      <div>
                        <Label htmlFor="yPosition">Y Position</Label>
                        <Input id="yPosition" name="yPosition" type="number" min="0" placeholder="0" required />
                      </div>
                    </div>
                    <Button type="submit" className="w-full bg-calluna-brown hover:bg-calluna-orange" disabled={createTableMutation.isPending}>
                      {createTableMutation.isPending ? "Creating..." : "Add Table"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-calluna-brown">Current Tables</CardTitle>
                </CardHeader>
                <CardContent>
                  {tablesLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-calluna-brown mx-auto mb-4"></div>
                      <p>Loading tables...</p>
                    </div>
                  ) : tables && tables.length > 0 ? (
                    <div className="space-y-2">
                      {tables.map((table) => (
                        <div key={table.id} className="flex justify-between items-center p-3 bg-calluna-cream rounded-lg">
                          <div>
                            <span className="font-semibold text-calluna-brown">{table.name}</span>
                            <span className="text-sm text-calluna-charcoal ml-2">({table.capacity} seats)</span>
                          </div>
                          <Badge variant="outline">Active</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-8 text-calluna-charcoal">No tables found.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tableManagement" className="space-y-6">
            <TableManagement />
          </TabsContent>

          <TabsContent value="locations" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <LocationManagement />
              </div>
              <div className="space-y-6">
                <FloorPlanElementsManagement 
                  selectedLocationId={locations?.[0]?.id} 
                  locations={locations || []} 
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="menu" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-calluna-brown">Menu Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Add Category Form */}
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    createCategoryMutation.mutate({
                      name: formData.get('categoryName') as string,
                      displayOrder: parseInt(formData.get('categoryOrder') as string) || 0,
                    });
                    (e.target as HTMLFormElement).reset();
                  }} className="space-y-3 border-b pb-4">
                    <div>
                      <Label htmlFor="categoryName">Category Name</Label>
                      <Input id="categoryName" name="categoryName" placeholder="e.g., Appetizers, Main Courses" required />
                    </div>
                    <div>
                      <Label htmlFor="categoryOrder">Display Order</Label>
                      <Input id="categoryOrder" name="categoryOrder" type="number" min="0" placeholder="0" />
                    </div>
                    <Button type="submit" className="w-full bg-calluna-brown hover:bg-calluna-orange" disabled={createCategoryMutation.isPending}>
                      {createCategoryMutation.isPending ? "Adding..." : "Add Category"}
                    </Button>
                  </form>

                  {/* Categories List */}
                  <div className="space-y-2">
                    {menuCategories && menuCategories.length > 0 ? (
                      menuCategories.map((category) => (
                        <div key={category.id} className="flex justify-between items-center p-3 bg-calluna-cream rounded-lg">
                          <div>
                            <span className="font-semibold text-calluna-brown">{category.name}</span>
                            <span className="text-sm text-calluna-charcoal ml-2">(Order: {category.displayOrder})</span>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteCategoryMutation.mutate(category.id)}
                            disabled={deleteCategoryMutation.isPending}
                          >
                            Delete
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-center py-4 text-calluna-charcoal">No categories found.</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Menu Items Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-calluna-brown">Menu Items</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Add Item Form */}
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    createItemMutation.mutate({
                      categoryId: formData.get('itemCategory') as string,
                      name: formData.get('itemName') as string,
                      description: formData.get('itemDescription') as string,
                      price: formData.get('itemPrice') as string,
                      displayOrder: parseInt(formData.get('itemOrder') as string) || 0,
                    });
                    (e.target as HTMLFormElement).reset();
                  }} className="space-y-3 border-b pb-4">
                    <div>
                      <Label htmlFor="itemCategory">Category</Label>
                      <select id="itemCategory" name="itemCategory" className="w-full p-2 border border-gray-300 rounded-md" required>
                        <option value="">Select Category</option>
                        {menuCategories?.map((category) => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="itemName">Item Name</Label>
                      <Input id="itemName" name="itemName" placeholder="e.g., Grilled Salmon" required />
                    </div>
                    <div>
                      <Label htmlFor="itemDescription">Description</Label>
                      <textarea 
                        id="itemDescription" 
                        name="itemDescription" 
                        placeholder="Describe the dish..."
                        className="w-full p-2 border border-gray-300 rounded-md h-20"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="itemPrice">Price ($)</Label>
                        <Input id="itemPrice" name="itemPrice" type="number" step="0.01" min="0" placeholder="24.99" required />
                      </div>
                      <div>
                        <Label htmlFor="itemOrder">Display Order</Label>
                        <Input id="itemOrder" name="itemOrder" type="number" min="0" placeholder="0" />
                      </div>
                    </div>
                    <Button type="submit" className="w-full bg-calluna-brown hover:bg-calluna-orange" disabled={createItemMutation.isPending}>
                      {createItemMutation.isPending ? "Adding..." : "Add Menu Item"}
                    </Button>
                  </form>

                  {/* Items List */}
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {menuItems && menuItems.length > 0 ? (
                      menuItems.map((item) => (
                        <div key={item.id} className="p-3 bg-calluna-cream rounded-lg">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold text-calluna-brown">{item.name}</h4>
                              <p className="text-sm text-calluna-charcoal">{item.description}</p>
                              <p className="text-sm font-medium text-calluna-orange">${item.price}</p>
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteItemMutation.mutate(item.id)}
                              disabled={deleteItemMutation.isPending}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center py-4 text-calluna-charcoal">No menu items found.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="gallery" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-calluna-brown">Gallery Management</CardTitle>
              </CardHeader>
              <CardContent>
                {galleryImages && galleryImages.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {galleryImages.map((image) => (
                      <div key={image.id} className="bg-calluna-cream rounded-lg p-4">
                        <img 
                          src={image.url} 
                          alt={image.alt} 
                          className="w-full h-32 object-cover rounded-lg mb-2"
                        />
                        <h4 className="font-medium text-calluna-brown">{image.title}</h4>
                        <p className="text-sm text-calluna-charcoal">{image.alt}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-calluna-charcoal">No gallery images found.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-calluna-brown">Add Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    createContactMutation.mutate({
                      type: formData.get('type') as string,
                      label: formData.get('label') as string,
                      value: formData.get('value') as string,
                      displayOrder: parseInt(formData.get('displayOrder') as string) || 0,
                    });
                    e.currentTarget.reset();
                  }} className="space-y-4">
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Input id="type" name="type" placeholder="phone, email, address" required />
                    </div>
                    <div>
                      <Label htmlFor="label">Label</Label>
                      <Input id="label" name="label" placeholder="Main Phone, Email, Address" required />
                    </div>
                    <div>
                      <Label htmlFor="value">Value</Label>
                      <Input id="value" name="value" placeholder="Contact information" required />
                    </div>
                    <div>
                      <Label htmlFor="displayOrder">Display Order</Label>
                      <Input id="displayOrder" name="displayOrder" type="number" placeholder="0" />
                    </div>
                    <Button type="submit" className="w-full bg-calluna-brown hover:bg-calluna-orange" disabled={createContactMutation.isPending}>
                      {createContactMutation.isPending ? "Adding..." : "Add Contact Info"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-calluna-brown">Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  {contactInfo && contactInfo.length > 0 ? (
                    <div className="space-y-3">
                      {contactInfo.map((contact) => (
                        <div key={contact.id} className="flex justify-between items-center p-3 bg-calluna-cream rounded-lg">
                          <div>
                            <span className="font-semibold text-calluna-brown">{contact.label}</span>
                            <p className="text-sm text-calluna-charcoal">{contact.value}</p>
                            <Badge variant="outline" className="text-xs">{contact.type}</Badge>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteContactMutation.mutate(contact.id)}
                            disabled={deleteContactMutation.isPending}
                          >
                            Delete
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-8 text-calluna-charcoal">No contact information found.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="hours" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-calluna-brown">Opening Hours Management</CardTitle>
              </CardHeader>
              <CardContent>
                {openingHours && openingHours.length > 0 ? (
                  <div className="space-y-4">
                    {openingHours.map((hours) => (
                      <div key={hours.id} className="p-4 bg-calluna-cream rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-semibold text-calluna-brown">{hours.dayName}</h4>
                          <Badge variant={hours.isClosed ? "destructive" : "default"}>
                            {hours.isClosed ? "Closed" : "Open"}
                          </Badge>
                        </div>
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          const formData = new FormData(e.currentTarget);
                          const isClosed = formData.get('isClosed') === 'on';
                          updateHoursMutation.mutate({
                            id: hours.id,
                            openTime: formData.get('openTime') as string,
                            closeTime: formData.get('closeTime') as string,
                            isClosed,
                          });
                        }} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                          <div>
                            <Label htmlFor={`openTime-${hours.id}`}>Open Time</Label>
                            <Input
                              id={`openTime-${hours.id}`}
                              name="openTime"
                              type="time"
                              defaultValue={hours.openTime || "17:00"}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`closeTime-${hours.id}`}>Close Time</Label>
                            <Input
                              id={`closeTime-${hours.id}`}
                              name="closeTime"
                              type="time"
                              defaultValue={hours.closeTime || "23:00"}
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`isClosed-${hours.id}`}
                              name="isClosed"
                              defaultChecked={hours.isClosed || false}
                              className="h-4 w-4"
                            />
                            <Label htmlFor={`isClosed-${hours.id}`}>Closed</Label>
                          </div>
                          <Button
                            type="submit"
                            size="sm"
                            className="bg-calluna-brown hover:bg-calluna-orange"
                            disabled={updateHoursMutation.isPending}
                          >
                            Update
                          </Button>
                        </form>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-calluna-charcoal mb-4">No opening hours configured. Add default hours?</p>
                    <Button
                      onClick={() => {
                        const days = [
                          { dayOfWeek: 0, dayName: "Sunday" },
                          { dayOfWeek: 1, dayName: "Monday" },
                          { dayOfWeek: 2, dayName: "Tuesday" },
                          { dayOfWeek: 3, dayName: "Wednesday" },
                          { dayOfWeek: 4, dayName: "Thursday" },
                          { dayOfWeek: 5, dayName: "Friday" },
                          { dayOfWeek: 6, dayName: "Saturday" },
                        ];
                        days.forEach(day => {
                          createHoursMutation.mutate({
                            ...day,
                            openTime: "17:00",
                            closeTime: "23:00",
                            isClosed: false,
                          });
                        });
                      }}
                      className="bg-calluna-brown hover:bg-calluna-orange"
                      disabled={createHoursMutation.isPending}
                    >
                      {createHoursMutation.isPending ? "Creating..." : "Create Default Hours"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-calluna-brown">System Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-calluna-cream rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h4 className="font-semibold text-calluna-brown">Registration Control</h4>
                      <p className="text-sm text-calluna-charcoal">Enable or disable new admin registrations</p>
                    </div>
                    <Badge variant={registrationSetting?.value === "false" ? "destructive" : "default"}>
                      {registrationSetting?.value === "false" ? "Disabled" : "Enabled"}
                    </Badge>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => updateSettingMutation.mutate({
                        key: "registration_enabled",
                        value: "true",
                        description: "Allow new admin registrations"
                      })}
                      disabled={updateSettingMutation.isPending || registrationSetting?.value === "true"}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Enable Registration
                    </Button>
                    <Button
                      onClick={() => updateSettingMutation.mutate({
                        key: "registration_enabled",
                        value: "false",
                        description: "Disable new admin registrations"
                      })}
                      disabled={updateSettingMutation.isPending || registrationSetting?.value === "false"}
                      variant="destructive"
                    >
                      Disable Registration
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
