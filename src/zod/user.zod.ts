import * as zod from "zod";

export const userRegisterValidation = zod.object({
    username: zod.string(),
    email: zod.string().email(),
    password: zod.string().min(8)
})

export const userLoginValidation = zod.object({
    email: zod.string(),
    password: zod.string()
})
