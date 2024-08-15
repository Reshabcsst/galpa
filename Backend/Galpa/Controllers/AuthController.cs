using Galpa.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using MySql.Data.MySqlClient;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Galpa.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public AuthController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // User registration
        [HttpPost]
        [Route("registration")]
        public IActionResult Register(RegistrationModel registration)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                // Check if email already exists
                using (MySqlCommand checkUserCmd = new MySqlCommand("SELECT COUNT(*) FROM Login WHERE Email = @Email", con))
                {
                    checkUserCmd.Parameters.AddWithValue("@Email", registration.Email);

                    int existingUserCount = Convert.ToInt32(checkUserCmd.ExecuteScalar());

                    if (existingUserCount > 0)
                    {
                        return Conflict("User already exists with this Email");
                    }
                }

                // If user doesn't exist, proceed with registration
                using (MySqlCommand cmd = new MySqlCommand("INSERT INTO Login(UserName, Password, Email) VALUES(@UserName, @Password, @Email); SELECT LAST_INSERT_ID();", con))
                {
                    cmd.Parameters.AddWithValue("@UserName", registration.UserName);
                    cmd.Parameters.AddWithValue("@Password", registration.Password);
                    cmd.Parameters.AddWithValue("@Email", registration.Email);

                    object result = cmd.ExecuteScalar();

                    if (result != null && result != DBNull.Value)
                    {
                        UInt64 userId = Convert.ToUInt64(result);

                        // Fetch registered user details
                        using (MySqlCommand fetchUserCmd = new MySqlCommand("SELECT * FROM Login WHERE Id = @Id", con))
                        {
                            fetchUserCmd.Parameters.AddWithValue("@Id", userId);

                            using (MySqlDataReader reader = fetchUserCmd.ExecuteReader())
                            {
                                if (reader.Read())
                                {
                                    var registeredUser = new
                                    {
                                        UserName = reader["UserName"].ToString(),
                                        Email = reader["Email"].ToString(),
                                        // Add other user details as needed
                                    };

                                    return Ok(registeredUser);
                                }
                            }
                        }

                        return BadRequest("Error retrieving registered user data");
                    }
                    else
                    {
                        return BadRequest("Error registering user");
                    }
                }
            }
        }

        // Login method for regular users
        [HttpPost]
        [Route("login")]
        public IActionResult Login(LoginModel login)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                MySqlCommand cmd = new MySqlCommand("SELECT * FROM Login WHERE UserName = @UserName AND Password = @Password", con);
                cmd.Parameters.AddWithValue("@UserName", login.UserName);
                cmd.Parameters.AddWithValue("@Password", login.Password);

                con.Open();
                using (MySqlDataReader reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        // Return the user details
                        var userDetails = new
                        {
                            UserName = reader["UserName"].ToString(),
                            Email = reader["Email"].ToString()
                        };

                        return Ok(userDetails);
                    }
                }

                return Unauthorized("Invalid username or password");
            }
        }

        // Login method for admins
        [HttpPost]
        [Route("admin/login")]
        public IActionResult AdminLogin(LoginModel login)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                MySqlCommand cmd = new MySqlCommand("SELECT * FROM Admin WHERE UserName = @UserName AND Password = @Password", con);
                cmd.Parameters.AddWithValue("@UserName", login.UserName);
                cmd.Parameters.AddWithValue("@Password", login.Password);

                con.Open();
                using (MySqlDataReader reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        // Generate JWT token
                        var tokenHandler = new JwtSecurityTokenHandler();
                        var key = Encoding.UTF8.GetBytes(_configuration.GetConnectionString("JWT_Secret"));

                        var tokenDescriptor = new SecurityTokenDescriptor
                        {
                            Subject = new ClaimsIdentity(new Claim[]
                            {
                                new Claim(ClaimTypes.Name, login.UserName),
                                new Claim("AdminRole", "true") // Example: Add an admin role claim
                                // Add more claims if needed
                            }),
                            Expires = DateTime.UtcNow.AddDays(30), // Token expires in 30 days
                            SigningCredentials = new SigningCredentials(
                                new SymmetricSecurityKey(key),
                                SecurityAlgorithms.HmacSha256Signature)
                        };
                        var token = tokenHandler.CreateToken(tokenDescriptor);
                        var tokenString = tokenHandler.WriteToken(token);

                        // Return the token along with admin details
                        var adminDetails = new
                        {
                            UserName = reader["UserName"].ToString(),
                            Email = reader["Email"].ToString(),
                            Token = tokenString  // Include the token in the response
                                                 // Add other admin details as needed
                        };

                        return Ok(adminDetails);
                    }
                }

                return Unauthorized("Invalid admin username or password");
            }
        }



        // Admin registration
        [Authorize]
        [HttpPost]
        [Route("admin/registration")]
        public IActionResult AdminRegister(RegistrationModel adminRegistration)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                // Check if admin email already exists
                using (MySqlCommand checkAdminCmd = new MySqlCommand("SELECT COUNT(*) FROM Admin WHERE Email = @Email", con))
                {
                    checkAdminCmd.Parameters.AddWithValue("@Email", adminRegistration.Email);

                    int existingAdminCount = Convert.ToInt32(checkAdminCmd.ExecuteScalar());

                    if (existingAdminCount > 0)
                    {
                        return Conflict("Admin already exists with this Email");
                    }
                }

                // If admin doesn't exist, proceed with registration
                using (MySqlCommand cmd = new MySqlCommand("INSERT INTO Admin(UserName, Password, Email) VALUES(@UserName, @Password, @Email); SELECT LAST_INSERT_ID();", con))
                {
                    cmd.Parameters.AddWithValue("@UserName", adminRegistration.UserName);
                    cmd.Parameters.AddWithValue("@Password", adminRegistration.Password);
                    cmd.Parameters.AddWithValue("@Email", adminRegistration.Email);

                    object result = cmd.ExecuteScalar();

                    if (result != null && result != DBNull.Value)
                    {
                        UInt64 adminId = Convert.ToUInt64(result);

                        // Fetch registered admin details
                        using (MySqlCommand fetchAdminCmd = new MySqlCommand("SELECT * FROM Admin WHERE Id = @Id", con))
                        {
                            fetchAdminCmd.Parameters.AddWithValue("@Id", adminId);

                            using (MySqlDataReader reader = fetchAdminCmd.ExecuteReader())
                            {
                                if (reader.Read())
                                {
                                    var registeredAdmin = new
                                    {
                                        UserName = reader["UserName"].ToString(),
                                        Email = reader["Email"].ToString(),
                                        // Add other admin details as needed
                                    };

                                    return Ok(registeredAdmin);
                                }
                            }
                        }

                        return BadRequest("Error retrieving registered admin data");
                    }
                    else
                    {
                        return BadRequest("Error registering admin");
                    }
                }
            }
        }

        [Authorize]
        [HttpGet("check")]
        public IActionResult CheckRoute()
        {
            return Content("Route is Working");
        }


        [HttpGet("test")]
        public IActionResult TestRoute()
        {
            return Content("Test Route is Working");
        }
    }
}
