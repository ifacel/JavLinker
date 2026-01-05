export class Result { }

export class Ok extends Result {
    data
    constructor(data) {
        super()
        this.data = data
    }
}

export class Error extends Result {
    message
    constructor(message) {
        super()
        this.message = message
    }
}

export class UnknownError extends Result{
    message
    constructor(message){
        super()
        this.message = message
    }
}