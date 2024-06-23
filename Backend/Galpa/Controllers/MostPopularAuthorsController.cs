using Galpa.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using System.IO;
using System.Threading.Tasks;

namespace Galpa.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MostPopularAuthorsController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        IConfiguration configuration = new ConfigurationBuilder()
               .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
               .Build();

        public MostPopularAuthorsController(IConfiguration configuration)
        {
            _configuration = configuration;
        }





        // Add author
        //[Authorize]
        [HttpPost]
        [Route("add-author")]
        public async Task<IActionResult> AddAuthor([FromForm] AuthorModel author)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                // Save the profile picture to a folder and get its path
                string profilePicturePath = null;
                if (author.ProfilePicture != null)
                {
                    var uploads = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images/authors");
                    if (!Directory.Exists(uploads))
                    {
                        Directory.CreateDirectory(uploads);
                    }

                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(author.ProfilePicture.FileName);
                    var filePath = Path.Combine(uploads, fileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await author.ProfilePicture.CopyToAsync(fileStream);
                    }

                    profilePicturePath = $"/images/authors/{fileName}";
                }

                // Get the maximum current Id
                int newId = 1;
                using (MySqlCommand cmd = new MySqlCommand("SELECT MAX(Id) FROM Authors", con))
                {
                    var result = cmd.ExecuteScalar();
                    if (result != DBNull.Value)
                    {
                        newId = Convert.ToInt32(result) + 1;
                    }
                }

                using (MySqlCommand cmd = new MySqlCommand("INSERT INTO Authors (Id, Name, Role, ProfilePicture, FacebookLink, InstagramLink, TwitterLink) VALUES (@Id, @Name, @Role, @ProfilePicture, @FacebookLink, @InstagramLink, @TwitterLink)", con))
                {
                    cmd.Parameters.AddWithValue("@Id", newId);
                    cmd.Parameters.AddWithValue("@Name", author.Name);
                    cmd.Parameters.AddWithValue("@Role", author.Role);
                    cmd.Parameters.AddWithValue("@ProfilePicture", profilePicturePath);
                    cmd.Parameters.AddWithValue("@FacebookLink", author.FacebookLink ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@InstagramLink", author.InstagramLink ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@TwitterLink", author.TwitterLink ?? (object)DBNull.Value);

                    int result = cmd.ExecuteNonQuery();
                    if (result > 0)
                    {
                        return Ok("Author added successfully");
                    }
                    else
                    {
                        return BadRequest("Error adding author");
                    }
                }
            }
        }

        // Fetch all authors
        //[Authorize]
        [HttpGet]
        [Route("get-authors")]
        public IActionResult GetAuthors()
        {
            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("SELECT * FROM Authors", con))
                {
                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        var authors = new List<object>();
                        while (reader.Read())
                        {
                            authors.Add(new
                            {
                                Id = reader["Id"],
                                Name = reader["Name"],
                                Role = reader["Role"],
                                ProfilePicture = reader["ProfilePicture"],
                                FacebookLink = reader["FacebookLink"],
                                InstagramLink = reader["InstagramLink"],
                                TwitterLink = reader["TwitterLink"]
                            });
                        }

                        return Ok(authors);
                    }
                }
            }
        }

        // Edit author
        [Authorize]
        [HttpPut]
        [Route("edit-author/{id}")]
        public async Task<IActionResult> EditAuthor(int id, [FromForm] AuthorModel author)
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
                string existingName = null;
                string existingRole = null;
                string existingProfilePicture = null;
                string existingFacebookLink = null;
                string existingInstagramLink = null;
                string existingTwitterLink = null;

                using (MySqlCommand getCmd = new MySqlCommand("SELECT Name, Role, ProfilePicture, FacebookLink, InstagramLink, TwitterLink FROM Authors WHERE Id = @Id", con))
                {
                    getCmd.Parameters.AddWithValue("@Id", id);

                    using (var reader = await getCmd.ExecuteReaderAsync())
                    {
                        if (reader.Read())
                        {
                            existingName = reader["Name"]?.ToString();
                            existingRole = reader["Role"]?.ToString();
                            existingProfilePicture = reader["ProfilePicture"]?.ToString();
                            existingFacebookLink = reader["FacebookLink"]?.ToString();
                            existingInstagramLink = reader["InstagramLink"]?.ToString();
                            existingTwitterLink = reader["TwitterLink"]?.ToString();
                        }
                    }
                }

                // Save the profile picture to a folder and get its path
                string profilePicturePath = existingProfilePicture;
                if (author.ProfilePicture != null)
                {
                    var uploads = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images/authors");
                    if (!Directory.Exists(uploads))
                    {
                        Directory.CreateDirectory(uploads);
                    }

                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(author.ProfilePicture.FileName);
                    var filePath = Path.Combine(uploads, fileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await author.ProfilePicture.CopyToAsync(fileStream);
                    }

                    profilePicturePath = $"/images/authors/{fileName}";
                }

                using (MySqlCommand cmd = new MySqlCommand("UPDATE Authors SET Name = @Name, Role = @Role, ProfilePicture = @ProfilePicture, FacebookLink = @FacebookLink, InstagramLink = @InstagramLink, TwitterLink = @TwitterLink WHERE Id = @Id", con))
                {
                    cmd.Parameters.AddWithValue("@Name", author.Name ?? (object)existingName ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@Role", author.Role ?? (object)existingRole ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@ProfilePicture", profilePicturePath ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@FacebookLink", author.FacebookLink ?? (object)existingFacebookLink ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@InstagramLink", author.InstagramLink ?? (object)existingInstagramLink ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@TwitterLink", author.TwitterLink ?? (object)existingTwitterLink ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@Id", id);

                    int result = await cmd.ExecuteNonQueryAsync();
                    if (result > 0)
                    {
                        return Ok("Author updated successfully");
                    }
                    else
                    {
                        return BadRequest("Error updating author");
                    }
                }
            }
        }

        // Delete author
        [Authorize]
        [HttpDelete]
        [Route("delete-author/{id}")]
        public IActionResult DeleteAuthor(int id)
        {
            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("DELETE FROM Authors WHERE Id = @Id", con))
                {
                    cmd.Parameters.AddWithValue("@Id", id);

                    int result = cmd.ExecuteNonQuery();
                    if (result > 0)
                    {
                        return Ok("Author deleted successfully");
                    }
                    else
                    {
                        return BadRequest("Error deleting author");
                    }
                }
            }
        }


    }
}
