import React, { useState } from 'react'
import SiteConfig from "@/config/site.json"
import { FaBars } from "react-icons/fa";
import NavTabs from "@/config/nav-tab.json"
import Link from '../../Link';
import FadeInWrapper from '../animations/FadeInWrapper';

export interface NavbarDesktopProps {
  logo?: string,
  className?: string,
  pathname: string,
}
export default function NavbarDesktop({logo = SiteConfig.site['logo-light'], className, pathname}: NavbarDesktopProps) {
  const [visible, setVisible] = useState(false);

  const handleToggle = () => {
    setVisible(!visible)
  }

  const handleClose = () => {
    setVisible(false);
  }

  const sidePanelStyle = `bg-primary flex flex-col gap-5 transition-all duration-300 ease-in-out overflow-hidden ${visible ? 'w-64' : 'w-20'}`
  const childStyle = `transition-opacity whitespace-nowrap duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`

  return (
    <nav 
      className={`${className} ${sidePanelStyle}`}>
      {/* Logo & Button toggle */}
      <div className='flex flex-row gap-2 items-center p-2 px-4 justify-between'>
        <FaBars
          onClick={handleToggle}
          className='text-white w-fit select-none h-10 shrink-0 cursor-pointer'/>
        <a className={childStyle} href='/'>
          <img 
            className='w-auto h-10' 
            src={logo}
            alt={'logo.png'}
            loading='eager'
          />
        </a>
      </div>
      {/* Link Navigation */}
      {visible && (
        <FadeInWrapper duration={0.5} direction='Right' distance={50}>
          <div className={childStyle}>
            <ul className='w-full flex flex-col gap-2 items-start'>
              {NavTabs.sidepanel.map((nav) => (
                <li className='w-full text-2xl relative font-light text-white' key={nav.tab}>
                  <Link 
                    className={`transition duration-100 ease-in-out p-3 px-5 hover:scale-105 hover:bg-primary-dark 
                      ${pathname === nav.href ? "bg-primary-dark": ""}`}
                    title={nav.name}
                    href={nav.href}
                    icon={nav.icon}/>
                </li>
              ))}
            </ul>
          </div>
        </FadeInWrapper>
      )}
    </nav>
  )
}
