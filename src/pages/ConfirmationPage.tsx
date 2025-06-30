
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Shield, Home, FileText } from "lucide-react";

const ConfirmationPage = () => {
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

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Company Name</p>
                <p className="font-medium">{supplier.companyName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Contact Person</p>
                <p className="font-medium">{supplier.contactPerson}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{supplier.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Country</p>
                <p className="font-medium">{supplier.country}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Industry</p>
                <p className="font-medium">{supplier.industry}</p>
              </div>
              {supplier.certifications && supplier.certifications.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Certifications</p>
                  <div className="flex flex-wrap gap-1">
                    {supplier.certifications.map((cert: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Risk Assessment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className={`inline-flex items-center justify-center p-4 rounded-full ${getRiskColor(supplier.riskCategory)}`}>
                  {getRiskIcon(supplier.riskCategory)}
                </div>
                <div className="mt-3">
                  <div className="text-3xl font-bold text-gray-900">{supplier.riskScore}/100</div>
                  <Badge 
                    className={`mt-2 ${getRiskColor(supplier.riskCategory)}`}
                    variant="secondary"
                  >
                    {supplier.riskCategory} Risk
                  </Badge>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div
                  className={`h-3 rounded-full ${
                    supplier.riskScore >= 80
                      ? "bg-green-500"
                      : supplier.riskScore >= 60
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${supplier.riskScore}%` }}
                />
              </div>
              
              <p className="text-sm text-gray-600 text-center">
                {getRiskMessage(supplier.riskCategory, supplier.riskScore)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What Happens Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <span className="text-blue-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-medium">Application Review</h3>
                  <p className="text-sm text-gray-600">
                    Our team will review your application within 2-3 business days.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <span className="text-blue-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-medium">Documentation Verification</h3>
                  <p className="text-sm text-gray-600">
                    We may request additional documentation based on your risk assessment.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <span className="text-blue-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-medium">Final Approval</h3>
                  <p className="text-sm text-gray-600">
                    You'll receive an email notification once your application is approved.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="text-center space-x-4">
          <Link to="/">
            <Button variant="outline" size="lg">
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <Link to="/supplier-registration">
            <Button size="lg">
              Register Another Supplier
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
