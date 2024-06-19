interface apiErrorInterface {
    statusCode: number, 
    message: string,
    data?: string,
    error?: string[]
    success: boolean
}

class ApiError extends Error implements apiErrorInterface {

    statusCode: number
    message: string
    data: string
    error: string[]
    success: boolean

    constructor(statusCode: number, message: string = "Something went wrong", data: string = '', error: string[] = [], success: boolean = false, stack: string = ''){
        super(message)
        this.statusCode = statusCode, 
        this.message = message, 
        this.data = data,
        this.error = error
        this.success = success

        if(stack) this.stack = stack
        else Error.captureStackTrace(this, this.constructor)
    }
}

export default ApiError