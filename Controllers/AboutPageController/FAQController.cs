using Galpa.Models.About;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

namespace Galpa.Controllers.AboutPageController
{
    [Route("api/[controller]")]
    [ApiController]
    public class FAQController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        IConfiguration configuration = new ConfigurationBuilder()
               .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
               .Build();

        public FAQController(IConfiguration configuration)
        {
            _configuration = configuration;
        }



        // Add FAQ item
        [Authorize]
        [HttpPost]
        [Route("add-faq")]
        public async Task<IActionResult> AddFAQItem([FromForm] FAQModel faq)
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
                using (MySqlCommand cmd = new MySqlCommand("SELECT MAX(Id) FROM FAQ", con))
                {
                    var result = cmd.ExecuteScalar();
                    if (result != DBNull.Value)
                    {
                        newId = Convert.ToInt32(result) + 1;
                    }
                }

                using (MySqlCommand cmd = new MySqlCommand("INSERT INTO FAQ (Id, question, answer) VALUES (@Id, @question, @answer)", con))
                {
                    cmd.Parameters.AddWithValue("@Id", newId);
                    cmd.Parameters.AddWithValue("@question", faq.question);
                    cmd.Parameters.AddWithValue("@answer", faq.answer);

                    int result = await cmd.ExecuteNonQueryAsync();
                    if (result > 0)
                    {
                        return Ok("FAQ item added successfully");
                    }
                    else
                    {
                        return BadRequest("Error adding FAQ item");
                    }
                }
            }
        }

        // Fetch all FAQ items
        [HttpGet]
        [Route("get-all-faqs")]
        public IActionResult GetAllFAQs()
        {
            string connectionString = _configuration.GetConnectionString("UserConnection");
            var items = new List<object>();

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("SELECT * FROM FAQ", con))
                {
                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            var item = new
                            {
                                Id = reader["Id"],
                                question = reader["question"],
                                answer = reader["answer"]
                            };

                            items.Add(item);
                        }
                    }
                }
            }

            if (items.Count > 0)
            {
                return Ok(items);
            }
            else
            {
                return NotFound();
            }
        }

        // Edit FAQ item
        [Authorize]
        [HttpPut]
        [Route("edit-faq/{id}")]
        public async Task<IActionResult> EditFAQItem(int id, [FromForm] FAQModel faq)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("UPDATE FAQ SET question = @question, answer = @answer WHERE Id = @Id", con))
                {
                    cmd.Parameters.AddWithValue("@question", faq.question);
                    cmd.Parameters.AddWithValue("@answer", faq.answer);
                    cmd.Parameters.AddWithValue("@Id", id);

                    int result = await cmd.ExecuteNonQueryAsync();
                    if (result > 0)
                    {
                        return Ok("FAQ item updated successfully");
                    }
                    else
                    {
                        return BadRequest("Error updating FAQ item");
                    }
                }
            }
        }

        // Delete FAQ item
        [Authorize]
        [HttpDelete]
        [Route("delete-faq/{id}")]
        public IActionResult DeleteFAQItem(int id)
        {
            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("DELETE FROM FAQ WHERE Id = @Id", con))
                {
                    cmd.Parameters.AddWithValue("@Id", id);

                    int result = cmd.ExecuteNonQuery();
                    if (result > 0)
                    {
                        return Ok("FAQ item deleted successfully");
                    }
                    else
                    {
                        return BadRequest("Error deleting FAQ item");
                    }
                }
            }
        }
    }
}
