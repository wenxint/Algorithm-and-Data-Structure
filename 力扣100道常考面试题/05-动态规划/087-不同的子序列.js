/**
 * LeetCode 115. 不同的子序列
 *
 * 问题描述：
 * 给定一个字符串 s 和一个字符串 t，计算在 s 的子序列中 t 出现的个数。
 * 字符串的一个子序列是指，通过删除一些（也可以不删除）字符且不干扰剩余字符相对位置所组成的新字符串。
 * （例如，"ACE" 是 "ABCDE" 的一个子序列，而 "AEC" 不是）
 *
 * 核心思想：
 * 动态规划 - 二维状态转移
 * dp[i][j] = s的前i个字符中有多少个子序列等于t的前j个字符
 * 状态转移：
 * - 如果 s[i-1] == t[j-1]：dp[i][j] = dp[i-1][j-1] + dp[i-1][j]
 * - 如果 s[i-1] != t[j-1]：dp[i][j] = dp[i-1][j]
 *
 * 示例：
 * 输入：s = "rabbbit", t = "rabbit"
 * 输出：3
 * 解释：有3种方式从s中得到"rabbit"
 */

/**
 * 方法一：二维动态规划（经典解法）
 *
 * 核心思想：
 * 构建二维DP表，dp[i][j]表示s的前i个字符中包含t的前j个字符的子序列个数
 *
 * 状态转移方程：
 * 1. 如果s[i-1] == t[j-1]：
 *    - 可以选择用s[i-1]匹配t[j-1]：dp[i-1][j-1]
 *    - 也可以不用s[i-1]：dp[i-1][j]
 *    - 总数：dp[i][j] = dp[i-1][j-1] + dp[i-1][j]
 * 2. 如果s[i-1] != t[j-1]：
 *    - 只能不用s[i-1]：dp[i][j] = dp[i-1][j]
 *
 * @param {string} s - 原字符串
 * @param {string} t - 目标子序列
 * @returns {number} 不同子序列的个数
 * @time O(m*n) m=s.length, n=t.length
 * @space O(m*n) 二维DP表
 */
function numDistinct(s, t) {
    console.log("=== 不同的子序列（二维DP） ===");
    console.log(`原字符串: "${s}"`);
    console.log(`目标字符串: "${t}"`);

    const m = s.length;
    const n = t.length;

    // 特殊情况处理
    if (n > m) return 0;
    if (n === 0) return 1;

    // 创建DP表：dp[i][j] = s前i个字符中t前j个字符的子序列个数
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

    console.log("\n初始化DP表:");
    // 初始化：空字符串t可以在任何字符串中找到1次
    for (let i = 0; i <= m; i++) {
        dp[i][0] = 1;
    }

    console.log("边界条件：dp[i][0] = 1 (空目标字符串)");

    console.log("\n状态转移过程:");

    // 填充DP表
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            console.log(`\n检查 s[${i-1}]='${s[i-1]}' vs t[${j-1}]='${t[j-1]}'`);

            // 不使用s[i-1]的情况
            dp[i][j] = dp[i - 1][j];
            console.log(`  不用s[${i-1}]: dp[${i}][${j}] = dp[${i-1}][${j}] = ${dp[i-1][j]}`);

            // 如果字符匹配，可以使用s[i-1]匹配t[j-1]
            if (s[i - 1] === t[j - 1]) {
                dp[i][j] += dp[i - 1][j - 1];
                console.log(`  字符匹配，加上dp[${i-1}][${j-1}] = ${dp[i-1][j-1]}`);
                console.log(`  最终: dp[${i}][${j}] = ${dp[i][j]}`);
            } else {
                console.log(`  字符不匹配，保持 dp[${i}][${j}] = ${dp[i][j]}`);
            }
        }
    }

    // 打印DP表
    console.log("\n完整DP表:");
    printDPTable(s, t, dp);

    const result = dp[m][n];
    console.log(`\n结果: s="${s}" 中包含 t="${t}" 的子序列个数为 ${result}`);

    return result;
}

