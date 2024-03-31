
module.exports = (sequelize, DataTypes) => {
    const client = sequelize.define(
        'client',
        {
            id: { // 기본키
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                comment: '클라이언트 고유 id',
            },
            money: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue : 7000, // 기본급 7000원
                comment: '금액'
            }
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
    return client;
}