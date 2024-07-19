using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

namespace Galpa.Controllers.HomePageController
{
    [Route("api/[controller]")]
    [ApiController]
    public class OurWorkCarouselController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        IConfiguration configuration = new ConfigurationBuilder()
               .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
               .Build();

        public OurWorkCarouselController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // Add carousel item (only image)
        [Authorize]
        [HttpPost]
        [Route("add-our-work-carousel")]
        public async Task<IActionResult> AddWorkCarouselItem(IFormFile image)
        {
            if (image == null || image.Length == 0)
            {
                return BadRequest("Image file is required.");
            }

            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                // Save the image to a folder and get its path
                string imagePath = null;
                if (image != null)
                {
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

                    imagePath = $"/images/{fileName}";
                }

                // Get the maximum current Id
                int newId = 1;
                using (MySqlCommand cmd = new MySqlCommand("SELECT MAX(Id) FROM OurWorkCarousel", con))
                {
                    var result = cmd.ExecuteScalar();
                    if (result != DBNull.Value)
                    {
                        newId = Convert.ToInt32(result) + 1;
                    }
                }

                using (MySqlCommand cmd = new MySqlCommand("INSERT INTO OurWorkCarousel (Id, ImagePath) VALUES (@Id, @ImagePath)", con))
                {
                    cmd.Parameters.AddWithValue("@Id", newId);
                    cmd.Parameters.AddWithValue("@ImagePath", imagePath);

                    int result = cmd.ExecuteNonQuery();
                    if (result > 0)
                    {
                        return Ok("Work carousel item added successfully");
                    }
                    else
                    {
                        return BadRequest("Error adding work carousel item");
                    }
                }
            }
        }

        // Fetch all work carousel items
        //[Authorize]
        [HttpGet]
        [Route("get-our-work-carousel")]
        public IActionResult GetWorkCarouselItems()
        {
            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("SELECT * FROM OurWorkCarousel", con))
                {
                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        var workCarouselItems = new List<object>();
                        while (reader.Read())
                        {
                            workCarouselItems.Add(new
                            {
                                Id = reader["Id"],
                                ImagePath = reader["ImagePath"]
                            });
                        }

                        return Ok(workCarouselItems);
                    }
                }
            }
        }

        // Edit work carousel item (only image)
        [Authorize]
        [HttpPut]
        [Route("edit-our-work-carousel/{id}")]
        public async Task<IActionResult> EditWorkCarouselItem(int id, IFormFile image)
        {
            if (image == null || image.Length == 0)
            {
                return BadRequest("Image file is required.");
            }

            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                // Get the existing image path from the database
                string existingImagePath = null;

                using (MySqlCommand getCmd = new MySqlCommand("SELECT ImagePath FROM OurWorkCarousel WHERE Id = @Id", con))
                {
                    getCmd.Parameters.AddWithValue("@Id", id);

                    using (var reader = await getCmd.ExecuteReaderAsync())
                    {
                        if (reader.Read())
                        {
                            existingImagePath = reader["ImagePath"]?.ToString();
                        }
                    }
                }

                // Save the new image to a folder and get its path
                string imagePath = existingImagePath;
                if (image != null)
                {
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

                    imagePath = $"/images/{fileName}";
                }

                using (MySqlCommand cmd = new MySqlCommand("UPDATE OurWorkCarousel SET ImagePath = @ImagePath WHERE Id = @Id", con))
                {
                    cmd.Parameters.AddWithValue("@ImagePath", imagePath ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Id", id);

                    int result = await cmd.ExecuteNonQueryAsync();
                    if (result > 0)
                    {
                        return Ok("Work carousel item updated successfully");
                    }
                    else
                    {
                        return BadRequest("Error updating work carousel item");
                    }
                }
            }
        }


        // Delete work carousel item
        [Authorize]
        [HttpDelete]
        [Route("delete-our-work-carousel/{id}")]
        public IActionResult DeleteWorkCarouselItem(int id)
        {
            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("DELETE FROM OurWorkCarousel WHERE Id = @Id", con))
                {
                    cmd.Parameters.AddWithValue("@Id", id);

                    int result = cmd.ExecuteNonQuery();
                    if (result > 0)
                    {
                        return Ok("Work carousel item deleted successfully");
                    }
                    else
                    {
                        return BadRequest("Error deleting work carousel item");
                    }
                }
            }
        }
    }
}
