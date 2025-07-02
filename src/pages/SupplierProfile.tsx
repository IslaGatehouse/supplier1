
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { LogOut, Edit, Save, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supplierRegistrationSchema, type SupplierRegistrationFormData } from "@/lib/validationSchemas";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const SupplierProfile = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<SupplierRegistrationFormData>({
    resolver: zodResolver(supplierRegistrationSchema),
    defaultValues: {
      companyName: "",
      email: "",
      contactPerson: "",
      phone: "",
      companyHouse: "",
      address: "",
      country: "",
      industry: "",
      otherIndustry: "",
      certifications: [],
      otherCertification: "",
      companySize: "",
      yearsInBusiness: "",
      turnoverTime: "",
      description: "",
      agreeToTerms: true,
    },
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/supplier-auth");
        return;
      }

      setUser(session.user);
      await fetchProfile(session.user.id);
    } catch (error) {
      console.error("Auth check error:", error);
      navigate("/supplier-auth");
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("supplier_profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        setProfile(data);
        // Populate form with existing data
        form.reset({
          companyName: data.company_name || "",
          email: data.email || "",
          contactPerson: data.contact_person || "",
          phone: data.phone || "",
          companyHouse: data.company_house || "",
          address: data.address || "",
          country: data.country || "",
          industry: data.industry || "",
          otherIndustry: data.other_industry || "",
          certifications: data.certifications || [],
          otherCertification: data.other_certification || "",
          companySize: data.company_size || "",
          yearsInBusiness: data.years_in_business?.toString() || "",
          turnoverTime: data.turnover_time?.toString() || "",
          description: data.description || "",
          agreeToTerms: true,
        });
      } else {
        // No profile exists, enable editing mode for first-time setup
        setEditing(true);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const onSubmit = async (data: SupplierRegistrationFormData) => {
    if (!user) return;
    
    setSaving(true);
    try {
      const profileData = {
        user_id: user.id,
        company_name: data.companyName,
        email: data.email,
        contact_person: data.contactPerson,
        phone: data.phone || null,
        company_house: data.companyHouse || null,
        address: data.address,
        country: data.country,
        industry: data.industry,
        other_industry: data.otherIndustry || null,
        certifications: data.certifications || null,
        other_certification: data.otherCertification || null,
        company_size: data.companySize,
        years_in_business: parseInt(data.yearsInBusiness),
        turnover_time: parseInt(data.turnoverTime),
        description: data.description || null,
      };

      let error;
      if (profile) {
        // Update existing profile
        const result = await supabase
          .from("supplier_profiles")
          .update(profileData)
          .eq("user_id", user.id);
        error = result.error;
      } else {
        // Create new profile
        const result = await supabase
          .from("supplier_profiles")
          .insert([profileData]);
        error = result.error;
      }

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile saved successfully!",
      });
      
      setEditing(false);
      await fetchProfile(user.id);
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to save profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Supplier Profile</h1>
          <div className="flex gap-2">
            {!editing && profile && (
              <Button onClick={() => setEditing(true)} variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {!profile && !editing ? (
          <Card>
            <CardHeader>
              <CardTitle>Welcome!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                You haven't set up your supplier profile yet. Click the button below to get started.
              </p>
              <Button onClick={() => setEditing(true)}>
                Create Profile
              </Button>
            </CardContent>
          </Card>
        ) : editing ? (
          <Card>
            <CardHeader>
              <CardTitle>{profile ? "Edit Profile" : "Create Profile"}</CardTitle>
              <div className="flex gap-2">
                <Button onClick={form.handleSubmit(onSubmit)} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : "Save"}
                </Button>
                {profile && (
                  <Button onClick={() => setEditing(false)} variant="outline">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter company name" />
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
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" placeholder="Enter email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="contactPerson"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Person *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter contact person name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter phone number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter complete address" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="uk">United Kingdom</SelectItem>
                              <SelectItem value="us">United States</SelectItem>
                              <SelectItem value="ca">Canada</SelectItem>
                              <SelectItem value="au">Australia</SelectItem>
                              <SelectItem value="de">Germany</SelectItem>
                              <SelectItem value="fr">France</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
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
                            <Input {...field} placeholder="Enter company house number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="companySize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Size *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select company size" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1-10">1-10 employees</SelectItem>
                              <SelectItem value="11-50">11-50 employees</SelectItem>
                              <SelectItem value="51-200">51-200 employees</SelectItem>
                              <SelectItem value="201-500">201-500 employees</SelectItem>
                              <SelectItem value="500+">500+ employees</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select industry" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="manufacturing">Manufacturing</SelectItem>
                              <SelectItem value="technology">Technology</SelectItem>
                              <SelectItem value="healthcare">Healthcare</SelectItem>
                              <SelectItem value="finance">Finance</SelectItem>
                              <SelectItem value="retail">Retail</SelectItem>
                              <SelectItem value="construction">Construction</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="yearsInBusiness"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Years in Business *</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" placeholder="Enter years" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="turnoverTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Turnover Time (days) *</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" placeholder="Enter days" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Describe your company and services" 
                            rows={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>{profile?.company_name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <strong>Contact Person:</strong> {profile?.contact_person}
                </div>
                <div>
                  <strong>Email:</strong> {profile?.email}
                </div>
                <div>
                  <strong>Phone:</strong> {profile?.phone || "Not provided"}
                </div>
                <div>
                  <strong>Company Size:</strong> {profile?.company_size}
                </div>
                <div>
                  <strong>Industry:</strong> {profile?.industry}
                </div>
                <div>
                  <strong>Years in Business:</strong> {profile?.years_in_business}
                </div>
                <div>
                  <strong>Turnover Time:</strong> {profile?.turnover_time} days
                </div>
                <div>
                  <strong>Country:</strong> {profile?.country}
                </div>
              </div>
              <div>
                <strong>Address:</strong> {profile?.address}
              </div>
              {profile?.company_house && (
                <div>
                  <strong>Company House:</strong> {profile.company_house}
                </div>
              )}
              {profile?.description && (
                <div>
                  <strong>Description:</strong>
                  <p className="mt-1 text-muted-foreground">{profile.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SupplierProfile;
