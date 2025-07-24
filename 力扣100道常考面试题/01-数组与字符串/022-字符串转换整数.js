/**
 * LeetCode 024: 字符串转换整数 (String to Integer - atoi)
 *
 * 题目描述：
 * 请你来实现一个 myAtoi(s) 函数，使其能将字符串转换成一个 32 位有符号整数。
 *
 * 算法步骤：
 * 1. 跳过前导空格
 * 2. 检查正负号（+/-）
 * 3. 读取数字字符直到遇到非数字字符或到达字符串末尾
 * 4. 将数字转换为整数
 * 5. 处理整数溢出（32位有符号整数范围：-2^31 到 2^31 - 1）
 *
 * 核心思想：
 * 1. 状态机方法：定义不同状态处理不同字符
 * 2. 边界处理：溢出检测和特殊字符处理
 * 3. 字符分类：空格、符号、数字、其他字符
 *
 * 解题要点：
 * - 正确处理前导空格和符号
 * - 溢出检测要在每次计算前进行
 * - 遇到非数字字符立即停止
 * - 注意32位整数的边界值
 */

// 32位整数的边界值
const INT_MAX = 2147483647;  // 2^31 - 1
const INT_MIN = -2147483648; // -2^31

/**
 * 方法一：状态机法（推荐解法）
 *
 * 核心思想：
 * 使用有限状态机来处理字符串的不同状态
 *
 * 状态定义：
 * - start: 开始状态（处理前导空格）
 * - signed: 符号状态（处理正负号）
 * - in_number: 数字状态（处理数字字符）
 * - end: 结束状态（遇到非数字字符）
 *
 * @param {string} s - 输入字符串
 * @returns {number} 转换后的整数
 * @time O(n) - 遍历字符串一次
 * @space O(1) - 只使用常数额外空间
 */
function myAtoi(s) {
    if (!s) return 0;

    let state = 'start';
    let sign = 1;
    let result = 0;

    // 状态转换表
    const stateTable = {
        'start': {
            ' ': 'start',      // 空格保持在start状态
            '+': 'signed',     // 正号转到signed状态
            '-': 'signed',     // 负号转到signed状态
            'digit': 'in_number', // 数字转到in_number状态
            'other': 'end'     // 其他字符转到end状态
        },
        'signed': {
            'digit': 'in_number', // 符号后只能跟数字
            'other': 'end'        // 其他字符结束
        },
        'in_number': {
            'digit': 'in_number', // 数字继续处理
            'other': 'end'        // 其他字符结束
        },
        'end': {} // 结束状态不再处理
    };

    /**
     * 获取字符类型
     * @param {string} char - 字符
     * @returns {string} 字符类型
     */
    function getCharType(char) {
        if (char === ' ') return ' ';
        if (char === '+' || char === '-') return char;
        if (char >= '0' && char <= '9') return 'digit';
        return 'other';
    }

    /**
     * 检查溢出并更新结果
     * @param {number} current - 当前结果
     * @param {number} digit - 要添加的数字
     * @param {number} sign - 符号
     * @returns {number} 更新后的结果
     */
    function updateResult(current, digit, sign) {
        // 检查溢出
        if (sign === 1) {
            // 正数溢出检查
            if (current > Math.floor(INT_MAX / 10) ||
                (current === Math.floor(INT_MAX / 10) && digit > INT_MAX % 10)) {
                return INT_MAX;
            }
        } else {
            // 负数溢出检查
            if (current > Math.floor(-INT_MIN / 10) ||
                (current === Math.floor(-INT_MIN / 10) && digit > (-INT_MIN) % 10)) {
                return INT_MIN;
            }
        }

        return current * 10 + digit;
    }

    // 处理每个字符
    for (let i = 0; i < s.length && state !== 'end'; i++) {
        const char = s[i];
        const charType = getCharType(char);

        // 状态转换
        if (state in stateTable && charType in stateTable[state]) {
            state = stateTable[state][charType];
        } else if (state in stateTable && 'other' in stateTable[state]) {
            state = stateTable[state]['other'];
        } else {
            state = 'end';
        }

        // 根据状态和字符执行操作
        if (state === 'signed') {
            if (char === '-') {
                sign = -1;
            }
        } else if (state === 'in_number') {
            const digit = parseInt(char);
            result = updateResult(result, digit, sign);
        }
    }

    return result * sign;
}

