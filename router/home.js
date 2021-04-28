const Router = require('koa-router')
const router = new Router()

// tag category
router.get('/tag/list', (ctx, next) => {
	ctx.body = 'tag/list'
})
router.get('/category/list', (ctx, next) => {
	ctx.body = 'category/list'
})

router.post('/login', (ctx, body) => {
	ctx.body = 'login'
})

module.exports = router
