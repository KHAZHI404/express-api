import {BlogDbModel} from "../models/blogs-models/blog-models";
import {PostDbModel} from "../models/posts-models/posts-models";
import {MongoClient} from "mongodb";
import {config} from 'dotenv'
import {UserDbModel} from "../models/users-models/users-models";
import {CommentDbModel} from "../models/comments-model/comments-models";
import { TokenDbModel } from "../models/auth-models/auth-models";

config()

const url = process.env.MONGO_URL as string

if (!url) {
    console.error('URI-строка подключения к MongoDB не определена.');
    process.exit(1);
  }

const client = new MongoClient(url);


const mongoDb = client.db('social-network')
export const blogsCollection = mongoDb.collection<BlogDbModel>('blogs')
export const postsCollection = mongoDb.collection<PostDbModel>('posts')
export const usersCollection = mongoDb.collection<UserDbModel>('users')
export const commentsCollection = mongoDb.collection<CommentDbModel>('comments')
export const blacklistTokens = mongoDb.collection<TokenDbModel>('tokens')


export async function runDb () {
    try {
        await client.connect()
        console.log('Connected successfully to server')
    } catch (e) {
        console.log(`Don't connected`)
        await client.close()
    }
}