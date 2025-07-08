using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MelodifyAPI.Data;
using MelodifyAPI.Models;
using MelodifyAPI.DTOs;
using Microsoft.EntityFrameworkCore;
using System.IO;
using Microsoft.AspNetCore.Http;
using Swashbuckle.AspNetCore.Annotations;

namespace MelodifyAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SongsController : ControllerBase
    {
        private readonly MelodifyContext _context;

        public SongsController(MelodifyContext context)
        {
            _context = context;
        }

        // 1. Lấy danh sách tất cả bài hát (Công khai)
        [HttpGet]
        [SwaggerOperation(Summary = "Lấy tất cả bài hát", Description = "Trả về danh sách bài hát công khai")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<SongDTO>>> GetAllSongs()
        {
            var songs = await _context.Songs
                .Include(s => s.Artist) // Load thông tin Artist
                .Select(s => new SongDTO
                {
                    SongID = s.SongID,
                    Title = s.Title,
                    ArtistID = s.Artist != null ? s.Artist.ArtistID : 0, // Kiểm tra null tránh lỗi
                    ArtistName = s.Artist != null ? s.Artist.Name : "Unknown", // Trả về tên nghệ sĩ
                    Album = s.Album,
                    Genre = s.Genre,
                    Url = s.Url,
                    ReleaseDate = s.ReleaseDate,
                    ImageUrl = s.ImageUrl
                })
                .ToListAsync();

            return Ok(songs);
        }


        // 2. Lấy chi tiết một bài hát theo ID (Công khai)
        [HttpGet("{id}")]
        [SwaggerOperation(Summary = "Lấy chi tiết bài hát", Description = "Trả về thông tin bài hát theo ID")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<SongDTO>> GetSongById(int id)
        {
            var song = await _context.Songs
                .Include(s => s.Artist) // Load thông tin Artist
                .Where(s => s.SongID == id)
                .Select(s => new SongDTO
                {
                    SongID = s.SongID,
                    Title = s.Title,
                    ArtistID = s.Artist != null ? s.Artist.ArtistID : 0, // Kiểm tra null
                    ArtistName = s.Artist != null ? s.Artist.Name : "Unknown", // Trả về tên nghệ sĩ
                    Album = s.Album,
                    Genre = s.Genre,
                    Url = s.Url,
                    ReleaseDate = s.ReleaseDate,
                    ImageUrl = s.ImageUrl
                })
                .FirstOrDefaultAsync();

            if (song == null)
                return NotFound("Không tìm thấy bài hát.");

            return Ok(song);
        }


        // 3. Thêm bài hát (Chỉ Admin)
        [Authorize(Roles = "Admin")]
        [HttpPost("add")]
        [Consumes("multipart/form-data")] // Quan trọng: Xác định kiểu dữ liệu gửi lên
        [SwaggerOperation(Summary = "Thêm bài hát", Description = "Chỉ Admin mới có thể thêm bài hát mới")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> AddSong(
            [FromForm] string title,
            [FromForm] int artistId,
            [FromForm] string album,
            [FromForm] string genre,
            [FromForm] DateTime releaseDate,
            IFormFile audioFile,
            IFormFile imageFile)
        {
            try
            {
                // Kiểm tra dữ liệu đầu vào
                if (string.IsNullOrEmpty(title))
                    return BadRequest("Tiêu đề bài hát không được để trống!");

                // Kiểm tra files
                if (audioFile == null || imageFile == null)
                    return BadRequest("Vui lòng upload đầy đủ file audio và hình ảnh!");

                // Kiểm tra định dạng file
                if (!audioFile.ContentType.StartsWith("audio/"))
                    return BadRequest("File audio không đúng định dạng!");

                if (!imageFile.ContentType.StartsWith("image/"))
                    return BadRequest("File ảnh không đúng định dạng!");

                // Kiểm tra ArtistID có tồn tại không
                var artist = await _context.Artists.FindAsync(artistId);
                if (artist == null)
                    return NotFound($"Không tìm thấy nghệ sĩ với ID: {artistId}!");

                // Tạo tên file unique
                string audioFileName = Guid.NewGuid().ToString() + Path.GetExtension(audioFile.FileName);
                string imageFileName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);

                // Đường dẫn thư mục lưu file
                var audioDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "data", "audio");
                var imageDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "data", "img");

                // Tạo thư mục nếu chưa tồn tại
                Directory.CreateDirectory(audioDirectory);
                Directory.CreateDirectory(imageDirectory);

                // Đường dẫn đầy đủ của file
                string audioPath = Path.Combine(audioDirectory, audioFileName);
                string imagePath = Path.Combine(imageDirectory, imageFileName);

                // Lưu files
                using (var audioStream = new FileStream(audioPath, FileMode.Create))
                {
                    await audioFile.CopyToAsync(audioStream);
                }
                using (var imageStream = new FileStream(imagePath, FileMode.Create))
                {
                    await imageFile.CopyToAsync(imageStream);
                }

                // Tạo đường dẫn tương đối để lưu vào database
                string audioUrl = $"/data/audio/{audioFileName}";
                string imageUrl = $"/data/img/{imageFileName}";

                // Tạo đối tượng Song mới
                var newSong = new Song
                {
                    Title = title,
                    ArtistID = artistId,
                    Artist = artist,
                    Album = album ?? string.Empty,
                    Genre = genre,
                    Url = audioUrl,
                    ReleaseDate = releaseDate,
                    ImageUrl = imageUrl
                };

                _context.Songs.Add(newSong);
                await _context.SaveChangesAsync();

                // Trả về thông tin bài hát đã thêm
                return Ok(new
                {
                    Message = "Thêm bài hát thành công!",
                    Song = new
                    {
                        newSong.SongID,
                        newSong.Title,
                        newSong.ArtistID,
                        ArtistName = artist.Name,
                        newSong.Album,
                        newSong.Genre,
                        newSong.Url,
                        newSong.ReleaseDate,
                        newSong.ImageUrl
                    }
                });
            }
            catch (Exception ex)
            {
                // Log lỗi chi tiết
                Console.WriteLine($"Error in AddSong: {ex}");
                return StatusCode(500, new { Message = "Có lỗi xảy ra khi thêm bài hát!", Error = ex.Message });
            }
        }

        // 4. Sửa bài hát (Chỉ Admin)
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        [Consumes("multipart/form-data")]
        [SwaggerOperation(
            Summary = "Cập nhật bài hát",
            Description = "Chỉ Admin mới có quyền cập nhật thông tin bài hát. Có thể cập nhật title, artistId, album, genre, releaseDate, audio và image."
        )]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateSong(
     int id,
     [FromForm] string title,
     [FromForm] int artistId,
     [FromForm] string album,
     [FromForm] string genre,
     [FromForm] DateTime releaseDate,
     IFormFile? audioFile = null,
     IFormFile? imageFile = null)
        {
            try
            {
                var song = await _context.Songs.FindAsync(id);
                if (song == null)
                    return NotFound(new { message = "Không tìm thấy bài hát." });

                // Kiểm tra artist tồn tại
                var artist = await _context.Artists.FindAsync(artistId);
                if (artist == null)
                    return NotFound(new { message = "Không tìm thấy nghệ sĩ." });

                // Cập nhật thông tin cơ bản
                song.Title = title;
                song.ArtistID = artistId;
                song.Album = album ?? string.Empty;
                song.Genre = genre;
                song.ReleaseDate = releaseDate;

                // Xử lý file audio mới nếu có
                if (audioFile != null)
                {
                    // Xóa file audio cũ
                    var oldAudioPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", song.Url.TrimStart('/'));
                    if (System.IO.File.Exists(oldAudioPath))
                    {
                        System.IO.File.Delete(oldAudioPath);
                    }

                    // Lưu file audio mới
                    string audioFileName = Guid.NewGuid().ToString() + Path.GetExtension(audioFile.FileName);
                    var audioDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "data", "audio");
                    Directory.CreateDirectory(audioDirectory);
                    string audioPath = Path.Combine(audioDirectory, audioFileName);
                    using (var stream = new FileStream(audioPath, FileMode.Create))
                    {
                        await audioFile.CopyToAsync(stream);
                    }
                    song.Url = $"/data/audio/{audioFileName}";
                }

                // Xử lý file image mới nếu có
                if (imageFile != null)
                {
                    // Xóa file image cũ
                    var oldImagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", song.ImageUrl.TrimStart('/'));
                    if (System.IO.File.Exists(oldImagePath))
                    {
                        System.IO.File.Delete(oldImagePath);
                    }

                    // Lưu file image mới
                    string imageFileName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);
                    var imageDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "data", "img");
                    Directory.CreateDirectory(imageDirectory);
                    string imagePath = Path.Combine(imageDirectory, imageFileName);
                    using (var stream = new FileStream(imagePath, FileMode.Create))
                    {
                        await imageFile.CopyToAsync(stream);
                    }
                    song.ImageUrl = $"/data/img/{imageFileName}";
                }

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Cập nhật bài hát thành công!",
                    song = new
                    {
                        song.SongID,
                        song.Title,
                        song.ArtistID,
                        ArtistName = artist.Name,
                        song.Album,
                        song.Genre,
                        song.Url,
                        song.ReleaseDate,
                        song.ImageUrl
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Có lỗi xảy ra khi cập nhật bài hát!",
                    error = ex.Message
                });
            }
        }

        // 5. Xóa bài hát (Chỉ Admin)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        [SwaggerOperation(
            Summary = "Xóa bài hát",
            Description = "Xóa bài hát theo ID, bao gồm cả các liên kết Playlist_Songs, Favorites và file audio/image vật lý. Chỉ Admin có quyền thực hiện."
        )]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<IActionResult> DeleteSong(int id)
        {
            using var transaction = _context.Database.BeginTransaction();
            try
            {
                // Tìm bài hát và load các related entities
                var song = await _context.Songs
                    .Include(s => s.Playlist_Songs)  // Load playlist references
                    .Include(s => s.Favorites)       // Load favorite references
                    .FirstOrDefaultAsync(s => s.SongID == id);

                if (song == null)
                    return NotFound(new { message = "Không tìm thấy bài hát." });

                // 1. Xóa references trong Playlist_Songs
                if (song.Playlist_Songs != null && song.Playlist_Songs.Any())
                {
                    _context.Playlist_Songs.RemoveRange(song.Playlist_Songs);
                }

                // 2. Xóa references trong Favorites
                if (song.Favorites != null && song.Favorites.Any())
                {
                    _context.Favorites.RemoveRange(song.Favorites);
                }

                // 3. Xóa files
                try
                {
                    string audioPath = Path.Combine(
                        Directory.GetCurrentDirectory(),
                        "wwwroot",
                        song.Url.TrimStart('/')
                    );

                    string imagePath = Path.Combine(
                        Directory.GetCurrentDirectory(),
                        "wwwroot",
                        song.ImageUrl.TrimStart('/')
                    );

                    // Thêm System.IO. phía trước File
                    if (System.IO.File.Exists(audioPath)) System.IO.File.Delete(audioPath);
                    if (System.IO.File.Exists(imagePath)) System.IO.File.Delete(imagePath);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error deleting files: {ex.Message}");
                }

                // 4. Xóa bài hát
                _context.Songs.Remove(song);

                // 5. Lưu thay đổi
                await _context.SaveChangesAsync();

                // 6. Commit transaction
                await transaction.CommitAsync();

                return Ok(new
                {
                    message = "Đã xóa bài hát thành công!",
                    songId = id
                });
            }
            catch (Exception ex)
            {
                // Rollback nếu có lỗi
                await transaction.RollbackAsync();

                Console.WriteLine($"Error in DeleteSong: {ex.Message}");
                Console.WriteLine($"Inner exception: {ex.InnerException?.Message}");

                return StatusCode(500, new
                {
                    message = "Có lỗi xảy ra khi xóa bài hát!",
                    error = ex.InnerException?.Message ?? ex.Message
                });
            }
        }

        //6. Tìm kiếm bài hát
        // Tìm kiếm bài hát theo từ khóa (Title, Album, hoặc Tên Nghệ sĩ)
        [HttpGet("search")]
        [SwaggerOperation(Summary = "Tìm kiếm bài hát", Description = "Tìm kiếm theo tên bài hát, album hoặc nghệ sĩ")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<SongDTO>>> SearchSongs(string keyword)
        {
            if (string.IsNullOrWhiteSpace(keyword))
                return BadRequest("Vui lòng nhập từ khóa tìm kiếm.");

            var songs = await _context.Songs
                .Include(s => s.Artist)  // Bao gồm thông tin Nghệ sĩ
                .Where(s => s.Title.Contains(keyword)
                            || s.Album.Contains(keyword)
                            || s.Artist.Name.Contains(keyword))
                .Select(s => new SongDTO
                {
                    SongID = s.SongID,
                    Title = s.Title,
                    ArtistID = s.ArtistID,
                    ArtistName = s.Artist.Name,
                    Album = s.Album,
                    Genre = s.Genre,
                    ImageUrl = s.ImageUrl,
                    Url = s.Url
                })
                .ToListAsync();

            if (songs.Count == 0)
                return NotFound("Không tìm thấy bài hát phù hợp.");

            return Ok(songs);
        }


        //7. Phát nhạc
        // Phát nhạc theo SongID
        [HttpGet("{id}/play")]
        [SwaggerOperation(Summary = "Phát nhạc", Description = "Trả về URL bài hát để phát")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> PlaySong(int id)
        {
            var song = await _context.Songs.FindAsync(id);
            if (song == null)
                return NotFound("Không tìm thấy bài hát.");

            // Kiểm tra URL của bài hát
            if (string.IsNullOrEmpty(song.Url))
                return BadRequest("Bài hát chưa có URL phát nhạc.");

            // Trả về URL của file nhạc để ReactJS phát nhạc
            return Ok(new { Url = song.Url });
        }



        // Thêm endpoint để lấy bài hát theo thể loại
        [HttpGet("genre/{genre}")]
        [SwaggerOperation(Summary = "Lọc bài hát theo thể loại", Description = "Trả về danh sách bài hát theo thể loại")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<SongDTO>>> GetSongsByGenre(string genre)
        {
            try
            {
                var songs = await _context.Songs
                    .Include(s => s.Artist)
                    .Where(s => s.Genre.ToLower() == genre.ToLower())
                    .Select(s => new SongDTO
                    {
                        SongID = s.SongID,
                        Title = s.Title,
                        ArtistID = s.ArtistID,
                        ArtistName = s.Artist.Name,
                        Album = s.Album,
                        Genre = s.Genre,
                        ImageUrl = s.ImageUrl,
                        Url = s.Url
                    })
                    .ToListAsync();

                if (!songs.Any())
                    return NotFound($"Không tìm thấy bài hát nào thuộc thể loại {genre}");

                return Ok(songs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Có lỗi xảy ra khi lấy danh sách bài hát!", error = ex.Message });
            }
        }

    }
}
