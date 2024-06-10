
module.exports = (sequelize, DataTypes) => {
    const admin = sequelize.define(
        'admin',
        {
            id: { // 기본키
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                comment: '관리자 고유 id',
            },
            password: {
                type: DataTypes.STRING(255),
                allowNull: false,
                comment: '비밀번호'
            },
        },
        {
            timestamps: true,
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        }
    )
    /*
    coin.associate = (models) => {
        coin.hasMany(models.Command, { foreignKey: 'user_id'})
        // user.hasMany(models.RefreshToken, {foreignKey : 'user_id'})
    }
    */
    return admin;
}