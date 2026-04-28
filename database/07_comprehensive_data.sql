USE university_erpsystem;

-- Class Table
CREATE TABLE IF NOT EXISTS Class (
    ClassID INT PRIMARY KEY,
    ClassName VARCHAR(20) NOT NULL,
    DeptID INT NOT NULL,
    Semester INT NOT NULL,
    Section VARCHAR(5) NOT NULL,
    FOREIGN KEY (DeptID) REFERENCES Department(DeptID)
);

-- Add Departments
INSERT IGNORE INTO Department VALUES
(3,'DSBS','Dr Reddy','9234567890'),
(4,'IT','Dr Gupta','9345678901');

-- Add Courses
INSERT IGNORE INTO Course VALUES
(303,'BTech DSBS',4,3),
(304,'BTech IT',4,4);

-- Classes (5 classes, 20 students each)
INSERT IGNORE INTO Class VALUES
(1,'CSE-A',1,3,'A'),(2,'CSE-B',1,3,'B'),
(3,'ECE-A',2,3,'A'),(4,'DSBS-A',3,3,'A'),(5,'IT-A',4,3,'A');

-- Add ClassID column to Student (ignore error if already exists)
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='university_erpsystem' AND TABLE_NAME='Student' AND COLUMN_NAME='ClassID');
SET @sql = IF(@col_exists=0, 'ALTER TABLE Student ADD COLUMN ClassID INT DEFAULT NULL', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
SET @fk_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA='university_erpsystem' AND TABLE_NAME='Student' AND COLUMN_NAME='ClassID' AND REFERENCED_TABLE_NAME='Class');
SET @sql2 = IF(@fk_exists=0, 'ALTER TABLE Student ADD CONSTRAINT fk_student_class FOREIGN KEY (ClassID) REFERENCES Class(ClassID)', 'SELECT 1');
PREPARE stmt2 FROM @sql2; EXECUTE stmt2; DEALLOCATE PREPARE stmt2;

-- 10 Subjects (keep existing 401-403, add 404-410)
INSERT IGNORE INTO Subject VALUES
(404,'Data Structures',4,3,301),
(405,'Software Engineering',3,3,301),
(406,'Computer Networks',3,3,301),
(407,'Signals & Systems',3,3,302),
(408,'Machine Learning',4,3,303),
(409,'Web Development',3,3,304),
(410,'Discrete Mathematics',3,3,301);

-- 20 Faculties (keep 201-203, add 204-220)
INSERT IGNORE INTO Faculty VALUES
(204,'Dr Sharma','Data Science',1),
(205,'Dr Patel','Software Eng',1),
(206,'Dr Nair','Computer Networks',1),
(207,'Dr Joshi','Operating Systems',1),
(208,'Dr Rao','Machine Learning',3),
(209,'Dr Das','Web Technologies',4),
(210,'Dr Bose','Discrete Math',1),
(211,'Dr Kapoor','VLSI Design',2),
(212,'Dr Malhotra','Signal Processing',2),
(213,'Dr Tiwari','Cloud Computing',4),
(214,'Dr Saxena','Cybersecurity',1),
(215,'Dr Banerjee','IoT Systems',2),
(216,'Dr Mishra','Big Data',3),
(217,'Dr Chauhan','Compiler Design',1),
(218,'Dr Agarwal','Embedded Systems',2),
(219,'Dr Pandey','NLP',3),
(220,'Dr Sinha','Mobile Computing',4);

-- 100 Students (20 per class)
-- Class 1: CSE-A (101-120)
INSERT IGNORE INTO Student (StudentID,Name,Email,Phone,Semester,DeptID) VALUES
(104,'Sneha','sneha@gmail.com','9004445555',3,1),
(105,'Vikram','vikram@gmail.com','9005556666',3,1),
(106,'Neha','neha@gmail.com','9006667777',3,1),
(107,'Arjun','arjun@gmail.com','9007778888',3,1),
(108,'Kavya','kavya@gmail.com','9008889999',3,1),
(109,'Rohit','rohit@gmail.com','9009990000',3,1),
(110,'Anjali','anjali@gmail.com','9010001111',3,1),
(111,'Karan','karan@gmail.com','9011112222',3,1),
(112,'Divya','divya@gmail.com','9012223333',3,1),
(113,'Aditya','aditya@gmail.com','9013334444',3,1),
(114,'Pooja','pooja@gmail.com','9014445555',3,1),
(115,'Manish','manish@gmail.com','9015556666',3,1),
(116,'Ritika','ritika@gmail.com','9016667777',3,1),
(117,'Suresh','suresh@gmail.com','9017778888',3,1),
(118,'Meera','meera@gmail.com','9018889999',3,1),
(119,'Rajat','rajat@gmail.com','9019990000',3,1),
(120,'Swati','swati@gmail.com','9020001111',3,1);