/**
 * 方法二：直接模拟法
 *
 * 核心思想：
 * 按照题目要求逐步处理字符串
 *
 * 算法步骤：
 * 1. 跳过前导空格
 * 2. 处理符号
 * 3. 逐个处理数字字符
 * 4. 检查溢出
 *
 * @param {string} s - 输入字符串
 * @returns {number} 转换后的整数
 * @time O(n) - 最多遍历字符串一次
 * @space O(1) - 只使用常数额外空间
 */
function myAtoiSimulation(s) {
    if (!s) return 0;

    let index = 0;
    let sign = 1;
    let result = 0;

    // 1. 跳过前导空格
    while (index < s.length && s[index] === ' ') {
        index++;
    }

    // 2. 检查符号
    if (index < s.length && (s[index] === '+' || s[index] === '-')) {
        sign = s[index] === '-' ? -1 : 1;
        index++;
    }

    // 3. 处理数字字符
    while (index < s.length && s[index] >= '0' && s[index] <= '9') {
        const digit = parseInt(s[index]);

        // 检查溢出
        if (result > Math.floor(INT_MAX / 10) ||
            (result === Math.floor(INT_MAX / 10) && digit > INT_MAX % 10)) {
            return sign === 1 ? INT_MAX : INT_MIN;
        }

        result = result * 10 + digit;
        index++;
    }

    return result * sign;
}

/**
 * 方法三：正则表达式法
 *
 * 核心思想：
 * 使用正则表达式匹配符合要求的数字字符串
 *
 * @param {string} s - 输入字符串
 * @returns {number} 转换后的整数
 * @time O(n) - 正则匹配时间
 * @space O(1) - 只使用常数额外空间
 */
function myAtoiRegex(s) {
    if (!s) return 0;

    // 正则表达式：可选的前导空格，可选的符号，数字序列
    const match = s.match(/^\s*([+-]?\d+)/);

    if (!match) return 0;

    const num = parseInt(match[1]);

    // 处理溢出
    if (num > INT_MAX) return INT_MAX;
    if (num < INT_MIN) return INT_MIN;

    return num;
}

/**
 * 方法四：优化的状态机法
 *
 * 核心思想：
 * 简化状态机的状态数量，提高效率
 *
 * @param {string} s - 输入字符串
 * @returns {number} 转换后的整数
 * @time O(n) - 遍历字符串一次
 * @space O(1) - 只使用常数额外空间
 */
function myAtoiOptimized(s) {
    if (!s) return 0;

    let i = 0;
    let sign = 1;
    let result = 0;

    // 跳过空格
    while (i < s.length && s[i] === ' ') i++;

    // 处理符号
    if (i < s.length && (s[i] === '+' || s[i] === '-')) {
        sign = s[i] === '-' ? -1 : 1;
        i++;
    }

    // 处理数字
    while (i < s.length && s[i] >= '0' && s[i] <= '9') {
        const digit = s[i] - '0';

        // 提前检查溢出
        if (result > (INT_MAX - digit) / 10) {
            return sign === 1 ? INT_MAX : INT_MIN;
        }

        result = result * 10 + digit;
        i++;
    }

    return result * sign;
}

/**
 * 方法五：字符处理法（详细版本）
 *
 * 核心思想：
 * 详细处理每种字符情况，便于理解
 *
 * @param {string} s - 输入字符串
 * @returns {number} 转换后的整数
 * @time O(n) - 遍历字符串一次
 * @space O(1) - 只使用常数额外空间
 */
