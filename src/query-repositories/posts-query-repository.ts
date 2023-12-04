import {Paginator} from "../models/blogs-models/blog-models";
import {PostDbModel, postMapper, PostViewModel} from "../models/posts-models/posts-models";
import {postsCollection} from "../db/db";
import {ObjectId, WithId} from "mongodb";

export const postsQueryRepository = {

    async findPosts(page: number,
                    pageSize: number,
                    sortBy: string | 'createdAt',
                    sortDirection: string): Promise<Paginator<PostViewModel>> {
        const filter: any = {}

        const sortOptions: any = []
        sortOptions[sortBy] = sortDirection === 'asc' ? 1 : -1

        const totalCount = await postsCollection.countDocuments(filter)
        const pagesCount = Math.ceil(totalCount / pageSize)
        const scip = (page - 1) * pageSize
        const post = await postsCollection
            .find(filter)
            .sort(sortOptions)
            .limit(pageSize)
            .skip(scip)
            .toArray()

        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: post.map(post => postMapper(post))
        }
    },

    async findPostById(id: string): Promise<PostViewModel | null> {
        if (!ObjectId.isValid(id)) return null
        const post: WithId<PostDbModel> | null = await postsCollection.findOne(
            {_id: new ObjectId(id)})
        return post ? postMapper(post) : null

    },

}