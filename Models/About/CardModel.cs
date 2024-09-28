using System.ComponentModel.DataAnnotations;

namespace Galpa.Models.About
{
    public class CardModel
    {
        public int Id { get; set; }

        public IFormFile? CardPic { get; set; }

        public string? Heading { get; set; }

        public string? Details { get; set; }
    }
}
