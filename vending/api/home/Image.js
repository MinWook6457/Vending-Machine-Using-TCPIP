import waterImg from '../../img/water.png'
import coffeeImg from '../../img/coffee.png'
import colaImg from '../../img/cola.png'
import shakeImg from '../../img/shake.png'
import sportsImg from '../../img/sports.png'
import adeImg from '../../img/ade.png'
import React from 'react'

export default function Image({name}){
    return <img src={test[name]} width={150}></img>
}


export const test = {
    water : waterImg,
    coffee : coffeeImg,
    cola : colaImg,
    shake : shakeImg,
    ade : adeImg,
    sports : sportsImg
}

