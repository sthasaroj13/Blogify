import  { useState, useContext, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../images/logo.png';
import { FaBars, FaTimes } from 'react-icons/fa'; // Import FaTimes as well for close icon
import { UserContext } from '../context/UserContext.jsx';

function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { currentUser } = useContext(UserContext);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const closeMenuOnClickOutside = (event) => {
      // Close the dropdown menu if clicked outside of it
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    // Attach the event listener
    document.addEventListener('mousedown', closeMenuOnClickOutside);

    // Cleanup the event listener
    return () => {
      document.removeEventListener('mousedown', closeMenuOnClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeMenu = () => {
    setIsDropdownOpen(false);
  };

  return (
    <>
      <nav className="bg-gray-800 fixed top-0 left-0 w-full z-50 "
      
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to='/'>
              <img src={Logo} alt="Logo" style={{ height: '60px', display: "block" }} />
            </Link>
          </div>

          {/* Render the button for both mobile and web */}
          <button className="md:hidden" onClick={toggleMenu}>
            {isDropdownOpen ? <FaTimes className="text-white" /> : <FaBars className="text-white" />}
          </button>

          {/* Render the menu for web, always visible */}
          {currentUser?.id && (
            <ul className="hidden md:flex items-center">
              <li><Link to={`/profile/${currentUser.id}`} className="text-white py-2 px-4 hover:text-gray-300">{currentUser?.name}</Link></li>
              <li><Link to='/create' className="text-white py-2 px-4 hover:text-gray-300">+ Create Posts</Link></li>
              <li><Link to='/authors' className="text-white py-2 px-4 hover:text-gray-300">Authors</Link></li>
              <li><Link to='/logout' className="text-white py-2 px-4 hover:text-gray-300">Logout</Link></li>
            </ul>
          )}

          {!currentUser?.id && (
            <ul className="hidden md:flex items-center">
              <li><Link to='/authors' className="text-white py-2 px-4 hover:text-gray-300">Authors</Link></li>
              <li><Link to='/login' className="text-white py-2 px-4 hover:text-gray-300">Login</Link></li>
            </ul>
          )}

          {/* Conditionally render the menu for mobile */}
          {currentUser?.id && isDropdownOpen && (
            <ul ref={dropdownRef} className="md:hidden absolute top-12 right-0 bg-gray-400 py-2 px-4 rounded-md shadow-lg z-20 dropdown-menu ">
              <li><Link to={`/profile/${currentUser.id}`} className="text-white block py-2 hover:text-gray-300" onClick={closeMenu}>{currentUser?.name}</Link></li>
              <li><Link to='/create' className="text-white block py-2 hover:text-gray-300" onClick={closeMenu}>+ Create Posts</Link></li>
              <li><Link to='/authors' className="text-white block py-2 hover:text-gray-300" onClick={closeMenu}>Authors</Link></li>
              <li><Link to='/logout' className="text-white block py-2 hover:text-gray-300" onClick={closeMenu}>Logout</Link></li>
            </ul>
          )}

          {!currentUser?.id && isDropdownOpen && (
            <ul ref={dropdownRef} className="md:hidden absolute top-12 right-0 bg-gray-400 py-2 px-4 rounded-md shadow-lg z-20 dropdown-menu">
              <li><Link to='/authors' className="text-white block py-2 hover:text-gray-300" onClick={closeMenu}>Authors</Link></li>
              <li><Link to='/login' className="text-white block py-2 hover:text-gray-300" onClick={closeMenu}>Login</Link></li>
            </ul>
          )}
        </div>
      </nav>
    </>
  );
}

export default Header;
