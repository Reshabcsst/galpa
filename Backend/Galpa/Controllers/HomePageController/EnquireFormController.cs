using Galpa.Models.Home;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

namespace Galpa.Controllers.HomePageController
{
    [Route("api/[controller]")]
    [ApiController]
    public class EnquireFormController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public EnquireFormController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [Authorize]
        [HttpPost]
        public IActionResult AddEnquireForm([FromBody] EnquireForm enquireForm)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();


                // Add new record
                using (MySqlCommand cmd = new MySqlCommand("INSERT INTO EnquireForm (Id, Name, Email, Phone, Date, Message) VALUES (@Id, @Name, @Email, @phone, @Date, @Message)", con))
                {
                    cmd.Parameters.AddWithValue("@Id", enquireForm.Id);
                    cmd.Parameters.AddWithValue("@Name", enquireForm.Name);
                    cmd.Parameters.AddWithValue("@Email", enquireForm.Email);
                    cmd.Parameters.AddWithValue("@Phone", enquireForm.Phone);
                    cmd.Parameters.AddWithValue("@Date", enquireForm.Date);
                    cmd.Parameters.AddWithValue("@Message", enquireForm.Message);

                    int result = cmd.ExecuteNonQuery();
                    if (result > 0)
                    {
                        return Ok("Company info added successfully");
                    }
                    else
                    {
                        return BadRequest("Error adding company info");
                    }
                }
            }
        }

        //Get Form data
        [Authorize]
        [HttpGet]
        public IActionResult GetAllEnquireForms()
        {
            List<EnquireForm> enquireForms = new List<EnquireForm>();
            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("SELECT * FROM EnquireForm", con))
                {
                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            EnquireForm enquireForm = new EnquireForm
                            {
                                Id = reader.GetInt32("Id"),
                                Name = reader.GetString("Name"),
                                Email = reader.GetString("Email"),
                                Phone = reader.GetString("Phone"),
                                Date = reader.GetDateTime("Date"),
                                Message = reader.GetString("Message")
                            };
                            enquireForms.Add(enquireForm);
                        }
                    }
                }
            }

            return Ok(enquireForms);
        }


        // Delete data
        [Authorize]
        [HttpDelete]
        [Route("{id}")]
        public IActionResult DeleteEnquireForms(int id)
        {
            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("DELETE FROM EnquireForm WHERE Id = @Id", con))
                {
                    cmd.Parameters.AddWithValue("@Id", id);

                    int result = cmd.ExecuteNonQuery();
                    if (result > 0)
                    {
                        return Ok("Enquire Form deleted successfully");
                    }
                    else
                    {
                        return BadRequest("Error deleting Enquire Form");
                    }
                }
            }
        }

    }
}
