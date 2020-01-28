const Errors = require("../constructors/error")
const fetch = require("node-fetch")
const fs = require("fs")


function resolveBufferFromURL(url) {
    return new Promise((resolve, reject) => {
        if (url.indexOf("://") > 0 || url.indexOf("//") === 0) {
            fetch(url)
            .catch((err) => { throw err })
            .then((res) => {
                if (res.status == 200) {
                    res.buffer().then((buffer) => resolve(buffer))
                }
                else reject (new Errors.UtilityError(`Failed to resolve buffer from the site ${url}`))
            })
        } else {
            fs.readFile(url, (err, data) => {
                if (err) reject(err)
                else resolve(data)
            })
        }
    })
}

module.exports = {
    resolveBufferFromURL: resolveBufferFromURL
}