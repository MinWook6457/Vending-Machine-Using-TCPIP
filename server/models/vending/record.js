
module.exports = (sequelize, DataTypes) => {
    const record = sequelize.define(
        'record',
        {
            id: { // 기본키
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                comment: '판매 기록 용 고유 id',
            },
            beverage : { // 판매 음료 이름
                type: DataTypes.STRING(255),
                allowNull: false,
                comment: '판매된 음료 이름'
            },
            price : { // 
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: '판매된 음료 가격'
            },
            createdAt: { // 생성 일자
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
 
    return record;
}