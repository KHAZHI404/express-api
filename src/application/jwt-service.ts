import {UserDbModel} from "../models/users-models/users-models";
import {ObjectId, WithId} from "mongodb";
import {settings} from "../setting";
import jwt from 'jsonwebtoken';

export const jwtService =
    {
    async createJWT(user: WithId<UserDbModel>) {
        const token = jwt.sign({userId: user._id}, settings.JWT_SECRET, {expiresIn: '2h'})
        return token
    },

    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return new ObjectId(result.userId)
        } catch (error) {
            return null
        }
    },

    async generateToken(userId: string, expiresIn: string) {
      console.log(userId, '111')
        const secretKey = 'your_secret_key'; 
        const sign = jwt.sign({userId}, secretKey, { expiresIn: expiresIn });
        return sign
      },


    async verifyRefreshToken(refreshToken: any) {
        const secretKey = 'your_secret_key'; 
    try {
      const res: any = jwt.verify(refreshToken, secretKey);
      console.log(res, '222')

      return res.userId
    } catch (error) {
      return null; 
    }
  }

}