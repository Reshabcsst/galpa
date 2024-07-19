using Galpa.Models.Home;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

namespace Galpa.Controllers.HomePageController
{
    [Route("api/[controller]")]
    [ApiController]
    public class WhatAuthorSaysController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        IConfiguration configuration = new ConfigurationBuilder()
               .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
               .Build();

        public WhatAuthorSaysController(IConfiguration configuration)
        {
            _configuration = configuration;
        }




        // Add feedback item
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> AddWhatAuthorSays([FromForm] WhatAuthorSaysModel feedbackItem)
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
                using (MySqlCommand cmd = new MySqlCommand("SELECT MAX(Id) FROM WhatAuthorSays", con))
                {
                    var result = cmd.ExecuteScalar();
                    if (result != DBNull.Value)
                    {
                        newId = Convert.ToInt32(result) + 1;
                    }
                }

                using (MySqlCommand cmd = new MySqlCommand("INSERT INTO WhatAuthorSays (Id, Name, Quote, Image) VALUES (@Id, @Name, @Quote, @Image)", con))
                {
                    cmd.Parameters.AddWithValue("@Id", newId);
                    cmd.Parameters.AddWithValue("@Name", feedbackItem.Name);
                    cmd.Parameters.AddWithValue("@Quote", feedbackItem.Quote);
                    cmd.Parameters.AddWithValue("@Image", imagePath);

                    int result = cmd.ExecuteNonQuery();
                    if (result > 0)
                    {
                        return Ok("Author's Thought added successfully");
                    }
                    else
                    {
                        return BadRequest("Error adding Author's Thought");
                    }
                }
            }
        }

        // Fetch all feedback items
        //[Authorize]
        [HttpGet]
        public IActionResult GetWhatAuthorSays()
        {
            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("SELECT * FROM WhatAuthorSays", con))
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
        [Route("{id}")]
        public async Task<IActionResult> EditWhatAuthorSays(int id, [FromForm] WhatAuthorSaysModel feedbackItem)
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

                using (MySqlCommand getCmd = new MySqlCommand("SELECT Name, Quote, Image FROM WhatAuthorSays WHERE Id = @Id", con))
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

                using (MySqlCommand cmd = new MySqlCommand("UPDATE WhatAuthorSays SET Name = @Name, Quote = @Quote, Image = @Image WHERE Id = @Id", con))
                {
                    cmd.Parameters.AddWithValue("@Name", feedbackItem.Name ?? (object)existingName ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@Quote", feedbackItem.Quote ?? (object)existingQuote ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@Image", imagePath ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Id", id);

                    int result = await cmd.ExecuteNonQueryAsync();
                    if (result > 0)
                    {
                        return Ok("Author's Thought updated successfully");
                    }
                    else
                    {
                        return BadRequest("Error updating Author's Thought");
                    }
                }
            }
        }

        // Delete feedback item
        [Authorize]
        [HttpDelete]
        [Route("{id}")]
        public IActionResult DeleteWhatAuthorSays(int id)
        {
            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("DELETE FROM WhatAuthorSays WHERE Id = @Id", con))
                {
                    cmd.Parameters.AddWithValue("@Id", id);

                    int result = cmd.ExecuteNonQuery();
                    if (result > 0)
                    {
                        return Ok("Author's Thought deleted successfully");
                    }
                    else
                    {
                        return BadRequest("Error deleting Author's Thought");
                    }
                }
            }
        }
    }
}
