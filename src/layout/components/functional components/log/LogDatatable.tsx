import React, { useEffect, useState } from 'react'
import { DataTable, type DataTableFilterEvent, type DataTableFilterMetaData, type DataTableSelectionMultipleChangeEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';
import type { Log } from '../../util/type';
import type { LogFilters } from '@/service/log';
import { MultiSelect } from 'primereact/multiselect';
import { Slider } from 'primereact/slider';
import { FilterMatchMode } from 'primereact/api';

export interface LogDatatableProps {
  selectedLog: Log[],
  setSelectedLog: (data: Log[]) => void
  data: Log[],
  fetchLogs: (filters?: Partial<LogFilters>) => void,
  loading: boolean
}
export default function LogDatatable({
  selectedLog,
  setSelectedLog,
  data,
  fetchLogs,
  loading
}:LogDatatableProps) {
  const [apiParams, setApiParams] = useState<Partial<LogFilters>>();
  const [rowClick, setRowClick] = useState<boolean>(true);
  const [filters, setFilters] = useState<any>({
    driver_name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    plate: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    model: { value: null, matchMode: FilterMatchMode.CONTAINS },
    brand: { value: null, matchMode: FilterMatchMode.CONTAINS },
    type: { value: null, matchMode: FilterMatchMode.IN },
    mileageRange: { value: null, matchMode: FilterMatchMode.BETWEEN },
    dateRange: { value: null, matchMode: FilterMatchMode.BETWEEN }
  })
  const statuses = [
    { label: 'Entry', value: 'ENTRY' },
    { label: 'Exit', value: 'EXIT' }
  ];

  /* Updates data based on filters */
  const onFilter = (event: DataTableFilterEvent) => {
    const _filters = event.filters;
    setFilters(_filters);

    const getFilterValue = (field: string) => {
      const filter = _filters[field] as DataTableFilterMetaData;
      return filter?.value ?? null;
    };

    const dateFilter = _filters['dateRange'] as DataTableFilterMetaData;
    const params: Partial<LogFilters> = {
      brand: getFilterValue('brand'),
      model: getFilterValue('model'),
      plate: getFilterValue('plate'),
    };

    if (dateFilter?.value) {
      const [start, end] = dateFilter.value;
      if (start) params.startDate = start.toISOString();
      if (end) params.endDate = end.toISOString();
    }
    setApiParams(params);
  };

  const dateBodyTemplate = (rowData: Log) => {
    if (!rowData.date) return '-';
    return new Date(rowData.date).toLocaleString();
  };

  const dateFilterTemplate = (options: any) => {
    return (
      <Calendar
        value={options.value}
        onChange={(e) => {
          options.filterCallback(e.value, options.index);
          const range = e.value as Date[];
          if (!range || range.length < 2 || !range[1]) {
            return;
          }
          const startDate = range[0] ?? null;
          const endDate = range[1] ?? null;
          const params: Partial<LogFilters> = {
            ...apiParams,
            startDate: startDate ? startDate.toISOString()[0] : undefined,
            endDate: endDate ? endDate.toISOString()[0] : undefined,
          };
          setApiParams(params);
        }}
        selectionMode="range"
        readOnlyInput
        placeholder="Select Date Range"
        dateFormat="yy-mm-dd"
      />
    );
  };

  const mileageFilterTemplate = (options: any) => {
    return (
      <div className="flex flex-col gap-2 px-2 w-full">
        <Slider
          value={options.value || [0, 100000]}
          onChange={(e) => {
            options.filterCallback(e.value, options.index);
            const range = e.value as number[];
            if (!range || range.length < 2) return;
            const [min, max] = range;

            const params: Partial<LogFilters> = {
              ...apiParams,
              minMileage: min.toString(),
              maxMileage: max.toString()
            };

            setApiParams(params);
          }}
          range
          min={0}
          max={200000}
          className="w-full"
        />

        <div className="flex justify-between text-sm">
          <span>{options.value?.[0] ?? 0}</span>
          <span>{options.value?.[1] ?? 200000}</span>
        </div>
      </div>
    );
  };
  /* Status Selection */
  const statusRowFilterTemplate = (options: any) => {
    return (
      <MultiSelect
        value={options.value}
        options={statuses}
        onChange={(e) => {
          const newFilters = {...filters}
          newFilters['type'].value = e.value
          onFilter({
            filters: newFilters,
            originalEvent: e.originalEvent
          } as DataTableFilterEvent)
        }}
        optionLabel="label"
        optionValue='value'
        placeholder="Any"
        className="p-column-filter"
        maxSelectedLabels={1} 
        style={{ minWidth: '12rem' }}
      />
    );
  };

  const columnStyle: React.CSSProperties = {
    minWidth: '18rem'
  };
  
  /* Refecthes data based on params */
  useEffect(() => {
    fetchLogs(apiParams);
  }, [apiParams]);
  return (
    <DataTable
      loading={loading}
      rows={10}
      selectionMode={(rowClick ? 'multiple' : 'checkbox') as any}
      selection={selectedLog}
      dataKey={'id'}
      stripedRows
      filters={filters}
      filterDisplay='menu'
      onFilter={onFilter}
      paginator
      onSelectionChange={(e: DataTableSelectionMultipleChangeEvent<Log[]>) => {
        setSelectedLog(e.value)
      }}
      value={data}>
      <Column 
        selectionMode="multiple" 
        headerStyle={{ width: '3rem' }} 
      />
      <Column 
        field="id" 
        header="ID" 
      />
      <Column
        field='driver_name'
        header='Driver'
        filter
        style={columnStyle}
        showFilterMatchModes={false}
        filterPlaceholder='Search by Driver...'
      />
      <Column
        field='plate'
        header='Plate'
        filter
        style={columnStyle}
        showFilterMatchModes={false}
        filterPlaceholder='Search by Plate...'
      />
      <Column
        field='brand'
        header='Brand'
        filter
        style={columnStyle}
        showFilterMatchModes={false}
        filterPlaceholder='Search by Brand...'
      />
      <Column
        field='model'
        header='Model'
        filter
        style={columnStyle}
        showFilterMatchModes={false}
        filterPlaceholder='Search by Model...'
      />
      <Column
        field='type'
        header='Type'
        filter
        filterElement={statusRowFilterTemplate}
        filterField='type'
        filterMatchMode='in'
        style={columnStyle}
        showFilterMatchModes={false}
        filterPlaceholder='Search by Type...'
      />
      <Column
        field='mileage'
        header='Mileage'
        filter
        filterField='mileageRange'
        style={columnStyle}
        showFilterMatchModes={false}
        filterElement={mileageFilterTemplate}
        filterPlaceholder='Search by Mileage...'
      />
    <Column
      field="date"
      header="Date"
      body={dateBodyTemplate}
      filterField="dateRange"
      style={columnStyle}
      filter
      filterElement={dateFilterTemplate}
      showFilterMatchModes={false}
    />
    </DataTable>
  )
}
