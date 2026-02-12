import React from 'react'
import DynamicIcon from './helper/DynamicIcon'
export interface LinkProps{
  icon?: string,
  title: string,
  href: string,
  className?: string
}
export default function Link({
  href, 
  title, 
  className, 
  icon}:LinkProps) {
  return (
  <a 
    href={href}
    className={`flex flex-row items-center gap-2 ${className}`}>
    {icon && (
      <DynamicIcon icon={icon}/>
      )}
    <span>
      {title}
    </span>
  </a>
  )
}
