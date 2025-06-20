/**
 * LeetCode 017: 最后一个单词的长度 (Length of Last Word)
 *
 * 题目描述：
 * 给你一个字符串 s，由若干单词组成，单词前后用一些空格字符隔开。
 * 返回字符串中最后一个单词的长度。
 * 单词是指仅由字母组成、不包含任何空格字符的最大子字符串。
 *
 * 核心思想：
 * 字符串处理 - 从后向前遍历，跳过尾部空格后计算单词长度
 *
 * 算法原理：
 * 1. 从字符串末尾开始遍历，跳过空格
 * 2. 遇到第一个非空格字符，开始计数
 * 3. 遇到空格或到达字符串开头，结束计数
 */

/**
 * 解法一：反向遍历法（推荐）
 *
 * 核心思想：
 * 从字符串末尾开始遍历，先跳过末尾的空格
 * 然后统计最后一个单词的字符数量
 *
 * @param {string} s - 输入字符串
 * @returns {number} 最后一个单词的长度
 * @time O(n) 最坏情况需要遍历整个字符串
 * @space O(1) 只使用常数额外空间
 */
function lengthOfLastWord(s) {
    let length = 0;
    let i = s.length - 1;

    // 跳过末尾的空格
    while (i >= 0 && s[i] === ' ') {
        i--;
    }

    // 统计最后一个单词的长度
    while (i >= 0 && s[i] !== ' ') {
        length++;
        i--;
    }

    return length;
}

/**
 * 解法二：优化的反向遍历法
 *
 * 核心思想：
 * 使用一个循环完成跳过空格和计数，更加简洁
 *
 * @param {string} s - 输入字符串
 * @returns {number} 最后一个单词的长度
 * @time O(n)
 * @space O(1)
 */
function lengthOfLastWordOptimized(s) {
    let length = 0;
    let foundWord = false;

    // 从后向前遍历
    for (let i = s.length - 1; i >= 0; i--) {
        if (s[i] !== ' ') {
            // 遇到非空格字符，开始计数
            length++;
            foundWord = true;
        } else if (foundWord) {
            // 已经开始计数，遇到空格表示单词结束
            break;
        }
        // 如果还没开始计数，继续跳过空格
    }

    return length;
}

/**
 * 解法三：字符串分割法
 *
 * 核心思想：
 * 使用split方法按空格分割字符串，取最后一个非空元素
 * 简单直观，但性能不如直接遍历
 *
 * @param {string} s - 输入字符串
 * @returns {number} 最后一个单词的长度
 * @time O(n) 需要分割整个字符串
 * @space O(n) 创建数组存储分割结果
 */
function lengthOfLastWordSplit(s) {
    // 去除首尾空格并按空格分割
    const words = s.trim().split(' ');

    // 过滤掉空字符串（多个连续空格会产生空字符串）
    const validWords = words.filter(word => word.length > 0);

    // 返回最后一个单词的长度
    return validWords.length > 0 ? validWords[validWords.length - 1].length : 0;
}

/**
 * 解法四：正则表达式法
 *
 * 核心思想：
 * 使用正则表达式匹配所有单词，取最后一个的长度
 *
 * @param {string} s - 输入字符串
 * @returns {number} 最后一个单词的长度
 * @time O(n) 正则表达式匹配
 * @space O(n) 存储匹配结果
 */
function lengthOfLastWordRegex(s) {
    // 匹配所有单词（连续的非空格字符）
    const words = s.match(/\S+/g);

    // 返回最后一个单词的长度
    return words && words.length > 0 ? words[words.length - 1].length : 0;
}

/**
 * 解法五：内置方法组合
 *
 * 核心思想：
 * 结合trim和split方法，直接获取最后一个单词
 *
 * @param {string} s - 输入字符串
 * @returns {number} 最后一个单词的长度
 * @time O(n)
 * @space O(n)
 */
