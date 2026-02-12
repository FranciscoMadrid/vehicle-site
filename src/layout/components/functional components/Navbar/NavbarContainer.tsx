import React, { useEffect, useState } from 'react'
import NavbarDesktop from './NavbarDesktop'
import MobileNavbar from './MobileNavbar'

export interface NavbarContainerProps {
  className?: string
}
export default function NavbarContainer({className}:NavbarContainerProps) {
  const [pathname, setPathname] = useState('')
  useEffect(() => {
    setPathname(window.location.pathname)
  }, [])
  return (
    <div className={className}>
      <NavbarDesktop 
        pathname={pathname} 
        className='md:block hidden'/>
      <MobileNavbar 
        pathname={pathname}
        className='md:hidden block'/>
    </div>
  )
}