-- Class 2: CSE-B (121-140)
INSERT IGNORE INTO Student (StudentID,Name,Email,Phone,Semester,DeptID) VALUES
(121,'Deepak','deepak@gmail.com','9021112222',3,1),
(122,'Nisha','nisha@gmail.com','9022223333',3,1),
(123,'Vivek','vivek@gmail.com','9023334444',3,1),
(124,'Shruti','shruti@gmail.com','9024445555',3,1),
(125,'Gaurav','gaurav@gmail.com','9025556666',3,1),
(126,'Ananya','ananya@gmail.com','9026667777',3,1),
(127,'Siddharth','siddharth@gmail.com','9027778888',3,1),
(128,'Lakshmi','lakshmi@gmail.com','9028889999',3,1),
(129,'Nikhil','nikhil@gmail.com','9029990000',3,1),
(130,'Priyanka','priyanka@gmail.com','9030001111',3,1),
(131,'Harsh','harsh@gmail.com','9031112222',3,1),
(132,'Sonal','sonal@gmail.com','9032223333',3,1),
(133,'Varun','varun@gmail.com','9033334444',3,1),
(134,'Tanvi','tanvi@gmail.com','9034445555',3,1),
(135,'Abhishek','abhishek@gmail.com','9035556666',3,1),
(136,'Renu','renu@gmail.com','9036667777',3,1),
(137,'Akash','akash@gmail.com','9037778888',3,1),
(138,'Pallavi','pallavi@gmail.com','9038889999',3,1),
(139,'Tarun','tarun@gmail.com','9039990000',3,1),
(140,'Jyoti','jyoti@gmail.com','9040001111',3,1);

-- Class 3: ECE-A (141-160)
INSERT IGNORE INTO Student (StudentID,Name,Email,Phone,Semester,DeptID) VALUES
(141,'Ramesh','ramesh@gmail.com','9041112222',3,2),
(142,'Sunita','sunita@gmail.com','9042223333',3,2),
(143,'Prakash','prakash@gmail.com','9043334444',3,2),
(144,'Geeta','geeta@gmail.com','9044445555',3,2),
(145,'Mohan','mohan@gmail.com','9045556666',3,2),
(146,'Radha','radha@gmail.com','9046667777',3,2),
(147,'Vijay','vijay@gmail.com','9047778888',3,2),
(148,'Seema','seema@gmail.com','9048889999',3,2),
(149,'Ashok','ashok@gmail.com','9049990000',3,2),
(150,'Kamla','kamla@gmail.com','9050001111',3,2),
(151,'Dinesh','dinesh@gmail.com','9051112222',3,2),
(152,'Uma','uma@gmail.com','9052223333',3,2),
(153,'Rajesh','rajesh@gmail.com','9053334444',3,2),
(154,'Savita','savita@gmail.com','9054445555',3,2),
(155,'Manoj','manoj@gmail.com','9055556666',3,2),
(156,'Poonam','poonam@gmail.com','9056667777',3,2),
(157,'Sunil','sunil@gmail.com','9057778888',3,2),
(158,'Rekha','rekha@gmail.com','9058889999',3,2),
(159,'Ajay','ajay@gmail.com','9059990000',3,2),
(160,'Asha','asha@gmail.com','9060001111',3,2);