function lengthOfLastWordBuiltIn(s) {
    // 去除首尾空格，按空格分割，取最后一个元素的长度
    return s.trim().split(' ').pop().length;
}

/**
 * 解法六：双指针法
 *
 * 核心思想：
 * 使用两个指针标记最后一个单词的开始和结束位置
 *
 * @param {string} s - 输入字符串
 * @returns {number} 最后一个单词的长度
 * @time O(n)
 * @space O(1)
 */
function lengthOfLastWordTwoPointers(s) {
    let end = s.length - 1;
    let start = -1;

    // 找到最后一个单词的结束位置（跳过末尾空格）
    while (end >= 0 && s[end] === ' ') {
        end--;
    }

    // 如果全是空格
    if (end < 0) return 0;

    // 找到最后一个单词的开始位置
    start = end;
    while (start >= 0 && s[start] !== ' ') {
        start--;
    }

    // 返回单词长度
    return end - start;
}

// 测试用例
function runTests() {
    console.log('=== LeetCode 017: 最后一个单词的长度 测试 ===\n');

    const testCases = [
        {
            input: "Hello World",
            expected: 5,
            description: '基础用例：两个单词'
        },
        {
            input: "   fly me   to   the moon  ",
            expected: 4,
            description: '含有多个空格的字符串'
        },
        {
            input: "luffy is still joyboy",
            expected: 6,
            description: '多个单词，无多余空格'
        },
        {
            input: "a",
            expected: 1,
            description: '单个字符'
        },
        {
            input: "   a   ",
            expected: 1,
            description: '单个字符带空格'
        },
        {
            input: "Today is a nice day",
            expected: 3,
            description: '正常句子'
        },
        {
            input: "programming",
            expected: 11,
            description: '单个单词'
        },
        {
            input: "   ",
            expected: 0,
            description: '全是空格'
        }
    ];

    testCases.forEach((test, index) => {
        console.log(`测试用例 ${index + 1}: ${test.description}`);
        console.log(`输入: "${test.input}"`);

        // 测试所有解法
        const result1 = lengthOfLastWord(test.input);
        const result2 = lengthOfLastWordOptimized(test.input);
        const result3 = lengthOfLastWordSplit(test.input);
        const result4 = lengthOfLastWordRegex(test.input);
        const result5 = lengthOfLastWordBuiltIn(test.input);
        const result6 = lengthOfLastWordTwoPointers(test.input);

        console.log(`反向遍历法结果: ${result1}`);
        console.log(`优化反向遍历法结果: ${result2}`);
        console.log(`字符串分割法结果: ${result3}`);
        console.log(`正则表达式法结果: ${result4}`);
        console.log(`内置方法组合结果: ${result5}`);
        console.log(`双指针法结果: ${result6}`);

        // 验证结果
        const results = [result1, result2, result3, result4, result5, result6];
        const allCorrect = results.every(result => result === test.expected);
        console.log(`期望结果: ${test.expected}`);
        console.log(`结果验证: ${allCorrect ? '✅ 通过' : '❌ 失败'}`);
        console.log('---');
    });
}

// 性能测试
function performanceTest() {
    console.log('\n=== 性能测试 ===');

    // 创建长字符串测试
    const words = ['hello', 'world', 'javascript', 'programming', 'algorithm'];
    const longString = words.join(' ').repeat(10000) + '   finalword   ';

    console.log(`测试字符串长度: ${longString.length}`);
    console.log('最后一个单词: "finalword"');

    console.time('反向遍历法');
    const result1 = lengthOfLastWord(longString);
    console.timeEnd('反向遍历法');

    console.time('优化反向遍历法');
    const result2 = lengthOfLastWordOptimized(longString);
    console.timeEnd('优化反向遍历法');

    console.time('字符串分割法');
    const result3 = lengthOfLastWordSplit(longString);
    console.timeEnd('字符串分割法');

    console.time('正则表达式法');
    const result4 = lengthOfLastWordRegex(longString);
    console.timeEnd('正则表达式法');

    console.time('内置方法组合');
    const result5 = lengthOfLastWordBuiltIn(longString);
    console.timeEnd('内置方法组合');

    console.time('双指针法');
    const result6 = lengthOfLastWordTwoPointers(longString);
    console.timeEnd('双指针法');

    console.log(`所有方法结果一致: ${result1 === result2 && result2 === result3 && result3 === result4 && result4 === result5 && result5 === result6 ? '✅' : '❌'}`);
    console.log(`最后单词长度: ${result1}`);
}

