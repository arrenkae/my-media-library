import knex from 'knex';
import dotenv from 'dotenv';
dotenv.config();

export const db = knex({
    client: 'sqlite3',
    connection: {
      filename: './db.sqlite3',
    }
});