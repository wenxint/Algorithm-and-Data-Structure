/**
 * LeetCode 003: 有效的括号 (Valid Parentheses)
 *
 * 题目描述：
 * 给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s，判断字符串是否有效。
 * 有效字符串需满足：
 * 1. 左括号必须用相同类型的右括号闭合
 * 2. 左括号必须以正确的顺序闭合
 *
 * 核心思想：
 * 栈（后进先出）的经典应用 - 用于匹配成对出现的符号
 *
 * 算法原理：
 * 1. 遇到左括号时，将其压入栈中
 * 2. 遇到右括号时，检查栈顶是否为对应的左括号
 * 3. 如果匹配，弹出栈顶；如果不匹配或栈为空，返回false
 * 4. 遍历结束后，栈应该为空（所有括号都已匹配）
 */

/**
 * 解法一：栈匹配法（推荐）
 *
 * 核心思想：
 * 利用栈的LIFO特性，最近的左括号应该最先被匹配
 * 用栈存储待匹配的左括号，遇到右括号时检查是否能与栈顶匹配
 *
 * @param {string} s - 输入字符串
 * @returns {boolean} 是否为有效的括号序列
 * @time O(n) 遍历一次字符串
 * @space O(n) 最坏情况下栈存储所有左括号
 */
function isValid(s) {
    // 边界条件：空字符串认为是有效的
    if (s.length === 0) return true;

    // 长度为奇数，肯定无法完全匹配
    if (s.length % 2 === 1) return false;

    const stack = [];

    // 括号对应关系映射
    const pairs = {
        ')': '(',
        '}': '{',
        ']': '['
    };

    for (let char of s) {
        // 如果是左括号，入栈
        if (char === '(' || char === '{' || char === '[') {
            stack.push(char);
        }
        // 如果是右括号，检查匹配
        else if (char === ')' || char === '}' || char === ']') {
            // 栈为空说明没有对应的左括号
            if (stack.length === 0) {
                return false;
            }

            // 检查栈顶是否为对应的左括号
            const top = stack.pop();
            if (top !== pairs[char]) {
                return false;
            }
        }
        // 忽略其他字符（题目保证只有括号）
    }

    // 最终栈应为空，表示所有括号都已匹配
    return stack.length === 0;
}

/**
 * 解法二：优化的栈匹配法
 *
 * 核心思想：
 * 直接将右括号入栈，遇到左括号时弹出检查
 * 这样可以减少一次映射查找
 *
 * @param {string} s - 输入字符串
 * @returns {boolean} 是否为有效的括号序列
 * @time O(n) 遍历一次字符串
 * @space O(n) 栈存储空间
 */
function isValidOptimized(s) {
    if (s.length % 2 === 1) return false;

    const stack = [];

    for (let char of s) {
        // 遇到左括号，将对应的右括号入栈
        if (char === '(') {
            stack.push(')');
        } else if (char === '{') {
            stack.push('}');
        } else if (char === '[') {
            stack.push(']');
        }
        // 遇到右括号，检查是否与栈顶匹配
        else {
            // 栈为空或不匹配
            if (stack.length === 0 || stack.pop() !== char) {
                return false;
            }
        }
    }

    return stack.length === 0;
}

/**
 * 解法三：计数法（仅适用于单一类型括号）
 *
 * 核心思想：
 * 如果只有一种括号类型，可以用简单的计数法
 * 遇到左括号+1，遇到右括号-1，过程中不能为负，最终应为0
 *
 * 注意：此方法不适用于多种括号混合的情况！
 *
 * @param {string} s - 输入字符串（假设只有圆括号）
 * @returns {boolean} 是否为有效的括号序列
 * @time O(n) 遍历一次字符串
 * @space O(1) 只使用常数空间
 */
function isValidSimple(s) {
    let count = 0;

    for (let char of s) {
        if (char === '(') {
            count++;
        } else if (char === ')') {
            count--;
            // 右括号过多
            if (count < 0) {
                return false;
            }
        }
    }

    // 最终应该完全匹配
    return count === 0;
}

