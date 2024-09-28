using Galpa.Models.Contact;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

namespace Galpa.Controllers.ContactPageController
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactFormController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        IConfiguration configuration = new ConfigurationBuilder()
               .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
               .Build();

        public ContactFormController(IConfiguration configuration)
        {
            _configuration = configuration;
        }




        // POST: api/contact
        [HttpPost]
        public async Task<IActionResult> PostContact([FromBody] ContactModel contact)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("INSERT INTO contact (Name, Email, Phone, Date, Message) VALUES (@Name, @Email, @Phone, @Date, @Message)", con))
                {
                    cmd.Parameters.AddWithValue("@Name", contact.Name);
                    cmd.Parameters.AddWithValue("@Email", contact.Email);
                    cmd.Parameters.AddWithValue("@Phone", contact.Phone);
                    cmd.Parameters.AddWithValue("@Date", contact.Date);
                    cmd.Parameters.AddWithValue("@Message", contact.Message);

                    int result = await cmd.ExecuteNonQueryAsync();
                    if (result > 0)
                    {
                        return Ok("Contact added successfully");
                    }
                    else
                    {
                        return BadRequest("Error adding contact");
                    }
                }
            }
        }


        // GET: api/contact
        [HttpGet]
        public IActionResult GetAllContacts()
        {
            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("SELECT * FROM contact", con))
                {
                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        var contacts = new List<ContactModel>();

                        while (reader.Read())
                        {
                            contacts.Add(new ContactModel
                            {
                                Id = (int)reader["Id"],
                                Name = reader["Name"].ToString(),
                                Email = reader["Email"].ToString(),
                                Phone = reader["Phone"].ToString(),
                                Date = reader["Date"].ToString(),
                                Message = reader["Message"].ToString()
                            });
                        }

                        return Ok(contacts);
                    }
                }
            }
        }



        // DELETE: api/contact/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContact(int id)
        {
            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("DELETE FROM contact WHERE Id = @Id", con))
                {
                    cmd.Parameters.AddWithValue("@Id", id);

                    int result = await cmd.ExecuteNonQueryAsync();
                    if (result > 0)
                    {
                        return Ok("Contact deleted successfully");
                    }
                    else
                    {
                        return NotFound("Contact not found");
                    }
                }
            }
        }
    }
}
