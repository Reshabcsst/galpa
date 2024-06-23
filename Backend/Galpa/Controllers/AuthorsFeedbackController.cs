using Galpa.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

namespace Galpa.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthorsFeedbackController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        IConfiguration configuration = new ConfigurationBuilder()
               .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
               .Build();

        public AuthorsFeedbackController(IConfiguration configuration)
        {
            _configuration = configuration;
        }




        // Add feedback item
        [Authorize]
        [HttpPost]
        [Route("add-authors-feedback")]
        public async Task<IActionResult> AddFeedbackItem([FromForm] AuthorFeedbackModel feedbackItem)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                // Save the image to a folder and get its path
                string imagePath = null;
                if (feedbackItem.Image != null)
                {
                    var uploads = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
                    if (!Directory.Exists(uploads))
                    {
                        Directory.CreateDirectory(uploads);
                    }

                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(feedbackItem.Image.FileName);
                    var filePath = Path.Combine(uploads, fileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await feedbackItem.Image.CopyToAsync(fileStream);
                    }

                    imagePath = $"/images/{fileName}";
                }

                // Get the maximum current Id
                int newId = 1;
                using (MySqlCommand cmd = new MySqlCommand("SELECT MAX(Id) FROM AuthorsFeedback", con))
                {
                    var result = cmd.ExecuteScalar();
                    if (result != DBNull.Value)
                    {
                        newId = Convert.ToInt32(result) + 1;
                    }
                }

                using (MySqlCommand cmd = new MySqlCommand("INSERT INTO AuthorsFeedback (Id, Name, Quote, Image) VALUES (@Id, @Name, @Quote, @Image)", con))
                {
                    cmd.Parameters.AddWithValue("@Id", newId);
                    cmd.Parameters.AddWithValue("@Name", feedbackItem.Name);
                    cmd.Parameters.AddWithValue("@Quote", feedbackItem.Quote);
                    cmd.Parameters.AddWithValue("@Image", imagePath);

                    int result = cmd.ExecuteNonQuery();
                    if (result > 0)
                    {
                        return Ok("Feedback item added successfully");
                    }
                    else
                    {
                        return BadRequest("Error adding feedback item");
                    }
                }
            }
        }

        // Fetch all feedback items
        //[Authorize]
        [HttpGet]
        [Route("get-authors-feedback")]
        public IActionResult GetFeedbackItems()
        {
            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("SELECT * FROM AuthorsFeedback", con))
                {
                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        var feedbackItems = new List<object>();
                        while (reader.Read())
                        {
                            feedbackItems.Add(new
                            {
                                Id = reader["Id"],
                                Name = reader["Name"],
                                Quote = reader["Quote"],
                                Image = reader["Image"]
                            });
                        }

                        return Ok(feedbackItems);
                    }
                }
            }
        }

        // Edit feedback item
        [Authorize]
        [HttpPut]
        [Route("edit-authors-feedback/{id}")]
        public async Task<IActionResult> EditFeedbackItem(int id, [FromForm] AuthorFeedbackModel feedbackItem)
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
                string existingQuote = null;
                string existingImagePath = null;

                using (MySqlCommand getCmd = new MySqlCommand("SELECT Name, Quote, Image FROM AuthorsFeedback WHERE Id = @Id", con))
                {
                    getCmd.Parameters.AddWithValue("@Id", id);

                    using (var reader = await getCmd.ExecuteReaderAsync())
                    {
                        if (reader.Read())
                        {
                            existingName = reader["Name"]?.ToString();
                            existingQuote = reader["Quote"]?.ToString();
                            existingImagePath = reader["Image"]?.ToString();
                        }
                    }
                }

                // Save the image to a folder and get its path
                string imagePath = existingImagePath;
                if (feedbackItem.Image != null)
                {
                    var uploads = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
                    if (!Directory.Exists(uploads))
                    {
                        Directory.CreateDirectory(uploads);
                    }

                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(feedbackItem.Image.FileName);
                    var filePath = Path.Combine(uploads, fileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await feedbackItem.Image.CopyToAsync(fileStream);
                    }

                    imagePath = $"/images/{fileName}";
                }

                using (MySqlCommand cmd = new MySqlCommand("UPDATE AuthorsFeedback SET Name = @Name, Quote = @Quote, Image = @Image WHERE Id = @Id", con))
                {
                    cmd.Parameters.AddWithValue("@Name", feedbackItem.Name ?? (object)existingName ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@Quote", feedbackItem.Quote ?? (object)existingQuote ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@Image", imagePath ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Id", id);

                    int result = await cmd.ExecuteNonQueryAsync();
                    if (result > 0)
                    {
                        return Ok("Feedback item updated successfully");
                    }
                    else
                    {
                        return BadRequest("Error updating feedback item");
                    }
                }
            }
        }

        // Delete feedback item
        [Authorize]
        [HttpDelete]
        [Route("delete-authors-feedback/{id}")]
        public IActionResult DeleteFeedbackItem(int id)
        {
            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("DELETE FROM AuthorsFeedback WHERE Id = @Id", con))
                {
                    cmd.Parameters.AddWithValue("@Id", id);

                    int result = cmd.ExecuteNonQuery();
                    if (result > 0)
                    {
                        return Ok("Feedback item deleted successfully");
                    }
                    else
                    {
                        return BadRequest("Error deleting feedback item");
                    }
                }
            }
        }
    }
}
