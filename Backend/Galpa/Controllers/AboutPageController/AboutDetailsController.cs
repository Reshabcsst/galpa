using Galpa.Models.About;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

namespace Galpa.Controllers.AboutPageController
{
    [Route("api/[controller]")]
    [ApiController]
    public class AboutDetailsController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        IConfiguration configuration = new ConfigurationBuilder()
               .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
               .Build();

        public AboutDetailsController(IConfiguration configuration)
        {
            _configuration = configuration;
        }



        // Add details
        [Authorize]
        [Authorize]
        [HttpPost]
        [Route("add-about-details")]
        public async Task<IActionResult> AddDetails([FromForm] AboutDetailsModel details)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                int newId = 1;
                using (MySqlCommand cmd = new MySqlCommand("SELECT MAX(Id) FROM aboutdetails", con))
                {
                    var result = cmd.ExecuteScalar();
                    if (result != DBNull.Value)
                    {
                        newId = Convert.ToInt32(result) + 1;
                    }
                }

                using (MySqlCommand cmd = new MySqlCommand("INSERT INTO aboutdetails (Id, Title1, Details1, Title2, Details2, Title3, Details3) VALUES (@Id, @Title1, @Details1, @Title2, @Details2, @Title3, @Details3)", con))
                {
                    cmd.Parameters.AddWithValue("@Id", newId);
                    cmd.Parameters.AddWithValue("@Title1", details.Title1 ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Details1", details.Details1 ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Title2", details.Title2 ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Details2", details.Details2 ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Title3", details.Title3 ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Details3", details.Details3 ?? (object)DBNull.Value);

                    int result = await cmd.ExecuteNonQueryAsync();
                    if (result > 0)
                    {
                        return Ok("Details added successfully");
                    }
                    else
                    {
                        return BadRequest("Error adding details");
                    }
                }
            }
        }


        // Fetch details
        [HttpGet]
        [Route("get-about-details")]
        public IActionResult GetDetails()
        {
            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("SELECT * FROM aboutdetails", con))
                {
                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            var details = new
                            {
                                Id = reader["Id"],
                                Title1 = reader["Title1"] == DBNull.Value ? null : reader["Title1"].ToString(),
                                Details1 = reader["Details1"] == DBNull.Value ? null : reader["Details1"].ToString(),
                                Title2 = reader["Title2"] == DBNull.Value ? null : reader["Title2"].ToString(),
                                Details2 = reader["Details2"] == DBNull.Value ? null : reader["Details2"].ToString(),
                                Title3 = reader["Title3"] == DBNull.Value ? null : reader["Title3"].ToString(),
                                Details3 = reader["Details3"] == DBNull.Value ? null : reader["Details3"].ToString()
                            };

                            return Ok(details);
                        }

                        return NotFound();
                    }
                }
            }
        }


        // Edit details
        [Authorize]
        [HttpPut]
        [Route("edit-about-details/{id}")]
        public async Task<IActionResult> EditDetails(int id, [FromForm] AboutDetailsModel details)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("UPDATE aboutdetails SET Title1 = @Title1, Details1 = @Details1, Title2 = @Title2, Details2 = @Details2, Title3 = @Title3, Details3 = @Details3 WHERE Id = @Id", con))
                {
                    cmd.Parameters.AddWithValue("@Title1", details.Title1 ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Details1", details.Details1 ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Title2", details.Title2 ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Details2", details.Details2 ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Title3", details.Title3 ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Details3", details.Details3 ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Id", id);

                    int result = await cmd.ExecuteNonQueryAsync();
                    if (result > 0)
                    {
                        return Ok("Details updated successfully");
                    }
                    else
                    {
                        return BadRequest("Error updating details");
                    }
                }
            }
        }


        // Delete details
        [Authorize]
        [HttpDelete]
        [Route("delete-about-details/{id}")]
        public IActionResult DeleteDetails(int id)
        {
            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("DELETE FROM aboutdetails WHERE Id = @Id", con))
                {
                    cmd.Parameters.AddWithValue("@Id", id);

                    int result = cmd.ExecuteNonQuery();
                    if (result > 0)
                    {
                        return Ok("Details deleted successfully");
                    }
                    else
                    {
                        return BadRequest("Error deleting details");
                    }
                }
            }
        }

    }
}
