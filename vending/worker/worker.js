/*
preload -> workerpool -> worker.js

프로미스에 await를 걸어 끝날때 까지 대기

리액트에서 받아온 데이터 hash -> map에 저장 (해쉬화)

무엇을 언제 어디에

cmd : 행동
vendingId : 자판기 id
date : 생성 시각

ipc 통신 시에 변수에 함수가 저장되면 안됨
*/


// 워커 스크립트
self.onmessage = function(event) {
    const { type, payload } = event.data 
  switch (type) {
    case 'stock':
      const description = payload 
      const stockCount = handleStock(description) 
      postMessage({ type: 'stockResult', payload: stockCount }) 
      break 
    default:
      console.error('Unknown message type:', type) 
  }
}

function handleStock(data){
    return 10
}