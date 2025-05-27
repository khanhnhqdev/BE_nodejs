import db from '../database/index';
import { RowDataPacket } from 'mysql2';

export const register = async (teacher: string, students: string[]) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const [teacherRows]: any = await connection.query('SELECT id FROM teachers WHERE email = ?', [teacher]);
        const teacherId = teacherRows[0]?.id;
        if (!teacherId) throw new Error('Teacher not found');

        for (const student of students) {
            await connection.query('INSERT IGNORE INTO students (email) VALUES (?)', [student]);
            const [studentRows]: any = await connection.query('SELECT id FROM students WHERE email = ?', [student]);
            const studentId = studentRows[0]?.id;
            if (!studentId) throw new Error(`Student not found or insert failed for ${student}`);
            await connection.query('INSERT IGNORE INTO registrations (teacher_id, student_id) VALUES (?, ?)', [teacherId, studentId]);
        }

        await connection.commit();
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
};

export const findCommonStudents = async (teachers: string[]): Promise<string[]> => {
    if (!teachers.length) return [];

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

    const [rows] = await db.query<RowDataPacket[]>(sql, [...teachers, teachers.length]);
    return rows.map((row) => row.email);
};

export const checkStudentExists = async (studentEmail: string): Promise<boolean> => {
    const [rows]: any = await db.query('SELECT id FROM students WHERE email = ?', [studentEmail]);
    return rows.length > 0;
};

export const suspend = async (student: string) => {
    await db.query('UPDATE students SET suspended = TRUE WHERE email = ?', [student]);
};

export const getRecipients = async (teacher: string, mentioned: string[]): Promise<string[]> => {
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
};