import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword,getIdToken } from "firebase/auth";
import { Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { auth, db } from "./Firebase";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import Lottie from "react-lottie-player";
import welcomeback from "./assets/savetime";
import { useAuth } from "./AuthContext"; // Import useAuth
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-hot-toast";
function Signup() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "User",
  });
  const BASE_URL = import.meta.env.VITE_API_BASE_URL; // Use the environment variable for the base URL
  const { setUser, setUserRole } = useAuth(); // Access setUser and setUserRole from AuthContext

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { fullName, email, password, confirmPassword, role } = formData;

    if (!fullName || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields", { position: "bottom-right" });
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", { position: "bottom-right" });
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Get Firebase Token
      const token = await getIdToken(user); // Get Firebase ID token
      localStorage.setItem("token", token); // Store the token locally

      // Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullName,
        email,
        role,
        createdAt: new Date(),
      });

      setUser(user);
      setUserRole(role);

      // Send user data to backend
      const response = await fetch(`${BASE_URL}/api/signup`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Now sending the correct token
        },
        body: JSON.stringify({ uid: user.uid, fullName, email, role }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Account created successfully!", {
          position: "bottom-right",
        });
        navigate("/");
      } else {
        toast.error(data.message || "Error creating account", {
          position: "bottom-right",
        });
      }
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("Email is already in use. Please use a different email.", {
          position: "bottom-right",
        });
      } else {
        console.error("Error signing up:", error.message);
        toast.error(error.message, { position: "bottom-right" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  return (
    <div className="h-screen flex">
      {/* Left Column - Cover Image */}
      <div className="hidden lg:block w-1/2 bg-muted items-center justify-center overflow-hidden pt-28">
        <Lottie
          loop
          animationData={welcomeback}
          play
          className="w-full h-[70%]"
        />
        <div className="text-3xl text-primary flex items-center justify-center font-praise">
          <h1>Save time and money by signing up!</h1>
        </div>
      </div>

      {/* Right Column - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">Create your account</h2>
            <p className="text-muted-foreground">
              Enter your details to get started
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              {/* Full Name Field */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium mb-1"
                >
                  Full Name
                </label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1"
                >
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-1"
                >
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium mb-1"
                >
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              {/* Role Selection */}
              <div>
                <Label htmlFor="role">Select Role</Label>
                <div className="h-2 w-full"></div>
                <Select
                  onValueChange={(value) =>
                    setFormData({ ...formData, role: value })
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="User">User</SelectItem>
                    <SelectItem value="Shopkeeper">Shopkeeper</SelectItem>
                    <SelectItem value="Deliveryman">Deliveryman</SelectItem>
                    <SelectItem value="Farmer">Farmer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign Up
              </Button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login Buttons */}
          

          {/* Link to Login Page */}
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-primary hover:underline"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
