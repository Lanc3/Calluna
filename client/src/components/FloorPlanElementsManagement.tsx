import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { FloorPlanElement, RestaurantLocation, Table } from "@shared/schema";
import { Plus, Edit2, Trash2, RotateCw, MapPin } from "lucide-react";
import EnhancedFloorPlan from "./EnhancedFloorPlan";

const elementFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  elementType: z.string().min(1, "Element type is required"),
  locationId: z.string().min(1, "Location is required"),
  xPosition: z.number().min(0, "X position must be positive"),
  yPosition: z.number().min(0, "Y position must be positive"),
  width: z.number().min(10, "Width must be at least 10px"),
  height: z.number().min(10, "Height must be at least 10px"),
  rotation: z.number().min(0).max(270).optional(),
  color: z.string().optional(),
});

type ElementFormData = z.infer<typeof elementFormSchema>;

const ELEMENT_TYPES = [
  { value: "bar", label: "Bar Counter", icon: "🍸", defaultColor: "#8B4513" },
  { value: "stairs", label: "Stairs", icon: "🪜", defaultColor: "#696969" },
  { value: "toilet", label: "Restroom", icon: "🚻", defaultColor: "#4169E1" },
  { value: "window", label: "Window", icon: "🪟", defaultColor: "#87CEEB" },
  { value: "door", label: "Door", icon: "🚪", defaultColor: "#D2691E" },
  { value: "wall", label: "Wall", icon: "🧱", defaultColor: "#A0A0A0" },
  { value: "kitchen", label: "Kitchen", icon: "👨‍🍳", defaultColor: "#FF6347" },
];

interface FloorPlanElementsManagementProps {
  selectedLocationId?: string;
  locations?: RestaurantLocation[];
}

