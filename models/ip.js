/**
 * ip 表
 */
module.exports = (sequelize, dataTypes) => {
	const Ip = sequelize.define('ip', {
		id: { type: dataTypes.INTEGER(11), primaryKey: true, autoIncrement: true },
		ip: { type: dataTypes.TEXT, allowNull: false },
		auth: { type: dataTypes.BOOLEAN, defaultValue: true }
	})

	// Ip.associate=models=>{
	//     Ip.belongsTo(models.user,{
	//         foreginKey:'userId'
	//     })
	// }
	return Ip
}
