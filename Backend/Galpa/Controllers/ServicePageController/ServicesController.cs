using Galpa.Models.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

namespace Galpa.Controllers.ServicePageController
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServicesController : ControllerBase
    {

        private readonly IConfiguration _configuration;
        IConfiguration configuration = new ConfigurationBuilder()
               .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
               .Build();

        public ServicesController(IConfiguration configuration)
        {
            _configuration = configuration;
        }



        // Add service
        [Authorize]
        [HttpPost]
        [Route("add-service")]
        public async Task<IActionResult> AddService([FromForm] ServiceModel service)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                string imagePath = null;
                if (service.Image != null)
                {
                    var uploads = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
                    if (!Directory.Exists(uploads))
                    {
                        Directory.CreateDirectory(uploads);
                    }

                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(service.Image.FileName);
                    var filePath = Path.Combine(uploads, fileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await service.Image.CopyToAsync(fileStream);
                    }

                    imagePath = $"/images/{fileName}";
                }

                int newId = 1;
                using (MySqlCommand cmd = new MySqlCommand("SELECT MAX(Id) FROM Services", con))
                {
                    var result = cmd.ExecuteScalar();
                    if (result != DBNull.Value)
                    {
                        newId = Convert.ToInt32(result) + 1;
                    }
                }

                using (MySqlCommand cmd = new MySqlCommand("INSERT INTO Services (Id, Name, Details, Image) VALUES (@Id, @Name, @Details, @Image)", con))
                {
                    cmd.Parameters.AddWithValue("@Id", newId);
                    cmd.Parameters.AddWithValue("@Name", service.Name);
                    cmd.Parameters.AddWithValue("@Details", service.Details);
                    cmd.Parameters.AddWithValue("@Image", imagePath);

                    int result = cmd.ExecuteNonQuery();
                    if (result > 0)
                    {
                        return Ok("Service added successfully");
                    }
                    else
                    {
                        return BadRequest("Error adding service");
                    }
                }
            }
        }

        // Fetch all services
        [HttpGet]
        [Route("get-services")]
        public IActionResult GetServices()
        {
            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("SELECT * FROM Services", con))
                {
                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        var services = new List<object>();
                        while (reader.Read())
                        {
                            services.Add(new
                            {
                                Id = reader["Id"],
                                Name = reader["Name"],
                                Details = reader["Details"],
                                Image = reader["Image"]
                            });
                        }

                        return Ok(services);
                    }
                }
            }
        }

        // Edit service
        [Authorize]
        [HttpPut]
        [Route("edit-service/{id}")]
        public async Task<IActionResult> EditService(int id, [FromForm] ServiceModel service)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                string existingName = null;
                string existingDetails = null;
                string existingImagePath = null;

                using (MySqlCommand getCmd = new MySqlCommand("SELECT Name, Details, Image FROM Services WHERE Id = @Id", con))
                {
                    getCmd.Parameters.AddWithValue("@Id", id);

                    using (var reader = await getCmd.ExecuteReaderAsync())
                    {
                        if (reader.Read())
                        {
                            existingName = reader["Name"]?.ToString();
                            existingDetails = reader["Details"]?.ToString();
                            existingImagePath = reader["Image"]?.ToString();
                        }
                    }
                }

                string imagePath = existingImagePath;
                if (service.Image != null)
                {
                    var uploads = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
                    if (!Directory.Exists(uploads))
                    {
                        Directory.CreateDirectory(uploads);
                    }

                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(service.Image.FileName);
                    var filePath = Path.Combine(uploads, fileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await service.Image.CopyToAsync(fileStream);
                    }

                    imagePath = $"/images/{fileName}";
                }

                using (MySqlCommand cmd = new MySqlCommand("UPDATE Services SET Name = @Name, Details = @Details, Image = @Image WHERE Id = @Id", con))
                {
                    cmd.Parameters.AddWithValue("@Name", service.Name ?? (object)existingName ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@Details", service.Details ?? (object)existingDetails ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@Image", imagePath ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Id", id);

                    int result = await cmd.ExecuteNonQueryAsync();
                    if (result > 0)
                    {
                        return Ok("Service updated successfully");
                    }
                    else
                    {
                        return BadRequest("Error updating service");
                    }
                }
            }
        }

        // Delete service
        [Authorize]
        [HttpDelete]
        [Route("delete-service/{id}")]
        public IActionResult DeleteService(int id)
        {
            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("DELETE FROM Services WHERE Id = @Id", con))
                {
                    cmd.Parameters.AddWithValue("@Id", id);

                    int result = cmd.ExecuteNonQuery();
                    if (result > 0)
                    {
                        return Ok("Service deleted successfully");
                    }
                    else
                    {
                        return BadRequest("Error deleting service");
                    }
                }
            }
        }
    }
}