/**
 * 解法四：字符串替换法（不推荐，效率低）
 *
 * 核心思想：
 * 反复删除成对的括号，直到无法删除为止
 * 如果最终字符串为空，则原字符串有效
 *
 * @param {string} s - 输入字符串
 * @returns {boolean} 是否为有效的括号序列
 * @time O(n²) 每次替换需要O(n)，最多n/2次替换
 * @space O(n) 字符串操作的空间
 */
function isValidReplace(s) {
    // 持续替换成对的括号
    while (s.includes('()') || s.includes('{}') || s.includes('[]')) {
        s = s.replace('()', '').replace('{}', '').replace('[]', '');
    }

    // 如果最终为空字符串，则原字符串有效
    return s === '';
}

// 测试用例
function runTests() {
    console.log('=== LeetCode 003: 有效的括号 测试 ===\n');

    const testCases = [
        {
            input: "()",
            expected: true,
            description: '简单圆括号对'
        },
        {
            input: "()[]{}",
            expected: true,
            description: '三种括号各一对'
        },
        {
            input: "(]",
            expected: false,
            description: '类型不匹配'
        },
        {
            input: "([)]",
            expected: false,
            description: '交叉嵌套，顺序错误'
        },
        {
            input: "{[]}",
            expected: true,
            description: '正确的嵌套'
        },
        {
            input: "",
            expected: true,
            description: '空字符串'
        },
        {
            input: "(((",
            expected: false,
            description: '只有左括号'
        },
        {
            input: ")))",
            expected: false,
            description: '只有右括号'
        },
        {
            input: "(){}}{",
            expected: false,
            description: '右括号多于左括号'
        },
        {
            input: "((()))",
            expected: true,
            description: '深度嵌套'
        }
    ];

    testCases.forEach((test, index) => {
        console.log(`测试用例 ${index + 1}: ${test.description}`);
        console.log(`输入: "${test.input}"`);

        // 测试栈匹配法
        const result1 = isValid(test.input);
        console.log(`栈匹配法结果: ${result1}`);

        // 测试优化栈法
        const result2 = isValidOptimized(test.input);
        console.log(`优化栈法结果: ${result2}`);

        // 测试替换法
        const result3 = isValidReplace(test.input);
        console.log(`替换法结果: ${result3}`);

        // 验证结果
        const isCorrect = result1 === test.expected;
        console.log(`结果验证: ${isCorrect ? '✅ 通过' : '❌ 失败'}`);
        console.log('---');
    });
}

// 可视化演示
function visualDemo() {
    console.log('\n=== 括号匹配可视化演示 ===');

    const example = "({[]})";
    console.log(`示例字符串: "${example}"`);
    console.log('\n栈操作过程:');

    const stack = [];
    const pairs = { ')': '(', '}': '{', ']': '[' };

    for (let i = 0; i < example.length; i++) {
        const char = example[i];
        console.log(`\n步骤 ${i + 1}: 处理字符 '${char}'`);

        if (char === '(' || char === '{' || char === '[') {
            stack.push(char);
            console.log(`  左括号入栈，栈内容: [${stack.join(', ')}]`);
        } else {
            const top = stack.pop();
            console.log(`  右括号，弹出栈顶: '${top}'`);
            console.log(`  检查匹配: '${top}' 与 '${char}' 是否对应`);
            console.log(`  匹配结果: ${top === pairs[char] ? '✅ 匹配' : '❌ 不匹配'}`);
            console.log(`  栈内容: [${stack.join(', ')}]`);
        }
    }

    console.log(`\n最终栈是否为空: ${stack.length === 0 ? '✅ 是' : '❌ 否'}`);
    console.log(`字符串是否有效: ${stack.length === 0 ? '✅ 有效' : '❌ 无效'}`);
}

