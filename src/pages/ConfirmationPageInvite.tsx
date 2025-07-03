import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Shield, Home, FileText } from "lucide-react";

const ConfirmationPageInvite = () => {
  const location = useLocation();
  const supplier = location.state?.supplier;

  if (!supplier) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>No Data Found</CardTitle>
            <CardDescription>
              Please complete the registration process first.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link to="/supplier-registration">
              <Button>Start Registration</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getRiskColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "low": return "text-green-600 bg-green-50";
      case "medium": return "text-yellow-600 bg-yellow-50";
      case "high": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getRiskIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "low": return <CheckCircle className="h-8 w-8" />;
      case "medium": return <AlertTriangle className="h-8 w-8" />;
      case "high": return <Shield className="h-8 w-8" />;
      default: return null;
    }
  };

  const getRiskMessage = (category: string, score: number) => {
    switch (category.toLowerCase()) {
      case "low":
        return "Excellent! Your company has been classified as low risk. You can expect expedited processing of your application.";
      case "medium":
        return "Good! Your company has been classified as medium risk. Some additional documentation may be required.";
      case "high":
        return "Your company has been classified as high risk. Our team will conduct a thorough review and may request additional information.";
      default:
        return "Your risk assessment has been completed.";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Registration Successful!</h1>
          <p className="text-gray-600 text-lg">
            Thank you for registering with SupplierHub. Your application has been submitted and processed.
          </p>
        </div>

        {/* Details Card */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle>Registration Details</CardTitle>
            <CardDescription>Here is a summary of your registration information.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <strong>Company Name:</strong> {supplier.companyName}
              </div>
              <div>
                <strong>Contact Person:</strong> {supplier.contactPerson}
              </div>
              <div>
                <strong>Email:</strong> {supplier.email}
              </div>
              <div>
                <strong>Company House Number:</strong> {supplier.companyHouse || 'N/A'}
              </div>
              <div className="md:col-span-2">
                <strong>Company Address:</strong> {supplier.address}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link to="/supplier-create-login">
            <Button size="lg">
              Create Supplier Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPageInvite; 