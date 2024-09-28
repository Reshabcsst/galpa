namespace Galpa.Models.Partner
{
    public class PartnerModel
    {
        public int PartnerId { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public List<IFormFile>? Images { get; set; }
    }
}
