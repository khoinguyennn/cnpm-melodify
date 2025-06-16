using MelodifyAPI.Data;
using MelodifyAPI.DTOs;
using MelodifyAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MelodifyAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArtistsController : ControllerBase
    {
        private readonly MelodifyContext _context;

        public ArtistsController(MelodifyContext context)
        {
            _context = context;
        }

        //Lấy danh sách tất cả nghệ sĩ(Công khai)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ArtistDTO>>> GetAllArtists()
        {
            var artists = await _context.Artists
                .Select(a => new ArtistDTO
                {
                    ArtistID = a.ArtistID,
                    Name = a.Name,
                    Bio = a.Bio,
                    ImageUrl = a.ImageUrl
                })
                .ToListAsync();
            return Ok(artists);
        }

        //Lấy chi tiết một nghệ sĩ theo ID(Công khai)
        [HttpGet("{id}")]
        public async Task<ActionResult<ArtistDTO>> GetArtistById(int id)
        {
            var artist = await _context.Artists.FindAsync(id);
            if (artist == null)
                return NotFound("Không tìm thấy nghệ sĩ.");

            var artistDto = new ArtistDTO
            {
                ArtistID = artist.ArtistID,
                Name = artist.Name,
                Bio = artist.Bio,
                ImageUrl = artist.ImageUrl
            };

            return Ok(artistDto);
        }


        // Thêm Nghệ sĩ (Chỉ Admin mới có quyền)
        [HttpPost("add")]
        [Authorize(Roles = "Admin")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> AddArtist(
    [FromForm] string name,
    [FromForm] string bio,
    IFormFile imageFile)
        {
            try
            {
                if (string.IsNullOrEmpty(name))
                    return BadRequest("Tên nghệ sĩ không được để trống!");

                if (imageFile == null)
                    return BadRequest("Vui lòng upload ảnh nghệ sĩ!");

                // Kiểm tra nghệ sĩ đã tồn tại
                var existingArtist = await _context.Artists
                    .FirstOrDefaultAsync(a => a.Name == name);

                if (existingArtist != null)
                    return BadRequest("Nghệ sĩ đã tồn tại!");

                // Tạo tên file unique
                string imageFileName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);

                // Đường dẫn thư mục lưu file
                var imageDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "data", "artists");
                Directory.CreateDirectory(imageDirectory);

                // Đường dẫn đầy đủ của file
                string imagePath = Path.Combine(imageDirectory, imageFileName);

                // Lưu file
                using (var stream = new FileStream(imagePath, FileMode.Create))
                {
                    await imageFile.CopyToAsync(stream);
                }

                // Tạo đường dẫn tương đối để lưu vào database
                string imageUrl = $"/data/artists/{imageFileName}";

                var newArtist = new Artist
                {
                    Name = name,
                    Bio = bio,
                    ImageUrl = imageUrl
                };

                _context.Artists.Add(newArtist);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Thêm nghệ sĩ thành công!",
                    artist = newArtist
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Có lỗi xảy ra khi thêm nghệ sĩ!",
                    error = ex.Message
                });
            }
        }

        //Sửa thông tin nghệ sĩ(Chỉ Admin)
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UpdateArtist(
    int id,
    [FromForm] string name,
    [FromForm] string bio,
    IFormFile? imageFile = null)
        {
            try
            {
                var artist = await _context.Artists.FindAsync(id);
                if (artist == null)
                    return NotFound("Không tìm thấy nghệ sĩ.");

                // Cập nhật thông tin cơ bản
                artist.Name = name;
                artist.Bio = bio ?? string.Empty;

                // Xử lý file ảnh mới nếu có
                if (imageFile != null)
                {
                    // Xóa file ảnh cũ
                    var oldImagePath = Path.Combine(
                        Directory.GetCurrentDirectory(),
                        "wwwroot",
                        artist.ImageUrl.TrimStart('/')
                    );
                    if (System.IO.File.Exists(oldImagePath))
                    {
                        System.IO.File.Delete(oldImagePath);
                    }

                    // Lưu file ảnh mới
                    string imageFileName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);
                    var imageDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "data", "artists");
                    Directory.CreateDirectory(imageDirectory);
                    string imagePath = Path.Combine(imageDirectory, imageFileName);

                    using (var stream = new FileStream(imagePath, FileMode.Create))
                    {
                        await imageFile.CopyToAsync(stream);
                    }

                    artist.ImageUrl = $"/data/artists/{imageFileName}";
                }

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Cập nhật nghệ sĩ thành công!",
                    artist = artist
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Có lỗi xảy ra khi cập nhật nghệ sĩ!",
                    error = ex.Message
                });
            }
        }

        //Xóa nghệ sĩ(Chỉ Admin)
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteArtist(int id)
        {
            try
            {
                var artist = await _context.Artists.FindAsync(id);
                if (artist == null)
                    return NotFound("Không tìm thấy nghệ sĩ.");

                // Xóa file ảnh
                if (!string.IsNullOrEmpty(artist.ImageUrl))
                {
                    var imagePath = Path.Combine(
                        Directory.GetCurrentDirectory(),
                        "wwwroot",
                        artist.ImageUrl.TrimStart('/')
                    );
                    if (System.IO.File.Exists(imagePath))
                    {
                        System.IO.File.Delete(imagePath);
                    }
                }

                _context.Artists.Remove(artist);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Đã xóa nghệ sĩ thành công!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Có lỗi xảy ra khi xóa nghệ sĩ!",
                    error = ex.Message
                });
            }
        }


        // Lấy danh sách bài hát thuộc về nghệ sĩ (Công khai)
        [HttpGet("{id}/songs")]
        public async Task<ActionResult<IEnumerable<SongDTO>>> GetSongsByArtist(int id)
        {
            var artist = await _context.Artists.FindAsync(id);
            if (artist == null)
                return NotFound("Không tìm thấy nghệ sĩ.");

            var songs = await _context.Songs
                .Where(s => s.ArtistID == id)
                .Select(s => new SongDTO
                {
                    SongID = s.SongID,
                    Title = s.Title,
                    ArtistID = s.ArtistID,
                    ArtistName = artist.Name,
                    Album = s.Album,
                    Genre = s.Genre,
                    Url = s.Url,  // Đường dẫn đến file nhạc
                    ReleaseDate = s.ReleaseDate,
                    ImageUrl = s.ImageUrl
                })
                .ToListAsync();

            return Ok(songs);
        }


    }
}
