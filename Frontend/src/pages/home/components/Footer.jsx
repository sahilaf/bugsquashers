// components/Footer.jsx
import React from "react";
import {footerData} from "../data/data"; // Adjust the path as needed

const Footer = () => {
  const { about, quickLinks, customerService, connect, copyright } = footerData;

  return (
    <footer className="bg-background text-foreground pt-16 pb-8">
      <div className="px-4 sm:px-8 md:px-16 lg:px-32">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* About Us Section */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-primary">{about.title}</h3>
            <p className="text-muted-foreground">{about.description}</p>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-primary">{quickLinks.title}</h3>
            <ul className="space-y-2 text-muted-foreground">
              {quickLinks.links.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service Section */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-primary">{customerService.title}</h3>
            <ul className="space-y-2 text-muted-foreground">
              {customerService.links.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect With Us Section */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-primary">{connect.title}</h3>
            <ul className="space-y-2 text-muted-foreground">
              {connect.links.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-border pt-8 text-center text-muted-foreground">
          <p>{copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;