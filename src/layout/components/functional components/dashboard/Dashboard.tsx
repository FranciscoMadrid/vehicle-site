import React from 'react'
import type { Log, Vehicle } from '../../util/type'

export interface DashboardProps{
  VehicleData: Vehicle[],
  LogData: Log[]
}
export default function Dashboard({VehicleData}:DashboardProps) {
  return (
    <section className='p-5 h-full'>
      <div className='border-2 border-black/30 shadow-2xl h-full rounded-md'>
        
      </div>
    </section>
  )
}
