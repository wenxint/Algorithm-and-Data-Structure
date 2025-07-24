/**
 * LeetCode 1143. 最长公共子序列
 *
 * 问题描述：
 * 给定两个字符串 text1 和 text2，返回这两个字符串的最长公共子序列的长度。
 * 一个字符串的子序列是指这样一个新的字符串：它是由原字符串在不改变字符的相对顺序的情况下删除某些字符（也可以不删除任何字符）后组成的新字符串。
 *
 * 核心思想：
 * 动态规划经典问题，使用二维DP表来记录两个字符串前i和前j个字符的最长公共子序列长度
 *
 * 示例：
 * 输入：text1 = "abcde", text2 = "ace"
 * 输出：3
 * 解释：最长公共子序列是 "ace"，它的长度为 3。
 */

/**
 * 方法一：二维动态规划（标准解法）
 *
 * 核心思想：
 * dp[i][j] 表示 text1 前 i 个字符和 text2 前 j 个字符的最长公共子序列长度
 * 状态转移方程：
 * - 如果 text1[i-1] === text2[j-1]，则 dp[i][j] = dp[i-1][j-1] + 1
 * - 否则 dp[i][j] = max(dp[i-1][j], dp[i][j-1])
 *
 * @param {string} text1 - 第一个字符串
 * @param {string} text2 - 第二个字符串
 * @returns {number} 最长公共子序列的长度
 * @time O(m*n) m和n分别是两个字符串的长度
 * @space O(m*n) 二维DP表的空间
 */
function longestCommonSubsequence(text1, text2) {
    console.log("=== 最长公共子序列（二维DP） ===");
    console.log(`字符串1: "${text1}"`);
    console.log(`字符串2: "${text2}"`);

    const m = text1.length;
    const n = text2.length;

    // 创建DP表，多一行一列处理边界情况
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

    console.log("\n初始化DP表:");
    printDPTable(dp, text1, text2);

    // 填充DP表
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            console.log(`\n处理 text1[${i-1}]='${text1[i-1]}' 和 text2[${j-1}]='${text2[j-1]}'`);

            if (text1[i - 1] === text2[j - 1]) {
                // 字符匹配，LCS长度+1
                dp[i][j] = dp[i - 1][j - 1] + 1;
                console.log(`  字符匹配! dp[${i}][${j}] = dp[${i-1}][${j-1}] + 1 = ${dp[i][j]}`);
            } else {
                // 字符不匹配，取较大值
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                console.log(`  字符不匹配，dp[${i}][${j}] = max(dp[${i-1}][${j}], dp[${i}][${j-1}]) = max(${dp[i-1][j]}, ${dp[i][j-1]}) = ${dp[i][j]}`);
            }

            // 打印当前DP表状态（只在小规模时显示）
            if (m <= 5 && n <= 5) {
                console.log("当前DP表:");
                printDPTable(dp, text1, text2);
            }
        }
    }

    console.log("\n最终DP表:");
    printDPTable(dp, text1, text2);

    console.log(`\n最长公共子序列长度: ${dp[m][n]}`);
    return dp[m][n];
}

/**
 * 方法二：空间优化的一维DP
 *
 * 核心思想：
 * 观察状态转移方程，dp[i][j] 只依赖于 dp[i-1][j-1]、dp[i-1][j]、dp[i][j-1]
 * 可以用滚动数组优化空间复杂度
 *
 * @param {string} text1 - 第一个字符串
 * @param {string} text2 - 第二个字符串
 * @returns {number} 最长公共子序列的长度
 * @time O(m*n) 时间复杂度不变
 * @space O(min(m,n)) 优化为一维数组
 */
function longestCommonSubsequenceOptimized(text1, text2) {
    console.log("\n=== 最长公共子序列（空间优化） ===");
    console.log(`字符串1: "${text1}"`);
    console.log(`字符串2: "${text2}"`);

    // 确保text2是较短的字符串以优化空间
    if (text1.length < text2.length) {
        [text1, text2] = [text2, text1];
        console.log("交换字符串以优化空间使用");
    }

    const m = text1.length;
    const n = text2.length;

    // 只需要一维数组
    let prev = Array(n + 1).fill(0);
    let curr = Array(n + 1).fill(0);

    console.log(`初始化数组，长度: ${n + 1}`);

    for (let i = 1; i <= m; i++) {
        console.log(`\n处理 text1 的第 ${i} 个字符: '${text1[i-1]}'`);

        for (let j = 1; j <= n; j++) {
            if (text1[i - 1] === text2[j - 1]) {
                curr[j] = prev[j - 1] + 1;
                console.log(`  匹配 '${text2[j-1]}': curr[${j}] = prev[${j-1}] + 1 = ${curr[j]}`);
            } else {
                curr[j] = Math.max(prev[j], curr[j - 1]);
                console.log(`  不匹配 '${text2[j-1]}': curr[${j}] = max(prev[${j}], curr[${j-1}]) = ${curr[j]}`);
            }
        }

        console.log(`第 ${i} 行结果: [${curr.join(', ')}]`);

        // 交换数组
        [prev, curr] = [curr, prev];
        curr.fill(0);
    }

    const result = prev[n];
    console.log(`\n最长公共子序列长度: ${result}`);
    return result;
}

