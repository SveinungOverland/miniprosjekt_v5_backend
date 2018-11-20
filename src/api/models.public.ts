import { Document } from 'mongoose'

import { UserResponse, CommentResponse, NewsResponse, NewsArrayResponse, CategoryArrayResponse } from './response.interfaces'


export interface User {
    username: string,
    avatar: string,
    role: string
}

export class PublicUser {

    static responseFromUserDoc = (user: Document): UserResponse => {
        const { username, avatar, role } = user.toObject()
        return new UserResponse({
            username: username,
            avatar: avatar,
            role: role
        })
    }
}


export interface Comment {
    _id: number,
    poster: string, // username
    timestamp: Date,
    post: string
}

export class PublicComment {

    static responseFromCommentDoc = (comment: Document): CommentResponse => {
        const { _id, poster, timestamp, post } = comment.toObject()
        return new CommentResponse({
            _id: _id,
            poster: poster,
            timestamp: timestamp,
            post: post
        })
    }
}





export interface News {
    poster: string, // username
    header: string,
    content: string,
    peek: string
    timestamp: Date,
    image: string,
    category: string,
    comments: Comment[],
    voteCount: number,
    quality: number,
    hide: boolean
}

export class PublicNews {

    static responseFromNewsDoc = (news: Document): NewsResponse => {
        const { poster, header, content, peek, timestamp, image, category, comments, voteCount, quality, hide } = news.toObject()
        return new NewsResponse({
            poster: poster,
            header: header,
            content: content,
            peek: peek,
            timestamp: timestamp,
            image: image,
            category: category,
            comments: comments,
            voteCount: voteCount,
            quality: quality,
            hide: hide
        })
    }

    static responseFromNewsDocArray = (newsArray: Document[]): NewsArrayResponse => {
        return new NewsArrayResponse(newsArray.map(doc => {
            const { _id, poster, header, content, peek, timestamp, image, category, comments, voteCount, quality, hide } = doc.toObject()
            return {
                _id: _id,
                poster: poster,
                header: header,
                content: content,
                peek: peek,
                timestamp: timestamp,
                image: image,
                category: category,
                comments: comments,
                voteCount: voteCount,
                quality: quality,
                hide: hide
            }
        }))
    }
}


export interface Category {
    name: string
}

export class PublicCategory {
    static responseFromCategoryDocArray = (categoryArray: Document[]): CategoryArrayResponse =>
        new CategoryArrayResponse(categoryArray.map(doc => {
            const { name } = doc.toObject()
            return { name }
        }))
}