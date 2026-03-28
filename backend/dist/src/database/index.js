"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../generated/prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const adapter = new adapter_pg_1.PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new client_1.PrismaClient({ adapter });
prisma
    .$connect()
    .then(() => {
    console.log('📦 Successfully connected with database');
})
    .catch((error) => {
    console.log('❌ Error connecting to database', error);
});
exports.default = prisma;
