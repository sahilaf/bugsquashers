import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../pages/auth/Firebase";
import {
  ShoppingCart,
  Menu,
  Camera,
  User,
  Moon,
  Sun,
  Package,
  LogOut,
  Settings,
} from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import PropTypes from "prop-types";
import { useAuth } from "../../pages/auth/AuthContext";

// **Constants**
const MOBILE_NAV_ITEMS = ["Market", "Products", "About", "Contact"];
const CATEGORIES = [
  { name: "Electronics", link: "/categories/electronics" },
  { name: "Clothing", link: "/categories/clothing" },
  { name: "Home & Garden", link: "/categories/home" },
];
// **Nav Component**
// This component handles the navigation bar for the application, including mobile and desktop views.
// It also manages the theme toggle functionality and user authentication state.
// **ThemeToggle Component**
const ThemeToggle = ({ showText = false }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <Button
      variant="outline"
      size={showText ? "default" : "icon"}
      className={`flex items-center justify-center gap-2 p-2 bg-transparent hover:bg-accent rounded-full hover:text-secondary-foreground ${
        showText ? "w-full" : ""
      }`}
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
      {showText && <span>{theme === "light" ? "Dark" : "Light"}</span>}
    </Button>
  );
};

ThemeToggle.propTypes = {
  showText: PropTypes.bool,
};

// **MobileNavigation Component**
const MobileNavigation = ({
  user,
  navigate,
  handleLogout,
  handleDashboardClick,
  handleMarketClick,
  loading,
}) => {
  return (
    <div className="lg:hidden flex items-center space-x-4">
      <Button variant="outline" size="icon" aria-label="Camera">
        <Camera className="h-5 w-5" />
      </Button>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="default" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <div className="flex flex-col h-full py-8">
            <div className="flex-1 py-4">
              <nav className="space-y-4">
                {MOBILE_NAV_ITEMS.map((item) =>
                  item === "Market" ? (
                    <Button
                      key="market"
                      variant="ghost"
                      onClick={handleMarketClick}
                      className="w-full justify-start hover:underline"
                    >
                      Market
                    </Button>
                  ) : (
                    <Link
                      key={item}
                      to={`/${item.toLowerCase()}`}
                      className="block py-2 hover:underline"
                    >
                      {item}
                    </Link>
                  )
                )}
              </nav>
            </div>
            <div className="border-t pt-4">
              <div className="pb-2">
                <ThemeToggle showText={true} />
              </div>
              <Button
                variant="outline"
                className="w-full mb-2 bg-secondary"
                onClick={() => navigate("/cart")}
              >
                <ShoppingCart className="h-5 w-5 mr-2" /> Cart
              </Button>
              {user ? (
                <>
                  <Button
                    onClick={handleDashboardClick}
                    variant="outline"
                    className="w-full mb-2 bg-secondary"
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Dashboard"}
                  </Button>
                  <Button
                    onClick={handleLogout}
                    variant="destructive"
                    className="w-full"
                  >
                    Log out
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => navigate("/login")}
                  variant="default"
                  className="w-full"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

MobileNavigation.propTypes = {
  user: PropTypes.object,
  navigate: PropTypes.func.isRequired,
  handleLogout: PropTypes.func.isRequired,
  handleDashboardClick: PropTypes.func.isRequired,
  handleMarketClick: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

// **DesktopNavigation Component**
const DesktopNavigation = ({
  user,
  userData,
  navigate,
  handleLogout,
  handleDashboardClick,
  handleMarketClick,
  loading,
}) => {
  return (
    <div className="hidden lg:flex justify-between items-center space-x-6 text-muted-foreground">
      <div>
        <Link to="/">Home</Link>
      </div>
      <div>
        <Button
          variant="ghost"
          onClick={handleMarketClick}
          className="bg-transparent hover:bg-transparent hover:text-muted-foreground text-base"
        >
          Market
        </Button>
      </div>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="">Products</NavigationMenuTrigger>
            <NavigationMenuContent className="text-muted-foreground">
              <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <Link
                      to="/"
                      className="block p-6 bg-gradient-to-b from-muted/50 to-muted rounded-md"
                    >
                      <div className="mb-2 mt-4 text-lg font-medium">
                        Featured Products
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Check out our latest items
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                {CATEGORIES.map(({ name, link }) => (
                  <li key={name}>
                    <NavigationMenuLink asChild>
                      <Link to={link}>{name}</Link>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <Button variant="outline" size="icon" aria-label="Camera">
        <Camera className="h-6 w-6" />
      </Button>
      <Button variant="outline" onClick={() => navigate("/cart")} size="icon">
        <ShoppingCart className="h-6 w-6" />
      </Button>

      <ThemeToggle />

      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="relative rounded-full"
              size="icon"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage alt={userData?.displayName || "User"} />
                <AvatarFallback>
                  {userData?.displayName ? (
                    userData.displayName[0].toUpperCase()
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-64 bg-muted p-4"
            align="end"
            forceMount
          >
            <div className="flex flex-col items-center space-y-2 mb-4">
              <Avatar className="h-16 w-16">
                <AvatarImage alt={userData?.displayName || "User"} />
                <AvatarFallback>
                  {userData?.displayName ? (
                    userData.displayName[0].toUpperCase()
                  ) : (
                    <User className="h-8 w-8" />
                  )}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <p className="font-semibold text-lg">
                  {userData?.displayName || "User"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {userData?.email || "demo.user@example.com"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Role: {userData?.role || "N/A"}
                </p>
              </div>
            </div>

            <DropdownMenuItem
              onClick={handleDashboardClick}
              disabled={loading}
              className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md"
            >
              <User className="h-4 w-4" />
              <span>{loading ? "Loading..." : "Dashboard"}</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate("/profile")}
              className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md"
            >
              <Settings className="h-4 w-4" />
              <span>Profile Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate("/orders")}
              className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md"
            >
              <Package className="h-4 w-4" />
              <span>My Orders</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="flex items-center space-x-2 p-2 text-red-600 hover:bg-red-50 rounded-md"
            >
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button onClick={() => navigate("/login")} variant="default">
          Sign In
        </Button>
      )}
    </div>
  );
};

DesktopNavigation.propTypes = {
  user: PropTypes.object,
  userData: PropTypes.object,
  navigate: PropTypes.func.isRequired,
  handleLogout: PropTypes.func.isRequired,
  handleDashboardClick: PropTypes.func.isRequired,
  handleMarketClick: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

// **Main Nav Component**
const Nav = () => {
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken();
        localStorage.setItem("authToken", token);

        try {
          const response = await fetch("http://localhost:3000/api/user", {
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
    <nav className="fixed top-0 w-full py-4 px-4 md:px-8 lg:px-32 flex items-center justify-between z-50 bg-white dark:bg-background/80 backdrop-blur-md ">
      <h1 className="text-3xl font-black text-primary">
        FAIRBASKET<span className="text-secondary">.</span>
      </h1>

      <DesktopNavigation
        user={user}
        userData={userData}
        navigate={navigate}
        handleLogout={handleLogout}
        handleDashboardClick={handleDashboardClick}
        handleMarketClick={handleMarketClick}
        loading={loading}
      />

      <MobileNavigation
        user={user}
        navigate={navigate}
        handleLogout={handleLogout}
        handleDashboardClick={handleDashboardClick}
        handleMarketClick={handleMarketClick}
        loading={loading}
      />
    </nav>
  );
};

export default Nav;
