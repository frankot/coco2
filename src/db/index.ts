import { PrismaClient } from "../app/generated/prisma";

// Use PrismaClient from the correct generated location
const prisma = new PrismaClient();

// Remove the main function that's causing issues
// This should be in a separate script, not in the module

export default prisma;
