using Galpa.Models.Author;
using Galpa.Models.Home;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using System.Text.Json;

namespace Galpa.Controllers.AuthorsController
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthorsController : ControllerBase
    {

        private readonly IConfiguration _configuration;
        IConfiguration configuration = new ConfigurationBuilder()
               .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
               .Build();

        public AuthorsController(IConfiguration configuration)
        {
            _configuration = configuration;
        }



        // POST: Add a new author
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> AddAuthor([FromForm] Models.Author.AuthorModel author)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                // Save profile picture to a folder and get the path
                string profilePicPath = await SaveImage(author.ProfilePic);

                // Get the maximum current Id
                int newId = 1;
                using (MySqlCommand cmd = new MySqlCommand("SELECT MAX(Id) FROM AuthorsList", con))
                {
                    var result = cmd.ExecuteScalar();
                    if (result != DBNull.Value)
                    {
                        newId = Convert.ToInt32(result) + 1;
                    }
                }

                using (MySqlCommand cmd = new MySqlCommand("INSERT INTO AuthorsList (Id, Name, Details, ProfilePic) VALUES (@Id, @Name, @Details, @ProfilePic)", con))
                {
                    cmd.Parameters.AddWithValue("@Id", newId);
                    cmd.Parameters.AddWithValue("@Name", author.Name);
                    cmd.Parameters.AddWithValue("@Details", author.Details);
                    cmd.Parameters.AddWithValue("@ProfilePic", profilePicPath);

                    int result = await cmd.ExecuteNonQueryAsync();
                    if (result > 0)
                    {
                        // Insert books
                        foreach (var book in author.Books)
                        {
                            string bookImagePath = await SaveImage(book.BookImage);
                            using (MySqlCommand bookCmd = new MySqlCommand("INSERT INTO Books (AuthorId, BookName, BookImage) VALUES (@AuthorId, @BookName, @BookImage)", con))
                            {
                                bookCmd.Parameters.AddWithValue("@AuthorId", newId);
                                bookCmd.Parameters.AddWithValue("@BookName", book.BookName);
                                bookCmd.Parameters.AddWithValue("@BookImage", bookImagePath ?? (object)DBNull.Value);

                                await bookCmd.ExecuteNonQueryAsync();
                            }
                        }

                        return Ok("Author added successfully");
                    }
                    else
                    {
                        return BadRequest("Error adding author");
                    }
                }
            }
        }

        // GET: Fetch all authors
        //[Authorize]
        [HttpGet]
        public IActionResult GetAuthors()
        {
            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("SELECT * FROM AuthorsList", con))
                {
                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        var authors = new List<object>();
                        while (reader.Read())
                        {
                            authors.Add(new
                            {
                                Id = reader["Id"],
                                Name = reader["Name"],
                                Details = reader["Details"],
                                ProfilePic = reader["ProfilePic"],
                                Books = GetBooksByAuthorId((int)reader["Id"])
                            });
                        }

                        return Ok(authors);
                    }
                }
            }
        }

        // GET: Fetch author by ID
        //[Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAuthorById(int id)
        {
            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("SELECT * FROM AuthorsList WHERE Id = @Id", con))
                {
                    cmd.Parameters.AddWithValue("@Id", id);

                    using (MySqlDataReader reader = (MySqlDataReader)await cmd.ExecuteReaderAsync())
                    {
                        if (reader.Read())
                        {
                            var author = new
                            {
                                Id = reader["Id"],
                                Name = reader["Name"],
                                Details = reader["Details"],
                                ProfilePic = reader["ProfilePic"],
                                Books = GetBooksByAuthorId((int)reader["Id"])
                            };

                            return Ok(author);
                        }
                        else
                        {
                            return NotFound("Author not found");
                        }
                    }
                }
            }
        }

        // PUT: Edit author
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditAuthor(int id, [FromForm] Models.Author.AuthorModel author)
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
                string existingProfilePic = null;

                using (MySqlCommand getCmd = new MySqlCommand("SELECT ProfilePic FROM AuthorsList WHERE Id = @Id", con))
                {
                    getCmd.Parameters.AddWithValue("@Id", id);

                    using (var reader = await getCmd.ExecuteReaderAsync())
                    {
                        if (reader.Read())
                        {
                            existingProfilePic = reader["ProfilePic"]?.ToString();
                        }
                    }
                }

                // Save profile picture to a folder and get the path
                string profilePicPath = author.ProfilePic != null ? await SaveImage(author.ProfilePic) : existingProfilePic;

                using (MySqlCommand cmd = new MySqlCommand("UPDATE AuthorsList SET Name = @Name, Details = @Details, ProfilePic = @ProfilePic WHERE Id = @Id", con))
                {
                    cmd.Parameters.AddWithValue("@Name", author.Name);
                    cmd.Parameters.AddWithValue("@Details", author.Details);
                    cmd.Parameters.AddWithValue("@ProfilePic", profilePicPath ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Id", id);

                    int result = await cmd.ExecuteNonQueryAsync();
                    if (result > 0)
                    {
                        // Update books
                        using (MySqlCommand deleteBooksCmd = new MySqlCommand("DELETE FROM Books WHERE AuthorId = @AuthorId", con))
                        {
                            deleteBooksCmd.Parameters.AddWithValue("@AuthorId", id);
                            await deleteBooksCmd.ExecuteNonQueryAsync();
                        }

                        foreach (var book in author.Books)
                        {
                            string bookImagePath = await SaveImage(book.BookImage);
                            using (MySqlCommand bookCmd = new MySqlCommand("INSERT INTO Books (AuthorId, BookName, BookImage) VALUES (@AuthorId, @BookName, @BookImage)", con))
                            {
                                bookCmd.Parameters.AddWithValue("@AuthorId", id);
                                bookCmd.Parameters.AddWithValue("@BookName", book.BookName);
                                bookCmd.Parameters.AddWithValue("@BookImage", bookImagePath);

                                await bookCmd.ExecuteNonQueryAsync();
                            }
                        }

                        return Ok("Author updated successfully");
                    }
                    else
                    {
                        return BadRequest("Error updating author");
                    }
                }
            }
        }

        // DELETE: Delete author
        [Authorize]
        [HttpDelete("{id}")]
        public IActionResult DeleteAuthor(int id)
        {
            string connectionString = _configuration.GetConnectionString("UserConnection");

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("DELETE FROM AuthorsList WHERE Id = @Id", con))
                {
                    cmd.Parameters.AddWithValue("@Id", id);

                    int result = cmd.ExecuteNonQuery();
                    if (result > 0)
                    {
                        using (MySqlCommand deleteBooksCmd = new MySqlCommand("DELETE FROM Books WHERE AuthorId = @AuthorId", con))
                        {
                            deleteBooksCmd.Parameters.AddWithValue("@AuthorId", id);
                            deleteBooksCmd.ExecuteNonQuery();
                        }

                        return Ok("Author deleted successfully");
                    }
                    else
                    {
                        return BadRequest("Error deleting author");
                    }
                }
            }
        }

        private List<BookModel> GetBooksByAuthorId(int authorId)
        {
            string connectionString = _configuration.GetConnectionString("UserConnection");
            var books = new List<BookModel>();

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                con.Open();

                using (MySqlCommand cmd = new MySqlCommand("SELECT * FROM Books WHERE AuthorId = @AuthorId", con))
                {
                    cmd.Parameters.AddWithValue("@AuthorId", authorId);

                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            books.Add(new BookModel
                            {
                                Id = (int)reader["Id"],
                                AuthorId = (int)reader["AuthorId"],
                                BookName = reader["BookName"].ToString(),
                                BookImagePath = reader["BookImage"]?.ToString()
                            });
                        }
                    }
                }
            }

            return books;
        }

        private async Task<string> SaveImage(IFormFile image)
        {
            if (image == null)
            {
                return null;
            }

            var uploads = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
            if (!Directory.Exists(uploads))
            {
                Directory.CreateDirectory(uploads);
            }

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
            var filePath = Path.Combine(uploads, fileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(fileStream);
            }

            return $"/images/{fileName}";
        }

    }
}
