export interface ITeacherRepository {
	register(teacher: string, students: string[]): Promise<void>;
	findCommonStudents(teachers: string[]): Promise<string[]>;
	checkStudentExists(studentEmail: string): Promise<boolean>;
	suspendStudent(student: string): Promise<void>;
	getRecipients(teacher: string, mentioned: string[]): Promise<string[]>;
}
