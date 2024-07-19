using System.ComponentModel.DataAnnotations;

namespace Galpa.Models.Service
{
    public class BannerModel
    {
        public int Id { get; set; }

   
        public string? Heading { get; set; }

 
        public string? Subheading { get; set; }

        public IFormFile? BackgroundImage { get; set; }
    }
}
