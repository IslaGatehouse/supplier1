import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Shield, Users, CheckCircle } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Building2 className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">SupplierHub</h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-200 max-w-2xl mx-auto">
            Streamline your supplier onboarding process with our comprehensive platform
          </p>
        </header>

        {/* Action Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12 items-stretch">
          <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
            <CardHeader className="text-center">
              <Users className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-2xl">New Supplier?</CardTitle>
              <CardDescription className="text-lg">
                Register your company and get started with our onboarding process
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/supplier-registration">
                <Button size="lg" className="w-full">
                  Start Registration
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Supplier Login Button */}
          <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
            <CardHeader className="text-center">
              <Users className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-2xl">Supplier Login</CardTitle>
              <CardDescription className="text-lg">
                Already registered? Access your supplier account and manage your profile here.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/supplier-login">
                <Button size="lg" className="w-full">
                  Supplier Login
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
            <CardHeader className="text-center">
              <Shield className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-2xl">Admin Access</CardTitle>
              <CardDescription className="text-lg">
                View and manage all supplier registrations and risk assessments
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/admin-login">
                <Button size="lg" className="w-full">
                  Admin Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Why Choose SupplierHub?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Automated Risk Scoring</h3>
              <p className="text-gray-600 dark:text-gray-200">
                Get instant risk assessments based on comprehensive supplier data
              </p>
            </div>
            <div className="text-center">
              <Building2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Streamlined Process</h3>
              <p className="text-gray-600 dark:text-gray-200">
                Simple, intuitive registration process that saves time for everyone
              </p>
            </div>
            <div className="text-center">
              <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Secure & Compliant</h3>
              <p className="text-gray-600 dark:text-gray-200">
                Enterprise-grade security with full compliance tracking
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