function myAtoiDetailed(s) {
    if (!s || s.length === 0) return 0;

    let index = 0;
    let result = 0;
    let sign = 1;
    let hasSignProcessed = false;
    let hasNumberStarted = false;

    while (index < s.length) {
        const char = s[index];

        if (char === ' ') {
            // 如果已经开始处理数字，空格结束处理
            if (hasNumberStarted) break;
            // 如果已经处理过符号，空格结束处理
            if (hasSignProcessed) break;
        } else if (char === '+' || char === '-') {
            // 如果已经处理过符号或已经开始数字，结束处理
            if (hasSignProcessed || hasNumberStarted) break;

            sign = char === '-' ? -1 : 1;
            hasSignProcessed = true;
        } else if (char >= '0' && char <= '9') {
            hasNumberStarted = true;
            const digit = char - '0';

            // 溢出检查
            if (result > Math.floor(INT_MAX / 10) ||
                (result === Math.floor(INT_MAX / 10) && digit > INT_MAX % 10)) {
                return sign === 1 ? INT_MAX : INT_MIN;
            }

            result = result * 10 + digit;
        } else {
            // 其他字符，结束处理
            break;
        }

        index++;
    }

    return result * sign;
}

// 测试用例
function runTests() {
    console.log('=== LeetCode 024: 字符串转换整数 测试 ===\n');

    const testCases = [
        {
            name: '基础测试1',
            input: '42',
            expected: 42,
            explanation: '简单的正整数转换'
        },
        {
            name: '基础测试2',
            input: '   -42',
            expected: -42,
            explanation: '前导空格和负号'
        },
        {
            name: '基础测试3',
            input: '4193 with words',
            expected: 4193,
            explanation: '数字后跟其他字符'
        },
        {
            name: '基础测试4',
            input: 'words and 987',
            expected: 0,
            explanation: '非数字字符开头'
        },
        {
            name: '正数溢出',
            input: '91283472332',
            expected: INT_MAX,
            explanation: '超过32位正整数最大值'
        },
        {
            name: '负数溢出',
            input: '-91283472332',
            expected: INT_MIN,
            explanation: '超过32位负整数最小值'
        },
        {
            name: '空字符串',
            input: '',
            expected: 0,
            explanation: '空字符串返回0'
        },
        {
            name: '只有空格',
            input: '   ',
            expected: 0,
            explanation: '只有空格返回0'
        },
        {
            name: '只有符号',
            input: '+',
            expected: 0,
            explanation: '只有符号返回0'
        },
        {
            name: '符号后跟非数字',
            input: '+-12',
            expected: 0,
            explanation: '多个符号无效'
        },
        {
            name: '零开头',
            input: '0032',
            expected: 32,
            explanation: '忽略前导零'
        },
        {
            name: '边界值测试',
            input: '2147483647',
            expected: INT_MAX,
            explanation: '32位整数最大值'
        },
        {
            name: '边界值测试2',
            input: '-2147483648',
            expected: INT_MIN,
            explanation: '32位整数最小值'
        },
        {
            name: '小数点',
            input: '3.14159',
            expected: 3,
            explanation: '遇到小数点停止'
        }
    ];

    const methods = [
        { name: '状态机法', func: myAtoi },
        { name: '直接模拟法', func: myAtoiSimulation },
        { name: '正则表达式法', func: myAtoiRegex },
        { name: '优化状态机法', func: myAtoiOptimized },
        { name: '详细字符处理法', func: myAtoiDetailed }
    ];

    testCases.forEach(testCase => {
        console.log(`测试: ${testCase.name}`);
        console.log(`输入: "${testCase.input}"`);
        console.log(`期望: ${testCase.expected}`);
        console.log(`说明: ${testCase.explanation}`);

        methods.forEach(method => {
            const result = method.func(testCase.input);
            const isCorrect = result === testCase.expected;
            console.log(`${method.name}: ${result} ${isCorrect ? '✓' : '✗'}`);
        });
        console.log('');
    });
}

