import { TeacherService } from '../service/teacher.service';
import { TeacherRepository } from '../repository/teacher.repository';

jest.mock('../repository/teacher.repository');

describe('TeacherService', () => {
    let repository: jest.Mocked<TeacherRepository>;
    let service: TeacherService;

    beforeEach(() => {
        // Create a mocked instance of TeacherRepository
        repository = new TeacherRepository() as jest.Mocked<TeacherRepository>;
        // Clear all mock calls and implementations before each test to avoid interference
        jest.clearAllMocks();

        service = new TeacherService(repository);
    });

    describe('registerStudents', () => {
        it('should call repo.register with correct params', async () => {
            const payload = {
                teacher: 'teacherken@gmail.com',
                students: ['student1@gmail.com', 'student2@gmail.com'],
            };

            await service.registerStudents(payload);

            expect(repository.register).toHaveBeenCalledWith(payload.teacher, payload.students);
        });

        it('should throw BadRequestError if payload is invalid', async () => {
            await expect(service.registerStudents({ teacher: '', students: [] }))
                .rejects
                .toThrow('Invalid payload');
        });

        it('should throw error if repo throws error', async () => {
            const payload = {
                teacher: 'teacherken@gmail.com',
                students: ['student1@gmail.com'],
            };

            repository.register.mockRejectedValue(new Error('DB error'));
            await expect(service.registerStudents(payload)).rejects.toThrow('DB error');
        });
    });

    describe('getCommonStudents', () => {
        it('should call findCommonStudents with array of teachers', async () => {
            const query = { teacher: ['t1@email.com', 't2@email.com'] };
            const mockResult = ['student1@email.com'];

            repository.findCommonStudents.mockResolvedValue(mockResult);
            const result = await service.getCommonStudents(query);

            expect(repository.findCommonStudents).toHaveBeenCalledWith(query.teacher);
            expect(result).toEqual(mockResult);
        });

        it('should wrap single teacher into array and call findCommonStudents', async () => {
            const query = { teacher: 't1@email.com' };
            const mockResult = ['student1@email.com'];

            repository.findCommonStudents.mockResolvedValue(mockResult);
            const result = await service.getCommonStudents(query);

            expect(repository.findCommonStudents).toHaveBeenCalledWith(['t1@email.com']);
            expect(result).toEqual(mockResult);
        });

        it('should throw if teacher param is missing', async () => {
            await expect(service.getCommonStudents({ teacher: '' }))
                .rejects
                .toThrow('Teacher email required');
        });
    });

    describe('suspendStudent', () => {
        it('should call checkStudentExists and suspend if exists', async () => {
            repository.checkStudentExists.mockResolvedValue(true);
            repository.suspendStudent.mockResolvedValue(undefined);

            await service.suspendStudent('student@email.com');

            expect(repository.checkStudentExists).toHaveBeenCalledWith('student@email.com');
            expect(repository.suspendStudent).toHaveBeenCalledWith('student@email.com');
        });

        it('should throw if email is missing', async () => {
            await expect(service.suspendStudent('')).rejects.toThrow('Student email is required');
        });

        it('should throw if student does not exist', async () => {
            repository.checkStudentExists.mockResolvedValue(false);
            await expect(service.suspendStudent('nonexist@email.com'))
                .rejects
                .toThrow('Student nonexist@email.com not found');
        });
    });

    describe('getNotificationRecipients', () => {
        it('should extract mentioned emails and call getRecipients', async () => {
            const input = {
                teacher: 'teacher@email.com',
                notification: 'Hello students! @student1@email.com @student2@email.com @khanhemailwrong',
            };

            const expectedEmails = ['student1@email.com', 'student2@email.com'];
            const expectedResult = ['student1@email.com', 'student2@email.com'];

            repository.getRecipients.mockResolvedValue(expectedResult);
            const result = await service.getNotificationRecipients(input);

            expect(repository.getRecipients).toHaveBeenCalledWith(input.teacher, expectedEmails);
            expect(result).toEqual(expectedResult);
        });

        it('should work with no mentions and return result from getRecipients', async () => {
            const input = {
                teacher: 'teacher@email.com',
                notification: 'No one is mentioned here.',
            };

            repository.getRecipients.mockResolvedValue([]);
            const result = await service.getNotificationRecipients(input);

            expect(repository.getRecipients).toHaveBeenCalledWith(input.teacher, []);
            expect(result).toEqual([]);
        });

        it('should throw if teacher or notification is missing', async () => {
            await expect(
                service.getNotificationRecipients({ teacher: '', notification: '' })
            ).rejects.toThrow('Invalid payload');
        });

        it('should remove duplicate mentioned emails', async () => {
            const input = {
                teacher: 'teacher@email.com',
                notification: 'Hi @s1@email.com again @s1@email.com',
            };

            const expectedUniqueEmails = ['s1@email.com'];

            repository.getRecipients.mockResolvedValue(expectedUniqueEmails);
            const result = await service.getNotificationRecipients(input);

            expect(repository.getRecipients).toHaveBeenCalledWith(input.teacher, expectedUniqueEmails);
            expect(result).toEqual(expectedUniqueEmails);
        });
    });
});
