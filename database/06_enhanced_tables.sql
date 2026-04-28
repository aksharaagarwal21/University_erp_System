-- ============================================================
-- ENHANCED ERP TABLES: Component Marks, Faculty Availability,
-- Attendance, Announcements, Fees, Student Activities
-- ============================================================
USE university_erpsystem;

-- ============================================================
-- 1. Component Marks Table (CT1, CT2, Assignment, Lab, EndSem)
-- ============================================================
CREATE TABLE IF NOT EXISTS ComponentMarks (
    CompMarkID INT AUTO_INCREMENT PRIMARY KEY,
    StudentID INT NOT NULL,
    SubjectID INT NOT NULL,
    CT1 DECIMAL(5,2) DEFAULT 0,
    CT2 DECIMAL(5,2) DEFAULT 0,
    Assignment DECIMAL(5,2) DEFAULT 0,
    Lab DECIMAL(5,2) DEFAULT 0,
    MidSem DECIMAL(5,2) DEFAULT 0,
    EndSem DECIMAL(5,2) DEFAULT 0,
    TotalMarks DECIMAL(5,2) GENERATED ALWAYS AS (CT1 + CT2 + Assignment + Lab + MidSem + EndSem) STORED,
    AcademicYear VARCHAR(10) DEFAULT '2025-26',
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (StudentID) REFERENCES Student(StudentID),
    FOREIGN KEY (SubjectID) REFERENCES Subject(SubjectID),
    UNIQUE KEY unique_student_subject (StudentID, SubjectID)
);

-- ============================================================
-- 2. Faculty Availability (Cabin Status)
-- ============================================================
CREATE TABLE IF NOT EXISTS FacultyAvailability (
    AvailID INT AUTO_INCREMENT PRIMARY KEY,
    FacultyID INT NOT NULL,
    IsAvailable BOOLEAN DEFAULT TRUE,
    CabinNumber VARCHAR(20) DEFAULT '',
    StatusMessage VARCHAR(255) DEFAULT 'Available in cabin',
    AvailableFrom TIME DEFAULT NULL,
    AvailableTo TIME DEFAULT NULL,
    LastUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (FacultyID) REFERENCES Faculty(FacultyID),
    UNIQUE KEY unique_faculty_avail (FacultyID)
);

-- ============================================================
-- 3. Attendance Table
-- ============================================================
CREATE TABLE IF NOT EXISTS Attendance (
    AttendanceID INT AUTO_INCREMENT PRIMARY KEY,
    StudentID INT NOT NULL,
    SubjectID INT NOT NULL,
    AttendanceDate DATE NOT NULL,
    Status ENUM('Present', 'Absent', 'Late') DEFAULT 'Present',
    MarkedBy INT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (StudentID) REFERENCES Student(StudentID),
    FOREIGN KEY (SubjectID) REFERENCES Subject(SubjectID),
    FOREIGN KEY (MarkedBy) REFERENCES Faculty(FacultyID)
);

-- ============================================================
-- 4. Announcements Table
-- ============================================================
CREATE TABLE IF NOT EXISTS Announcements (
    AnnouncementID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(200) NOT NULL,
    Content TEXT NOT NULL,
    PostedBy INT,
    PostedByRole ENUM('admin', 'faculty') DEFAULT 'admin',
    Priority ENUM('Low', 'Medium', 'High', 'Urgent') DEFAULT 'Medium',
    TargetAudience ENUM('All', 'Students', 'Faculty') DEFAULT 'All',
    DeptID INT DEFAULT NULL,
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ExpiresAt DATETIME DEFAULT NULL,
    FOREIGN KEY (DeptID) REFERENCES Department(DeptID)
);

-- ============================================================
-- 5. Fee Structure & Payments
-- ============================================================
CREATE TABLE IF NOT EXISTS FeeStructure (
    FeeID INT AUTO_INCREMENT PRIMARY KEY,
    FeeName VARCHAR(100) NOT NULL,
    Amount DECIMAL(10,2) NOT NULL,
    Semester INT NOT NULL,
    DeptID INT NOT NULL,
    AcademicYear VARCHAR(10) DEFAULT '2025-26',
    FOREIGN KEY (DeptID) REFERENCES Department(DeptID)
);

CREATE TABLE IF NOT EXISTS FeePayment (
    PaymentID INT AUTO_INCREMENT PRIMARY KEY,
    StudentID INT NOT NULL,
    FeeID INT NOT NULL,
    AmountPaid DECIMAL(10,2) NOT NULL,
    PaymentDate DATE NOT NULL,
    PaymentMode ENUM('Online', 'Cash', 'Cheque', 'UPI') DEFAULT 'Online',
    TransactionID VARCHAR(50),
    Status ENUM('Paid', 'Pending', 'Partial') DEFAULT 'Paid',
    FOREIGN KEY (StudentID) REFERENCES Student(StudentID),
    FOREIGN KEY (FeeID) REFERENCES FeeStructure(FeeID)
);