// 性能测试
function performanceTest() {
    console.log('=== 性能测试 ===\n');

    // 生成测试字符串
    const generateTestString = (type) => {
        switch (type) {
            case 'long_number':
                return '   123456789012345678901234567890';
            case 'long_prefix':
                return '   '.repeat(1000) + '123456';
            case 'invalid':
                return 'a'.repeat(1000) + '123';
            case 'mixed':
                return '   +123abc456def';
            default:
                return '123';
        }
    };

    const testCases = [
        { name: '长数字字符串', type: 'long_number' },
        { name: '长前缀空格', type: 'long_prefix' },
        { name: '无效字符串', type: 'invalid' },
        { name: '混合字符串', type: 'mixed' }
    ];

    const methods = [
        { name: '状态机法', func: myAtoi },
        { name: '直接模拟法', func: myAtoiSimulation },
        { name: '优化状态机法', func: myAtoiOptimized }
    ];

    testCases.forEach(testCase => {
        console.log(`测试: ${testCase.name}`);
        const testString = generateTestString(testCase.type);
        console.log(`字符串长度: ${testString.length}`);

        methods.forEach(method => {
            const startTime = performance.now();
            const result = method.func(testString);
            const endTime = performance.now();

            console.log(`${method.name}: ${(endTime - startTime).toFixed(2)}ms, 结果: ${result}`);
        });
        console.log('');
    });
}

// 算法演示
function demonstrateAlgorithm() {
    console.log('=== 算法演示 ===\n');

    const testString = '   -123abc';
    console.log(`演示字符串: "${testString}"`);
    console.log('字符索引:    0123456789');

    console.log('\n状态机法处理过程：');

    let state = 'start';
    let sign = 1;
    let result = 0;
    let index = 0;

    const stateTable = {
        'start': { ' ': 'start', '+': 'signed', '-': 'signed', 'digit': 'in_number', 'other': 'end' },
        'signed': { 'digit': 'in_number', 'other': 'end' },
        'in_number': { 'digit': 'in_number', 'other': 'end' },
        'end': {}
    };

    function getCharType(char) {
        if (char === ' ') return ' ';
        if (char === '+' || char === '-') return char;
        if (char >= '0' && char <= '9') return 'digit';
        return 'other';
    }

    console.log('初始状态: start, sign: 1, result: 0\n');

    for (let i = 0; i < testString.length && state !== 'end'; i++) {
        const char = testString[i];
        const charType = getCharType(char);
        const oldState = state;

        console.log(`步骤${i + 1}:`);
        console.log(`  字符: '${char}' (类型: ${charType})`);
        console.log(`  当前状态: ${oldState}`);

        // 状态转换
        if (state in stateTable && charType in stateTable[state]) {
            state = stateTable[state][charType];
        } else if (state in stateTable && 'other' in stateTable[state]) {
            state = stateTable[state]['other'];
        } else {
            state = 'end';
        }

        console.log(`  新状态: ${state}`);

        // 执行操作
        if (state === 'signed' && char === '-') {
            sign = -1;
            console.log(`  操作: 设置符号为负`);
        } else if (state === 'in_number') {
            const digit = parseInt(char);
            result = result * 10 + digit;
            console.log(`  操作: 添加数字${digit}, result = ${result}`);
        }

        console.log(`  当前结果: ${result * sign}\n`);
    }

    console.log(`最终结果: ${result * sign}`);
}

// 状态机可视化
function demonstrateStateMachine() {
    console.log('=== 状态机可视化 ===\n');

    console.log('状态转换图：');
    console.log('');
    console.log('    [空格]');
    console.log('      ↓');
    console.log('   start ——[+/-]——→ signed ——[数字]——→ in_number');
    console.log('      |                |                   |');
    console.log('   [数字]           [其他]              [数字]');
    console.log('      ↓                ↓                   ↓');
    console.log(' in_number ←————————— end ←————————— in_number');
    console.log('      |                                    |');
    console.log('   [其他]                               [其他]');
    console.log('      ↓                                    ↓');
    console.log('     end                                  end');
    console.log('');

    console.log('状态说明：');
    console.log('- start: 初始状态，处理前导空格');
    console.log('- signed: 符号状态，处理正负号');
    console.log('- in_number: 数字状态，处理数字字符');
    console.log('- end: 结束状态，停止处理');

    // 示例转换
    const examples = [
        { input: '   +123', states: ['start', 'start', 'start', 'start', 'signed', 'in_number', 'in_number', 'in_number'] },
        { input: '-456abc', states: ['start', 'signed', 'in_number', 'in_number', 'in_number', 'end', 'end', 'end'] },
        { input: 'abc123', states: ['start', 'end'] }
    ];

    console.log('\n状态转换示例：');
    examples.forEach((example, index) => {
        console.log(`\n示例${index + 1}: "${example.input}"`);
        console.log('字符: ' + example.input.split('').map(c => `'${c}'`).join(' '));
        console.log('状态: ' + example.states.slice(1).join(' -> '));
    });
}

