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
  // ... (same countries array as before)
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  // ... (rest of the countries)
  "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const SupplierRegistrationInvite = () => {
  const [formData, setFormData] = useState({
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
  });
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  const navigate = useNavigate();
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
          <form className="space-y-6">
            <div>
              <Label htmlFor="companyName">Company Name *</Label>
              <Input id="companyName" value={formData.companyName} onChange={e => handleInputChange("companyName", e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input id="email" type="email" value={formData.email} onChange={e => handleInputChange("email", e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="contactPerson">Contact Person *</Label>
              <Input id="contactPerson" value={formData.contactPerson} onChange={e => handleInputChange("contactPerson", e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="companyHouse">Company House Number</Label>
              <Input id="companyHouse" value={formData.companyHouse} onChange={e => handleInputChange("companyHouse", e.target.value)} placeholder="e.g., 12345678" />
            </div>
            <div>
              <Label htmlFor="address">Company Address *</Label>
              <Input id="address" value={formData.address} onChange={e => handleInputChange("address", e.target.value)} placeholder="Enter company address" required />
            </div>
            {/* Add other fields as needed */}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplierRegistrationInvite; 