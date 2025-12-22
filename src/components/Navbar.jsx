import React, { useContext, useState } from 'react';
import logo from '../assets/logo.png' // Ensure you have this logo
import { Link, NavLink } from 'react-router';
import { signOut } from 'firebase/auth';
import auth from '../Firebase/firebase.config';
import { AuthContext } from '../Provider/AuthProvider'; // Check path spelling (AuthProvider vs Authprovider)

const Navbar = () => {
    const [isChecked, setIsChecked] = useState(true);
    const { user } = useContext(AuthContext);

    const handleTheme = () => {
        setIsChecked(!isChecked);
        if (isChecked) {
            document.querySelector('html').setAttribute('data-theme', 'dark');
        } else {
            document.querySelector('html').setAttribute('data-theme', 'light');
        }
    };

    const handleSignOut = () => {
        signOut(auth);
    };

    // Links shown to everyone
    const navLinks = (
        <>
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/donation-requests">Donation Requests</NavLink></li>
            <li><NavLink to="/blog">Blog</NavLink></li>
            {/* Funding link is usually visible to everyone or just logged in, requirement says "after logged in"  */}
            {user && <li><NavLink to="/funding">Funding</NavLink></li>}
        </>
    );

    return (
        <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        {navLinks}
                    </ul>
                </div>
                <Link to="/" className='flex items-center gap-2'>
                    <img className="w-auto h-10" src={logo} alt="BloodChai Logo" />
                    <span className='font-bold text-2xl text-red-600 hidden sm:block'>BloodChai</span>
                </Link>
            </div>

            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 gap-2">
                    {navLinks}
                </ul>
            </div>

            <div className="navbar-end gap-3">
                {/* Theme Toggle */}
                <label className="swap swap-rotate">
                    <input type="checkbox" onChange={handleTheme} defaultChecked={isChecked} />
                    {/* sun icon */}
                    <svg className="swap-on fill-current w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,5.64,4.93ZM12,21a1,1,0,0,0,1-1V19a1,1,0,0,0-2,0v1A1,1,0,0,0,12,21Zm7-9a1,1,0,0,0-1-1H17a1,1,0,0,0,0,2h1A1,1,0,0,0,19,12Zm2.12,4.95a1,1,0,0,0,0,1.41A1,1,0,0,0,22,19a1,1,0,0,0,.71-.29l-.71-.71A1,1,0,0,0,21.12,16.95Zm-5.66,5.66a1,1,0,0,0,0-1.41l-.71-.71a1,1,0,0,0-1.41,0,1,1,0,0,0,0,1.41l.71.71A1,1,0,0,0,16.17,22.61Z"/></svg>
                    {/* moon icon */}
                    <svg className="swap-off fill-current w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Z"/></svg>
                </label>

                {user ? (
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                <img alt="User Avatar" src={user?.photoURL || "https://i.ibb.co/T0h4w3s/user.png"} />
                            </div>
                        </div>
                        <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                            <li className="menu-title text-center text-primary">
                                {user?.displayName}
                            </li>
                            <li><Link to="/dashboard">Dashboard</Link></li>
                            <li><button onClick={handleSignOut} className="text-error">Logout</button></li>
                        </ul>
                    </div>
                ) : (
                    <Link to="/login" className="btn btn-primary">Login</Link>
                )}
            </div>
        </div>
    );
};

export default Navbar;