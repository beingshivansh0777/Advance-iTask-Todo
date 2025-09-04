import React from "react";

const Footer = () => {
  return (
    <footer className="mt-10 py-4 text-center text-sm text-gray-500 border-t">
      <p>© {new Date().getFullYear()} iTask. All rights reserved.</p>
      <p>Made with ❤️ by Shivansh</p>
    </footer>
  );
};

export default Footer;
