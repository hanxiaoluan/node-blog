const Joi = require('joi')
const axios = require('axios')
const { GITHUB } = require('../config')
const { decodeQuery } = require('../utils/index.js')
const { comparePassword, encrypt } = require('../utils/bcrypt')
const { user: UserModel, comment: CommentModel, reply: ReplyModel, ip: IpModel, sequelize } = require('../models')
const { createToken } = require('../utils/token')

async function getGithubInfo(username) {
	const result = await axios.get(`${GITHUB.fetch_user}${username}`)
	return result && result.data
}
class UserController {
	static find(params) {
		return UserModel.findOne({ where: params })
	}

	static createGithubUser(data, role = 2) {
		const { id, login, email } = data
		return UserModel.create({
			id,
			username: login,
			role,
			email,
			github: JSON.stringify(data)
		})
	}

	static updateUserById(userId, data) {
		return UserModel.update(data, { where: { id: userId }})
	}

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
	static async githubLogin(ctx, code) {
		const result = await axios.post(GITHUB.access_token_url, {
			client_id: GITHUB.client_id,
			client_secret: GITHUB.client_secret,
			code
		})

		const { access_token } = decodeQuery(result.data)

		if (access_token) {
			const result2 = await axios.get(`${GITHUB.fetch_user_url}?access_token=${access_token}`)
			const githubInfo = result2.data

			let target = await UserController.find({ id: githubInfo.id })

			if (!target) {
				target = await UserModel.create({
					id: githubInfo.id,
					username: githubInfo.name || githubInfo.username,
					github: JSON.stringify(githubInfo),
					email: githubInfo.email
				})
			} else {
				if (target.github !== JSON.stringify(githubInfo)) {
					const { id, login, email } = githubInfo
					const data = {
						username: login,
						email,
						github: JSON.stringify(githubInfo)
					}
					await UserController.updateUserById(id, data)
				}
			}

			const token = createToken({ userId: githubInfo.id, role: target.role })

			ctx.body = {
				github: githubInfo,
				username: target.username,
				userId: target.id,
				role: target.role,
				token
			}
		} else {
			ctx.throw(403, 'github 授权码已失效')
		}
	}

	// 注册
	static async register(ctx) {
		const validator = ctx.validate(ctx.request.body, {
			username: Joi.string().required(),
			password: Joi.string().required(),
			email: Joi.string().email().required()
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
					const saltPassword = await encrypt(password)
					await UserModel.create({ username, password: saltPassword, email })

					ctx.status = 204
				}
			}
		}
	}
}

module.exports = UserController

// module.exports = {
// 	async login(ctx) {
// 		try {
// 			const { username, password } = ctx.request.body
// 			const user = await UserModel.findOne({ username })
// 			if (!user) {
// 				ctx.body = {
// 					code: 1,
// 					message: '用户不存在'
// 				}
// 			} else {
// 				if (user.password !== password) {
// 					ctx.body = {
// 						code: 1,
// 						message: '密码不正确'
// 					}
// 				} else {
// 					ctx.body = {
// 						code: 0,
// 						message: '登录成功'
// 					}
// 				}
// 			}
// 		} catch (error) {
// 			ctx.body = {
// 				code: 500,
// 				message: 'Internal Server Error'
// 			}
// 		}
// 	},

// 	async register(ctx) {
// 		const { username, password } = ctx.request.body
// 		const checkUser = await UserModel.findOne({ username })
// 		if (checkUser) {
// 			ctx.body = {
// 				code: 403,
// 				msg: 'this username account is already in use.'
// 			}
// 		} else {
// 			const result = await UserModel.create({ username, password })
// 			if (result !== null) {
// 				ctx.body = {
// 					code: 0,
// 					message: '注册成功'
// 				}
// 			} else {
// 				ctx.body = {
// 					code: 1,
// 					message: '注册失败'
// 				}
// 			}
// 		}
// 	}
// }