// 边界情况分析
function edgeCaseAnalysis() {
    console.log('=== 边界情况分析 ===\n');

    const edgeCases = [
        {
            name: '空字符串和null',
            cases: ['', null, undefined],
            analysis: '需要特殊处理，返回0'
        },
        {
            name: '只有空格',
            cases: [' ', '   ', '\t\n'],
            analysis: '跳过所有空白字符后无内容，返回0'
        },
        {
            name: '只有符号',
            cases: ['+', '-', '++', '--', '+-'],
            analysis: '符号后无数字或多个符号，返回0'
        },
        {
            name: '正整数溢出',
            cases: ['2147483648', '2147483647', '99999999999'],
            analysis: '超过INT_MAX时返回INT_MAX'
        },
        {
            name: '负整数溢出',
            cases: ['-2147483649', '-2147483648', '-99999999999'],
            analysis: '超过INT_MIN时返回INT_MIN'
        },
        {
            name: '前导零',
            cases: ['0', '00', '000123', '+000456'],
            analysis: '前导零不影响结果'
        },
        {
            name: '混合字符',
            cases: ['123abc', 'abc123', '12a34', '1.23'],
            analysis: '遇到非数字字符立即停止'
        }
    ];

    edgeCases.forEach(category => {
        console.log(`类别: ${category.name}`);
        console.log(`分析: ${category.analysis}`);
        console.log('测试用例:');

        category.cases.forEach(testCase => {
            const result = myAtoi(testCase);
            console.log(`  "${testCase}" -> ${result}`);
        });
        console.log('');
    });
}

// 溢出检测详解
function overflowAnalysis() {
    console.log('=== 溢出检测详解 ===\n');

    console.log('32位有符号整数范围：');
    console.log(`INT_MAX = ${INT_MAX} (2^31 - 1)`);
    console.log(`INT_MIN = ${INT_MIN} (-2^31)`);

    console.log('\n溢出检测方法：');
    console.log('1. 提前检测法：在乘以10之前检查是否会溢出');
    console.log('2. 边界比较法：与INT_MAX/10和INT_MIN/10进行比较');

    console.log('\n正数溢出检测：');
    console.log('if (result > INT_MAX / 10 || (result === INT_MAX / 10 && digit > INT_MAX % 10))');
    console.log(`   即：if (result > ${Math.floor(INT_MAX / 10)} || (result === ${Math.floor(INT_MAX / 10)} && digit > ${INT_MAX % 10}))`);

    console.log('\n负数溢出检测：');
    console.log('if (result > (-INT_MIN) / 10 || (result === (-INT_MIN) / 10 && digit > (-INT_MIN) % 10))');
    console.log(`   即：if (result > ${Math.floor(-INT_MIN / 10)} || (result === ${Math.floor(-INT_MIN / 10)} && digit > ${(-INT_MIN) % 10}))`);

    // 测试边界情况
    const boundaryTests = [
        '2147483646',  // INT_MAX - 1
        '2147483647',  // INT_MAX
        '2147483648',  // INT_MAX + 1
        '-2147483647', // INT_MIN + 1
        '-2147483648', // INT_MIN
        '-2147483649'  // INT_MIN - 1
    ];

    console.log('\n边界值测试：');
    boundaryTests.forEach(test => {
        const result = myAtoi(test);
        console.log(`"${test}" -> ${result}`);
    });
}

