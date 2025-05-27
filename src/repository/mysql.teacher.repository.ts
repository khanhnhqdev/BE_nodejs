import db from '../database/index';
import { RowDataPacket } from 'mysql2';
import { ITeacherRepository } from './teacher.repository.interface';

export class MySQLTeacherRepository implements ITeacherRepository {

	public async register(teacher: string, students: string[]): Promise<void> {
		const connection = await db.getConnection();
		try {
			await connection.beginTransaction();

			// Get teacher ID from email
			// Todo: map row to TypeScript interfaces like  `Teacher` if data structure becomes more complex or needs strict typing
			const [teacherRows]: any = await connection.query('SELECT id FROM teachers WHERE email = ?', [teacher]);
			const teacherId = teacherRows[0]?.id;
			if (!teacherId) throw new Error('Teacher not found');

			for (const student of students) {
				// Insert student if not exists
				await connection.query('INSERT IGNORE INTO students (email) VALUES (?)', [student]);
				const [studentRows]: any = await connection.query('SELECT id FROM students WHERE email = ?', [student]);
				
				// Get student ID
				const studentId = studentRows[0]?.id;
				if (!studentId) {
					throw new Error(`Student not found or insert failed for ${student}`);
				}
				
				// Insert registration if not exists
				await connection.query(
					'INSERT IGNORE INTO registrations (teacher_id, student_id) VALUES (?, ?)',
					[teacherId, studentId]
				);
			}

			await connection.commit();
		} catch (err) {
			await connection.rollback();
			throw err;
		} finally {
			connection.release();
		}
	}

	public async findCommonStudents(teachers: string[]): Promise<string[]> {
		if (!teachers.length) return [];

		// use GROUP BY + HAVING to ensure student appears for all teachers
		const placeholders = teachers.map(() => '?').join(',');
		const sql = `
			SELECT s.email 
			FROM students s
			JOIN registrations r ON r.student_id = s.id
			JOIN teachers t ON t.id = r.teacher_id
			WHERE t.email IN (${placeholders})
			GROUP BY s.email
			HAVING COUNT(DISTINCT t.id) = ?
		`;

		//  Return students who are registered to ALL given teachers
		const [rows] = await db.query<RowDataPacket[]>(sql, [...teachers, teachers.length]);
		return rows.map((row) => row.email);
	}

	public async checkStudentExists(studentEmail: string): Promise<boolean> {
		// Todo: consider mapping the result to a Student interface if needed
		const [rows]: any = await db.query('SELECT id FROM students WHERE email = ?', [studentEmail]);
		return rows.length > 0;
	}

	public async suspendStudent(student: string): Promise<void> {
		await db.query('UPDATE students SET suspended = TRUE WHERE email = ?', [student]);
	}

	public async getRecipients(teacher: string, mentioned: string[]): Promise<string[]> {
		// Students registered under the teacher and not suspended
		// Union with students explicitly mentioned in @ format and not suspended
		// Todo: consider mapping the result to a Student interface if needed
		const sql = `
			SELECT DISTINCT s.email
			FROM students s
			JOIN registrations r ON r.student_id = s.id
			JOIN teachers t ON t.id = r.teacher_id
			WHERE t.email = ? AND s.suspended = FALSE
			UNION
			SELECT DISTINCT email FROM students WHERE email IN (?) AND suspended = FALSE
		`;

		const [rows]: any[] = await db.query(sql, [teacher, mentioned.length ? mentioned : ['']]);
		return rows.map((row: any) => row.email);
	}
}
