import React, { useEffect, useRef, useState } from 'react'
import type { Log } from '../../util/type';
import { Toast } from 'primereact/toast';
import { LogService, type LogFilters } from '@/service/log';
import LogDatatable from './LogDatatable';
import DialogButton from '../../partial/DialogButton';
import LogForm from './LogForm';

export default function LogContainer() {
  const [selectedLog, setSelectedLog] = useState<Log[]>([]); 
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Log[]>([]);
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
      detail: `${selectedLog.length} Records have been deleted.`
    })
  }

  const fetchLog = async (filters?: Partial<LogFilters>) => {
    setLoading(true);
    try {
      const res = await LogService.getAll(filters);
      setData(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* Initial Fetch */
  useEffect(() => {
    fetchLog();
  }, []);

  return (
    <section className='flex flex-col'>
      <Toast ref={toast}/>
      <div className='flex flex-row gap-5 p-2 justify-end items-center'>
        <DialogButton
          label='Add'
          header='Add Record'
          className='p-5 w-[90vw] md:w-[50vw]'
        >
          {(close) => (
            <LogForm 
              handleClose={close} 
              fetchData={fetchLog}
              mode='create' 
              toast={showSuccessCreate}/>
          )}
        </DialogButton>
        <DialogButton
          label='Edit'
          header='Edit Record'
          severity='secondary'
          disabled={selectedLog.length === 1 ? false : true}
          className='p-5 w-[90vw] md:w-[50vw]'
        >
          {(close) => (
            <LogForm 
              toast={showSuccessUpdate}
              handleClose={close} 
              mode='update' 
              fetchData={fetchLog}
              selectedLog={selectedLog}/>
          )}
        </DialogButton>
        <DialogButton
          label='Delete'
          header='Delete Record'
          severity='danger'
          disabled={selectedLog.length >= 1 ? false : true}
          className='p-5 w-[90vw] md:w-[50vw]'
        >
          {(close) => (
            <LogForm 
              toast={showSuccessDelete}
              handleClose={close} 
              fetchData={fetchLog}
              mode='delete' 
              selectedLog={selectedLog}/>
          )}
        </DialogButton>
      </div>
      <LogDatatable
        data={data}
        fetchLogs={fetchLog}
        loading={loading}
        selectedLog={selectedLog}
        setSelectedLog={setSelectedLog}
      />
    </section>
  )
}
