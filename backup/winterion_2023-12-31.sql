# ************************************************************
# Sequel Ace SQL dump
# Version 20062
#
# https://sequel-ace.com/
# https://github.com/Sequel-Ace/Sequel-Ace
#
# Host: 34.171.131.215 (MySQL 8.2.0)
# Database: winterion
# Generation Time: 2023-12-31 11:23:35 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE='NO_AUTO_VALUE_ON_ZERO', SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table logs
# ------------------------------------------------------------

DROP TABLE IF EXISTS `logs`;

CREATE TABLE `logs` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `psid` int unsigned NOT NULL,
  `timestamp` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `psid` (`psid`),
  CONSTRAINT `fk_psid` FOREIGN KEY (`psid`) REFERENCES `members` (`psid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `logs` WRITE;
/*!40000 ALTER TABLE `logs` DISABLE KEYS */;

INSERT INTO `logs` (`id`, `psid`, `timestamp`)
VALUES
	(1,6827026,1703526120000),
	(2,5487291,1703613780000),
	(3,4304837,1703709420000),
	(4,3873292,1703804460000),
	(5,1937028,1703897520000),
	(6,2204169,1703997520000);

/*!40000 ALTER TABLE `logs` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table members
# ------------------------------------------------------------

DROP TABLE IF EXISTS `members`;

CREATE TABLE `members` (
  `psid` int unsigned NOT NULL,
  `role` varchar(63) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'Non-Member',
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `first` varchar(127) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `last` varchar(127) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `discord` varchar(63) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `image` varchar(1023) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  PRIMARY KEY (`psid`),
  UNIQUE KEY `psid` (`psid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `members` WRITE;
/*!40000 ALTER TABLE `members` DISABLE KEYS */;

INSERT INTO `members` (`psid`, `role`, `email`, `password`, `first`, `last`, `discord`, `image`)
VALUES
	(1937028,'Officer','diana@nguyen.com','pass','Diana','Nguyen','nobid','https://media.licdn.com/dms/image/D5635AQE6lvcFSUoodw/profile-framedphoto-shrink_200_200/0/1694055533577?e=1704535200&v=beta&t=iQp_suqf0fmQrC9Y68ikftAi1ZJs9Wcl2aroN2CepmI'),
	(2204169,'Non-Member','thomas@contact.me','password','Thomas','Nguyen','tthn','https://media.licdn.com/dms/image/D5603AQFqON8WZs_eDA/profile-displayphoto-shrink_200_200/0/1694488901614?e=1709164800&v=beta&t=beg8DIm5cFLHrtU7PiNwqBuqxdZ5VCwZOYALCfSlNxE'),
	(3873292,'Member','khanh@nguyen.com','khanh123','Khanh','Nguyen','sixthsenseriot','https://media.licdn.com/dms/image/D5603AQH--HcvKTgQsA/profile-displayphoto-shrink_200_200/0/1686416300644?e=1709164800&v=beta&t=ZPK70MTpS-7T2ix8a6YnZfO3PHR8JvOR7rwwL4bDzs0'),
	(4304837,'Guest','mattew@segura.com','matt123','Matthew','Segura','mattura','https://media.licdn.com/dms/image/D5603AQE6hSYCYICjcw/profile-displayphoto-shrink_200_200/0/1695222602315?e=1709164800&v=beta&t=an5YNzfGAijMo4p_LsUasx8xp_PBRVIjGtEZmN1OSz0'),
	(5487291,'Non-Member','sebastian@rincon.com','password1','Sebastian','Rincon','sebooo5104','https://media.licdn.com/dms/image/D5603AQH8D64-cHvN3Q/profile-displayphoto-shrink_200_200/0/1696471799648?e=1709164800&v=beta&t=RqU_LD8EGtT2zIUUSZHdqF7ZULyGppe5V_WG65ArxuI'),
	(6827026,'Guest','sebastian@dela.espriella','sebas','Sebastian','De La Espriella','basic_comrade','https://media.licdn.com/dms/image/D5635AQH9JSH8igmI4w/profile-framedphoto-shrink_200_200/0/1698205424695?e=1704535200&v=beta&t=Du1O-4XVjFqnzc94tZX9foq_x2k4fHHr-bB58yhonis'),
	(7777777,'Officer','spud@the.bot','theion','Spud','The Bot','spud','https://media.licdn.com/dms/image/C4E0BAQHsUc-3FL7jOw/company-logo_200_200/0/1650120403890?e=1712188800&v=beta&t=j7hufz0nT90Gxc0eQSPV9gAHlfmciaBTz0TXTmcOe6k'),
	(8888888,'Member','kermit@the.frog','kermy','Kermit','The Frog','kermit','https://lumiere-a.akamaihd.net/v1/images/character_themuppets_kermit_b77a431b.jpeg'),
	(9999999,'Guest','jesus@heaven.com','god','Jesus','Christ','jesus','https://img.freepik.com/free-photo/free-photo-good-friday-background-with-jesus-christ-cross_1340-28455.jpg?t=st=1703929712~exp=1703933312~hmac=ef4d0bd836d15aaae9d36708d1cf9ae58571ffefb89423dfb8bffa436bae9295&w=740');

/*!40000 ALTER TABLE `members` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
