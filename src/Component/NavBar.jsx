import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdown, setDropdown] = useState(null);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = (menu) => setDropdown(dropdown === menu ? null : menu);

  return (
    <nav className="shadow-md w-full text-white">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="/" className="flex items-center">
          <img src={logo} alt="Logo" className="w-10 logo rounded-lg" />
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 text-center items-center relative">
          <Link to="/" className="text-white font-medium text-xl hover:text-blue-800">
            Add Blog
          </Link>

          <Link to="/view-blog" className="text-white font-medium text-xl hover:text-blue-800">
            View Blog
          </Link>

        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={toggleMenu}>
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden shadow-md">
          <Link to="/" className="block px-6 py-3 text-white">
            Add Blog
          </Link>
        
          <Link to="/view-blog" className="block px-6 py-3 text-white">
            View Blog
          </Link>
        

        </div>
      )}
    </nav>
  );
};

export default Navbar;