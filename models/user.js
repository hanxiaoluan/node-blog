const dayjs = require('dayjs')

module.exports = (sequelize, dataTypes) => {
	const User = sequelize.define(
		'user', {
			id: {
				type: dataTypes.INTEGER(11),
				primaryKey: true,
				autoIncrement: true
			},
			username: {
				type: dataTypes.STRING(50),
				allowNull: false
			},
			password: {
				type: dataTypes.STRING,
				comment: '通过 bcrypt 加密后的密码' // 仅限站内注册用户
			},
			email: {
				type: dataTypes.STRING(50)
			},
			notice: {
				type: dataTypes.BOOLEAN // 是否开启邮件通知
			},
			role: {
				type: dataTypes.TINYINT,
				defaultValue: 2,
				comment: '用户权限：1 - admin, 2 - 普通用户'
			},
			github: {
				type: dataTypes.TEXT // github 登录用户 直接绑定在user表
			},
			disableDiscuss: {
				type: dataTypes.BOOLEAN,
				defaultValue: false
			},
			createdAt: {
				type: dataTypes.DATE,
				defaultValue: dataTypes.NOW,
				get() {
					return dayjs(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss')
				}
			},
			updatedAt: {
				type: dataTypes.DATE,
				defaultValue: dataTypes.NOW,
				get() {
					return dayjs(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss')
				}
			}
		},
		{
			timestamps: true
		}
	)

	return User
}
