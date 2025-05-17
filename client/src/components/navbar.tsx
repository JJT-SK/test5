import { useState } from "react";
import { useHashLocation } from "@/lib/use-hash-location";
import { FaDna, FaHome, FaUsers, FaFlask, FaTrophy, FaChartLine, FaBell, FaBars } from "react-icons/fa";

const Navbar = () => {
  const [location, navigate] = useHashLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navItems = [
    { path: "/", label: "Dashboard", icon: <FaHome /> },
    { path: "/community", label: "Community", icon: <FaUsers /> },
    { path: "/protocols", label: "Protocols", icon: <FaFlask /> },
    { path: "/achievements", label: "Achievements", icon: <FaTrophy /> },
    { path: "/data-analysis", label: "Data Analysis", icon: <FaChartLine /> },
  ];

  // Use custom navigation function with hash-based routing
  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => handleNavigate("/")}>
              <FaDna className="text-primary text-2xl mr-2" />
              <span className="font-bold text-lg text-dark">BioHacker</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <div 
                key={item.path} 
                onClick={() => handleNavigate(item.path)}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 cursor-pointer ${
                  location === item.path 
                    ? "text-primary border-b-2 border-primary" 
                    : "text-dark-medium hover:text-primary"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          
          <div className="flex items-center">
            <div className="ml-3 relative hidden md:block">
              <div className="flex items-center space-x-3">
                <div 
                  onClick={() => handleNavigate("/auth")}
                  className="px-3 py-2 rounded-md text-sm font-medium flex items-center cursor-pointer text-dark-medium hover:text-primary"
                >
                  <span>About BioHacker</span>
                </div>
                <button className="bg-light p-1 rounded-full text-gray-400 hover:text-primary">
                  <FaBell className="text-lg" />
                </button>
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
                  <span className="text-sm font-semibold">JD</span>
                </div>
              </div>
            </div>
            <div className="flex md:hidden">
              <button className="text-dark-medium p-2" onClick={toggleMobileMenu}>
                <FaBars className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile navigation menu */}
      <div className={`md:hidden bg-white pb-3 border-t ${mobileMenuOpen ? "" : "hidden"}`}>
        <div className="px-2 space-y-1">
          {navItems.map((item) => (
            <div 
              key={item.path} 
              onClick={() => handleNavigate(item.path)}
              className={`w-full flex items-center px-3 py-2 font-medium rounded-md cursor-pointer ${
                location === item.path
                  ? "text-primary bg-blue-50"
                  : "text-dark-medium hover:bg-light"
              }`}
            >
              <span className="w-5 mr-2">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
          <div 
            onClick={() => handleNavigate("/auth")}
            className="w-full flex items-center px-3 py-2 font-medium rounded-md cursor-pointer text-dark-medium hover:bg-light"
          >
            <span className="w-5 mr-2">📄</span>
            <span>About BioHacker</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;