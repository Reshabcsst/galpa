using Microsoft.AspNetCore.Http;

namespace Galpa.Models.Home
{
    public class BookModel
    {
        public int Id { get; set; }
        public int AuthorId { get; set; }
        public string? BookName { get; set; }
        public IFormFile? BookImage { get; set; }
        public string? BookImagePath { get; set; }
    }
}
