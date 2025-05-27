export interface RegisterStudentsRequest {
	teacher: string;
	students: string[];
}

export interface SuspendStudentRequest {
	student: string;
}


export interface GetNotificationRecipientsRequest {
	teacher: string;
	notification: string;
}
