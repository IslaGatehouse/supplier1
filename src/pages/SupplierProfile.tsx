import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SupplierProfile = () => {
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState<any>(null);

  useEffect(() => {
    // For demo: get supplier info from localStorage
    const username = localStorage.getItem("supplier-username");
    const email = localStorage.getItem("supplier-email");
    const companyName = localStorage.getItem("supplier-companyName");
    if (username && companyName) {
      setSupplier({ username, email, companyName });
    }
  }, []);

  if (!supplier) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Not Logged In</CardTitle>
            <CardDescription>Please log in to view your profile.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/supplier-login")}>Go to Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Supplier Profile</CardTitle>
          <CardDescription>Welcome, {supplier.username}!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <strong>Company Name:</strong> {supplier.companyName}
            </div>
            {supplier.email && (
              <div>
                <strong>Email:</strong> {supplier.email}
              </div>
            )}
            <Button className="mt-4 w-full" onClick={() => navigate("/")}>Back to Home</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplierProfile; 