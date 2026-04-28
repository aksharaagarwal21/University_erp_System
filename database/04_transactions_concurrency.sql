-- ============================================================
-- CHAPTER 5: Concurrency Control and Recovery Mechanisms
-- ============================================================
USE university_erpsystem;

-- ============================================================
-- 5.3.1 Transaction 1: Enroll a New Student and Assign to Subject
-- ============================================================
START TRANSACTION;

INSERT INTO Student VALUES
  (104, 'Sneha', 'sneha@gmail.com', '9556677889', 1, 1);

SAVEPOINT after_student_insert;

INSERT INTO Enrollment VALUES
  (505, 104, 401, '2026', 'Active');

SELECT s.Name, e.SubjectID, e.Status
  FROM Student s JOIN Enrollment e
  ON s.StudentID = e.StudentID
  WHERE s.StudentID = 104;

COMMIT;

-- ============================================================
-- 5.3.2 Transaction 2: Insert Exam Result with Rollback on Error
-- ============================================================
START TRANSACTION;

INSERT INTO Exam VALUES (704, '2026-04-10', 100, 401);

SAVEPOINT after_exam_insert;

INSERT INTO Result VALUES (807, 78, 'B', 7.8, 104, 704);

SAVEPOINT after_valid_result;

-- Step 3: Invalid insert is commented (would fail CHECK constraint)
-- INSERT INTO Result VALUES (808, 115, 'A+', 9.5, 104, 703);

ROLLBACK TO after_valid_result;

SELECT * FROM Result WHERE StudentID = 104;

COMMIT;

-- ============================================================
-- 5.3.3 Transaction 3: Update Enrollment Status with Savepoints
-- ============================================================
START TRANSACTION;

UPDATE Enrollment SET Status = 'Completed'
  WHERE StudentID = 101 AND SubjectID = 401;

SAVEPOINT after_first_update;

UPDATE Enrollment SET Status = 'Completed'
  WHERE StudentID = 102 AND SubjectID = 402;

SAVEPOINT after_second_update;

UPDATE Enrollment SET Status = 'Completed'
  WHERE StudentID = 999 AND SubjectID = 401;

ROLLBACK TO after_second_update;

SELECT StudentID, SubjectID, Status FROM Enrollment
  WHERE StudentID IN (101, 102);

COMMIT;

-- ============================================================
-- 5.3.4 Transaction 4: Add New Course and Subject Atomically
-- ============================================================
START TRANSACTION;

INSERT INTO Course VALUES (303, 'BTech IT', 4, 1);

SAVEPOINT after_course_insert;

INSERT INTO Subject VALUES
  (404, 'Computer Networks', 4, 3, 303);

SAVEPOINT after_first_subject;

INSERT INTO Subject VALUES
  (405, 'Software Engineering', 3, 4, 303);

SAVEPOINT after_second_subject;

SELECT c.CourseName, s.SubjectName, s.Credits
  FROM Course c JOIN Subject s ON c.CourseID = s.CourseID
  WHERE c.CourseID = 303;

COMMIT;

-- ============================================================
-- 5.3.5 Transaction 5: Full Rollback on Constraint Violation
-- ============================================================
START TRANSACTION;

INSERT INTO Faculty VALUES (204, 'Dr Nair', 'Cloud Computing', 1);

SAVEPOINT after_faculty_insert;

INSERT INTO Timetable VALUES
  (604, 'Thursday', '12:00-13:00', 'C301', 204, 401);

SAVEPOINT after_timetable_insert;

-- Step 3: Invalid insert commented (FK violation)
-- INSERT INTO Result VALUES (809, 82, 'A', 8.2, 101, 999);

ROLLBACK;

SELECT * FROM Faculty WHERE FacultyID = 204;

-- ============================================================
-- 5.4 Concurrency Control - Locking Examples
-- ============================================================

-- Row-level locking example
START TRANSACTION;
SELECT * FROM Result WHERE StudentID = 101 FOR UPDATE;
UPDATE Result SET Marks = 90, Grade = 'A+' WHERE StudentID = 101 AND ExamID = 701;
COMMIT;

SELECT 'Transactions and Concurrency Control executed successfully!' AS Status;
