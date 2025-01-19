class Result { }

class Ok extends Result {
    data
    constructor(data) {
        super()
        this.data = data
    }
}

class Error extends Result {
    message
    constructor(message) {
        super()
        this.message = message
    }
}