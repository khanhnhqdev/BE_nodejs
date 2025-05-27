import * as teacherService from '../service/teacher.service';
import * as repository from '../repository/teacher.repository';

jest.mock('../repository/teacher.repository');

const mockRegister = repository.register as jest.Mock;
const mockFindCommonStudents = repository.findCommonStudents as jest.Mock;
const mockCheckStudentExists = repository.checkStudentExists as jest.Mock;
const mockSuspend = repository.suspend as jest.Mock;
const mockGetRecipients = repository.getRecipients as jest.Mock;

describe('registerStudents', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should call repo.register with correct params', async () => {
		const payload = {
			teacher: 'teacherken@gmail.com',
			students: ['student1@gmail.com', 'student2@gmail.com'],
		};

		await teacherService.registerStudents(payload);

		expect(mockRegister).toHaveBeenCalledWith(payload.teacher, payload.students);
	});

	it('should throw BadRequestError if payload is invalid', async () => {
		await expect(teacherService.registerStudents({ teacher: '', students: [] }))
			.rejects
			.toThrow('Invalid payload');
	});

	it('should throw error if teacher is missing', async () => {
		const payload = {
			teacher: '',
			students: ['student1@gmail.com'],
		};

		await expect(teacherService.registerStudents(payload)).rejects.toThrow('Invalid payload');
	});

	it('should throw error if students array is empty', async () => {
		const payload = {
			teacher: 'teacherken@gmail.com',
			students: [],
		};

		await expect(teacherService.registerStudents(payload)).rejects.toThrow('Invalid payload');
	});

	it('should throw error if repo throws error', async () => {
		const payload = {
			teacher: 'teacherken@gmail.com',
			students: ['student1@gmail.com'],
		};

		mockRegister.mockRejectedValue(new Error('DB error'));

		await expect(teacherService.registerStudents(payload)).rejects.toThrow('DB error');
	});
});


describe('getCommonStudents', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should call findCommonStudents with array of teachers', async () => {
		const query = { teacher: ['t1@email.com', 't2@email.com'] };
		const mockResult = ['student1@email.com'];

		mockFindCommonStudents.mockResolvedValue(mockResult);

		const result = await teacherService.getCommonStudents(query);

		expect(mockFindCommonStudents).toHaveBeenCalledWith(query.teacher);
		expect(result).toEqual(mockResult);
	});

	it('should wrap single teacher into array and call findCommonStudents', async () => {
		const query = { teacher: 't1@email.com' };
		const mockResult = ['student1@email.com'];

		mockFindCommonStudents.mockResolvedValue(mockResult);

		const result = await teacherService.getCommonStudents(query);

		expect(mockFindCommonStudents).toHaveBeenCalledWith(['t1@email.com']);
		expect(result).toEqual(mockResult);
	});

	it('should throw if teacher param is missing', async () => {
		await expect(teacherService.getCommonStudents({ teacher: '' })).rejects.toThrow(
			'Teacher email required'
		);
	});
});

describe('suspendStudent', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should call checkStudentExists and suspend if exists', async () => {
		mockCheckStudentExists.mockResolvedValue(true);
		mockSuspend.mockResolvedValue(undefined);

		await teacherService.suspendStudent('student@email.com');

		expect(mockCheckStudentExists).toHaveBeenCalledWith('student@email.com');
		expect(mockSuspend).toHaveBeenCalledWith('student@email.com');
	});

	it('should throw if email is missing', async () => {
		await expect(teacherService.suspendStudent('')).rejects.toThrow('Student email is required');
	});

	it('should throw if student does not exist', async () => {
		mockCheckStudentExists.mockResolvedValue(false);

		await expect(teacherService.suspendStudent('nonexist@email.com')).rejects.toThrow(
			'Student nonexist@email.com not found'
		);
	});
});

describe('getNotificationRecipients', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should extract mentioned emails and call getRecipients', async () => {
		const input = {
			teacher: 'teacher@email.com',
			notification: 'Hello students! @student1@email.com @student2@email.com',
		};

		const expectedEmails = ['student1@email.com', 'student2@email.com'];
		const expectedResult = ['student1@email.com', 'student2@email.com'];

		mockGetRecipients.mockResolvedValue(expectedResult);

		const result = await teacherService.getNotificationRecipients(input);

		expect(mockGetRecipients).toHaveBeenCalledWith(input.teacher, expectedEmails);
		expect(result).toEqual(expectedResult);
	});

	it('should work with no mentions and return result from getRecipients', async () => {
		const input = {
			teacher: 'teacher@email.com',
			notification: 'No one is mentioned here.',
		};

		mockGetRecipients.mockResolvedValue([]);

		const result = await teacherService.getNotificationRecipients(input);

		expect(mockGetRecipients).toHaveBeenCalledWith(input.teacher, []);
		expect(result).toEqual([]);
	});

	it('should throw if teacher or notification is missing', async () => {
		await expect(
			teacherService.getNotificationRecipients({ teacher: '', notification: '' })
		).rejects.toThrow('Invalid payload');
	});

	it('should remove duplicate mentioned emails', async () => {
		const input = {
			teacher: 'teacher@email.com',
			notification: 'Hi @s1@email.com again @s1@email.com',
		};

		const expectedUniqueEmails = ['s1@email.com'];

		mockGetRecipients.mockResolvedValue(expectedUniqueEmails);

		const result = await teacherService.getNotificationRecipients(input);

		expect(mockGetRecipients).toHaveBeenCalledWith(input.teacher, expectedUniqueEmails);
		expect(result).toEqual(expectedUniqueEmails);
	});
});