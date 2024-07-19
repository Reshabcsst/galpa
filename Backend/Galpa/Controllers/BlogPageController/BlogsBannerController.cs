using Galpa.Models.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

namespace Galpa.Controllers.BlogPageController
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogsBannerController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        IConfiguration configuration = new ConfigurationBuilder()
               .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
               .Build();

        public BlogsBannerController(IConfiguration configuration)
        {
            _configuration = configuration;
        }


        // Add banner item
        [Authorize]
        [HttpPost]
        [Route("add-blog-banner")]
        public async Task<IActionResult> AddBannerItem([FromForm] BannerModel banner)
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
                if (banner.BackgroundImage != null)
                {
                    var uploads = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
                    if (!Directory.Exists(uploads))
                    {
                        Directory.CreateDirectory(uploads);
                    }

                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(banner.BackgroundImage.FileName);
                    var filePath = Path.Combine(uploads, fileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await banner.BackgroundImage.CopyToAsync(fileStream);
                    }

                    imagePath = $"/images/{fileName}";
                }

                // Get the maximum current Id
                int newId = 1;
                using (MySqlCommand cmd = new MySqlCommand("SELECT MAX(Id) FROM blogbanner", con))
                {
                    var result = cmd.ExecuteScalar();
                    if (result != DBNull.Value)
                    {
                        newId = Convert.ToInt32(result) + 1;
                    }
                }

                using (MySqlCommand cmd = new MySqlCommand("INSERT INTO blogbanner (Id, Heading, Subheading, BackgroundImage) VALUES (@Id, @Heading, @Subheading, @BackgroundImage)", con))
                {
                    cmd.Parameters.AddWithValue("@Id", newId);
                    cmd.Parameters.AddWithValue("@Heading", banner.Heading);
                    cmd.Parameters.AddWithValue("@Subheading", banner.Subheading);
                    cmd.Parameters.AddWithValue("@BackgroundImage", imagePath);

                    int result = cmd.ExecuteNonQuery();
                    if (result > 0)
                    {
                        return Ok("Banner item added successfully");
                    }
                    else
                    {
                        return BadRequest("Error adding banner item");
                    }
                }
            }
        }

        // Fetch banner item
        // [Authorize]
        [HttpGet]
        [Route("get-blog-banner")]
        public IActionResult GetBannerItem()
        {
            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("SELECT * FROM blogbanner", con))
                {
                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            var bannerItem = new
                            {
                                Id = reader["Id"],
                                Heading = reader["Heading"],
                                Subheading = reader["Subheading"],
                                BackgroundImage = reader["BackgroundImage"]
                            };

                            return Ok(bannerItem);
                        }

                        return NotFound();
                    }
                }
            }
        }

        // Edit banner item
        [Authorize]
        [HttpPut]
        [Route("edit-blog-banner/{id}")]
        public async Task<IActionResult> EditBannerItem(int id, [FromForm] BannerModel banner)
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
                string existingHeading = null;
                string existingSubheading = null;
                string existingImagePath = null;

                using (MySqlCommand getCmd = new MySqlCommand("SELECT Heading, Subheading, BackgroundImage FROM blogbanner WHERE Id = @Id", con))
                {
                    getCmd.Parameters.AddWithValue("@Id", id);

                    using (var reader = await getCmd.ExecuteReaderAsync())
                    {
                        if (reader.Read())
                        {
                            existingHeading = reader["Heading"]?.ToString();
                            existingSubheading = reader["Subheading"]?.ToString();
                            existingImagePath = reader["BackgroundImage"]?.ToString();
                        }
                    }
                }

                // Save the image to a folder and get its path
                string imagePath = existingImagePath;
                if (banner.BackgroundImage != null)
                {
                    var uploads = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
                    if (!Directory.Exists(uploads))
                    {
                        Directory.CreateDirectory(uploads);
                    }

                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(banner.BackgroundImage.FileName);
                    var filePath = Path.Combine(uploads, fileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await banner.BackgroundImage.CopyToAsync(fileStream);
                    }

                    imagePath = $"/images/{fileName}";
                }

                using (MySqlCommand cmd = new MySqlCommand("UPDATE blogbanner SET Heading = @Heading, Subheading = @Subheading, BackgroundImage = @BackgroundImage WHERE Id = @Id", con))
                {
                    cmd.Parameters.AddWithValue("@Heading", banner.Heading ?? (object)existingHeading ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@Subheading", banner.Subheading ?? (object)existingSubheading ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@BackgroundImage", imagePath ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Id", id);

                    int result = await cmd.ExecuteNonQueryAsync();
                    if (result > 0)
                    {
                        return Ok("Banner item updated successfully");
                    }
                    else
                    {
                        return BadRequest("Error updating banner item");
                    }
                }
            }
        }

        // Delete banner item
        [Authorize]
        [HttpDelete]
        [Route("delete-blog-banner/{id}")]
        public IActionResult DeleteBannerItem(int id)
        {
            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("DELETE FROM blogbanner WHERE Id = @Id", con))
                {
                    cmd.Parameters.AddWithValue("@Id", id);

                    int result = cmd.ExecuteNonQuery();
                    if (result > 0)
                    {
                        return Ok("Banner item deleted successfully");
                    }
                    else
                    {
                        return BadRequest("Error deleting banner item");
                    }
                }
            }
        }
    }
}