-- ============================================================
-- 6. Study Materials / Resources
-- ============================================================
CREATE TABLE IF NOT EXISTS StudyMaterial (
    MaterialID INT AUTO_INCREMENT PRIMARY KEY,
    SubjectID INT NOT NULL,
    FacultyID INT NOT NULL,
    Title VARCHAR(200) NOT NULL,
    Description TEXT,
    MaterialType ENUM('Notes', 'PPT', 'PDF', 'Video', 'Link') DEFAULT 'Notes',
    UploadedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (SubjectID) REFERENCES Subject(SubjectID),
    FOREIGN KEY (FacultyID) REFERENCES Faculty(FacultyID)
);

-- ============================================================
-- 7. Faculty Leave Requests
-- ============================================================
CREATE TABLE IF NOT EXISTS FacultyLeave (
    LeaveID INT AUTO_INCREMENT PRIMARY KEY,
    FacultyID INT NOT NULL,
    LeaveDate DATE NOT NULL,
    Reason VARCHAR(255) NOT NULL,
    Status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    AppliedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (FacultyID) REFERENCES Faculty(FacultyID)
);

-- ============================================================
-- INSERT SAMPLE DATA
-- ============================================================

-- Component Marks
INSERT IGNORE INTO ComponentMarks (StudentID, SubjectID, CT1, CT2, Assignment, Lab, MidSem, EndSem) VALUES
(101, 401, 18, 17, 9, 22, 35, 72),
(101, 402, 15, 19, 8, 20, 30, 68),
(102, 402, 20, 18, 10, 24, 38, 78),
(103, 403, 19, 20, 9, 23, 40, 85);

-- Faculty Availability
INSERT IGNORE INTO FacultyAvailability (FacultyID, IsAvailable, CabinNumber, StatusMessage, AvailableFrom, AvailableTo) VALUES
(201, TRUE, 'CSE-301', 'Available for consultation', '10:00', '16:00'),
(202, FALSE, 'CSE-305', 'In a meeting, available after 3 PM', NULL, NULL),
(203, TRUE, 'ECE-201', 'Office hours - walk-ins welcome', '09:00', '17:00');

-- Attendance
INSERT IGNORE INTO Attendance (StudentID, SubjectID, AttendanceDate, Status, MarkedBy) VALUES
(101, 401, '2026-04-01', 'Present', 201),
(101, 401, '2026-04-02', 'Present', 201),
(101, 401, '2026-04-03', 'Absent', 201),
(101, 401, '2026-04-04', 'Present', 201),
(101, 401, '2026-04-07', 'Late', 201),
(102, 402, '2026-04-01', 'Present', 202),
(102, 402, '2026-04-02', 'Present', 202),
(102, 402, '2026-04-03', 'Present', 202),
(103, 403, '2026-04-01', 'Present', 203),
(103, 403, '2026-04-02', 'Absent', 203);

-- Announcements
INSERT IGNORE INTO Announcements (Title, Content, PostedBy, PostedByRole, Priority, TargetAudience) VALUES
('Mid-Semester Exam Schedule Released', 'The mid-semester examination schedule for all departments has been released. Please check the examination portal for detailed timetable.', NULL, 'admin', 'High', 'All'),
('Workshop on Machine Learning', 'A 3-day workshop on ML fundamentals will be conducted by Dr. Singh from May 5-7 in CSE Lab. All CSE students are encouraged to attend.', 201, 'faculty', 'Medium', 'Students'),
('Faculty Meeting - April 30', 'All faculty members are requested to attend the monthly review meeting on April 30 at 3 PM in the Conference Hall.', NULL, 'admin', 'High', 'Faculty'),
('Library Extended Hours', 'The central library will remain open till 10 PM during the exam period (May 1-15). Make the most of it!', NULL, 'admin', 'Low', 'Students');

-- Fee Structure
INSERT IGNORE INTO FeeStructure (FeeName, Amount, Semester, DeptID) VALUES
('Tuition Fee', 75000.00, 3, 1),
('Lab Fee', 15000.00, 3, 1),
('Library Fee', 5000.00, 3, 1),
('Tuition Fee', 72000.00, 2, 1),
('Tuition Fee', 70000.00, 4, 2);

-- Fee Payments
INSERT IGNORE INTO FeePayment (StudentID, FeeID, AmountPaid, PaymentDate, PaymentMode, TransactionID, Status) VALUES
(101, 1, 75000.00, '2026-01-15', 'Online', 'TXN2026011501', 'Paid'),
(101, 2, 15000.00, '2026-01-15', 'Online', 'TXN2026011502', 'Paid'),
(102, 4, 72000.00, '2026-01-20', 'UPI', 'UPI2026012001', 'Paid'),
(103, 5, 35000.00, '2026-02-01', 'Online', 'TXN2026020101', 'Partial');

-- Study Materials
INSERT IGNORE INTO StudyMaterial (SubjectID, FacultyID, Title, Description, MaterialType) VALUES
(401, 201, 'Introduction to SQL', 'Complete SQL basics with examples', 'Notes'),
(401, 201, 'ER Diagram Tutorial', 'Step-by-step guide to ER modeling', 'PDF'),
(402, 202, 'Process Scheduling Algorithms', 'FCFS, SJF, Round Robin explained', 'PPT'),
(403, 203, 'Digital Logic Fundamentals', 'Boolean algebra and logic gates', 'Notes');

SELECT 'Enhanced tables created with sample data!' AS Status;
