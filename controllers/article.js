const Joi = require('joi')

const {
	article: ArticleModel,
	tag: TagModel,
	category: CategoryModel,
	comment: CommentModel,
	reply: ReplyModel,
	user: UserModel,
	sequelize
} = require('../models')

const fs = require('fs')
const { uploadPath, outputPath, findOrCreateFilePath, decodeFile, generateFile } = require('../utils/file')
const archiver = require('archiver')
const send = require('koa-send')

class ArticleController {
	static async initAboutPage() {
		const result = await ArticleModel.findOne({ where: { id: -1 }})
		if (!result) {
			ArticleModel.create({
				id: -1,
				title: '关于页面',
				content: '关于页面存档,勿删'
			})
		}
	}

	static async create(ctx) {
		const validator = ctx.validate(ctx.request.body, {
			authorId: Joi.number().required(),
			title: Joi.string().required(),
			content: Joi.string(),
			categoryList: Joi.array(),
			tagList: Joi.array()
		})

		if (validator) {
			const { title, content, categoryList = [], tagList = [], authorId } = ctx.request.body
			const result = await ArticleModel.findOne({ where: { title }})
			if (result) {
				ctx.throw(403, '创建失败,改文章已存在!')
			} else {
				const tags = tagList.map(t => ({ name: t }))
				const categories = categoryList.map(c => ({ name: c }))
				const data = await ArticleModel.create(
					{ title, content, authorId, tags, categories },
					{ include: [TagModel, CategoryModel] }
				)
				ctx.body = data
			}
		}
	}

	// 获取文章详情
	static async findById(ctx) {
		const validator = ctx.validate(
			{ ...ctx.params, ...ctx.query },
			{
				id: Joi.number().required(),
				type: Joi.number()
			}
		)

		if (validator) {
			const data = await ArticleModel.findOne({
				where: { id: ctx.params.is },
				include: [
					//  查找 分类 标签 评论 回复。。。
					{ model: TagModel, arttributes: ['name'] },
					{ model: CategoryModel, arttributes: ['name'] },
					{ model: CommentModel,
						arttributes: ['id', 'content', 'createdAt'],
						include: [
							{
								model: ReplyModel,
								arttributes: ['id', 'content', 'createdAt'],
								include: [
									{ model: UserModel, as: 'user', arttributes: { exclude: [
										'updatedAt', 'password'
									] }}
								]
							},
							{ model: UserModel, as: 'user', arttributes: { exclude: ['updatedAt', 'password'] }}
						],
						row: true
					}
				],
				order: [[CommentModel, 'createdAt', 'DESC'], [[CommentModel, ReplyModel, 'createdAt', 'ASC']]],
				row: true
			})

			const { type = 1 } = ctx.query

			type === 1 && ArticleModel.update({ viewCount: ++data.viewCount }, { where: { id: ctx.params.id }})

			data.comments.forEach(comment => {
				comment.user.github = JSON.parse(comment.user.github)
				comment.replies.forEach(reply => {
					reply.user.github = JSON.parse(reply.user.github)
				})
			})
			ctx.body.data
		}
	}
}
