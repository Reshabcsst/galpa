using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Galpa.Models.Home;
using Microsoft.AspNetCore.Http;

namespace Galpa.Models.Author
{
    public class AuthorModel
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Details { get; set; }
        public IFormFile? ProfilePic { get; set; }
        public List<BookModel> Books { get; set; }
    }
}
