namespace Galpa.Models.Home
{
    public class AuthorModel
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Role { get; set; }
        public IFormFile? ProfilePicture { get; set; }
        public string? FacebookLink { get; set; }
        public string? InstagramLink { get; set; }
        public string? TwitterLink { get; set; }
    }
}
