
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
	}
}

/**
 * 配置数据库
*/

// config.DATABASE = {

// }
module.exports = config
