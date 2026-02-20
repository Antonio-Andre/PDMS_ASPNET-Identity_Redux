namespace test_Identity_from_Scratch.Models
{
    public enum TransferenceDirection { Entered, Left }
    public enum VanStatus { Available, Loading, Transporting, Returning, Unloading, BrokenOrMaintence }
    public enum DeliveryStatus { Registered, Loaded, Delivered, Returned }
    public enum EmployeeStatus { Active, Holydays, DayOfff, SickLeave, Absent }
    public enum ProductType
    {
        RoastedChicken,      // Units or Kg
        ChickenMeat,         // Kg
        TurkeyMeat,          // Kg
        DuckMeat,            // Kg
        ShreddedDuck,        // Kg
        DuckRice,            // Portion/Pack
        ChickenEggs,         // Dozen
        QuailEggs,           // Unit
        ChickenEggCarton,    // Dozen Box
        QuailEggCarton,      // Dozen Box
        ChickenStock         // Pack
    }
    public enum JobTitle { Admin, DeliveryDriver, Manager, Operator };
}