-- Class 4: DSBS-A (161-180)
INSERT IGNORE INTO Student (StudentID,Name,Email,Phone,Semester,DeptID) VALUES
(161,'Kunal','kunal@gmail.com','9061112222',3,3),
(162,'Sakshi','sakshi@gmail.com','9062223333',3,3),
(163,'Pranav','pranav@gmail.com','9063334444',3,3),
(164,'Ishita','ishita@gmail.com','9064445555',3,3),
(165,'Dhruv','dhruv@gmail.com','9065556666',3,3),
(166,'Tanya','tanya@gmail.com','9066667777',3,3),
(167,'Aakash','aakash@gmail.com','9067778888',3,3),
(168,'Nidhi','nidhi@gmail.com','9068889999',3,3),
(169,'Vishal','vishal@gmail.com','9069990000',3,3),
(170,'Komal','komal@gmail.com','9070001111',3,3),
(171,'Sahil','sahil@gmail.com','9071112222',3,3),
(172,'Megha','megha@gmail.com','9072223333',3,3),
(173,'Tushar','tushar@gmail.com','9073334444',3,3),
(174,'Bhavna','bhavna@gmail.com','9074445555',3,3),
(175,'Yash','yash@gmail.com','9075556666',3,3),
(176,'Shweta','shweta@gmail.com','9076667777',3,3),
(177,'Aniket','aniket@gmail.com','9077778888',3,3),
(178,'Kirti','kirti@gmail.com','9078889999',3,3),
(179,'Omkar','omkar@gmail.com','9079990000',3,3),
(180,'Rashi','rashi@gmail.com','9080001111',3,3);

-- Class 5: IT-A (181-200)
INSERT IGNORE INTO Student (StudentID,Name,Email,Phone,Semester,DeptID) VALUES
(181,'Mihir','mihir@gmail.com','9081112222',3,4),
(182,'Aditi','aditi@gmail.com','9082223333',3,4),
(183,'Chirag','chirag@gmail.com','9083334444',3,4),
(184,'Jhanvi','jhanvi@gmail.com','9084445555',3,4),
(185,'Parth','parth@gmail.com','9085556666',3,4),
(186,'Simran','simran@gmail.com','9086667777',3,4),
(187,'Kartik','kartik@gmail.com','9087778888',3,4),
(188,'Disha','disha@gmail.com','9088889999',3,4),
(189,'Rohan','rohan@gmail.com','9089990000',3,4),
(190,'Aisha','aisha@gmail.com','9090001111',3,4),
(191,'Jay','jay@gmail.com','9091112222',3,4),
(192,'Kriti','kriti@gmail.com','9092223333',3,4),
(193,'Nakul','nakul@gmail.com','9093334444',3,4),
(194,'Palak','palak@gmail.com','9094445555',3,4),
(195,'Sameer','sameer@gmail.com','9095556666',3,4),
(196,'Vidya','vidya@gmail.com','9096667777',3,4),
(197,'Zubin','zubin@gmail.com','9097778888',3,4),
(198,'Esha','esha@gmail.com','9098889999',3,4),
(199,'Gaurang','gaurang@gmail.com','9099990000',3,4),
(200,'Hema','hema@gmail.com','9100001111',3,4);

-- Assign ClassIDs
UPDATE Student SET ClassID=1 WHERE StudentID BETWEEN 101 AND 120;
UPDATE Student SET ClassID=2 WHERE StudentID BETWEEN 121 AND 140;
UPDATE Student SET ClassID=3 WHERE StudentID BETWEEN 141 AND 160;
UPDATE Student SET ClassID=4 WHERE StudentID BETWEEN 161 AND 180;
UPDATE Student SET ClassID=5 WHERE StudentID BETWEEN 181 AND 200;
UPDATE Student SET Semester=3 WHERE StudentID BETWEEN 101 AND 200;

-- Enrollments: 7 subjects per student
-- CSE-A & CSE-B: 401,402,403,404,405,406,410
-- ECE-A: 401,402,403,406,407,410,405
-- DSBS-A: 401,404,405,406,408,409,410
-- IT-A: 401,402,404,405,406,409,410

DELETE FROM Enrollment WHERE EnrollID >= 504;

SET @eid = 504;

-- CSE-A (101-120) -> subjects 401,402,403,404,405,406,410
INSERT INTO Enrollment (EnrollID,StudentID,SubjectID,AcademicYear,Status)
SELECT (@eid:=@eid+1), s.StudentID, sub.SubjectID, '2025-26', 'Active'
FROM Student s CROSS JOIN (SELECT 401 AS SubjectID UNION SELECT 402 UNION SELECT 403 UNION SELECT 404 UNION SELECT 405 UNION SELECT 406 UNION SELECT 410) sub
WHERE s.ClassID = 1 AND s.StudentID >= 104;