// 复杂度分析
function complexityAnalysis() {
    console.log('=== 复杂度分析 ===\n');

    const methods = [
        {
            name: '状态机法',
            timeComplexity: 'O(n)',
            spaceComplexity: 'O(1)',
            description: '遍历字符串一次，状态转换为常数时间'
        },
        {
            name: '直接模拟法',
            timeComplexity: 'O(n)',
            spaceComplexity: 'O(1)',
            description: '线性遍历，常数空间'
        },
        {
            name: '正则表达式法',
            timeComplexity: 'O(n)',
            spaceComplexity: 'O(1)',
            description: '正则匹配时间复杂度'
        },
        {
            name: '优化状态机法',
            timeComplexity: 'O(n)',
            spaceComplexity: 'O(1)',
            description: '简化状态，提高常数因子'
        }
    ];

    console.log('各方法复杂度对比：');
    console.log('方法\t\t\t时间复杂度\t空间复杂度\t说明');
    console.log('-'.repeat(80));

    methods.forEach(method => {
        console.log(`${method.name.padEnd(15)}\t${method.timeComplexity}\t\t${method.spaceComplexity}\t\t${method.description}`);
    });

    console.log('\n算法特点：');
    console.log('1. 所有方法时间复杂度都是O(n)，空间复杂度都是O(1)');
    console.log('2. 状态机法思路清晰，易于扩展');
    console.log('3. 直接模拟法实现简单，代码紧凑');
    console.log('4. 正则表达式法代码最简洁，但可读性差');
}

// 扩展应用
function extendedApplications() {
    console.log('=== 扩展应用 ===\n');

    console.log('1. 字符串到数字转换：');
    console.log('   - 不同进制的数字转换');
    console.log('   - 浮点数字符串转换');
    console.log('   - 科学计数法解析');

    console.log('\n2. 编译器设计：');
    console.log('   - 词法分析器的数字token识别');
    console.log('   - 表达式解析');
    console.log('   - 语法错误处理');

    // 示例：支持不同进制的转换
    function parseNumber(s, base = 10) {
        if (!s) return 0;

        let index = 0;
        let sign = 1;
        let result = 0;

        // 跳过空格
        while (index < s.length && s[index] === ' ') index++;

        // 处理符号
        if (index < s.length && (s[index] === '+' || s[index] === '-')) {
            sign = s[index] === '-' ? -1 : 1;
            index++;
        }

        // 处理进制前缀
        if (base === 16 && index + 1 < s.length &&
            s[index] === '0' && (s[index + 1] === 'x' || s[index + 1] === 'X')) {
            index += 2;
        }

        // 处理数字
        while (index < s.length) {
            let digit = -1;
            const char = s[index].toLowerCase();

            if (char >= '0' && char <= '9') {
                digit = char - '0';
            } else if (char >= 'a' && char <= 'f' && base === 16) {
                digit = char.charCodeAt(0) - 'a'.charCodeAt(0) + 10;
            } else {
                break;
            }

            if (digit >= base) break;

            result = result * base + digit;
            index++;
        }

        return result * sign;
    }

    console.log('\n扩展示例 - 多进制数字解析：');
    const testCases = [
        { input: '123', base: 10, desc: '十进制' },
        { input: '0xFF', base: 16, desc: '十六进制' },
        { input: '101', base: 2, desc: '二进制' },
        { input: '777', base: 8, desc: '八进制' }
    ];

    testCases.forEach(test => {
        const result = parseNumber(test.input, test.base);
        console.log(`"${test.input}" (${test.desc}) -> ${result}`);
    });
}

