import ThemeToggle from "./ThemeToggle";
import { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "../ui/button";
import { useCart } from "../../pages/cart/context/CartContex";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  User,
  LogOut,
  ShoppingCart,
  Brain,
  BotMessageSquare,
  House,
  Store,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet"; // update path as per your structure

const DesktopNavigation = ({
  user,
  userData,
  navigate,
  handleLogout,
  handleDashboardClick,
  handleMarketClick,
  handleHomeClick,
  loading,
}) => {
  const { cartCount } = useCart();
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hi! How can I help you today?" },
  ]);

  const sendMessage = async () => {
    if (!query.trim()) return;

    // Show user message
    const userMessage = { sender: "user", text: query, id: Date.now() };
    setMessages((prev) => [...prev, userMessage]);
    setQuery("");

    try {
      const response = await fetch(
        "https://bugsquashers-ai-agent.onrender.com/api/query",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        }
      );

      // Check for HTTP errors (4xx/5xx responses)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Parse JSON only if the response is OK
      const data = await response.json();

      // Check if the expected data structure exists
      if (!data.answer) {
        throw new Error("Invalid response format from server");
      }

      const botMessage = {
        sender: "bot",
        text: data.answer,
        id: Date.now() + 1,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("API request failed:", error);

      let errorText = "⚠️ Failed to fetch support response.";
      if (error.message.includes("HTTP error")) {
        errorText = "⚠️ Service unavailable. Please try again later.";
      } else if (error.message.includes("Invalid response format")) {
        errorText = "⚠️ Unexpected response from the server.";
      }

      setMessages((prev) => [...prev, { sender: "bot", text: errorText }]);
    }
  };

  return (
    <div className="hidden lg:flex justify-between items-center space-x-6 text-muted-foreground">
      <div>
        <Button variant="outline" onClick={handleHomeClick}>
          Home
          <House className="h-6 w-6 ml-2" />
        </Button>
      </div>
      <div>
        <Button variant="outline" onClick={handleMarketClick}>
          Market
          <Store className="h-6 w-6 ml-2" />
        </Button>
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" aria-label="AI">
            Support assistant
            <BotMessageSquare className="h-6 w-6 ml-2" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-full max-w-md bg-[#e9e9e950] backdrop-blur-sm dark:bg-[#817d7d44] rounded-l-md"
        >
          <SheetHeader>
            <SheetTitle className="text-white">
              <span className="dark:bg-gradient-to-r dark:from-green-400 dark:to-white bg-clip-text dark:text-transparent text-primary">
                Support Assistant{" "}
              </span>
            </SheetTitle>
          </SheetHeader>
          {/* Chat system goes here */}
          <div className="flex flex-col pt-5 h-[95%] ">
            <div className="flex-1 overflow-y-auto p-2 space-y-2 border border-[#494949] rounded-md bg-transparent">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-2 rounded shadow text-sm ${
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground self-end"
                      : "bg-background"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border rounded-md text-sm"
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <Button size="sm" onClick={sendMessage}>
                Send
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Button
        variant="outline"
        aria-label="AI"
        onClick={() => {
          if (userData?.role === "User") {
            navigate("/recommendation");
          } else {
            navigate("/airedirect");
          }
        }}
      >
        Ai recommendations
        <Brain className="h-6 w-6" />
      </Button>

      <div className="relative">
        <Button variant="outline" onClick={() => navigate("/cart")} size="icon">
          <ShoppingCart className="h-6 w-6" />
          {cartCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 justify-center rounded-full p-0"
            >
              {cartCount}
            </Badge>
          )}
        </Button>
      </div>

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
  handleHomeClick: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default DesktopNavigation;