/**
 * 方法二：一维动态规划空间优化
 *
 * 核心思想：
 * 观察状态转移方程，dp[i][j] 只依赖于dp[i-1][j]和dp[i-1][j-1]
 * 可以用一维数组滚动更新，从右向左填充避免覆盖
 *
 * @param {string} s - 原字符串
 * @param {string} t - 目标子序列
 * @returns {number} 不同子序列的个数
 * @time O(m*n) m=s.length, n=t.length
 * @space O(n) 只需要一维数组
 */
function numDistinctOptimized(s, t) {
    console.log("\n=== 不同的子序列（一维DP优化） ===");
    console.log(`原字符串: "${s}"`);
    console.log(`目标字符串: "${t}"`);

    const m = s.length;
    const n = t.length;

    if (n > m) return 0;
    if (n === 0) return 1;

    // 只需要一维数组，dp[j] = 前缀中包含t前j个字符的子序列个数
    let dp = new Array(n + 1).fill(0);
    dp[0] = 1; // 空字符串

    console.log(`初始dp: [${dp.join(', ')}]`);

    // 逐个处理s中的字符
    for (let i = 0; i < m; i++) {
        console.log(`\n处理s[${i}] = '${s[i]}':`);
        console.log(`  当前dp: [${dp.join(', ')}]`);

        // 从右到左更新，避免覆盖还需要用到的值
        for (let j = n; j >= 1; j--) {
            if (s[i] === t[j - 1]) {
                const oldValue = dp[j];
                dp[j] += dp[j - 1];
                console.log(`    s[${i}]='${s[i]}' == t[${j-1}]='${t[j-1]}': dp[${j}] = ${oldValue} + ${dp[j-1]} = ${dp[j]}`);
            } else {
                console.log(`    s[${i}]='${s[i]}' != t[${j-1}]='${t[j-1]}': dp[${j}] 保持 ${dp[j]}`);
            }
        }

        console.log(`  更新后dp: [${dp.join(', ')}]`);
    }

    const result = dp[n];
    console.log(`\n优化解法结果: ${result}`);

    return result;
}

/**
 * 方法三：记忆化递归
 *
 * 核心思想：
 * 递归定义：solve(i, j) = s的前i个字符中包含t的前j个字符的子序列个数
 * 使用备忘录避免重复计算
 *
 * @param {string} s - 原字符串
 * @param {string} t - 目标子序列
 * @returns {number} 不同子序列的个数
 * @time O(m*n) 每个状态只计算一次
 * @space O(m*n) 递归栈 + 备忘录
 */
function numDistinctMemo(s, t) {
    console.log("\n=== 不同的子序列（记忆化递归） ===");
    console.log(`原字符串: "${s}"`);
    console.log(`目标字符串: "${t}"`);

    const m = s.length;
    const n = t.length;

    if (n > m) return 0;
    if (n === 0) return 1;

    // 备忘录：memo[i][j] = s前i个字符中t前j个字符的子序列个数
    const memo = Array(m + 1).fill(null).map(() => Array(n + 1).fill(-1));

    /**
     * 递归求解：s的前i个字符中包含t的前j个字符的子序列个数
     * @param {number} i - s的前i个字符
     * @param {number} j - t的前j个字符
     * @returns {number} 子序列个数
     */
    function solve(i, j, depth = 0) {
        const indent = "  ".repeat(depth);
        console.log(`${indent}solve(${i}, ${j}): s前${i}个字符中t前${j}个字符的子序列个数`);

        // 已计算过
        if (memo[i][j] !== -1) {
            console.log(`${indent}备忘录命中: ${memo[i][j]}`);
            return memo[i][j];
        }

        // 基本情况
        if (j === 0) {
            memo[i][j] = 1; // 空字符串
            console.log(`${indent}基本情况: j=0, 返回1`);
            return 1;
        }

        if (i === 0) {
            memo[i][j] = 0; // s为空但t不为空
            console.log(`${indent}基本情况: i=0但j>0, 返回0`);
            return 0;
        }

        // 递归情况
        let result = 0;

        console.log(`${indent}检查 s[${i-1}]='${s[i-1]}' vs t[${j-1}]='${t[j-1]}'`);

        // 不使用s[i-1]
        const notUse = solve(i - 1, j, depth + 1);
        result += notUse;
        console.log(`${indent}不用s[${i-1}]: +${notUse}`);

        // 如果字符匹配，可以使用s[i-1]
        if (s[i - 1] === t[j - 1]) {
            const use = solve(i - 1, j - 1, depth + 1);
            result += use;
            console.log(`${indent}字符匹配，用s[${i-1}]: +${use}`);
        }

        memo[i][j] = result;
        console.log(`${indent}solve(${i}, ${j}) = ${result}`);

        return result;
    }

    const result = solve(m, n);
    console.log(`\n记忆化递归结果: ${result}`);

    return result;
}

