import {WithId} from "mongodb";
import { ObjectId } from 'mongodb';

import {commentsCollection} from "../db/db";
import {CommentDbType, commentMapper} from "../input-output-types/comments-types";


export const commentsQueryRepository = {

    async getCommentById(id: string) {
        if (!ObjectId.isValid(id)) return null // что с тобой не так?
        const comment: WithId<CommentDbType> | null = await commentsCollection.findOne(
            {_id: new ObjectId(id)})
        return comment ? commentMapper(comment) : null
    },

    async getCommentsForPost(id: string,
                          page: number,
                          pageSize: number,
                          sortBy: string,
                          sortDirection: string) {
            let sortOptions: { [key: string]: 1 | -1}  = {
                [sortBy]: -1
            }
            if (sortDirection === "asc") {
                sortOptions[sortBy] = 1
            }
            const filter = {postId: id}

            const totalCount = await commentsCollection.countDocuments(filter) // откуда он берет дополнительную единицу?
            const pagesCount = Math.ceil(totalCount / +pageSize)
            const scip = (+page - 1) * +pageSize
            const comments = await commentsCollection
                .find(filter)
                .sort(sortOptions)
                .limit(+pageSize)
                .skip(scip)
                .toArray();

            return comments ? {
                pagesCount,
                page,
                pageSize,
                totalCount,
                items: comments.map(commentMapper)
            } : null

    },
}