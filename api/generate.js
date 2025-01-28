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
        return res.status(405).json({ 
            error: 'Method not allowed',
            message: 'Only POST requests are allowed'
        });
    }

    try {
        // 首先尝试 DeepSeek API
        try {
            console.log('Trying DeepSeek API...');
            const deepseekResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
                },
                body: JSON.stringify(req.body)
            });

            if (deepseekResponse.ok) {
                const data = await deepseekResponse.json();
                console.log('DeepSeek API Response:', data);
                return res.status(200).json(data);
            }
            throw new Error('DeepSeek API failed');
        } catch (deepseekError) {
            console.log('DeepSeek API failed, falling back to Siliconflow API...');
            
            // 如果 DeepSeek 失败，尝试 Siliconflow API
            const siliconflowResponse = await fetch('https://api.siliconflow.com/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.SILICONFLOW_API_KEY}`
                },
                body: JSON.stringify({
                    ...req.body,
                    model: 'Qwen/QVQ-72B-Preview' // 使用 Siliconflow 的模型
                })
            });

            if (!siliconflowResponse.ok) {
                const errorData = await siliconflowResponse.json();
                throw new Error(errorData.message || 'Both APIs failed');
            }

            const data = await siliconflowResponse.json();
            console.log('Siliconflow API Response:', data);
            res.status(200).json(data);
        }
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
} 