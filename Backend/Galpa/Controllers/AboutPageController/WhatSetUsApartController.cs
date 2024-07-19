using Galpa.Models.About;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

namespace Galpa.Controllers.AboutPageController
{
    [Route("api/[controller]")]
    [ApiController]
    public class WhatSetUsApartController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        IConfiguration configuration = new ConfigurationBuilder()
               .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
               .Build();

        public WhatSetUsApartController(IConfiguration configuration)
        {
            _configuration = configuration;
        }



        // Add item
        [Authorize]
        [HttpPost]
        [Route("add-item")]
        public async Task<IActionResult> AddItem([FromForm] CardModel card)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                // Save the image to a folder and get its path
                string imagePath = null;
                if (card.CardPic != null)
                {
                    var uploads = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
                    if (!Directory.Exists(uploads))
                    {
                        Directory.CreateDirectory(uploads);
                    }

                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(card.CardPic.FileName);
                    var filePath = Path.Combine(uploads, fileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await card.CardPic.CopyToAsync(fileStream);
                    }

                    imagePath = $"/images/{fileName}";
                }

                // Get the maximum current Id
                int newId = 1;
                int limit = 0;
                using (MySqlCommand cmd = new MySqlCommand("SELECT MAX(Id) FROM WhatSetUsApart", con))
                {
                    var result = cmd.ExecuteScalar();
                    limit = Convert.ToInt32(cmd.ExecuteScalar());
                    if (result != DBNull.Value)
                    {
                        newId = Convert.ToInt32(result) + 1;
                    }
                }
                if (limit >= 3)
                {
                    return BadRequest("List of 3 records reached. No data can be added!");
                }
                else
                {
                    using (MySqlCommand cmd = new MySqlCommand("INSERT INTO WhatSetUsApart (Id, CardPic, Heading, Details) VALUES (@Id, @CardPic, @Heading, @Details)", con))
                    {
                        cmd.Parameters.AddWithValue("@Id", newId);
                        cmd.Parameters.AddWithValue("@CardPic", imagePath);
                        cmd.Parameters.AddWithValue("@Heading", card.Heading);
                        cmd.Parameters.AddWithValue("@Details", card.Details);

                        int result = cmd.ExecuteNonQuery();
                        if (result > 0)
                        {
                            return Ok("Item added successfully");
                        }
                        else
                        {
                            return BadRequest("Error adding item");
                        }
                    }
                }
            }
        }

        // Fetch all items
        [HttpGet]
        [Route("get-all-items")]
        public IActionResult GetAllItems()
        {
            string connectionString = _configuration.GetConnectionString("UserConnection");
            var items = new List<object>();

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("SELECT * FROM WhatSetUsApart", con))
                {
                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            var item = new
                            {
                                Id = reader["Id"],
                                CardPic = reader["CardPic"],
                                Heading = reader["Heading"],
                                Details = reader["Details"]
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

        // Edit item
        [Authorize]
        [HttpPut]
        [Route("edit-item/{id}")]
        public async Task<IActionResult> EditItem(int id, [FromForm] CardModel card)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                // Get the existing data from the database
                string existingCardPic = null;
                string existingHeading = null;
                string existingDetails = null;

                using (MySqlCommand getCmd = new MySqlCommand("SELECT CardPic, Heading, Details FROM WhatSetUsApart WHERE Id = @Id", con))
                {
                    getCmd.Parameters.AddWithValue("@Id", id);

                    using (var reader = await getCmd.ExecuteReaderAsync())
                    {
                        if (reader.Read())
                        {
                            existingCardPic = reader["CardPic"]?.ToString();
                            existingHeading = reader["Heading"]?.ToString();
                            existingDetails = reader["Details"]?.ToString();
                        }
                    }
                }

                // Save the image to a folder and get its path
                string imagePath = existingCardPic;
                if (card.CardPic != null)
                {
                    var uploads = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
                    if (!Directory.Exists(uploads))
                    {
                        Directory.CreateDirectory(uploads);
                    }

                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(card.CardPic.FileName);
                    var filePath = Path.Combine(uploads, fileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await card.CardPic.CopyToAsync(fileStream);
                    }

                    imagePath = $"/images/{fileName}";
                }

                using (MySqlCommand cmd = new MySqlCommand("UPDATE WhatSetUsApart SET CardPic = @CardPic, Heading = @Heading, Details = @Details WHERE Id = @Id", con))
                {
                    cmd.Parameters.AddWithValue("@CardPic", imagePath ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Heading", card.Heading ?? (object)existingHeading ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@Details", card.Details ?? (object)existingDetails ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@Id", id);

                    int result = await cmd.ExecuteNonQueryAsync();
                    if (result > 0)
                    {
                        return Ok("Item updated successfully");
                    }
                    else
                    {
                        return BadRequest("Error updating item");
                    }
                }
            }
        }

        // Delete item
        [Authorize]
        [HttpDelete]
        [Route("delete-item/{id}")]
        public IActionResult DeleteItem(int id)
        {
            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("DELETE FROM WhatSetUsApart WHERE Id = @Id", con))
                {
                    cmd.Parameters.AddWithValue("@Id", id);

                    int result = cmd.ExecuteNonQuery();
                    if (result > 0)
                    {
                        return Ok("Item deleted successfully");
                    }
                    else
                    {
                        return BadRequest("Error deleting item");
                    }
                }
            }
        }
    }
}
