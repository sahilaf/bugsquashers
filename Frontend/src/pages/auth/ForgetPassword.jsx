import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./Firebase";
import { toast } from "react-hot-toast";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import Lottie from "react-lottie-player";
import welcomeback from "./assets/welcomeback.json";

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { handleSubmit, register } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, data.email);
      toast.success("Password reset email sent! Check your inbox", { position: "bottom-right" });
      navigate("/login");
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error(mapErrorCode(error.code), { position: "bottom-right" });
    } finally {
      setIsLoading(false);
    }
  };

  const mapErrorCode = (code) => {
    switch (code) {
      case "auth/invalid-email":
        return "Invalid email address";
      case "auth/user-not-found":
        return "No account found with this email";
      default:
        return "Failed to send reset email. Please try again.";
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Column - Lottie Animation */}
      <div className="hidden lg:block w-1/2 bg-muted items-center justify-center pt-28">
        <Lottie loop animationData={welcomeback} play className="w-full h-[70%]" />
        <div className="text-3xl text-primary flex items-center justify-center font-praise">
          <h1>Don't Worry!</h1>
        </div>
      </div>

      {/* Right Column - Reset Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">Reset Your Password</h2>
            <p className="text-muted-foreground">
              Enter your email to receive a reset link
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  {...register("email")}
                />
              </div>
              <Button disabled={isLoading} className="w-full">
                {isLoading ? "Sending..." : "Send Reset Email"}
              </Button>
            </div>
          </form>
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link 
                to="/login" 
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}