import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, loginMutation, registerMutation } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      setLocation("/admin");
    }
  }, [user, setLocation]);

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
  });

  const handleLogin = (data: LoginData) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        setLocation("/admin");
      },
    });
  };

  const handleRegister = (data: RegisterData) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        setLocation("/admin");
      },
    });
  };

  return (
    <div className="min-h-screen bg-calluna-sand flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Auth Form */}
        <Card className="w-full max-w-md mx-auto bg-white shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-playfair text-calluna-brown">
              Admin Access
            </CardTitle>
            <CardDescription>
              Sign in to access the restaurant management panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...loginForm.register("email")}
                      className="border-calluna-sand focus:ring-calluna-brown"
                    />
                    {loginForm.formState.errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {loginForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      {...loginForm.register("password")}
                      className="border-calluna-sand focus:ring-calluna-brown"
                    />
                    {loginForm.formState.errors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {loginForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-calluna-brown hover:bg-calluna-orange"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        {...registerForm.register("firstName")}
                        className="border-calluna-sand focus:ring-calluna-brown"
                      />
                      {registerForm.formState.errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">
                          {registerForm.formState.errors.firstName.message}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        {...registerForm.register("lastName")}
                        className="border-calluna-sand focus:ring-calluna-brown"
                      />
                      {registerForm.formState.errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">
                          {registerForm.formState.errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="registerEmail">Email</Label>
                    <Input
                      id="registerEmail"
                      type="email"
                      {...registerForm.register("email")}
                      className="border-calluna-sand focus:ring-calluna-brown"
                    />
                    {registerForm.formState.errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {registerForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="registerPassword">Password</Label>
                    <Input
                      id="registerPassword"
                      type="password"
                      {...registerForm.register("password")}
                      className="border-calluna-sand focus:ring-calluna-brown"
                    />
                    {registerForm.formState.errors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {registerForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-calluna-brown hover:bg-calluna-orange"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Hero Section */}
        <div className="text-center lg:text-left space-y-6">
          <h1 className="text-4xl lg:text-5xl font-playfair text-calluna-brown leading-tight">
            Restaurant Management
          </h1>
          <p className="text-lg text-calluna-charcoal leading-relaxed">
            Access your admin dashboard to manage reservations, tables, menu items, and gallery content for Calluna Bar & Grill.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-calluna-brown rounded-full"></div>
              <span className="text-calluna-charcoal">Manage Bookings</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-calluna-orange rounded-full"></div>
              <span className="text-calluna-charcoal">Update Menu</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-calluna-gold rounded-full"></div>
              <span className="text-calluna-charcoal">Gallery Control</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}