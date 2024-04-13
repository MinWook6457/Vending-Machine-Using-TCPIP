import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from "./App"

const test = createRoot(document.getElementById("app"))
test.render( // App 컴포넌트 렌더링
    (<App />) 
)

