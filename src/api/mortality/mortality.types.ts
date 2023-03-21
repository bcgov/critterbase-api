import { Prisma } from "@prisma/client";

const mortalityInclude = Prisma.validator<Prisma.mortalityArgs>()({
    include: {
        location: {
        }
    }
})