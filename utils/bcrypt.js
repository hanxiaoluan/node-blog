const { SALT_WORK_FACTOR } = require('../config')
const bcrypt = require('bcrypt')

/**
 * @func encrypt - 加密
 * @param {String} - 密码
 */

exports.encrypt = password => {
	return new Promise((resolve, reject) => {
		bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
			if (err) reject(password)
			bcrypt.hash(password, salt, function(err, hash) {
				// Store hash in your password DB.
				if (err) resolve(password)
				resolve(hash)
			})
		})
	})
}

/**
 * @func comparePassword - 密码校验
 * @param {string} password - 需要校验的密码
 * @param {string} hash - 加密后的密码
 */
exports.comparePassword = (password, hash) => {
	return new Promise((resolve, reject) => {
		bcrypt.compare(password, hash, (err, matched) => {
			if (err) reject(err)
			resolve(matched)
		})
	})
}
