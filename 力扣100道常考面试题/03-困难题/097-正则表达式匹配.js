/**
 * LeetCode 097: 正则表达式匹配 (Regular Expression Matching)
 *
 * 题目描述：
 * 给你一个字符串 s 和一个字符规律 p，请你来实现一个支持 '.' 和 '*' 的正则表达式匹配。
 * - '.' 匹配任意单个字符
 * - '*' 匹配零个或多个前面的那一个元素
 * 所谓匹配，是要涵盖整个字符串 s的，而不是部分字符串。
 *
 * 示例：
 * 输入：s = "aa", p = "a*"
 * 输出：true
 * 解释：因为 '*' 代表可以匹配零个或多个前面的那一个元素, 在这里前面的元素就是 'a'。因此，字符串 "aa" 可被视为 'a' 重复了一次。
 *
 * 输入：s = "ab", p = ".*"
 * 输出：true
 * 解释：".*" 表示可匹配零个或多个（'*'）任意字符（'.'）。
 *
 * 核心思想：
 * 动态规划 - 使用二维DP表记录子问题的匹配结果，处理 '.' 和 '*' 的各种情况
 *
 * 算法原理：
 * 1. 状态定义：dp[i][j] 表示 s[0...i-1] 与 p[0...j-1] 是否匹配
 * 2. 初始状态：空字符串的匹配情况
 * 3. 状态转移：
 *    - 普通字符：直接比较字符是否相等
 *    - '.' 字符：可以匹配任意单个字符
 *    - '*' 字符：可以匹配0个或多个前面的字符
 * 4. 最终结果：dp[m][n] 即为整个字符串的匹配结果
 *
 * 时间复杂度：O(m × n)
 * 空间复杂度：O(m × n)
 */

/**
 * 解法一：动态规划（推荐）
 *
 * 核心思想：
 * 使用二维DP表自底向上解决子问题，避免重复计算
 *
 * 算法步骤：
 * 1. 初始化DP表，处理边界情况
 * 2. 遍历字符串和模式，根据当前字符类型进行状态转移
 * 3. 特别处理 '*' 字符的匹配逻辑（0次或多次匹配）
 *
 * @param {string} s - 待匹配字符串
 * @param {string} p - 正则表达式模式
 * @returns {boolean} 是否完全匹配
 * @time O(m × n) - m为字符串长度，n为模式长度
 * @space O(m × n) - DP表空间
 */
function isMatch(s, p) {
    const m = s.length;
    const n = p.length;

    // dp[i][j] 表示 s[0...i-1] 与 p[0...j-1] 是否匹配
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(false));

    // 初始状态：空字符串匹配空模式
    dp[0][0] = true;

    // 处理空字符串与模式的匹配（只有 x* 模式才能匹配空字符串）
    for (let j = 2; j <= n; j += 2) {
        if (p[j - 1] === '*') {
            dp[0][j] = dp[0][j - 2];
        }
    }

    // 动态规划填表
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            const currentChar = s[i - 1];
            const patternChar = p[j - 1];

            if (patternChar === '*') {
                // '*' 字符处理
                const prevPatternChar = p[j - 2];

                // 情况1：匹配0次，忽略 'x*' 模式
                dp[i][j] = dp[i][j - 2];

                // 情况2：匹配1次或多次
                if (matches(currentChar, prevPatternChar)) {
                    dp[i][j] = dp[i][j] || dp[i - 1][j];
                }
            } else {
                // 普通字符或 '.' 字符处理
                if (matches(currentChar, patternChar)) {
                    dp[i][j] = dp[i - 1][j - 1];
                }
            }
        }
    }

    return dp[m][n];
}

/**
 * 检查字符是否匹配
 * @param {string} sChar - 字符串中的字符
 * @param {string} pChar - 模式中的字符
 * @returns {boolean} 是否匹配
 */
function matches(sChar, pChar) {
    return pChar === '.' || sChar === pChar;
}

/**
 * 解法二：递归 + 记忆化搜索
 *
 * 核心思想：
 * 使用递归自然地处理字符串匹配，通过记忆化避免重复计算
 *
 * 算法步骤：
 * 1. 递归处理字符串的每个位置
 * 2. 根据模式字符类型选择相应的匹配策略
 * 3. 使用记忆化存储已计算的结果
 *
 * @param {string} s - 待匹配字符串
 * @param {string} p - 正则表达式模式
 * @returns {boolean} 是否完全匹配
 * @time O(m × n) - 记忆化后每个状态只计算一次
 * @space O(m × n) - 递归栈 + 记忆化缓存
 */
function isMatchMemo(s, p) {
    const memo = new Map();

    function dfs(i, j) {
        // 记忆化查找
        const key = `${i},${j}`;
        if (memo.has(key)) {
            return memo.get(key);
        }

        let result;

        // 边界条件
        if (j === p.length) {
            result = i === s.length;
        } else {
            // 检查当前位置是否匹配
            const firstMatch = i < s.length && matches(s[i], p[j]);

            // 处理 '*' 字符
            if (j + 1 < p.length && p[j + 1] === '*') {
                // 两种选择：匹配0次或匹配1次然后继续
                result = dfs(i, j + 2) || (firstMatch && dfs(i + 1, j));
            } else {
                // 普通字符匹配
                result = firstMatch && dfs(i + 1, j + 1);
            }
        }

        memo.set(key, result);
        return result;
    }

    return dfs(0, 0);
}