-- CSE-B (121-140) -> same subjects
INSERT INTO Enrollment (EnrollID,StudentID,SubjectID,AcademicYear,Status)
SELECT (@eid:=@eid+1), s.StudentID, sub.SubjectID, '2025-26', 'Active'
FROM Student s CROSS JOIN (SELECT 401 AS SubjectID UNION SELECT 402 UNION SELECT 403 UNION SELECT 404 UNION SELECT 405 UNION SELECT 406 UNION SELECT 410) sub
WHERE s.ClassID = 2;

-- ECE-A (141-160) -> subjects 401,402,403,405,406,407,410
INSERT INTO Enrollment (EnrollID,StudentID,SubjectID,AcademicYear,Status)
SELECT (@eid:=@eid+1), s.StudentID, sub.SubjectID, '2025-26', 'Active'
FROM Student s CROSS JOIN (SELECT 401 AS SubjectID UNION SELECT 402 UNION SELECT 403 UNION SELECT 405 UNION SELECT 406 UNION SELECT 407 UNION SELECT 410) sub
WHERE s.ClassID = 3;

-- DSBS-A (161-180) -> subjects 401,404,405,406,408,409,410
INSERT INTO Enrollment (EnrollID,StudentID,SubjectID,AcademicYear,Status)
SELECT (@eid:=@eid+1), s.StudentID, sub.SubjectID, '2025-26', 'Active'
FROM Student s CROSS JOIN (SELECT 401 AS SubjectID UNION SELECT 404 UNION SELECT 405 UNION SELECT 406 UNION SELECT 408 UNION SELECT 409 UNION SELECT 410) sub
WHERE s.ClassID = 4;

-- IT-A (181-200) -> subjects 401,402,404,405,406,409,410
INSERT INTO Enrollment (EnrollID,StudentID,SubjectID,AcademicYear,Status)
SELECT (@eid:=@eid+1), s.StudentID, sub.SubjectID, '2025-26', 'Active'
FROM Student s CROSS JOIN (SELECT 401 AS SubjectID UNION SELECT 402 UNION SELECT 404 UNION SELECT 405 UNION SELECT 406 UNION SELECT 409 UNION SELECT 410) sub
WHERE s.ClassID = 5;

-- Timetable: Mon-Fri, 5 slots/day
-- Slots: 09:00-10:00, 10:00-11:00, 11:00-12:00, 14:00-15:00, 15:00-16:00
DELETE FROM Timetable WHERE TTID >= 604;
SET @tid = 603;

-- Faculty-Subject mapping: 201->401, 204->404, 205->405, 206->406, 207->402, 208->408, 209->409, 210->410, 203->403, 212->407

-- Monday
INSERT INTO Timetable VALUES
((@tid:=@tid+1),'Monday','09:00-10:00','A101',201,401),
((@tid:=@tid+1),'Monday','10:00-11:00','A101',207,402),
((@tid:=@tid+1),'Monday','11:00-12:00','A101',206,406),
((@tid:=@tid+1),'Monday','14:00-15:00','A101',204,404),
((@tid:=@tid+1),'Monday','15:00-16:00','A101',205,405),
-- Tuesday
((@tid:=@tid+1),'Tuesday','09:00-10:00','A102',206,403),
((@tid:=@tid+1),'Tuesday','10:00-11:00','A102',201,401),
((@tid:=@tid+1),'Tuesday','11:00-12:00','A102',210,410),
((@tid:=@tid+1),'Tuesday','14:00-15:00','A102',208,408),
((@tid:=@tid+1),'Tuesday','15:00-16:00','A102',209,409),
-- Wednesday
((@tid:=@tid+1),'Wednesday','09:00-10:00','B201',207,402),
((@tid:=@tid+1),'Wednesday','10:00-11:00','B201',204,404),
((@tid:=@tid+1),'Wednesday','11:00-12:00','B201',205,405),
((@tid:=@tid+1),'Wednesday','14:00-15:00','B201',212,407),
((@tid:=@tid+1),'Wednesday','15:00-16:00','B201',201,401),
-- Thursday
((@tid:=@tid+1),'Thursday','09:00-10:00','A201',210,410),
((@tid:=@tid+1),'Thursday','10:00-11:00','A201',206,406),
((@tid:=@tid+1),'Thursday','11:00-12:00','A201',208,408),
((@tid:=@tid+1),'Thursday','14:00-15:00','A201',209,409),
((@tid:=@tid+1),'Thursday','15:00-16:00','A201',204,404),
-- Friday
((@tid:=@tid+1),'Friday','09:00-10:00','A301',205,405),
((@tid:=@tid+1),'Friday','10:00-11:00','A301',206,403),
((@tid:=@tid+1),'Friday','11:00-12:00','A301',207,402),
((@tid:=@tid+1),'Friday','14:00-15:00','A301',210,410),
((@tid:=@tid+1),'Friday','15:00-16:00','A301',212,407);

