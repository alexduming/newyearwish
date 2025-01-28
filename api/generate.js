import fetch from 'node-fetch';

export default async function handler(req, res) {
    // 设置 CORS 头
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // 处理 OPTIONS 请求
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        console.log('Received request:', req.body); // 添加日志

        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.API_KEY}`
            },
            body: JSON.stringify(req.body)
        });

        console.log('API Response status:', response.status); // 添加日志

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error response:', errorData); // 添加日志
            throw new Error(errorData.message || 'API request failed');
        }

        const data = await response.json();
        console.log('API Success response:', data); // 添加日志
        res.status(200).json(data);
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ 
            message: 'Error generating greeting', 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
} 