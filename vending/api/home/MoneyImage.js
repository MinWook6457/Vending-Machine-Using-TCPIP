import tenImg from '../../img/10won.png'
import fiftyImg from '../../img/50won.png'
import oneHundredImg from '../../img/100won.png'
import fiveHundredImg from '../../img/500won.png'
import oneThousandImg from '../../img/1000won.png'
import React from 'react'
import '../../css/MoneyImage.css'; // CSS 파일 임포트


export default function MoneyImage({name}){
    return <img src={test[name]} className="money-image" alt={`${name} won`} />;
}

export const test = {
    ten : tenImg,
    fifty : fiftyImg,
    oneHundred : oneHundredImg,
    fiveHundred : fiveHundredImg,
    oneThousand : oneThousandImg
}
