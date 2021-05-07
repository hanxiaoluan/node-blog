const Router = require('koa-router')
const router = new Router()
const { login, register } = require('../controllers/user')

// tag category
router.get('/tag/list', (ctx, next) => {
	ctx.body = 'tag/list'
})
router.get('/category/list', (ctx, next) => {
	ctx.body = 'category/list'
})

router.post('/login', login)
router.post('/register', register)

module.exports = router
