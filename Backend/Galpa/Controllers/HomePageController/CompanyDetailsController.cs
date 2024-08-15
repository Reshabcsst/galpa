using Galpa.Models.Home;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

namespace Galpa.Controllers.HomePageController
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompanyDetailsController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        IConfiguration configuration = new ConfigurationBuilder()
               .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
               .Build();

        public CompanyDetailsController(IConfiguration configuration)
        {
            _configuration = configuration;
        }



        // Add company details
        [Authorize]
        [HttpPost]
        [Route("add-company-details")]
        public IActionResult AddCompanyDetails([FromBody] CompanyDetailsModel companyDetails)
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
                using (MySqlCommand cmd = new MySqlCommand("SELECT COUNT(*) FROM CompanyDetails", con))
                {
                    exists = Convert.ToInt32(cmd.ExecuteScalar()) > 0;
                }

                if (exists)
                {
                    return BadRequest("Company details already exist. Please edit the existing record.");
                }

                // Add new record
                using (MySqlCommand cmd = new MySqlCommand(@"
                    INSERT INTO CompanyDetails 
                    (CompanyBio, PhoneNumber, Email, Address, FacebookLink, TwitterLink, InstagramLink, LinkedInLink, YoutubeLink) 
                    VALUES 
                    (@CompanyBio, @PhoneNumber, @Email, @Address, @FacebookLink, @TwitterLink, @InstagramLink, @LinkedInLink, @YoutubeLink)", con))
                {
                    cmd.Parameters.AddWithValue("@CompanyBio", companyDetails.CompanyBio);
                    cmd.Parameters.AddWithValue("@PhoneNumber", companyDetails.PhoneNumber);
                    cmd.Parameters.AddWithValue("@Email", companyDetails.Email);
                    cmd.Parameters.AddWithValue("@Address", companyDetails.Address);
                    cmd.Parameters.AddWithValue("@FacebookLink", companyDetails.FacebookLink);
                    cmd.Parameters.AddWithValue("@TwitterLink", companyDetails.TwitterLink);
                    cmd.Parameters.AddWithValue("@InstagramLink", companyDetails.InstagramLink);
                    cmd.Parameters.AddWithValue("@LinkedInLink", companyDetails.LinkedInLink);
                    cmd.Parameters.AddWithValue("@YoutubeLink", companyDetails.YoutubeLink);

                    int result = cmd.ExecuteNonQuery();
                    if (result > 0)
                    {
                        return Ok("Company details added successfully");
                    }
                    else
                    {
                        return BadRequest("Error adding company details");
                    }
                }
            }
        }

        // Fetch company details
        [HttpGet]
        [Route("get-company-details")]
        public IActionResult GetCompanyDetails()
        {
            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("SELECT * FROM CompanyDetails LIMIT 1", con))
                {
                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            var companyDetails = new CompanyDetailsModel
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                CompanyBio = reader["CompanyBio"].ToString(),
                                PhoneNumber = reader["PhoneNumber"].ToString(),
                                Email = reader["Email"].ToString(),
                                Address = reader["Address"].ToString(),
                                FacebookLink = reader["FacebookLink"].ToString(),
                                TwitterLink = reader["TwitterLink"].ToString(),
                                InstagramLink = reader["InstagramLink"].ToString(),
                                LinkedInLink = reader["LinkedInLink"].ToString(),
                                YoutubeLink = reader["YoutubeLink"].ToString()
                            };

                            return Ok(companyDetails);
                        }

                        return NotFound("No company details found");
                    }
                }
            }
        }

        // Edit company details
        [Authorize]
        [HttpPut]
        [Route("edit-company-details/{id}")]
        public IActionResult EditCompanyDetails(int id, [FromBody] CompanyDetailsModel companyDetails)
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
                    UPDATE CompanyDetails 
                    SET CompanyBio = @CompanyBio, PhoneNumber = @PhoneNumber, Email = @Email, Address = @Address, 
                        FacebookLink = @FacebookLink, TwitterLink = @TwitterLink, InstagramLink = @InstagramLink, 
                        LinkedInLink = @LinkedInLink, YoutubeLink = @YoutubeLink 
                    WHERE Id = @Id", con))
                {
                    cmd.Parameters.AddWithValue("@CompanyBio", companyDetails.CompanyBio);
                    cmd.Parameters.AddWithValue("@PhoneNumber", companyDetails.PhoneNumber);
                    cmd.Parameters.AddWithValue("@Email", companyDetails.Email);
                    cmd.Parameters.AddWithValue("@Address", companyDetails.Address);
                    cmd.Parameters.AddWithValue("@FacebookLink", companyDetails.FacebookLink);
                    cmd.Parameters.AddWithValue("@TwitterLink", companyDetails.TwitterLink);
                    cmd.Parameters.AddWithValue("@InstagramLink", companyDetails.InstagramLink);
                    cmd.Parameters.AddWithValue("@LinkedInLink", companyDetails.LinkedInLink);
                    cmd.Parameters.AddWithValue("@YoutubeLink", companyDetails.YoutubeLink);
                    cmd.Parameters.AddWithValue("@Id", id);

                    int result = cmd.ExecuteNonQuery();
                    if (result > 0)
                    {
                        return Ok("Company details updated successfully");
                    }
                    else
                    {
                        return BadRequest("Error updating company details");
                    }
                }
            }
        }

        // Delete company details
        [Authorize]
        [HttpDelete]
        [Route("delete-company-details/{id}")]
        public IActionResult DeleteCompanyDetails(int id)
        {
            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("DELETE FROM CompanyDetails WHERE Id = @Id", con))
                {
                    cmd.Parameters.AddWithValue("@Id", id);

                    int result = cmd.ExecuteNonQuery();
                    if (result > 0)
                    {
                        return Ok("Company details deleted successfully");
                    }
                    else
                    {
                        return BadRequest("Error deleting company details");
                    }
                }
            }
        }
    }
}
