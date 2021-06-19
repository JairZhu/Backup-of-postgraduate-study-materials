USE [master]
GO

/****** Object:  Database [ContactManagerDb]    Script Date: 4/26/2012 5:27:59 PM ******/
CREATE DATABASE [ContactManagerDb]
GO

ALTER DATABASE [ContactManagerDb] MODIFY FILE
( NAME = N'ContactManagerDb', MAXSIZE = UNLIMITED, FILEGROWTH = 1024KB)
GO
ALTER DATABASE [ContactManagerDb] MODIFY FILE
( NAME = N'ContactManagerDb_log', MAXSIZE = 2048GB , FILEGROWTH = 10%)
GO

USE [ContactManagerDb]
GO

CREATE TABLE [dbo].[Contacts](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[FirstName] [nvarchar](max) NOT NULL,
	[LastName] [nvarchar](max) NOT NULL,
	[Email] [nvarchar](50) NULL,
	[Company] [nvarchar](50) NULL,
	[BusinessPhone] [nvarchar](max) NULL,
	[MobilePhone] [nvarchar](max) NULL,
	[Address] [nvarchar](50) NULL,
	[City] [nvarchar](50) NULL,
	[Zip] [nvarchar](10) NULL,
 CONSTRAINT [PK_Contacts] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO

INSERT INTO [dbo].[Contacts] ([Company], [FirstName], [LastName], [Email], [BusinessPhone], [MobilePhone], [Address], [City], [Zip])
VALUES ('Van Nuys', 'Catherine', 'Abel', 'catherine.abel@vannuys.com', '541 555 0100', '541 555 0101', '1 Microsoft Way', 'Redmond, WA', '98052')
INSERT INTO [dbo].[Contacts] ([Company], [FirstName], [LastName], [Email], [BusinessPhone], [MobilePhone], [Address], [City], [Zip])
VALUES ('Contoso', 'Kim', 'Branch', 'kim.branch@contoso.com', '541 555 0100', '541 555 0101', '1 Microsoft Way', 'Redmond, WA', '98052')
INSERT INTO [dbo].[Contacts] ([Company], [FirstName], [LastName], [Email], [BusinessPhone], [MobilePhone], [Address], [City], [Zip])
VALUES ('Contoso', 'Frances', 'Adams', 'frances.adams@contoso.com', '541 555 0100', '541 555 0101', '1 Microsoft Way', 'Redmond, WA', '98052')
INSERT INTO [dbo].[Contacts] ([Company], [FirstName], [LastName], [Email], [BusinessPhone], [MobilePhone], [Address], [City], [Zip])
VALUES ('A. Datum Corporation', 'Mark', 'Harrington', 'mark.harrington@adatum.com', '541 555 0100', '541 555 0101', '1 Microsoft Way', 'Redmond, WA', '98052')
INSERT INTO [dbo].[Contacts] ([Company], [FirstName], [LastName], [Email], [BusinessPhone], [MobilePhone], [Address], [City], [Zip])
VALUES ('Adventure Works', 'Keith', 'Harris', 'keith.harris@adventureworks.com', '541 555 0100', '541 555 0101', '1 Microsoft Way', 'Redmond, WA', '98052')
INSERT INTO [dbo].[Contacts] ([Company], [FirstName], [LastName], [Email], [BusinessPhone], [MobilePhone], [Address], [City], [Zip])
VALUES ('Alpine Ski House', 'Wilson', 'Pais', 'wilson.pais@alpineskihouse.com', '541 555 0100', '541 555 0101', '1 Microsoft Way', 'Redmond, WA', '98052')
INSERT INTO [dbo].[Contacts] ([Company], [FirstName], [LastName], [Email], [BusinessPhone], [MobilePhone], [Address], [City], [Zip])
VALUES ('Baldwin Museum of Science', 'Roger', 'Harui', 'roger.harui@baldwinmuseum.com', '541 555 0100', '541 555 0101', '1 Microsoft Way', 'Redmond, WA', '98052')
INSERT INTO [dbo].[Contacts] ([Company], [FirstName], [LastName], [Email], [BusinessPhone], [MobilePhone], [Address], [City], [Zip])
VALUES ('Blue Yonder Airlines', 'Pilar', 'Pinilla', 'pilar.pinilla@blueyonderairlines.com', '541 555 0100', '541 555 0101', '1 Microsoft Way', 'Redmond, WA', '98052')
INSERT INTO [dbo].[Contacts] ([Company], [FirstName], [LastName], [Email], [BusinessPhone], [MobilePhone], [Address], [City], [Zip])
VALUES ('City Power & Light', 'Kari', 'Hensien', 'kari.hensien@citypowerlight', '541 555 0100', '541 555 0101', '1 Microsoft Way', 'Redmond, WA', '98052')
INSERT INTO [dbo].[Contacts] ([Company], [FirstName], [LastName], [Email], [BusinessPhone], [MobilePhone], [Address], [City], [Zip])
VALUES ('Coho Winery', 'Peter', 'Brehm', 'peter.brehm@cohowinery.com', '541 555 0100', '541 555 0101', '1 Microsoft Way', 'Redmond, WA', '98052')
INSERT INTO [dbo].[Contacts] ([Company], [FirstName], [LastName], [Email], [BusinessPhone], [MobilePhone], [Address], [City], [Zip])
VALUES ('Coho Winery', 'Johnny', 'Porter', 'johnny.porter@cohowinery.com', '541 555 0100', '541 555 0101', '1 Microsoft Way', 'Redmond, WA', '98052')
INSERT INTO [dbo].[Contacts] ([Company], [FirstName], [LastName], [Email], [BusinessPhone], [MobilePhone], [Address], [City], [Zip])
VALUES ('Contoso', 'John', 'Smith', 'john.smith@contoso.com', '541 555 0100', '541 555 0101', '1 Microsoft Way', 'Redmond, WA', '98052')
INSERT INTO [dbo].[Contacts] ([Company], [FirstName], [LastName], [Email], [BusinessPhone], [MobilePhone], [Address], [City], [Zip])
VALUES ('Contoso', 'John', 'Harris', 'john.harris@contoso.com', '541 555 0100', '541 555 0101', '1 Microsoft Way', 'Redmond, WA', '98052')
GO