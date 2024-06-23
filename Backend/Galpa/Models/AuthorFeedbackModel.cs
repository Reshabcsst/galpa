namespace Galpa.Models
{
    public class AuthorFeedbackModel
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Quote { get; set; }
        public IFormFile? Image { get; set; } 
    }
}
