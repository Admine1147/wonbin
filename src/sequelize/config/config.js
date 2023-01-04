const dotenv = require("dotenv");
dotenv.config({path: `${__dirname}/../../../.env`});

const env = process.env;

const development = {
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_DATABASE,
    host: env.DB_HOST,
    dialect: "mysql",
    port: env.DB_PORT,
    logging: false 
};

const production = {
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_DATABASE,
    host: env.DB_HOST,
    dialect: "mysql",
    port: env.DB_PORT
}

const test = {
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_DATABASE_TEST,
    host: env.DB_HOST,
    dialect: "mysql",
    port: env.DB_PORT
}


module.exports = { development, production, test };
