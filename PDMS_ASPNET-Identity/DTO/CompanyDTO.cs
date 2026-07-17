using PDMS.Models;

namespace PDMS.DTO;

public record CompanyDTO
(
    int? Id,
    string Name,
    string TaxId,
    int? BusinessGroupId,
    string StreetAdress,
    string PostalCode,
    string Location,
    string Email,
    string PhoneNumber
)
{
    public Company ToEntity() => new Company
    {
        Name = this.Name,
        TaxId = this.TaxId,
        BusinessGroupId = this.BusinessGroupId,
        StreetAdress = this.StreetAdress,
        PostalCode = this.PostalCode,
        Location = this.Location,
        Email = this.Email,
        PhoneNumber = this.PhoneNumber,
        IndustryCode = "PENDING",
        ShareCapital = null,
    };
    public CompanyDTO(Company c)
        :
        this(
            c.Id,
            c.Name,
            c.TaxId,
            c.BusinessGroupId,
            c.StreetAdress,
            c.PostalCode,
            c.Location,
            c.Email,
            c.PhoneNumber
        ) { }

}

