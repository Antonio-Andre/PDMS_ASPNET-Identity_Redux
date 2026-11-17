using PDMS.Models;

namespace PDMS.DTO
{

    public record EmployeeResponseDTO(int Id, string Name, string Email, string Department, string? PhoneNumber, bool EnableNotifications)
    {
        public EmployeeResponseDTO(Employee e) : this(
            e.Id, e.Name, e.Email!, e.Department, e.PhoneNumber, e.EnableNotifications
        )
        { }
    }

    public record RegisterEmployeeDTO
    (
        string Name,
        string Email,

        string PhoneNumber,
        string TaxId,
        string Password,
        string Department
    )
    {
        private static string GetInitials(string name)
        {
            var parts = name.Split(' ', StringSplitOptions.RemoveEmptyEntries);
            if (parts.Length >= 2)
                return $"{char.ToUpper(parts[0][0])}{char.ToUpper(parts[^1][0])}";
            return name.Length >= 2 ? name.Substring(0, 2).ToUpper() : name.ToUpper();
        }

        public string Initials => GetInitials(Name);
        public Employee ToEntity() => new Employee
        {
            UserName = this.Email,
            Email = this.Email,
            Name = this.Name,
            Initials = string.IsNullOrWhiteSpace(this.Initials)
            ? GetInitials(this.Name)
            : this.Initials.Trim().ToUpper(),
            TaxId = this.TaxId,
            Department = string.IsNullOrWhiteSpace(this.Department) ? "Unassigned" : this.Department,
            PhoneNumber = this.PhoneNumber,
            EnableNotifications = true,
            AdmissionDate = DateOnly.FromDateTime(DateTime.Now),
            Status = EmployeeStatus.Active
        };
    }

    public record LoginRequestDTO(
    string Email,
    string Pwd);

    public record UpdateEmployeeDTO
        (string Name, string? PhoneNumber, string Department, bool EnableNotifications)
    {
        public void UpdateEntity(Employee employee)
        {
            employee.PhoneNumber = this.PhoneNumber;
            employee.Department = this.Department;
            employee.EnableNotifications = this.EnableNotifications;
        }
    }

    public record AdminUpdateEmployeeDTO
        (string Name, string? PhoneNumber, string Department, string TaxId, EmployeeStatus Status)
    {
        public void AdminUpdateEntity(Employee employee)
        {
            employee.Name = this.Name;
            employee.PhoneNumber = this.PhoneNumber;
            employee.Department = this.Department;
            employee.TaxId = this.TaxId;
            employee.Status = this.Status;
        }

    }
}
