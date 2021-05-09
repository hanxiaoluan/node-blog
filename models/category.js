const moment = require('moment')

// category 表
module.exports = (sequelize, dataTypes) => {
	const Category = sequelize.define('category', {
		id: { type: dataTypes.INTEGET(11), primaryKey: true, autoIncrement: true },
		name: { type: dataTypes.STRING(100), allowNull: false }
	})

	Category.associate = models => {
		Category.belongTo(models.article, {
			as: 'article',
			foreignKey: 'articleId',
			targetKey: 'id',
			constraints: false
		})
	}

	return Category
}
