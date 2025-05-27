import { BadRequestError } from '../middleware/error.middleware';
import { RegisterStudentsRequest, GetNotificationRecipientsRequest } from '../controller/request';
import { TeacherRepository } from '../repository/teacher.repository';

export class TeacherService {
	private repository: TeacherRepository;

	constructor() {
		// TODO: Replace manual instantiation with dependency injection
		this.repository = new TeacherRepository();
	}

	public async registerStudents({ teacher, students }: RegisterStudentsRequest): Promise<void> {
		// Validate payload
		if (!teacher || !Array.isArray(students) || students.length === 0) {
			throw new BadRequestError('Invalid payload');
		}
		await this.repository.register(teacher, students);
	}

	public async getCommonStudents(query: any): Promise<string[]> {
		// Normalize input
		const teachers = Array.isArray(query.teacher) ? query.teacher : [query.teacher];

		// Validate payload
		if (!teachers[0]) {
			throw new BadRequestError('Teacher email required');
		}
		return await this.repository.findCommonStudents(teachers);
	}

	public async suspendStudent(studentEmail: string): Promise<void> {
		// Validate payload
		if (!studentEmail) {
			throw new BadRequestError('Student email is required');
		}

		// Check if student exists
		const exists = await this.repository.checkStudentExists(studentEmail);
		if (!exists) {
			throw new BadRequestError(`Student ${studentEmail} not found`);
		}

		await this.repository.suspendStudent(studentEmail);
	}

	public async getNotificationRecipients({
		teacher,
		notification,
	}: GetNotificationRecipientsRequest): Promise<string[]> {
		// Validate payload
		if (!teacher || !notification) {
			throw new BadRequestError('Invalid payload');
		}

		// Extracts mentioned emails with two '@' symbols and a '.' (e.g. @user@example.com).
		// Matches valid email patterns mentioned after '@' in the text.
		const mentionedEmails = [
			...new Set(notification.match(/(?<=@)[^\s@]+@[^\s@]+\.[^\s@]+/g) || []),
		];

		return await this.repository.getRecipients(teacher, mentionedEmails);
	}
}
