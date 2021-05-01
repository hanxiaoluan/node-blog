const Joi = require('joi')
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
		}
	}
}