/**
 * 方法四：DFS暴力递归（教学用，小数据）
 *
 * 核心思想：
 * 对于s的每个字符，选择匹配或不匹配t的当前字符
 * 纯暴力递归，指数级时间复杂度
 *
 * @param {string} s - 原字符串
 * @param {string} t - 目标子序列
 * @returns {number} 不同子序列的个数
 * @time O(2^m) 指数级，仅用于理解
 * @space O(m) 递归栈深度
 */
function numDistinctBruteForce(s, t) {
    console.log("\n=== 不同的子序列（暴力递归） ===");
    console.log(`原字符串: "${s}"`);
    console.log(`目标字符串: "${t}"`);

    if (s.length < t.length) return 0;
    if (t.length === 0) return 1;

    let callCount = 0; // 统计递归调用次数

    /**
     * DFS搜索所有可能的匹配方式
     * @param {number} sIndex - s的当前位置
     * @param {number} tIndex - t的当前位置
     * @param {number} depth - 递归深度
     * @returns {number} 从当前位置开始的子序列个数
     */
    function dfs(sIndex, tIndex, depth = 0) {
        callCount++;
        const indent = "  ".repeat(depth);

        if (callCount <= 50) { // 限制输出量
            console.log(`${indent}dfs(${sIndex}, ${tIndex}): s剩余"${s.substr(sIndex)}", t剩余"${t.substr(tIndex)}"`);
        }

        // 基本情况：t已匹配完
        if (tIndex === t.length) {
            if (callCount <= 50) console.log(`${indent}找到一个匹配! 返回1`);
            return 1;
        }

        // 基本情况：s已用完但t还没匹配完
        if (sIndex === s.length) {
            if (callCount <= 50) console.log(`${indent}s用完但t没匹配完，返回0`);
            return 0;
        }

        let count = 0;

        // 选择1：不使用s[sIndex]，直接跳过
        count += dfs(sIndex + 1, tIndex, depth + 1);

        // 选择2：如果字符匹配，使用s[sIndex]匹配t[tIndex]
        if (s[sIndex] === t[tIndex]) {
            count += dfs(sIndex + 1, tIndex + 1, depth + 1);
        }

        if (callCount <= 50) {
            console.log(`${indent}dfs(${sIndex}, ${tIndex}) = ${count}`);
        }

        return count;
    }

    const result = dfs(0, 0);
    console.log(`\n暴力递归结果: ${result}`);
    console.log(`总递归调用次数: ${callCount}`);

    return result;
}

// ===========================================
// 辅助函数
// ===========================================

/**
 * 打印DP表格
 * @param {string} s - 原字符串
 * @param {string} t - 目标字符串
 * @param {number[][]} dp - DP表
 */
