import type { Vehicle, Log } from "@/layout/components/util/type";

export const VEHICLES_DUMMY: Vehicle[] = [
  {
    id: 1,
    brand: "Toyota",
    model: "Hilux",
    plate: "PAB-1234",
    created_at: "2026-02-01T10:00:00Z"
  },
  {
    id: 2,
    brand: "Ford",
    model: "Ranger",
    plate: "PDE-5678",
    created_at: "2026-02-02T14:30:00Z"
  }
];

export const LOGS_DUMMY: Log[] = [
  {
    id: 101,
    vehicleId: 1,
    vehicle: VEHICLES_DUMMY[0],
    type: "EXIT",
    driverName: "John Doe",
    dateTime: "2026-02-10T08:00:00Z",
    mileage: 12500.5,
    createdAt: "2026-02-10T08:05:00Z"
  },
  {
    id: 102,
    vehicleId: 1,
    vehicle: VEHICLES_DUMMY[0],
    type: "ENTRY",
    driverName: "John Doe",
    dateTime: "2026-02-10T17:30:00Z",
    mileage: 12610.2,
    createdAt: "2026-02-10T17:35:00Z"
  }
];