import { Request, Response } from "express";

export interface TypedRequest<T> extends Request {
	body: T;
}

export interface TypedResponse<T> extends Response {
	json: (body: T) => this;
}

export interface Student {
	id: number;
	email: string;
	suspended: boolean;
	created_at: string;
}

export interface Teacher {
	id: number;
	email: string;
	created_at: string;
}
