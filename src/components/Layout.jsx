import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ darkMode, setDarkMode, children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Background Gradient Effects */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-10 left-10 w-[350px] h-[350px] rounded-full bg-gradient-to-br from-purple-600 to-pink-500 opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-[450px] h-[450px] rounded-full bg-gradient-to-br from-blue-600 to-cyan-400 opacity-20 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-[300px] h-[300px] rounded-full bg-gradient-to-br from-green-500 to-teal-400 opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 left-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-pink-400 to-red-400 opacity-20 blur-3xl"></div>
      </div>

      {/* Navbar */}
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Page Content */}
      <main className="flex-grow relative z-10">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