/**
 * 方法三：递归 + 记忆化搜索
 *
 * 核心思想：
 * 从两个字符串的末尾开始递归比较
 * 使用记忆化避免重复计算
 *
 * @param {string} text1 - 第一个字符串
 * @param {string} text2 - 第二个字符串
 * @returns {number} 最长公共子序列的长度
 * @time O(m*n) 记忆化后每个状态只计算一次
 * @space O(m*n) 递归栈 + 记忆化表
 */
function longestCommonSubsequenceMemo(text1, text2) {
    console.log("\n=== 最长公共子序列（记忆化搜索） ===");
    console.log(`字符串1: "${text1}"`);
    console.log(`字符串2: "${text2}"`);

    const m = text1.length;
    const n = text2.length;
    const memo = new Map();

    /**
     * 递归函数
     * @param {number} i - text1的索引
     * @param {number} j - text2的索引
     * @returns {number} 从i,j开始的最长公共子序列长度
     */
    function dfs(i, j) {
        // 边界条件
        if (i === m || j === n) {
            console.log(`  边界条件: i=${i}, j=${j}, 返回 0`);
            return 0;
        }

        // 检查记忆化
        const key = `${i},${j}`;
        if (memo.has(key)) {
            console.log(`  记忆化命中: (${i},${j}) = ${memo.get(key)}`);
            return memo.get(key);
        }

        console.log(`  递归计算: i=${i}(${text1[i]}), j=${j}(${text2[j]})`);

        let result;
        if (text1[i] === text2[j]) {
            // 字符匹配
            result = 1 + dfs(i + 1, j + 1);
            console.log(`    字符匹配，结果 = 1 + dfs(${i+1},${j+1}) = ${result}`);
        } else {
            // 字符不匹配，取较大值
            const option1 = dfs(i + 1, j);
            const option2 = dfs(i, j + 1);
            result = Math.max(option1, option2);
            console.log(`    字符不匹配，结果 = max(dfs(${i+1},${j}), dfs(${i},${j+1})) = max(${option1}, ${option2}) = ${result}`);
        }

        // 记忆化
        memo.set(key, result);
        console.log(`  记忆化存储: (${i},${j}) = ${result}`);

        return result;
    }

    const result = dfs(0, 0);
    console.log(`\n记忆化表大小: ${memo.size}`);
    console.log(`最长公共子序列长度: ${result}`);

    return result;
}

/**
 * 方法四：获取实际的最长公共子序列
 *
 * 核心思想：
 * 在DP的基础上，通过回溯DP表来构建实际的LCS字符串
 *
 * @param {string} text1 - 第一个字符串
 * @param {string} text2 - 第二个字符串
 * @returns {string} 最长公共子序列字符串
 */
