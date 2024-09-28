using Galpa.Models.Contact;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

namespace Galpa.Controllers.ContactPageController
{
    [Route("api/[controller]")]
    [ApiController]
    public class NeedHelpController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        IConfiguration configuration = new ConfigurationBuilder()
               .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
               .Build();

        public NeedHelpController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // Add need help item
        //[Authorize]
        [HttpPost]
        [Route("add-need-help")]
        public async Task<IActionResult> AddNeedHelpItem([FromForm] NeedHelpModel needHelp)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                // Get the maximum current Id
                int newId = 1;
                int limit = 0;
                using (MySqlCommand cmd = new MySqlCommand("SELECT MAX(Id) FROM needhelp", con))
                {
                    limit = Convert.ToInt32(cmd.ExecuteScalar());
                    var result = cmd.ExecuteScalar();
                    if (result != DBNull.Value)
                    {
                        newId = Convert.ToInt32(result) + 1;
                    }
                }

                if (limit >= 1)
                {
                    return BadRequest("List of 1 records reached. No data can be added!");
                }
                else
                {

                    using (MySqlCommand cmd = new MySqlCommand("INSERT INTO needhelp (Id, Title, Details1, Details2) VALUES (@Id, @Title, @Details1, @Details2)", con))
                    {
                        cmd.Parameters.AddWithValue("@Id", newId);
                        cmd.Parameters.AddWithValue("@Title", needHelp.Title);
                        cmd.Parameters.AddWithValue("@Details1", needHelp.Details1);
                        cmd.Parameters.AddWithValue("@Details2", needHelp.Details2);

                        int result = cmd.ExecuteNonQuery();
                        if (result > 0)
                        {
                            return Ok("Need help item added successfully");
                        }
                        else
                        {
                            return BadRequest("Error adding need help item");
                        }
                    }
                }
            }
        }

        // Fetch need help item
        [HttpGet]
        [Route("get-need-help")]
        public IActionResult GetAllNeedHelpItems()
        {
            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("SELECT * FROM needhelp", con))
                {
                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            var NeedHelp = new
                            {
                                Id = reader["Id"],
                                Title = reader["Title"],
                                Details1 = reader["Details1"],
                                Details2 = reader["Details2"]
                            };

                            return Ok(NeedHelp);
                        }

                        return NotFound();
                    }
                }
            }
        }


        // Edit need help item
        [Authorize]
        [HttpPut]
        [Route("edit-need-help/{id}")]
        public async Task<IActionResult> EditNeedHelpItem(int id, [FromForm] NeedHelpModel needHelp)
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
                string existingTitle = null;
                string existingDetails1 = null;
                string existingDetails2 = null;

                using (MySqlCommand getCmd = new MySqlCommand("SELECT Title, Details1, Details2 FROM needhelp WHERE Id = @Id", con))
                {
                    getCmd.Parameters.AddWithValue("@Id", id);

                    using (var reader = await getCmd.ExecuteReaderAsync())
                    {
                        if (reader.Read())
                        {
                            existingTitle = reader["Title"]?.ToString();
                            existingDetails1 = reader["Details1"]?.ToString();
                            existingDetails2 = reader["Details2"]?.ToString();
                        }
                    }
                }

                using (MySqlCommand cmd = new MySqlCommand("UPDATE needhelp SET Title = @Title, Details1 = @Details1, Details2 = @Details2 WHERE Id = @Id", con))
                {
                    cmd.Parameters.AddWithValue("@Title", needHelp.Title ?? (object)existingTitle ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@Details1", needHelp.Details1 ?? (object)existingDetails1 ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@Details2", needHelp.Details2 ?? (object)existingDetails2 ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@Id", id);

                    int result = await cmd.ExecuteNonQueryAsync();
                    if (result > 0)
                    {
                        return Ok("Need help item updated successfully");
                    }
                    else
                    {
                        return BadRequest("Error updating need help item");
                    }
                }
            }
        }

        // Delete need help item
        [Authorize]
        [HttpDelete]
        [Route("delete-need-help/{id}")]
        public IActionResult DeleteNeedHelpItem(int id)
        {
            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("DELETE FROM needhelp WHERE Id = @Id", con))
                {
                    cmd.Parameters.AddWithValue("@Id", id);

                    int result = cmd.ExecuteNonQuery();
                    if (result > 0)
                    {
                        return Ok("Need help item deleted successfully");
                    }
                    else
                    {
                        return BadRequest("Error deleting need help item");
                    }
                }
            }
        }

    }
}
