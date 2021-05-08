const jwt = require('jsonwebtoken')
const { TOKEN } = require('../config')

/**
 * @param {Object} info -存储在token中的值
 */
exports.createToken = info => {
	const token = jwt.sign(info, TOKEN.secret, { expiresIn: TOKEN.expiresIn })
	return token
}

/**
 * @param {Object} ctx -app.context
 * @param {Array} roleList - 需要具备的权限
 *
 * @return {Boolean} 是否验证通过
 */

exports.checkToken = (ctx, roleList = []) => {
	let isVerify = false
	function _verify(token) {
		return jwt.verify(token, TOKEN.secret, (err, decoedd) => {
			if (err) {
				return false
			} else if (decoedd) {
				return !!roleList.find(item => item.role === decoedd.role)
			}

			return false
		})
	}

	for (const item of roleList) {
		if (item.verifyTokenBy === 'headers') {
			const authorizationHeader = ctx.headers['authorization']
			if (authorizationHeader) {
				const token = authorizationHeader.split(' ')[1] // 获取token 过滤Bearer
				const result = _verify(token)
				if (result) {
					isVerify = true
					break
				}
			}
		} else {
			const { token } = ctx.query
			if (token) {
				const _token = token.split(' ')[1]
				const result = _verify(_token)
				if (result) {
					isVerify = true
					break
				}
			}
		}
	}

	return isVerify
}