function printDPTable(s, t, dp) {
    const m = s.length;
    const n = t.length;

    // 打印表头
    let header = "    ε";
    for (let j = 0; j < n; j++) {
        header += `  ${t[j]}`;
    }
    console.log(header);

    // 打印分隔线
    console.log("  " + "-".repeat(header.length - 2));

    // 打印每行
    for (let i = 0; i <= m; i++) {
        let row = i === 0 ? "ε |" : `${s[i-1]} |`;
        for (let j = 0; j <= n; j++) {
            row += ` ${dp[i][j].toString().padStart(2)}`;
        }
        console.log(row);
    }
}

/**
 * 验证结果的正确性
 * @param {string} s - 原字符串
 * @param {string} t - 目标字符串
 * @param {number[]} results - 各种方法的结果
 */
function validateResults(s, t, results) {
    console.log("\n=== 结果验证 ===");

    const allSame = results.every(result => result === results[0]);
    console.log(`所有方法结果一致: ${allSame ? '✅' : '❌'}`);

    if (!allSame) {
        console.log(`不同结果: [${results.join(', ')}]`);
    }

    // 手动验证小例子
    if (s === "rabbbit" && t === "rabbit") {
        const expected = 3;
        const correct = results[0] === expected;
        console.log(`经典例子验证: 期望${expected}, 实际${results[0]}, 正确: ${correct ? '✅' : '❌'}`);
    }
}

/**
 * 可视化子序列匹配过程
 * @param {string} s - 原字符串
 * @param {string} t - 目标字符串
 */
function visualizeMatching(s, t) {
    console.log("\n=== 匹配过程可视化 ===");

    if (s.length > 10 || t.length > 5) {
        console.log("字符串太长，跳过可视化");
        return;
    }

    console.log(`寻找 "${s}" 中所有等于 "${t}" 的子序列`);

    // 简单的枚举所有可能的子序列（仅适用于小字符串）
    const subsequences = [];

    function generateSubsequences(index, current) {
        if (index === s.length) {
            if (current === t) {
                subsequences.push(current);
            }
            return;
        }

        // 不选当前字符
        generateSubsequences(index + 1, current);

        // 选择当前字符
        generateSubsequences(index + 1, current + s[index]);
    }

    generateSubsequences(0, "");

    console.log(`找到 ${subsequences.length} 个匹配的子序列:`);
    subsequences.forEach((seq, index) => {
        console.log(`  ${index + 1}. "${seq}"`);
    });
}

/**
 * 性能测试
 */
