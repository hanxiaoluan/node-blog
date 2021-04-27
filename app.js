const Koa = require('koa')
const koaBody = require('koa-body')
const cors = require('koa2-cors')
const logger = require('koa-logger')
const Router = require('koa-router')

const config = require('./config/index')

const app = new Koa()

const router = new Router()

router.get('/', async ctx => {
	ctx.body = { text: 'hello koa2' }
})

app.use(cors()).use(logger())

app.use(router.routes(), router.allowedMethods())

app.listen(config.PORT, () => {
	console.log(`server listen on http://127.0.0.1:${config.PORT}`)
})
