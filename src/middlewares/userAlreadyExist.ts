import {body} from "express-validator";
import {UserDbModel} from "../models/users-models/users-models";
import {usersRepository} from "../repositories/users-repository";
import {inputValidationMiddleware} from "./input-validation-middleware";

export const uniqueEmailValidator = body('email').custom(async (body) => {
    const userByEmail: UserDbModel | null = await usersRepository.findByLoginOrEmail(body);
    if (userByEmail) {
        throw new Error('User already exists');
    }
    return true;
});

export const uniqueLoginValidator = body('login').custom(async (body) => {
    const userByLogin: UserDbModel | null = await usersRepository.findByLoginOrEmail(body);
    if (userByLogin) {
        throw new Error('User already exists');
    }
    return true;
});

export const emailConfirmed = body('email').custom(async (body) => {
    const userByEmail: UserDbModel | null = await usersRepository.findByLoginOrEmail(body);
    if (userByEmail?.emailConfirmation.isConfirmed) {
        throw new Error('Email confirmed');
    }
    return true;
});

export const emailExist = body('email').custom(async (body) => {
    const userByEmail: UserDbModel | null = await usersRepository.findByLoginOrEmail(body);
    if (!userByEmail) {
        throw new Error('User doesnt exists');
    }
    return true;
});

export const loginValidation = body('login')
    .isString()
    .trim()
    .isLength({min: 3, max: 10})
    .matches(/^[a-zA-Z0-9_-]*$/).withMessage('incorect regex')
    .withMessage('incorrect login');

export const emailValidation = body('email')
    .isString()
    .trim()
    .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .withMessage('incorrect email');

export const passwordValidation = body('password')
    .isString()
    .trim()
    .isLength({min: 6, max:20})
    .withMessage('incorrect password');

export const authRegistrationValidation = () => [uniqueEmailValidator, uniqueLoginValidator, loginValidation, emailValidation, passwordValidation, inputValidationMiddleware];
export const emailResendingValidation = () => [emailExist, emailConfirmed, emailValidation, inputValidationMiddleware];
