IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'Melodify')
BEGIN
    CREATE DATABASE [Melodify]
END
GO

USE [Melodify]
GO
/****** Object:  Table [dbo].[Artists]    Script Date: 07/04/2025 09:50:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Artists](
	[ArtistID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[Bio] [nvarchar](max) NULL,
	[ImageUrl] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[ArtistID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Artists] ON
INSERT [dbo].[Artists] ([ArtistID], [Name], [Bio], [ImageUrl]) VALUES (3, N'Sơn Tùng MTP', N'Nguyễn Thanh Tùng, thường được biết đến với nghệ danh Sơn Tùng M-TP, là một nam ca sĩ kiêm sáng tác nhạc, nhà sản xuất thu âm, rapper và diễn viên người Việt Nam. Nổi tiếng vì tầm ảnh hưởng sâu rộng đối với âm nhạc Việt Nam, anh được mệnh danh là Hoàng tử V-pop bởi Giải thưởng Âm nhạc Thế giới và BroadwayWorld.', N'/data/artists/6a3444fd-6a96-42d5-8873-da845456597f.jpg')
INSERT [dbo].[Artists] ([ArtistID], [Name], [Bio], [ImageUrl]) VALUES (4, N'Đen Vâu', N'Nguyễn Đức Cường, thường được biết đến với nghệ danh Đen hay Đen Vâu, là một nam rapper, nhạc sĩ và người dẫn chương trình người Việt Nam. Đen Vâu là một trong số ít nghệ sĩ thành công từ làn sóng underground và âm nhạc indie của Việt Nam.', N'/data/artists/c9050500-2b2d-4989-96d7-73cdee6eb10c.jpg')
INSERT [dbo].[Artists] ([ArtistID], [Name], [Bio], [ImageUrl]) VALUES (5, N'HIEUTHUHAI', N'Trần Minh Hiếu, thường được biết đến với nghệ danh Hieuthuhai, là một nam rapper và ca sĩ kiêm sáng tác nhạc người Việt Nam. Anh là thành viên của tổ đội Gerdnang. Anh bắt đầu trở nên nổi tiếng sau khi tham gia chương trình Thế giới Rap – King of Rap mùa đầu tiên.', N'/data/artists/9f880dcb-3268-4cb4-ba39-4fded0003a36.jfif')
INSERT [dbo].[Artists] ([ArtistID], [Name], [Bio], [ImageUrl]) VALUES (6, N'Vũ', N'Hoàng Thái Vũ, thường được biết đến với nghệ danh Vũ, là một nam ca sĩ kiêm nhạc sĩ sáng tác ca khúc người Việt Nam. Sinh ra trong gia đình có bố là quân nhân và mẹ là giáo viên, Vũ thường đăng tải các sáng tác của mình trên Soundcloud.', N'/data/artists/25e9525d-1ea8-4c40-8a14-bf0bdf4bb5c1.jpg')
INSERT [dbo].[Artists] ([ArtistID], [Name], [Bio], [ImageUrl]) VALUES (7, N'Dan Dan', N'No information', N'/data/artists/e4bdd052-d8bb-459b-94a5-f9e4fa960449.JPG')
INSERT [dbo].[Artists] ([ArtistID], [Name], [Bio], [ImageUrl]) VALUES (12, N'Khiem', N'No information', N'/data/artists/92bea955-0dd2-4d54-b501-a5f3a9e2250b.jpg')
INSERT [dbo].[Artists] ([ArtistID], [Name], [Bio], [ImageUrl]) VALUES (13, N'MCK', N'Nghiêm Vũ Hoàng Long, thường được biết đến với nghệ danh MCK, là một nam rapper và ca sĩ kiêm sáng tác nhạc người Việt Nam. Năm 2020, anh trở nên nổi tiếng khi tham dự và đi tới vòng chung kết ở mùa đầu tiên của cuộc thi truyền hình Rap Việt.', N'/data/artists/308ce054-58ca-4120-a9e9-95937f72aba3.jpg')
SET IDENTITY_INSERT [dbo].[Artists] OFF
/****** Object:  Table [dbo].[__EFMigrationsHistory]    Script Date: 07/04/2025 09:50:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[__EFMigrationsHistory](
	[MigrationId] [nvarchar](150) NOT NULL,
	[ProductVersion] [nvarchar](32) NOT NULL,
 CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY CLUSTERED 
(
	[MigrationId] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 07/04/2025 09:50:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Users](
	[UserID] [int] IDENTITY(1,1) NOT NULL,
	[Email] [nvarchar](100) NOT NULL,
	[PasswordHash] [nvarchar](255) NOT NULL,
	[DisplayName] [nvarchar](100) NOT NULL,
	[CreatedAt] [datetime] NULL,
	[Role] [varchar](50) NOT NULL,
	[ImageUrl] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[UserID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[Email] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
SET IDENTITY_INSERT [dbo].[Users] ON
INSERT [dbo].[Users] ([UserID], [Email], [PasswordHash], [DisplayName], [CreatedAt], [Role], [ImageUrl]) VALUES (1, N'tramkhoinguyen27122@gmail.com', N'$2a$11$jg8PWQE2wbyYEBk/0GANweqewVO35bWmuCWAQBGiBOxBiX8.LrV6.', N'Trầm Khôi Nguyên', CAST(0x0000B28400A5C7A0 AS DateTime), N'Admin', N'/data/users/95599e50-33cc-4774-9763-4c3944dddb9e.jpg')
INSERT [dbo].[Users] ([UserID], [Email], [PasswordHash], [DisplayName], [CreatedAt], [Role], [ImageUrl]) VALUES (3, N'test@gmail.com', N'$2a$11$x8zqxDOGBZX5CZGdUv7vlew6C3ZWsEsMko0za4HdIi.n3qkPxfrBe', N'Test 2', CAST(0x0000B2A1007A1323 AS DateTime), N'User', N'/data/users/a3ea86e2-8ee5-47c9-8f4b-e8cf363d1d6c.jpg')
INSERT [dbo].[Users] ([UserID], [Email], [PasswordHash], [DisplayName], [CreatedAt], [Role], [ImageUrl]) VALUES (4, N'nguyenkhoi@gmail.com', N'$2a$11$KlFUeOShsarrl2/zkgprg.UReMEJAeERArfpRiuvdmLJqfs8eVRXi', N'Nguyên Khôi', CAST(0x0000B2A10097407F AS DateTime), N'User', N'/data/users/864a0d33-f9cb-4961-aecb-24eda1a99d97.png')
INSERT [dbo].[Users] ([UserID], [Email], [PasswordHash], [DisplayName], [CreatedAt], [Role], [ImageUrl]) VALUES (5, N'nguyenkhoi2@gmail.com', N'$2a$11$pE/X7tgVje3CdZoxHLbBu.RMH3QaM6p9hby8OkH6XLhbMOM2Y8sqG', N'Nguyên Khôi 2', CAST(0x0000B2A100975C24 AS DateTime), N'User', NULL)
INSERT [dbo].[Users] ([UserID], [Email], [PasswordHash], [DisplayName], [CreatedAt], [Role], [ImageUrl]) VALUES (6, N'nguyenkhoi23@gmail.com', N'$2a$11$sYxu4LDF1d4H/aabfy46u.F9F672BFKVN5DCSI41AI7ra0Jskze62', N'Nguyên Khôi', CAST(0x0000B2A1009765A1 AS DateTime), N'User', NULL)
INSERT [dbo].[Users] ([UserID], [Email], [PasswordHash], [DisplayName], [CreatedAt], [Role], [ImageUrl]) VALUES (7, N'nguyenkhoi233@gmail.com', N'$2a$11$1BTnZEHx7gIl6Sh7m0ZHj.6TkvJmM0OAZ4zv3G55kk4aiNqo8moTC', N'Nguyên Khôi', CAST(0x0000B2A100978B13 AS DateTime), N'User', NULL)
INSERT [dbo].[Users] ([UserID], [Email], [PasswordHash], [DisplayName], [CreatedAt], [Role], [ImageUrl]) VALUES (12, N'helloword@gmail.com', N'$2a$11$IZtYS0oxfUrTuhkucTMfvOAUNQPi5/c1oRvJB.GOjlJUj4t0Vmfj6', N'Test', CAST(0x0000B2AA0069CD84 AS DateTime), N'User', NULL)
INSERT [dbo].[Users] ([UserID], [Email], [PasswordHash], [DisplayName], [CreatedAt], [Role], [ImageUrl]) VALUES (13, N'hellodev@gmail.com', N'$2a$11$jtvKxiwqZlYJZtkA9.kLcunsqB3b23PltxSk6802mElPJKm2AB1xm', N'Hello Dev', CAST(0x0000B2AA006A06B3 AS DateTime), N'User', N'/data/users/32a7e25e-5a0c-4071-9ccd-8ee00f398f74.jpg')
INSERT [dbo].[Users] ([UserID], [Email], [PasswordHash], [DisplayName], [CreatedAt], [Role], [ImageUrl]) VALUES (14, N'nguyenthanh@gmail.com', N'$2a$11$NAkUTkHhCxfVcY0HZenz7O6zNkq17j9KLmhUSaoEDXm4wtGmBalYe', N'Nguyễn Thành', CAST(0x0000B2D600CE0621 AS DateTime), N'User', NULL)
INSERT [dbo].[Users] ([UserID], [Email], [PasswordHash], [DisplayName], [CreatedAt], [Role], [ImageUrl]) VALUES (15, N'nguyenvanan@gmail.com', N'$2a$11$aHu1UnLT.yJ2DUEo5sUUV.i9fwbqwCZBFEBk8CWRhtlEgzyB6/gJu', N'Nguyễn Văn An', CAST(0x0000B3000042F3EB AS DateTime), N'User', N'/data/users/21595353-5f6b-46c6-ace0-f17747587d56.jpg')
INSERT [dbo].[Users] ([UserID], [Email], [PasswordHash], [DisplayName], [CreatedAt], [Role], [ImageUrl]) VALUES (16, N'khoinguyen2777@gmail.com', N'$2a$11$qbXkKQ6a2dGn8CtM4xP6ieq8fiXFjIpQxBF9D4gjfyPuSxHa4PuA.', N'Khôi Nguyên', CAST(0x0000B30300816A8E AS DateTime), N'User', NULL)
INSERT [dbo].[Users] ([UserID], [Email], [PasswordHash], [DisplayName], [CreatedAt], [Role], [ImageUrl]) VALUES (17, N'nhathuy@gmail.com', N'$2a$11$jtcp6T1grW7WCkLe67bxUuZ7io/xD2bBsyNMjCxj5YJqXfoNiIcxe', N'Nguyễn Đình Nhật Huy', CAST(0x0000B30D00849F1D AS DateTime), N'Admin', N'/data/users/63ac5950-a332-446e-984a-561c5265f68f.jpg')
SET IDENTITY_INSERT [dbo].[Users] OFF
/****** Object:  Table [dbo].[Songs]    Script Date: 07/04/2025 09:50:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Songs](
	[SongID] [int] IDENTITY(1,1) NOT NULL,
	[Title] [nvarchar](100) NOT NULL,
	[ArtistID] [int] NULL,
	[Album] [nvarchar](100) NULL,
	[Genre] [nvarchar](50) NULL,
	[Url] [nvarchar](255) NOT NULL,
	[ReleaseDate] [date] NULL,
	[ImageUrl] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[SongID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Songs] ON
INSERT [dbo].[Songs] ([SongID], [Title], [ArtistID], [Album], [Genre], [Url], [ReleaseDate], [ImageUrl]) VALUES (6, N'test hihi', 3, N'MTP', N'Pop', N'/data/audio/f60d6385-cc7c-4ded-9468-81d78cd9a3fb.mp3', CAST(0xFA470B00 AS Date), N'/data/img/4e1a390a-2e85-4cdb-bd51-53fee30cfc36.jpg')
INSERT [dbo].[Songs] ([SongID], [Title], [ArtistID], [Album], [Genre], [Url], [ReleaseDate], [ImageUrl]) VALUES (7, N'Ai Cũng Phải Bắt Đầu Từ Đâu Đó', 5, N'Ai Cũng Phải Bắt Đầu Từ Đâu Đó', N'Rap', N'/data/audio/02314dd1-3d45-43eb-b774-08aa17170817.mp3', CAST(0xFC470B00 AS Date), N'/data/img/c8dc6d92-1465-4d9e-a825-8b8fe737e245.jfif')
INSERT [dbo].[Songs] ([SongID], [Title], [ArtistID], [Album], [Genre], [Url], [ReleaseDate], [ImageUrl]) VALUES (8, N'The History Of Future', 7, N'The History Of Future', N'EDM', N'/data/audio/65fac12c-6766-4492-9e99-089285fe0441.mp3', CAST(0xFD470B00 AS Date), N'/data/img/d1d21052-2c19-43a1-b430-3823f83ddd49.JPG')
INSERT [dbo].[Songs] ([SongID], [Title], [ArtistID], [Album], [Genre], [Url], [ReleaseDate], [ImageUrl]) VALUES (17, N'Nhạc test', 3, N'sdasd', N'V-Pop', N'/data/audio/5bbf9eb6-0d96-4505-9601-9c1c9737616e.mp3', CAST(0x05480B00 AS Date), N'/data/img/e22456b2-dbd9-44a2-8b43-6fee18f37ff4.JPG')
INSERT [dbo].[Songs] ([SongID], [Title], [ArtistID], [Album], [Genre], [Url], [ReleaseDate], [ImageUrl]) VALUES (18, N'Anh Cũng Muốn Là Đứa Trẻ', 12, N'Anh Cũng Muốn Là Đứa Trẻ', N'Indie', N'/data/audio/82b1ab0b-bed3-4555-b5c3-46ad0c4e951b.mp3', CAST(0x1D480B00 AS Date), N'/data/img/7073d405-8df0-4f4e-9fcd-27da164092f9.jpg')
INSERT [dbo].[Songs] ([SongID], [Title], [ArtistID], [Album], [Genre], [Url], [ReleaseDate], [ImageUrl]) VALUES (19, N'Test postman 1', 3, N'Test postman', N'Pop', N'/data/audio/fc3fc73e-ba65-433f-9de5-c6d1f8865fa2.mp3', CAST(0x2B480B00 AS Date), N'/data/img/b2ead15d-d6e0-4e1b-ae11-fa11f5f8fa5d.jpg')
SET IDENTITY_INSERT [dbo].[Songs] OFF
/****** Object:  Table [dbo].[Playlists]    Script Date: 07/04/2025 09:50:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Playlists](
	[PlaylistID] [int] IDENTITY(1,1) NOT NULL,
	[UserID] [int] NULL,
	[Title] [nvarchar](100) NOT NULL,
	[Description] [nvarchar](255) NULL,
	[CreatedAt] [datetime] NULL,
	[ImageUrl] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[PlaylistID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Playlists] ON
INSERT [dbo].[Playlists] ([PlaylistID], [UserID], [Title], [Description], [CreatedAt], [ImageUrl]) VALUES (1, 1, N'My playlist 1', N'hihihihihi', CAST(0x0000B2E500E5718B AS DateTime), N'/data/playlist/3eaa286b-b01c-4845-b380-3e61053b2e6c.png')
INSERT [dbo].[Playlists] ([PlaylistID], [UserID], [Title], [Description], [CreatedAt], [ImageUrl]) VALUES (4, 15, N'An Playlist', N'hihi', CAST(0x0000B30000B81C42 AS DateTime), N'/data/playlist/c3d8f450-45ba-4dc1-a56d-91d3a8a28adf.png')
INSERT [dbo].[Playlists] ([PlaylistID], [UserID], [Title], [Description], [CreatedAt], [ImageUrl]) VALUES (12, 17, N'Huy Playlist''s', N'sdsd', CAST(0x0000B30D00F86F53 AS DateTime), N'/uploads/playlists/0c247745-b65a-471e-8205-2e2b9da6ab61_capybara-tvu.jpg')
INSERT [dbo].[Playlists] ([PlaylistID], [UserID], [Title], [Description], [CreatedAt], [ImageUrl]) VALUES (13, 1, N'string', N'string', CAST(0x0000B30E00BE12C6 AS DateTime), N'/app-asset/img/default-playlist.jpg')
SET IDENTITY_INSERT [dbo].[Playlists] OFF
/****** Object:  Table [dbo].[Follows]    Script Date: 07/04/2025 09:50:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Follows](
	[UserID] [int] NULL,
	[ArtistID] [int] NULL,
	[FollowedAt] [datetime] NULL,
	[FollowID] [int] IDENTITY(1,1) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[FollowID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Follows] ON
INSERT [dbo].[Follows] ([UserID], [ArtistID], [FollowedAt], [FollowID]) VALUES (14, 3, CAST(0x0000B2D700A1E015 AS DateTime), 5)
INSERT [dbo].[Follows] ([UserID], [ArtistID], [FollowedAt], [FollowID]) VALUES (1, 13, CAST(0x0000B2D7012EBCA4 AS DateTime), 7)
INSERT [dbo].[Follows] ([UserID], [ArtistID], [FollowedAt], [FollowID]) VALUES (1, 4, CAST(0x0000B2E100FB62E4 AS DateTime), 8)
INSERT [dbo].[Follows] ([UserID], [ArtistID], [FollowedAt], [FollowID]) VALUES (1, 7, CAST(0x0000B30000B4EECC AS DateTime), 9)
INSERT [dbo].[Follows] ([UserID], [ArtistID], [FollowedAt], [FollowID]) VALUES (15, 3, CAST(0x0000B30000B7CA5A AS DateTime), 10)
SET IDENTITY_INSERT [dbo].[Follows] OFF
/****** Object:  Table [dbo].[Favorites]    Script Date: 07/04/2025 09:50:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Favorites](
	[FavoriteID] [int] IDENTITY(1,1) NOT NULL,
	[UserID] [int] NOT NULL,
	[SongID] [int] NOT NULL,
	[FavoritedAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[FavoriteID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Favorites] ON
INSERT [dbo].[Favorites] ([FavoriteID], [UserID], [SongID], [FavoritedAt]) VALUES (7, 1, 7, CAST(0x0000B2D7003CB133 AS DateTime))
INSERT [dbo].[Favorites] ([FavoriteID], [UserID], [SongID], [FavoritedAt]) VALUES (12, 1, 18, CAST(0x0000B2D700B93229 AS DateTime))
INSERT [dbo].[Favorites] ([FavoriteID], [UserID], [SongID], [FavoritedAt]) VALUES (14, 1, 8, CAST(0x0000B2EF0056A34C AS DateTime))
INSERT [dbo].[Favorites] ([FavoriteID], [UserID], [SongID], [FavoritedAt]) VALUES (15, 15, 8, CAST(0x0000B30000470DC2 AS DateTime))
INSERT [dbo].[Favorites] ([FavoriteID], [UserID], [SongID], [FavoritedAt]) VALUES (17, 17, 7, CAST(0x0000B30D008529F1 AS DateTime))
INSERT [dbo].[Favorites] ([FavoriteID], [UserID], [SongID], [FavoritedAt]) VALUES (19, 1, 6, CAST(0x0000B30E003ACBBC AS DateTime))
SET IDENTITY_INSERT [dbo].[Favorites] OFF
/****** Object:  Table [dbo].[Playlist_Songs]    Script Date: 07/04/2025 09:50:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Playlist_Songs](
	[PlaylistSongID] [int] IDENTITY(1,1) NOT NULL,
	[PlaylistID] [int] NULL,
	[SongID] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[PlaylistSongID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Playlist_Songs] ON
INSERT [dbo].[Playlist_Songs] ([PlaylistSongID], [PlaylistID], [SongID]) VALUES (4, 1, 7)
INSERT [dbo].[Playlist_Songs] ([PlaylistSongID], [PlaylistID], [SongID]) VALUES (7, 1, 6)
INSERT [dbo].[Playlist_Songs] ([PlaylistSongID], [PlaylistID], [SongID]) VALUES (10, 1, 17)
INSERT [dbo].[Playlist_Songs] ([PlaylistSongID], [PlaylistID], [SongID]) VALUES (16, 1, 18)
INSERT [dbo].[Playlist_Songs] ([PlaylistSongID], [PlaylistID], [SongID]) VALUES (17, 4, 7)
INSERT [dbo].[Playlist_Songs] ([PlaylistSongID], [PlaylistID], [SongID]) VALUES (20, 12, 7)
SET IDENTITY_INSERT [dbo].[Playlist_Songs] OFF
/****** Object:  Default [DF__Favorites__Favor__398D8EEE]    Script Date: 07/04/2025 09:50:30 ******/
ALTER TABLE [dbo].[Favorites] ADD  DEFAULT (getdate()) FOR [FavoritedAt]
GO
/****** Object:  Default [DF__Follows__Followe__1CF15040]    Script Date: 07/04/2025 09:50:30 ******/
ALTER TABLE [dbo].[Follows] ADD  DEFAULT (getdate()) FOR [FollowedAt]
GO
/****** Object:  Default [DF__Playlists__Creat__117F9D94]    Script Date: 07/04/2025 09:50:30 ******/
ALTER TABLE [dbo].[Playlists] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
/****** Object:  Default [DF__Users__CreatedAt__0425A276]    Script Date: 07/04/2025 09:50:30 ******/
ALTER TABLE [dbo].[Users] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
/****** Object:  Default [DF__Users__Role__34C8D9D1]    Script Date: 07/04/2025 09:50:30 ******/
ALTER TABLE [dbo].[Users] ADD  DEFAULT ('User') FOR [Role]
GO
/****** Object:  ForeignKey [FK__Favorites__SongI__3B75D760]    Script Date: 07/04/2025 09:50:30 ******/
ALTER TABLE [dbo].[Favorites]  WITH CHECK ADD FOREIGN KEY([SongID])
REFERENCES [dbo].[Songs] ([SongID])
GO
/****** Object:  ForeignKey [FK__Favorites__UserI__3A81B327]    Script Date: 07/04/2025 09:50:30 ******/
ALTER TABLE [dbo].[Favorites]  WITH CHECK ADD FOREIGN KEY([UserID])
REFERENCES [dbo].[Users] ([UserID])
GO
/****** Object:  ForeignKey [FK__Follows__ArtistI__1ED998B2]    Script Date: 07/04/2025 09:50:30 ******/
ALTER TABLE [dbo].[Follows]  WITH CHECK ADD FOREIGN KEY([ArtistID])
REFERENCES [dbo].[Artists] ([ArtistID])
GO
/****** Object:  ForeignKey [FK__Follows__UserID__1DE57479]    Script Date: 07/04/2025 09:50:30 ******/
ALTER TABLE [dbo].[Follows]  WITH CHECK ADD FOREIGN KEY([UserID])
REFERENCES [dbo].[Users] ([UserID])
GO
/****** Object:  ForeignKey [FK__Playlist___Playl__173876EA]    Script Date: 07/04/2025 09:50:30 ******/
ALTER TABLE [dbo].[Playlist_Songs]  WITH CHECK ADD FOREIGN KEY([PlaylistID])
REFERENCES [dbo].[Playlists] ([PlaylistID])
GO
/****** Object:  ForeignKey [FK__Playlist___SongI__182C9B23]    Script Date: 07/04/2025 09:50:30 ******/
ALTER TABLE [dbo].[Playlist_Songs]  WITH CHECK ADD FOREIGN KEY([SongID])
REFERENCES [dbo].[Songs] ([SongID])
GO
/****** Object:  ForeignKey [FK__Playlists__UserI__1273C1CD]    Script Date: 07/04/2025 09:50:30 ******/
ALTER TABLE [dbo].[Playlists]  WITH CHECK ADD FOREIGN KEY([UserID])
REFERENCES [dbo].[Users] ([UserID])
GO
/****** Object:  ForeignKey [FK__Songs__ArtistID__0CBAE877]    Script Date: 07/04/2025 09:50:30 ******/
ALTER TABLE [dbo].[Songs]  WITH CHECK ADD FOREIGN KEY([ArtistID])
REFERENCES [dbo].[Artists] ([ArtistID])
GO
