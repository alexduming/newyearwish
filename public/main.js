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
        'internet': `适当使用网络流行语，富有时代感。
            - 模仿肢体动作和状态描写:(痉挛)(扭曲)(蠕动)(阴暗爬行)(尖叫)(狂奔)(摔倒)(嘶吼)
            - 随机转向无厘头发言:根据勾股定理可以推导出螺丝钉会影响挖掘机的扭矩，进而导致UFO污染太平洋
            - 语无伦次的跳跃性思维:把42号混凝土拌入意大利面，可以培育出野生的三角函数
            - 混搭不相关概念:秦始皇的切面是否具有放射性会直接影响沃尔玛和维尔康在南极的会师
            - 突然转换人设:(变成猴子)(抢走路人钱包)(荡来荡去)(不分对象攻击)
            - 疯狂堆叠状态词:阴暗的+扭曲的+痉挛的+蠕动的+狰狞的
            - 加入随机的拟声词
            - 疯狂重复基个词`,
        'classical': `运用古风雅语，意境优美。
            - 使用文言虚词:之乎者也，兮，矣
            - 运用对仗:上下，古今，山水
            - 使用典故:如龙门点睛，卧薪尝胆等成语典故
            - 景物意象:梅兰竹菊，风月山水，四时景色
            - 格调要求:含蓄典雅，意境深远
            - 句式建议:四字句，五言，七言为主
            - 可适当使用:诗词韵脚，对偶句式`
    };

    // 构建优化后的prompt
    const prompt = `请帮我撰写一份蛇年拜年文案。

第一步：设定基础人设
- 写文案的身份：${identity}
- 接收对象身份：${receiver}
- 关系定位：${relationship}（${toneMap[relationship]}）
- 称呼：${title}

第二步：加入关键细节
- 共同回忆/关键细节：${memory}
- 写作风格：${style}（${styleMap[style]}）
- 字数要求：不超过${maxWords}字
- 适当使用行业术语：${terms || (identity.includes('运营') ? '流量，转化，投放，复盘，增长' : 
                    identity.includes('程序') ? 'Bug，迭代，敏捷，PR' : 
                    identity.includes('产品') ? '用户，需求，迭代，原型' :
                    根据身份自动选择适当加入合适的行业术语')}
- 对方特别在意的事：${concerns || (relationship === 'work' ? '事业发展，团队管理' : 
                    relationship === 'friend' ? '生活品质，个人成长' : 
                    '家人健康，生活幸福')}

写作要求：
1. 开头要自然，避免"值此新春佳节"等老套开场白
2. 巧妙融入蛇年元素，可用蛇的吉祥寓意，但不堆砌
3. 将共同回忆自然融入祝福，增加情感共鸣
4. 根据关系调整语气，体现恰当的亲疏关系
5. 结尾要有新年美好期许，为关系续写新篇章
6. 适当融入时代元素，展现与时俱进
7. 在祝福中体现对方特点或职业特色
8. 重点：将对方特别在意的事情（${concerns}）巧妙融入祝福中，例如：
   - 如果对方在意事业，可以祝愿事业蒸蒸日上
   - 如果对方在意健康，可以祝愿身体健康活力四射
   - 如果对方在意搞钱，可以祝愿财运亨通
   - 如果对方在意变美，可以祝愿容光焕发魅力四射
   但要注意表达要委婉，不要太直白

技术要求：
1. 字数严格控制在${maxWords}字以内
2. 避免说教式口吻
3. 减少引号使用，保持文字流畅性
4. 适当使用四字祝福语，但不要堆砌
5. 标点符号使用恰当，避免过多感叹号
6. 写作风格要多样化，长短句搭配

禁区提醒：
- 避免过度奉承
- 不要太过随意或过于网络化
- 不要暴露工作或生活中的负面情绪
- 不要涉及敏感话题如薪资、晋升、八卦谣言等
- 不要用"首先""然后"这种逻辑词
- 不要用类比和隐喻的手法，不要出现引号

参考案例：
如果对方在意事业发展，可以这样写：
"新的一年，愿你带领团队再创佳绩，在专业领域大放异彩。"

如果对方在意搞钱，可以这样委婉表达：
"蛇年行大运，愿你事业蒸蒸日上，钱包鼓鼓，生活无忧。"

如果对方在意变美，可以这样优雅表达：
"愿你在新的一年容光焕发，魅力四射，成为最靓丽的风景。"

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
        console.error('生成失败:', error);
        document.getElementById('resultContainer').classList.remove('loading');
        document.getElementById('result').innerText = error.message || '生成失败，请稍后重试';
    }
} 