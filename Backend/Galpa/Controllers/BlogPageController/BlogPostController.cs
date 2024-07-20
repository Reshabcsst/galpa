using Galpa.Models.Blog;
using Galpa.Models.Home;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using System.IO;
using System.Threading.Tasks;

namespace Galpa.Controllers.HomePageController
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogPostController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        IConfiguration configuration = new ConfigurationBuilder()
               .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
               .Build();

        public BlogPostController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // Add blog post
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> AddBlogPost([FromForm] BlogPostModel blogPost)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                // Save images to a folder and get their paths
                string imagePath = await SaveImage(blogPost.Image);
                string authorPicPath = await SaveImage(blogPost.AuthorPic);
                string bookImgPath = await SaveImage(blogPost.BookImg);

                // Get the maximum current Id
                int newId = 1;
                using (MySqlCommand cmd = new MySqlCommand("SELECT MAX(Id) FROM BlogPost", con))
                {
                    var result = cmd.ExecuteScalar();
                    if (result != DBNull.Value)
                    {
                        newId = Convert.ToInt32(result) + 1;
                    }
                }

                using (MySqlCommand cmd = new MySqlCommand("INSERT INTO BlogPost (Id, Image, PostedBy, AuthorPic, Date, Author, BookImg, Heading, Details, Comments) VALUES (@Id, @Image, @PostedBy, @AuthorPic, @Date, @Author, @BookImg, @Heading, @Details, @Comments)", con))
                {
                    cmd.Parameters.AddWithValue("@Id", newId);
                    cmd.Parameters.AddWithValue("@Image", imagePath);
                    cmd.Parameters.AddWithValue("@PostedBy", blogPost.PostedBy);
                    cmd.Parameters.AddWithValue("@AuthorPic", authorPicPath);
                    cmd.Parameters.AddWithValue("@Date", blogPost.Date);
                    cmd.Parameters.AddWithValue("@Author", blogPost.Author);
                    cmd.Parameters.AddWithValue("@BookImg", bookImgPath);
                    cmd.Parameters.AddWithValue("@Heading", blogPost.Heading);
                    cmd.Parameters.AddWithValue("@Details", blogPost.Details);
                    cmd.Parameters.AddWithValue("@Comments", blogPost.Comments);

                    int result = await cmd.ExecuteNonQueryAsync();
                    if (result > 0)
                    {
                        return Ok("Blog post added successfully");
                    }
                    else
                    {
                        return BadRequest("Error adding blog post");
                    }
                }
            }
        }

        // Fetch all blog posts
        //[Authorize]
        [HttpGet]
        public IActionResult GetBlogPosts()
        {
            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("SELECT * FROM BlogPost", con))
                {
                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        var blogPosts = new List<object>();
                        while (reader.Read())
                        {
                            blogPosts.Add(new
                            {
                                Id = reader["Id"],
                                Image = reader["Image"],
                                PostedBy = reader["PostedBy"],
                                AuthorPic = reader["AuthorPic"],
                                Date = reader["Date"],
                                Author = reader["Author"],
                                BookImg = reader["BookImg"],
                                Heading = reader["Heading"],
                                Details = reader["Details"],
                                Comments = reader["Comments"]
                            });
                        }

                        return Ok(blogPosts);
                    }
                }
            }
        }


        // Fetch single blog post by ID
        //[Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBlogPostById(int id)
        {
            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("SELECT * FROM BlogPost WHERE Id = @Id", con))
                {
                    cmd.Parameters.AddWithValue("@Id", id);

                    using (MySqlDataReader reader = (MySqlDataReader)await cmd.ExecuteReaderAsync())
                    {
                        if (reader.Read())
                        {
                            var blogPost = new
                            {
                                Id = reader["Id"],
                                Image = reader["Image"],
                                PostedBy = reader["PostedBy"],
                                AuthorPic = reader["AuthorPic"],
                                Date = reader["Date"],
                                Author = reader["Author"],
                                BookImg = reader["BookImg"],
                                Heading = reader["Heading"],
                                Details = reader["Details"],
                                Comments = reader["Comments"]
                            };

                            return Ok(blogPost);
                        }
                        else
                        {
                            return NotFound("Blog post not found");
                        }
                    }
                }
            }
        }


        // Edit blog post
        [Authorize]
        [HttpPut]
        [Route("{id}")]
        public async Task<IActionResult> EditBlogPost(int id, [FromForm] BlogPostModel blogPost)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                // Get the existing data from the database
                string existingImage = null;
                string existingAuthorPic = null;
                string existingBookImg = null;

                using (MySqlCommand getCmd = new MySqlCommand("SELECT Image, AuthorPic, BookImg FROM BlogPost WHERE Id = @Id", con))
                {
                    getCmd.Parameters.AddWithValue("@Id", id);

                    using (var reader = await getCmd.ExecuteReaderAsync())
                    {
                        if (reader.Read())
                        {
                            existingImage = reader["Image"]?.ToString();
                            existingAuthorPic = reader["AuthorPic"]?.ToString();
                            existingBookImg = reader["BookImg"]?.ToString();
                        }
                    }
                }

                // Save images to a folder and get their paths
                string imagePath = blogPost.Image != null ? await SaveImage(blogPost.Image) : existingImage;
                string authorPicPath = blogPost.AuthorPic != null ? await SaveImage(blogPost.AuthorPic) : existingAuthorPic;
                string bookImgPath = blogPost.BookImg != null ? await SaveImage(blogPost.BookImg) : existingBookImg;

                using (MySqlCommand cmd = new MySqlCommand("UPDATE BlogPost SET Image = @Image, PostedBy = @PostedBy, AuthorPic = @AuthorPic, Date = @Date, Author = @Author, BookImg = @BookImg, Heading = @Heading, Details = @Details, Comments = @Comments WHERE Id = @Id", con))
                {
                    cmd.Parameters.AddWithValue("@Image", imagePath ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@PostedBy", blogPost.PostedBy ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@AuthorPic", authorPicPath ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Date", blogPost.Date ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Author", blogPost.Author ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@BookImg", bookImgPath ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Heading", blogPost.Heading ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Details", blogPost.Details ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Comments", blogPost.Comments);
                    cmd.Parameters.AddWithValue("@Id", id);

                    int result = await cmd.ExecuteNonQueryAsync();
                    if (result > 0)
                    {
                        return Ok("Blog post updated successfully");
                    }
                    else
                    {
                        return BadRequest("Error updating blog post");
                    }
                }
            }
        }

        // Delete blog post
        [Authorize]
        [HttpDelete]
        [Route("{id}")]
        public IActionResult DeleteBlogPost(int id)
        {
            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("DELETE FROM BlogPost WHERE Id = @Id", con))
                {
                    cmd.Parameters.AddWithValue("@Id", id);

                    int result = cmd.ExecuteNonQuery();
                    if (result > 0)
                    {
                        return Ok("Blog post deleted successfully");
                    }
                    else
                    {
                        return BadRequest("Error deleting blog post");
                    }
                }
            }
        }

        private async Task<string> SaveImage(IFormFile image)
        {
            if (image == null)
            {
                return null;
            }

            var uploads = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
            if (!Directory.Exists(uploads))
            {
                Directory.CreateDirectory(uploads);
            }

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
            var filePath = Path.Combine(uploads, fileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(fileStream);
            }

            return $"/images/{fileName}";
        }
    }
}
