/**
 * LeetCode 65. 有效数字
 *
 * 问题描述：
 * 给定一个字符串 s ，返回 s 是否是一个 有效数字。
 *
 * 有效数字按以下规则定义：
 * 1. 整数：(+/-)digits
 * 2. 小数：(+/-)digits.digits 或 (+/-)digits. 或 (+/-).digits
 * 3. 科学计数法：上述两种数字后加 e/E 再加整数
 *
 * 例如：有效 ["2", "0089", "-0.1", "+3.14", "4.", "-.9", "2e10", "-90E3", "3e+7", "+6e-1", "53.5e93", "-123.456e789"]
 *      无效 ["abc", "1a", "1e", "e3", "99e2.5", "--6", "-+3", "95a54e53"]
 *
 * 核心思想：
 * 使用有限状态机（FSM）或正则表达式来验证字符串是否符合数字格式
 * 需要处理多种状态转换和边界情况
 *
 * 示例：
 * 输入：s = "0"
 * 输出：true
 *
 * 输入：s = "e"
 * 输出：false
 */

/**
 * 方法一：有限状态机（推荐）
 *
 * 核心思想：
 * 定义9个状态，通过状态转换来验证数字格式：
 * 0: 开始状态
 * 1: 符号位
 * 2: 整数部分
 * 3: 小数点
 * 4: 小数部分
 * 5: 科学计数法标识符e/E
 * 6: 指数符号位
 * 7: 指数部分
 * 8: 结束状态
 *
 * @param {string} s - 输入字符串
 * @returns {boolean} 是否为有效数字
 * @time O(n) 遍历字符串一次
 * @space O(1) 状态机常量空间
 */
function isNumber(s) {
    console.log("=== 有效数字（状态机） ===");
    console.log(`输入字符串: "${s}"`);

    if (!s || s.length === 0) {
        console.log("空字符串，返回false");
        return false;
    }

    // 定义状态转换表
    // 状态编号：0开始 1符号 2整数 3小数点 4小数 5e 6指数符号 7指数 8结束
    const transitions = {
        0: { space: 0, sign: 1, digit: 2, dot: 3 },
        1: { digit: 2, dot: 3 },
        2: { digit: 2, dot: 4, e: 5, space: 8 },
        3: { digit: 4 },
        4: { digit: 4, e: 5, space: 8 },
        5: { sign: 6, digit: 7 },
        6: { digit: 7 },
        7: { digit: 7, space: 8 },
        8: { space: 8 }
    };

    // 有效结束状态
    const validEndStates = new Set([2, 4, 7, 8]);

    let state = 0;
    console.log("\n状态转换过程:");
    console.log(`初始状态: ${state}`);

    for (let i = 0; i < s.length; i++) {
        const char = s[i];
        let charType;

        // 确定字符类型
        if (char === ' ') {
            charType = 'space';
        } else if (char === '+' || char === '-') {
            charType = 'sign';
        } else if (char >= '0' && char <= '9') {
            charType = 'digit';
        } else if (char === '.') {
            charType = 'dot';
        } else if (char === 'e' || char === 'E') {
            charType = 'e';
        } else {
            charType = 'invalid';
        }

        console.log(`字符'${char}' (类型:${charType}) -> 当前状态:${state}`);

        // 查找状态转换
        if (!transitions[state] || !transitions[state][charType]) {
            console.log(`无效转换，返回false`);
            return false;
        }

        state = transitions[state][charType];
        console.log(`  转换到状态: ${state}`);
    }

    const isValid = validEndStates.has(state);
    console.log(`\n最终状态: ${state}`);
    console.log(`是否有效: ${isValid} (有效结束状态: [${Array.from(validEndStates).join(', ')}])`);

    return isValid;
}

/**
 * 方法二：正则表达式
 *
 * 核心思想：
 * 使用正则表达式一次性匹配所有有效的数字格式
 * 正则表达式包含所有可能的数字组合
 *
 * @param {string} s - 输入字符串
 * @returns {boolean} 是否为有效数字
 * @time O(n) 正则匹配
 * @space O(1) 常量空间
 */
