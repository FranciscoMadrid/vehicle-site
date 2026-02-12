import React from 'react'
import { Avatar } from 'primereact/avatar';

export interface HeaderProps {
  title: string,
  avatar_user?: string,
  avatar_picture?: string
}
export default function Header({title, avatar_user ='FFMS', avatar_picture}: HeaderProps) {
  return (
    <header className='w-full h-fit p-5 bg-light flex flex0row items-center justify-between'>
      <h1 className='text-2xl font-bold tracking-wide'>{title}</h1>
      <Avatar 
        label={avatar_user.charAt(0)}
        shape='circle'
        className='text-white bg-secundary shadow-2xl'
        size='large'/>
    </header>
  )
}