// 性能测试
function performanceTest() {
    console.log('\n=== 性能对比测试 ===');

    // 生成大规模测试数据
    const size = 10000;
    let testString = '';

    // 生成有效的括号序列
    const brackets = ['()', '{}', '[]'];
    for (let i = 0; i < size; i++) {
        testString += brackets[i % 3];
    }

    console.log(`测试数据长度: ${testString.length} 个字符`);

    // 测试栈匹配法
    console.time('栈匹配法');
    const result1 = isValid(testString);
    console.timeEnd('栈匹配法');

    // 测试优化栈法
    console.time('优化栈法');
    const result2 = isValidOptimized(testString);
    console.timeEnd('优化栈法');

    // 测试替换法（小数据量）
    if (size <= 1000) {
        console.time('替换法');
        const result3 = isValidReplace(testString);
        console.timeEnd('替换法');
    } else {
        console.log('替换法: 数据量过大，跳过测试');
    }

    console.log(`所有方法结果一致: ${result1 === result2 ? '✅' : '❌'}`);
}

// 算法复杂度分析
function complexityAnalysis() {
    console.log('\n=== 算法复杂度分析 ===');

    console.log('1. 栈匹配法（推荐）:');
    console.log('   时间复杂度: O(n) - 遍历一次字符串');
    console.log('   空间复杂度: O(n) - 最坏情况栈存储所有左括号');
    console.log('   优点: 逻辑清晰，易于理解和扩展');
    console.log('   缺点: 需要额外的映射表');

    console.log('\n2. 优化栈法:');
    console.log('   时间复杂度: O(n) - 遍历一次字符串');
    console.log('   空间复杂度: O(n) - 栈存储空间');
    console.log('   优点: 减少了映射查找，效率略高');
    console.log('   缺点: 代码稍微复杂一些');

    console.log('\n3. 字符串替换法:');
    console.log('   时间复杂度: O(n²) - 多次字符串替换操作');
    console.log('   空间复杂度: O(n) - 字符串操作空间');
    console.log('   优点: 思路直观');
    console.log('   缺点: 效率低，不适合大数据');

    console.log('\n推荐解法: 栈匹配法');
    console.log('理由: 时间复杂度最优，逻辑清晰，面试常用');
}

// 常见错误示例
function commonMistakes() {
    console.log('\n=== 常见错误分析 ===');

    console.log('❌ 错误1: 忘记检查栈是否为空');
    console.log(`
function wrongCheck(s) {
    const stack = [];
    for (let char of s) {
        if (char === '(') stack.push(char);
        else if (char === ')') {
            const top = stack.pop(); // 如果栈为空，top为undefined
            if (top !== '(') return false;
        }
    }
    return stack.length === 0;
}
    `);

    console.log('✅ 正确做法: 先检查栈是否为空');
    console.log(`
function correctCheck(s) {
    const stack = [];
    for (let char of s) {
        if (char === '(') stack.push(char);
        else if (char === ')') {
            if (stack.length === 0) return false; // 先检查
            const top = stack.pop();
            if (top !== '(') return false;
        }
    }
    return stack.length === 0;
}
    `);

    console.log('\n❌ 错误2: 忘记检查最终栈状态');
    console.log('应该确保栈最终为空，否则有未匹配的左括号');

    console.log('\n❌ 错误3: 没有处理字符串长度为奇数的情况');
    console.log('奇数长度的字符串不可能完全匹配');
}

// 扩展应用
function applications() {
    console.log('\n=== 实际应用场景 ===');

    console.log('1. 编程语言解析器:');
    console.log('   - 语法检查，确保代码中的括号正确配对');
    console.log('   - 编译器和IDE的语法高亮');

    console.log('\n2. 数学表达式验证:');
    console.log('   - 检查数学公式中括号的正确性');
    console.log('   - 计算器程序的表达式解析');

    console.log('\n3. HTML/XML标签匹配:');
    console.log('   - 检查标签的正确闭合');
    console.log('   - 网页解析和验证');

    console.log('\n4. 文本编辑器功能:');
    console.log('   - 括号匹配高亮显示');
    console.log('   - 自动补全右括号');
}

// 运行所有测试
if (require.main === module) {
    runTests();
    visualDemo();
    performanceTest();
    complexityAnalysis();
    commonMistakes();
    applications();
}

// 导出函数供其他模块使用
module.exports = {
    isValid,
    isValidOptimized,
    isValidSimple,
    isValidReplace
};