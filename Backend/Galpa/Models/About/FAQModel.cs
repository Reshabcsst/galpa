using System.ComponentModel.DataAnnotations;

namespace Galpa.Models.About
{
    public class FAQModel
    {
        public int Id { get; set; }

        public string? question { get; set; }

        public string? answer { get; set; }
    }
}