-- Auth users for new faculties
INSERT IGNORE INTO Users (Username,Password,Role,RefID,FullName,Email) VALUES
('drsharma','$2b$10$LQv3c1yqBo9SkvXS7QJBOeRFDJGFVAmjwSiDFPSml6h0vJYlY/H6i','faculty',204,'Dr Sharma','sharma@univ.edu'),
('drpatel','$2b$10$LQv3c1yqBo9SkvXS7QJBOeRFDJGFVAmjwSiDFPSml6h0vJYlY/H6i','faculty',205,'Dr Patel','patel@univ.edu'),
('drnair','$2b$10$LQv3c1yqBo9SkvXS7QJBOeRFDJGFVAmjwSiDFPSml6h0vJYlY/H6i','faculty',206,'Dr Nair','nair@univ.edu'),
('drjoshi','$2b$10$LQv3c1yqBo9SkvXS7QJBOeRFDJGFVAmjwSiDFPSml6h0vJYlY/H6i','faculty',207,'Dr Joshi','joshi@univ.edu'),
('drrao','$2b$10$LQv3c1yqBo9SkvXS7QJBOeRFDJGFVAmjwSiDFPSml6h0vJYlY/H6i','faculty',208,'Dr Rao','rao@univ.edu'),
('drdas','$2b$10$LQv3c1yqBo9SkvXS7QJBOeRFDJGFVAmjwSiDFPSml6h0vJYlY/H6i','faculty',209,'Dr Das','das@univ.edu'),
('drbose','$2b$10$LQv3c1yqBo9SkvXS7QJBOeRFDJGFVAmjwSiDFPSml6h0vJYlY/H6i','faculty',210,'Dr Bose','bose@univ.edu');

-- Auth users for some students
INSERT IGNORE INTO Users (Username,Password,Role,RefID,FullName,Email) VALUES
('sneha','$2b$10$LQv3c1yqBo9SkvXS7QJBOeRFDJGFVAmjwSiDFPSml6h0vJYlY/H6i','student',104,'Sneha','sneha@gmail.com'),
('vikram','$2b$10$LQv3c1yqBo9SkvXS7QJBOeRFDJGFVAmjwSiDFPSml6h0vJYlY/H6i','student',105,'Vikram','vikram@gmail.com'),
('deepak','$2b$10$LQv3c1yqBo9SkvXS7QJBOeRFDJGFVAmjwSiDFPSml6h0vJYlY/H6i','student',121,'Deepak','deepak@gmail.com');

-- Faculty Availability for new faculty
INSERT IGNORE INTO FacultyAvailability (FacultyID,IsAvailable,CabinNumber,StatusMessage) VALUES
(204,1,'CSE-204','Available for consultation'),
(205,1,'CSE-205','Office hours 2-4 PM'),
(206,0,'CSE-206','On leave'),
(207,1,'CSE-207','Available'),
(208,1,'DSBS-208','Research hours'),
(209,1,'IT-209','Available'),
(210,1,'CSE-210','Available');

-- Exams for new subjects
INSERT IGNORE INTO Exam VALUES
(704,'2026-03-18',100,404),
(705,'2026-03-20',100,405),
(706,'2026-03-22',100,406),
(707,'2026-03-24',100,407),
(708,'2026-03-26',100,408),
(709,'2026-03-28',100,409),
(710,'2026-03-30',100,410);

SELECT CONCAT('Comprehensive data loaded: ',
  (SELECT COUNT(*) FROM Student),' students, ',
  (SELECT COUNT(*) FROM Faculty),' faculty, ',
  (SELECT COUNT(*) FROM Subject),' subjects, ',
  (SELECT COUNT(*) FROM Enrollment),' enrollments, ',
  (SELECT COUNT(*) FROM Class),' classes, ',
  (SELECT COUNT(*) FROM Timetable),' timetable entries') AS Status;
