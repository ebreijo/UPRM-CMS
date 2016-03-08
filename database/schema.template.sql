--
-- Name: ${ databaseName }; Type: DATABASE
--

DROP DATABASE IF EXISTS ${ databaseName };
CREATE DATABASE ${ databaseName };

USE ${ databaseName }

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
-- Table structure for table `about_us`
--

DROP TABLE IF EXISTS `about_us`;
CREATE TABLE `about_us` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `vision` varchar(255) NOT NULL,
  `mission_desc` varchar(255) NOT NULL,
  `policies_desc` varchar(255) NOT NULL,
  `requirements_desc` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `administrator`
--

DROP TABLE IF EXISTS `administrator`;
CREATE TABLE `administrator` (
  `email` varchar(255) NOT NULL,
  `password` varchar(40) NOT NULL,
  `first_name` varchar(45) NOT NULL,
  `last_name` varchar(45) NOT NULL,
  PRIMARY KEY (`email`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC),
  CONSTRAINT `administrator_administrator_access_email` FOREIGN KEY (`email`) REFERENCES `administrator_access` (`email`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `administrator_access`
--

DROP TABLE IF EXISTS `administrator_access`;
CREATE TABLE `administrator_access` (
  `email` varchar(255) NOT NULL,
  `is_root` tinyint(1) NOT NULL DEFAULT '0',
  `admin_account_status` enum('pending','active','inactive') NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`email`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `company`
--

DROP TABLE IF EXISTS `company`;
CREATE TABLE `company` (
  `name` varchar(63) NOT NULL,
  `website_url` varchar(255) NOT NULL,
  `logo_path` varchar(255) DEFAULT NULL,
  `company_description` varchar(511) NOT NULL,
  `company_status` enum('pending','activated','deactivated') NOT NULL DEFAULT 'pending',
  `registration_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`name`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `company_interested_majors`
--

DROP TABLE IF EXISTS `company_interested_majors`;
CREATE TABLE `company_interested_majors` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `company_name` varchar(63) NOT NULL,
  `major_code` varchar(4) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `company_name_interested_major_idx` (`company_name`),
  KEY `company_major_interested_majors_idx` (`major_code`),
  CONSTRAINT `company_major_interested_majors` FOREIGN KEY (`major_code`) REFERENCES `major` (`major_code`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `company_name_interested_major` FOREIGN KEY (`company_name`) REFERENCES `company` (`name`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `company_location`
--

DROP TABLE IF EXISTS `company_location`;
CREATE TABLE `company_location` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `company_name` varchar(63) NOT NULL,
  `street_address` varchar(255) NOT NULL,
  `city` varchar(45) NOT NULL,
  `state` varchar(45) DEFAULT NULL,
  `country` varchar(45) NOT NULL,
  `zip_code` varchar(15) NOT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `company_location_company_name_idx` (`company_name`),
  CONSTRAINT `company_location_company_name` FOREIGN KEY (`company_name`) REFERENCES `company` (`name`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `company_services`
--

DROP TABLE IF EXISTS `company_services`;
CREATE TABLE `company_services` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `service` varchar(127) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `home_page_photos`
--

DROP TABLE IF EXISTS `home_page_photos`;
CREATE TABLE `home_page_photos` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `file_label` varchar(63) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `job_fair_company_information`
--

DROP TABLE IF EXISTS `job_fair_company_information`;
CREATE TABLE `job_fair_company_information` (
  `company_name` varchar(63) NOT NULL,
  `min_gpa` decimal(4,2) DEFAULT '0.00',
  `extra_information` varchar(255) DEFAULT NULL,
  `collecting_resumes_before_job_fair` tinyint(1) NOT NULL DEFAULT '0',
  `must_fill_online` tinyint(1) NOT NULL DEFAULT '0',
  `interviews_during_weekend` tinyint(1) NOT NULL DEFAULT '0',
  `attending` tinyint(1) NOT NULL DEFAULT '0',
  `website_application` varchar(255) NOT NULL,
  PRIMARY KEY (`company_name`),
  UNIQUE INDEX `company_name_UNIQUE` (`company_name` ASC),
  CONSTRAINT `job_fair_company_information_company_name` FOREIGN KEY (`company_name`) REFERENCES `company` (`name`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `job_fair_company_looking_for`
--

DROP TABLE IF EXISTS `job_fair_company_looking_for`;
CREATE TABLE `job_fair_company_looking_for` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `company_name` varchar(63) NOT NULL,
  `job_position` enum('Internship','Full-Time','Part-Time','CO-OP') NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `job_fair_company_looking_for_company_name_idx` (`company_name`),
  CONSTRAINT `job_fair_company_looking_for_company_name` FOREIGN KEY (`company_name`) REFERENCES `company` (`name`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `job_fair_dates`
--

DROP TABLE IF EXISTS `job_fair_dates`;
CREATE TABLE `job_fair_dates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `header_en` varchar(63) NOT NULL,
  `location_en` varchar(63) NOT NULL,
  `date_en` varchar(63) NOT NULL,
  `time` varchar(63) NOT NULL,
  `header_es` varchar(63) NOT NULL,
  `location_es` varchar(63) NOT NULL,
  `date_es` varchar(63) NOT NULL,
  `resume_deadline_date` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `job_offer`
--

DROP TABLE IF EXISTS `job_offer`;
CREATE TABLE `job_offer` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `company_name` varchar(63) NOT NULL,
  `title` varchar(63) NOT NULL,
  `description` varchar(511) NOT NULL,
  `job_position` enum('Internship','CO-OP','Full-Time','Part-Time') NOT NULL DEFAULT 'Internship',
  `education_level` enum('Bachelors','Masters','PhD') NOT NULL,
  `recent_graduate` tinyint(1) NOT NULL DEFAULT '0',
  `expiration_date` timestamp NOT NULL,
  `announcement_number` varchar(45) DEFAULT NULL,
  `flyer_path` varchar(255) DEFAULT NULL,
  `job_offer_status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `creation_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `recruiter_email` varchar(255) NOT NULL,
  `location` varchar(127) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `job_offers_company_name_idx` (`company_name`),
  KEY `job_offers_recruiter_email_idx` (`recruiter_email`),
  CONSTRAINT `job_offers_company_name` FOREIGN KEY (`company_name`) REFERENCES `company` (`name`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `job_offers_recruiter_email` FOREIGN KEY (`recruiter_email`) REFERENCES `recruiter` (`email`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `major`
--

DROP TABLE IF EXISTS `major`;
CREATE TABLE `major` (
  `major_code` varchar(4) NOT NULL,
  `name_english` varchar(63) NOT NULL,
  `name_spanish` varchar(63) NOT NULL,
  PRIMARY KEY (`major_code`),
  UNIQUE INDEX `major_code_UNIQUE` (`major_code` ASC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `our_staff`
--

DROP TABLE IF EXISTS `our_staff`;
CREATE TABLE `our_staff` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(63) NOT NULL,
  `position` varchar(63) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `password_recovery`
--

DROP TABLE IF EXISTS `password_recovery`;
CREATE TABLE `password_recovery` (
  `email` varchar(255) NOT NULL,
  `password_recovery_code` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`email`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `policies`
--

DROP TABLE IF EXISTS `policies`;
CREATE TABLE `policies` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `policy` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `promotional_material`
--

DROP TABLE IF EXISTS `promotional_material`;
CREATE TABLE `promotional_material` (
  `flyer_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `company_name` varchar(63) NOT NULL,
  `title` varchar(63) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `expiration_date` timestamp NOT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`flyer_id`),
  KEY `promotional_materials_company_name_idx` (`company_name`),
  CONSTRAINT `promotional_materials_company_name` FOREIGN KEY (`company_name`) REFERENCES `company` (`name`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `public_documents`
--

DROP TABLE IF EXISTS `public_documents`;
CREATE TABLE `public_documents` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `file_label` varchar(63) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `recruiter`
--

DROP TABLE IF EXISTS `recruiter`;
CREATE TABLE `recruiter` (
  `email` varchar(255) NOT NULL,
  `password` varchar(40) NOT NULL,
  `company_name` varchar(63) NOT NULL,
  `first_name` varchar(45) NOT NULL,
  `last_name` varchar(45) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `account_status` enum('pending','activated','deactivated') NOT NULL DEFAULT 'pending',
  `company_location` int(11) unsigned NOT NULL,
  `registration_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`email`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC),
  KEY `company_name_idx` (`company_name`),
  KEY `recruiter_company_location_idx` (`company_location`),
  CONSTRAINT `company_name` FOREIGN KEY (`company_name`) REFERENCES `company` (`name`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `recruiter_company_location` FOREIGN KEY (`company_location`) REFERENCES `company_location` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `requirements`
--

DROP TABLE IF EXISTS `requirements`;
CREATE TABLE `requirements` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `requirement` varchar(127) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `student_services`
--

DROP TABLE IF EXISTS `student_services`;
CREATE TABLE `student_services` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `service` varchar(127) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `temporary_contact`
--

DROP TABLE IF EXISTS `temporary_contact`;
CREATE TABLE `temporary_contact` (
  `email` varchar(255) NOT NULL,
  `company_name` varchar(63) NOT NULL,
  `first_name` varchar(45) NOT NULL,
  `last_name` varchar(45) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  PRIMARY KEY (`email`),
  KEY `temporary_contact_company_name_idx` (`company_name`),
  CONSTRAINT `temporary_contact_company_name` FOREIGN KEY (`company_name`) REFERENCES `company` (`name`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
