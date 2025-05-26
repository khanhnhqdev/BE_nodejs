import { Request, Response, NextFunction } from 'express';
import * as teacherService from '../service/teacher.service';
import { GetNotificationRecipientsRequest, RegisterStudentsRequest, SuspendStudentRequest } from '../controller/request';
import { GetNotificationRecipientsResponse } from './response';

export const registerStudents = async (req: Request<{}, {}, RegisterStudentsRequest>, res: Response, next: NextFunction) => {
  try {
    await teacherService.registerStudents(req.body);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const getCommonStudents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const students = await teacherService.getCommonStudents(req.query);
    res.json({ students });
  } catch (err) {
    next(err);
  }
};

export const suspendStudent = async (
  req: Request<{}, {}, SuspendStudentRequest>,
  res: Response,
  next: NextFunction
) => {
  try {
    await teacherService.suspendStudent(req.body.student);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const getNotificationRecipients = async (
  req: Request<{}, {}, GetNotificationRecipientsRequest>,
  res: Response<GetNotificationRecipientsResponse>,
  next: NextFunction
) => {
  try {
    const recipients = await teacherService.getNotificationRecipients(req.body);
    res.status(200).json({ recipients });
  } catch (err) {
    next(err);
  }
};