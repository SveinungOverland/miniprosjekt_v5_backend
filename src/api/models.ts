import { Schema, model } from 'mongoose'


export enum UserRoles {
    USER = "user",
    MODERATOR = "moderator",
    ADMIN = "admin"
}

const userRolesArray = Object.keys(UserRoles).map(it => UserRoles[it as any])

const userSchema = new Schema({
    username: { type: String, unique: true, trim: true },
    password: String,
    avatar: { type: String, default: "" }, // url
    role: { type: String, enum: userRolesArray, default: "user" } // Populate from enums/Roles
})


const commentSchema = new Schema({
    poster: String, // Poster username
    timestamp: { type: Date, default: Date.now },
    post: String
})


const categorySchema = new Schema({
    name: String
})

const newsSchema = new Schema({
    poster: { type: String, index: true }, // Poster username
    header: String,
    content: String,
    peek: { type: String, default: "" },
    timestamp: { type: Date, default: Date.now },
    image: String,
    category: String, // Populate from categorySchema
    comments: { type: [commentSchema], default: [] },
    votes: { type: [{ username: String, vote: { type: Number, min: 0, max: 6 }, timestamp: { type: Date, default: Date.now } }], default: [] },
    flags: { type: [{ username: String, timestamp: { type: Date, default: Date.now } }], default: [] },
    quality: { type: Number, min: 0, max: 6, default: 0 },
    hide: Boolean
})


export const UserModel = model('User', userSchema)

export const CommentModel = model('Comment', commentSchema)

export const CategoryModel = model('Category', categorySchema)

export const NewsModel = model('News', newsSchema)
