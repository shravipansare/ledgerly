import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, {
        password,
      });
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error || "Invalid or expired token. Please request a new link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="absolute top-8 left-8 flex items-center gap-2 text-2xl font-bold tracking-tighter text-slate-900">
        <ShieldCheck className="w-8 h-8 text-blue-600" />
        MartechAdda
      </div>
      
      <Card className="w-full max-w-md shadow-lg border-slate-200">
        {success ? (
          <div className="p-6 text-center space-y-4">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
            <h2 className="text-2xl font-bold text-slate-900">Password Reset!</h2>
            <p className="text-slate-500">
              Your password has been successfully updated. You can now sign in with your new password.
            </p>
            <Button onClick={() => navigate("/login")} className="mt-4 w-full bg-blue-600 hover:bg-blue-700">
              Go to log in
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardHeader className="space-y-1">
              <div className="flex flex-col space-y-2 text-center">
                <ShieldCheck className="mx-auto h-10 w-10 text-blue-600" />
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create New Password</h1>
                <p className="text-sm text-slate-500">
                  Please enter your new password below.
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  required 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                {loading ? "Updating..." : "Reset Password"}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
