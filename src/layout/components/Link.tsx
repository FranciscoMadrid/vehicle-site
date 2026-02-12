import React from 'react'
import DynamicIcon from './helper/DynamicIcon'
import { boolean } from 'astro:schema'
export interface LinkProps{
  icon?: string,
  title: string,
  href: string,
  ariaDisabled?: boolean
  className?: string
}
export default function Link({
  href, 
  title, 
  className, 
  ariaDisabled,
  icon}:LinkProps) {
  return (
  <a 
    aria-disabled={ariaDisabled}
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
