'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Vendings', 'money', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0, // 재고의 기본값 설정
      comment: '자판기 총액',
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Vendings', 'money');
  }
};
