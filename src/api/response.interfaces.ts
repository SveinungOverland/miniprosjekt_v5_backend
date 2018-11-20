import { User, Comment, News, Category } from './models.public'

export enum StatusCodes {
    OK = 200,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    NOT_FOUND = 404,
    CONFLICT = 409,
    SERVER_ERROR = 500
}


interface ApiResponse {
    status: StatusCodes,
    status_message: string,
    token?: string
}

export const simpleApiResponse = 
    (status: StatusCodes, status_message: string, token?: string): ApiResponse => 
    ({status: status, status_message: status_message, token: token})


export class ErrorResponse {
    static create(status: StatusCodes, status_message: string): ApiResponse {
        return { status: status, status_message: status_message }
    }
}


export class DataResponse<T> implements ApiResponse {
    status: StatusCodes
    status_message: string
    data: T
    token?: string
    constructor(data: T, token?: string) {
        this.status = StatusCodes.OK
        this.status_message = "Data retrieved successfully"
        this.data = data
        this.token = token
    }

    addToken = (token: string) => this.token = token
}


export class UserResponse extends DataResponse<User> { }

export class CommentResponse extends DataResponse<Comment> { }

export class NewsResponse extends DataResponse<News> { }

export class NewsArrayResponse extends DataResponse<News[]> { }

export class CategoryArrayResponse extends DataResponse<Category[]> { }