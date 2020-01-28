module.exports.APIError = class extends Error {
    constructor(message) {
        super(message)

        this.name = "API Error"

    }
}

module.exports.UtilityError = class extends Error {
    constructor(message) {
        super(message)

        this.name = "UtilError"
        
    }
}