import React, { useEffect, useRef, useState } from 'react'
import VehicleDatatable from './VehicleDatatable'
import DialogButton from '../../partial/DialogButton'
import VehicleForm from './VehicleForm'
import type { Vehicle } from '../../util/type';
import { type VehicleFilters, VehicleService } from '@/service/vehicle';
import { Toast } from 'primereact/toast';
import FadeInWrapper from '../animations/FadeInWrapper';

export default function VehicleContainer() {    
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle[]>([]); 
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Vehicle[]>([]);
  const toast = useRef<Toast>(null);

  const showSuccessCreate = () => {
    toast.current?.show({
      severity: 'success',
      summary: 'Success!',
      detail: 'Record has been created.',
      life: 2000
    })
  }

  const showSuccessUpdate = () => {
    toast.current?.show({
      severity:'secondary',
      summary: 'Updated!',
      detail: 'Record has been updated',
      life: 2000
    })
  }

  const showSuccessDelete = () => {
    toast.current?.show({
      severity: 'warn',
      summary: 'Deleted!',
      detail: `${selectedVehicle.length} Records have been deleted.`
    })
  }

  const fetchVehicles = async (filters?: VehicleFilters) => {
    setLoading(true);
    try {
      const res = await VehicleService.getAll(filters);
      setData(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* Initial Fetch */
  useEffect(() => {
    fetchVehicles();
  }, []);

  return (
    <FadeInWrapper direction='Up'>
      <section className='flex flex-col p-2 rounded-md bg-light'>
        <Toast ref={toast}/>
        <div className='flex flex-row gap-5 p-2 justify-end items-center'>
          <DialogButton
            label='Add'
            header='Add Record'
            className='w-[90vw] md:w-[50vw]'
          >
            {(close) => (
              <VehicleForm 
                handleClose={close} 
                fetchData={fetchVehicles}
                mode='create' 
                toast={showSuccessCreate}/>
            )}
          </DialogButton>
          <DialogButton
            label='Edit'
            header='Edit Record'
            severity='secondary'
            disabled={selectedVehicle.length === 1 ? false : true}
            className='w-[90vw] md:w-[50vw]'
          >
            {(close) => (
              <VehicleForm 
                toast={showSuccessUpdate}
                handleClose={close} 
                mode='update' 
                fetchData={fetchVehicles}
                selectedVehicle={selectedVehicle}/>
            )}
          </DialogButton>
          <DialogButton
            label='Delete'
            header='Delete Record'
            severity='danger'
            disabled={selectedVehicle.length >= 1 ? false : true}
            className='w-[90vw] md:w-[50vw]'
          >
            {(close) => (
              <VehicleForm 
                toast={showSuccessDelete}
                handleClose={close} 
                fetchData={fetchVehicles}
                mode='delete' 
                selectedVehicle={selectedVehicle}/>
            )}
          </DialogButton>
        </div>
        
        <VehicleDatatable
          data={data}
          fetchVehicles={fetchVehicles}
          selectedVehicle={selectedVehicle}
          setSelectedVehicle={setSelectedVehicle}
          loading={loading}
        />
      </section>
    </FadeInWrapper>
  )
}
