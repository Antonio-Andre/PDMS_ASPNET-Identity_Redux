export type EmployeeStatus =
  | "Active"
  | "Holydays"
  | "DayOff"
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

export type CreateEmployeePayload = Omit<Employee, "id">;

export interface UpdateEmployeePayload {
  name?: string;
  email?: string;
  initials?: string;
  department?: string;
  jobTitle?: Employee["jobTitle"];
  status?: Employee["status"];
  enableNotifications?: boolean;
  passwordHash?: string;
}

export type VanStatus =
  | "Available"
  | "Loading"
  | "Transporting"
  | "Returning"
  | "Unloading"
  | "BrokenOrMaintence";

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
  businessGroupId?: number | null;
  streetAdress: string;
  postalCode: string;
  location: string;
  email: string;
  phoneNumber: string;
}

export type CreateCompanyPayload = Omit<Company, "id">;

export type UpdateCompanyPayload = {
  businessGroupId?: number | null;
  streetAdress: string;
  postalCode: string;
  location: string;
  email: string;
  phoneNumber: string;
};

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
  originalQuantity: number;
  currentQuantity: number;
  unit: "Pack" | "Box" | "Tray" | "Carton";
  source: string;
  entryDate: string;
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
  shipmentId: number;
  itemWeightKg?: number;
}
export interface Shipment {
  id: number;
  registerNumber: string;
  movement: "Inbound" | "Outbound";
  items: ShipmentItem[];
  quantity: number;
  totalShipmentWeightKg: number;
  status: DeliveryStatus;
  registerData: string;
  slaExpiration: string;
  dateOfDeliveryOrReturn?: string | null;
  driverId?: number | null;
  vanId?: number | null;
  observations: string;
}
