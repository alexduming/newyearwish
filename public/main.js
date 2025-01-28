try {
    // 显示加载状态
    document.getElementById('result').innerText = '祝福生成中...';
    
    const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
                {
                    role: 'system', 
                    content: '你是一个擅长写作的AI助手，特别善于创作温暖真诚的新年祝福。你会根据不同的关系和场合，调整文风和情感表达。'
                },
                {role: 'user', content: prompt}
            ],
            temperature: 0.8,
            max_tokens: 1000,
            stream: false
        })
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
        throw new Error(data.error.message || 'API error');
    }
    
    // 显示生成结果
    document.getElementById('result').innerText = data.choices[0].message.content;
} catch (error) {
    console.error('生成失败:', error);
    document.getElementById('result').innerText = `生成失败: ${error.message}`;
} 