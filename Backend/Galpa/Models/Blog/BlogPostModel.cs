namespace Galpa.Models.Blog
{
    public class BlogPostModel
    {
        public int Id { get; set; }
        public IFormFile? Image { get; set; }
        public string? PostedBy { get; set; }
        public IFormFile? AuthorPic { get; set; }
        public string? Date { get; set; }
        public string? Author { get; set; }
        public IFormFile? BookImg { get; set; }
        public string? Heading { get; set; }
        public string? Details { get; set; }
        public int? Comments { get; set; }
    }
}