// 边界情况分析
function edgeCaseAnalysis() {
    console.log('\n=== 边界情况分析 ===');

    const edgeCases = [
        {
            input: "",
            description: "空字符串",
            handling: "返回0"
        },
        {
            input: "   ",
            description: "只有空格",
            handling: "跳过所有空格，返回0"
        },
        {
            input: "a",
            description: "单个字符",
            handling: "直接返回1"
        },
        {
            input: "   a   ",
            description: "单个字符前后有空格",
            handling: "跳过空格，返回1"
        },
        {
            input: "word",
            description: "单个单词",
            handling: "返回单词长度"
        },
        {
            input: "multiple   spaces",
            description: "多个连续空格",
            handling: "正确识别单词边界"
        }
    ];

    console.log('边界情况处理策略:');
    edgeCases.forEach((testCase, index) => {
        console.log(`${index + 1}. ${testCase.description}: "${testCase.input}"`);
        console.log(`   处理方法: ${testCase.handling}`);
        console.log(`   结果: ${lengthOfLastWord(testCase.input)}`);
        console.log('');
    });
}

// 算法思路演示
function algorithmDemo() {
    console.log('\n=== 算法思路演示 ===');

    const example = "   fly me   to   the moon  ";
    console.log(`示例字符串: "${example}"`);
    console.log('字符串索引: ' + Array.from({length: example.length}, (_, i) => i % 10).join(''));
    console.log('字符内容:   ' + example.split('').map(c => c === ' ' ? '·' : c).join(''));
    console.log('');

    console.log('反向遍历过程:');
    let i = example.length - 1;
    let step = 1;

    console.log(`步骤${step++}: 从索引 ${i} 开始，字符为 '${example[i] === ' ' ? '空格' : example[i]}'`);

    // 跳过末尾空格
    while (i >= 0 && example[i] === ' ') {
        console.log(`步骤${step++}: 索引 ${i} 是空格，向前移动`);
        i--;
    }

    console.log(`步骤${step++}: 索引 ${i} 是非空格字符 '${example[i]}'，开始计数`);

    // 计算单词长度
    let length = 0;
    const wordStart = i;
    while (i >= 0 && example[i] !== ' ') {
        length++;
        console.log(`步骤${step++}: 索引 ${i} 字符 '${example[i]}'，长度计数 = ${length}`);
        i--;
    }

    console.log(`步骤${step++}: 遇到空格或到达开头，停止计数`);
    console.log(`最后单词 "${example.substring(i + 1, wordStart + 1)}" 长度为: ${length}`);
}

// 复杂度分析
function complexityAnalysis() {
    console.log('\n=== 算法复杂度分析 ===');

    console.log('1. 反向遍历法（推荐）:');
    console.log('   时间复杂度: O(n) - 最坏情况遍历整个字符串');
    console.log('   空间复杂度: O(1) - 只使用常数额外空间');
    console.log('   优点: 效率高，空间占用小');
    console.log('   适用: 大部分情况的最优解');
    console.log('');

    console.log('2. 字符串分割法:');
    console.log('   时间复杂度: O(n) - 需要遍历整个字符串进行分割');
    console.log('   空间复杂度: O(n) - 创建数组存储分割结果');
    console.log('   优点: 代码简洁，易理解');
    console.log('   缺点: 内存占用大，处理所有单词');
    console.log('');

    console.log('3. 正则表达式法:');
    console.log('   时间复杂度: O(n) - 正则引擎遍历字符串');
    console.log('   空间复杂度: O(k) - k为单词数量');
    console.log('   优点: 表达力强，适合复杂模式');
    console.log('   缺点: 正则引擎开销，匹配所有单词');
    console.log('');

    console.log('4. 内置方法组合:');
    console.log('   时间复杂度: O(n) - trim和split都需要遍历');
    console.log('   空间复杂度: O(n) - 创建临时数组');
    console.log('   优点: 代码最简洁');
    console.log('   缺点: 多次遍历，内存占用大');
}

