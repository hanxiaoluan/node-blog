const { checkToken } = require('../utils/token')

/**
 * role===1 需要权限的路由
 * @required ‘all': get post put delete 均需要权限
 */
const verifyList1 = [
	{ regexp: /\/article\/output/, required: 'get', verifyTokenBy: 'url' }, // 导出文章
	{ regexp: /\/article/, required: 'post, put, delete' }, // 普通用户 禁止修改或者删除、添加文章
	{ regexp: /\/discuss/, required: 'delete, post' },
	{ regexp: /\/user/, required: 'get, put, delete' }
]

/**
 * role===2 需要权限的路由
 */
const verifyList2 = [
	{ regexp: /\/discuss/, required: 'post' } // 未登录用户 禁止评论
]

/**
 * 检查路由是否需要权限，返回一个权限列表
 * @return {Array} 返回 roleList
 */
function checkAuth(method, url) {
	function _veryfy(list, role) {
		const target = list.find(verifyItem => {
			return verifyItem.regexp.test(url) && (verifyItem.required === 'all' || verifyItem.required.toUpperCase().includes(method))
		})

		return target
	}

	const roleList = []
	const result1 = _veryfy(verifyList1)
	const result2 = _veryfy(verifyList2)

	result1 && roleList.push({ role: 1, verifyTokenBy: result1.verifyTokenBy || 'headers' })
	result2 && roleList.push({ role: 2, verifyTokenBy: result1.verifyTokenBy || 'headers' })

	return roleList
}

module.exports = async(ctx, next) => {
	const roleList = checkAuth(ctx.method, ctx.url)

	// 该路由需要权限验证
	if (roleList.length > 0) {
		if (checkToken(ctx, roleList)) {
			await next()
		} else {
			ctx.throw(401)
		}
	} else {
		await next()
	}
}

