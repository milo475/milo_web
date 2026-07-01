-- ============================================================
-- schema.sql — milo_kali сургалтын мэдээллийн сан (MariaDB/MySQL)
-- Курс + хичээлүүдийг хадгална. blocks нь JSON баганад.
-- ============================================================

CREATE DATABASE IF NOT EXISTS milo_kali
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE milo_kali;

-- курсууд (Linux үндэс, nmap, wireshark, ...)
CREATE TABLE IF NOT EXISTS courses (
  id          VARCHAR(64)  NOT NULL,
  name        VARCHAR(128) NOT NULL,
  tagline     VARCHAR(255) NULL,
  sort_order  INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- хичээлүүд. blocks = тухайн хичээлийн контент блокуудын JSON массив
CREATE TABLE IF NOT EXISTS lessons (
  id          VARCHAR(96)  NOT NULL,
  course_id   VARCHAR(64)  NOT NULL,
  title       VARCHAR(255) NOT NULL,
  level       VARCHAR(64)  NULL,
  summary     TEXT         NULL,
  sort_order  INT          NOT NULL DEFAULT 0,
  blocks      JSON         NOT NULL,
  PRIMARY KEY (id),
  KEY idx_course (course_id, sort_order),
  CONSTRAINT fk_lessons_course
    FOREIGN KEY (course_id) REFERENCES courses (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
