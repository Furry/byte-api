module.exports = {
    Client: require("./constructors/client")
}

module.exports.Isolated = {
    checkName: require("./isolated").checkName
}