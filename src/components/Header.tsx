import { Link, useLocation } from "react-router-dom";
import { Shield } from "lucide-react";

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="bg-header text-header-foreground shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold">
            <Shield className="w-6 h-6" />
            <span>TechComplaints</span>
          </Link>
          
          <nav className="flex gap-6">
            <Link 
              to="/" 
              className={`hover:text-accent transition-colors ${isActive('/') ? 'text-accent' : ''}`}
            >
              Products
            </Link>
            <Link 
              to="/complaints" 
              className={`hover:text-accent transition-colors ${isActive('/complaints') ? 'text-accent' : ''}`}
            >
              Complaints
            </Link>
            <Link 
              to="/support" 
              className={`hover:text-accent transition-colors ${isActive('/support') ? 'text-accent' : ''}`}
            >
              Support
            </Link>
          </nav>
        </div>
      </div>
      
      <div className="bg-warning/10 border-t border-warning/20 py-2">
        <div className="container mx-auto px-4 text-center text-sm">
          <span className="inline-flex items-center gap-2 text-foreground">
            <Shield className="w-4 h-4" />
            <strong>LOCAL-ONLY TRAINING LAB</strong> - SQLi Practice Environment v1.0 - DO NOT EXPOSE TO INTERNET
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
