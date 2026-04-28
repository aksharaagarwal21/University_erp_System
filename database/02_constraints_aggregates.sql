-- ============================================================
-- CHAPTER 3: Complex Queries - Constraints, Aggregates, Sets
-- ============================================================
USE university_erpsystem;

-- ============================================================
-- 3.1 Adding Constraints
-- ============================================================

-- 3.1.1: CHECK constraint on marks (0-100)
ALTER TABLE Result
ADD CONSTRAINT chk_marks CHECK (Marks BETWEEN 0 AND 100);

-- Test: Insert valid record
INSERT INTO Result VALUES (804, 95, 'A+', 9.5, 101, 702);

-- 3.1.2: DEFAULT constraint on Enrollment Status
ALTER TABLE Enrollment
ALTER COLUMN Status SET DEFAULT 'Active';

INSERT INTO Enrollment (EnrollID, StudentID, SubjectID, AcademicYear)
VALUES (504, 101, 402, '2025');

SELECT * FROM Enrollment WHERE EnrollID = 504;

-- ============================================================
-- 3.2 Aggregate Functions
-- ============================================================

-- 3.2.1: Average GPA, Max and Min Marks
SELECT
  AVG(GPA) AS Average_GPA,
  MAX(Marks) AS Highest_Marks,
  MIN(Marks) AS Lowest_Marks
FROM Result;

-- 3.2.2: Total students enrolled per subject
SELECT s.SubjectName, COUNT(e.StudentID) AS Total_Enrolled
FROM Subject s
JOIN Enrollment e ON s.SubjectID = e.SubjectID
GROUP BY s.SubjectName ORDER BY Total_Enrolled DESC;

-- 3.2.3: Faculty count per department (having > 1)
SELECT d.DeptName, COUNT(f.FacultyID) AS Faculty_Count
FROM Department d
JOIN Faculty f ON d.DeptID = f.DeptID
GROUP BY d.DeptName
HAVING COUNT(f.FacultyID) > 1;

-- ============================================================
-- 3.3 Set Operations
-- ============================================================

-- 3.3.1: UNION of Student and Faculty names
SELECT Name AS Person_Name, 'Student' AS Role FROM Student
UNION
SELECT FacultyName AS Person_Name, 'Faculty' AS Role FROM Faculty;

-- 3.3.2: UNION ALL for semester 3 subjects or DeptID 2
SELECT s.Name, s.Semester FROM Student s JOIN
Enrollment e ON s.StudentID = e.StudentID
JOIN Subject sub ON e.SubjectID = sub.SubjectID
WHERE sub.Semester = 3
UNION ALL
SELECT Name, Semester FROM Student WHERE DeptID = 2;

-- 3.3.3: INTERSECT - common SubjectIDs in Enrollment and Timetable
SELECT SubjectID FROM Enrollment
INTERSECT
SELECT SubjectID FROM Timetable;

-- ============================================================
-- 3.4 Subqueries
-- ============================================================

-- 3.4.1: Students scoring more than average marks
SELECT s.Name, r.Marks
FROM Student s
JOIN Result r ON s.StudentID = r.StudentID
WHERE r.Marks > (SELECT AVG(Marks) FROM Result);

-- 3.4.2: Subjects never enrolled
SELECT SubjectName FROM Subject
WHERE SubjectID NOT IN (SELECT SubjectID FROM Enrollment);

-- 3.4.3: Faculty teaching highest credit subject
SELECT f.FacultyName, sub.SubjectName, sub.Credits
FROM Faculty f
JOIN Timetable t ON f.FacultyID = t.FacultyID
JOIN Subject sub ON t.SubjectID = sub.SubjectID
WHERE sub.Credits = (SELECT MAX(Credits) FROM Subject);

-- ============================================================
-- 3.5 Joins
-- ============================================================

-- 3.5.1: INNER JOIN - Student results
SELECT s.Name AS Student_Name, sub.SubjectName,
       en.AcademicYear, r.Marks, r.Grade
FROM Student s
INNER JOIN Enrollment en ON s.StudentID = en.StudentID
INNER JOIN Subject sub ON en.SubjectID = sub.SubjectID
INNER JOIN Exam ex ON sub.SubjectID = ex.SubjectID
INNER JOIN Result r ON s.StudentID = r.StudentID AND ex.ExamID = r.ExamID;

-- 3.5.2: LEFT JOIN - All departments with students
SELECT d.DeptName, s.Name AS Student_Name, s.Semester
FROM Department d
LEFT JOIN Student s ON d.DeptID = s.DeptID
ORDER BY d.DeptName;

-- 3.5.3: Multi-table JOIN - Faculty timetable
SELECT f.FacultyName, sub.SubjectName,
       t.Day, t.TimeSlot, t.RoomNo
FROM Faculty f
INNER JOIN Timetable t ON f.FacultyID = t.FacultyID
INNER JOIN Subject sub ON t.SubjectID = sub.SubjectID
ORDER BY t.Day;

SELECT 'Constraints, Aggregates, Sets, Subqueries, and Joins executed!' AS Status;
