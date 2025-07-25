import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import ShinyText from '../ui/ShinyText'
import { Link } from 'react-router';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className='w-full font-[arial] mx-auto 
          blur-1 fixed top-0 left-0 z-50 p-2 flex justify-around gap-10 
          items-center shadow  '>
            <Link to='/' className="text-2xl font-black">
                  <ShinyText text="SmartCode" disabled={false} speed={4} className='custom-class' />
            </Link>

            <div className="md:hidden cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                <Menu />
            </div>

            <nav
                className={`
                   absolute top-12 flex gap-10 left-10 w-full p-4 font-semibold  
                   ${isOpen ? 'block' : 'hidden'}
                   md:static md:flex md:w-auto md:bg-transparent md:p-2
                           `}
            >
                 
                <Link to='/login' className="cursor-pointer">Login</Link>
                <Link to='/signup' className="cursor-pointer">SignUp</Link>
            </nav>
        </div>

    );
};

export default Navbar;
