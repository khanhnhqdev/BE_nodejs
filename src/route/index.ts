import { Router } from 'express';
import { TeacherController } from '../controller/teacher.controller';

const router = Router();
const teacherController = new TeacherController(); // TODO: Inject this later

router.post('/register', teacherController.registerStudents);
router.get('/commonstudents', teacherController.getCommonStudents);
router.post('/suspend', teacherController.suspendStudent);
router.post('/retrievefornotifications', teacherController.getNotificationRecipients);

export default router;