
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { supplierInviteSchema, type SupplierInviteFormData } from "@/lib/validationSchemas";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

const industries = [
  "Agriculture",
  "Manufacturing",
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Retail",
  "Energy",
  "Construction",
  "Transportation",
  "Other",
];

const certifications = [
  "ISO 9001",
  "ISO 14001",
  "OHSAS 18001",
  "GMP",
  "HACCP",
  "CE",
  "UL",
  "RoHS",
  "REACH",
  "Other",
];

const countriesList = [
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "France",
  "Japan",
  "China",
  "India",
  "Brazil",
  "Australia",
];

const SupplierRegistrationInvite = () => {
  const navigate = useNavigate();
  const [otherIndustrySelected, setOtherIndustrySelected] = useState(false);
  const [otherCertificationSelected, setOtherCertificationSelected] = useState(false);
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SupplierInviteFormData>({
    resolver: zodResolver(supplierInviteSchema),
    defaultValues: {
      companyName: "",
      email: "",
      contactPerson: "",
      companyHouse: "",
      address: "",
      phone: "",
      industry: "",
      country: "",
      otherIndustry: "",
      otherIndustryText: "",
      certifications: [],
      otherCertification: "",
      companySize: "",
      yearsInBusiness: "",
      turnoverTime: "",
      description: "",
      agreeToTerms: false,
    },
  });

  const watchIndustry = watch("industry"); // Watch the 'industry' field

  React.useEffect(() => {
    if (watchIndustry === "Other") {
      setOtherIndustrySelected(true);
    } else {
      setOtherIndustrySelected(false);
      setValue("otherIndustryText", "");
    }
  }, [watchIndustry, setValue]);

  const handleCertificationChange = (certification: string) => {
    setSelectedCertifications((prev) => {
      if (prev.includes(certification)) {
        return prev.filter((c) => c !== certification);
      } else {
        return [...prev, certification];
      }
    });
    setValue(
      "certifications",
      selectedCertifications.includes(certification)
        ? selectedCertifications.filter((c) => c !== certification)
        : [...selectedCertifications, certification]
    );
  };

  const watchCertifications = watch("certifications");

  React.useEffect(() => {
    if (watchCertifications && watchCertifications.includes("Other")) {
      setOtherCertificationSelected(true);
    } else {
      setOtherCertificationSelected(false);
      setValue("otherCertification", "");
    }
  }, [watchCertifications, setValue]);

  const onSubmit = async (data: SupplierInviteFormData) => {
    try {
      console.log("Form submitted with data:", data);

      // Generate risk assessment
      const riskScore = Math.floor(Math.random() * 41) + 60; // Random score between 60-100
      let riskCategory = "low";
      if (riskScore < 70) riskCategory = "high";
      else if (riskScore < 85) riskCategory = "medium";

      // Map form data to database schema (camelCase to snake_case)
      const supplierData = {
        id: uuidv4(),
        user_id: uuidv4(), // This should be replaced with actual user ID when auth is implemented
        company_name: data.companyName,
        email: data.email,
        contact_person: data.contactPerson,
        company_house: data.companyHouse || null,
        address: data.address,
        phone: data.phone || null,
        industry: data.industry,
        country: data.country,
        other_industry: data.otherIndustryText || null,
        certifications: data.certifications || [],
        other_certification: data.otherCertification || null,
        company_size: data.companySize || "Not specified",
        years_in_business: parseInt(data.yearsInBusiness || "0"),
        turnover_time: parseInt(data.turnoverTime || "0"),
        description: data.description || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("supplier_profiles").insert(supplierData);

      if (error) {
        console.error("Supabase error:", error);
        toast.error("Failed to save data. Please try again.");
      } else {
        toast.success("Registration successful!");
        // Pass the original form data for the confirmation page
        const confirmationData = {
          ...data,
          id: supplierData.id,
          riskScore,
          riskCategory,
          createdAt: supplierData.created_at,
        };
        navigate("/confirmation-invite", { state: { supplier: confirmationData } });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while submitting the form. Please try again.");
    }
  };

  const handleRemoveCertification = (certificationToRemove: string) => {
    setSelectedCertifications((prev) => prev.filter((cert) => cert !== certificationToRemove));
    setValue(
      "certifications",
      selectedCertifications.filter((cert) => cert !== certificationToRemove)
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="bg-white shadow-md rounded-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Supplier Registration</CardTitle>
            <CardDescription>Fill in the information to register as a supplier.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" type="text" {...register("companyName")} />
                {errors.companyName && (
                  <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email")} />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input id="contactPerson" type="text" {...register("contactPerson")} />
                {errors.contactPerson && (
                  <p className="text-red-500 text-sm mt-1">{errors.contactPerson.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input id="phone" type="tel" {...register("phone")} />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
              </div>
              <div>
                <Label htmlFor="companyHouse">Company House Registration Number (optional)</Label>
                <Input id="companyHouse" type="text" {...register("companyHouse")} />
                {errors.companyHouse && (
                  <p className="text-red-500 text-sm mt-1">{errors.companyHouse.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" type="text" {...register("address")} />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countriesList.map((country) => (
                      <SelectItem key={country} value={country} onClick={() => setValue("country", country)}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>}
              </div>
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry} onClick={() => setValue("industry", industry)}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry.message}</p>}
              </div>

              {otherIndustrySelected && (
                <div>
                  <Label htmlFor="otherIndustryText">Other Industry, please specify</Label>
                  <Input id="otherIndustryText" type="text" {...register("otherIndustryText")} />
                </div>
              )}

              <div>
                <Label>Certifications</Label>
                <div className="flex flex-wrap gap-2">
                  {certifications.map((certification) => (
                    <div key={certification} className="flex items-center space-x-2">
                      <Checkbox
                        id={`certification-${certification}`}
                        checked={selectedCertifications.includes(certification)}
                        onCheckedChange={() => handleCertificationChange(certification)}
                      />
                      <Label htmlFor={`certification-${certification}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {certification}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.certifications && (
                  <p className="text-red-500 text-sm mt-1">{errors.certifications.message}</p>
                )}
              </div>

              {selectedCertifications.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500">Selected Certifications:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCertifications.map((certification) => (
                      <Badge key={certification} variant="secondary">
                        {certification}
                        {certification !== "Other" && (
                          <X
                            className="h-3 w-3 ml-1 cursor-pointer"
                            onClick={() => handleRemoveCertification(certification)}
                          />
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="companySize">Company Size</Label>
                <Input id="companySize" type="text" {...register("companySize")} />
                {errors.companySize && (
                  <p className="text-red-500 text-sm mt-1">{errors.companySize.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="yearsInBusiness">Years in Business</Label>
                <Input id="yearsInBusiness" type="text" {...register("yearsInBusiness")} />
                {errors.yearsInBusiness && (
                  <p className="text-red-500 text-sm mt-1">{errors.yearsInBusiness.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="turnoverTime">Annual Turnover (USD)</Label>
                <Input id="turnoverTime" type="text" {...register("turnoverTime")} />
                {errors.turnoverTime && (
                  <p className="text-red-500 text-sm mt-1">{errors.turnoverTime.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Company Description (optional)</Label>
                <Textarea id="description" {...register("description")} />
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" {...register("agreeToTerms")} />
                  <Label htmlFor="terms">I agree to the terms and conditions</Label>
                </div>
                {errors.agreeToTerms && (
                  <p className="text-red-500 text-sm mt-1">{errors.agreeToTerms.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full">
                Register
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupplierRegistrationInvite;