function isNumberRegex(s) {
    console.log("\n=== 有效数字（正则表达式） ===");
    console.log(`输入字符串: "${s}"`);

    // 构建正则表达式
    // ^\s* - 开头的空格
    // [+-]? - 可选的符号
    // (\d+\.?\d*|\.\d+) - 数字部分：整数.小数 或 .小数
    // ([eE][+-]?\d+)? - 可选的科学计数法部分
    // \s*$ - 结尾的空格
    const regex = /^\s*[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?\s*$/;

    console.log(`正则表达式: ${regex}`);

    const result = regex.test(s);
    console.log(`匹配结果: ${result}`);

    return result;
}

/**
 * 方法三：分段解析
 *
 * 核心思想：
 * 手动解析字符串的每个部分：
 * 1. 去除首尾空格
 * 2. 检查符号位
 * 3. 解析数字部分（整数+小数）
 * 4. 解析科学计数法部分
 *
 * @param {string} s - 输入字符串
 * @returns {boolean} 是否为有效数字
 * @time O(n) 线性遍历
 * @space O(1) 常量空间
 */
function isNumberManual(s) {
    console.log("\n=== 有效数字（分段解析） ===");
    console.log(`输入字符串: "${s}"`);

    // 去除首尾空格
    s = s.trim();
    console.log(`去空格后: "${s}"`);

    if (s.length === 0) {
        console.log("空字符串，返回false");
        return false;
    }

    let i = 0;

    // 1. 处理符号位
    if (s[i] === '+' || s[i] === '-') {
        console.log(`处理符号位: '${s[i]}'`);
        i++;
    }

    let hasDigit = false;
    let hasDot = false;

    // 2. 处理数字和小数点
    console.log("处理数字和小数点部分:");
    while (i < s.length && (isDigit(s[i]) || s[i] === '.')) {
        if (s[i] === '.') {
            if (hasDot) {
                console.log("多个小数点，返回false");
                return false;
            }
            hasDot = true;
            console.log(`  遇到小数点，位置${i}`);
        } else {
            hasDigit = true;
            console.log(`  数字'${s[i]}'，位置${i}`);
        }
        i++;
    }

    if (!hasDigit) {
        console.log("没有数字，返回false");
        return false;
    }

    // 3. 处理科学计数法
    if (i < s.length && (s[i] === 'e' || s[i] === 'E')) {
        console.log(`处理科学计数法: '${s[i]}'，位置${i}`);
        i++;

        // 指数的符号位
        if (i < s.length && (s[i] === '+' || s[i] === '-')) {
            console.log(`指数符号位: '${s[i]}'，位置${i}`);
            i++;
        }

        // 指数必须有数字
        let hasExpDigit = false;
        while (i < s.length && isDigit(s[i])) {
            hasExpDigit = true;
            console.log(`  指数数字'${s[i]}'，位置${i}`);
            i++;
        }

        if (!hasExpDigit) {
            console.log("指数部分没有数字，返回false");
            return false;
        }
    }

    // 4. 检查是否完全解析
    const fullyParsed = i === s.length;
    console.log(`解析完成，位置${i}/${s.length}，完全解析: ${fullyParsed}`);

    return fullyParsed;

    function isDigit(c) {
        return c >= '0' && c <= '9';
    }
}

/**
 * 方法四：递归下降解析器
 *
 * 核心思想：
 * 使用递归下降的方法解析数字的语法：
 * Number := Sign? (Integer | Decimal) Exponent?
 * Sign := '+' | '-'
 * Integer := Digit+
 * Decimal := Digit+ '.' Digit* | Digit* '.' Digit+
 * Exponent := ('e'|'E') Sign? Digit+
 *
 * @param {string} s - 输入字符串
 * @returns {boolean} 是否为有效数字
 * @time O(n) 递归解析
 * @space O(n) 递归栈深度
 */
function isNumberRecursive(s) {
    console.log("\n=== 有效数字（递归下降） ===");
    console.log(`输入字符串: "${s}"`);

    s = s.trim();
    if (s.length === 0) return false;

    let pos = 0;

    function peek() {
        return pos < s.length ? s[pos] : null;
    }

    function consume() {
        return pos < s.length ? s[pos++] : null;
    }

    function parseSign() {
        console.log(`parseSign: pos=${pos}, char='${peek()}'`);
        if (peek() === '+' || peek() === '-') {
            console.log(`  消费符号: '${peek()}'`);
            consume();
            return true;
        }
        return true;
    }

    function parseDigit() {
        const char = peek();
        if (char >= '0' && char <= '9') {
            consume();
            return true;
        }
        return false;
    }

    function parseDigits() {
        console.log(`parseDigits: pos=${pos}, char='${peek()}'`);
        let count = 0;
        while (parseDigit()) {
            count++;
        }
        console.log(`  解析了${count}个数字`);
        return count > 0;
    }

    function parseInteger() {
        console.log(`parseInteger: pos=${pos}`);
        return parseDigits();
    }

    function parseDecimal() {
        console.log(`parseDecimal: pos=${pos}`);
        const startPos = pos;

        // 情况1: digits.digits?
        if (parseDigits()) {
            if (peek() === '.') {
                console.log("  消费小数点");
                consume();
                parseDigits(); // 可选
                return true;
            }
            pos = startPos; // 回退
        }

        // 情况2: digits?.digits
        const hasLeadingDigits = parseDigits();
        if (peek() === '.') {
            console.log("  消费小数点");
            consume();
            const hasTrailingDigits = parseDigits();
            return hasLeadingDigits || hasTrailingDigits;
        }

        return false;
    }

    function parseExponent() {
        console.log(`parseExponent: pos=${pos}, char='${peek()}'`);
        if (peek() === 'e' || peek() === 'E') {
            console.log(`  消费e/E: '${peek()}'`);
            consume();
            parseSign();
            return parseDigits();
        }
        return true; // 指数是可选的
    }

    function parseNumber() {
        console.log(`parseNumber: 开始解析`);

        parseSign();

        // 尝试解析小数或整数
        const startPos = pos;
        let hasNumber = false;

        // 尝试小数
        if (parseDecimal()) {
            hasNumber = true;
        } else {
            // 回退并尝试整数
            pos = startPos;
            if (parseInteger()) {
                hasNumber = true;
            }
        }

        if (!hasNumber) {
            console.log("没有有效的数字部分");
            return false;
        }

        return parseExponent();
    }

    const result = parseNumber() && pos === s.length;
    console.log(`递归解析结果: ${result}, 解析位置: ${pos}/${s.length}`);

    return result;
}

// ===========================================
// 辅助函数
// ===========================================

/**
 * 状态机状态说明
 */
function explainStateMachine() {
    console.log("\n=== 状态机说明 ===");

    const states = {
        0: "开始状态 - 可以接受空格、符号、数字、小数点",
        1: "符号状态 - 刚读到符号，可以接受数字、小数点",
        2: "整数状态 - 已读到整数，可以接受数字、小数点、e、空格",
        3: "小数点状态 - 刚读到小数点，必须接受数字",
        4: "小数状态 - 已读到小数，可以接受数字、e、空格",
        5: "e状态 - 刚读到e，可以接受符号、数字",
        6: "指数符号状态 - 刚读到指数符号，必须接受数字",
        7: "指数状态 - 已读到指数，可以接受数字、空格",
        8: "结束状态 - 只能接受空格"
    };

    for (const [state, desc] of Object.entries(states)) {
        console.log(`状态 ${state}: ${desc}`);
    }
}

/**
 * 测试各种边界情况
 * @param {string} s - 测试字符串
 */
function testEdgeCases(s) {
    console.log(`\n=== 边界测试: "${s}" ===`);

    const methods = [
        { name: "状态机", func: isNumber },
        { name: "正则表达式", func: isNumberRegex },
        { name: "分段解析", func: isNumberManual },
        { name: "递归下降", func: isNumberRecursive }
    ];

    const results = [];

    for (const method of methods) {
        try {
            console.log(`\n--- ${method.name} ---`);
            const result = method.func(s);
            results.push(result);
            console.log(`${method.name}结果: ${result}`);
        } catch (error) {
            console.log(`${method.name}执行失败: ${error.message}`);
            results.push(null);
        }
    }

    // 检查一致性
    const validResults = results.filter(r => r !== null);
    const allSame = validResults.length > 0 && validResults.every(r => r === validResults[0]);
    console.log(`\n结果一致性: ${allSame ? '✅' : '❌'}`);

    if (!allSame) {
        console.log(`不同结果: [${results.join(', ')}]`);
    }

    return validResults.length > 0 ? validResults[0] : false;
}

/**
 * 可视化解析过程
 * @param {string} s - 输入字符串
 */
function visualizeParsing(s) {
    console.log(`\n=== 解析过程可视化: "${s}" ===`);

    if (s.length > 20) {
        console.log("字符串太长，跳过可视化");
        return;
    }

    console.log("字符串结构分析:");

    let trimmed = s.trim();
    console.log(`原始: "${s}"`);
    console.log(`去空格: "${trimmed}"`);

    if (trimmed.length === 0) {
        console.log("空字符串");
        return;
    }

    let i = 0;
    const parts = {};

    // 符号位
    if (trimmed[i] === '+' || trimmed[i] === '-') {
        parts.sign = trimmed[i];
        i++;
    }

    // 数字部分
    let numberPart = '';
    let dotPos = -1;

    while (i < trimmed.length &&
           (trimmed[i] >= '0' && trimmed[i] <= '9' || trimmed[i] === '.')) {
        if (trimmed[i] === '.') {
            if (dotPos !== -1) break; // 多个小数点
            dotPos = numberPart.length;
        }
        numberPart += trimmed[i];
        i++;
    }

    if (numberPart) {
        parts.number = numberPart;
        if (dotPos !== -1) {
            parts.integer = numberPart.substring(0, dotPos);
            parts.decimal = numberPart.substring(dotPos + 1);
        } else {
            parts.integer = numberPart;
        }
    }

    // 科学计数法
    if (i < trimmed.length && (trimmed[i] === 'e' || trimmed[i] === 'E')) {
        parts.exponentChar = trimmed[i];
        i++;

        if (i < trimmed.length && (trimmed[i] === '+' || trimmed[i] === '-')) {
            parts.exponentSign = trimmed[i];
            i++;
        }

        let exponentNum = '';
        while (i < trimmed.length && trimmed[i] >= '0' && trimmed[i] <= '9') {
            exponentNum += trimmed[i];
            i++;
        }
        parts.exponent = exponentNum;
    }

    // 剩余字符
    if (i < trimmed.length) {
        parts.remaining = trimmed.substring(i);
    }

    console.log("解析出的部分:");
    for (const [key, value] of Object.entries(parts)) {
        console.log(`  ${key}: "${value}"`);
    }
}

/**
 * 性能测试
 */
function performanceTest() {
    console.log("\n=== 性能测试 ===");

    const testCases = [
        "123",
        "-456.789",
        "1.23e10",
        "   +3.14E-2   ",
        ".5",
        "2.",
        "1e5",
        "invalid",
        "1.2.3",
        "1e2.5"
    ];

    const methods = [
        { name: "状态机", func: isNumber },
        { name: "正则表达式", func: isNumberRegex },
        { name: "分段解析", func: isNumberManual },
        { name: "递归下降", func: isNumberRecursive }
    ];

    console.log("测试用例性能对比:");

    for (const testCase of testCases) {
        console.log(`\n测试: "${testCase}"`);

        for (const method of methods) {
            try {
                const startTime = performance.now();
                const result = method.func(testCase);
                const endTime = performance.now();

                console.log(`${method.name}: ${result}, 耗时: ${(endTime - startTime).toFixed(3)}ms`);
            } catch (error) {
                console.log(`${method.name}: 执行失败 - ${error.message}`);
            }
        }
    }
}

// ===========================================
// 测试用例
// ===========================================

/**
 * 测试函数
 */
function runTests() {
    console.log("=".repeat(50));
    console.log("有效数字算法测试");
    console.log("=".repeat(50));

    // 有效数字测试用例
    const validNumbers = [
        "2", "0089", "-0.1", "+3.14", "4.", "-.9", "2e10",
        "-90E3", "3e+7", "+6e-1", "53.5e93", "-123.456e789",
        "   123   ", "0", ".1", "3.", "1e5"
    ];

    // 无效数字测试用例
    const invalidNumbers = [
        "abc", "1a", "1e", "e3", "99e2.5", "--6", "-+3",
        "95a54e53", "", "   ", ".", "e", "1e+", "1.2.3",
        "+", "-", "1e2.5", ".e1"
    ];

    console.log("\n=== 有效数字测试 ===");
    for (let i = 0; i < validNumbers.length; i++) {
        const num = validNumbers[i];
        console.log(`\n测试 ${i + 1}: "${num}" (应该有效)`);

        const result = testEdgeCases(num);
        const isCorrect = result === true;
        console.log(`测试结果: ${isCorrect ? '✅ 正确' : '❌ 错误'}`);
    }

    console.log("\n=== 无效数字测试 ===");
    for (let i = 0; i < invalidNumbers.length; i++) {
        const num = invalidNumbers[i];
        console.log(`\n测试 ${i + 1}: "${num}" (应该无效)`);

        const result = testEdgeCases(num);
        const isCorrect = result === false;
        console.log(`测试结果: ${isCorrect ? '✅ 正确' : '❌ 错误'}`);
    }

    // 状态机说明
    explainStateMachine();

    // 可视化几个例子
    console.log("\n=== 解析过程可视化 ===");
    ["123.45e-6", "  +.5E10  ", "invalid"].forEach(s => {
        visualizeParsing(s);
    });

    // 性能测试
    performanceTest();
}

// ===========================================
// 算法演示
// ===========================================

/**
 * 算法演示函数
 */
function demonstrateAlgorithm() {
    console.log("\n" + "=".repeat(50));
    console.log("有效数字算法演示");
    console.log("=".repeat(50));

    console.log("问题核心:");
    console.log("• 验证字符串是否符合数字的格式规则");
    console.log("• 处理整数、小数、科学计数法等多种格式");
    console.log("• 正确处理符号位、空格等边界情况");

    console.log("\n数字格式规则:");
    console.log("1. 整数: [符号]数字序列");
    console.log("2. 小数: [符号]数字序列.数字序列");
    console.log("3. 科学计数法: 上述格式 + e/E + [符号]数字序列");

    console.log("\n解决方案对比:");
    console.log("1. 状态机: 精确控制状态转换，逻辑清晰");
    console.log("2. 正则表达式: 简洁但不易调试");
    console.log("3. 分段解析: 直观易懂，便于扩展");
    console.log("4. 递归下降: 符合语法规则，适合复杂语法");

    const demoInput = "  -123.45E+6  ";
    console.log(`\n演示输入: "${demoInput}"`);

    console.log("\n详细演示 - 状态机方法:");
    const result = isNumber(demoInput);

    console.log("\n算法复杂度:");
    console.log("• 时间复杂度: O(n) - 需要遍历整个字符串");
    console.log("• 空间复杂度: O(1) - 只需要常量额外空间");

    console.log("\n实际应用:");
    console.log("• 编译器词法分析");
    console.log("• 数据验证和格式检查");
    console.log("• 配置文件解析");
    console.log("• 用户输入验证");
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isNumber,
        isNumberRegex,
        isNumberManual,
        isNumberRecursive,
        explainStateMachine,
        testEdgeCases,
        visualizeParsing,
        performanceTest,
        runTests,
        demonstrateAlgorithm
    };
}

// 如果在浏览器环境中，运行演示
if (typeof window !== 'undefined') {
    runTests();
    demonstrateAlgorithm();
}