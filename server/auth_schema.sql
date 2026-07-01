-- ============================================================
-- auth_schema.sql — Хэрэглэгч, явц, сорилын үр дүн
-- milo_kali сан дээр нэмж ажиллуулна:  mysql -u root < server/auth_schema.sql
-- ============================================================
USE milo_kali;

CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(64)  NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('user','admin') NOT NULL DEFAULT 'user',
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- үзсэн/дуусгасан хичээлүүд (lesson_id = "courseId:lessonLocalId")
CREATE TABLE IF NOT EXISTS progress (
  user_id      INT NOT NULL,
  lesson_id    VARCHAR(128) NOT NULL,
  completed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, lesson_id),
  CONSTRAINT fk_progress_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- давсан сорилууд
CREATE TABLE IF NOT EXISTS challenge_results (
  user_id      INT NOT NULL,
  challenge_id VARCHAR(64) NOT NULL,
  completed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, challenge_id),
  CONSTRAINT fk_chresult_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- хичээлд зарцуулсан хугацаа (screen-time): хичээл бүр, өдөр бүрээр секунд
CREATE TABLE IF NOT EXISTS study_time (
  user_id   INT NOT NULL,
  lesson_id VARCHAR(128) NOT NULL,
  day       DATE NOT NULL,
  seconds   INT NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, lesson_id, day),
  KEY idx_user_day (user_id, day),
  CONSTRAINT fk_time_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
