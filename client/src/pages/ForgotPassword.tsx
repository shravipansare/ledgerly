import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, ArrowLeft, MailCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password", {
        email,
      });
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to send reset link");
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
            <MailCheck className="mx-auto h-12 w-12 text-green-500" />
            <h2 className="text-2xl font-bold text-slate-900">Check your email</h2>
            <p className="text-slate-500">
              We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and spam folder.
            </p>
            <Button onClick={() => navigate("/login")} variant="outline" className="mt-4 w-full">
              Back to log in
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardHeader className="space-y-1">
              <div className="flex flex-col space-y-2 text-center">
                <ShieldCheck className="mx-auto h-10 w-10 text-blue-600" />
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Reset Password</h1>
                <p className="text-sm text-slate-500">
                  Enter your email address and we'll send you a link to reset your password.
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
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="m@example.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                {loading ? "Sending..." : "Send reset link"}
              </Button>
              <div className="text-center text-sm">
                <button 
                  type="button"
                  onClick={() => navigate("/login")}
                  className="flex items-center justify-center gap-1 mx-auto text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to log in
                </button>
              </div>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