function getLongestCommonSubsequence(text1, text2) {
    console.log("\n=== 获取实际的最长公共子序列 ===");
    console.log(`字符串1: "${text1}"`);
    console.log(`字符串2: "${text2}"`);

    const m = text1.length;
    const n = text2.length;

    // 构建DP表
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (text1[i - 1] === text2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    // 回溯构建LCS字符串
    let lcs = '';
    let i = m, j = n;

    console.log("\n回溯过程:");
    while (i > 0 && j > 0) {
        console.log(`当前位置: i=${i}, j=${j}, dp[${i}][${j}]=${dp[i][j]}`);

        if (text1[i - 1] === text2[j - 1]) {
            // 字符匹配，是LCS的一部分
            lcs = text1[i - 1] + lcs;
            console.log(`  字符匹配: '${text1[i-1]}', 添加到LCS: "${lcs}"`);
            i--;
            j--;
        } else if (dp[i - 1][j] > dp[i][j - 1]) {
            // 从上方来
            console.log(`  从上方来: dp[${i-1}][${j}]=${dp[i-1][j]} > dp[${i}][${j-1}]=${dp[i][j-1]}`);
            i--;
        } else {
            // 从左方来
            console.log(`  从左方来: dp[${i-1}][${j}]=${dp[i-1][j]} <= dp[${i}][${j-1}]=${dp[i][j-1]}`);
            j--;
        }
    }

    console.log(`\n最长公共子序列: "${lcs}"`);
    console.log(`长度: ${lcs.length}`);

    return lcs;
}

// ===========================================
// 辅助函数
// ===========================================

/**
 * 打印DP表
 */
function printDPTable(dp, text1, text2) {
    const m = dp.length - 1;
    const n = dp[0].length - 1;

    // 打印表头
    let header = "     ";
    for (let j = 0; j <= n; j++) {
        if (j === 0) {
            header += "  ε ";
        } else {
            header += ` ${text2[j-1]}  `;
        }
    }
    console.log(header);

    // 打印分隔线
    console.log("    " + "-".repeat(header.length - 4));

    // 打印每一行
    for (let i = 0; i <= m; i++) {
        let row = "";
        if (i === 0) {
            row += " ε |";
        } else {
            row += ` ${text1[i-1]} |`;
        }

        for (let j = 0; j <= n; j++) {
            row += ` ${dp[i][j]}  `;
        }
        console.log(row);
    }
}

/**
 * 验证LCS结果
 */
function validateLCS(text1, text2, lcs) {
    console.log("\n=== LCS验证 ===");
    console.log(`原字符串1: "${text1}"`);
    console.log(`原字符串2: "${text2}"`);
    console.log(`LCS: "${lcs}"`);

    // 检查LCS是否是text1的子序列
    let i = 0, j = 0;
    while (i < text1.length && j < lcs.length) {
        if (text1[i] === lcs[j]) {
            j++;
        }
        i++;
    }
    const isSubseq1 = j === lcs.length;
    console.log(`LCS是text1的子序列: ${isSubseq1 ? '✅' : '❌'}`);

    // 检查LCS是否是text2的子序列
    i = 0;
    j = 0;
    while (i < text2.length && j < lcs.length) {
        if (text2[i] === lcs[j]) {
            j++;
        }
        i++;
    }
    const isSubseq2 = j === lcs.length;
    console.log(`LCS是text2的子序列: ${isSubseq2 ? '✅' : '❌'}`);

    const isValid = isSubseq1 && isSubseq2;
    console.log(`验证结果: ${isValid ? '✅' : '❌'}`);

    return isValid;
}

/**
 * 性能测试
 */
function performanceTest() {
    console.log("\n=== 性能测试 ===");

    const testCases = [
        ["abcde", "ace"],
        ["abc", "abc"],
        ["abc", "def"],
        ["abcdefghijklmnop", "acegikmoq"],
        ["pneumonoultramicroscopicsilicovolcanioconiosis", "ultramicroscopically"]
    ];

    for (const [text1, text2] of testCases) {
        console.log(`\n测试: "${text1}" vs "${text2}"`);
        console.log(`长度: ${text1.length} x ${text2.length}`);

        const methods = [
            { name: '二维DP', func: longestCommonSubsequence },
            { name: '空间优化', func: longestCommonSubsequenceOptimized },
            { name: '记忆化搜索', func: longestCommonSubsequenceMemo }
        ];

        for (const method of methods) {
            const startTime = performance.now();
            const result = method.func(text1, text2);
            const endTime = performance.now();

            console.log(`${method.name}: LCS长度=${result}, 耗时=${(endTime - startTime).toFixed(2)}ms`);
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
    console.log("最长公共子序列算法测试");
    console.log("=".repeat(50));

    const testCases = [
        { text1: "abcde", text2: "ace", expected: 3 },
        { text1: "abc", text2: "abc", expected: 3 },
        { text1: "abc", text2: "def", expected: 0 },
        { text1: "bl", text2: "yby", expected: 1 },
        { text1: "", text2: "abc", expected: 0 },
        { text1: "ABCDGH", text2: "AEDFHR", expected: 3 }
    ];

    testCases.forEach((testCase, index) => {
        console.log(`\n${"=".repeat(30)}`);
        console.log(`测试用例 ${index + 1}`);
        console.log(`${"=".repeat(30)}`);

        const { text1, text2, expected } = testCase;

        // 测试所有方法
        const methods = [
            { name: "二维DP", func: longestCommonSubsequence },
            { name: "空间优化", func: longestCommonSubsequenceOptimized },
            { name: "记忆化搜索", func: longestCommonSubsequenceMemo }
        ];

        const results = [];

        for (const method of methods) {
            console.log(`\n--- ${method.name} ---`);
            try {
                const result = method.func(text1, text2);
                results.push(result);

                const isCorrect = result === expected;
                console.log(`结果: ${result}, 期望: ${expected}, 正确: ${isCorrect ? '✅' : '❌'}`);
            } catch (error) {
                console.log(`❌ 方法执行失败: ${error.message}`);
                results.push(-1);
            }
        }

        // 获取实际LCS字符串
        console.log("\n--- 获取LCS字符串 ---");
        try {
            const lcsString = getLongestCommonSubsequence(text1, text2);
            validateLCS(text1, text2, lcsString);
        } catch (error) {
            console.log(`❌ LCS字符串构建失败: ${error.message}`);
        }

        // 检查所有方法结果是否一致
        console.log("\n--- 方法一致性检查 ---");
        const allSame = results.every(result => result === results[0]);
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
    console.log("最长公共子序列算法演示");
    console.log("=".repeat(50));

    console.log("LCS问题的核心思想:");
    console.log("1. 子序列：保持相对顺序的字符组合");
    console.log("2. 动态规划：将问题分解为子问题");
    console.log("3. 状态转移：基于字符是否匹配做决策");
    console.log("4. 最优子结构：局部最优解构成全局最优解");

    const demoText1 = "ABCDGH";
    const demoText2 = "AEDFHR";

    console.log(`\n演示字符串:`);
    console.log(`text1: "${demoText1}"`);
    console.log(`text2: "${demoText2}"`);

    console.log("\n状态转移方程:");
    console.log("如果 text1[i-1] === text2[j-1]:");
    console.log("    dp[i][j] = dp[i-1][j-1] + 1");
    console.log("否则:");
    console.log("    dp[i][j] = max(dp[i-1][j], dp[i][j-1])");

    console.log("\n详细演示 - 二维DP:");
    const result = longestCommonSubsequence(demoText1, demoText2);

    console.log("\n获取实际LCS:");
    const lcsString = getLongestCommonSubsequence(demoText1, demoText2);

    console.log("\n复杂度分析:");
    console.log("时间复杂度: O(m*n) - 需要填充整个DP表");
    console.log("空间复杂度: O(m*n) - 二维DP表，可优化为O(min(m,n))");
    console.log("应用场景: 代码diff、DNA序列比对、文本相似度等");
}

// ===========================================
// 面试要点
// ===========================================

/**
 * 面试关键点总结
 */
function interviewKeyPoints() {
    console.log("\n" + "=".repeat(50));
    console.log("面试关键点");
    console.log("=".repeat(50));

    console.log("\n🎯 核心概念:");
    console.log("1. 子序列：保持相对顺序，可以不连续");
    console.log("2. 最优子结构：LCS(i,j)可由LCS(i-1,j-1)等推导");
    console.log("3. 状态转移：基于字符匹配与否的两种情况");
    console.log("4. 边界处理：空字符串的LCS长度为0");

    console.log("\n🔧 实现技巧:");
    console.log("1. DP表多开一行一列处理边界");
    console.log("2. 可以用滚动数组优化空间复杂度");
    console.log("3. 记忆化搜索避免重复计算");
    console.log("4. 回溯DP表可以构建实际LCS");

    console.log("\n❗ 常见陷阱:");
    console.log("1. 混淆子序列和子串的概念");
    console.log("2. 状态转移方程写错");
    console.log("3. 边界条件处理不当");
    console.log("4. 空间优化时状态更新顺序错误");

    console.log("\n🎨 变体问题:");
    console.log("1. 最长公共子串（连续）");
    console.log("2. 编辑距离（插入、删除、替换）");
    console.log("3. 最长递增子序列");
    console.log("4. 多个字符串的最长公共子序列");

    console.log("\n📊 复杂度分析:");
    console.log("1. 时间复杂度：O(m*n)");
    console.log("2. 空间复杂度：O(m*n)，可优化为O(min(m,n))");
    console.log("3. 记忆化搜索的空间可能更高");
    console.log("4. 构建实际LCS需要额外O(m+n)时间");

    console.log("\n💡 面试技巧:");
    console.log("1. 先画DP表理解状态转移");
    console.log("2. 从递归开始思考，再优化为DP");
    console.log("3. 讨论空间优化的可能性");
    console.log("4. 考虑是否需要构建实际LCS");
    console.log("5. 分析时间空间复杂度权衡");

    console.log("\n🔍 实际应用:");
    console.log("1. 版本控制系统（git diff）");
    console.log("2. 生物信息学（DNA序列比对）");
    console.log("3. 文本相似度计算");
    console.log("4. 数据同步和合并");
    console.log("5. 抄袭检测系统");
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        longestCommonSubsequence,
        longestCommonSubsequenceOptimized,
        longestCommonSubsequenceMemo,
        getLongestCommonSubsequence,
        validateLCS,
        performanceTest,
        runTests,
        demonstrateAlgorithm,
        interviewKeyPoints
    };
}

// 如果在浏览器环境中，运行演示
if (typeof window !== 'undefined') {
    runTests();
    demonstrateAlgorithm();
    interviewKeyPoints();
}