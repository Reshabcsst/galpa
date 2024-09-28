using System.ComponentModel.DataAnnotations;

namespace Galpa.Models.Home
{
    public class CarouselItemModel
    {
        public string? Heading { get; set; }
        public string? Subheading { get; set; }
        public IFormFile? BackgroundImage { get; set; }
    }
}
