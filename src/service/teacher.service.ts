import * as repo from '../repository/teacher.repository';
import { BadRequestError } from '../middleware/error.middleware';
import { RegisterStudentsRequest, GetNotificationRecipientsRequest } from '../controller/request';


export const registerStudents = async ({ teacher, students }: RegisterStudentsRequest) => {
  if (!teacher || !students || !Array.isArray(students)) throw new BadRequestError('Invalid payload');
  await repo.register(teacher, students);
};

export const getCommonStudents = async (query: any) => {
  const teachers = Array.isArray(query.teacher) ? query.teacher : [query.teacher];
  if (!teachers[0]) throw new BadRequestError('Teacher email required');
  return await repo.findCommonStudents(teachers);
};

export const suspendStudent = async (studentEmail: string) => {
  if (!studentEmail) throw new BadRequestError('Student email is required');

  const exists = await repo.checkStudentExists(studentEmail);
  if (!exists) throw new BadRequestError(`Student ${studentEmail} not found`);

  await repo.suspend(studentEmail);
};


export const getNotificationRecipients = async ({
  teacher,
  notification,
}: GetNotificationRecipientsRequest): Promise<string[]> => {
  if (!teacher || !notification) {
    throw new BadRequestError('Invalid payload');
  }

  // Extract all emails mentioned using a more general regex
  const mentionedEmails = [
    ...new Set(notification.match(/(?<=@)[^\s@]+@[^\s@]+\.[^\s@]+/g) || []),
  ];

  return await repo.getRecipients(teacher, mentionedEmails);
};