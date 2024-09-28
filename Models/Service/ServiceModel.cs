namespace Galpa.Models.Service
{
    public class ServiceModel
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Details { get; set; }
        public IFormFile? Image { get; set; }
    }
}
