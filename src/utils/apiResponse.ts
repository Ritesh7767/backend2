interface apiResponseInterface {
    statusCode: number,
    data: object,
    message: string,
    success: boolean
}

class ApiResponse implements apiResponseInterface {
    statusCode: number;
    data: object
    message: string
    success: boolean

    constructor(statusCode: number, data: object, message: string = "Task completed successfully"){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
}

export default ApiResponse