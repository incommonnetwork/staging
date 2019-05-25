
const postgres = (process.env.TEST_ENV === 'dev') ? "postgres://incommon:incommon@localhost:5432/incommon" : process.env.POSTGRES_CONNECTION

module.exports = {
    "host": "localhost",
    "port": 3030,
    "public": "../public/",
    "paginate": {
        "default": 10,
        "max": 50
    },
    postgres
}
