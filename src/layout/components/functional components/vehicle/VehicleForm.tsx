import React, { useEffect, useRef, useState } from 'react'
import { InputText } from 'primereact/inputtext';
import type { Brand, Model, Vehicle } from '../../util/type';
import { ModelService } from '@/service/model';
import { BrandService } from '@/service/brand';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { VehicleService } from '@/service/vehicle';
import { Skeleton } from 'primereact/skeleton';
import { ConfirmDialog } from 'primereact/confirmdialog';

export interface VehicleFormProps {
  handleClose: () => void;
  mode?: 'update' | 'create' | 'delete',
  selectedVehicle?: Vehicle[],
  toast?: () => void,
  fetchData: () => void
}

export default function VehicleForm({handleClose, mode = 'create', selectedVehicle, toast, fetchData}:VehicleFormProps) {
  const [loading, setLoading] = useState(false);
  const [models, setModels] = useState<Model[]>([])
  const [filteredModels, setFilteredModels] = useState<Model[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [plate, setPlate] = useState('')
  const [selectedBrand, setSelectedBrand] = useState<Brand>()
  const [selectedModel, setSelectedModel] = useState<Model>()

  /* Gets values needed for the dropdown */
  useEffect(() => {
    const fetchDropdownData = async() => {
      try {
        setLoading(true)
        const resModels = await ModelService.getAll();
        const resBrands = await BrandService.getAll();
        setModels(resModels),
        setBrands(resBrands)
        if(selectedVehicle && selectedVehicle[0].id){
          const resVehicle = await VehicleService.getById(selectedVehicle[0].id.toString())
          setPlate(resVehicle.plate)

          const brandId = resVehicle.fk_brand_id;
          const vehicleBrand = resBrands.find(b => b.id === brandId)
          setSelectedBrand(vehicleBrand)

          const modelId = resVehicle.fk_model_id
          const vehicleModel = resModels.find(m => m.id === modelId)
          setSelectedModel(vehicleModel)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    if(mode !== 'delete'){
      fetchDropdownData();
    }
  }, [])
  
  /* Filters models based on brand */
  useEffect(() => {
    if(selectedBrand){
      const filter = models.filter((model) =>
        model.fk_brand_id === selectedBrand.id
      )
      setFilteredModels(filter)
    }
  }, [selectedBrand])

  const createRecord = async(e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true)
      if(selectedModel?.id){
        await VehicleService.create({
          plate,
          fk_model_id: selectedModel.id
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
      if(selectedModel?.id && selectedVehicle && selectedVehicle[0].id){
        const res = await VehicleService.update(selectedVehicle[0].id.toString(),{
          fk_model_id: selectedModel.id,
          plate: plate
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
      if(selectedVehicle && selectedVehicle.length > 0){
        await Promise.all(
          selectedVehicle.map(async (vehicle) => {
            if(vehicle.id){
              return await VehicleService.delete(vehicle.id.toString());
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

  /* Validates the data */
  const isFormValid = plate.trim() !== "" && selectedModel !== undefined;
  
  if (loading) {
    return (
      <div className="p-5 flex flex-col gap-4">
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

  if(mode === 'delete'){
    return (
    <form className='p-5 flex flex-col gap-5 items-center text-center' onSubmit={deleteRecord}>
      <div className="flex flex-col gap-2">
        <i className="pi pi-exclamation-circle text-red-500 text-5xl"></i>
        <h3 className="text-xl font-bold">Confirm Deletion</h3>
        <p className="text-gray-600 max-w-sm">
          Are you sure you want to proceed? This action will delete this vehicle(s) data and log.
        </p>
        <span className='font-bold'>{selectedVehicle?.length} Records will be deleted.</span>
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
        <label htmlFor="plate">Plate</label>
        <InputText
          id='plate'
          value={plate}
          className='w-full md:w-14rem'
          onChange={(e) => setPlate(e.target.value)}
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
          onChange={(e) => setSelectedBrand(e.value)}
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
          onChange={(e) => setSelectedModel(e.value)}
        />
        <small id='model-help'>
          {errors.plate}
        </small>
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
