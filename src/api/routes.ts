import { Router } from 'express'

import User from './controllers/User'
import Token from './controllers/Token'
import News from './controllers/News'
import Comment from './controllers/Comment'
import Category from './controllers/Category'

import { requireLogin, matchParams, matchBody } from './crypto'
import { UserRoles } from './models';

const routes = Router()


routes.route("/")
    .get((_, res) => res.json({ msg: "Hello world" }))

routes.route("/user")
    .post(User.post)
    
routes.route("/user/:username")
    .get(User.get)
    // her brukes matchParams for å unngå at innloggede brukere kan slette andre brukere enn dem selv, men med [UserRoles.ADMIN] tillates det når brukeren er admin
    .delete(requireLogin(matchParams(params => params.username, [UserRoles.ADMIN])(User.delete)))


routes.route("/token")
    .post(Token.post) // Klient vil lage en ny resurs, token, som krever at klient oppgir brukernavn/passord
    .get(requireLogin(Token.get)) // Klient spør server om token resurs uten å gi brukernavn/passord, det er bare avhengig av headeren


routes.route("/news")
    .post(requireLogin(matchBody(body => body.poster)(News.post)))
    .get(News.get)


routes.route("/news/:username")
    .get(News.getFromUsername)
// TODO LEGG TIL MER ROUTES FOR NYHETER, MED TID OSV... MÅ OG HA EN MÅTE Å REGNE QUALITY PÅ

routes.route("/news/:username/:timestamp")
    .get(News.getFromUsernameTimestamp)
    .put(requireLogin(matchParams(params => params.username)(News.updateFromUsernameTimestamp))) //Update path
    .delete(requireLogin(matchParams(params => params.username)(News.delete)))



routes.route("/comment/:newsid")
    .post(requireLogin(Comment.postToArticle))


routes.route("/category")
    .post(Category.post)
    .get(Category.get)

routes.route("/category/:categoryName")
    .get(Category.getFromName) // Returns news assigned with categoryName

export default routes