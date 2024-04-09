// MyComponent.js

import React, { useState, useEffect } from 'react';
import connectToServer from './tcpClient';

function MyComponent() {
    const [dataReceived, setDataReceived] = useState('');

    useEffect(() => {
        const client = connectToServer('localhost', 8080, (data) => {
            setDataReceived(data);
        });

        return () => {
            client.end(); // 컴포넌트가 언마운트되면 연결 종료
        };
    }, []);

    return (
        <div>
            <h1>TCP Data: {dataReceived}</h1>
        </div>
    );
}

export default MyComponent;
