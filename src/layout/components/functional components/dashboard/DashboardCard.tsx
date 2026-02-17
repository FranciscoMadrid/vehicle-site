import { Card } from 'primereact/card'
import React from 'react'
import type { IconType } from 'react-icons'
import DynamicIcon from '../../helper/DynamicIcon'

export interface DashboardCardProps{
  title: string,
  total: number,
  icon: string,
  cardColor?: string
  subtitle?: string
}

export default function DashboardCard({
  title,
  subtitle,
  icon, 
  cardColor = 'bg-primary text-white',
  total}:DashboardCardProps) {
  return (
    <div 
      className="shadow-2 border-round bg-light  rounded-2xl overflow-hidden">
      <div className="grid grid-cols-[auto_1fr_20%] justify-between items-center h-full">
        <div className={`min-w-2 max-w-2 h-full ${cardColor}`}/>
        <div className='p-5'>
          <span className="block text-500 font-medium mb-3">{title}</span>
          <div className="text-900 font-bold text-3xl">{total}</div>
        </div>
        <div className={`flex items-center justify-center h-full w-full ${cardColor}`}>
          {icon && (
            <DynamicIcon
              icon={icon}
              className='text-2xl md:text-4xl'
            />
          )}
        </div>
      </div>
      <span className="text-500">{subtitle}</span>
    </div>
  )
}
