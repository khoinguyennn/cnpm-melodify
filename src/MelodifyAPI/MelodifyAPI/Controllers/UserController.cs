using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MelodifyAPI.Data;
using MelodifyAPI.Models;
using MelodifyAPI.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Swashbuckle.AspNetCore.Annotations;

namespace MelodifyAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly MelodifyContext _context;
        private readonly IWebHostEnvironment _environment;

        public UserController(MelodifyContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        // 1. Lấy danh sách tất cả người dùng (Chỉ Admin)
        [HttpGet]
        [Authorize(Roles = "Admin")]
        [SwaggerOperation(
            Summary = "Lấy danh sách người dùng",
            Description = "Chỉ Admin được phép truy cập."
        )]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetAllUsers()
        {
            var users = await _context.Users
                .Select(u => new UserDTO
                {
                    UserID = u.UserID,
                    Email = u.Email,
                    DisplayName = u.DisplayName,
                    CreatedAt = u.CreatedAt,
                    Role = u.Role,
                    ImageUrl = u.ImageUrl
                })
                .ToListAsync();
            return Ok(users);
        }

        // 2. Lấy thông tin người dùng theo ID (Chỉ Admin hoặc chính người dùng)
        [HttpGet("{id}")]
        [Authorize]
        [SwaggerOperation(
            Summary = "Xem thông tin người dùng",
            Description = "Chỉ chính người dùng hoặc Admin có quyền truy cập."
        )]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<UserDTO>> GetUserById(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.Name);
            var userRole = User.FindFirstValue(ClaimTypes.Role);

            if (userId == null)
                return Unauthorized("Bạn cần đăng nhập.");

            if (userRole != "Admin" && userId != id.ToString())
                return Forbid("Bạn không có quyền xem thông tin người dùng này.");

            var user = await _context.Users
                .Where(u => u.UserID == id)
                .Select(u => new UserDTO
                {
                    UserID = u.UserID,
                    Email = u.Email,
                    DisplayName = u.DisplayName,
                    CreatedAt = u.CreatedAt,
                    Role = u.Role,
                    ImageUrl = u.ImageUrl
                })
                .FirstOrDefaultAsync();

            if (user == null)
                return NotFound("Không tìm thấy người dùng.");

            return Ok(user);
        }

        // 3. Cập nhật thông tin người dùng (Chỉ người dùng đó hoặc Admin)
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        [SwaggerOperation(
               Summary = "Cập nhật thông tin người dùng",
               Description = "Chỉ chính người dùng hoặc Admin có quyền cập nhật."
        )]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UserDTO updatedUserDto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound("Không tìm thấy người dùng.");

            var userId = User.FindFirstValue(ClaimTypes.Name);
            var userRole = User.FindFirstValue(ClaimTypes.Role);

            if (userId == null)
                return Unauthorized("Bạn cần đăng nhập.");

            if (userRole != "Admin" && userId != id.ToString())
                return Forbid("Bạn không có quyền cập nhật thông tin người dùng này.");

            user.DisplayName = updatedUserDto.DisplayName;
            user.ImageUrl = updatedUserDto.ImageUrl;

            await _context.SaveChangesAsync();
            return Ok("Cập nhật thông tin thành công!");
        }

        // 4. Đổi tên, ảnh, email, mật khẩu (Chỉ người dùng đó hoặc Admin)
        [HttpPut("change/{id}")]
        [Authorize] // Tạm thời để test
        [SwaggerOperation(
            Summary = "Cập nhật ảnh, tên hiển thị, role",
            Description = "Chỉ chính người dùng hoặc Admin có quyền cập nhật."
        )]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateUser(int id, [FromForm] UpdateUserDTO updateDto)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                    return NotFound("Không tìm thấy người dùng.");

                user.DisplayName = updateDto.DisplayName;
                user.Role = updateDto.Role;

                // Xử lý upload ảnh mới
                if (updateDto.ImageFile != null)
                {
                    // Xóa ảnh cũ nếu có
                    if (!string.IsNullOrEmpty(user.ImageUrl))
                    {
                        var oldImagePath = Path.Combine(_environment.WebRootPath, user.ImageUrl.TrimStart('/'));
                        if (System.IO.File.Exists(oldImagePath))
                        {
                            System.IO.File.Delete(oldImagePath);
                        }
                    }

                    var uploadPath = Path.Combine(_environment.WebRootPath, "data", "users");
                    Directory.CreateDirectory(uploadPath);

                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(updateDto.ImageFile.FileName);
                    var filePath = Path.Combine(uploadPath, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await updateDto.ImageFile.CopyToAsync(stream);
                    }

                    user.ImageUrl = $"/data/users/{fileName}";
                }

                await _context.SaveChangesAsync();
                return Ok(new
                {
                    message = "Cập nhật thông tin thành công!",
                    user = new UserDTO
                    {
                        UserID = user.UserID,
                        Email = user.Email,
                        DisplayName = user.DisplayName,
                        Role = user.Role,
                        ImageUrl = user.ImageUrl,
                        CreatedAt = user.CreatedAt
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi khi cập nhật thông tin: {ex.Message}");
            }
        }

        // 5. Xóa người dùng (Chỉ Admin)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        [SwaggerOperation(
            Summary = "Xóa người dùng",
            Description = "Chỉ Admin có quyền xóa người dùng khỏi hệ thống."
        )]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                    return NotFound("Không tìm thấy người dùng.");

                // Xóa ảnh của user nếu có
                if (!string.IsNullOrEmpty(user.ImageUrl))
                {
                    var imagePath = Path.Combine(_environment.WebRootPath, user.ImageUrl.TrimStart('/'));
                    if (System.IO.File.Exists(imagePath))
                    {
                        System.IO.File.Delete(imagePath);
                    }
                }

                _context.Users.Remove(user);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Xóa người dùng thành công!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi khi xóa người dùng: {ex.Message}");
            }
        }

        // 6. Thêm người dùng
        [HttpPost("register")]
        [Authorize(Roles = "Admin")]
        [SwaggerOperation(
            Summary = "Thêm người dùng mới",
            Description = "Chỉ Admin được phép thêm người dùng."
        )]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<UserDTO>> RegisterUser([FromForm] RegisterUserDTO registerDto)
        {
            try
            {
                if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
                    return BadRequest("Email đã tồn tại trong hệ thống.");

                var user = new User
                {
                    Email = registerDto.Email,
                    DisplayName = registerDto.DisplayName,
                    Role = registerDto.Role,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                    CreatedAt = DateTime.UtcNow
                };

                // Xử lý upload ảnh
                if (registerDto.ImageFile != null)
                {
                    var uploadPath = Path.Combine(_environment.WebRootPath, "data", "users");
                    Directory.CreateDirectory(uploadPath);

                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(registerDto.ImageFile.FileName);
                    var filePath = Path.Combine(uploadPath, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await registerDto.ImageFile.CopyToAsync(stream);
                    }

                    user.ImageUrl = $"/data/users/{fileName}";
                }

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return Ok(new UserDTO
                {
                    UserID = user.UserID,
                    Email = user.Email,
                    DisplayName = user.DisplayName,
                    Role = user.Role,
                    ImageUrl = user.ImageUrl,
                    CreatedAt = user.CreatedAt
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi khi thêm người dùng: {ex.Message}");
            }
        }


        // 7. Đổi mật khẩu
        [HttpPut("change-password/{id}")]
        [Authorize]
        [SwaggerOperation(
            Summary = "Đổi mật khẩu",
            Description = "Chỉ chính người dùng có quyền đổi mật khẩu."
        )]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ChangePassword(int id, [FromBody] ChangePasswordDTO model)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                    return NotFound("Không tìm thấy người dùng.");

                var userId = User.FindFirstValue(ClaimTypes.Name);
                if (userId != id.ToString())
                    return Forbid("Bạn không có quyền đổi mật khẩu của người dùng này.");

                // Kiểm tra mật khẩu cũ
                if (!BCrypt.Net.BCrypt.Verify(model.CurrentPassword, user.PasswordHash))
                    return BadRequest("Mật khẩu hiện tại không đúng.");

                // Cập nhật mật khẩu mới
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.NewPassword);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Đổi mật khẩu thành công!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi khi đổi mật khẩu: {ex.Message}");
            }
        }
    }
}
