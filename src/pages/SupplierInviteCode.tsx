import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SupplierInviteCode = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) {
      setError("Please enter your invite code.");
      return;
    }
    setError("");
    // For now, just navigate to the registration page
    navigate("/supplier-registration");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Enter Invite Code</CardTitle>
          <CardDescription>
            Please enter the invite code you received from your company to continue registration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="invite-code" className="block mb-1 font-medium">Invite Code</label>
              <Input
                id="invite-code"
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="Enter your invite code"
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <Button type="submit" className="w-full">Continue</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplierInviteCode; 