import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../pages/auth/Firebase";
import { useAuth } from "../../pages/auth/AuthContext";

import MobileNavigation from "./MobileNavigation";
import DesktopNavigation from "./DesktopNavigation";
const Nav = () => {
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken();
        localStorage.setItem("authToken", token);

        try {
          const response = await fetch(`${BASE_URL}/api/user`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }

          const data = await response.json();
          setUserData(data.user);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        localStorage.removeItem("authToken");
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  const handleHomeClick = () => {
    navigate("/");
  };
  const handleDashboardClick = () => {
    console.log("User Role:", userData?.role || "No role assigned");
    navigate("/dashboard");
  };
  const handleMarketClick = () => {
    if (!userData?.role) {
      navigate("/market"); // Default to regular market if no role
      return;
    }

    // Redirect based on role
    switch (userData.role) {
      case "Farmer":
      case "Shopkeeper":
        navigate("/farmermarket");
        break;
      case "User":
      case "Deliveryman":
      default:
        navigate("/market");
    }
  };

  return (
    <nav className="fixed top-0 w-full py-4 px-4 md:px-8 lg:px-32 flex items-center justify-between z-50 bg-white/40 dark:bg-background/80 backdrop-blur-md ">
      <h1 className="text-3xl font-black ">
        <span className="dark:bg-gradient-to-r dark:from-green-400 dark:to-white bg-clip-text dark:text-transparent text-primary">
          FAIRBASKET<span className="text-secondary">.</span>
        </span>
      </h1>

      <DesktopNavigation
        user={user}
        userData={userData}
        navigate={navigate}
        handleLogout={handleLogout}
        handleDashboardClick={handleDashboardClick}
        handleMarketClick={handleMarketClick}
        handleHomeClick={handleHomeClick}
        loading={loading}
      />

      <MobileNavigation
        user={user}
        userData={userData}
        navigate={navigate}
        handleLogout={handleLogout}
        handleDashboardClick={handleDashboardClick}
        handleMarketClick={handleMarketClick}
        handleHomeClick={handleHomeClick}
        loading={loading}
      />
    </nav>
  );
};

export default Nav;
