// import { PrismaClient } from "@prisma/client";
// declare global {
//     // eslint-disable-next-line no-var
//     var prisma : PrismaClient | undefined
// }

// const prisma = global.prisma || new PrismaClient();

// if(process.env.NODE_ENV !== 'production') global.prisma = prisma

// export default prisma


import { PrismaClient } from "@prisma/client"
 
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
 
const prisma = globalForPrisma.prisma || new PrismaClient()
 
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export default prisma;