import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Search, Download, Shield, AlertTriangle, CheckCircle, ChevronsUpDown, Check } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Supplier {
  id: string;
  companyName: string;
  email: string;
  contactPerson: string;
  country: string;
  industry: string;
  riskScore: number;
  riskCategory: string;
  submittedAt: string;
  certifications: string[];
  delayHistory: string;
  phone?: string;
  companyHouse?: string;
  otherIndustry?: string;
  otherCertification?: string;
  companySize?: string;
  yearsInBusiness?: string;
  turnoverTime?: string;
  description?: string;
  registrationType?: string;
}

const sampleSuppliers: Supplier[] = [
  {
    id: "1",
    companyName: "Tech Solutions Inc",
    email: "contact@techsolutions.com",
    contactPerson: "John Smith",
    country: "united-states",
    industry: "technology",
    riskScore: 85,
    riskCategory: "Low",
    submittedAt: "2024-01-15T10:30:00Z",
    certifications: ["ISO 9001", "SOC 2"],
    delayHistory: "excellent",
    registrationType: 'self'
  },
  {
    id: "2",
    companyName: "Global Manufacturing Ltd",
    email: "info@globalmanuf.com",
    contactPerson: "Sarah Johnson",
    country: "germany",
    industry: "manufacturing",
    riskScore: 72,
    riskCategory: "Medium",
    submittedAt: "2024-01-20T14:15:00Z",
    certifications: ["ISO 9001", "ISO 14001"],
    delayHistory: "good",
    registrationType: 'self'
  },
  {
    id: "3",
    companyName: "Healthcare Supplies Co",
    email: "orders@healthsupply.com",
    contactPerson: "Dr. Michael Brown",
    country: "canada",
    industry: "healthcare",
    riskScore: 91,
    riskCategory: "Low",
    submittedAt: "2024-01-25T09:45:00Z",
    certifications: ["ISO 9001", "ISO 45001", "GDPR Compliant"],
    delayHistory: "excellent",
    registrationType: 'self'
  },
  {
    id: "4",
    companyName: "Quick Build Construction",
    email: "contracts@quickbuild.com",
    contactPerson: "Maria Garcia",
    country: "spain",
    industry: "construction",
    riskScore: 58,
    riskCategory: "High",
    submittedAt: "2024-02-01T16:20:00Z",
    certifications: ["ISO 45001"],
    delayHistory: "frequent",
    registrationType: 'self'
  },
  {
    id: "5",
    companyName: "Financial Services Group",
    email: "partnerships@fingroup.com",
    contactPerson: "David Lee",
    country: "united-kingdom",
    industry: "finance",
    riskScore: 88,
    riskCategory: "Low",
    submittedAt: "2024-02-05T11:10:00Z",
    certifications: ["SOC 2", "GDPR Compliant"],
    delayHistory: "excellent",
    registrationType: 'self'
  },
  {
    id: "6",
    companyName: "Retail Solutions Corp",
    email: "vendor@retailsol.com",
    contactPerson: "Lisa Wang",
    country: "australia",
    industry: "retail",
    riskScore: 65,
    riskCategory: "Medium",
    submittedAt: "2024-02-10T13:30:00Z",
    certifications: ["ISO 9001"],
    delayHistory: "occasional",
    registrationType: 'self'
  }
];

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

