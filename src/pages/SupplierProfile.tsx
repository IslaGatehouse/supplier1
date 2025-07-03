import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const SupplierProfile = () => {
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState<any>(null);

  useEffect(() => {
    // Get supplier info from localStorage (from suppliers array)
    const storedUsername = localStorage.getItem("supplier-username");
    const storedEmail = localStorage.getItem("supplier-email");
    const suppliers = JSON.parse(localStorage.getItem("suppliers") || "[]");
    let found = null;
    if (storedUsername) {
      found = suppliers.find((s: any) => s.email === storedEmail || s.username === storedUsername || s.companyName === localStorage.getItem("supplier-companyName"));
    }
    setSupplier(found);
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
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Supplier Profile</CardTitle>
          <CardDescription>Welcome, {supplier.companyName || supplier.username}!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Table>
              <TableBody>
                {Object.entries(supplier).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableHead className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</TableHead>
                    <TableCell>{Array.isArray(value) ? value.join(", ") : String(value)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button className="mt-4 w-full" onClick={() => navigate("/")}>Back to Home</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplierProfile; 