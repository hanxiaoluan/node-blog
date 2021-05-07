const Joi = require('joi')

/**
 * @param {object} params -需要被验证的key-value
 * @param {object} schema
 * @return Promise
 */
function validate(params = {}, schema = {}) {
	const ctx = this

	schema = Joi.object(schema)
	const validator = schema.validate(params, { allowUnknown: true })

	if (validator.error) {
		ctx.throw(400, validator.error.message)
		return false
	}
	return true
}

// 绑定app.context ctx.func 直接调用
module.exports = {
	// client:response ,//快捷设置给客户端的response
	validate: validate
}
