DROP TABLE IF EXISTS `car`;
CREATE TABLE `car` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `model` varchar(45) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `places` int(11) NOT NULL,
  `doors` int(11) NOT NULL,
  `photo` longblob NOT NULL,
  `current_address` varchar(150) NOT NULL,
  `busy` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(40) NOT NULL,
  `password` varchar(150) NOT NULL,
  `first_name` varchar(80) NOT NULL,
  `last_name` varchar(80) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `email` varchar(90) NOT NULL,
  `approved` tinyint(4) NOT NULL DEFAULT '0',
  `passport_photo` longblob NOT NULL,
  `driver_license_photo` longblob NOT NULL,
  `role` enum('CLIENT','ADMIN') NOT NULL DEFAULT 'CLIENT',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `phone_number_UNIQUE` (`phone_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `credit_card`;
CREATE TABLE `credit_card` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `number` char(16) NOT NULL,
  `first_name` varchar(80) NOT NULL,
  `last_name` varchar(80) NOT NULL,
  `exp_date` date NOT NULL,
  `secret_number` varchar(5) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `main` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `number_UNIQUE` (`number`),
  KEY `fk_credit_card_user_idx` (`user_id`),
  CONSTRAINT `fk_credit_card_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `rent_application`;
CREATE TABLE `rent_application` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `car_id` int(11) DEFAULT NULL,
  `total_price` decimal(10,2) DEFAULT NULL,
  `rent_start` timestamp NULL DEFAULT NULL,
  `rent_end` timestamp NULL DEFAULT NULL,
  `car_locked` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `fk_rent_application_user1_idx` (`user_id`),
  KEY `fk_rent_application_car1_idx` (`car_id`),
  CONSTRAINT `fk_rent_application_car1` FOREIGN KEY (`car_id`) REFERENCES `car` (`id`),
  CONSTRAINT `fk_rent_application_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
