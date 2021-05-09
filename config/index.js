
const config = {
	PORT: 9527,
	DATABASE: {
		database: 'node-blog',
		user: 'root',
		password: 'luanhanxiao138',
		options: {
			host: 'localhost',
			dialect: 'mysql',
			pool: {
				max: 5,
				min: 0,
				acquire: 30000,
				idle: 10000
			},
			define: {
				timestamps: false, // 默认不加时间戳
				freezeTableName: true // 表名默认不加s
			},
			timezone: '+08:00'
		}
	},
	SALT_WORK_FACTOR: 10, // 加密算法的加密幂次
	TOKEN: {
		secret: 'luanhanxiao-test', // secret is very important!
		expiresIn: '720h' // token 有效期
	},
	EMAIL_NOTICE: {
		// 邮件通知服务
		enable: true,
		transportedConfig: {
			host: 'smtp.163.com',
			port: 465,
			secure: true, // true for 465,false for other ports
			auth: {
				user: 'luanhanxiao4@163.com',
				pass: '123456'
			}
		},
		subject: '栾大侠的博客-您的评论获得新的回复',
		text: '您的评论获得新的回复',
		WEB_HOST: 'http://127.0.0.1:3000'
	}
}

/**
 * 配置数据库
*/

// config.DATABASE = {

// }
module.exports = config
