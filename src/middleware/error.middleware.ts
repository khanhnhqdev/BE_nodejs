import { Request, Response, NextFunction } from "express";

export class BadRequestError extends Error {
	status = 400;
	constructor(message: string) {
		super(message);
		this.name = "BadRequestError";
	}
}

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
	console.error(err);
	res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
};
