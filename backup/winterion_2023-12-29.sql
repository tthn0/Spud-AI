# ************************************************************
# Sequel Ace SQL dump
# Version 20062
#
# https://sequel-ace.com/
# https://github.com/Sequel-Ace/Sequel-Ace
#
# Host: 34.171.131.215 (MySQL 8.2.0)
# Database: winterion
# Generation Time: 2023-12-29 07:23:55 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE='NO_AUTO_VALUE_ON_ZERO', SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table log
# ------------------------------------------------------------

DROP TABLE IF EXISTS `log`;

CREATE TABLE `log` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `psid` int unsigned NOT NULL,
  `timestamp` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `psid` (`psid`),
  CONSTRAINT `log_ibfk_1` FOREIGN KEY (`psid`) REFERENCES `members` (`psid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `log` WRITE;
/*!40000 ALTER TABLE `log` DISABLE KEYS */;

INSERT INTO `log` (`id`, `psid`, `timestamp`)
VALUES
	(1,2487291,1703526120000),
	(2,2304837,1703613780000),
	(3,2119382,1703709420000),
	(4,2019382,1703804460000),
	(5,2204169,1703897520000);

/*!40000 ALTER TABLE `log` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table members
# ------------------------------------------------------------

DROP TABLE IF EXISTS `members`;

CREATE TABLE `members` (
  `psid` int unsigned NOT NULL,
  `role` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'non-member',
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `first` varchar(255) NOT NULL,
  `last` varchar(255) NOT NULL,
  `discord` varchar(255) DEFAULT NULL,
  `image` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  PRIMARY KEY (`psid`),
  UNIQUE KEY `psid` (`psid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `members` WRITE;
/*!40000 ALTER TABLE `members` DISABLE KEYS */;

INSERT INTO `members` (`psid`, `role`, `email`, `password`, `first`, `last`, `discord`, `image`)
VALUES
	(2019382,'officer','diana@nguyen.com','pass','Diana','Nguyen','nobid','https://media.licdn.com/dms/image/D5635AQE6lvcFSUoodw/profile-framedphoto-shrink_200_200/0/1694055533577?e=1704438000&v=beta&t=LZFPlWTpSg4lZAwfJG5MXSme_tt-LwKWy1CKr0jkso8'),
	(2119382,'member','khanh@nguyen.com','khanh123','Khanh','Nguyen','queue','https://media.licdn.com/dms/image/D5603AQH--HcvKTgQsA/profile-displayphoto-shrink_200_200/0/1686416300644?e=1709164800&v=beta&t=ZPK70MTpS-7T2ix8a6YnZfO3PHR8JvOR7rwwL4bDzs0'),
	(2204169,'non-member','thomas@email.com','password','Thomas','Nguyen','tthn','https://media.licdn.com/dms/image/D5603AQFqON8WZs_eDA/profile-displayphoto-shrink_200_200/0/1694488901614?e=1709164800&v=beta&t=beg8DIm5cFLHrtU7PiNwqBuqxdZ5VCwZOYALCfSlNxE'),
	(2304837,'guest','matt@segura.com','matt123','Matthew','Segura','matt','https://media.licdn.com/dms/image/D5603AQE6hSYCYICjcw/profile-displayphoto-shrink_200_200/0/1695222602315?e=1709164800&v=beta&t=an5YNzfGAijMo4p_LsUasx8xp_PBRVIjGtEZmN1OSz0'),
	(2487291,'officer','sebastian@rincon.com','password1','Sebastian','Rincon','sebas','https://media.licdn.com/dms/image/D5603AQH8D64-cHvN3Q/profile-displayphoto-shrink_200_200/0/1696471799648?e=1709164800&v=beta&t=RqU_LD8EGtT2zIUUSZHdqF7ZULyGppe5V_WG65ArxuI');

/*!40000 ALTER TABLE `members` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
