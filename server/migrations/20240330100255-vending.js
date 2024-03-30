'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Vendings', 'stock', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 10, // 재고의 기본값 설정
      comment: '음료 재고',
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Vendings', 'stock');
  }
};
