
const config = {
	PORT: 9527,
	ADMIN_GITHUB_LOGIN_NAME: 'gershonv', // 博主的 github 登录的账户名 user
	GITHUB: {
		client_id: 'c6a96a84105bb0be1fe5',
		client_secret: '463f3994ab5687544b2cddbb6cf44920bf179ad9',
		access_token_url: 'https://github.com/login/oauth/access_token',
		fetch_user_url: 'https://api.github.com/user', // 用于 oauth2
		fetch_user: 'https://api.github.com/users/' // fetch user url https://api.github.com/users/gershonv
	},
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
