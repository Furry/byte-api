module.exports = {
    Client: require("./constructors/Client")
}

module.exports.Isolated = {
    checkName: require("./isolated").checkName
}