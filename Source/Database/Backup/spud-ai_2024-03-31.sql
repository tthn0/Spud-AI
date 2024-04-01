# ************************************************************
# Sequel Ace SQL dump
# Version 20064
#
# https://sequel-ace.com/
# https://github.com/Sequel-Ace/Sequel-Ace
#
# Host: tthn.mysql.database.azure.com (MySQL 8.0.35)
# Database: spud-ai
# Generation Time: 2024-04-01 02:55:59 +0000
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
  `user_id` int unsigned NOT NULL,
  `timestamp` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `psid` (`user_id`),
  CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `logs` WRITE;
/*!40000 ALTER TABLE `logs` DISABLE KEYS */;

INSERT INTO `logs` (`id`, `user_id`, `timestamp`)
VALUES
	(1,7,1703400000000),
	(2,5,1703526120000),
	(3,4,1703613780000),
	(4,6,1703709420000),
	(5,3,1703804460000),
	(6,2,1703897520000),
	(7,1,1703997520000),
	(8,0,1704515446570);

/*!40000 ALTER TABLE `logs` ENABLE KEYS */;
UNLOCK TABLES;




# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `role` varchar(63) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'Non-Member',
  `email` varchar(255) NOT NULL,
  `first` varchar(127) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `last` varchar(127) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `discord` varchar(63) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `image` varchar(1023) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`id`, `role`, `email`, `first`, `last`, `discord`, `image`)
VALUES
	(0,'Officer','spud@the.bot','Spud','The Bot','spud','https://media.licdn.com/dms/image/C4E0BAQHsUc-3FL7jOw/company-logo_200_200/0/1650120403890?e=1713398400&v=beta&t=46Y6K3d9rRoEdSeIB-QfDnI2d9n0xAFP_Eppz7IIIWE'),
	(1,'Non-Member','tthn@contact.me','Thomas','Nguyen','tom','https://media.licdn.com/dms/image/D5603AQFqON8WZs_eDA/profile-displayphoto-shrink_200_200/0/1694488901614?e=1715817600&v=beta&t=9_QzFnSvQtEsHXkB4uIAF5g2DI2vrvDP9tV6J4IAMBs'),
	(2,'Officer','diana@nguyen.com','Diana','Nguyen','diana','https://media.licdn.com/dms/image/D5635AQE6lvcFSUoodw/profile-framedphoto-shrink_200_200/0/1694055533577?e=1712545200&v=beta&t=MRz6hD3QV1jG9NSxHsk-Eh__6J4fXrPAWnj6QsLUZP4'),
	(3,'Member','khanh@nguyen.com','Khanh','Nguyen','khanh','https://media.licdn.com/dms/image/D5603AQH--HcvKTgQsA/profile-displayphoto-shrink_200_200/0/1686416300644?e=1715817600&v=beta&t=Pks3r6o-Y53T9UL9yELB9GM0aGLxvwlWfdfNomqNR24'),
	(4,'Guest','matt@segura.com','Matthew','Segura','matt','https://media.licdn.com/dms/image/D5603AQHnYcF3_Kum3Q/profile-displayphoto-shrink_200_200/0/1704347696129?e=1715817600&v=beta&t=pEeyfzAZaVe6lXDgZFQ65c_TJfJQCTjNzdS5-P4Q-8Q'),
	(5,'Non-Member','seb@rincon.com','Sebastian','Rincon','sebooo','https://media.licdn.com/dms/image/D5603AQH8D64-cHvN3Q/profile-displayphoto-shrink_200_200/0/1696471799648?e=1715817600&v=beta&t=e1D7BOfce4Nan9q_Mum0g8PZ_R07kB7fGl62hdf67-E'),
	(6,'Guest','sagun@kayastha.com','Sagun','Kayastha','sagun','https://media.licdn.com/dms/image/D5603AQFiMvuETetd_w/profile-displayphoto-shrink_200_200/0/1705960197783?e=1715817600&v=beta&t=GHt-2_mmyL9LFmIxkB7LzpwHuXVg7gxXGNRht4wXeE0'),
	(7,'Guest','sebas@espriella.net','Sebastian','De La Espriella','sebas','https://media.licdn.com/dms/image/D5603AQHZOwsYrcWJpA/profile-displayphoto-shrink_200_200/0/1698205422308?e=1715817600&v=beta&t=CC99GBMgvUKk5-DNo11tzn3XQK4fSfKkZgAkQSGbBXI'),
	(8,'Member','kermit@the.frog','Kermit','The Frog','kermit','https://lumiere-a.akamaihd.net/v1/images/character_themuppets_kermit_b77a431b.jpeg'),
	(9,'Guest','jesus@god.com','Jesus','Christ','jesus','https://img.freepik.com/free-photo/free-photo-good-friday-background-with-jesus-christ-cross_1340-28455.jpg?t=st=1703929712~exp=1703933312~hmac=ef4d0bd836d15aaae9d36708d1cf9ae58571ffefb89423dfb8bffa436bae9295&w=740');

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of view logs_view
# ------------------------------------------------------------

DROP TABLE IF EXISTS `logs_view`; DROP VIEW IF EXISTS `logs_view`;

CREATE ALGORITHM=UNDEFINED DEFINER=`wizard`@`%` SQL SECURITY DEFINER VIEW `logs_view`
AS SELECT
   `logs`.`id` AS `log_id`,
   `logs`.`timestamp` AS `timestamp`,
   `users`.`id` AS `user_id`,
   `users`.`role` AS `role`,
   `users`.`email` AS `email`,
   `users`.`first` AS `first`,
   `users`.`last` AS `last`,
   `users`.`discord` AS `discord`,
   `users`.`image` AS `image`
FROM (`logs` join `users` on((`logs`.`user_id` = `users`.`id`))) order by `logs`.`timestamp` desc;


/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
