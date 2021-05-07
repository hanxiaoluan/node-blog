const Joi = require('joi')
const { comparePassword, encrypt } = require('../utils/bcrypt')
const { user: UserModel } = require('../models')

class UserController {
	static async login(ctx) {
		const { code } = ctx.request.body
		if (code) {
			await UserController.githubLogin(ctx, code)
		} else {
			await UserController.defaultLogin(ctx)
		}
	}

	// 站内用户登录
	static async defaultLogin(ctx) {
		const validator = ctx.validate(ctx.request.body, {
			account: Joi.string().required(),
			password: Joi.string()
		})

		if (validator) {
			const { account, password } = ctx.request.body

			const user = await UserModel.findOne({
				where: {
					username: account
				}
			})

			if (!user) {
				ctx.throw(403, '用户不存在')
			} else {
				const isMatch = await comparePassword(password, user.password)
				if (!isMatch) {
					ctx.throw(403, '密码不正确')
				} else {
					const { id, role } = user
					ctx.body = { username: user.username, role, userId: id }
				}
			}
		}
	}

	// github登录
	static async githubLogin(ctx, login) {

	}

	// 注册
	static async register(ctx) {
		const validator = ctx.validate(ctx.request.body, {
			username: Joi.string().required(),
			password: Joi.string().required(),
			email: Joi.string().email().require()
		})

		if (validator) {
			const { username, password, email } = ctx.request.body
			const result = await UserModel.findOne({ where: { email }})

			if (result) {
				ctx.throw(403, '邮箱已被注册')
			} else {
				const user = await UserModel.findOne({ where: { username }})
				if (user && !user.github) {
					ctx.throw(403, '用户名已被占用')
				} else {
					const saltPassword = encrypt(password)
					await UserModel.create({ username, password: saltPassword, email })

					ctx.status = 204
				}
			}
		}
	}
}

module.exports = UserController
