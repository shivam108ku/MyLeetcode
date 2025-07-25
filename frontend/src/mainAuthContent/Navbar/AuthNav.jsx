import React, { useState } from 'react';
import ShinyText from '../../ui/ShinyText';
import { useAuthStore } from '../../store/authStore';
import ThreeBackground from '../../components/ThreeBackground';

const AuthNav = () => {


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
        <div className="flex items-center
         border-b-1 rounded-b-2xl border-yellow-600 
      w-full md:w-[70%] justify-between md:justify-between
      md:mx-auto p-4 shadow-md">
       
            {/* Logo */}
            <ShinyText
                text="SmartCode" disabled={false} speed={4} className='custom-class text-2xl font-black' />

            {/* User Dropdown */}
            {isAuthenticated && (
                <div className="relative">
                    <button
                        onClick={handleToggleDropdown}
                        className="font-black cursor-pointer"
                    >
                        <span className='text-xs text-zinc-400'>Hi,</span>
                        <ShinyText text={user?.firstName} disabled={false} speed={4} className='custom-class text-lg font-black' />
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-6 rounded-2xl border w-16
                           border-zinc-700 shadow-lg z-10">
                            <button
                                onClick={handleLogout}
                                className="w-16 py-2 rounded-2xl text-red-400 text-xs cursor-pointer
                               hover:bg-zinc-800"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default AuthNav