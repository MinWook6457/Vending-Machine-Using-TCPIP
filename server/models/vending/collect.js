
module.exports = (sequelize, DataTypes) => {
    const collect = sequelize.define(
        'collect',
        {
            id: { // 기본키
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                comment: '판매 기록 용 고유 id',
            },
            price : { // 
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: '수금된 자판기 금액 총합'
            },
            createdAt: { // 수금 날짜
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: false
            },
            updatedAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: false
            }
        },
        {
            timestamps: true,
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        }
    )
 
    return collect;
}