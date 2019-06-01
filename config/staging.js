module.exports = {
    "host": "staging.incommon.dev",
    "protocol": "https",
    "port": "4040",
    "postgres": process.env.POSTGRES_CONNECTION,
    "cors": {
        "origin": "https://www.incommon.dev"
    }
}