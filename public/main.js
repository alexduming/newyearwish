/**
 * @description 调用DeepSeek API生成新年祝福
 */
async function generateGreeting() {
    try {
        console.log('开始生成祝福...');
        // 获取表单数据
        const identity = document.getElementById('identity').value;
        const receiver = document.getElementById('receiver').value;
        const relationship = document.getElementById('relationship').value;
        const title = document.getElementById('title').value;
        const memory = document.getElementById('memory').value;
        const style = document.getElementById('style').value;
        const maxWords = document.getElementById('maxWords').value;
        const terms = document.getElementById('terms').value;
        const concerns = document.getElementById('concerns').value;

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

        // 构建提示词
        const prompt = `请帮我写一段新年祝福，要求如下：
- 我的身份：${identity || '普通职场人'}
- 接收对象：${receiver || '同事'}
- 称呼：${title || '您'}
- 关系：${relationship}，语气要${toneMap[relationship]}
- 字数限制：不超过${maxWords}字
- 文风要求：${styleMap[style]}
- 适当使用行业术语：${terms || '根据身份自动选择合适的行业术语'}
- 对方特别在意的事：${concerns || (relationship === 'work' ? '事业发展，团队管理' : 
                          relationship === 'friend' ? '生活品质，个人成长' : 
                          '家庭和睦，身体健康')}
${memory ? `- 可以提到的共同回忆：${memory}` : ''}
注意：祝福要真诚温暖，避免过于公式化。`;

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
                        content: '你是一个擅长写作的AI助手，特别善于创作温暖真诚的新年祝福。'
                    },
                    {role: 'user', content: prompt}
                ]
            })
        });

        console.log('API 响应:', response);

        if (!response.ok) {
            let errorMessage = '生成失败，请稍后重试';
            try {
                const errorData = await response.text();
                const jsonError = JSON.parse(errorData);
                errorMessage = jsonError.message || errorMessage;
            } catch (e) {
                console.error('Error parsing error response:', e);
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();
        
        if (!data.choices || !data.choices[0]) {
            throw new Error('API 返回格式错误，请重试');
        }
        
        // 隐藏加载状态
        resultContainer.classList.remove('loading');
        // 显示生成结果
        document.getElementById('result').innerText = data.choices[0].message.content;
    } catch (error) {
        console.error('详细错误:', error);
        document.getElementById('resultContainer').classList.remove('loading');
        document.getElementById('result').innerText = error.message || '生成失败，请稍后重试';
    }
} 