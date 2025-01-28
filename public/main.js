/**
 * @description 调用DeepSeek API生成新年祝福
 */
async function generateGreeting() {
    // 直接从环境变量中获取API KEY
    const apiKey = 'sk-76eb7d7a3dd3482d82370a43a541b32d';
    // 或者从后端获取
    // const apiKey = await fetch('/api/getKey').then(res => res.text());
    
    const apiUrl = 'https://api.deepseek.com/chat/completions';

    // 获取表单数据
    const identity = document.getElementById('identity').value;
    const receiver = document.getElementById('receiver').value;
    const relationship = document.getElementById('relationship').value;
    const title = document.getElementById('title').value;
    const memory = document.getElementById('memory').value;
    const style = document.getElementById('style').value;
    const maxWords = document.getElementById('maxWords').value;

    // 根据关系类型设置语气
    const toneMap = {
        'work': '恭敬有礼但不过分生疏',
        'friend': '轻松自然但不失礼节',
        'family': '温暖亲切充满爱意'
    };

    // 根据文风设置表达方式
    const styleMap = {
        'normal': '用语庄重大方，措辞考究',
        'casual': '口语化表达，活泼自然',
        'internet': '适当使用网络流行语，富有时代感',
        'classical': '运用古风雅语，意境优美'
    };

    // 构建优化后的prompt
    const prompt = `请以AI写作助手的身份，帮我创作一段新年祝福。

背景信息：
1. 写作者身份：${identity}
2. 接收对象：${receiver}
3. 关系定位：${relationship}（${toneMap[relationship]}）
4. 称呼：${title}
5. 共同回忆/关键细节：${memory}
6. 文风要求：${style}（${styleMap[style]}）
7. 字数要求：不超过${maxWords}字

核心要求：
1. 开头要自然带入，避免生硬的"值此新春佳节"等老套开场
2. 巧妙融入蛇年元素，可以用蛇的吉祥寓意，但不要过度堆砌
3. 将共同回忆自然融入祝福中，增加情感共鸣
4. 根据关系调整称谓和语气，体现恰当的亲疏关系
5. 结尾要有新年美好期许，为关系续写新篇章

技术要求：
1. 字数必须严格控制在${maxWords}字以内
2. 避免说教式或说明文口吻
3. 避免使用"首先""然后"等过渡词
4. 减少引号使用，保持文字流畅性
5. 适当使用4字祝福语，但不要堆砌成串
6. 标点符号使用恰当，避免过多感叹号
7. 写作风格要多样化，长短句搭配着来

禁区提醒：
- 避免过度奉承，
- 不要太过随意或过于网络化，
- 不要暴露工作或生活中的负面情绪，
- 不要涉及敏感话题如薪资、晋升、八卦谣言等
- 不要用"首先""然后"这种逻辑词，避免用框架式论述
- 不要用类比和隐喻的手法，不要出现引号""


额外加分项：
1. 适当融入时代元素，展现与时俱进
2. 在祝福中体现对方特点或职业特色

请按以上要求生成一段真情实感、打动人心的新年祝福。`;

    try {
        // 显示加载状态
        const resultContainer = document.getElementById('resultContainer');
        resultContainer.classList.add('loading');
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

        const data = await response.json();
        
        // 隐藏加载状态
        resultContainer.classList.remove('loading');
        // 显示生成结果
        document.getElementById('result').innerText = data.choices[0].message.content;
    } catch (error) {
        console.error('生成失败:', error);
        // 隐藏加载状态
        document.getElementById('resultContainer').classList.remove('loading');
        document.getElementById('result').innerText = '生成失败,请稍后重试';
    }
} 