// 实际应用示例
function practicalExample() {
    console.log('=== 实际应用示例 ===\n');

    console.log('场景：配置文件解析器');
    console.log('应用：解析配置文件中的数值参数');

    // 模拟配置解析器
    function parseConfig(configText) {
        const lines = configText.split('\n');
        const config = {};

        lines.forEach((line, index) => {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                const parts = trimmed.split('=');
                if (parts.length === 2) {
                    const key = parts[0].trim();
                    const value = parts[1].trim();

                    // 尝试解析为数字
                    const numValue = myAtoi(value);
                    if (numValue !== 0 || value.trim() === '0') {
                        config[key] = numValue;
                    } else {
                        config[key] = value;
                    }
                }
            }
        });

        return config;
    }

    const sampleConfig = `
# 服务器配置
port = 8080
host = localhost
timeout = 30
max_connections = 1000
# 无效的数字配置
invalid_port = abc123
debug_mode = true
buffer_size = 2048MB
`;

    console.log('示例配置文件：');
    console.log(sampleConfig);

    const parsedConfig = parseConfig(sampleConfig);
    console.log('解析结果：');
    Object.entries(parsedConfig).forEach(([key, value]) => {
        console.log(`${key}: ${value} (${typeof value})`);
    });

    console.log('\n用户输入验证示例：');
    function validateUserInput(input) {
        const num = myAtoi(input);

        if (input.trim() === '' || num === 0 && input.trim() !== '0') {
            return { valid: false, error: '输入不是有效数字' };
        }

        if (num === INT_MAX || num === INT_MIN) {
            return { valid: false, error: '数字超出范围' };
        }

        return { valid: true, value: num };
    }

    const userInputs = ['123', '  456  ', 'abc', '999999999999', '0', ''];
    userInputs.forEach(input => {
        const result = validateUserInput(input);
        console.log(`"${input}" -> ${result.valid ? `有效: ${result.value}` : `无效: ${result.error}`}`);
    });
}

// 面试要点总结
function interviewKeyPoints() {
    console.log('=== 面试要点总结 ===\n');

    console.log('🎯 核心考点：');
    console.log('1. 字符串处理和解析');
    console.log('2. 状态机设计思想');
    console.log('3. 边界条件和溢出处理');
    console.log('4. 代码的健壮性和容错性');

    console.log('\n💡 解题思路：');
    console.log('1. 按步骤处理：空格→符号→数字→溢出');
    console.log('2. 状态机：定义状态和转换规则');
    console.log('3. 溢出检测：提前判断避免计算溢出');
    console.log('4. 边界处理：空字符串、特殊字符等');

    console.log('\n🔍 常见陷阱：');
    console.log('1. 忘记处理前导空格');
    console.log('2. 符号处理不当（多个符号、符号位置）');
    console.log('3. 溢出检测时机错误');
    console.log('4. 边界值处理不准确');
    console.log('5. 非数字字符的处理');

    console.log('\n📈 优化技巧：');
    console.log('1. 提前溢出检测避免整数溢出');
    console.log('2. 状态机简化条件判断');
    console.log('3. 字符类型判断优化');
    console.log('4. 早期退出减少不必要计算');

    console.log('\n🎪 扩展问题：');
    console.log('1. 字符串转浮点数');
    console.log('2. 不同进制数字转换');
    console.log('3. 表达式求值');
    console.log('4. 数字字符串比较');

    console.log('\n💼 实际应用：');
    console.log('1. 配置文件解析');
    console.log('2. 用户输入验证');
    console.log('3. 编译器词法分析');
    console.log('4. 数据格式转换');
}

// 导出所有方法
module.exports = {
    myAtoi,
    myAtoiSimulation,
    myAtoiRegex,
    myAtoiOptimized,
    myAtoiDetailed,
    runTests,
    performanceTest,
    demonstrateAlgorithm,
    demonstrateStateMachine,
    edgeCaseAnalysis,
    overflowAnalysis,
    complexityAnalysis,
    extendedApplications,
    practicalExample,
    interviewKeyPoints,
    INT_MAX,
    INT_MIN
};

// 如果直接运行此文件，则执行测试
if (require.main === module) {
    runTests();
    performanceTest();
    demonstrateAlgorithm();
    demonstrateStateMachine();
    edgeCaseAnalysis();
    overflowAnalysis();
    complexityAnalysis();
    extendedApplications();
    practicalExample();
    interviewKeyPoints();
}