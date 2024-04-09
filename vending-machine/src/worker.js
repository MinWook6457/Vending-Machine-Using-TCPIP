// worker.js

// 웹 워커로부터 메시지를 받는 이벤트 핸들러
onmessage = function(event) {
    // 받은 데이터에서 타입과 페이로드 추출
    const { type, payload } = event.data;
    // 타입에 따라 적절한 함수 호출
    switch (type) {
      case 'select':
        handleSelect(payload.description, payload.price); // 선택한 음료 처리 함수 호출
        break;
      case 'stock':
        handleStock(payload.description); // 재고 조회 함수 호출
        break;
      case 'adminPassword':
        handleAdminPasswordSubmit(payload.password); // 관리자 비밀번호 확인 함수 호출
        break;
      default:
        console.error('Unknown message type:', type); // 알 수 없는 메시지 타입 오류 처리
    }
  };
  
  // 음료 선택 처리 함수
  function handleSelect(description, price) {
    // 서버에 POST 요청하여 선택한 음료 처리
    fetch('/machine/selectedBeverage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ description, price }) // 선택한 음료 정보 전송
    })
        .then(response => {
            if (response.status === 200) {
                console.log('음료가 선택되었습니다.'); // 음료 선택 성공 로그 출력
            } else {
                console.error('음료 선택에 실패했습니다.'); // 음료 선택 실패 로그 출력
            }
        })
        .catch(error => {
            console.error('요청 중 오류가 발생했습니다.', error); // 요청 중 오류 발생 시 로그 출력
        });
  }
  
  // 재고 조회 함수
  function handleStock(description) {
    // 서버에 해당 음료의 재고 조회 요청
    fetch(`/machine/stock?description=${description}`)
        .then(response => response.json())
        .then(data => {
            postMessage({ type: 'stock', payload: data.stock }); // 재고 정보를 메인 스레드에 전송
            console.log('재고 조회 완료'); // 재고 조회 완료 로그 출력
        })
        .catch(error => {
            console.log('재고 조회 요청 중 오류 발생'); // 재고 조회 요청 중 오류 발생 시 로그 출력
        });
  }
  
  // 관리자 비밀번호 확인 함수
  function handleAdminPasswordSubmit(password) {
    // 서버에 관리자 비밀번호 확인 요청
    fetch('/admin/checkPassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password }) // 관리자 비밀번호 전송
    })
        .then(response => {
            console.log('관리자 페이지로 이동:', response); // 관리자 페이지로 이동 성공 로그 출력
        })
        .catch(error => {
            console.error('비밀번호 확인 중 오류가 발생했습니다.', error); // 비밀번호 확인 중 오류 발생 시 로그 출력
        });
  }
  