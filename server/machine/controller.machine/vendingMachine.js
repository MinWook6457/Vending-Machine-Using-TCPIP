const response = require('../../response')
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
            }
        })

        console.log(selectedBeverage)

        // 음료 카운팅
        // 투입 된 금액과 음료 가격에 맞춰서 반환할 잔돈 구하기
        // 반환 지폐 개수는 각각 10개씩 존재

        return response(res,200,selectedBeverage)
    }catch(err){
        return response(res,500,'음료 통신 실패')
    }
}

const initialize = async (req, res) => { // 초기화 함수
    try {
        // 하드 코딩 => 추후 개선 필요
        const vendingData = [
            { id : 1, beverage: 'water', price: 450, stock: 10 },
            { id : 2, beverage: 'coffee', price: 500, stock: 10 },
            { id : 3, beverage: 'ionic', price: 550, stock: 10 },
            { id : 4, beverage: 'shake', price: 700, stock: 10 },
            { id : 5, beverage: 'cola', price: 750, stock: 10 },
            { id : 6, beverage: 'ade', price: 800, stock: 10 },
        ];

        for (const item of vendingData) {
            // 데이터베이스에 이미 해당 음료가 있는지 확인
            const existingItem = await Vending.findOne({ where: { id: item.id } });
            
            // 이미 해당 음료가 데이터베이스에 없는 경우에만 삽입
            if (existingItem === null) {
                await Vending.create(item);
                console.log(`Inserted data for ${item.beverage}`);
            } else {
                console.log(`Data for ${item.beverage} already exists, skipping insertion`);
            }
        }

        return response(res, 200, '데이터 삽입 성공');
    } catch (err) {
        return response(res, 500, '데이터 삽입 오류');
    }
};

module.exports = {
    selectedBeverage,
    initialize
}