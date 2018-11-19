import 'jest'

import { config as dotenvConfig } from 'dotenv'
dotenvConfig()
import * as mongoose from 'mongoose'
import { UserModel, CommentModel, CategoryModel, NewsModel } from './models'





const URI: string = process.env.MONGODB_URI || "Something went wrong"


beforeAll(() => {
    return mongoose.connect(URI, { useNewUrlParser: true })  
})

afterAll(() => {
    return mongoose.disconnect()
})



test("[Create] UserModel", done => {
    const { username, password } = { username: "test1337", password: "test" }
    UserModel.create({
        username,
        password
    }).then(val => {
        expect(val).toBeDefined()
        done()
    })
})

test("[Create] CommentModel", done => {
    const { poster, post } = { poster: "test1337", post: "Dette er en test" }
    CommentModel.create({
        poster,
        post
    }).then(val => {
        expect(val).toBeDefined()
        done()
    })
})

test("[Create] CategoryModel", done => {
    const { name } = { name: "test" }
    CategoryModel.create({
        name
    }).then(val => {
        expect(val).toBeDefined()
        done()
    })
})

test("[Create] NewsModel", done => {
    const { poster, header, content, peek, image, category } = { 
        poster: "test1337",
        header: "test",
        content: "test",
        peek: "test",
        image: "test",
        category: "test"
    }
    NewsModel.create({
        poster,
        header,
        content,
        peek,
        image,
        category
    }).then(val => {
        expect(val).toBeDefined()
        done()
    })
})