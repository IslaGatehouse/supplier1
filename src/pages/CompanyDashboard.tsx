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
}

const CompanyDashboard = () => {
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

  useEffect(() => {
    // Load suppliers from localStorage or use sample data
    const storedSuppliers = JSON.parse(localStorage.getItem("suppliers") || "[]");
    setSuppliers(storedSuppliers);
    setFilteredSuppliers(storedSuppliers);
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

  const stats = {
    total: suppliers.length,
    lowRisk: suppliers.filter(s => s.riskCategory === "Low").length,
    mediumRisk: suppliers.filter(s => s.riskCategory === "Medium").length,
    highRisk: suppliers.filter(s => s.riskCategory === "High").length,
  };

  const uniqueCountries = [...new Set(suppliers.map(s => s.country))];
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
          <Link to="/admin-login">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin Login
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 dark:text-white">Company Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-200">View your company information and risk assessment</p>
            </div>
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
                      ? uniqueCountries.find((country) => country.toLowerCase().replace(/\s+/g, '-') === countryFilter)
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
                        {uniqueCountries.map((country) => {
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
                      <TableHead>Company</TableHead>
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
                          <div className="font-medium">{supplier.companyName}</div>
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

export default CompanyDashboard; 