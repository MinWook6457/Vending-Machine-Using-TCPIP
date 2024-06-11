import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from "./App"

// 리액트 앱과 일렉트론 앱을 연동시키기 위한 설정
const test = createRoot(document.getElementById("app"))
test.render( // App 컴포넌트 렌더링
    (<App />) 
)

