import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supplierInviteSchema, type SupplierInviteFormData } from "@/lib/validationSchemas";

const SupplierRegistrationInvite = () => {
  const navigate = useNavigate();

  const form = useForm<SupplierInviteFormData>({
    resolver: zodResolver(supplierInviteSchema),
    defaultValues: {
      companyName: "",
      email: "",
      contactPerson: "",
      companyHouse: "",
      address: ""
    }
  });

  const onSubmit = (data: SupplierInviteFormData) => {
    console.log("Invite form submitted:", data);
    // Handle invite form submission logic here
    navigate("/supplier-create-login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="absolute top-4 left-4">
        <Button variant="ghost" onClick={() => navigate('/start-registration')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Supplier Registration Invite</CardTitle>
          <CardDescription>Enter your company details to continue registration.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address *</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="contactPerson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="companyHouse"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company House Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., 12345678" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Address *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter company address" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Continue Registration
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplierRegistrationInvite;
