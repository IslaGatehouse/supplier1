
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Search, Download, Shield, AlertTriangle, CheckCircle } from "lucide-react";

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
}

const AdminDashboard = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");

  useEffect(() => {
    // Load suppliers from localStorage
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

    setFilteredSuppliers(filtered);
  }, [suppliers, searchTerm, riskFilter, countryFilter]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Manage and review supplier registrations</p>
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
              <CardTitle className="text-sm font-medium text-gray-600">Total Suppliers</CardTitle>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Low Risk</CardTitle>
              <div className="text-2xl font-bold text-green-600">{stats.lowRisk}</div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Medium Risk</CardTitle>
              <div className="text-2xl font-bold text-yellow-600">{stats.mediumRisk}</div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">High Risk</CardTitle>
              <div className="text-2xl font-bold text-red-600">{stats.highRisk}</div>
            </CardHeader>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter suppliers by various criteria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {uniqueCountries.map(country => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Suppliers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Suppliers ({filteredSuppliers.length})</CardTitle>
            <CardDescription>All registered suppliers with their risk assessments</CardDescription>
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
                      <TableHead>Country</TableHead>
                      <TableHead>Industry</TableHead>
                      <TableHead>Risk Score</TableHead>
                      <TableHead>Risk Level</TableHead>
                      <TableHead>Submitted</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSuppliers.map((supplier) => (
                      <TableRow key={supplier.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{supplier.companyName}</div>
                            <div className="text-sm text-gray-500">{supplier.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{supplier.contactPerson}</TableCell>
                        <TableCell>{supplier.country}</TableCell>
                        <TableCell>{supplier.industry}</TableCell>
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
