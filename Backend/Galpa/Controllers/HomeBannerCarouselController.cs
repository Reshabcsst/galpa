using Galpa.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

namespace Galpa.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeBannerCarouselController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        IConfiguration configuration = new ConfigurationBuilder()
               .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
               .Build();

        public HomeBannerCarouselController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // Add carousel item
        [Authorize]
        [HttpPost]
        [Route("add-home-banner-carousel")]
        public async Task<IActionResult> AddCarouselItem([FromForm] CarouselItemModel carouselItem)
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
                if (carouselItem.BackgroundImage != null)
                {
                    var uploads = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
                    if (!Directory.Exists(uploads))
                    {
                        Directory.CreateDirectory(uploads);
                    }

                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(carouselItem.BackgroundImage.FileName);
                    var filePath = Path.Combine(uploads, fileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await carouselItem.BackgroundImage.CopyToAsync(fileStream);
                    }

                    imagePath = $"/images/{fileName}";
                }

                // Get the maximum current Id
                int newId = 1;
                using (MySqlCommand cmd = new MySqlCommand("SELECT MAX(Id) FROM Carousel", con))
                {
                    var result = cmd.ExecuteScalar();
                    if (result != DBNull.Value)
                    {
                        newId = Convert.ToInt32(result) + 1;
                    }
                }

                using (MySqlCommand cmd = new MySqlCommand("INSERT INTO Carousel (Id, Heading, Subheading, BackgroundImage) VALUES (@Id, @Heading, @Subheading, @BackgroundImage)", con))
                {
                    cmd.Parameters.AddWithValue("@Id", newId);
                    cmd.Parameters.AddWithValue("@Heading", carouselItem.Heading);
                    cmd.Parameters.AddWithValue("@Subheading", carouselItem.Subheading);
                    cmd.Parameters.AddWithValue("@BackgroundImage", imagePath);

                    int result = cmd.ExecuteNonQuery();
                    if (result > 0)
                    {
                        return Ok("Carousel item added successfully");
                    }
                    else
                    {
                        return BadRequest("Error adding carousel item");
                    }
                }
            }
        }


        // Fetch all carousel items
        //[Authorize]
        [HttpGet]
        [Route("get-home-banner-carousel")]
        public IActionResult GetCarouselItems()
        {
            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("SELECT * FROM Carousel", con))
                {
                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        var carouselItems = new List<object>();
                        while (reader.Read())
                        {
                            carouselItems.Add(new
                            {
                                Id = reader["Id"],
                                Heading = reader["Heading"],
                                Subheading = reader["Subheading"],
                                BackgroundImage = reader["BackgroundImage"]
                            });
                        }

                        return Ok(carouselItems);
                    }
                }
            }
        }

        // Edit carousel item
        [Authorize]
        [HttpPut]
        [Route("edit-home-banner-carousel/{id}")]
        public async Task<IActionResult> EditCarouselItem(int id, [FromForm] CarouselItemModel carouselItem)
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

                using (MySqlCommand getCmd = new MySqlCommand("SELECT Heading, Subheading, BackgroundImage FROM Carousel WHERE Id = @Id", con))
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
                if (carouselItem.BackgroundImage != null)
                {
                    var uploads = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
                    if (!Directory.Exists(uploads))
                    {
                        Directory.CreateDirectory(uploads);
                    }

                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(carouselItem.BackgroundImage.FileName);
                    var filePath = Path.Combine(uploads, fileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await carouselItem.BackgroundImage.CopyToAsync(fileStream);
                    }

                    imagePath = $"/images/{fileName}";
                }

                using (MySqlCommand cmd = new MySqlCommand("UPDATE Carousel SET Heading = @Heading, Subheading = @Subheading, BackgroundImage = @BackgroundImage WHERE Id = @Id", con))
                {
                    cmd.Parameters.AddWithValue("@Heading", carouselItem.Heading ?? (object)existingHeading ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@Subheading", carouselItem.Subheading ?? (object)existingSubheading ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@BackgroundImage", imagePath ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Id", id);

                    int result = await cmd.ExecuteNonQueryAsync();
                    if (result > 0)
                    {
                        return Ok("Carousel item updated successfully");
                    }
                    else
                    {
                        return BadRequest("Error updating carousel item");
                    }
                }
            }
        }

        // Delete carousel item
        [Authorize]
        [HttpDelete]
        [Route("delete-home-banner-carousel/{id}")]
        public IActionResult DeleteCarouselItem(int id)
        {
            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("DELETE FROM Carousel WHERE Id = @Id", con))
                {
                    cmd.Parameters.AddWithValue("@Id", id);

                    int result = cmd.ExecuteNonQuery();
                    if (result > 0)
                    {
                        return Ok("Carousel item deleted successfully");
                    }
                    else
                    {
                        return BadRequest("Error deleting carousel item");
                    }
                }
            }
        }

    }
}
