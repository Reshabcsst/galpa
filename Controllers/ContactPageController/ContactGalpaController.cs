using Galpa.Models.Contact;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using System.Threading.Tasks;

namespace Galpa.Controllers.ContactPageController
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactGalpaController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;

        public ContactGalpaController(IConfiguration configuration)
        {
            _configuration = configuration;
            _connectionString = _configuration.GetConnectionString("UserConnection");
        }

        // Add contact details
        [Authorize]
        [HttpPost]
        [Route("add-contact-details")]
        public async Task<IActionResult> AddContactDetails([FromForm] ContactDetailsModel contactDetails)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            using (MySqlConnection con = new MySqlConnection(_connectionString))
            {
                con.Open();

                int limit = 0;
                using (MySqlCommand cmd = new MySqlCommand("SELECT * FROM contactdetails", con))
                {
                    limit = Convert.ToInt32(cmd.ExecuteScalar());
                }

                if (limit >= 1)
                {
                    return BadRequest("List of 1 records reached. No data can be added!");
                }
                else
                {
                    using (MySqlCommand cmd = new MySqlCommand("INSERT INTO contactdetails (OurLocation, Number1, Number2, OpensAt, CloseAt) VALUES (@OurLocation, @Number1, @Number2, @OpensAt, @CloseAt)", con))
                    {
                        cmd.Parameters.AddWithValue("@OurLocation", contactDetails.OurLocation);
                        cmd.Parameters.AddWithValue("@Number1", contactDetails.Number1);
                        cmd.Parameters.AddWithValue("@Number2", contactDetails.Number2);
                        cmd.Parameters.AddWithValue("@OpensAt", contactDetails.OpensAt);
                        cmd.Parameters.AddWithValue("@CloseAt", contactDetails.CloseAt);

                        int result = await cmd.ExecuteNonQueryAsync();
                        if (result > 0)
                        {
                            return Ok("Contact details added successfully");
                        }
                        else
                        {
                            return BadRequest("Error adding contact details");
                        }
                    }
                }
            }
        }

        // Fetch contact details
        [HttpGet]
        [Route("get-contact-details")]
        public IActionResult GetContactDetails()
        {
            using (MySqlConnection con = new MySqlConnection(_connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("SELECT * FROM contactdetails", con))
                {
                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            var contactDetails = new
                            {
                                Id = reader["Id"],
                                OurLocation = reader["OurLocation"],
                                Number1 = reader["Number1"],
                                Number2 = reader["Number2"],
                                OpensAt = reader["OpensAt"],
                                CloseAt = reader["CloseAt"]
                            };

                            return Ok(contactDetails);
                        }

                        return NotFound();
                    }
                }
            }
        }

        // Edit contact details
        [Authorize]
        [HttpPut]
        [Route("edit-contact-details/{id}")]
        public async Task<IActionResult> EditContactDetails(int id, [FromForm] ContactDetailsModel contactDetails)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            using (MySqlConnection con = new MySqlConnection(_connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("UPDATE contactdetails SET OurLocation = @OurLocation, Number1 = @Number1, Number2 = @Number2, OpensAt = @OpensAt, CloseAt = @CloseAt WHERE Id = @Id", con))
                {
                    cmd.Parameters.AddWithValue("@OurLocation", contactDetails.OurLocation);
                    cmd.Parameters.AddWithValue("@Number1", contactDetails.Number1);
                    cmd.Parameters.AddWithValue("@Number2", contactDetails.Number2);
                    cmd.Parameters.AddWithValue("@OpensAt", contactDetails.OpensAt);
                    cmd.Parameters.AddWithValue("@CloseAt", contactDetails.CloseAt);
                    cmd.Parameters.AddWithValue("@Id", id);

                    int result = await cmd.ExecuteNonQueryAsync();
                    if (result > 0)
                    {
                        return Ok("Contact details updated successfully");
                    }
                    else
                    {
                        return BadRequest("Error updating contact details");
                    }
                }
            }
        }

        // Delete contact details
        [Authorize]
        [HttpDelete]
        [Route("delete-contact-details/{id}")]
        public IActionResult DeleteContactDetails(int id)
        {
            using (MySqlConnection con = new MySqlConnection(_connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("DELETE FROM contactdetails WHERE Id = @Id", con))
                {
                    cmd.Parameters.AddWithValue("@Id", id);

                    int result = cmd.ExecuteNonQuery();
                    if (result > 0)
                    {
                        return Ok("Contact details deleted successfully");
                    }
                    else
                    {
                        return BadRequest("Error deleting contact details");
                    }
                }
            }
        }
    }
}
