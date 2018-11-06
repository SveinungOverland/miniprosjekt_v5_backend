import { Router } from 'express'

import User from './controllers/User'
import Token from './controllers/Token'
import News from './controllers/News'
import Comment from './controllers/Comment'

import { requireLogin, matchParams } from './crypto'
import { UserRoles } from './models';

const routes = Router()


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
    .post(requireLogin(matchParams(params => params.username)(News.post)))


routes.route("/news/:username")
    .get(News.getFromUsername)
// TODO LEGG TIL MER ROUTES FOR NYHETER, MED TID OSV... MÅ OG HA EN MÅTE Å REGNE QUALITY PÅ



routes.route("/comment/:newsid")
    .post(requireLogin(Comment.postToArticle))

export default routes