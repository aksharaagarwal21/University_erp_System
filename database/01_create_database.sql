-- ============================================================
-- UNIVERSITY ERP SYSTEM - Database Creation
-- 21CSC205P Database Management Systems Mini Project
-- ============================================================

-- Step 1: Create and use the database
DROP DATABASE IF EXISTS university_erpsystem;
CREATE DATABASE university_erpsystem;
USE university_erpsystem;

-- ============================================================
-- CHAPTER 2: Creation of Tables - DDL Commands
-- ============================================================

-- 1. Department Table
CREATE TABLE Department (
    DeptID INT PRIMARY KEY,
    DeptName VARCHAR(50) NOT NULL,
    HOD VARCHAR(50) NOT NULL,
    Phone VARCHAR(15) NOT NULL
);

-- 2. Student Table
CREATE TABLE Student (
    StudentID INT PRIMARY KEY,
    Name VARCHAR(50) NOT NULL,
    Email VARCHAR(50) UNIQUE NOT NULL,
    Phone VARCHAR(15) NOT NULL,
    Semester INT NOT NULL,
    DeptID INT NOT NULL,
    FOREIGN KEY (DeptID) REFERENCES Department(DeptID)
);

-- 3. Faculty Table
CREATE TABLE Faculty (
    FacultyID INT PRIMARY KEY,
    FacultyName VARCHAR(50) NOT NULL,
    Specialization VARCHAR(50) NOT NULL,
    DeptID INT NOT NULL,
    FOREIGN KEY (DeptID) REFERENCES Department(DeptID)
);

-- 4. Course Table
CREATE TABLE Course (
    CourseID INT PRIMARY KEY,
    CourseName VARCHAR(50) NOT NULL,
    Duration INT NOT NULL,
    DeptID INT NOT NULL,
    FOREIGN KEY (DeptID) REFERENCES Department(DeptID)
);

-- 5. Subject Table
CREATE TABLE Subject (
    SubjectID INT PRIMARY KEY,
    SubjectName VARCHAR(50) NOT NULL,
    Credits INT NOT NULL,
    Semester INT NOT NULL,
    CourseID INT NOT NULL,
    FOREIGN KEY (CourseID) REFERENCES Course(CourseID)
);

-- 6. Enrollment Table
CREATE TABLE Enrollment (
    EnrollID INT PRIMARY KEY,
    StudentID INT NOT NULL,
    SubjectID INT NOT NULL,
    AcademicYear VARCHAR(10) NOT NULL,
    Status VARCHAR(20) NOT NULL,
    FOREIGN KEY (StudentID) REFERENCES Student(StudentID),
    FOREIGN KEY (SubjectID) REFERENCES Subject(SubjectID)
);

-- 7. Timetable Table
CREATE TABLE Timetable (
    TTID INT PRIMARY KEY,
    Day VARCHAR(20) NOT NULL,
    TimeSlot VARCHAR(20) NOT NULL,
    RoomNo VARCHAR(10) NOT NULL,
    FacultyID INT NOT NULL,
    SubjectID INT NOT NULL,
    FOREIGN KEY (FacultyID) REFERENCES Faculty(FacultyID),
    FOREIGN KEY (SubjectID) REFERENCES Subject(SubjectID)
);

-- 8. Exam Table
CREATE TABLE Exam (
    ExamID INT PRIMARY KEY,
    ExamDate DATE NOT NULL,
    MaxMarks INT NOT NULL,
    SubjectID INT NOT NULL,
    FOREIGN KEY (SubjectID) REFERENCES Subject(SubjectID)
);

-- 9. Result Table
CREATE TABLE Result (
    ResultID INT PRIMARY KEY,
    Marks INT NOT NULL,
    Grade VARCHAR(5) NOT NULL,
    GPA FLOAT NOT NULL,
    StudentID INT NOT NULL,
    ExamID INT NOT NULL,
    FOREIGN KEY (StudentID) REFERENCES Student(StudentID),
    FOREIGN KEY (ExamID) REFERENCES Exam(ExamID)
);

-- ============================================================
-- 2.4 Insertion of Tuples - DML Commands
-- ============================================================

-- 1. Department Table
INSERT INTO Department VALUES
(1,'CSE','Dr Kumar','9876543210'),
(2,'ECE','Dr Mehta','9123456789');

-- 2. Student Table
INSERT INTO Student VALUES
(101,'Rahul','rahul@gmail.com','9001112222',3,1),
(102,'Priya','priya@gmail.com','9003334444',2,1),
(103,'Aman','aman@gmail.com','9112223333',4,2);

-- 3. Faculty Table
INSERT INTO Faculty VALUES
(201,'Dr Singh','AI',1),
(202,'Dr Verma','Networks',1),
(203,'Dr Iyer','Electronics',2);

-- 4. Course Table
INSERT INTO Course VALUES
(301,'BTech CSE',4,1),
(302,'BTech ECE',4,2);

-- 5. Subject Table
INSERT INTO Subject VALUES
(401,'Database Systems',4,3,301),
(402,'Operating Systems',3,2,301),
(403,'Digital Electronics',4,4,302);

-- 6. Enrollment Table
INSERT INTO Enrollment VALUES
(501,101,401,'2025','Active'),
(502,102,402,'2025','Active'),
(503,103,403,'2025','Active');

-- 7. Timetable Table
INSERT INTO Timetable VALUES
(601,'Monday','10:00-11:00','A101',201,401),
(602,'Tuesday','11:00-12:00','A102',202,402),
(603,'Wednesday','09:00-10:00','B201',203,403);

-- 8. Exam Table
INSERT INTO Exam VALUES
(701,'2026-03-10',100,401),
(702,'2026-03-12',100,402),
(703,'2026-03-15',100,403);

-- 9. Result Table
INSERT INTO Result VALUES
(801,88,'A',8.7,101,701),
(802,75,'B',7.5,102,702),
(803,91,'A+',9.1,103,703);

SELECT 'Database and Tables created successfully with sample data!' AS Status;
