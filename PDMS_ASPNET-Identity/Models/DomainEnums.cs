namespace PDMS.Models
{
    public enum TransferenceDirection { Inbound, Outbound }
    public enum VanStatus { Available, Loading, Transporting, Returning, Unloading, BrokenOrMaintenance }
    public enum DeliveryStatus { Registered, Loaded, InTransit, Delivered, FailedDelivery, Cancelled }
    public enum EmployeeStatus { Active, Holidays, DayOff, SickLeave, Absent }
    public enum ProductType
    {
        //Meats (inbound)
        RoastedChicken_Unit,
        ChickenMeat_Box_5kg,
        TurkeyMeat_Box_10kg,
        DuckMeat_Box_5kg,

        //Processed Products (outbound)
        ShreddedCookedDuck_Pack_1kg,
        DuckRice_Indiv_P10,
        ChickenStroganoff_400g,
        TurkeyStroganoff_400g,
        PoultryBreast_Sliced_1kg,
        PoultryBreast_Sliced_200g,

        //Eggs & (liquid)Stocks (both inBound and Outbound)
        ChickenStock_200ml_P6,
        ChickenStock_750ml_P4,
        ChickenEggs_M_Tray_30,
        QuailEggs_Pack_12,
        ChickenEggCarton_P12
    }
    public enum JobTitle { Admin, DockManager, DeliveryDriver, InventoryManager, Operator };
}
