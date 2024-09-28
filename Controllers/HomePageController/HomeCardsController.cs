using Galpa.Models.Home;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

namespace Galpa.Controllers.HomePageController
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeCardsController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        IConfiguration configuration = new ConfigurationBuilder()
               .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
               .Build();

        public HomeCardsController(IConfiguration configuration)
        {
            _configuration = configuration;
        }



        // Add card details
        [Authorize]
        [HttpPost]
        [Route("add-home-cards")]
        public IActionResult AddHomeCards([FromBody] HomeCardsModel homeCards)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                // Check if a record already exists
                bool exists = false;
                using (MySqlCommand cmd = new MySqlCommand("SELECT COUNT(*) FROM HomeCards", con))
                {
                    exists = Convert.ToInt32(cmd.ExecuteScalar()) > 0;
                }

                if (exists)
                {
                    return BadRequest("Home cards details already exist. Please edit the existing record.");
                }

                // Add new record
                using (MySqlCommand cmd = new MySqlCommand(@"
                    INSERT INTO HomeCards 
                    (CardTitle1, Text1, CardTitle2, Text2, CardTitle3, Text3) 
                    VALUES 
                    (@CardTitle1, @Text1, @CardTitle2, @Text2, @CardTitle3, @Text3)", con))
                {
                    cmd.Parameters.AddWithValue("@CardTitle1", homeCards.CardTitle1);
                    cmd.Parameters.AddWithValue("@Text1", homeCards.Text1);
                    cmd.Parameters.AddWithValue("@CardTitle2", homeCards.CardTitle2);
                    cmd.Parameters.AddWithValue("@Text2", homeCards.Text2);
                    cmd.Parameters.AddWithValue("@CardTitle3", homeCards.CardTitle3);
                    cmd.Parameters.AddWithValue("@Text3", homeCards.Text3);

                    int result = cmd.ExecuteNonQuery();
                    if (result > 0)
                    {
                        return Ok("Home cards details added successfully");
                    }
                    else
                    {
                        return BadRequest("Error adding home cards details");
                    }
                }
            }
        }

        // Fetch home cards details
        [HttpGet]
        [Route("get-home-cards")]
        public IActionResult GetHomeCards()
        {
            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("SELECT * FROM HomeCards LIMIT 1", con))
                {
                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            var homeCards = new HomeCardsModel
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                CardTitle1 = reader["CardTitle1"].ToString(),
                                Text1 = reader["Text1"].ToString(),
                                CardTitle2 = reader["CardTitle2"].ToString(),
                                Text2 = reader["Text2"].ToString(),
                                CardTitle3 = reader["CardTitle3"].ToString(),
                                Text3 = reader["Text3"].ToString()
                            };

                            return Ok(homeCards);
                        }

                        return NotFound("No home cards details found");
                    }
                }
            }
        }

        // Edit home cards details
        [Authorize]
        [HttpPut]
        [Route("edit-home-cards/{id}")]
        public IActionResult EditHomeCards(int id, [FromBody] HomeCardsModel homeCards)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand(@"
                    UPDATE HomeCards 
                    SET CardTitle1 = @CardTitle1, Text1 = @Text1, CardTitle2 = @CardTitle2, Text2 = @Text2, 
                        CardTitle3 = @CardTitle3, Text3 = @Text3 
                    WHERE Id = @Id", con))
                {
                    cmd.Parameters.AddWithValue("@CardTitle1", homeCards.CardTitle1);
                    cmd.Parameters.AddWithValue("@Text1", homeCards.Text1);
                    cmd.Parameters.AddWithValue("@CardTitle2", homeCards.CardTitle2);
                    cmd.Parameters.AddWithValue("@Text2", homeCards.Text2);
                    cmd.Parameters.AddWithValue("@CardTitle3", homeCards.CardTitle3);
                    cmd.Parameters.AddWithValue("@Text3", homeCards.Text3);
                    cmd.Parameters.AddWithValue("@Id", id);

                    int result = cmd.ExecuteNonQuery();
                    if (result > 0)
                    {
                        return Ok("Home cards details updated successfully");
                    }
                    else
                    {
                        return BadRequest("Error updating home cards details");
                    }
                }
            }
        }

        // Delete home cards details
        [Authorize]
        [HttpDelete]
        [Route("delete-home-cards/{id}")]
        public IActionResult DeleteHomeCards(int id)
        {
            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("DELETE FROM HomeCards WHERE Id = @Id", con))
                {
                    cmd.Parameters.AddWithValue("@Id", id);

                    int result = cmd.ExecuteNonQuery();
                    if (result > 0)
                    {
                        return Ok("Home cards details deleted successfully");
                    }
                    else
                    {
                        return BadRequest("Error deleting home cards details");
                    }
                }
            }
        }

    }
}
