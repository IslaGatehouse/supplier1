import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    contactPerson: "",
    phone: "",
    companyHouse: "",
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
  });
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [yearsInBusinessError, setYearsInBusinessError] = useState("");
  const [turnoverTimeError, setTurnoverTimeError] = useState("");

  const totalSteps = 3;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const validatePhone = (value: string) => {
    // Allow +, digits, spaces, dashes, parentheses, min 7 digits
    const cleaned = value.replace(/[^\d]/g, "");
    const regex = /^\+?[\d\s\-()]{7,}$/;
    if (!value) return ""; // No error if empty (optional field)
    if (!regex.test(value) || cleaned.length < 7) {
      return "Please enter a valid phone number.";
    }
    return "";
  };

  const validateEmail = (value: string) => {
    // Simple email regex
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) return ""; // No error if empty (should be required by form)
    if (!regex.test(value)) {
      return "Please enter a valid email address.";
    }
    return "";
  };

  const validateYearsInBusiness = (value: string) => {
    if (!value) return "Only numerical values are allowed.";
    if (!/^\d*$/.test(value)) return "Only numerical values are allowed.";
    return "";
  };

  const validateTurnoverTime = (value: string) => {
    if (!value) return "Only numerical values are allowed.";
    if (!/^\d*$/.test(value)) return "Only numerical values are allowed.";
    return "";
  };

  const handleInputChange = (field: string, value: any) => {
    if (field === "yearsInBusiness" || field === "turnoverTime") {
      // Remove negative values and allow only digits
      value = value.replace(/[^\d]/g, "");
    }
    if (field === "phone") {
      const error = validatePhone(value);
      setPhoneError(error);
    }
    if (field === "email") {
      const error = validateEmail(value);
      setEmailError(error);
    }
    if (field === "yearsInBusiness") {
      const error = validateYearsInBusiness(value);
      setYearsInBusinessError(error);
    }
    if (field === "turnoverTime") {
      const error = validateTurnoverTime(value);
      setTurnoverTimeError(error);
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCertificationChange = (certification: string, checked: boolean | string) => {
    const isChecked = checked === true || checked === "true";
    setFormData(prev => ({
      ...prev,
      certifications: isChecked 
        ? [...prev.certifications, certification]
        : prev.certifications.filter(c => c !== certification)
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const calculateRiskScore = () => {
    let score = 100; // Start with perfect score

    // Years in Business Impact
    const years = parseInt(formData.yearsInBusiness);
    if (years < 2) score -= 20;
    else if (years < 5) score -= 10;
    else if (years > 20) score += 5; // reward for long-standing business

    // Certifications Impact (reward for each unique cert, up to 5)
    const certCount = Math.min(formData.certifications.length, 5);
    score += certCount * 5;

    // Company Size Impact
    if (formData.companySize === "large") score += 10;
    else if (formData.companySize === "medium") score += 5;
    else if (formData.companySize === "small") score -= 5;

    // Industry Impact (example: higher risk for construction, lower for healthcare)
    if (formData.industry === "construction") score -= 10;
    else if (formData.industry === "healthcare") score += 5;

    // Country Impact (example: reward for certain countries)
    if (["united-states", "germany", "japan", "switzerland"].includes(formData.country)) score += 5;

    // Clamp score between 0 and 100
    return Math.max(0, Math.min(100, score));
  };

  const getRiskCategory = (score: number) => {
    if (score >= 80) return "Low";
    if (score >= 60) return "Medium";
    return "High";
  };

  const handleSubmit = () => {
    const riskScore = calculateRiskScore();
    const riskCategory = getRiskCategory(riskScore);
    let certifications = formData.certifications;
    if (certifications.includes("Other") && formData.otherCertification.trim()) {
      certifications = certifications.filter(c => c !== "Other");
      certifications = [...certifications, ...formData.otherCertification.split(",").map(c => c.trim()).filter(Boolean)];
    }
    let industry = formData.industry === "other" && formData.otherIndustry.trim()
      ? formData.otherIndustry.trim()
      : formData.industry;
    const newSupplier = {
      ...formData,
      certifications,
      industry,
      id: Date.now().toString(),
      riskScore,
      riskCategory,
      submittedAt: new Date().toISOString()
    };
    fetch("http://localhost:8000/suppliers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSupplier),
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to submit supplier");
        return res.json();
      })
      .then(data => {
        toast({
          title: "Registration Submitted!",
          description: "Your supplier registration has been successfully submitted.",
        });
        navigate("/confirmation", { state: { supplier: data } });
      })
      .catch(() => {
        toast({
          title: "Submission Failed",
          description: "There was an error submitting your registration.",
        });
      });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName" className="dark:text-white">Company Name *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email" className="dark:text-white">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  aria-invalid={!!emailError}
                  aria-describedby="email-error"
                />
                {emailError && (
                  <p id="email-error" className="text-red-600 text-xs mt-1">{emailError}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactPerson" className="dark:text-white">Contact Person *</Label>
                <Input
                  id="contactPerson"
                  value={formData.contactPerson}
                  onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="companyHouse" className="dark:text-white">Company House Number</Label>
                <Input
                  id="companyHouse"
                  value={formData.companyHouse}
                  onChange={(e) => handleInputChange("companyHouse", e.target.value)}
                  placeholder="e.g., 12345678"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone" className="dark:text-white">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  aria-invalid={!!phoneError}
                  aria-describedby="phone-error"
                />
                {phoneError && (
                  <p id="phone-error" className="text-red-600 text-xs mt-1">{phoneError}</p>
                )}
              </div>
              <div>
                <Label htmlFor="country" className="dark:text-white">Country *</Label>
                <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={countryOpen}
                      className="w-full justify-between"
                    >
                      {formData.country
                        ? countries.find((country) => country.toLowerCase().replace(/\s+/g, '-') === formData.country)
                        : "Select country..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
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
                              onSelect={(currentValue) => {
                                const countryValue = country.toLowerCase().replace(/\s+/g, '-');
                                handleInputChange("country", formData.country === countryValue ? "" : countryValue);
                                setCountryOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.country === country.toLowerCase().replace(/\s+/g, '-') ? "opacity-100" : "opacity-0"
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
              </div>
              <div className="md:col-span-2 flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="industry" className="dark:text-white">Industry *</Label>
                  <Select value={formData.industry} onValueChange={(value) => handleInputChange("industry", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
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
                </div>
                {formData.industry === "other" && (
                  <div className="flex-1 flex flex-col justify-end">
                    <Input
                      id="otherIndustry"
                      placeholder="Please specify your industry"
                      value={formData.otherIndustry}
                      onChange={e => handleInputChange("otherIndustry", e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      
      case 2:
        const isOtherChecked = formData.certifications.includes("Other");
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
                      checked={formData.certifications.includes(cert)}
                      onCheckedChange={(checked) => handleCertificationChange(cert, checked || false)}
                    />
                    <Label htmlFor={cert} className="dark:text-white">{cert}</Label>
                  </div>
                ))}
                {isOtherChecked && (
                  <div className="mt-2">
                    <Input
                      id="otherCertification"
                      placeholder="Please specify other certification(s)"
                      value={formData.otherCertification}
                      onChange={e => handleInputChange("otherCertification", e.target.value)}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companySize" className="dark:text-white">Company Size</Label>
                <Select value={formData.companySize} onValueChange={(value) => handleInputChange("companySize", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small (1-50 employees)</SelectItem>
                    <SelectItem value="medium">Medium (51-200 employees)</SelectItem>
                    <SelectItem value="large">Large (200+ employees)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="yearsInBusiness" className="dark:text-white">Years in Business</Label>
                <Input
                  id="yearsInBusiness"
                  type="number"
                  value={formData.yearsInBusiness}
                  onChange={(e) => handleInputChange("yearsInBusiness", e.target.value)}
                  placeholder="e.g., 5"
                  aria-invalid={!!yearsInBusinessError}
                  aria-describedby="years-in-business-error"
                />
                {yearsInBusinessError && (
                  <p id="years-in-business-error" className="text-red-600 text-xs mt-1">{yearsInBusinessError}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="turnoverTime" className="dark:text-white">Turnover Time (in days)</Label>
                <Input
                  id="turnoverTime"
                  type="number"
                  value={formData.turnoverTime}
                  onChange={(e) => handleInputChange("turnoverTime", e.target.value)}
                  placeholder="e.g., 30"
                  aria-invalid={!!turnoverTimeError}
                  aria-describedby="turnover-time-error"
                />
                {turnoverTimeError && (
                  <p id="turnover-time-error" className="text-red-600 text-xs mt-1">{turnoverTimeError}</p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="description" className="dark:text-white">Company Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Brief description of your company and services..."
                rows={4}
              />
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="fileUpload" className="dark:text-white">Upload Documents</Label>
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Upload company certificates, licenses, or other relevant documents</p>
                <Input id="fileUpload" type="file" multiple className="hidden" />
                <Button variant="outline" onClick={() => document.getElementById('fileUpload')?.click()}>
                  Choose Files
                </Button>
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
                <p><strong>Country:</strong> {formData.country}</p>
                <p><strong>Industry:</strong> {formData.industry}</p>
                {formData.industry === 'other' && formData.otherIndustry && (
                  <p><strong>Other Industry:</strong> {formData.otherIndustry}</p>
                )}
                <p><strong>Certifications:</strong> {formData.certifications.join(', ') || 'None'}</p>
                {formData.certifications.includes('Other') && formData.otherCertification && (
                  <p><strong>Other Certification(s):</strong> {formData.otherCertification}</p>
                )}
                <p><strong>Company Size:</strong> {formData.companySize || 'N/A'}</p>
                <p><strong>Years in Business:</strong> {formData.yearsInBusiness || 'N/A'}</p>
                <p><strong>Turnover Time (days):</strong> {formData.turnoverTime || 'N/A'}</p>
                <p><strong>Description:</strong> {formData.description || 'N/A'}</p>
                <p><strong>Agreed to Terms:</strong> {formData.agreeToTerms ? 'Yes' : 'No'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked)}
                required
              />
              <Label htmlFor="terms" className="text-sm dark:text-gray-200">
                I agree to the terms and conditions and privacy policy *
              </Label>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
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
            {renderStep()}
            
            <div className="flex justify-between mt-8">
              <Button
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              {currentStep < totalSteps ? (
                <Button
                  onClick={handleNext}
                  disabled={
                    (currentStep === 1 && (!formData.companyName || !formData.email || !formData.contactPerson || !formData.country || !formData.industry || !!emailError)) ||
                    (currentStep === 2 && (
                      !formData.companySize ||
                      !formData.yearsInBusiness ||
                      !formData.turnoverTime ||
                      (!!formData.phone && !!phoneError) ||
                      !!yearsInBusinessError ||
                      !!turnoverTimeError
                    ))
                  }
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!formData.agreeToTerms}
                >
                  Submit Registration
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupplierRegistration;
