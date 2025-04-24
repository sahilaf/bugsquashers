import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { ShoppingCart, Menu, BotMessageSquare } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { useState } from "react";
import PropTypes from "prop-types";

const MOBILE_NAV_ITEMS = ["Market", "Products", "About", "Contact"];
const MobileNavigation = ({
  user,
  navigate,
  handleLogout,
  handleDashboardClick,
  handleMarketClick,
  loading,
}) => {
  const [query, setQuery] = useState("");
    const [messages, setMessages] = useState([
      { sender: "bot", text: "👋 Hi! How can I help you today?" },
    ]);
  
    const sendMessage = async () => {
      if (!query.trim()) return;
  
      // Show user message
      const userMessage = { sender: "user", text: query };
      setMessages((prev) => [...prev, userMessage]);
      setQuery("");
  
      try {
        const response = await fetch("http://127.0.0.1:5000/api/query", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        });
  
        const data = await response.json();
        const botMessage = { sender: "bot", text: data.answer };
        setMessages((prev) => [...prev, botMessage]);
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "⚠️ Failed to fetch support response." },
        ]);
      }
    };
  return (
    <div className="lg:hidden flex items-center space-x-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" aria-label="support">
            <BotMessageSquare className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[75%] rounded-md bg-[#e9e9e950] backdrop-blur-sm dark:bg-[#817d7d44]">
        <div className="flex flex-col pt-10 h-[95%]">
            <div className="flex-1 overflow-y-auto p-2 space-y-2 border rounded-md bg-muted">
              {messages.map((msg, index) => (
                <div
                  key={index}
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

export default MobileNavigation;
