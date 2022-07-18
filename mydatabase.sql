-- Progettazione Web 
DROP DATABASE if exists mydatabase; 
CREATE DATABASE mydatabase; 
USE mydatabase; 
-- MySQL dump 10.13  Distrib 5.7.28, for Win64 (x86_64)
--
-- Host: localhost    Database: mydatabase
-- ------------------------------------------------------
-- Server version	5.7.28

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `username` varchar(30) NOT NULL,
  `password` varchar(256) NOT NULL,
  `gameplayed` int(11) DEFAULT '0',
  `maxscore` int(11) DEFAULT '0',
  `maxkilled` int(11) DEFAULT '0',
  `totalkilled` int(11) DEFAULT '0',
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('a','$2y$10$1Dat0uBm/b7HiTrc0j.0/O1YtCYR4IkcIyba9d/p3PS00Pl3v4bya',6,14,7,7),('aRandomUser','$2y$10$MPsrUucOv6NnnWk995y0t.StYNn1OuhwoI3aMhSNHrcBq3z6IBZ/G',1,2,3,3),('pietro','$2y$10$/AI.GUHxnaM1Un0khDAHWuB9W3hcll8VZG8seQgdfBt3tV77vo.D.',4,3,11,19),('pippo','$2y$10$ORjP5E6oOa/vnoGhWGHm5u/uZGTBWLeYIII93J8OK5VVFfUnT0CeW',2,0,1,1),('proplayer','$2y$10$hsCSci3qQ5bpyX8xqjlMveiaoDLcUGSNpvtwBJPVIZIyORJz7Zfpe',39,1,0,0);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'mydatabase'
--
/*!50003 DROP PROCEDURE IF EXISTS `get_scoreboard` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_scoreboard`(IN statistica varchar(30))
begin

	set @query = concat("select *  from user order by ", statistica, " desc");
    prepare sql_statement from @query;
    execute sql_statement;
    
end ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `update_stats` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `update_stats`(IN us varchar(30), IN kills integer, IN floor integer)
begin
	declare max_score integer default 0;
    declare max_kills integer default 0;


	update user
	set gameplayed = gameplayed + 1
    where username = us;
	
    set max_score = (select maxscore from user where username = us);
    set max_kills = (select maxkilled from user where username = us);
    
    if max_score < floor then
		update user
		set maxscore = floor
        where username = us;
	end if;
    
    if max_kills < kills then
		update user
        set maxkilled = kills
        where username = us;
	end if;
    
    update user
	set totalkilled = totalkilled + kills
    where username = us;
	
end ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-01-14 18:31:41
