USE [master]
GO
/****** Object:  Database [Melodify]    Script Date: 04/03/2025 20:25:14 ******/
CREATE DATABASE [Melodify] ON  PRIMARY 
( NAME = N'Melodify', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL10_50.MSSQLSERVER\MSSQL\DATA\Melodify.mdf' , SIZE = 2304KB , MAXSIZE = UNLIMITED, FILEGROWTH = 1024KB )
 LOG ON 
( NAME = N'Melodify_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL10_50.MSSQLSERVER\MSSQL\DATA\Melodify_log.LDF' , SIZE = 504KB , MAXSIZE = 2048GB , FILEGROWTH = 10%)
GO
ALTER DATABASE [Melodify] SET COMPATIBILITY_LEVEL = 100
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [Melodify].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [Melodify] SET ANSI_NULL_DEFAULT OFF
GO
ALTER DATABASE [Melodify] SET ANSI_NULLS OFF
GO
ALTER DATABASE [Melodify] SET ANSI_PADDING OFF
GO
ALTER DATABASE [Melodify] SET ANSI_WARNINGS OFF
GO
ALTER DATABASE [Melodify] SET ARITHABORT OFF
GO
ALTER DATABASE [Melodify] SET AUTO_CLOSE ON
GO
ALTER DATABASE [Melodify] SET AUTO_CREATE_STATISTICS ON
GO
ALTER DATABASE [Melodify] SET AUTO_SHRINK OFF
GO
ALTER DATABASE [Melodify] SET AUTO_UPDATE_STATISTICS ON
GO
ALTER DATABASE [Melodify] SET CURSOR_CLOSE_ON_COMMIT OFF
GO
ALTER DATABASE [Melodify] SET CURSOR_DEFAULT  GLOBAL
GO
ALTER DATABASE [Melodify] SET CONCAT_NULL_YIELDS_NULL OFF
GO
ALTER DATABASE [Melodify] SET NUMERIC_ROUNDABORT OFF
GO
ALTER DATABASE [Melodify] SET QUOTED_IDENTIFIER OFF
GO
ALTER DATABASE [Melodify] SET RECURSIVE_TRIGGERS OFF
GO
ALTER DATABASE [Melodify] SET  ENABLE_BROKER
GO
ALTER DATABASE [Melodify] SET AUTO_UPDATE_STATISTICS_ASYNC OFF
GO
ALTER DATABASE [Melodify] SET DATE_CORRELATION_OPTIMIZATION OFF
GO
ALTER DATABASE [Melodify] SET TRUSTWORTHY OFF
GO
ALTER DATABASE [Melodify] SET ALLOW_SNAPSHOT_ISOLATION OFF
GO
ALTER DATABASE [Melodify] SET PARAMETERIZATION SIMPLE
GO
ALTER DATABASE [Melodify] SET READ_COMMITTED_SNAPSHOT OFF
GO
ALTER DATABASE [Melodify] SET HONOR_BROKER_PRIORITY OFF
GO
ALTER DATABASE [Melodify] SET  READ_WRITE
GO
ALTER DATABASE [Melodify] SET RECOVERY SIMPLE
GO
ALTER DATABASE [Melodify] SET  MULTI_USER
GO
ALTER DATABASE [Melodify] SET PAGE_VERIFY CHECKSUM
GO
ALTER DATABASE [Melodify] SET DB_CHAINING OFF
GO
USE [Melodify]
GO
/****** Object:  Table [dbo].[Artists]    Script Date: 04/03/2025 20:25:14 ******/
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
/****** Object:  Table [dbo].[__EFMigrationsHistory]    Script Date: 04/03/2025 20:25:14 ******/
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
/****** Object:  Table [dbo].[Users]    Script Date: 04/03/2025 20:25:14 ******/
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
/****** Object:  Table [dbo].[Songs]    Script Date: 04/03/2025 20:25:14 ******/
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
/****** Object:  Table [dbo].[Playlists]    Script Date: 04/03/2025 20:25:14 ******/
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
/****** Object:  Table [dbo].[Follows]    Script Date: 04/03/2025 20:25:14 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Follows](
	[FollowID] [int] IDENTITY(1,1) NOT NULL,
	[UserID] [int] NULL,
	[ArtistID] [int] NULL,
	[FollowedAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[FollowID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Favorites]    Script Date: 04/03/2025 20:25:14 ******/
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
/****** Object:  Table [dbo].[Playlist_Songs]    Script Date: 04/03/2025 20:25:14 ******/
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
/****** Object:  Default [DF__Users__CreatedAt__0425A276]    Script Date: 04/03/2025 20:25:14 ******/
ALTER TABLE [dbo].[Users] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
/****** Object:  Default [DF__Users__Role__34C8D9D1]    Script Date: 04/03/2025 20:25:14 ******/
ALTER TABLE [dbo].[Users] ADD  DEFAULT ('User') FOR [Role]
GO
/****** Object:  Default [DF__Playlists__Creat__117F9D94]    Script Date: 04/03/2025 20:25:14 ******/
ALTER TABLE [dbo].[Playlists] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
/****** Object:  Default [DF__Follows__Followe__1CF15040]    Script Date: 04/03/2025 20:25:14 ******/
ALTER TABLE [dbo].[Follows] ADD  DEFAULT (getdate()) FOR [FollowedAt]
GO
/****** Object:  Default [DF__Favorites__Favor__398D8EEE]    Script Date: 04/03/2025 20:25:14 ******/
ALTER TABLE [dbo].[Favorites] ADD  DEFAULT (getdate()) FOR [FavoritedAt]
GO
/****** Object:  ForeignKey [FK__Songs__ArtistID__0CBAE877]    Script Date: 04/03/2025 20:25:14 ******/
ALTER TABLE [dbo].[Songs]  WITH CHECK ADD FOREIGN KEY([ArtistID])
REFERENCES [dbo].[Artists] ([ArtistID])
GO
/****** Object:  ForeignKey [FK__Playlists__UserI__1273C1CD]    Script Date: 04/03/2025 20:25:14 ******/
ALTER TABLE [dbo].[Playlists]  WITH CHECK ADD FOREIGN KEY([UserID])
REFERENCES [dbo].[Users] ([UserID])
GO
/****** Object:  ForeignKey [FK__Follows__ArtistI__1ED998B2]    Script Date: 04/03/2025 20:25:14 ******/
ALTER TABLE [dbo].[Follows]  WITH CHECK ADD FOREIGN KEY([ArtistID])
REFERENCES [dbo].[Artists] ([ArtistID])
GO
/****** Object:  ForeignKey [FK__Follows__UserID__1DE57479]    Script Date: 04/03/2025 20:25:14 ******/
ALTER TABLE [dbo].[Follows]  WITH CHECK ADD FOREIGN KEY([UserID])
REFERENCES [dbo].[Users] ([UserID])
GO
/****** Object:  ForeignKey [FK__Favorites__SongI__3B75D760]    Script Date: 04/03/2025 20:25:14 ******/
ALTER TABLE [dbo].[Favorites]  WITH CHECK ADD FOREIGN KEY([SongID])
REFERENCES [dbo].[Songs] ([SongID])
GO
/****** Object:  ForeignKey [FK__Favorites__UserI__3A81B327]    Script Date: 04/03/2025 20:25:14 ******/
ALTER TABLE [dbo].[Favorites]  WITH CHECK ADD FOREIGN KEY([UserID])
REFERENCES [dbo].[Users] ([UserID])
GO
/****** Object:  ForeignKey [FK__Playlist___Playl__173876EA]    Script Date: 04/03/2025 20:25:14 ******/
ALTER TABLE [dbo].[Playlist_Songs]  WITH CHECK ADD FOREIGN KEY([PlaylistID])
REFERENCES [dbo].[Playlists] ([PlaylistID])
GO
/****** Object:  ForeignKey [FK__Playlist___SongI__182C9B23]    Script Date: 04/03/2025 20:25:14 ******/
ALTER TABLE [dbo].[Playlist_Songs]  WITH CHECK ADD FOREIGN KEY([SongID])
REFERENCES [dbo].[Songs] ([SongID])
GO


/*THEM DU LIEU */

/*DU LIEU BANG Artists*/
INSERT INTO [dbo].[Artists] ([Name], [Bio], [ImageUrl])
VALUES 
    (N'Đen', N'Rapper Việt Nam nổi tiếng với ca từ chất thơ và phong cách chill.', '/data/img/8f4d2a1b-3c92-4e5f-a1b2-9d4e5f6c7b8d.jpg'),
    (N'Mỹ Tâm', N'Ca sĩ nhạc pop biểu tượng của Việt Nam với sự nghiệp hàng thập kỷ.', '/data/img/1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d.jpg'),
    (N'Vũ.', N'Nghệ sĩ indie Việt Nam với các ca khúc giàu cảm xúc.', '/data/img/2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e.jpg'),
    (N'Sơn Tùng M-TP', N'Hoàng tử V-Pop với các bản hit triệu lượt nghe.', '/data/img/3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f.jpg'),
    (N'Hoàng Thùy Linh', N'Ca sĩ V-Pop kết hợp âm hưởng dân gian và hiện đại.', '/data/img/4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a.jpg'),
    (N'tlinh', N'Rapper trẻ, Top EQUAL Vietnam Artist 2022.', '/data/img/5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b.jpg'),
    (N'RPT MCK', N'Rapper Việt Nam nổi tiếng với các bản hit như Chìm Sâu.', '/data/img/6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c.jpg'),
    (N'Bích Phương', N'Ca sĩ nhạc pop Việt Nam với ca khúc Bùa Yêu.', '/data/img/7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d.jpg'),
    (N'MIN', N'Ca sĩ pop Việt Nam với hơn 1 triệu người nghe hàng tháng.', '/data/img/8b9c0d1e-2f3a-4b5c-6d7e-8f9a0b1c2d3e.jpg'),
    (N'AMEE', N'Ngôi sao pop trẻ với các bài hát dễ thương.', '/data/img/9c0d1e2f-3a4b-5c6d-7e8f-9a0b1c2d3e4f.jpg'),
    (N'Suboi', N'Nữ hoàng hip-hop Việt Nam, hợp tác với 88rising.', '/data/img/0d1e2f3a-4b5c-6d7e-8f9a-0b1c2d3e4f5a.jpg'),
    (N'Ngọt', N'Rock band Hà Nội với phong cách indie rock độc đáo.', '/data/img/1e2f3a4b-5c6d-7e8f-9a0b-1c2d3e4f5a6b.jpg'),
    (N'Tiên Tiên', N'Ca sĩ kiêm nhạc sĩ với phong cách tự do.', '/data/img/2f3a4b5c-6d7e-8f9a-0b1c-2d3e4f5a6b7c.jpg'),
    (N'Đông Nhi', N'Ca sĩ V-Pop nổi tiếng với các bản hit sôi động.', '/data/img/3a4b5c6d-7e8f-9a0b-1c2d-3e4f5a6b7c8d.jpg'),
    (N'Wren Evans', N'Ca sĩ kiêm rapper trẻ với album LOI CHOI.', '/data/img/4b5c6d7e-8f9a-0b1c-2d3e-4f5a6b7c8d9e.jpg'),
    (N'Taylor Swift', N'Siêu sao nhạc pop toàn cầu, nhất Spotify 2023-2024.', '/data/img/5c6d7e8f-9a0b-1c2d-3e4f-5a6b7c8d9e0f.jpg'),
    (N'The Weeknd', N'Nghệ sĩ Canada với R&B và synth-pop.', '/data/img/6d7e8f9a-0b1c-2d3e-4f5a-6b7c8d9e0f1a.jpg'),
    (N'Billie Eilish', N'Ca sĩ Mỹ với dòng nhạc alternative pop.', '/data/img/7e8f9a0b-1c2d-3e4f-5a6b-7c8d9e0f1a2b.jpg'),
    (N'Bruno Mars', N'Ca sĩ Mỹ với các bài hát pop sôi động.', '/data/img/8f9a0b1c-2d3e-4f5a-6b7c-8d9e0f1a2b3c.jpg'),
    (N'Lady Gaga', N'Biểu tượng nhạc pop với phong cách táo bạo.', '/data/img/9a0b1c2d-3e4f-5a6b-7c8d-9e0f1a2b3c4d.jpg'),
    (N'BTS', N'Nhóm nhạc K-Pop thống trị bảng xếp hạng Spotify.', '/data/img/0b1c2d3e-4f5a-6b7c-8d9e-0f1a2b3c4d5e.jpg'),
    (N'Jung Kook', N'Thành viên BTS với các bản hit solo như Seven.', '/data/img/1c2d3e4f-5a6b-7c8d-9e0f-1a2b3c4d5e6f.jpg'),
    (N'Charlie Puth', N'Nghệ sĩ pop Mỹ nổi tiếng với các bản collab.', '/data/img/2d3e4f5a-6b7c-8d9e-0f1a-2b3c4d5e6f7a.jpg'),
    (N'NewJeans', N'Nhóm nhạc K-Pop với các bản hit như OMG.', '/data/img/3e4f5a6b-7c8d-9e0f-1a2b-3c4d5e6f7a8b.jpg'),
    (N'BLACKPINK', N'Nhóm nhạc K-Pop nữ có sức ảnh hưởng toàn cầu.', '/data/img/4f5a6b7c-8d9e-0f1a-2b3c-4d5e6f7a8b9c.jpg'),
    (N'Ariana Grande', N'Ca sĩ pop Mỹ với giọng hát ấn tượng.', '/data/img/5a6b7c8d-9e0f-1a2b-3c4d-5e6f7a8b9c0d.jpg'),
    (N'Ed Sheeran', N'Ca sĩ Anh với các bài hát acoustic và pop.', '/data/img/6b7c8d9e-0f1a-2b3c-4d5e-6f7a8b9c0d1e.jpg'),
    (N'Peso Pluma', N'Ca sĩ Mexico với dòng nhạc regional Mexican.', '/data/img/7c8d9e0f-1a2b-3c4d-5e6f-7a8b9c0d1e2f.jpg'),
    (N'SZA', N'Ca sĩ R&B Mỹ với các bài hát giàu cảm xúc.', '/data/img/8d9e0f1a-2b3c-4d5e-6f7a-8b9c0d1e2f3a.jpg'),
    (N'Drake', N'Rapper và ca sĩ Canada với nhiều bản hit toàn cầu.', '/data/img/9e0f1a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b.jpg');

	SELECT * FROM [dbo].[Artists];

/*DU LIEU BANG Users*/
INSERT INTO [dbo].[Users] ([Email], [PasswordHash], [DisplayName], [ImageUrl])
VALUES 
    (N'nguyen.van@gmail.com', N'hashed_password_123', N'Nguyễn Văn', NULL),
    (N'nhathuy@gmail.com', N'hashed_password_456', N'Nhật Huy', NULL),
    (N'le.hoang@gmail.com', N'hashed_password_789', N'Lê Hoàng', NULL),
    (N'pham.anh@gmail.com', N'hashed_password_101', N'Phạm Anh', NULL),
    (N'vu.minh@gmail.com', N'hashed_password_202', N'Vũ Minh', NULL);

/*DU LIEU BANG Songs*/
INSERT INTO [dbo].[Songs] ([Title], [ArtistID], [Album], [Genre], [Url], [ReleaseDate], [ImageUrl])
VALUES 
    (N'Bài Này Chill Phết', 1, N'Single', N'Rap', '/data/Songs/bai_nay_chill_phet.mp3', '2019-05-01', '/data/img/0f1a2b3c-4d5e-6f7a-8b9c-0d1e2f3a4b5c.jpg'),
    (N'Ước Mơ', 2, N'Single', N'Pop', '/data/Songs/uoc_mo.mp3', '2018-01-01', '/data/img/1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d.jpg'),
    (N'Bước Qua Mùa Cô Đơn', 3, N'Single', N'Indie', '/data/Songs/buoc_qua_mua_co_don.mp3', '2021-01-01', '/data/img/2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e.jpg'),
    (N'Hãy Trao Cho Anh', 4, N'Single', N'V-Pop', '/data/Songs/hay_trao_cho_anh.mp3', '2019-07-01', '/data/img/3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f.jpg'),
    (N'Kẻ Cắp Gặp Bà Già', 5, N'Single', N'V-Pop', '/data/Songs/ke_cap_gap_ba_gia.mp3', '2019-10-01', '/data/img/4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a.jpg'),
    (N'nếu lúc đó', 6, N'Single', N'Rap', '/data/Songs/neu_luc_do.mp3', '2023-01-01', '/data/img/5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b.jpg'),
    (N'Chìm Sâu', 7, N'99%', N'Rap', '/data/Songs/chim_sau.mp3', '2021-01-01', '/data/img/6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c.jpg'),
    (N'Bùa Yêu', 8, N'Single', N'V-Pop', '/data/Songs/bua_yeu.mp3', '2018-05-01', '/data/img/7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d.jpg'),
    (N'Em Là Châu Báu', 9, N'Single', N'Pop', '/data/Songs/em_la_chau_bau.mp3', '2020-01-01', '/data/img/8b9c0d1e-2f3a-4b5c-6d7e-8f9a0b1c2d3e.jpg'),
    (N'Anh Đã Quen Với Cô Đơn', 10, N'Single', N'V-Pop', '/data/Songs/anh_da_quen_voi_co_don.mp3', '2020-01-01', '/data/img/9c0d1e2f-3a4b-5c6d-7e8f-9a0b1c2d3e4f.jpg'),
    (N'Girls Night', 11, N'No Nê', N'Hip-Hop', '/data/Songs/girls_night.mp3', '2021-07-01', '/data/img/0d1e2f3a-4b5c-6d7e-8f9a-0b1c2d3e4f5a.jpg'),
    (N'Hết Thương Cạn Nhớ', 12, N'Single', N'Indie Rock', '/data/Songs/het_thuong_can_nho.mp3', '2019-01-01', '/data/img/1e2f3a4b-5c6d-7e8f-9a0b-1c2d3e4f5a6b.jpg'),
    (N'Mơ', 13, N'Single', N'Pop', '/data/Songs/mo.mp3', '2016-01-01', '/data/img/2f3a4b5c-6d7e-8f9a-0b1c-2d3e4f5a6b7c.jpg'),
    (N'Đừng Làm Trái Tim Anh Đau', 14, N'Single', N'V-Pop', '/data/Songs/dung_lam_trai_tim_anh_dau.mp3', '2024-01-01', '/data/img/3a4b5c6d-7e8f-9a0b-1c2d-3e4f5a6b7c8d.jpg'),
    (N'Cà Phê', 15, N'LOI CHOI: The Neo Pop Punk', N'Pop Punk', '/data/Songs/ca_phe.mp3', '2023-12-01', '/data/img/4b5c6d7e-8f9a-0b1c-2d3e-4f5a6b7c8d9e.jpg'),
    (N'Shake It Off', 16, N'1989', N'Pop', '/data/Songs/shake_it_off.mp3', '2014-08-18', '/data/img/5c6d7e8f-9a0b-1c2d-3e4f-5a6b7c8d9e0f.jpg'),
    (N'Blinding Lights', 17, N'After Hours', N'Synth-pop', '/data/Songs/blinding_lights.mp3', '2019-11-29', '/data/img/6d7e8f9a-0b1c-2d3e-4f5a-6b7c8d9e0f1a.jpg'),
    (N'Bad Guy', 18, N'When We All Fall Asleep, Where Do We Go?', N'Alternative Pop', '/data/Songs/bad_guy.mp3', '2019-03-29', '/data/img/7e8f9a0b-1c2d-3e4f-5a6b-7c8d9e0f1a2b.jpg'),
    (N'Die With A Smile', 19, N'Single', N'Pop', '/data/Songs/die_with_a_smile.mp3', '2024-08-08', '/data/img/8f9a0b1c-2d3e-4f5a-6b7c-8d9e0f1a2b3c.jpg'),
    (N'Shallow', 20, N'A Star Is Born', N'Pop', '/data/Songs/shallow.mp3', '2018-09-27', '/data/img/9a0b1c2d-3e4f-5a6b-7c8d-9e0f1a2b3c4d.jpg'),
    (N'Dynamite', 21, N'Single', N'K-Pop', '/data/Songs/dynamite.mp3', '2020-08-21', '/data/img/0b1c2d3e-4f5a-6b7c-8d9e-0f1a2b3c4d5e.jpg'),
    (N'Seven (feat. Latto)', 22, N'Single', N'K-Pop', '/data/Songs/seven.mp3', '2023-07-14', '/data/img/1c2d3e4f-5a6b-7c8d-9e0f-1a2b3c4d5e6f.jpg'),
    (N'Left and Right', 23, N'Single', N'Pop', '/data/Songs/left_and_right.mp3', '2022-06-17', '/data/img/2d3e4f5a-6b7c-8d9e-0f1a-2b3c4d5e6f7a.jpg'),
    (N'OMG', 24, N'Single', N'K-Pop', '/data/Songs/omg.mp3', '2023-01-02', '/data/img/3e4f5a6b-7c8d-9e0f-1a2b-3c4d5e6f7a8b.jpg'),
    (N'How You Like That', 25, N'Single', N'K-Pop', '/data/Songs/how_you_like_that.mp3', '2020-06-26', '/data/img/4f5a6b7c-8d9e-0f1a-2b3c-4d5e6f7a8b9c.jpg'),
    (N'Thank U, Next', 26, N'Thank U, Next', N'Pop', '/data/Songs/thank_u_next.mp3', '2018-11-03', '/data/img/5a6b7c8d-9e0f-1a2b-3c4d-5e6f7a8b9c0d.jpg'),
    (N'Shape of You', 27, N'÷', N'Pop', '/data/Songs/shape_of_you.mp3', '2017-01-06', '/data/img/6b7c8d9e-0f1a-2b3c-4d5e-6f7a8b9c0d1e.jpg'),
    (N'Lady Gaga', 28, N'Single', N'Regional Mexican', '/data/Songs/lady_gaga.mp3', '2023-03-17', '/data/img/7c8d9e0f-1a2b-3c4d-5e6f-7a8b9c0d1e2f.jpg'),
    (N'Snooze', 29, N'SOS', N'R&B', '/data/Songs/snooze.mp3', '2022-12-09', '/data/img/8d9e0f1a-2b3c-4d5e-6f7a-8b9c0d1e2f3a.jpg'),
    (N'One Dance', 30, N'Views', N'Dancehall', '/data/Songs/one_dance.mp3', '2016-04-05', '/data/img/9e0f1a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b.jpg');



SELECT ArtistID, Name FROM [dbo].[Artists];

/*DU LIEU BANG Playlists*/
INSERT INTO [dbo].[Playlists] ([UserID], [Title], [Description], [ImageUrl])
VALUES 
    (1, N'Nhạc Hot V-Pop 2025', N'Tuyển tập các bài V-Pop và rap hot nhất 2025.', '/data/img/0f1a2b3c-4d5e-6f7a-8b9c-0d1e2f3a4b5c.jpg'),
    (2, N'K-Pop & Pop Quốc Tế', N'Hỗn hợp các bản hit K-Pop và pop quốc tế.', '/data/img/1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d.jpg'),
    (3, N'Indie & Nhạc Chill', N'Nhạc indie và V-Pop nhẹ nhàng để thư giãn.', '/data/img/2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e.jpg'),
    (4, N'Nhạc Tiệc Tùng', N'Các bài hát sôi động cho bữa tiệc.', '/data/img/3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f.jpg'),
    (5, N'Rap & R&B Vibes', N'Tuyển tập rap và R&B Việt Nam và quốc tế.', '/data/img/4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a.jpg');


/*DU LIEU BANG Follows*/

INSERT INTO [dbo].[Follows] ([UserID], [ArtistID])
VALUES 
    (1, 1), (1, 4), (1, 6), (1, 11), (1, 16), (1, 21), (1, 22),
    (2, 2), (2, 5), (2, 7), (2, 12), (2, 17), (2, 25), (2, 26),
    (3, 3), (3, 8), (3, 10), (3, 13), (3, 18), (3, 24), (3, 29),
    (4, 9), (4, 14), (4, 15), (4, 19), (4, 20), (4, 27), (4, 28),
    (5, 1), (5, 7), (5, 11), (5, 17), (5, 23), (5, 30), (5, 29);


/*DU LIEU BANG Favorites*/
INSERT INTO [dbo].[Favorites] ([UserID], [SongID])
VALUES 
    (1, 1), (1, 4), (1, 6), (1, 16), (1, 21), (1, 22),
    (2, 2), (2, 5), (2, 7), (2, 17), (2, 25), (2, 26),
    (3, 3), (3, 8), (3, 10), (3, 18), (3, 24), (3, 29),
    (4, 9), (4, 14), (4, 15), (4, 19), (4, 20), (4, 27),
    (5, 1), (5, 7), (5, 11), (5, 17), (5, 23), (5, 30);

/*DU LIEU BANG __EFMigrationsHistory*/
INSERT INTO [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES 
    (N'20250506202214_InitialCreate', N'8.0.0');