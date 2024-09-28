using Galpa.Models.Pricing;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using System.Threading.Tasks;

namespace Galpa.Controllers.GalpaPricingPageController
{
    [Route("api/[controller]")]
    [ApiController]
    public class PricingDetailsController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;

        public PricingDetailsController(IConfiguration configuration)
        {
            _configuration = configuration;
            _connectionString = _configuration.GetConnectionString("UserConnection");
        }

        // Add service details
        //[Authorize]
        [HttpPost]
        [Route("add-service-details")]
        public async Task<IActionResult> AddServiceDetails([FromForm] ServiceDetailsModel serviceDetails)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            using (MySqlConnection con = new MySqlConnection(_connectionString))
            {
                con.Open();

                int count = 0;
                using (MySqlCommand cmd = new MySqlCommand("SELECT COUNT(*) FROM servicedetails", con))
                {
                    count = Convert.ToInt32(await cmd.ExecuteScalarAsync());
                }

                if (count >= 3)
                {
                    return BadRequest("List of 3 records reached. No data can be added!");
                }
                else
                {
                    using (MySqlCommand cmd = new MySqlCommand("INSERT INTO servicedetails (Service, Price, Feature1, Feature2, Feature3, Feature4, Feature5, Details) VALUES (@Service, @Price, @Feature1, @Feature2, @Feature3, @Feature4, @Feature5, @Details)", con))
                    {
                        cmd.Parameters.AddWithValue("@Service", serviceDetails.Service);
                        cmd.Parameters.AddWithValue("@Price", serviceDetails.Price);
                        cmd.Parameters.AddWithValue("@Feature1", serviceDetails.Feature1);
                        cmd.Parameters.AddWithValue("@Feature2", serviceDetails.Feature2);
                        cmd.Parameters.AddWithValue("@Feature3", serviceDetails.Feature3);
                        cmd.Parameters.AddWithValue("@Feature4", serviceDetails.Feature4);
                        cmd.Parameters.AddWithValue("@Feature5", serviceDetails.Feature5);
                        cmd.Parameters.AddWithValue("@Details", serviceDetails.Details);

                        int result = await cmd.ExecuteNonQueryAsync();
                        if (result > 0)
                        {
                            return Ok("Service details added successfully");
                        }
                        else
                        {
                            return BadRequest("Error adding service details");
                        }
                    }
                }
            }
        }

        // Fetch service details
        [HttpGet]
        [Route("get-service-details")]
        public IActionResult GetServiceDetails()
        {
            using (MySqlConnection con = new MySqlConnection(_connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("SELECT * FROM servicedetails", con))
                {
                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        var serviceDetailsList = new List<object>();

                        while (reader.Read())
                        {
                            var serviceDetails = new
                            {
                                Id = reader["Id"],
                                Service = reader["Service"],
                                Price = reader["Price"],
                                Feature1 = reader["Feature1"],
                                Feature2 = reader["Feature2"],
                                Feature3 = reader["Feature3"],
                                Feature4 = reader["Feature4"],
                                Feature5 = reader["Feature5"],
                                Details = reader["Details"]
                            };

                            serviceDetailsList.Add(serviceDetails);
                        }

                        if (serviceDetailsList.Count > 0)
                        {
                            return Ok(serviceDetailsList);
                        }
                        else
                        {
                            return NotFound();
                        }
                    }
                }
            }
        }


        // Edit service details
        ///[Authorize]
        [HttpPut]
        [Route("edit-service-details/{id}")]
        public async Task<IActionResult> EditServiceDetails(int id, [FromForm] ServiceDetailsModel serviceDetails)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            using (MySqlConnection con = new MySqlConnection(_connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("UPDATE servicedetails SET Service = @Service, Price = @Price, Feature1 = @Feature1, Feature2 = @Feature2, Feature3 = @Feature3, Feature4 = @Feature4, Feature5 = @Feature5, Details = @Details WHERE Id = @Id", con))
                {
                    cmd.Parameters.AddWithValue("@Service", serviceDetails.Service);
                    cmd.Parameters.AddWithValue("@Price", serviceDetails.Price);
                    cmd.Parameters.AddWithValue("@Feature1", serviceDetails.Feature1);
                    cmd.Parameters.AddWithValue("@Feature2", serviceDetails.Feature2);
                    cmd.Parameters.AddWithValue("@Feature3", serviceDetails.Feature3);
                    cmd.Parameters.AddWithValue("@Feature4", serviceDetails.Feature4);
                    cmd.Parameters.AddWithValue("@Feature5", serviceDetails.Feature5);
                    cmd.Parameters.AddWithValue("@Details", serviceDetails.Details);
                    cmd.Parameters.AddWithValue("@Id", id);

                    int result = await cmd.ExecuteNonQueryAsync();
                    if (result > 0)
                    {
                        return Ok("Service details updated successfully");
                    }
                    else
                    {
                        return BadRequest("Error updating service details");
                    }
                }
            }
        }

        // Delete service details
        [Authorize]
        [HttpDelete]
        [Route("delete-service-details/{id}")]
        public IActionResult DeleteServiceDetails(int id)
        {
            using (MySqlConnection con = new MySqlConnection(_connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("DELETE FROM servicedetails WHERE Id = @Id", con))
                {
                    cmd.Parameters.AddWithValue("@Id", id);

                    int result = cmd.ExecuteNonQuery();
                    if (result > 0)
                    {
                        return Ok("Service details deleted successfully");
                    }
                    else
                    {
                        return BadRequest("Error deleting service details");
                    }
                }
            }
        }
    }
}
