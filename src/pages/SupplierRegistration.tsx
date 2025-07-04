import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Upload, Building2, Check, ChevronsUpDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supplierRegistrationSchema, type SupplierRegistrationFormData } from "@/lib/validationSchemas";

const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica",
  "Croatia", "Cuba", "Cyprus", "Czech Republic", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador",
  "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau",
  "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland",
  "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar",
  "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia",
  "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal",
  "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan",
  "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania",
  "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal",
  "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea",
  "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan",
  "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela",
  "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const SupplierRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [countryOpen, setCountryOpen] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<{name: string, data: string}[]>([]);

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
      agreeToTerms: false
    }
  });

  const totalSteps = 3;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const handleCertificationChange = (certification: string, checked: boolean | string) => {
    const isChecked = checked === true || checked === "true";
    const currentCertifications = form.getValues("certifications") || [];
    
    if (isChecked) {
      form.setValue("certifications", [...currentCertifications, certification]);
    } else {
      form.setValue("certifications", currentCertifications.filter(c => c !== certification));
    }
  };

  const handleNext = async () => {
    let fieldsToValidate: (keyof SupplierRegistrationFormData)[] = [];
    
    if (currentStep === 1) {
      fieldsToValidate = ["companyName", "email", "contactPerson", "phone", "address", "country", "industry", "otherIndustry"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["companySize", "yearsInBusiness", "turnoverTime"];
    }

    const isValid = await form.trigger(fieldsToValidate);
    
    if (isValid && currentStep < totalSteps) {
      if (currentStep === 1) {
        const yib = form.getValues("yearsInBusiness");
        if (yib && isNaN(Number(yib))) {
          form.setValue("yearsInBusiness", "");
        }
      }
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const calculateRiskScore = (data: SupplierRegistrationFormData) => {
    let score = 100;

    const years = parseInt(data.yearsInBusiness);
    if (years < 2) score -= 20;
    else if (years < 5) score -= 10;
    else if (years > 20) score += 5;

    const certCount = Math.min(data.certifications?.length || 0, 5);
    score += certCount * 5;

    if (data.companySize === "large") score += 10;
    else if (data.companySize === "medium") score += 5;
    else if (data.companySize === "small") score -= 5;

    if (data.industry === "construction") score -= 10;
    else if (data.industry === "healthcare") score += 5;

    if (["united-states", "germany", "japan", "switzerland"].includes(data.country)) score += 5;

    return Math.max(0, Math.min(100, score));
  };

  const getRiskCategory = (score: number) => {
    if (score >= 80) return "Low";
    if (score >= 60) return "Medium";
    return "High";
  };

  const onSubmit = (data: SupplierRegistrationFormData) => {
    const riskScore = calculateRiskScore(data);
    const riskCategory = getRiskCategory(riskScore);
    
    let certifications = data.certifications || [];
    if (certifications.includes("Other") && data.otherCertification?.trim()) {
      certifications = certifications.filter(c => c !== "Other");
      certifications = [...certifications, ...data.otherCertification.split(",").map(c => c.trim()).filter(Boolean)];
    }
    
    const industry = data.industry === "other" && data.otherIndustry?.trim()
      ? data.otherIndustry.trim()
      : data.industry;
    
    const newSupplier = {
      ...data,
      certifications,
      industry,
      id: Date.now().toString(),
      riskScore,
      riskCategory,
      submittedAt: new Date().toISOString(),
      registrationType: 'self',
      documents: uploadedDocs,
    };

    // Add to localStorage for admin dashboard
    const suppliers = JSON.parse(localStorage.getItem("suppliers") || "[]");
    suppliers.push(newSupplier);
    localStorage.setItem("suppliers", JSON.stringify(suppliers));

    // Store the new supplier's id for login linking
    localStorage.setItem("pending-supplier-id", newSupplier.id);

    toast({
      title: "Registration Submitted!",
      description: "Your supplier registration has been successfully submitted.",
    });
    navigate("/confirmation", { state: { supplier: newSupplier } });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-white">Company Name *</FormLabel>
                    <FormControl>
                      <Input {...field} style={{ caretColor: 'auto' }} />
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
                    <FormLabel className="dark:text-white">Email Address *</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} style={{ caretColor: 'auto' }} />
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
                    <FormLabel className="dark:text-white">Contact Person *</FormLabel>
                    <FormControl>
                      <Input {...field} style={{ caretColor: 'auto' }} />
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
                    <FormLabel className="dark:text-white">Company House Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="company-house-number"
                        name="company-house-number"
                        placeholder="e.g., 12345678"
                        autoComplete="off"
                        style={{ caretColor: 'auto' }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-white">Company Address *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter company address" style={{ caretColor: 'auto' }} />
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
                    <FormLabel className="dark:text-white">Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} style={{ caretColor: 'auto' }} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-white">Country *</FormLabel>
                    <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                          >
                            {field.value
                              ? countries.find((country) => country.toLowerCase().replace(/\s+/g, '-') === field.value)
                              : "Select country..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search country..." />
                          <CommandList>
                            <CommandEmpty>No country found.</CommandEmpty>
                            <CommandGroup>
                              {countries.map((country) => (
                                <CommandItem
                                  key={country}
                                  value={country}
                                  onSelect={() => {
                                    const countryValue = country.toLowerCase().replace(/\s+/g, '-');
                                    field.onChange(countryValue);
                                    setCountryOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === country.toLowerCase().replace(/\s+/g, '-') ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {country}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-white">Industry *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
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
                {form.watch("industry") === "other" && (
                  <div className="mt-2">
                    <FormField
                      control={form.control}
                      name="otherIndustryText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-white">Please specify your industry</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your industry" {...field} style={{ caretColor: 'auto' }} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      
      case 2:
        const certifications = form.watch("certifications") || [];
        const isOtherChecked = certifications.includes("Other");
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium dark:text-white">Certifications</Label>
              <div className="mt-2 space-y-2">
                {[
                  "ISO 9001", "ISO 14001", "ISO 45001", "SOC 2", "GDPR Compliant", "Other"
                ].map((cert) => (
                  <div key={cert} className="flex items-center space-x-2">
                    <Checkbox
                      id={cert}
                      checked={certifications.includes(cert)}
                      onCheckedChange={(checked) => handleCertificationChange(cert, checked || false)}
                    />
                    <Label htmlFor={cert} className="dark:text-white">{cert}</Label>
                  </div>
                ))}
                {isOtherChecked && (
                  <div className="mt-2">
                    <FormField
                      control={form.control}
                      name="otherCertification"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder="Please specify other certification(s)" style={{ caretColor: 'auto' }} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="companySize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-white">Company Size *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="small">Small (1-50 employees)</SelectItem>
                        <SelectItem value="medium">Medium (51-200 employees)</SelectItem>
                        <SelectItem value="large">Large (200+ employees)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="yearsInBusiness"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-white">Years in Business *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="years-in-business"
                        name="years-in-business"
                        type="number"
                        placeholder="e.g., 5"
                        value={form.getValues('yearsInBusiness') || ""}
                        autoComplete="off"
                        onChange={(e) => field.onChange(e.target.value.replace(/[^\d]/g, ""))}
                        style={{ caretColor: 'auto' }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="turnoverTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-white">Turnover Time (in days) *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        placeholder="e.g., 30"
                        onChange={(e) => field.onChange(e.target.value.replace(/[^\d]/g, ""))}
                        style={{ caretColor: 'auto' }}
                      />
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
                  <FormLabel className="dark:text-white">Company Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Brief description of your company and services..."
                      rows={4}
                      style={{ caretColor: 'auto' }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      
      case 3:
        const formData = form.getValues();
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="fileUpload" className="dark:text-white">Upload Documents</Label>
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Upload company certificates, licenses, or other relevant documents</p>
                <Input id="fileUpload" type="file" multiple className="hidden" onChange={async (e) => {
                  const files = Array.from(e.target.files || []);
                  const newDocs = await Promise.all(files.map(file => {
                    return new Promise<{name: string, data: string}>((resolve) => {
                      const reader = new FileReader();
                      reader.onload = (ev) => resolve({ name: file.name, data: ev.target?.result as string });
                      reader.readAsDataURL(file);
                    });
                  }));
                  setUploadedDocs(prev => [...prev, ...newDocs]);
                }} style={{ caretColor: 'auto' }} />
                <Button type="button" variant="outline" onClick={() => document.getElementById('fileUpload')?.click()}>
                  Choose Files
                </Button>
                {uploadedDocs.length > 0 && (
                  <div className="mt-4 text-left">
                    <div className="font-medium mb-1">Selected Files:</div>
                    <ul className="text-sm text-gray-700">
                      {uploadedDocs.map((doc, idx) => (
                        <li key={idx}>{doc.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2 dark:text-black">Review Your Information</h3>
              <div className="space-y-1 text-sm text-blue-800">
                <p><strong>Company:</strong> {formData.companyName}</p>
                <p><strong>Contact:</strong> {formData.contactPerson}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Phone:</strong> {formData.phone || 'N/A'}</p>
                <p><strong>Company House Number:</strong> {formData.companyHouse || 'N/A'}</p>
                <p><strong>Address:</strong> {formData.address || 'N/A'}</p>
                <p><strong>Country:</strong> {formData.country}</p>
                <p><strong>Industry:</strong> {formData.industry}</p>
                {formData.industry === 'other' && formData.otherIndustry && (
                  <p><strong>Other Industry:</strong> {formData.otherIndustry}</p>
                )}
                <p><strong>Certifications:</strong> {formData.certifications?.join(', ') || 'None'}</p>
                {formData.certifications?.includes('Other') && formData.otherCertification && (
                  <p><strong>Other Certification(s):</strong> {formData.otherCertification}</p>
                )}
                <p><strong>Company Size:</strong> {formData.companySize || 'N/A'}</p>
                <p><strong>Years in Business:</strong> {formData.yearsInBusiness || 'N/A'}</p>
                <p><strong>Turnover Time (days):</strong> {formData.turnoverTime || 'N/A'}</p>
                <p><strong>Description:</strong> {formData.description || 'N/A'}</p>
                <p><strong>Agreed to Terms:</strong> {formData.agreeToTerms ? 'Yes' : 'No'}</p>
                {uploadedDocs.length > 0 && (
                  <div>
                    <strong>Uploaded Documents:</strong>
                    <ul>
                      {uploadedDocs.map((doc, idx) => (
                        <li key={idx}>{doc.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <FormField
              control={form.control}
              name="agreeToTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm dark:text-gray-200">
                      I agree to the terms and conditions and privacy policy *
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate("/start-registration")} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center mb-4">
            <Building2 className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Supplier Registration</h1>
          </div>
          
          <Progress value={progressPercentage} className="mb-4" />
          <p className="text-gray-600 dark:text-gray-200">Step {currentStep} of {totalSteps}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="dark:text-white">
              {currentStep === 1 && "Company Information"}
              {currentStep === 2 && "Business Details"}
              {currentStep === 3 && "Documents & Review"}
            </CardTitle>
            <CardDescription className="dark:text-gray-200">
              {currentStep === 1 && "Tell us about your company"}
              {currentStep === 2 && "Share your business credentials and history"}
              {currentStep === 3 && "Upload documents and review your submission"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
                {renderStep()}
                
                <div className="flex justify-between mt-8">
                  <Button
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                  >
                    Previous
                  </Button>
                  
                  {currentStep < totalSteps ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={!form.formState.isValid}
                    >
                      Submit Registration
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupplierRegistration;