function performanceTest() {
    console.log("\n=== 性能测试 ===");

    const testCases = [
        { s: "rabbbit", t: "rabbit", desc: "经典例子" },
        { s: "babgbag", t: "bag", desc: "简单例子" },
        { s: "aaa", t: "aa", desc: "重复字符" },
        { s: "abc", t: "def", desc: "无匹配" },
        { s: "", t: "", desc: "空字符串" },
        { s: "abc", t: "", desc: "空目标" },
        { s: "a".repeat(20), t: "a".repeat(10), desc: "长重复字符" }
    ];

    const methods = [
        { name: "二维DP", func: numDistinct },
        { name: "一维DP", func: numDistinctOptimized },
        { name: "记忆化递归", func: numDistinctMemo }
    ];

    for (const testCase of testCases) {
        const { s, t, desc } = testCase;
        console.log(`\n测试: ${desc}`);
        console.log(`s="${s}", t="${t}"`);

        const results = [];

        for (const method of methods) {
            try {
                const startTime = performance.now();
                const result = method.func(s, t);
                const endTime = performance.now();

                results.push(result);
                console.log(`${method.name}: 结果=${result}, 耗时=${(endTime - startTime).toFixed(3)}ms`);
            } catch (error) {
                console.log(`${method.name}: 执行失败 - ${error.message}`);
                results.push(null);
            }
        }

        // 验证结果一致性
        validateResults(s, t, results);

        // 小字符串可视化
        if (s.length <= 8 && t.length <= 4) {
            visualizeMatching(s, t);
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
    console.log("不同的子序列算法测试");
    console.log("=".repeat(50));

    const testCases = [
        { s: "rabbbit", t: "rabbit", expected: 3, description: "经典例子" },
        { s: "babgbag", t: "bag", expected: 5, description: "多重匹配" },
        { s: "aaa", t: "aa", expected: 3, description: "重复字符" },
        { s: "abc", t: "abc", expected: 1, description: "完全匹配" },
        { s: "abc", t: "def", expected: 0, description: "无匹配" },
        { s: "", t: "", expected: 1, description: "双空字符串" },
        { s: "abc", t: "", expected: 1, description: "空目标" },
        { s: "", t: "a", expected: 0, description: "空源字符串" },
        { s: "aaaa", t: "aa", expected: 6, description: "多个重复" }
    ];

    testCases.forEach((testCase, index) => {
        console.log(`\n${"=".repeat(30)}`);
        console.log(`测试用例 ${index + 1}: ${testCase.description}`);
        console.log(`${"=".repeat(30)}`);

        const { s, t, expected } = testCase;
        console.log(`s="${s}", t="${t}", 期望结果: ${expected}`);

        // 测试主要方法
        const methods = [
            { name: "二维DP", func: numDistinct },
            { name: "一维DP", func: numDistinctOptimized },
            { name: "记忆化递归", func: numDistinctMemo }
        ];

        // 小数据才测试暴力方法
        if (s.length <= 8) {
            methods.push({ name: "暴力递归", func: numDistinctBruteForce });
        }

        const results = [];

        for (const method of methods) {
            console.log(`\n--- ${method.name} ---`);
            try {
                const result = method.func(s, t);
                results.push(result);

                const isCorrect = result === expected;
                console.log(`结果: ${result}, 期望: ${expected}, 正确: ${isCorrect ? '✅' : '❌'}`);
            } catch (error) {
                console.log(`❌ 方法执行失败: ${error.message}`);
                results.push(null);
            }
        }

        // 检查所有方法结果是否一致
        console.log("\n--- 方法一致性检查 ---");
        const validResults = results.filter(r => r !== null);
        const allSame = validResults.every(result => result === validResults[0]);
        console.log(`所有方法结果一致: ${allSame ? '✅' : '❌'}`);
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
    console.log("不同的子序列算法演示");
    console.log("=".repeat(50));

    console.log("问题核心:");
    console.log("1. 从字符串s中找出所有等于字符串t的子序列");
    console.log("2. 子序列：保持相对顺序，但可以删除字符");
    console.log("3. 计算有多少种不同的选择方式");

    const demoS = "rabbbit";
    const demoT = "rabbit";
    console.log(`\n演示例子: s="${demoS}", t="${demoT}"`);

    console.log("\n动态规划思路:");
    console.log("• dp[i][j] = s前i个字符中包含t前j个字符的子序列个数");
    console.log("• 状态转移：");
    console.log("  - 字符匹配时：可以用当前字符 + 可以不用当前字符");
    console.log("  - 字符不匹配时：只能不用当前字符");

    console.log("\n详细演示 - 二维DP:");
    const result = numDistinct(demoS, demoT);

    console.log("\n算法复杂度分析:");
    console.log("1. 二维DP: 时间O(mn)，空间O(mn)，最易理解");
    console.log("2. 一维DP: 时间O(mn)，空间O(n)，空间优化");
    console.log("3. 记忆化递归: 时间O(mn)，空间O(mn)，递归思想");
    console.log("4. 暴力递归: 时间O(2^m)，仅用于理解");

    console.log("\n关键技巧:");
    console.log("• 状态定义要清晰：前缀匹配的数量");
    console.log("• 选择与不选择的思想：每个字符都有两种可能");
    console.log("• 空间优化：滚动数组技巧");

    console.log("\n实际应用场景:");
    console.log("• 字符串匹配算法");
    console.log("• 编辑距离相关问题");
    console.log("• 序列对比和分析");
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        numDistinct,
        numDistinctOptimized,
        numDistinctMemo,
        numDistinctBruteForce,
        printDPTable,
        validateResults,
        visualizeMatching,
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