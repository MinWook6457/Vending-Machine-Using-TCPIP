const response = require('../../response')
const decreaseBeverageStock = require('../service.machine/decreaseBeverageStock')
const { Vending } = require('../../models')

const selectedBeverage = async(req,res) => {
    const {description,price} = req.body
    console.log(description , price)
    try{
        console.log('선택된 음료 ' + description + ' 음료 가격 ' + price)

        // 선택된 음료 객체
        const selectedBeverage = await Vending.findOne({
            where : {
                beverage : description
            },
            attributes: ['id' , 'beverage' ,'price', 'stock']
        })

        console.log(selectedBeverage)
        const selectedBeverageStock = await decreaseBeverageStock(selectedBeverage.id)

        console.log("음료 선택 후 재고 : " + selectedBeverageStock)

        // 투입 된 금액과 음료 가격에 맞춰서 반환할 잔돈 구하기
        // 각 클라이언트에게 기본급을 지급해야함

        // 반환 지폐 개수는 각각 10개씩 존재

        // 유저 생성
        console.log('음료 재고 : ' + selectedBeverageStock)
        return response(res,200,resultBeverage)
    }catch(err){
        return response(res,500,'음료 통신 실패')
    }
}

const selectStock = async(req,res) =>{
    const {stock_id} = req.body
    try{
        const stock = await findOne({
            where : {
                id : stock_id
            },
            attributes : ['stock']
        })

        return response(res,200,stock)
    }catch(err){
        return response(res,401,'재고 조회 실패')

    }
}

module.exports = {
    selectedBeverage,
    selectStock
}