// 扩展应用
function extendedApplications() {
    console.log('\n=== 扩展应用 ===');

    console.log('1. 文本处理变种:');
    console.log('   - 获取第一个单词长度');
    console.log('   - 获取最长/最短单词');
    console.log('   - 统计单词总数');
    console.log('   - 计算平均单词长度');
    console.log('');

    console.log('2. 前端应用场景:');
    console.log('   - 用户输入验证（用户名、标题等）');
    console.log('   - 文本编辑器功能（单词计数）');
    console.log('   - 搜索框提示（最后输入的词）');
    console.log('   - 日志分析（提取关键信息）');
    console.log('');

    console.log('3. 实际开发中的扩展:');
    console.log('   - 处理不同语言的分词');
    console.log('   - 支持自定义分隔符');
    console.log('   - 处理特殊字符和标点');
    console.log('   - Unicode字符处理');
}

// 实际应用示例
function practicalExample() {
    console.log('\n=== 实际应用示例 ===');

    // 模拟用户输入验证
    function validateLastWord(input, maxLength = 10) {
        const lastWordLength = lengthOfLastWord(input);

        if (lastWordLength === 0) {
            return { valid: false, message: '请输入至少一个单词' };
        }

        if (lastWordLength > maxLength) {
            return {
                valid: false,
                message: `最后一个单词长度不能超过${maxLength}个字符（当前：${lastWordLength}）`
            };
        }

        return { valid: true, message: '输入有效' };
    }

    const testInputs = [
        "Hello World",
        "This is a very long word",
        "Short words",
        "   ",
        "Perfect"
    ];

    console.log('用户输入验证示例:');
    testInputs.forEach((input, index) => {
        const result = validateLastWord(input, 8);
        console.log(`输入${index + 1}: "${input}"`);
        console.log(`验证结果: ${result.valid ? '✅' : '❌'} ${result.message}`);
        console.log('');
    });

    // 文本统计功能
    function analyzeText(text) {
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        const lastWordLength = lengthOfLastWord(text);

        return {
            totalWords: words.length,
            lastWordLength: lastWordLength,
            averageWordLength: words.length > 0 ? words.reduce((sum, word) => sum + word.length, 0) / words.length : 0,
            longestWord: words.reduce((longest, word) => word.length > longest.length ? word : longest, ''),
            shortestWord: words.reduce((shortest, word) => word.length < shortest.length ? word : shortest, words[0] || '')
        };
    }

    const sampleText = "JavaScript is a powerful programming language for web development";
    const analysis = analyzeText(sampleText);

    console.log('文本分析示例:');
    console.log(`文本: "${sampleText}"`);
    console.log(`总单词数: ${analysis.totalWords}`);
    console.log(`最后单词长度: ${analysis.lastWordLength}`);
    console.log(`平均单词长度: ${analysis.averageWordLength.toFixed(2)}`);
    console.log(`最长单词: "${analysis.longestWord}" (${analysis.longestWord.length})`);
    console.log(`最短单词: "${analysis.shortestWord}" (${analysis.shortestWord.length})`);
}

// 运行测试
if (require.main === module) {
    runTests();
    performanceTest();
    edgeCaseAnalysis();
    algorithmDemo();
    complexityAnalysis();
    extendedApplications();
    practicalExample();
}