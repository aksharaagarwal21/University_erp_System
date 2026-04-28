-- ============================================================
-- AUTHENTICATION: Users Table for Role-Based Access
-- ============================================================
USE university_erpsystem;

CREATE TABLE IF NOT EXISTS Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Role ENUM('student', 'faculty', 'admin') NOT NULL,
    RefID INT DEFAULT NULL,
    FullName VARCHAR(100) NOT NULL,
    Email VARCHAR(100),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Super Admin
INSERT INTO Users (Username, Password, Role, RefID, FullName, Email)
VALUES ('admin', 'admin123', 'admin', NULL, 'Super Administrator', 'admin@university.edu');

-- Insert Students as users (RefID = StudentID)
INSERT INTO Users (Username, Password, Role, RefID, FullName, Email)
VALUES 
('rahul', 'rahul123', 'student', 101, 'Rahul', 'rahul@gmail.com'),
('priya', 'priya123', 'student', 102, 'Priya', 'priya@gmail.com'),
('aman', 'aman123', 'student', 103, 'Aman', 'aman@gmail.com'),
('sneha', 'sneha123', 'student', 104, 'Sneha', 'sneha@gmail.com');

-- Insert Faculty as users (RefID = FacultyID)
INSERT INTO Users (Username, Password, Role, RefID, FullName, Email)
VALUES 
('drsingh', 'singh123', 'faculty', 201, 'Dr Singh', 'singh@university.edu'),
('drverma', 'verma123', 'faculty', 202, 'Dr Verma', 'verma@university.edu'),
('driyer', 'iyer123', 'faculty', 203, 'Dr Iyer', 'iyer@university.edu');

SELECT 'Users table created with auth data!' AS Status;
