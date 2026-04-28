-- ============================================================
-- CHAPTER 3 (continued): Views, Triggers, Cursors
-- ============================================================
USE university_erpsystem;

-- ============================================================
-- 3.6 Views
-- ============================================================

-- 3.6.1: Student Result View
CREATE OR REPLACE VIEW Student_Result_View AS
SELECT s.StudentID, s.Name AS Student_Name,
       sub.SubjectName, r.Marks, r.Grade, r.GPA
FROM Student s
JOIN Enrollment e ON s.StudentID = e.StudentID
JOIN Subject sub ON e.SubjectID = sub.SubjectID
JOIN Exam ex ON sub.SubjectID = ex.SubjectID
JOIN Result r ON s.StudentID = r.StudentID AND ex.ExamID = r.ExamID;

SELECT * FROM Student_Result_View;

-- 3.6.2: Timetable View
CREATE OR REPLACE VIEW Timetable_View AS
SELECT f.FacultyName, sub.SubjectName,
       t.Day, t.TimeSlot, t.RoomNo
FROM Faculty f
JOIN Timetable t ON f.FacultyID = t.FacultyID
JOIN Subject sub ON t.SubjectID = sub.SubjectID;

SELECT * FROM Timetable_View ORDER BY Day;

-- 3.6.3: Department Summary View
CREATE OR REPLACE VIEW Dept_Summary_View AS
SELECT d.DeptName,
       COUNT(DISTINCT s.StudentID) AS Total_Students,
       ROUND(AVG(r.GPA), 2) AS Average_GPA
FROM Department d
LEFT JOIN Student s ON d.DeptID = s.DeptID
LEFT JOIN Result r ON s.StudentID = r.StudentID
GROUP BY d.DeptName;

SELECT * FROM Dept_Summary_View;

-- ============================================================
-- 3.7 Triggers
-- ============================================================

-- 3.7.1: Auto-assign Grade based on Marks
DROP TRIGGER IF EXISTS trg_assign_grade;
DELIMITER //
CREATE TRIGGER trg_assign_grade
BEFORE INSERT ON Result
FOR EACH ROW
BEGIN
  IF NEW.Marks >= 90 THEN
    SET NEW.Grade = 'A+';
  ELSEIF NEW.Marks >= 80 THEN
    SET NEW.Grade = 'A';
  ELSEIF NEW.Marks >= 70 THEN
    SET NEW.Grade = 'B';
  ELSEIF NEW.Marks >= 60 THEN
    SET NEW.Grade = 'C';
  ELSE
    SET NEW.Grade = 'F';
  END IF;
END //
DELIMITER ;

-- 3.7.2: Enrollment Audit Log
CREATE TABLE IF NOT EXISTS Enrollment_Log (
  LogID INT AUTO_INCREMENT PRIMARY KEY,
  EnrollID INT,
  OldStatus VARCHAR(20),
  NewStatus VARCHAR(20),
  ChangedAt DATETIME
);

DROP TRIGGER IF EXISTS trg_enrollment_update;
DELIMITER //
CREATE TRIGGER trg_enrollment_update
AFTER UPDATE ON Enrollment
FOR EACH ROW
BEGIN
  IF OLD.Status <> NEW.Status THEN
    INSERT INTO Enrollment_Log (EnrollID, OldStatus, NewStatus, ChangedAt)
    VALUES (OLD.EnrollID, OLD.Status, NEW.Status, NOW());
  END IF;
END //
DELIMITER ;

-- Test enrollment update trigger
UPDATE Enrollment SET Status = 'Inactive' WHERE EnrollID = 501;
SELECT * FROM Enrollment_Log;

-- 3.7.3: Prevent deletion of student with results
DROP TRIGGER IF EXISTS trg_prevent_student_delete;
DELIMITER //
CREATE TRIGGER trg_prevent_student_delete
BEFORE DELETE ON Student
FOR EACH ROW
BEGIN
  DECLARE result_count INT;
  SELECT COUNT(*) INTO result_count
  FROM Result WHERE StudentID = OLD.StudentID;
  IF result_count > 0 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Cannot delete student with existing results.';
  END IF;
END //
DELIMITER ;

-- ============================================================
-- 3.8 Cursors
-- ============================================================

-- 3.8.1: Display Student GPA using Cursor
DROP PROCEDURE IF EXISTS proc_display_student_gpa;
DELIMITER //
CREATE PROCEDURE proc_display_student_gpa()
BEGIN
  DECLARE done INT DEFAULT 0;
  DECLARE v_name VARCHAR(50);
  DECLARE v_gpa FLOAT;
  DECLARE cur_student CURSOR FOR
    SELECT s.Name, r.GPA
    FROM Student s JOIN Result r ON s.StudentID = r.StudentID;
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

  OPEN cur_student;
  read_loop: LOOP
    FETCH cur_student INTO v_name, v_gpa;
    IF done THEN LEAVE read_loop; END IF;
    SELECT v_name AS Student_Name, v_gpa AS GPA;
  END LOOP;
  CLOSE cur_student;
END //
DELIMITER ;

CALL proc_display_student_gpa();

-- 3.8.2: Update GPA using Cursor
DROP PROCEDURE IF EXISTS proc_update_gpa;
DELIMITER //
CREATE PROCEDURE proc_update_gpa()
BEGIN
  DECLARE done INT DEFAULT 0;
  DECLARE v_result_id INT;
  DECLARE v_marks INT;
  DECLARE cur_result CURSOR FOR
    SELECT ResultID, Marks FROM Result;
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

  OPEN cur_result;
  update_loop: LOOP
    FETCH cur_result INTO v_result_id, v_marks;
    IF done THEN LEAVE update_loop; END IF;
    UPDATE Result
    SET GPA = ROUND(v_marks / 10.0, 1)
    WHERE ResultID = v_result_id;
  END LOOP;
  CLOSE cur_result;
END //
DELIMITER ;

CALL proc_update_gpa();
SELECT ResultID, Marks, GPA FROM Result;

-- 3.8.3: Faculty Schedule Summary using Cursor
CREATE TABLE IF NOT EXISTS Faculty_Schedule_Summary (
  SummaryID INT AUTO_INCREMENT PRIMARY KEY,
  FacultyName VARCHAR(50),
  SubjectName VARCHAR(50),
  TeachingDay VARCHAR(20)
);

DROP PROCEDURE IF EXISTS proc_faculty_schedule;
DELIMITER //
CREATE PROCEDURE proc_faculty_schedule()
BEGIN
  DECLARE done INT DEFAULT 0;
  DECLARE v_fname VARCHAR(50);
  DECLARE v_subname VARCHAR(50);
  DECLARE v_day VARCHAR(20);
  DECLARE cur_schedule CURSOR FOR
    SELECT f.FacultyName, sub.SubjectName, t.Day
    FROM Faculty f
    JOIN Timetable t ON f.FacultyID = t.FacultyID
    JOIN Subject sub ON t.SubjectID = sub.SubjectID;
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

  OPEN cur_schedule;
  sched_loop: LOOP
    FETCH cur_schedule INTO v_fname, v_subname, v_day;
    IF done THEN LEAVE sched_loop; END IF;
    INSERT INTO Faculty_Schedule_Summary
      (FacultyName, SubjectName, TeachingDay)
    VALUES (v_fname, v_subname, v_day);
  END LOOP;
  CLOSE cur_schedule;
END //
DELIMITER ;

CALL proc_faculty_schedule();
SELECT * FROM Faculty_Schedule_Summary;

SELECT 'Views, Triggers, and Cursors created successfully!' AS Status;
