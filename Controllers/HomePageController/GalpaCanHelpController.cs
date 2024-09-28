using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using System;
using Galpa.Models.Home;

namespace Galpa.Controllers.HomePageController
{
    [Route("api/[controller]")]
    [ApiController]
    public class GalpaCanHelpController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        IConfiguration configuration = new ConfigurationBuilder()
               .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
               .Build();

        public GalpaCanHelpController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // Add company info
        [Authorize]
        [HttpPost]
        [Route("add-company-info")]
        public IActionResult AddCompanyInfo([FromBody] CompanyInfoModel companyInfo)
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
                using (MySqlCommand cmd = new MySqlCommand("SELECT COUNT(*) FROM CompanyInfo", con))
                {
                    exists = Convert.ToInt32(cmd.ExecuteScalar()) > 0;
                }

                if (exists)
                {
                    return BadRequest("Company info already exists. Please edit the existing record.");
                }

                // Add new record
                using (MySqlCommand cmd = new MySqlCommand("INSERT INTO CompanyInfo (Subheading, PhoneNumber, Email) VALUES (@Subheading, @PhoneNumber, @Email)", con))
                {
                    cmd.Parameters.AddWithValue("@Subheading", companyInfo.Subheading);
                    cmd.Parameters.AddWithValue("@PhoneNumber", companyInfo.PhoneNumber);
                    cmd.Parameters.AddWithValue("@Email", companyInfo.Email);

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

        // Fetch company info
        [HttpGet]
        [Route("get-company-info")]
        public IActionResult GetCompanyInfo()
        {
            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("SELECT * FROM CompanyInfo LIMIT 1", con))
                {
                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            var companyInfo = new CompanyInfoModel
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                Subheading = reader["Subheading"].ToString(),
                                PhoneNumber = reader["PhoneNumber"].ToString(),
                                Email = reader["Email"].ToString()
                            };

                            return Ok(companyInfo);
                        }

                        return NotFound("No company info found");
                    }
                }
            }
        }

        // Edit company info
        [Authorize]
        [HttpPut]
        [Route("edit-company-info/{id}")]
        public IActionResult EditCompanyInfo(int id, [FromBody] CompanyInfoModel companyInfo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("UPDATE CompanyInfo SET Subheading = @Subheading, PhoneNumber = @PhoneNumber, Email = @Email WHERE Id = @Id", con))
                {
                    cmd.Parameters.AddWithValue("@Subheading", companyInfo.Subheading);
                    cmd.Parameters.AddWithValue("@PhoneNumber", companyInfo.PhoneNumber);
                    cmd.Parameters.AddWithValue("@Email", companyInfo.Email);
                    cmd.Parameters.AddWithValue("@Id", id);

                    int result = cmd.ExecuteNonQuery();
                    if (result > 0)
                    {
                        return Ok("Company info updated successfully");
                    }
                    else
                    {
                        return BadRequest("Error updating company info");
                    }
                }
            }
        }

        // Delete company info
        [Authorize]
        [HttpDelete]
        [Route("delete-company-info/{id}")]
        public IActionResult DeleteCompanyInfo(int id)
        {
            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("DELETE FROM CompanyInfo WHERE Id = @Id", con))
                {
                    cmd.Parameters.AddWithValue("@Id", id);

                    int result = cmd.ExecuteNonQuery();
                    if (result > 0)
                    {
                        return Ok("Company info deleted successfully");
                    }
                    else
                    {
                        return BadRequest("Error deleting company info");
                    }
                }
            }
        }
    }
}
