
module.exports = (sequelize, DataTypes) => {
    const coin = sequelize.define(
        'coin',
        {
            id: { // 기본키
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                comment: '코인 고유 id',
            },
            unit: {
                type: DataTypes.STRING(255),
                allowNull: false,
                comment: '화폐 단위'
            },
            price : { // 
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: '화폐 가격'
            },
            change : {
                type : DataTypes.INTEGER,
                allowNull : false,
                defaulteValue : 10,
                comment : '자판기가 가지고 있는 화폐 개수'
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
    return coin;
}