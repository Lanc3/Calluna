import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Edit2, Trash2, MapPin } from "lucide-react";
import { insertRestaurantLocationSchema, type RestaurantLocation, type InsertRestaurantLocation } from "@shared/schema";

type LocationFormData = InsertRestaurantLocation;

export default function LocationManagement() {
  const { toast } = useToast();
  const [editingLocation, setEditingLocation] = useState<RestaurantLocation | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const form = useForm<LocationFormData>({
    resolver: zodResolver(insertRestaurantLocationSchema),
    defaultValues: {
      name: "",
      description: "",
      displayOrder: 0,
    },
  });

  // Fetch locations
  const { data: locations = [], isLoading } = useQuery<RestaurantLocation[]>({
    queryKey: ["/api/locations"],
  });

  // Create location mutation
  const createLocationMutation = useMutation({
    mutationFn: async (data: LocationFormData) => {
      const response = await apiRequest("POST", "/api/admin/locations", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/locations"] });
      toast({
        title: "Success",
        description: "Location created successfully",
      });
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update location mutation
  const updateLocationMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<LocationFormData> }) => {
      const response = await apiRequest("PUT", `/api/admin/locations/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/locations"] });
      toast({
        title: "Success",
        description: "Location updated successfully",
      });
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete location mutation
  const deleteLocationMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/admin/locations/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/locations"] });
      toast({
        title: "Success",
        description: "Location deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LocationFormData) => {
    if (editingLocation) {
      updateLocationMutation.mutate({ id: editingLocation.id, data });
    } else {
      createLocationMutation.mutate(data);
    }
  };

  const startEdit = (location: RestaurantLocation) => {
    setEditingLocation(location);
    setIsFormOpen(true);
    form.reset({
      name: location.name,
      description: location.description || "",
      displayOrder: location.displayOrder,
    });
  };

  const resetForm = () => {
    setEditingLocation(null);
    setIsFormOpen(false);
    form.reset({
      name: "",
      description: "",
      displayOrder: 0,
    });
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading locations...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-playfair font-bold text-calluna-brown">Location Management</h2>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="bg-calluna-brown hover:bg-calluna-orange"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Location
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Location Form */}
        {isFormOpen && (
          <Card className="bg-calluna-cream">
            <CardHeader>
              <CardTitle className="text-calluna-brown">
                {editingLocation ? "Edit Location" : "Add New Location"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="name">Location Name</Label>
                  <Input
                    id="name"
                    {...form.register("name")}
                    placeholder="e.g., Main Dining, Patio, Bar Area"
                    className="border-calluna-sand focus:ring-calluna-brown"
                  />
                  {form.formState.errors.name && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    {...form.register("description")}
                    placeholder="Brief description of the location"
                    className="border-calluna-sand focus:ring-calluna-brown"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="displayOrder">Display Order</Label>
                  <Input
                    id="displayOrder"
                    type="number"
                    {...form.register("displayOrder", { valueAsNumber: true })}
                    placeholder="0"
                    className="border-calluna-sand focus:ring-calluna-brown"
                  />
                </div>

                <div className="flex space-x-2">
                  <Button
                    type="submit"
                    disabled={createLocationMutation.isPending || updateLocationMutation.isPending}
                    className="bg-calluna-brown hover:bg-calluna-orange"
                  >
                    {editingLocation ? "Update" : "Create"} Location
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Location List */}
        <Card className="bg-calluna-cream">
          <CardHeader>
            <CardTitle className="text-calluna-brown">Current Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {locations.length === 0 ? (
                <div className="text-center py-8 text-calluna-charcoal">
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-calluna-sand" />
                  <p>No locations configured yet.</p>
                  <p className="text-sm">Add your first location to get started.</p>
                </div>
              ) : (
                locations.map((location) => (
                  <div
                    key={location.id}
                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-calluna-sand"
                  >
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-calluna-brown" />
                      <div>
                        <h4 className="font-semibold text-calluna-brown">
                          {location.name}
                          <Badge className="ml-2 text-xs" variant="outline">
                            Order: {location.displayOrder}
                          </Badge>
                        </h4>
                        {location.description && (
                          <p className="text-sm text-calluna-charcoal">{location.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEdit(location)}
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteLocationMutation.mutate(location.id)}
                        disabled={deleteLocationMutation.isPending}
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
    </div>
  );
}