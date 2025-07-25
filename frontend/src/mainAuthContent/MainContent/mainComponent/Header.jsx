import React, { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import profileImg from '../mainAssets/profile.png'
import { useAuthStore } from '../../../store/authStore';
import { NavLink } from 'react-router';



const Header = () => {

  const { user, isAuthenticated, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleToggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  };

  return (
    <div className="bg-gradient from-[#010214] via-[#020419] to-[#020F3C]
     p-3 sm:p-4 md:p-[1px] ">
      <div className="flex items-center gap-[60%] justify-around">
        <div className="ml-12 md:ml-10">
          <h1 className="text-xl sm:text-3xl mt-1
           font-black text-white">SmartCode</h1>
        </div>

      { isAuthenticated && (
      <div className="flex items-center cursor-pointer relative">
        <div
          onClick={handleToggleDropdown}
          className="hidden mt-1 sm:flex items-center space-x transition-colors"
        >
          <img
            className="h-10 w-10 rounded-full"
            src={profileImg}
            alt="Profile"
          />
          <button className="flex items-center justify-center">
            <span className="text-white p-2 cursor-pointer text-center 
            font-medium hidden md:block">
              {user?.firstName || "User"}
            </span>
            <ChevronDown className="text-slate-400 mr-1 cursor-pointer" size={16} />
          </button>
        </div>

           {dropdownOpen && (
  <ul className="absolute top-12 right-0 bg-zinc-900 border border-zinc-700
    rounded-xl shadow-lg w-32 z-50 flex flex-col py-2">
    <li>
      <button
        onClick={handleLogout}
        className="w-full text-left py-2 px-4 text-sm text-red-400 hover:bg-zinc-800 rounded-xl"
      >
        Logout
      </button>
    </li>
    {user?.role === 'admin' && (
      <li>
        <NavLink
          to="/admin"
          className="w-full block py-2 px-4 text-sm text-blue-400 hover:bg-zinc-800 rounded-xl"
          onClick={() => setDropdownOpen(false)}
        >
          Admin
        </NavLink>
      </li>
    )}
  </ul>
)}

      </div>
    )}
      </div>
    </div>
);
};

export default Header;