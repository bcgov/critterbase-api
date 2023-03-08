import { PrismaClient } from "@prisma/client";

interface GenRandomUUID {
    gen_random_uuid: string
}

async function queryRandomUUID(prisma: PrismaClient): Promise<string> {
    const cryptoResult: GenRandomUUID[] = await prisma.$queryRaw`SELECT crypto.gen_random_uuid()`;
    return cryptoResult[0].gen_random_uuid;
}

export {queryRandomUUID}