/**
 * 解法三：空间优化的动态规划
 *
 * 核心思想：
 * 使用滚动数组优化空间复杂度，只保存当前行和前一行的状态
 *
 * @param {string} s - 待匹配字符串
 * @param {string} p - 正则表达式模式
 * @returns {boolean} 是否完全匹配
 * @time O(m × n) - 时间复杂度不变
 * @space O(n) - 只使用两行空间
 */
function isMatchOptimized(s, p) {
    const m = s.length;
    const n = p.length;

    // 使用两行来优化空间
    let prev = Array(n + 1).fill(false);
    let curr = Array(n + 1).fill(false);

    // 初始状态
    prev[0] = true;
    for (let j = 2; j <= n; j += 2) {
        if (p[j - 1] === '*') {
            prev[j] = prev[j - 2];
        }
    }

    for (let i = 1; i <= m; i++) {
        curr[0] = false; // 非空字符串不能匹配空模式

        for (let j = 1; j <= n; j++) {
            const currentChar = s[i - 1];
            const patternChar = p[j - 1];

            if (patternChar === '*') {
                const prevPatternChar = p[j - 2];
                curr[j] = curr[j - 2]; // 匹配0次

                if (matches(currentChar, prevPatternChar)) {
                    curr[j] = curr[j] || prev[j]; // 匹配1次或多次
                }
            } else {
                if (matches(currentChar, patternChar)) {
                    curr[j] = prev[j - 1];
                } else {
                    curr[j] = false;
                }
            }
        }

        // 交换数组
        [prev, curr] = [curr, prev];
        curr.fill(false);
    }

    return prev[n];
}

/**
 * 解法四：有限状态自动机
 *
 * 核心思想：
 * 将正则表达式转换为有限状态自动机，然后模拟自动机的运行
 *
 * @param {string} s - 待匹配字符串
 * @param {string} p - 正则表达式模式
 * @returns {boolean} 是否完全匹配
 * @time O(m × n) - 状态转移
 * @space O(n) - 状态集合
 */
function isMatchFSM(s, p) {
    // 构建状态转移图
    const states = buildStates(p);
    let currentStates = new Set([0]); // 从状态0开始

    // 处理初始的 epsilon 转移（处理 a* 这样的模式）
    currentStates = epsilonClosure(currentStates, states);

    // 逐字符处理
    for (const char of s) {
        const nextStates = new Set();

        for (const state of currentStates) {
            if (states[state] && states[state][char]) {
                nextStates.add(states[state][char]);
            }
            if (states[state] && states[state]['.']) {
                nextStates.add(states[state]['.']);
            }
        }

        currentStates = epsilonClosure(nextStates, states);

        if (currentStates.size === 0) {
            return false;
        }
    }

    // 检查是否到达接受状态
    return currentStates.has(p.length);
}

/**
 * 构建状态转移图
 * @param {string} p - 模式字符串
 * @returns {Object[]} 状态转移表
 */
function buildStates(p) {
    const states = [];

    for (let i = 0; i <= p.length; i++) {
        states[i] = {};
    }

    for (let i = 0; i < p.length; i++) {
        if (i + 1 < p.length && p[i + 1] === '*') {
            // 处理 x* 模式
            states[i][p[i]] = i; // 自循环
            states[i]['epsilon'] = i + 2; // 跳过
        } else {
            // 普通字符
            states[i][p[i]] = i + 1;
        }
    }

    return states;
}

/**
 * Epsilon 闭包计算
 * @param {Set} states - 当前状态集合
 * @param {Object[]} stateTable - 状态转移表
 * @returns {Set} Epsilon 闭包
 */
function epsilonClosure(states, stateTable) {
    const closure = new Set(states);
    const stack = [...states];

    while (stack.length > 0) {
        const state = stack.pop();

        if (stateTable[state] && stateTable[state]['epsilon'] !== undefined) {
            const nextState = stateTable[state]['epsilon'];
            if (!closure.has(nextState)) {
                closure.add(nextState);
                stack.push(nextState);
            }
        }
    }

    return closure;
}

/**
 * 扩展应用：通配符匹配
 *
 * 核心思想：
 * 类似正则表达式匹配，但规则略有不同
 * '?' 匹配任意单个字符，'*' 匹配任意字符序列
 *
 * @param {string} s - 待匹配字符串
 * @param {string} p - 通配符模式
 * @returns {boolean} 是否匹配
 * @time O(m × n) - 动态规划
 * @space O(m × n) - DP表
 */
