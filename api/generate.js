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
                body: JSON.stringify(req.body),
                timeout: 30000 // 30秒超时
            });

            if (deepseekResponse.ok) {
                const data = await deepseekResponse.json();
                console.log('DeepSeek API Response:', data);
                return res.status(200).json(data);
            }
            
            // DeepSeek API 错误处理
            const deepseekError = await deepseekResponse.text();
            console.error('DeepSeek API Error:', deepseekError);
            throw new Error('DeepSeek API failed');
            
        } catch (deepseekError) {
            console.log('DeepSeek API failed, falling back to Siliconflow API...');
            
            // 如果 DeepSeek 失败，尝试 Siliconflow API
            const siliconflowResponse = await fetch('https://api.siliconflow.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.SILICONFLOW_API_KEY}`
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: 'system',
                            content: '你是一个擅长写作的AI助手，特别善于创作温暖真诚的新年祝福。你会根据不同的关系和场合，调整文风和情感表达。'
                        },
                        {
                            role: 'user',
                            content: req.body.messages[1].content
                        }
                    ],
                    model: 'Qwen-72B-Chat',
                    temperature: 0.7,
                    max_tokens: 1000,
                    stream: false
                })
            });

            // Siliconflow API 错误处理
            if (!siliconflowResponse.ok) {
                const errorText = await siliconflowResponse.text();
                console.error('Siliconflow API Error:', errorText);
                try {
                    const errorJson = JSON.parse(errorText);
                    throw new Error(errorJson.message || 'Siliconflow API failed');
                } catch (e) {
                    throw new Error(errorText || 'Siliconflow API failed');
                }
            }

            const data = await siliconflowResponse.json();
            console.log('Siliconflow API Response:', data);
            
            // 转换 Siliconflow 响应格式为 DeepSeek 格式
            const formattedResponse = {
                choices: [{
                    message: {
                        content: data.choices[0].message.content
                    }
                }]
            };
            
            res.status(200).json(formattedResponse);
        }
    } catch (error) {
        console.error('Server Error:', error);
        // 改进错误消息
        let errorMessage = '生成失败，请稍后重试';
        if (error.message.includes('timeout')) {
            errorMessage = '请求超时，请重试';
        } else if (error.message.includes('API failed')) {
            errorMessage = 'API 服务暂时不可用，请稍后重试';
        }
        
        res.status(500).json({ 
            error: 'Internal server error',
            message: errorMessage
        });
    }
} 