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
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import EnhancedFloorPlan from "@/components/EnhancedFloorPlan";
import type { Table, Booking, InsertBooking, RestaurantLocation } from "@shared/schema";
import { Check } from "lucide-react";

// Step 1 validation schema
const step1Schema = z.object({
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  partySize: z.number().min(1, "Party size must be at least 1").max(12, "Party size cannot exceed 12"),
  locationId: z.string().min(1, "Please select a location"),
  specialRequests: z.string().optional(),
});

// Full booking validation schema
const bookingSchema = z.object({
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  partySize: z.number().min(1, "Party size must be at least 1").max(12, "Party size cannot exceed 12"),
  locationId: z.string().min(1, "Please select a location"),
  seatingPreference: z.string().optional(),
  specialRequests: z.string().optional(),
  customerName: z.string().min(1, "Name is required"),
  customerEmail: z.string().email("Valid email is required"),
  customerPhone: z.string().min(1, "Phone number is required"),
  tableId: z.string().min(1, "Please select a table"),
});

type Step1FormData = z.infer<typeof step1Schema>;
type BookingFormData = z.infer<typeof bookingSchema>;

export default function BookingSystem() {
  const [step, setStep] = useState(1);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [bookingDate, setBookingDate] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<BookingFormData>({
    mode: "onChange",
    defaultValues: {
      date: "",
      time: "",
      partySize: 2,
      locationId: "",
      seatingPreference: "",
      specialRequests: "",
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      tableId: "",
    },
  });

  const { data: locations } = useQuery<RestaurantLocation[]>({
    queryKey: ["/api/locations"],
    retry: false,
  });

  const { data: tables } = useQuery<Table[]>({
    queryKey: ["/api/tables"],
    retry: false,
  });

  const { data: existingBookings } = useQuery<Booking[]>({
    queryKey: ["/api/bookings/date", bookingDate],
    enabled: !!bookingDate,
    retry: false,
  });

  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: Omit<BookingFormData, 'seatingPreference'>) => {
      const response = await apiRequest("POST", "/api/bookings", bookingData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings/date"] });
      setStep(4); // Success step
      toast({
        title: "Booking Confirmed!",
        description: "Your reservation has been successfully created.",
        variant: "default",
      });
    },
    onError: (error) => {
      console.error("Booking error:", error);
      toast({
        title: "Booking Failed",
        description: "There was an error creating your reservation. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleStep1Submit = async () => {
    const currentValues = form.getValues();
    
    // Validate only step 1 fields
    const step1Data = {
      date: currentValues.date,
      time: currentValues.time,
      partySize: currentValues.partySize,
      locationId: currentValues.locationId,
      specialRequests: currentValues.specialRequests,
    };
    
    try {
      // Validate step 1 data
      const validatedData = step1Schema.parse(step1Data);
      
      // Clear any previous errors
      form.clearErrors();
      
      // Update form values and proceed to step 2
      setBookingDate(validatedData.date);
      setSelectedLocation(validatedData.locationId);
      setStep(2);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Set individual field errors
        error.errors.forEach((err) => {
          if (err.path[0]) {
            form.setError(err.path[0] as any, {
              type: "manual",
              message: err.message,
            });
          }
        });
      }
    }
  };

  const handleTableSelect = (table: Table) => {
    setSelectedTable(table);
    form.setValue("tableId", table.id);
    setStep(3);
  };

  const handleFinalSubmit = (data: BookingFormData) => {
    const { seatingPreference, ...bookingData } = data;
    createBookingMutation.mutate(bookingData);
  };

  const isTableBooked = (tableId: string) => {
    if (!existingBookings) return false;
    return existingBookings.some(booking => 
      booking.tableId === tableId && 
      booking.status === 'confirmed' &&
      booking.time === form.watch("time")
    );
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const timeSlots = [
    "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM",
    "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM"
  ];

  if (step === 4) {
    return (
      <section id="booking" className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="bg-calluna-cream">
            <CardContent className="pt-12 pb-12">
              <div className="mb-6">
                <div className="w-16 h-16 bg-calluna-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-playfair font-bold text-calluna-brown mb-4">Reservation Confirmed!</h2>
                <p className="text-calluna-charcoal text-lg mb-8">
                  Thank you for choosing Calluna Bar & Grill. We look forward to serving you an exceptional dining experience.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-inner text-left max-w-md mx-auto mb-8">
                <h3 className="font-semibold text-calluna-brown mb-4">Reservation Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-medium">{form.getValues("date")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span className="font-medium">{form.getValues("time")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Party Size:</span>
                    <span className="font-medium">{form.getValues("partySize")} guests</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span className="font-medium">{locations?.find(l => l.id === form.getValues("locationId"))?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Table:</span>
                    <span className="font-medium">{selectedTable?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Name:</span>
                    <span className="font-medium">{form.getValues("customerName")}</span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => {
                  setStep(1);
                  setSelectedTable(null);
                  setSelectedLocation("");
                  form.reset();
                }}
                className="bg-calluna-brown hover:bg-calluna-orange"
              >
                Make Another Reservation
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-calluna-brown mb-4">Reserve Your Table</h2>
          <p className="text-xl text-calluna-charcoal max-w-2xl mx-auto">Select your preferred date, time, and table for an unforgettable dining experience</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= stepNumber ? 'bg-calluna-brown text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-12 h-1 mx-2 ${
                    step > stepNumber ? 'bg-calluna-brown' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {step === 1 && (
          <Card className="max-w-2xl mx-auto bg-calluna-cream">
            <CardHeader>
              <CardTitle className="text-2xl font-playfair text-calluna-brown">Reservation Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleStep1Submit();
              }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      min={getMinDate()}
                      {...form.register("date")}
                      className="border-calluna-sand focus:ring-calluna-brown"
                    />
                    {form.formState.errors.date && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.date.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Select onValueChange={(value) => {
                      form.setValue("time", value);
                      form.clearErrors("time");
                    }}>
                      <SelectTrigger className="border-calluna-sand focus:ring-calluna-brown">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.time && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.time.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="partySize">Party Size</Label>
                  <Select onValueChange={(value) => {
                    form.setValue("partySize", parseInt(value));
                    form.clearErrors("partySize");
                  }}>
                    <SelectTrigger className="border-calluna-sand focus:ring-calluna-brown">
                      <SelectValue placeholder="Select party size" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                          {size} {size === 1 ? 'Guest' : 'Guests'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.partySize && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.partySize.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="locationId">Dining Area</Label>
                  <Select onValueChange={(value) => {
                    form.setValue("locationId", value);
                    form.clearErrors("locationId");
                  }}>
                    <SelectTrigger className="border-calluna-sand focus:ring-calluna-brown">
                      <SelectValue placeholder="Select dining area" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations && locations.map((location) => (
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
                  <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                  <Textarea
                    id="specialRequests"
                    placeholder="Anniversary celebration, dietary restrictions, etc."
                    {...form.register("specialRequests")}
                    className="border-calluna-sand focus:ring-calluna-brown"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-calluna-brown hover:bg-calluna-orange py-4 text-lg"
                >
                  Continue to Table Selection
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-calluna-cream">
              <CardHeader>
                <CardTitle className="text-2xl font-playfair text-calluna-brown">Your Booking Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-calluna-charcoal">Date:</span>
                    <span className="font-semibold">{form.getValues("date")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-calluna-charcoal">Time:</span>
                    <span className="font-semibold">{form.getValues("time")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-calluna-charcoal">Party Size:</span>
                    <span className="font-semibold">{form.getValues("partySize")} guests</span>
                  </div>
                </div>
                <Button 
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="w-full mt-6"
                >
                  Edit Details
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-calluna-cream">
              <CardHeader>
                <CardTitle className="text-2xl font-playfair text-calluna-brown">Select Your Table</CardTitle>
              </CardHeader>
              <CardContent>
                <EnhancedFloorPlan 
                  tables={tables?.filter(table => {
                    const partySize = form.getValues("partySize");
                    const selectedLocationId = form.getValues("locationId");
                    
                    // Filter by capacity
                    const capacityMatch = table.capacity >= partySize;
                    
                    // Filter by location if one is selected
                    const locationMatch = !selectedLocationId || table.locationId === selectedLocationId;
                    

                    
                    return capacityMatch && locationMatch;
                  }) || []}
                  onTableSelect={handleTableSelect}
                  isTableBooked={isTableBooked}
                  selectedTable={selectedTable}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {step === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-calluna-cream">
              <CardHeader>
                <CardTitle className="text-2xl font-playfair text-calluna-brown">Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(handleFinalSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="customerName">Full Name</Label>
                    <Input
                      id="customerName"
                      {...form.register("customerName")}
                      placeholder="Enter your full name"
                      className="border-calluna-sand focus:ring-calluna-brown"
                    />
                    {form.formState.errors.customerName && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.customerName.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="customerEmail">Email Address</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      {...form.register("customerEmail")}
                      placeholder="Enter your email"
                      className="border-calluna-sand focus:ring-calluna-brown"
                    />
                    {form.formState.errors.customerEmail && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.customerEmail.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="customerPhone">Phone Number</Label>
                    <Input
                      id="customerPhone"
                      type="tel"
                      {...form.register("customerPhone")}
                      placeholder="Enter your phone number"
                      className="border-calluna-sand focus:ring-calluna-brown"
                    />
                    {form.formState.errors.customerPhone && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.customerPhone.message}</p>
                    )}
                  </div>
                  <div className="flex gap-4">
                    <Button 
                      type="button"
                      onClick={() => setStep(2)}
                      variant="outline"
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 bg-calluna-green hover:bg-green-600"
                      disabled={createBookingMutation.isPending}
                    >
                      {createBookingMutation.isPending ? "Confirming..." : "Confirm Reservation"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="bg-calluna-cream">
              <CardHeader>
                <CardTitle className="text-2xl font-playfair text-calluna-brown">Reservation Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white rounded-lg p-6 shadow-inner">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-calluna-charcoal">Date:</span>
                      <span className="font-semibold">{form.getValues("date")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-calluna-charcoal">Time:</span>
                      <span className="font-semibold">{form.getValues("time")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-calluna-charcoal">Party Size:</span>
                      <span className="font-semibold">{form.getValues("partySize")} guests</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-calluna-charcoal">Table:</span>
                      <span className="font-semibold">{selectedTable?.name} ({selectedTable?.capacity} seats)</span>
                    </div>
                    {form.getValues("specialRequests") && (
                      <div>
                        <span className="text-calluna-charcoal">Special Requests:</span>
                        <p className="text-sm mt-1">{form.getValues("specialRequests")}</p>
                      </div>
                    )}
                    <hr className="border-calluna-sand" />
                    <div className="flex justify-between font-semibold text-calluna-brown">
                      <span>Total:</span>
                      <span>No charge for reservation</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
}
