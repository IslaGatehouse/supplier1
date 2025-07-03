import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SupplierCreateLogin = () => {
  const [username, setUsername] = useState("test");
  const [password, setPassword] = useState("test");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-create the test login on mount
    localStorage.setItem("supplier-username", "test");
    localStorage.setItem("supplier-password", "test");
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }
    setError("");
    // Store credentials in localStorage (for demo only)
    localStorage.setItem("supplier-username", username);
    localStorage.setItem("supplier-password", password);
    navigate("/supplier-login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Your Supplier Login</CardTitle>
          <CardDescription>
            Set a username and password to access your supplier account in the future.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block mb-1 font-medium">Username</label>
              <Input
                id="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
                placeholder="Choose a username"
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-1 font-medium">Password</label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="new-password"
                placeholder="Choose a password"
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={!username || !password}>Create Login</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplierCreateLogin; 