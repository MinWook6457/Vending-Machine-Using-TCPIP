const { Vending } = require('../../models');

module.exports = async (stock_id) => {
    try {
        const selectedStock = await Vending.findOne({
            where: {
                id: stock_id
            }
        });

        const updatedStock = selectedStock.stock - 1;

        await Vending.update({
            stock: updatedStock,
        }, {
            where: {
                id: stock_id
            }
        })

        return selectedStock.stock
    } catch (err) {
        return err;
    }
};