const AdminDashboard = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [countrySearch, setCountrySearch] = useState("");
  const [sortOrder, setSortOrder] = useState("az");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [certificationFilter, setCertificationFilter] = useState("all");
  const [countryPopoverOpen, setCountryPopoverOpen] = useState(false);
  const [pendingIds, setPendingIds] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load suppliers from localStorage or use sample data
    const storedSuppliers = JSON.parse(localStorage.getItem("suppliers") || "[]");
    if (storedSuppliers.length === 0) {
      // If no suppliers exist, add sample data
      localStorage.setItem("suppliers", JSON.stringify(sampleSuppliers));
      setSuppliers(sampleSuppliers);
      setFilteredSuppliers(sampleSuppliers);
    } else {
      setSuppliers(storedSuppliers);
      setFilteredSuppliers(storedSuppliers);
    }
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = suppliers;

    if (searchTerm) {
      filtered = filtered.filter(supplier =>
        supplier.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (riskFilter !== "all") {
      filtered = filtered.filter(supplier => supplier.riskCategory.toLowerCase() === riskFilter);
    }

    if (countryFilter !== "all") {
      filtered = filtered.filter(supplier => supplier.country === countryFilter);
    }

    if (industryFilter !== "all") {
      filtered = filtered.filter(supplier => supplier.industry === industryFilter);
    }

    if (certificationFilter !== "all") {
      filtered = filtered.filter(supplier => (supplier.certifications || []).includes(certificationFilter));
    }

    // Sort by selected order
    filtered = filtered.slice().sort((a, b) => {
      if (sortOrder === "az") {
        return a.companyName.localeCompare(b.companyName);
      } else if (sortOrder === "za") {
        return b.companyName.localeCompare(a.companyName);
      } else if (sortOrder === "date-newest") {
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      } else if (sortOrder === "date-oldest") {
        return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
      }
      return 0;
    });

    setFilteredSuppliers(filtered);
  }, [suppliers, searchTerm, riskFilter, countryFilter, industryFilter, certificationFilter, sortOrder]);

  const getRiskBadgeColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRiskIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "low": return <CheckCircle className="h-4 w-4" />;
      case "medium": return <AlertTriangle className="h-4 w-4" />;
      case "high": return <Shield className="h-4 w-4" />;
      default: return null;
    }
  };

  const exportToCSV = () => {
    const headers = ["Company Name", "Contact Person", "Email", "Country", "Industry", "Risk Score", "Risk Category", "Submitted Date"];
    const csvData = filteredSuppliers.map(supplier => [
      supplier.companyName,
      supplier.contactPerson,
      supplier.email,
      supplier.country,
      supplier.industry,
      supplier.riskScore,
      supplier.riskCategory,
      new Date(supplier.submittedAt).toLocaleDateString()
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "suppliers.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const stats = {
    total: suppliers.length,
    lowRisk: suppliers.filter(s => s.riskCategory === "Low").length,
    mediumRisk: suppliers.filter(s => s.riskCategory === "Medium").length,
    highRisk: suppliers.filter(s => s.riskCategory === "High").length,
  };

  const uniqueCountries = [...new Set(suppliers.map(s => s.country))];

  // List of all countries for the filter dropdown
  const allCountries = [
    "united-states", "germany", "canada", "spain", "united-kingdom", "australia",
    "france", "italy", "japan", "china", "india", "brazil", "mexico", "south-africa", "russia", "netherlands", "sweden", "norway", "switzerland", "singapore"
  ];
  const filteredCountries = allCountries.filter(c => c.toLowerCase().includes(countrySearch.toLowerCase()));

  // Get unique industries and certifications for filter dropdowns
  const uniqueIndustries = [
    ...new Set(suppliers.map(s => s.industry).filter(Boolean))
  ];
  const uniqueCertifications = [
    ...new Set(suppliers.flatMap(s => s.certifications || []).filter(Boolean))
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 dark:text-white">Admin Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-200">Manage and review supplier registrations</p>
            </div>
            <Button onClick={exportToCSV} className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-200">Total Suppliers</CardTitle>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-200">Low Risk</CardTitle>
              <div className="text-2xl font-bold text-green-600">{stats.lowRisk}</div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-200">Medium Risk</CardTitle>
              <div className="text-2xl font-bold text-yellow-600">{stats.mediumRisk}</div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-200">High Risk</CardTitle>
              <div className="text-2xl font-bold text-red-600">{stats.highRisk}</div>
            </CardHeader>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="dark:text-white">Filters</CardTitle>
            <CardDescription className="dark:text-gray-200">Filter suppliers by various criteria</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Boxed Sort By Section */}
            <div className="border rounded-lg p-4 bg-muted mb-4">
              <h2 className="text-lg font-semibold mb-2 dark:text-white">Sort by</h2>
              <div className="max-w-xs">
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="az">Company Name: A-Z</SelectItem>
                    <SelectItem value="za">Company Name: Z-A</SelectItem>
                    <SelectItem value="date-newest">Date: Newest to Oldest</SelectItem>
                    <SelectItem value="date-oldest">Date: Oldest to Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search suppliers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by risk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                </SelectContent>
              </Select>
              {/* Country Popover Filter */}
              <Popover open={countryPopoverOpen} onOpenChange={setCountryPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={countryPopoverOpen}
                    className="w-full justify-between"
                  >
                    {countryFilter !== "all"
                      ? countries.find((country) => country.toLowerCase().replace(/\s+/g, '-') === countryFilter)
                      : "All Countries"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search country..." />
                    <CommandList>
                      <CommandEmpty>No country found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          key="all"
                          value="all"
                          onSelect={() => {
                            setCountryFilter("all");
                            setCountryPopoverOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              countryFilter === "all" ? "opacity-100" : "opacity-0"
                            )}
                          />
                          All Countries
                        </CommandItem>
                        {countries.map((country) => {
                          const countryValue = country.toLowerCase().replace(/\s+/g, '-');
                          return (
                            <CommandItem
                              key={country}
                              value={country}
                              onSelect={() => {
                                setCountryFilter(countryValue);
                                setCountryPopoverOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  countryFilter === countryValue ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {country}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {/* End Country Popover Filter */}
              <Select value={industryFilter} onValueChange={setIndustryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  {uniqueIndustries.map(industry => (
                    <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                  ))}
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Select value={certificationFilter} onValueChange={setCertificationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by certification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Certifications</SelectItem>
                  {uniqueCertifications.map(cert => (
                    <SelectItem key={cert} value={cert}>{cert}</SelectItem>
                  ))}
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Suppliers Table */}
        <Card>
          <CardHeader>
            <CardTitle className="dark:text-white">Suppliers ({filteredSuppliers.length})</CardTitle>
            <CardDescription className="dark:text-gray-200">All registered suppliers with their risk assessments</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredSuppliers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {suppliers.length === 0 ? "No suppliers registered yet." : "No suppliers match your filters."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Registration Type</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Company House #</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Industry</TableHead>
                      <TableHead>Other Industry</TableHead>
                      <TableHead>Certifications</TableHead>
                      <TableHead>Other Certification(s)</TableHead>
                      <TableHead>Company Size</TableHead>
                      <TableHead>Years in Business</TableHead>
                      <TableHead>Turnover Time</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Risk Score</TableHead>
                      <TableHead>Risk Level</TableHead>
                      <TableHead>Submitted</TableHead>
                    </TableRow>
                    
                  </TableHeader>
                  <TableBody>
                    {filteredSuppliers.map((supplier) => (
                      <TableRow key={supplier.id}>
                        <TableCell>
                          {supplier.registrationType === 'self' ? (
                            pendingIds.includes(supplier.id) ? (
                              <Badge className="bg-amber-100 text-amber-800 border-amber-200 py-1 px-3 text-sm rounded-md">Pending</Badge>
                            ) : (
                              <Button size="sm" onClick={async () => {
                                const link = `${window.location.origin}/supplier-create-login`;
                                try {
                                  const res = await fetch("http://localhost:8000/send-invite-email", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ email: supplier.email, link }),
                                  });
                                  const data = await res.json();
                                  if (data.success) {
                                    setPendingIds(prev => [...prev, supplier.id]);
                                    toast({ title: "Email sent!", description: `Invite sent to ${supplier.email}` });
                                  } else {
                                    toast({ title: "Error", description: data.error || "Failed to send email", variant: "destructive" });
                                  }
                                } catch (err) {
                                  toast({ title: "Error", description: "Failed to send email", variant: "destructive" });
                                }
                              }}>
                                Accept
                              </Button>
                            )
                          ) : (
                            <Badge className="bg-green-100 text-green-800 border-green-200 py-1 px-3 text-sm rounded-md">Join</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{supplier.companyName}</div>
                        </TableCell>
                        <TableCell>
                          {supplier.registrationType === 'self' ? 'Self' : supplier.registrationType === 'invite' ? 'Invited' : 'Unknown'}
                        </TableCell>
                        <TableCell>{supplier.contactPerson}</TableCell>
                        <TableCell>{supplier.email}</TableCell>
                        <TableCell>{supplier.phone || 'N/A'}</TableCell>
                        <TableCell>{supplier.companyHouse || 'N/A'}</TableCell>
                        <TableCell>{supplier.country}</TableCell>
                        <TableCell>{supplier.industry}</TableCell>
                        <TableCell>{supplier.otherIndustry || 'N/A'}</TableCell>
                        <TableCell>{(supplier.certifications || []).join(', ') || 'None'}</TableCell>
                        <TableCell>{supplier.otherCertification || 'N/A'}</TableCell>
                        <TableCell>{supplier.companySize || 'N/A'}</TableCell>
                        <TableCell>{supplier.yearsInBusiness || 'N/A'}</TableCell>
                        <TableCell>{supplier.turnoverTime || 'N/A'}</TableCell>
                        <TableCell>{supplier.description || 'N/A'}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  supplier.riskScore >= 80
                                    ? "bg-green-500"
                                    : supplier.riskScore >= 60
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                }`}
                                style={{ width: `${supplier.riskScore}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{supplier.riskScore}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getRiskBadgeColor(supplier.riskCategory)} flex items-center gap-1 w-fit`}>
                            {getRiskIcon(supplier.riskCategory)}
                            {supplier.riskCategory}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(supplier.submittedAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
