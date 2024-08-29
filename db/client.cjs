const {Client}= require('pg');
require('dotenv').config();

const client= new Client(process.env.DATABASE_URL || "postgres://vougi:Strong4hold!@localhost:5432/endure_the_lost_realm");

module.exports= client;