import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Edit2, Trash2, Users, MapPin, Square } from "lucide-react";
import type { Table, RestaurantLocation } from "@shared/schema";
import EnhancedFloorPlan from "./EnhancedFloorPlan";

const tableFormSchema = z.object({
  name: z.string().min(1, "Table name is required"),
  capacity: z.number().min(1, "Capacity must be at least 1").max(20, "Capacity cannot exceed 20"),
  minCapacity: z.number().min(1, "Minimum capacity must be at least 1"),
  maxCapacity: z.number().min(1, "Maximum capacity must be at least 1"),
  tableType: z.enum(["standard", "booth", "high-top", "outdoor", "private"]),
  location: z.enum(["main", "patio", "bar", "private-room"]),
  locationId: z.string().optional(),
  shape: z.enum(["round", "square", "rectangular"]),
  description: z.string().optional(),
  xPosition: z.number().min(0, "X position must be positive"),
  yPosition: z.number().min(0, "Y position must be positive"),
  width: z.number().min(30, "Width must be at least 30px").max(150, "Width cannot exceed 150px"),
  height: z.number().min(30, "Height must be at least 30px").max(150, "Height cannot exceed 150px"),
  isPremium: z.boolean().default(false),
});

type TableFormData = z.infer<typeof tableFormSchema>;

