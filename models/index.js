const fs = require('fs')
const path = require('path')
const { DATABASE } = require('../config')
const Sequelize = require('sequelize')

const Op = Sequelize.Op

const sequelize = new Sequelize(DATABASE.database, DATABASE.user, DATABASE.password, {
	...DATABASE.options,
	operatorsAliases: {
		$eq: Op.eq,
		$ne: Op.ne,
		$gte: Op.gte,
		$gt: Op.gt,
		$lte: Op.lte,
		$lt: Op.lt,
		$not: Op.not,
		$in: Op.in,
		$notIn: Op.notIn,
		$is: Op.is,
		$like: Op.like,
		$notLike: Op.notLike,
		$iLike: Op.iLike,
		$notILike: Op.notILike,
		$regexp: Op.regexp,
		$notRegexp: Op.notRegexp,
		$iRegexp: Op.iRegexp,
		$notIRegexp: Op.notIRegexp,
		$between: Op.between,
		$notBetween: Op.notBetween,
		$overlap: Op.overlap,
		$contains: Op.contains,
		$contained: Op.contained,
		$adjacent: Op.adjacent,
		$strictLeft: Op.strictLeft,
		$strictRight: Op.strictRight,
		$noExtendRight: Op.noExtendRight,
		$noExtendLeft: Op.noExtendLeft,
		$and: Op.and,
		$or: Op.or,
		$any: Op.any,
		$all: Op.all,
		$values: Op.values,
		$col: Op.col
	}
})

const db = {}

fs.readdirSync(__dirname).filter(file => file !== 'index.js').forEach(file => {
	// const model = sequelize.import(path.join(__dirname, file))
	const model = require(path.join(__dirname, file))(sequelize, Sequelize)
	console.log(model)
	db[model.name] = model
})

Object.keys(db).forEach(modelName => {
	if (db[modelName].associate) {
		db[modelName].associate(db)
	}
})

db.sequelize = sequelize

module.exports = db
