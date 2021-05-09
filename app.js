const Koa = require('koa')
const koaBody = require('koa-body')
const cors = require('koa2-cors')
const logger = require('koa-logger')
const error = require('koa-json-error')

const config = require('./config/index')
const loadedRouter = require('./router/index')
const app = new Koa()
const db = require('./models')
// context binding...
const context = require('./utils/context')

Object.keys(context).forEach(key => {
	app.context[key] = context[key]
})

// middlewares
const authHandler = require('./utils/context')

app.use(cors()).use(
	koaBody({
		multipart: true,
		formidable: {
			keepExtensions: true,
			maxFileSize: 2000 * 1024 * 1024
		}
	})
).use(
	error({
		postFormat: (e, { stack, ...rest }) => (process.env.NODE_ENV !== 'development' ? rest : { stack, ...rest })
	})
).use(authHandler).use(logger())

loadedRouter(app)

app.listen(config.PORT, () => {
	// console.log(`server listen on http://127.0.0.1:${config.PORT}`)
	db.sequelize.sync({ force: false })
		.then(async() => {
			console.log('sequelize connect success')
			console.log(`server listen on http://127.0.0.1:${config.PORT}`)
		}).catch(err => {
			console.error(err)
		})
})

