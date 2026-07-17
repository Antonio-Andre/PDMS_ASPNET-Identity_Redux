export type VanStatus =
  | "Available"
  | "Loading"
  | "Transporting"
  | "Returning"
  | "Unloading"
  | "BrokenOrMaintence";

export type EmployeeStatus =
  | "Active"
  | "Holydays"
  | "DayOfff"
  | "SickLeave"
  | "Absent";

export type jobTitle = "Admin" | "DeliveryDriver" | "Manager" | "Operator";

export interface Employee {
  id: number;
  name: string;
  email: string;
  initials: string;
  department: string;
  jobTitle: jobTitle;
  status: EmployeeStatus;
  enableNotifications: boolean;
  passwordHash: string;
}

export interface Van {
  id: number;
  licensePlate: string;
  dataOfInspection: string;
  maxLoadKg: number;
  maxVolumeM3: number;
  status: VanStatus;
}

export interface Company {
  id: number;
  name: string;
  taxId: string;
  streetAdress: string;
  postalCode: string;
  location: string;
  email: string;
  phoneNumber: string;
  shareCapital: number;
}

export type ProductType =
  //Meat
  | "RoastedChicken_Unit"
  | "ChickenMeat_Box_5kg"
  | "TurkeyMeat_Box_10kg"
  | "DuckMeat_Box_5kg"
  //Processed Meat
  | "ShreddedCookedDuck_Pack_1kg"
  | "DuckRice_Indiv_P10"
  | "ChickenStroganoff_400g"
  | "TurkeyStroganoff_400g"
  | "PoultryBreast_Sliced_1kg"
  | "PoultryBreast_Sliced_200g"
  //Stock
  | "ChickenStock_200ml_P6"
  | "ChickenStock_750ml_P4"
  //Eggs
  | "ChickenEggs_M_Grade_30"
  | "QuailEggs_Pack_12"
  | "ChickenEggCarton_P12";

export interface StockBatch {
  id: number;
  batchNumber: string;
  product: ProductType;
  OriginalQuantity: number;
  CurrentQuantity: number;
  unit: "Pack" | "Box" | "Tray" | "Carton";
  source: string;
  EntryDate: string;
  expiryDate: string;
}

export type DeliveryStatus =
  | "Registered"
  | "InTransit"
  | "Delivered"
  | "FailedDelivery"
  | "Cancelled";

export interface ShipmentItem {
  id: number;
  batchNumber: string;
  product: ProductType;
  quantity: number;
  QuantityDelivered: number;
  status: DeliveryStatus;
  ShipmentId: number;
  itemWeightKg?: number;
}
export interface Shipment {
  id: number;
  registerNumber: string;
  movement: "Inbound" | "Outbound";
  items: ShipmentItem[];
  quantity: number;
  TotalShipmentWeightKg: number;
  status: DeliveryStatus;
  RegisterData: string;
  SLAExpiration: string;
  DateOfDeliveryOrReturn?: string | null;
  DriverId?: number | null;
  VanId?: number | null;
  Observations: string;
}
