const Koa = require('koa')
const koaBody = require('koa-body')
const cors = require('koa2-cors')
const logger = require('koa-logger')

const config = require('./config/index')
const loadedRouter = require('./router/index')
const app = new Koa()
const db = require('./models')

app.use(cors()).use(logger())

loadedRouter(app)

app.listen(config.PORT, () => {
	// console.log(`server listen on http://127.0.0.1:${config.PORT}`)
	db.sequelize.sync({ force: false })
		.then(async() => {
			console.log('sequelize connect success')
			console.log('server listern on http://127.0.0.1:6060')
		}).catch(err => {
			console.error(err)
		})
})
