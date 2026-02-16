import React, { useState, useMemo, useEffect } from 'react';
import { VehicleService, type VehicleFilters } from '@/service/vehicle';
import type { Vehicle } from '../../util/type';
import { DataTable, type DataTableFilterEvent, type DataTableFilterMetaData, type DataTableSelectionMultipleChangeEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';

export interface VehicleDatatableProps {
  selectedVehicle: Vehicle[],
  setSelectedVehicle: (data: Vehicle[]) => void,
  data: Vehicle[],
  fetchVehicles: (filters?: VehicleFilters) => void,
  loading: boolean
}

export default function VehicleDatatable({
  selectedVehicle, 
  setSelectedVehicle,
  data,
  fetchVehicles,
  loading
}:VehicleDatatableProps) {
  const [apiParams, setApiParams] = useState<VehicleFilters>();
  const [rowClick, setRowClick] = useState<boolean>(true);
  const [filters, setFilters] = useState<any>({
    brand: { value: null, matchMode: 'contains' },
    model: { value: null, matchMode: 'contains' },
    plate: { value: null, matchMode: 'contains' },
    dateRange: { value: null, matchMode: 'between' }
  });
  const [error, setError] = useState<String | null>(null);

  /* Updates data based on filters */
  const onFilter = (event: DataTableFilterEvent) => {
    const _filters = event.filters;
    setFilters(_filters);

    const getFilterValue = (field: string) => {
      const filter = _filters[field] as DataTableFilterMetaData;
      return filter?.value ?? null;
    };

    const dateFilter = _filters['dateRange'] as DataTableFilterMetaData;
    const params: VehicleFilters = {
      brand: getFilterValue('brand'),
      model: getFilterValue('model'),
      plate: getFilterValue('plate'),
    };

    if (dateFilter?.value) {
      const [start, end] = dateFilter.value;
      if (start) params.startDate = start.toISOString().split('T')[0];
      if (end) params.endDate = end.toISOString().split('T')[0];
    }
    setApiParams(params);
  };

  /* Refecthes data based on params */
  useEffect(() => {
    fetchVehicles(apiParams);
  }, [apiParams]);

  const dateBodyTemplate = (rowData: Vehicle) => {
    if (!rowData.created_at) return '-';
    return new Date(rowData.created_at).toLocaleDateString();
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
          const params: VehicleFilters = {
            ...apiParams,
            startDate: startDate ? startDate.toISOString().split('T')[0] : undefined,
            endDate: endDate ? endDate.toISOString().split('T')[0] : undefined,
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

  const columnStyle: React.CSSProperties = {
    minWidth: '18rem'
  };

  return (
    <DataTable
      paginator
      rows={10}
      value={data}
      loading={loading}
      filters={filters}
      onFilter={onFilter}
      selectionMode={(rowClick ? 'multiple' : 'checkbox') as any}
      selection={selectedVehicle}
      onSelectionChange={(e: DataTableSelectionMultipleChangeEvent<Vehicle[]>) => {
        setSelectedVehicle(e.value)
      }}
      dataKey="id"
      stripedRows
      filterDisplay="row"
      responsiveLayout="stack"
    >
      <Column 
        selectionMode="multiple" 
        headerStyle={{ width: '3rem' }} 
      />
      <Column 
        field="id" 
        header="ID" 
      />
      <Column
        field="brand"
        header="Brand"
        filter
        showFilterMenu={false}
        style={columnStyle}
        filterPlaceholder="Search by brand..."
      />
      <Column
        field="model"
        header="Model"
        style={columnStyle}
        filter
        showFilterMenu={false}
        filterPlaceholder="Search by model..."
      />
      <Column
        field="plate"
        header="Plate"
        style={columnStyle}
        filter
        showFilterMenu={false}
        filterPlaceholder="Search by plate..."
      />
      <Column
        field="created_at"
        header="Date"
        body={dateBodyTemplate}
        filterField="dateRange"
        style={columnStyle}
        filter
        filterElement={dateFilterTemplate}
        showFilterMenu={false}
      />
    </DataTable>
  );
}