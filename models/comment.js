const moment = require('moment')

// article 表
module.exports = (sequelize, dataTypes) => {
	const Comment = sequelize.define(
		'comment',
		{
			id: {
				type: dataTypes.INTEGER(11),
				primayKey: true,
				autoIncrement: true
			},
			articleId: dataTypes.INTEGER(11),
			content: { type: dataTypes.TEXT, allowNull: false },
			createdAt: {
				type: dataTypes.DATE,
				defaultValue: dataTypes.NOW,
				get() {
					return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss')
				}
			},
			updatedAt: {
				type: dataTypes.DATE,
				defaultValue: dataTypes.NOW,
				get() {
					return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss')
				}
			}
		}, {
			timestamps: true
		}
	)

	Comment.associate = models => {
		Comment.belongsTo(models.article, {
			as: 'article',
			foreignKey: 'articleId',
			targetKey: 'id',
			constraints: false
		})

		Comment.belongsTo(models.user, {
			foreignKey: 'userId',
			targetKey: 'id',
			contraints: false
		})

		Comment.hasMany(models.reply, {
			foreignKey: 'commentId',
			sourceKey: 'id',
			constraints: false
		})
	}

	return Comment
}
