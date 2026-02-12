import React, { useState } from 'react'
import { FaBars } from "react-icons/fa";
import DynamicIcon from '../../helper/DynamicIcon';
import NavTabs from "@/config/nav-tab.json"
import Link from '../../Link';

export interface MobileNavbarProps{
  className?: string,
  pathname?: string
}
export default function MobileNavbar({className, pathname}:MobileNavbarProps) {
  const [visible, setVisible] = useState(true)
  
  const handleToggle = () => {
    setVisible(!visible)
  }

  const handleClose = () => {
    setVisible(false)
  }

  return (
    <nav className={`${className} flex items-center bg-primary p-4`}>
      <DynamicIcon 
        onClick={handleToggle}
        icon='FaBars' 
        className='text-white h-10 w-10'/>
      {/* Sliding Panel */}
      <div className={`fixed inset-0 bg-black/30 transition-opacity duration-200 ease-in-out
        ${visible ? 'translate-x-0' : 'translate-x-full'}`}
        onClick={handleClose}>
        <div 
          onClick={(e) => e.stopPropagation()}
          className={`w-2/3 bg-primary h-full fixed top-0 right-0 transform transition-transform duration-200 ease-in-out origin-right
            ${visible ? 'translate-x-0' : 'translate-x-full'}`}>
          {/* Nav */}
          <div className='flex flex-col gap-5 items-center'>
            {/* Logo and Closing button */}
            <div className='flex flex-row w-full p-3 gap-4 justify-between'>
              <img
                loading='eager'
                src='images/Logo - Light.png'
                alt='logo.png'
                className='w-40 h-auto'
              />
              <DynamicIcon 
                onClick={handleClose}
                icon='FaXmark' 
                className='h-10 w-fit text-white self-end'/>
            </div>
            {/* NavLinks */}
            <li className='w-full flex flex-col gap-2 items-start'>
              {NavTabs.sidepanel.map((nav) => (
                <ul className='w-full text-2xl font-light text-white' key={nav.tab}>
                  <Link 
                    className={`transition duration-100 ease-in-out hover:scale-105 p-4 hover:bg-primary-dark 
                      ${pathname === nav.href ? "bg-primary-dark": ""}`}
                    title={nav.name}
                    href={nav.href}
                    icon={nav.icon}/>
                </ul>
              ))}
            </li>
          </div>
        </div>
      </div>
    </nav>
  )
}
