CREATE DATABASE IF NOT EXISTS teacher_student_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE teacher_student_db;

-- Bảng giáo viên
CREATE TABLE IF NOT EXISTS teachers (
	id INT AUTO_INCREMENT PRIMARY KEY,
	email VARCHAR(255) NOT NULL UNIQUE,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng học sinh
CREATE TABLE IF NOT EXISTS students (
	id INT AUTO_INCREMENT PRIMARY KEY,
	email VARCHAR(255) NOT NULL UNIQUE,
	suspended BOOLEAN NOT NULL DEFAULT FALSE,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng đăng ký (liên kết many-to-many giữa teachers và students)
CREATE TABLE IF NOT EXISTS registrations (
	teacher_id INT NOT NULL,
	student_id INT NOT NULL,
	PRIMARY KEY (teacher_id, student_id),
	FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
	FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample teachers
INSERT INTO teachers (email) VALUES 
('john.smith@school.edu'),
('emily.jones@school.edu');

-- Sample students
INSERT INTO students (email, suspended) VALUES 
('michael.brown@student.edu', FALSE),
('sophia.johnson@student.edu', FALSE),
('william.davis@student.edu', FALSE),
('olivia.wilson@student.edu', TRUE); -- Suspended student

-- Registrations
-- john.smith teaches michael, sophia, william
-- emily.jones teaches sophia, olivia

INSERT INTO registrations (teacher_id, student_id) VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 2),
(2, 4);