export default function TableManagement() {
  const [isAdding, setIsAdding] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [draggedTable, setDraggedTable] = useState<Table | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tables, isLoading } = useQuery<Table[]>({
    queryKey: ["/api/admin/tables"],
  });

  const { data: locations } = useQuery<RestaurantLocation[]>({
    queryKey: ["/api/locations"],
  });

  const form = useForm<TableFormData>({
    resolver: zodResolver(tableFormSchema),
    defaultValues: {
      name: "",
      capacity: 4,
      minCapacity: 1,
      maxCapacity: 4,
      tableType: "standard",
      location: "main",
      locationId: "",
      shape: "round",
      description: "",
      xPosition: 100,
      yPosition: 100,
      width: 60,
      height: 60,
      isPremium: false,
    },
  });

  const createTableMutation = useMutation({
    mutationFn: async (data: TableFormData) => {
      const response = await apiRequest("POST", "/api/admin/tables", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/tables"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tables"] });
      toast({ title: "Success", description: "Table created successfully" });
      form.reset();
      setIsAdding(false);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateTableMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<TableFormData> }) => {
      const response = await apiRequest("PATCH", `/api/admin/tables/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/tables"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tables"] });
      toast({ title: "Success", description: "Table updated successfully" });
      setEditingTable(null);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteTableMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/tables/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/tables"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tables"] });
      toast({ title: "Success", description: "Table deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const onSubmit = (data: TableFormData) => {
    if (editingTable) {
      updateTableMutation.mutate({ id: editingTable.id, data });
    } else {
      createTableMutation.mutate(data);
    }
  };

  const startEdit = (table: Table) => {
    setEditingTable(table);
    setIsAdding(true);
    form.reset({
      name: table.name,
      capacity: table.capacity,
      minCapacity: table.minCapacity || 1,
      maxCapacity: table.maxCapacity || table.capacity,
      tableType: table.tableType as any || "standard",
      location: table.location as any || "main",
      locationId: table.locationId || "",
      shape: table.shape as any || "round",
      description: table.description || "",
      xPosition: table.xPosition,
      yPosition: table.yPosition,
      width: table.width || 60,
      height: table.height || 60,
      isPremium: table.isPremium || false,
    });
  };

  const handlePositionUpdate = (table: Table, newX: number, newY: number) => {
    updateTableMutation.mutate({
      id: table.id,
      data: { xPosition: newX, yPosition: newY }
    });
  };

  const handleElementPositionUpdate = async (elementId: string, newX: number, newY: number) => {
    try {
      await apiRequest("PATCH", `/api/admin/floor-plan-elements/${elementId}`, {
        xPosition: newX,
        yPosition: newY,
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/admin/floor-plan-elements"] });
      
      toast({
        title: "Success",
        description: "Element position updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update element position",
        variant: "destructive",
      });
    }
  };

  const getTableTypeIcon = (type: string) => {
    switch (type) {
      case "booth": return "🪑";
      case "high-top": return "🍺";
      case "outdoor": return "🌿";
      case "private": return "🔒";
      default: return "🍽️";
    }
  };

  const getLocationColor = (location: string) => {
    switch (location) {
      case "patio": return "bg-green-100 text-green-800";
      case "bar": return "bg-purple-100 text-purple-800";
      case "private-room": return "bg-yellow-100 text-yellow-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  const getLocationName = (table: Table) => {
    if (table.locationId && locations) {
      const location = locations.find(l => l.id === table.locationId);
      return location?.name || table.location || "Unknown";
    }
    return table.location || "Unknown";
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading tables...</div>;
  }

  // Set default location to first location if none selected
  const defaultLocationId = selectedLocationId || locations?.[0]?.id || "";
  
  // Filter tables by selected location
  const filteredTables = defaultLocationId
    ? tables?.filter(table => table.locationId === defaultLocationId)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-playfair font-bold text-calluna-brown">Table Management</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="locationFilter">Floor Plan:</Label>
            <Select
              value={selectedLocationId || locations?.[0]?.id || ""}
              onValueChange={setSelectedLocationId}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Location" />
              </SelectTrigger>
              <SelectContent>
                {locations?.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={() => {
              setIsAdding(true);
              // Pre-populate location with the currently selected location
              if (defaultLocationId) {
                form.setValue("locationId", defaultLocationId);
              }
            }}
            className="bg-calluna-brown hover:bg-calluna-orange"
            disabled={createTableMutation.isPending}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Table
          </Button>
        </div>
      </div>

      {(isAdding || editingTable) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-calluna-brown">
              {editingTable ? "Edit Table" : "Add New Table"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="name">Table Name</Label>
                  <Input
                    id="name"
                    {...form.register("name")}
                    placeholder="e.g., Table 1, Window Booth A"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="capacity">Standard Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    {...form.register("capacity", { valueAsNumber: true })}
                  />
                  {form.formState.errors.capacity && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.capacity.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="minCapacity">Minimum Capacity</Label>
                  <Input
                    id="minCapacity"
                    type="number"
                    {...form.register("minCapacity", { valueAsNumber: true })}
                  />
                </div>

                <div>
                  <Label htmlFor="maxCapacity">Maximum Capacity</Label>
                  <Input
                    id="maxCapacity"
                    type="number"
                    {...form.register("maxCapacity", { valueAsNumber: true })}
                  />
                </div>

                <div>
                  <Label htmlFor="tableType">Table Type</Label>
                  <Select
                    value={form.watch("tableType")}
                    onValueChange={(value) => form.setValue("tableType", value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="booth">Booth</SelectItem>
                      <SelectItem value="high-top">High-Top</SelectItem>
                      <SelectItem value="outdoor">Outdoor</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="locationId">Restaurant Location</Label>
                  <Select
                    value={form.watch("locationId")}
                    onValueChange={(value) => form.setValue("locationId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations?.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                          {location.description && (
                            <span className="text-sm text-gray-500 ml-2">- {location.description}</span>
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.locationId && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.locationId.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="location">Legacy Location</Label>
                  <Select
                    value={form.watch("location")}
                    onValueChange={(value) => form.setValue("location", value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main">Main Dining</SelectItem>
                      <SelectItem value="patio">Patio</SelectItem>
                      <SelectItem value="bar">Bar Area</SelectItem>
                      <SelectItem value="private-room">Private Room</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="shape">Table Shape</Label>
                  <Select
                    value={form.watch("shape")}
                    onValueChange={(value) => form.setValue("shape", value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="round">Round</SelectItem>
                      <SelectItem value="square">Square</SelectItem>
                      <SelectItem value="rectangular">Rectangular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="xPosition">X Position (pixels)</Label>
                  <Input
                    id="xPosition"
                    type="number"
                    {...form.register("xPosition", { valueAsNumber: true })}
                  />
                </div>

                <div>
                  <Label htmlFor="yPosition">Y Position (pixels)</Label>
                  <Input
                    id="yPosition"
                    type="number"
                    {...form.register("yPosition", { valueAsNumber: true })}
                  />
                </div>

                <div>
                  <Label htmlFor="width">Width (pixels)</Label>
                  <Input
                    id="width"
                    type="number"
                    {...form.register("width", { valueAsNumber: true })}
                  />
                </div>

                <div>
                  <Label htmlFor="height">Height (pixels)</Label>
                  <Input
                    id="height"
                    type="number"
                    {...form.register("height", { valueAsNumber: true })}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPremium"
                    {...form.register("isPremium")}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="isPremium">Premium Table</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...form.register("description")}
                  placeholder="Describe the table's features, view, or special characteristics"
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="bg-calluna-brown hover:bg-calluna-orange"
                  disabled={createTableMutation.isPending || updateTableMutation.isPending}
                >
                  {editingTable ? "Update Table" : "Create Table"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingTable(null);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-calluna-brown">
              Table List
              {defaultLocationId && locations && (
                <span className="text-sm font-normal text-calluna-charcoal ml-2">
                  - {locations.find(l => l.id === defaultLocationId)?.name}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredTables?.length === 0 ? (
                <div className="text-center py-8 text-calluna-charcoal">
                  <div className="text-4xl mb-4">🍽️</div>
                  <p className="font-semibold mb-2">No tables found</p>
                  <p className="text-sm">
                    No tables in this location yet. Add one to get started!
                  </p>
                </div>
              ) : (
                filteredTables?.map((table) => (
                <div
                  key={table.id}
                  className="flex items-center justify-between p-4 bg-calluna-cream rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{getTableTypeIcon(table.tableType || "standard")}</div>
                    <div>
                      <h4 className="font-semibold text-calluna-brown">{table.name}</h4>
                      <div className="flex items-center space-x-2 text-sm text-calluna-charcoal">
                        <Users className="w-3 h-3" />
                        <span>{table.minCapacity || 1}-{table.maxCapacity || table.capacity} guests</span>
                        <MapPin className="w-3 h-3 ml-2" />
                        <Badge className="bg-calluna-sand text-calluna-brown">
                          {getLocationName(table)}
                        </Badge>
                        {table.isPremium && (
                          <Badge className="bg-gold text-calluna-brown">Premium</Badge>
                        )}
                      </div>
                      {table.description && (
                        <p className="text-xs text-gray-600 mt-1">{table.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEdit(table)}
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteTableMutation.mutate(table.id)}
                      disabled={deleteTableMutation.isPending}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-calluna-brown">
              Floor Plan Preview
              {defaultLocationId && locations && (
                <span className="text-sm font-normal text-calluna-charcoal ml-2">
                  - {locations.find(l => l.id === defaultLocationId)?.name}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative bg-gray-50 border rounded-lg p-4 overflow-auto" style={{ height: "600px", minHeight: "600px" }}>
              {/* Visual Elements Layer */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                <style>{`
                  .elements-only .table-element { display: none !important; }
                  .elements-only { pointer-events: none; }
                  .elements-only > div > div > div[id^="element-"] { pointer-events: auto; }
                `}</style>
                <div className="elements-only">
                  <EnhancedFloorPlan
                    tables={filteredTables || []} // Pass filtered tables for location context
                    onTableSelect={() => {}}
                    isTableBooked={() => false}
                    selectedTable={null}
                    showElements={true}
                    enableElementDragging={true}
                    onElementPositionUpdate={handleElementPositionUpdate}
                  />
                </div>
              </div>
              
              {/* Draggable Tables Layer */}
              {filteredTables?.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-calluna-charcoal">
                    <div className="text-6xl mb-4">🏗️</div>
                    <h3 className="text-lg font-semibold mb-2">Empty Floor Plan</h3>
                    <p className="text-sm">
                      This location doesn't have any tables yet. Add tables to design the floor plan!
                    </p>
                  </div>
                </div>
              ) : (
                filteredTables?.map((table) => (
                <div
                  key={table.id}
                  className={`absolute border-2 border-calluna-brown bg-white rounded cursor-move shadow-sm hover:shadow-md transition-shadow z-10 ${
                    table.shape === "round" ? "rounded-full" : ""
                  } ${table.isPremium ? "border-gold bg-yellow-50" : ""}`}
                  style={{
                    left: `${table.xPosition}px`,
                    top: `${table.yPosition}px`,
                    width: `${table.width || 60}px`,
                    height: `${table.height || 60}px`,
                  }}
                  onMouseDown={(e) => {
                    setDraggedTable(table);
                    const startX = e.clientX - table.xPosition;
                    const startY = e.clientY - table.yPosition;

                    const handleMouseMove = (e: MouseEvent) => {
                      const newX = Math.max(0, e.clientX - startX);
                      const newY = Math.max(0, e.clientY - startY);
                      
                      // Update position visually during drag
                      const element = document.getElementById(`table-${table.id}`);
                      if (element) {
                        element.style.left = `${newX}px`;
                        element.style.top = `${newY}px`;
                      }
                    };

                    const handleMouseUp = (e: MouseEvent) => {
                      const newX = Math.max(0, e.clientX - startX);
                      const newY = Math.max(0, e.clientY - startY);
                      handlePositionUpdate(table, newX, newY);
                      document.removeEventListener("mousemove", handleMouseMove);
                      document.removeEventListener("mouseup", handleMouseUp);
                      setDraggedTable(null);
                    };

                    document.addEventListener("mousemove", handleMouseMove);
                    document.addEventListener("mouseup", handleMouseUp);
                  }}
                  id={`table-${table.id}`}
                >
                  <div className="flex items-center justify-center h-full text-xs font-medium text-calluna-brown">
                    <div className="text-center">
                      <div className="text-lg">{getTableTypeIcon(table.tableType || "standard")}</div>
                      <div>{table.name}</div>
                      <div className="text-xs">{table.capacity}</div>
                    </div>
                  </div>
                </div>
                ))
              )}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Drag tables to reposition them on the floor plan. Visual elements and changes are saved automatically.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}