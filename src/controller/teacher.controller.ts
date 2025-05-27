import { Request, Response, NextFunction } from 'express';
import { GetNotificationRecipientsRequest, RegisterStudentsRequest, SuspendStudentRequest } from '../controller/request';
import { GetNotificationRecipientsResponse } from './response';
import { TeacherService } from '../service/teacher.service';
import { MySQLTeacherRepository } from '../repository/mysql.teacher.repository';

export class TeacherController {
	private teacherService: TeacherService;

	constructor() {
    	// TODO: Replace manual instantiation with dependency injection framework
    	const repository = new MySQLTeacherRepository();
    	this.teacherService = new TeacherService(repository);  
  }

	public registerStudents = async (req: Request<{}, {}, RegisterStudentsRequest>, res: Response, next: NextFunction) => {
		try {
			await this.teacherService.registerStudents(req.body);
			res.status(204).send();
		} catch (err) {
			next(err);
		}
	};

	public getCommonStudents = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const students = await this.teacherService.getCommonStudents(req.query);
			res.json({ students });
		} catch (err) {
			next(err);
		}
	};

	public suspendStudent = async (req: Request<{}, {}, SuspendStudentRequest>, res: Response, next: NextFunction) => {
		try {
			await this.teacherService.suspendStudent(req.body.student);
			res.status(204).send();
		} catch (err) {
			next(err);
		}
	};

	public getNotificationRecipients = async (
		req: Request<{}, {}, GetNotificationRecipientsRequest>,
		res: Response<GetNotificationRecipientsResponse>,
		next: NextFunction
	) => {
		try {
			const recipients = await this.teacherService.getNotificationRecipients(req.body);
			res.status(200).json({ recipients });
		} catch (err) {
			next(err);
		}
	};
}