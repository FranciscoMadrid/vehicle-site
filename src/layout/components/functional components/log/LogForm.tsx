import React, { useEffect, useRef, useState } from 'react'
import type { Brand, Log, Model, Vehicle } from '../../util/type';
import type { Toast } from 'primereact/toast';
import { ModelService } from '@/service/model';
import { BrandService } from '@/service/brand';
import { LogService } from '@/service/log';
import { VehicleService } from '@/service/vehicle';
import { Skeleton } from 'primereact/skeleton';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { ProgressSpinner } from 'primereact/progressspinner';

export interface LogFormProps {
  handleClose: () => void;
  mode?: 'update' | 'create' | 'delete',
  selectedLog?: Log[],
  toast?: () => void,
  fetchData: () => void
}

export default function LogForm({handleClose, mode = 'create', selectedLog, toast, fetchData}:LogFormProps) {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false)
  const [models, setModels] = useState<Model[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [selectedBrand, setSelectedBrand] = useState<Brand>()
  const [selectedModel, setSelectedModel] = useState<Model>()
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedType, setSelectedType] = useState<'ENTRY' | 'EXIT'>('ENTRY');
  const [selectedDrivername, setSelectedDrivername] = useState('')
  const [selectedMileage, setSelectedMileage] = useState<number | null | undefined>(null);

  const typeOptions = [
    { label: 'Entry', value: 'ENTRY' },
    { label: 'Exit', value: 'EXIT' }
  ];
    /* Gets values needed for the dropdown */
  useEffect(() => {
    const fetchDropdownData = async() => {
      try {
        setInitialLoading(true)
        const resBrands = await BrandService.getAll();
        const resModels = await ModelService.getAll();
        const resVehicle = await VehicleService.getAll();
        setModels(resModels),
        setBrands(resBrands),
        setVehicles(resVehicle)
        if(selectedLog && selectedLog[0].id){
          const resLog = await LogService.getById(selectedLog[0].id.toString())
          const vehicleId = resLog.fk_vehicle_id
          const vehicleData = resVehicle.find(b => b.id === vehicleId)
          setSelectedVehicle(vehicleData)

          const vehicleBrand = resBrands.find(b => b.id === vehicleData?.fk_brand_id)
          setSelectedBrand(vehicleBrand)

          const vehicleModel = resModels.find(b => b.id === vehicleData?.fk_model_id)
          setSelectedModel(vehicleModel)

          setSelectedDrivername(resLog.driver_name)
          const dateObject = new Date(resLog.date);
          setSelectedDate(dateObject)
          setSelectedMileage(resLog.mileage)
          setSelectedType(resLog.type)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setInitialLoading(false)
      }
    }
    if(mode !== 'delete'){
      fetchDropdownData();
    }
  }, [])

  const filteredModels = React.useMemo(() => {
    if(!selectedBrand) return [];
    return models.filter((model) => model.fk_brand_id === selectedBrand.id)
  }, [selectedBrand, models])

  const filteredVehicles = React.useMemo(() => {
    if(!selectedModel) return [];
    return vehicles.filter((vehicle) => vehicle.fk_brand_id === selectedModel.id)
  }, [selectedModel, vehicles])

  const createRecord = async(e: React.FormEvent) => {
      e.preventDefault();
      try {
        setLoading(true)
        if(selectedVehicle?.id){
          await LogService.create({
            date: selectedDate ? selectedDate.toISOString() : '',
            driver_name: selectedDrivername,
            mileage: selectedMileage ? selectedMileage : 0,
            type: selectedType,
            fk_vehicle_id: selectedVehicle.id
          })
        }
        if(toast){
          toast();
        }
        fetchData()
  
        handleClose();
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
  
  const updateRecord = async(e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true)
      if(selectedLog && selectedLog[0].id){
        const res = await LogService.update(selectedLog[0].id.toString(),{
          mileage: selectedMileage ? selectedMileage : 0,
          date: selectedDate ? selectedDate.toISOString() : '',
          fk_vehicle_id: selectedVehicle?.id,
          driver_name: selectedDrivername,
          type: selectedType
        })
      }
      if(toast){
        toast();
      }
      fetchData()
      handleClose();
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const deleteRecord = async(e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true)
      if(selectedLog && selectedLog.length > 0){
        await Promise.all(
          selectedLog.map(async (log) => {
            if(log.id){
              return await LogService.delete(log.id.toString());
            }
          })
        )
      }
      if(toast){
        toast();
      }
      await fetchData()
      handleClose()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = 
    selectedDrivername.trim() != "" && 
    selectedVehicle !== undefined &&
    selectedDate !== undefined &&
    selectedDate instanceof Date && !isNaN(selectedDate.getTime()) &&
    selectedMileage !== null &&
    selectedType === 'ENTRY' || selectedType === 'EXIT'

  /* Initial Skeleton */
  if (initialLoading) {
    return (
      <div className="p-5 flex flex-col gap-4">
        <Skeleton width="10rem" height="1rem" />
        <Skeleton className='w-full' height="2.5rem" />

        <Skeleton width="10rem" height="1rem" />
        <Skeleton className='w-full' height="2.5rem" />

        <Skeleton width="10rem" height="1rem" />
        <Skeleton className='w-full' height="2.5rem" />

        <Skeleton width="10rem" height="1rem" />
        <Skeleton className='w-full' height="2.5rem" />

        <Skeleton width="10rem" height="1rem" />
        <Skeleton className='w-full' height="2.5rem" />

        <Skeleton width="10rem" height="1rem" />
        <Skeleton className='w-full' height="2.5rem" />

        <Skeleton width="10rem" height="1rem" />
        <Skeleton className='w-full' height="2.5rem" />
        <div className='flex flex-row gap-2 items-center justify-end'>
          <Skeleton width="6rem" height="3rem" />
          <Skeleton width="6rem" height="3rem" />
        </div>
      </div>
    );
  }
  /* Processing Request */
  if(loading){
    return (
      <div className="flex h-full w-full justify-content-center align-items-center" style={{ height: '200px' }}>
        <ProgressSpinner 
          style={{width: '50px', height: '50px'}} 
          strokeWidth="8" 
          fill="var(--surface-ground)" 
          animationDuration=".5s" 
        />
      </div>
    )
  }

  if(mode === 'delete'){
    return (
    <form className='p-5 flex flex-col gap-5 items-center text-center' onSubmit={deleteRecord}>
      <div className="flex flex-col gap-2">
        <i className="pi pi-exclamation-circle text-red-500 text-5xl"></i>
        <h3 className="text-xl font-bold">Confirm Deletion</h3>
        <p className="text-gray-600 max-w-sm">
          Are you sure you want to proceed? This action will delete this log(s).
        </p>
        <span className='font-bold'>{selectedLog?.length} Records will be deleted.</span>
      </div>

      <div className="flex flex-row gap-3 w-full justify-center mt-2">
        <Button 
          type='button'
          onClick={handleClose}
          label="Cancel" 
          icon="pi pi-times" 
          className="p-button-outlined p-button-secondary flex-1" 
        />
        <Button 
          label="Delete" 
          icon="pi pi-trash" 
          className="p-button-danger flex-1" 
        />
      </div>
    </form>
    )
  }
  return (
    <form className='p-5 flex flex-col gap-5' onSubmit={mode === 'create' ? createRecord : updateRecord}>
      <div className='flex flex-col gap-2'>
        <label htmlFor="plate">Driver</label>
        <InputText
          id='drivername'
          value={selectedDrivername}
          className='w-full md:w-14rem'
          onChange={(e) => setSelectedDrivername(e.target.value)}
        />
        <small id='plate-help'>
          {errors.plate}
        </small>
      </div>

      <div className='flex flex-col gap-2'>
        <label htmlFor="brand">Brand</label>
        <Dropdown
          id='brand'
          value={selectedBrand}
          options={brands}
          optionLabel='brand'
          placeholder='Select a brand'
          className='w-full md:w-14rem'
          onChange={(e) => {
            setSelectedBrand(e.value)
            setSelectedModel(undefined)
            setSelectedVehicle(undefined)
          }}
        />
      </div>

      <div className='flex flex-col gap-2'>
        <label htmlFor="model">Model</label>
        <Dropdown
          id='model'
          value={selectedModel}
          options={filteredModels}
          disabled={!selectedBrand}
          optionLabel='model'
          placeholder='Select a model'
          className='w-full md:w-14rem'
          onChange={(e) => {
            setSelectedModel(e.value)
            setSelectedVehicle(undefined)
          }}
        />
        <small id='model-help'>
          {errors.plate}
        </small>
      </div>


      <div className='flex flex-col gap-2'>
        <label htmlFor="plate">Vehicle</label>
        <Dropdown
          id='plate'
          value={selectedVehicle}
          options={filteredVehicles}
          disabled={!selectedModel}
          optionLabel='plate'
          placeholder='Select vehicle'
          className='w-full md:w-14rem'
          onChange={(e) => setSelectedVehicle(e.value)}
        />
      </div>
      <div className='flex flex-col gap-2'>
        <label htmlFor="plate">Type</label>
        <Dropdown
          id='type'
          value={selectedType}
          options={typeOptions}
          optionLabel='label'
          optionValue='value'
          placeholder='Select type'
          className='w-full md:w-14rem'
          onChange={(e) => setSelectedType(e.value)}
        />
      </div>

      <div className='flex flex-col gap-2'>
        <label htmlFor="plate">Mileage</label>
        <InputNumber
          id='mileage'
          value={selectedMileage}
          onValueChange={(e) => setSelectedMileage(e.value)}
          className='w-full md:w-14rem'
        />
      </div>

      <div className='flex flex-col gap-2'>
        <label htmlFor="plate">Date</label>
        <Calendar
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.value as Date | null)}
          showIcon
          showTime
          hourFormat='24'
          readOnlyInput
          dateFormat="yy-mm-dd"
        />
      </div>

      <div className='flex flex-row gap-2 items-center justify-end'>
        <Button
          label={mode === 'create' ? 'Add' : 'Update'}
          severity='info'
          outlined={!isFormValid}
          disabled={!isFormValid}
          type='submit'
        />
        <Button
          label='Cancel'
          severity='danger'
          type='button'
          onClick={handleClose}
        />
      </div>
    </form>
  )
}