function isWildcardMatch(s, p) {
    const m = s.length;
    const n = p.length;
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(false));

    dp[0][0] = true;

    // 处理开头的 * 字符
    for (let j = 1; j <= n; j++) {
        if (p[j - 1] === '*') {
            dp[0][j] = dp[0][j - 1];
        }
    }

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (p[j - 1] === '*') {
                dp[i][j] = dp[i - 1][j] || dp[i][j - 1];
            } else if (p[j - 1] === '?' || s[i - 1] === p[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            }
        }
    }

    return dp[m][n];
}

// 测试用例
console.log("=== LeetCode 097: 正则表达式匹配 测试 ===");

const testCases = [
    { s: "aa", p: "a" },
    { s: "aa", p: "a*" },
    { s: "ab", p: ".*" },
    { s: "aab", p: "c*a*b" },
    { s: "mississippi", p: "mis*is*p*." },
    { s: "", p: ".*" },
    { s: "ab", p: ".*c" },
    { s: "a", p: "ab*" },
    { s: "bbbba", p: ".*a*a" },
    { s: "abcd", p: "d*" }
];

console.log("\n解法一：动态规划");
testCases.forEach((test, index) => {
    const result = isMatch(test.s, test.p);
    console.log(`测试 ${index + 1}: s="${test.s}", p="${test.p}" => ${result}`);
});

console.log("\n解法二：递归 + 记忆化");
testCases.forEach((test, index) => {
    const result = isMatchMemo(test.s, test.p);
    console.log(`测试 ${index + 1}: s="${test.s}", p="${test.p}" => ${result}`);
});

console.log("\n解法三：空间优化DP");
testCases.forEach((test, index) => {
    const result = isMatchOptimized(test.s, test.p);
    console.log(`测试 ${index + 1}: s="${test.s}", p="${test.p}" => ${result}`);
});

console.log("\n扩展：通配符匹配");
const wildcardTests = [
    { s: "aa", p: "a" },
    { s: "aa", p: "*" },
    { s: "cb", p: "?a" },
    { s: "adceb", p: "*a*b*" },
    { s: "acdcb", p: "a*c?b" }
];

wildcardTests.forEach((test, index) => {
    const result = isWildcardMatch(test.s, test.p);
    console.log(`通配符测试 ${index + 1}: s="${test.s}", p="${test.p}" => ${result}`);
});

/**
 * 模式匹配调试工具
 *
 * 可视化匹配过程，帮助理解算法执行
 *
 * @param {string} s - 字符串
 * @param {string} p - 模式
 */
function debugMatch(s, p) {
    console.log(`\n=== 调试匹配过程: "${s}" vs "${p}" ===`);

    const m = s.length;
    const n = p.length;
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(false));

    dp[0][0] = true;

    // 初始化
    for (let j = 2; j <= n; j += 2) {
        if (p[j - 1] === '*') {
            dp[0][j] = dp[0][j - 2];
        }
    }

    // 填表过程
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            const currentChar = s[i - 1];
            const patternChar = p[j - 1];

            if (patternChar === '*') {
                const prevPatternChar = p[j - 2];
                dp[i][j] = dp[i][j - 2];

                if (matches(currentChar, prevPatternChar)) {
                    dp[i][j] = dp[i][j] || dp[i - 1][j];
                }
            } else {
                if (matches(currentChar, patternChar)) {
                    dp[i][j] = dp[i - 1][j - 1];
                }
            }
        }
    }

    // 打印DP表
    console.log("DP表：");
    console.log("    ", Array.from({length: n + 1}, (_, i) => i === 0 ? "ε" : p[i - 1]).join(" "));
    for (let i = 0; i <= m; i++) {
        const rowLabel = i === 0 ? "ε" : s[i - 1];
        console.log(`${rowLabel}:  `, dp[i].map(x => x ? "T" : "F").join(" "));
    }

    console.log(`最终结果: ${dp[m][n]}`);
}

// 调试示例
debugMatch("aab", "c*a*b");

/**
 * 算法总结：
 *
 * 1. 动态规划（推荐）：
 *    - 时间复杂度：O(m × n)
 *    - 空间复杂度：O(m × n)
 *    - 优点：思路清晰，容易理解和实现
 *    - 核心：状态转移处理 '*' 的两种情况
 *
 * 2. 递归 + 记忆化：
 *    - 时间复杂度：O(m × n)
 *    - 空间复杂度：O(m × n)
 *    - 优点：递归思路自然，易于理解
 *    - 缺点：有递归栈开销
 *
 * 3. 空间优化DP：
 *    - 时间复杂度：O(m × n)
 *    - 空间复杂度：O(n)
 *    - 优点：节省空间
 *    - 适用：空间受限的场景
 *
 * 4. 有限状态自动机：
 *    - 时间复杂度：O(m × n)
 *    - 空间复杂度：O(n)
 *    - 优点：理论上更优雅
 *    - 缺点：实现复杂度较高
 *
 * 核心要点：
 * - '*' 字符的处理是关键（0次或多次匹配）
 * - 边界条件的处理很重要
 * - 状态转移方程需要仔细推导
 * - DP表的初始化不能忽略
 */
