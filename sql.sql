CREATE DATABASE quotes;


CREATE TABLE `quotes`.`quote` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `author_id` INT,
  `quotetext` TEXT NOT NULL,
  `validated` TINYINT(1) NOT NULL,
  `rank` INT,
  PRIMARY KEY (`id`)
);  