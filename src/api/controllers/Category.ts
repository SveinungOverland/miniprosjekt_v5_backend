import { Request, Response } from 'express'

import { Document } from 'mongoose'

import { NewsModel, CategoryModel } from '../models'

import { StatusCodes } from '../response.interfaces'

import { respondWithError, respondWithData, respondWithOk } from '../response.funcs'

import { PublicNews, PublicCategory } from '../models.public'


export default class Category {

    static post(req: Request, res: Response) {
        const { name } = req.body
        CategoryModel.create({ name })
        .then(respondWithOk(res))
        .catch(respondWithError(res)(StatusCodes.SERVER_ERROR, "Could not create category"))
    }

    static get(_: Request, res: Response) {

        CategoryModel.find()
            .then(doc => {
                if (doc) respondWithData<Document[]>(res)(PublicCategory.responseFromCategoryDocArray)(doc)
                else respondWithError(res)(StatusCodes.NOT_FOUND, "No categories")()
            })
    }

    static getFromName(req: Request, res: Response) {
        const { categoryName } = req.params
        NewsModel.find({ category: categoryName })
            .sort('-timestamp')
            .then(doc => {
                if (doc) respondWithData<Document[]>(res)(PublicNews.responseFromNewsDocArray)(doc)
                else respondWithError(res)(StatusCodes.NOT_FOUND, "No posts for that category")()
            })
    }
}