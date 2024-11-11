import React from 'react'
import './Navbar.css'

import { useEffect } from 'react';

const Navbar = () => {
    useEffect(() => {
        const body = document.querySelector("body"),
            nav = document.querySelector("nav");
        let getMode = localStorage.getItem("mode");
        if (getMode && getMode === "dark-mode") {
            body.classList.add("dark");
        }
        
        body.addEventListener("click", e => {
            let clickedElm = e.target;
            if (!clickedElm.classList.contains("sidebarOpen") && !clickedElm.classList.contains("menu")) {
                nav.classList.remove("active");
            }
        });
    }, []);

    return (
        <div>
            <nav>
                <div className="nav-bar">
                    <i className='bx bx-menu sidebarOpen'></i>
                    <span className="logo navLogo"><a href="/">Job Automation</a></span>
                    <div className="menu">
                        <div className="logo-toggle">
                            <span className="logo"><a href="/">Job Automation</a></span>
                            <i className='bx bx-x siderbarClose'></i>
                        </div>
                        <ul className="nav-links">
                            <li><a href="/">Home</a></li>
                            <li><a href="/">About</a></li>
                            <li><a href="/">Contact</a></li>
                        </ul>
                    </div>
                    
                </div>
            </nav>
        </div>
    )
}

export default Navbar
