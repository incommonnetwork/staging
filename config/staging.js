module.exports = {
    "host": "staging.incommon.dev",
    "port": "4040",
    "postgres": process.env.POSTGRES_CONNECTION,
    "cors": {
        "origin": "https://www.incommon.dev"
    }
}