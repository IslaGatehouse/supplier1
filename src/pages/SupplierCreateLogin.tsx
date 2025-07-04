import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

const SupplierCreateLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  useEffect(() => {
    // Auto-create the test login on mount
    localStorage.setItem("supplier-username", "test");
    localStorage.setItem("supplier-password", "test");
  }, []);

  const validatePassword = (pwd: string) => {
    // At least 8 chars, one uppercase, one lowercase, one number, one special char
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(pwd);
  };

  // Password requirement checks
  const passwordChecks = [
    {
      label: "At least 8 characters",
      met: password.length >= 8,
    },
    {
      label: "One uppercase letter",
      met: /[A-Z]/.test(password),
    },
    {
      label: "One lowercase letter",
      met: /[a-z]/.test(password),
    },
    {
      label: "One number",
      met: /\d/.test(password),
    },
    {
      label: "One special character",
      met: /[^A-Za-z\d]/.test(password),
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || !repeatPassword) {
      setError("Please enter username and both password fields.");
      return;
    }
    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters and include uppercase, lowercase, number, and special character.");
      return;
    }
    if (password !== repeatPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");

    // Link login to supplier registration data using pending-supplier-id
    const suppliers = JSON.parse(localStorage.getItem("suppliers") || "[]");
    const pendingId = localStorage.getItem("pending-supplier-id");
    // Prevent duplicate usernames across all suppliers
    if (suppliers.some((s: any) => s.username === username)) {
      setError("This username is already taken by another supplier.");
      return;
    }
    let updated = false;
    for (let s of suppliers) {
      if (pendingId && s.id === pendingId) {
        s.username = username;
        s.password = password;
        updated = true;
        break;
      }
    }
    if (updated) {
      localStorage.setItem("suppliers", JSON.stringify(suppliers));
      localStorage.removeItem("pending-supplier-id");
    }

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
            <div className="relative">
              <label htmlFor="password" className="block mb-1 font-medium">Password</label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="new-password"
                placeholder="Choose a password"
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-500 focus:outline-none"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              <ul className="mt-2 space-y-1 text-xs">
                {passwordChecks.map((check, idx) => (
                  <li key={idx} className="flex items-center">
                    <span
                      className={`inline-block w-4 h-4 mr-2 rounded-full border-2 ${check.met ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'}`}
                      aria-hidden="true"
                    >
                      {check.met && (
                        <svg className="w-3 h-3 text-white mx-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    <span className={check.met ? 'text-green-600' : 'text-gray-500'}>{check.label}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <label htmlFor="repeat-password" className="block mb-1 font-medium">Repeat Password</label>
              <Input
                id="repeat-password"
                type={showRepeatPassword ? "text" : "password"}
                value={repeatPassword}
                onChange={e => setRepeatPassword(e.target.value)}
                autoComplete="new-password"
                placeholder="Repeat your password"
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-500 focus:outline-none"
                onClick={() => setShowRepeatPassword((prev) => !prev)}
                aria-label={showRepeatPassword ? "Hide password" : "Show password"}
              >
                {showRepeatPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {repeatPassword && password && repeatPassword !== password && (
                <p className="text-red-600 text-xs mt-1">Passwords do not match.</p>
              )}
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={!username || !password || !repeatPassword || !validatePassword(password) || password !== repeatPassword}>Create Login</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplierCreateLogin; 