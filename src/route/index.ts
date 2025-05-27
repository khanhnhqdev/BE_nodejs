import { Router } from 'express';
import {
	registerStudents,
	getCommonStudents,
	suspendStudent,
	getNotificationRecipients,
} from '../controller/teacher.controller';

const router = Router();

router.post('/register', registerStudents);
router.get('/commonstudents', getCommonStudents);
router.post('/suspend', suspendStudent);
router.post('/retrievefornotifications', getNotificationRecipients);

export default router;