import {usersCollection} from "../db/db";
import {ObjectId, WithId} from "mongodb";
import {OutputUserType, UserDbType, userMapper} from "../input-output-types/users-types";


export const usersQueryRepository = {

    async findUsers(page: number,
                     pageSize: number,
                     sortBy: string | 'createdAt',
                     sortDirection: string,
                     searchLoginTerm: string | null,
                     searchEmailTerm: string | null,
    ) {
        const filter: any = {$or: []}
        if (searchLoginTerm) {
            filter["$or"].push({login: {$regex: searchLoginTerm, $options: 'i'}})
        }
        if (searchEmailTerm) {
            filter["$or"].push({email: {$regex: searchEmailTerm, $options: 'i'}})
        }
        if (filter["$or"].length === 0) {
            filter["$or"].push({})
        }
        let sortOptions: { [key: string]: 1 | -1}  = {
            [sortBy]: -1
        }
        if (sortDirection === "asc") {
            sortOptions[sortBy] = 1
        }
        const totalCount = await usersCollection.countDocuments(filter)
        const pagesCount = Math.ceil(totalCount / +pageSize)
        const scip = (+page - 1) * +pageSize
        const users = await usersCollection
            .find(filter)
            .sort(sortOptions)
            .skip(scip)
            .limit(+pageSize)
            .toArray()

        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: users.map(user => userMapper(user))
        }
    },

    async findCurrentUser(userId: string): Promise<OutputUserType | null> {
        if (!ObjectId.isValid(userId)) return null
        const currentUser: WithId<UserDbType> | null = await usersCollection.findOne({_id: new ObjectId(userId)})
        return currentUser ? userMapper(currentUser) : null
    },
}
