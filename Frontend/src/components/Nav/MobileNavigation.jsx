import ThemeToggle from "./ThemeToggle";
import { ShoppingCart, Menu, BotMessageSquare } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { useState } from "react";
import PropTypes from "prop-types";
import { useCart } from "../../pages/cart/context/CartContex";
import { Badge } from "../ui/badge";
const MobileNavigation = ({
  user,
  userData,
  navigate,
  handleLogout,
  handleDashboardClick,
  handleMarketClick,
  handleHomeClick,
  loading,
}) => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hi! How can I help you today?" },
  ]);

  const sendMessage = async () => {
    if (!query.trim()) return;

    const userMessage = { sender: "user", text: query };
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botMessage = { sender: "bot", text: data.answer };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ Sorry, I'm having trouble connecting. Please try again later.",
        },
      ]);
    }
  };
  const { cartCount } = useCart();
  return (
    <div className="lg:hidden flex items-center space-x-5">
      <Button variant="outline" onClick={() => navigate("/cart")} size="icon">
        <ShoppingCart className="h-6 w-6" />
        {cartCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute top-4 right-[124px] h-4 w-4 justify-center rounded-full p-0"
          >
            {cartCount}
          </Badge>
        )}
      </Button>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" aria-label="support">
            <BotMessageSquare className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="h-[75%] rounded-md bg-[#e9e9e950] backdrop-blur-sm dark:bg-[#817d7d44]"
        >
          <div className="flex flex-col pt-10 h-[95%]">
            <div className="flex-1 overflow-y-auto p-2 space-y-2 border border-primary rounded-md bg-transparent">
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

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <div className="flex flex-col h-full py-8">
            <div className="flex-1 py-4">
              <nav className="space-y-4">
                <Button
                  key="home"
                  variant="ghost"
                  onClick={handleHomeClick}
                  className="w-full justify-start "
                >
                  Home
                </Button>
                <Button
                  key="market"
                  variant="ghost"
                  onClick={handleMarketClick}
                  className="w-full justify-start "
                >
                  Market
                </Button>
                <Button
                  key="recommendation"
                  variant="ghost"
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
                </Button>
                <Button
                  onClick={handleDashboardClick}
                  variant="ghost"
                  aria-label="Dashboard"
                  className="w-full justify-start"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Dashboard"}
                </Button>
              </nav>
            </div>
            <div className="border-t pt-4">
              <div className="pb-2">
                <ThemeToggle showText={true} />
              </div>

              {user ? (
                <div>
                  <Button
                    onClick={handleLogout}
                    variant="destructive"
                    className="w-full"
                  >
                    Log out
                  </Button>
                </div>
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
  userData: PropTypes.object,
  navigate: PropTypes.func.isRequired,
  handleLogout: PropTypes.func.isRequired,
  handleDashboardClick: PropTypes.func.isRequired,
  handleMarketClick: PropTypes.func.isRequired,
  handleHomeClick: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default MobileNavigation;