export default function FloorPlanElementsManagement({ selectedLocationId: initialLocationId, locations }: FloorPlanElementsManagementProps) {
  const [currentLocationId, setCurrentLocationId] = useState(initialLocationId || "");
  const [isAdding, setIsAdding] = useState(false);
  const [editingElement, setEditingElement] = useState<FloorPlanElement | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Update currentLocationId when initialLocationId changes
  useState(() => {
    if (initialLocationId && !currentLocationId) {
      setCurrentLocationId(initialLocationId);
    }
  });

  const { data: elements } = useQuery<FloorPlanElement[]>({
    queryKey: ["/api/admin/floor-plan-elements"],
    retry: false,
  });

  const { data: tables } = useQuery<Table[]>({
    queryKey: ["/api/tables"],
    retry: false,
  });

  const form = useForm<ElementFormData>({
    resolver: zodResolver(elementFormSchema),
    defaultValues: {
      name: "",
      elementType: "",
      locationId: "",
      xPosition: 50,
      yPosition: 50,
      width: 60,
      height: 60,
      rotation: 0,
      color: "#8B4513",
    },
  });

  const createElementMutation = useMutation({
    mutationFn: async (data: ElementFormData) => {
      const response = await apiRequest("POST", "/api/admin/floor-plan-elements", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/floor-plan-elements"] });
      setIsAdding(false);
      form.reset();
      toast({
        title: "Element Added",
        description: "Floor plan element has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create floor plan element.",
        variant: "destructive",
      });
    },
  });

  const updateElementMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ElementFormData> }) => {
      const response = await apiRequest("PATCH", `/api/admin/floor-plan-elements/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/floor-plan-elements"] });
      setEditingElement(null);
      form.reset();
      toast({
        title: "Element Updated",
        description: "Floor plan element has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update floor plan element.",
        variant: "destructive",
      });
    },
  });

  const deleteElementMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/floor-plan-elements/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/floor-plan-elements"] });
      toast({
        title: "Element Deleted",
        description: "Floor plan element has been removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete floor plan element.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: ElementFormData) => {
    if (editingElement) {
      updateElementMutation.mutate({ id: editingElement.id, data });
    } else {
      createElementMutation.mutate(data);
    }
  };

  const startEdit = (element: FloorPlanElement) => {
    setEditingElement(element);
    form.reset({
      name: element.name,
      elementType: element.elementType,
      locationId: element.locationId,
      xPosition: element.xPosition,
      yPosition: element.yPosition,
      width: element.width,
      height: element.height,
      rotation: element.rotation || 0,
      color: element.color || "#8B4513",
    });
    setIsAdding(true);
  };

  const getElementIcon = (type: string) => {
    return ELEMENT_TYPES.find(et => et.value === type)?.icon || "📦";
  };

  const getElementLabel = (type: string) => {
    return ELEMENT_TYPES.find(et => et.value === type)?.label || type;
  };

  // Filter elements by selected location
  const filteredElements = currentLocationId 
    ? elements?.filter(element => element.locationId === currentLocationId)
    : [];

  // Filter tables by selected location for floor plan preview
  const filteredTables = currentLocationId 
    ? tables?.filter(table => table.locationId === currentLocationId) || []
    : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-playfair font-bold text-calluna-brown">Floor Plan Elements</h3>
      </div>

      {/* Location Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-calluna-brown flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Select Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={currentLocationId} onValueChange={setCurrentLocationId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a location to manage" />
            </SelectTrigger>
            <SelectContent>
              {locations?.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {!currentLocationId && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-calluna-charcoal">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-calluna-sand" />
              <h3 className="text-lg font-semibold mb-2">Select a Location</h3>
              <p className="text-sm">Choose a location above to manage its floor plan elements.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {currentLocationId && (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
            <Dialog open={isAdding} onOpenChange={setIsAdding}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingElement(null);
                    form.reset({
                      locationId: currentLocationId,
                      xPosition: 50,
                      yPosition: 50,
                      width: 60,
                      height: 60,
                      rotation: 0,
                      color: "#8B4513",
                    });
                  }}
                  className="bg-calluna-brown hover:bg-calluna-orange"
                  disabled={!currentLocationId}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Element
                </Button>
              </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-calluna-brown">
                {editingElement ? "Edit Floor Plan Element" : "Add Floor Plan Element"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="locationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {locations?.map((location) => (
                            <SelectItem key={location.id} value={location.id}>
                              {location.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="elementType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Element Type</FormLabel>
                      <Select onValueChange={(value) => {
                        field.onChange(value);
                        const elementType = ELEMENT_TYPES.find(et => et.value === value);
                        if (elementType) {
                          form.setValue("color", elementType.defaultColor);
                        }
                      }} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select element type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ELEMENT_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.icon} {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter element name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="xPosition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>X Position</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="yPosition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Y Position</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="width"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Width (px)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height (px)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <Input type="color" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1 bg-calluna-brown hover:bg-calluna-orange">
                    {editingElement ? "Update Element" : "Add Element"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsAdding(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-calluna-brown">
                  Elements List
                  {currentLocationId && locations && (
                    <span className="text-sm font-normal text-calluna-charcoal ml-2">
                      - {locations.find(l => l.id === currentLocationId)?.name}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredElements?.length === 0 ? (
                    <div className="text-center py-8 text-calluna-charcoal">
                      <div className="text-4xl mb-4">🏗️</div>
                      <p className="font-semibold mb-2">No elements found</p>
                      <p className="text-sm">Add visual elements like bars, stairs, and doors to enhance your floor plan!</p>
                    </div>
                  ) : (
                    filteredElements?.map((element) => (
                      <div key={element.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{getElementIcon(element.elementType)}</div>
                          <div>
                            <div className="font-semibold">{element.name}</div>
                            <div className="text-sm text-gray-600">
                              {getElementLabel(element.elementType)} • {element.width}×{element.height}px
                            </div>
                            <div className="text-xs text-gray-500">
                              Position: ({element.xPosition}, {element.yPosition})
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEdit(element)}
                          >
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteElementMutation.mutate(element.id)}
                            disabled={deleteElementMutation.isPending}
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
        </div>
      )}
    </div>
  );
}