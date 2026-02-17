import React, { useEffect, useMemo, useState } from 'react';
import { LogService, type LogFilters } from '@/service/log';
import { VehicleService } from '@/service/vehicle';
import type { Log, Vehicle } from '../../util/type';
import DashboardCard from './DashboardCard';
import { Chart } from 'primereact/chart';
import { Skeleton } from 'primereact/skeleton';
import FadeInWrapper from '../animations/FadeInWrapper';

export default function DashboardContainer() {
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState<Log[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const fetchLog = async (filters?: Partial<LogFilters>) => {
    setLoading(true);
    try {
      const res = await LogService.getAll(filters);
      setLog(res);

      const vehicleRes = await VehicleService.getAll();
      setVehicles(vehicleRes);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const uniqueDriversCount = new Set(log.map((item) => item.driver_name)).size;

  const chartData = useMemo(() => {
    const entryCounts = [0, 0, 0, 0];
    const exitCounts = [0, 0, 0, 0];

    log.forEach((entry) => {
      const date = new Date(entry.date);
      const month = date.getMonth();
      const quarterIndex = Math.floor(month / 3);

      if (entry.type === 'ENTRY') {
        entryCounts[quarterIndex] += 1;
      } else if (entry.type === 'EXIT') {
        exitCounts[quarterIndex] += 1;
      }
    });

    return {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [
        {
          label: 'Entries',
          data: entryCounts,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1,
        },
        {
          label: 'Exits',
          data: exitCounts,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 1,
        },
      ],
    };
  }, [log]);

  const chartOptions = {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
        legend: {
            labels: {
                color: '#495057'
            }
        }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  useEffect(() => {
    fetchLog();
  }, []);

  if(loading) {
    return (
      <div className='flex flex-col gap-5'>
        <div className='flex flex-row gap-5'>
          <Skeleton height='10rem'/>
          <Skeleton height='10rem'/>
        </div>
        <Skeleton height='24rem'/>
      </div>
    )
  }

  return (
    <FadeInWrapper direction='Up'>
      <section className="grid grid-cols-2 gap-5 rounded-md">
        <DashboardCard 
          title="Total Active Vehicles" 
          total={vehicles.length} 
          icon="FaCar" 
        />
        <DashboardCard
          title="Total Drivers"
          total={uniqueDriversCount}
          icon="GiFullMotorcycleHelmet"
          cardColor="bg-primary-light text-white"
        />

        <div className="col-span-2 flex flex-col gap-2 card p-4 bg-light rounded-2xl">
          <Chart
            type="bar" 
            data={chartData} 
            options={chartOptions} 
            style={{ position: 'relative', width: '100%', height: '400px' }} 
          />
        </div>
      </section>
    </FadeInWrapper>
  );
}