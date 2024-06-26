import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import {FieldError} from "../types/types";
import {HTTP_STATUSES} from "../setting";


export const inputCheckErrorsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // const errorsFormatter = (error: ValidationError): FieldError => {
    const errors = validationResult(req).formatWith(error => {
        switch (error.type) {
            case 'field':
                return {
                    message: error.msg,
                    field: error.path
                };
            default: return {
                message: error.msg,
                field: 'unknown'
            }

        }
    })
    if (!errors.isEmpty()) {
        const errorsMessages: FieldError[] = errors
            .array({onlyFirstError: true})
            // .map((error: ValidationError) => errorsFormatter(error))
        res.status(HTTP_STATUSES.BAD_REQUEST_400).send({errorsMessages: errorsMessages})
        return
    }
    return next()
}

