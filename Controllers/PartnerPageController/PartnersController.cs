using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace Galpa.Controllers.PartnerPageController
{
    [Route("api/[controller]")]
    [ApiController]
    public class PartnersController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        IConfiguration configuration = new ConfigurationBuilder()
               .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
               .Build();

        public PartnersController(IConfiguration configuration)
        {
            _configuration = configuration;
        }


        [Authorize]
        [HttpPost]
        public async Task<IActionResult> AddPartner([FromForm] string name, [FromForm] string description, [FromForm] List<IFormFile> images)
        {
            if (string.IsNullOrEmpty(name) || string.IsNullOrEmpty(description))
            {
                return BadRequest("Name and Description are required.");
            }

            string connectionString = _configuration.GetConnectionString("UserConnection");
            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                var imageLinks = new List<string>();
                foreach (var image in images)
                {
                    var imagePath = await SaveImage(image);
                    imageLinks.Add(imagePath);
                }

                using (MySqlCommand cmd = new MySqlCommand("INSERT INTO Partners (Name, Description, ImageLink) VALUES (@Name, @Description, @ImageLink)", con))
                {
                    cmd.Parameters.AddWithValue("@Name", name);
                    cmd.Parameters.AddWithValue("@Description", description);
                    cmd.Parameters.AddWithValue("@ImageLink", string.Join(";", imageLinks));

                    int result = await cmd.ExecuteNonQueryAsync();
                    if (result > 0)
                    {
                        return Ok("Partner added successfully");
                    }
                    else
                    {
                        return BadRequest("Error adding partner");
                    }
                }
            }
        }

        [HttpGet("{id}")]
        public IActionResult GetPartnerById(int id)
        {
            string connectionString = _configuration.GetConnectionString("UserConnection");
            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();
                using (MySqlCommand cmd = new MySqlCommand("SELECT * FROM Partners WHERE PartnerId = @PartnerId", con))
                {
                    cmd.Parameters.AddWithValue("@PartnerId", id);
                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return Ok(new
                            {
                                PartnerId = reader["PartnerId"],
                                Name = reader["Name"],
                                Description = reader["Description"],
                                ImageLink = reader["ImageLink"]
                            });
                        }
                        else
                        {
                            return NotFound("Partner not found");
                        }
                    }
                }
            }
        }

        [HttpGet]
        public IActionResult GetAllPartners()
        {
            string connectionString = _configuration.GetConnectionString("UserConnection");
            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();
                using (MySqlCommand cmd = new MySqlCommand("SELECT * FROM Partners", con))
                {
                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        var partners = new List<object>();
                        while (reader.Read())
                        {
                            partners.Add(new
                            {
                                PartnerId = reader["PartnerId"],
                                Name = reader["Name"],
                                Description = reader["Description"],
                                ImageLink = reader["ImageLink"]
                            });
                        }
                        return Ok(partners);
                    }
                }
            }
        }


        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditPartner(int id, [FromForm] string name, [FromForm] string description, [FromForm] List<IFormFile> newImages)
        {
            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                string existingImageLinks = null;
                using (MySqlCommand getCmd = new MySqlCommand("SELECT ImageLink FROM Partners WHERE PartnerId = @PartnerId", con))
                {
                    getCmd.Parameters.AddWithValue("@PartnerId", id);
                    using (var reader = await getCmd.ExecuteReaderAsync())
                    {
                        if (reader.Read())
                        {
                            existingImageLinks = reader["ImageLink"]?.ToString();
                        }
                    }
                }

                var imageLinks = !string.IsNullOrEmpty(existingImageLinks) ? new List<string>(existingImageLinks.Split(';')) : new List<string>();
                foreach (var image in newImages)
                {
                    var imagePath = await SaveImage(image);
                    imageLinks.Add(imagePath);
                }

                using (MySqlCommand cmd = new MySqlCommand("UPDATE Partners SET Name = @Name, Description = @Description, ImageLink = @ImageLink WHERE PartnerId = @PartnerId", con))
                {
                    cmd.Parameters.AddWithValue("@Name", name ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Description", description ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@ImageLink", string.Join(";", imageLinks));
                    cmd.Parameters.AddWithValue("@PartnerId", id);

                    int result = await cmd.ExecuteNonQueryAsync();
                    if (result > 0)
                    {
                        return Ok("Partner updated successfully");
                    }
                    else
                    {
                        return BadRequest("Error updating partner");
                    }
                }
            }
        }


        [Authorize]
        [HttpDelete("{id}")]
        public IActionResult DeletePartner(int id)
        {
            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();
                using (MySqlCommand cmd = new MySqlCommand("DELETE FROM Partners WHERE PartnerId = @PartnerId", con))
                {
                    cmd.Parameters.AddWithValue("@PartnerId", id);

                    int result = cmd.ExecuteNonQuery();
                    if (result > 0)
                    {
                        return Ok("Partner deleted successfully");
                    }
                    else
                    {
                        return BadRequest("Error deleting partner");
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
