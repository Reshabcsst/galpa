using System.ComponentModel.DataAnnotations;

namespace Galpa.Models
{
    public class CarouselItemModel
    {
        public string? Heading { get; set; }
        public string? Subheading { get; set; }
        public IFormFile? BackgroundImage { get; set; }
    }
}
