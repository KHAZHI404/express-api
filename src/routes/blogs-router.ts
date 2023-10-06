import {Request, Response, Router} from "express";
import {HTTP_STATUSES} from "../setting";
import {inputValidationMiddleware, validateBlogs} from '../middlewares/input-validation-middleware'
import {blogsRepository} from "../repositories/blogs-repository";
import {authGuardMiddleware} from "../middlewares/auth-guard-middleware";
import {h02dbBlogInputModel, h02dbBlogViewModel} from "../models/blogs-models/blog-models";

export const blogsRouter = Router({})


blogsRouter.get('/', (req: Request, res: Response) => {
    const foundBlogs = blogsRepository.findBlogs(req.query.name?.toString())
    res.send(foundBlogs)
})
blogsRouter.post('/',
    // authGuardMiddleware,
    validateBlogs(),
    inputValidationMiddleware,
    (req: Request, res: Response) => {
        const newBlog: h02dbBlogInputModel = blogsRepository.createBlog(req.body)
        res.status(HTTP_STATUSES.CREATED_201).send(newBlog)
    })
blogsRouter.get('/:blogId', (req: Request, res: Response) => {
    const foundBlog: h02dbBlogViewModel | undefined = blogsRepository.findBlogById(req.params.blogId)
    foundBlog ? res.status(HTTP_STATUSES.OK_200).send(foundBlog) : res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)

})
blogsRouter.put('/:blogId',
    // authGuardMiddleware,
    validateBlogs(),
    inputValidationMiddleware,
    (req: Request, res: Response) => {
        const blogId = req.params.blogId
        const isUpdated = blogsRepository.updateBlog(blogId, req.body)
        isUpdated ? res.send(blogsRepository.findBlogById(blogId)) : res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)

    })
blogsRouter.delete('/:blogId',
    // authGuardMiddleware,
    (req: Request, res: Response) => {
        const isDeleted = blogsRepository.deleteBlog(req.params.blogId)
        isDeleted ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) : res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    })