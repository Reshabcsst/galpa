using Galpa.Models.Home;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using Mysqlx.Crud;

namespace Galpa.Controllers.HomePageController
{
    [Route("api/[controller]")]
    [ApiController]
    public class PopularityController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        IConfiguration configuration = new ConfigurationBuilder()
               .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
               .Build();

        public PopularityController(IConfiguration configuration)
        {
            _configuration = configuration;
        }


        // Add Popularity info
        [Authorize]
        [HttpPost]
        [Route("add-popularity-info")]
        public IActionResult AddPopularity([FromBody] Popularity popularity)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                // Check if the record already reached the limit
                int limit = 0;
                using (MySqlCommand cmd = new MySqlCommand("SELECT COUNT(*) FROM Popularity", con))
                {
                    limit = Convert.ToInt32(cmd.ExecuteScalar());
                }

                if (limit >= 1)
                {
                    return BadRequest("List of 1 records reached. No data can be added!");
                }
                else
                {
                    // Add new record
                    using (MySqlCommand cmd = new MySqlCommand("INSERT INTO Popularity (Title1, Count1, Title2, Count2, Title3, Count3, Title4, Count4) VALUES (@Title1, @Count1, @Title2, @Count2, @Title3, @Count3, @Title4, @Count4)", con))
                    {
                        cmd.Parameters.AddWithValue("@Title1", popularity.Title1);
                        cmd.Parameters.AddWithValue("@Count1", popularity.Count1);
                        cmd.Parameters.AddWithValue("@Title2", popularity.Title2);
                        cmd.Parameters.AddWithValue("@Count2", popularity.Count2);
                        cmd.Parameters.AddWithValue("@Title3", popularity.Title3);
                        cmd.Parameters.AddWithValue("@Count3", popularity.Count3);
                        cmd.Parameters.AddWithValue("@Title4", popularity.Title4);
                        cmd.Parameters.AddWithValue("@Count4", popularity.Count4);

                        int result = cmd.ExecuteNonQuery();
                        if (result > 0)
                        {
                            return Ok("Popularity info added successfully");
                        }
                        else
                        {
                            return BadRequest("Error adding Popularity info");
                        }
                    }
                }

            }
        }



        // Fetch Popularity info
        [HttpGet]
        [Route("get-popularity-info")]
        public IActionResult Getpopularity()
        {
            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("SELECT * FROM Popularity", con))
                {
                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            var popularityinfo = new Popularity
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                Title1 = reader["Title1"].ToString(),
                                Count1 = reader["Count1"].ToString(),
                                Title2 = reader["Title2"].ToString(),
                                Count2 = reader["Count2"].ToString(),
                                Title3 = reader["Title3"].ToString(),
                                Count3 = reader["Count3"].ToString(),
                                Title4 = reader["Title4"].ToString(),
                                Count4 = reader["Count4"].ToString()
                            };

                            return Ok(popularityinfo);
                        }

                        return NotFound("No Popularity info found");
                    }
                }
            }
        }




        // Edit Popularity info
        [Authorize]
        [HttpPut]
        [Route("edit-popularity-info/{id}")]
        public IActionResult EditPopularity(int id, [FromBody] Popularity popularity)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("UPDATE Popularity SET Title1 = @Title1, Count1 = @Count1, Title2 = @Title2, Count2 = @Count2 , Title3 = @Title3, Count3 = @Count3 , Title4 = @Title4 , Count4 = @Count4 WHERE Id = @Id", con))
                {
                    cmd.Parameters.AddWithValue("@Title1", popularity.Title1);
                    cmd.Parameters.AddWithValue("@Count1", popularity.Count1);
                    cmd.Parameters.AddWithValue("@Title2", popularity.Title2);
                    cmd.Parameters.AddWithValue("@Count2", popularity.Count2);
                    cmd.Parameters.AddWithValue("@Title3", popularity.Title3);
                    cmd.Parameters.AddWithValue("@Count3", popularity.Count3);
                    cmd.Parameters.AddWithValue("@Title4", popularity.Title4);
                    cmd.Parameters.AddWithValue("@Count4", popularity.Count4);
                    cmd.Parameters.AddWithValue("@Id", id);

                    int result = cmd.ExecuteNonQuery();
                    if (result > 0)
                    {
                        return Ok("Popularity info updated successfully");
                    }
                    else
                    {
                        return BadRequest("Error updating Popularity info");
                    }
                }
            }
        }

    }
}
