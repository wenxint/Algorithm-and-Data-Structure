/**
 * LeetCode 72. 编辑距离
 *
 * 问题描述：
 * 给你两个单词 word1 和 word2，请你计算出将 word1 转换成 word2 所使用的最少操作数。
 * 你可以对一个单词进行如下三种操作：
 * 1. 插入一个字符
 * 2. 删除一个字符
 * 3. 替换一个字符
 *
 * 核心思想：
 * 动态规划经典问题（也称为Levenshtein距离）
 * dp[i][j] 表示将 word1 的前 i 个字符转换为 word2 的前 j 个字符所需的最少操作数
 *
 * 示例：
 * 输入：word1 = "horse", word2 = "ros"
 * 输出：3
 * 解释：horse -> rorse (将 'h' 替换为 'r') -> rose (删除 'r') -> ros (删除 'e')
 */

/**
 * 方法一：二维动态规划（标准解法）
 *
 * 核心思想：
 * dp[i][j] 表示 word1[0..i-1] 转换为 word2[0..j-1] 的最少操作数
 * 状态转移方程：
 * - 如果 word1[i-1] === word2[j-1]，则 dp[i][j] = dp[i-1][j-1]
 * - 否则 dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
 *   其中：dp[i-1][j] + 1 表示删除操作
 *        dp[i][j-1] + 1 表示插入操作
 *        dp[i-1][j-1] + 1 表示替换操作
 *
 * @param {string} word1 - 源字符串
 * @param {string} word2 - 目标字符串
 * @returns {number} 最少编辑距离
 * @time O(m*n) m和n分别是两个字符串的长度
 * @space O(m*n) 二维DP表的空间
 */
function minDistance(word1, word2) {
    console.log("=== 编辑距离（二维DP） ===");
    console.log(`源字符串: "${word1}"`);
    console.log(`目标字符串: "${word2}"`);

    const m = word1.length;
    const n = word2.length;

    // 创建DP表，多一行一列处理边界情况
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

    // 初始化边界条件
    // dp[i][0] = i 表示将word1的前i个字符转换为空字符串需要i次删除操作
    for (let i = 0; i <= m; i++) {
        dp[i][0] = i;
    }
    // dp[0][j] = j 表示将空字符串转换为word2的前j个字符需要j次插入操作
    for (let j = 0; j <= n; j++) {
        dp[0][j] = j;
    }

    console.log("\n初始化DP表:");
    printEditDistanceTable(dp, word1, word2);

    // 填充DP表
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            console.log(`\n处理 word1[${i-1}]='${word1[i-1]}' 和 word2[${j-1}]='${word2[j-1]}'`);

            if (word1[i - 1] === word2[j - 1]) {
                // 字符相同，不需要操作
                dp[i][j] = dp[i - 1][j - 1];
                console.log(`  字符相同，无需操作: dp[${i}][${j}] = dp[${i-1}][${j-1}] = ${dp[i][j]}`);
            } else {
                // 字符不同，取三种操作的最小值
                const deleteOp = dp[i - 1][j] + 1;      // 删除word1[i-1]
                const insertOp = dp[i][j - 1] + 1;      // 插入word2[j-1]
                const replaceOp = dp[i - 1][j - 1] + 1; // 替换word1[i-1]为word2[j-1]

                dp[i][j] = Math.min(deleteOp, insertOp, replaceOp);

                console.log(`  字符不同，选择最小操作:`);
                console.log(`    删除操作: dp[${i-1}][${j}] + 1 = ${deleteOp}`);
                console.log(`    插入操作: dp[${i}][${j-1}] + 1 = ${insertOp}`);
                console.log(`    替换操作: dp[${i-1}][${j-1}] + 1 = ${replaceOp}`);
                console.log(`    选择最小值: dp[${i}][${j}] = ${dp[i][j]}`);
            }

            // 打印当前DP表状态（只在小规模时显示）
            if (m <= 5 && n <= 5) {
                console.log("当前DP表:");
                printEditDistanceTable(dp, word1, word2);
            }
        }
    }

    console.log("\n最终DP表:");
    printEditDistanceTable(dp, word1, word2);

    console.log(`\n最少编辑距离: ${dp[m][n]}`);
    return dp[m][n];
}

/**
 * 方法二：空间优化的一维DP
 *
 * 核心思想：
 * 观察状态转移方程，dp[i][j] 只依赖于当前行和上一行的值
 * 可以用两个一维数组交替使用来优化空间复杂度
 *
 * @param {string} word1 - 源字符串
 * @param {string} word2 - 目标字符串
 * @returns {number} 最少编辑距离
 * @time O(m*n) 时间复杂度不变
 * @space O(min(m,n)) 优化为一维数组
 */
function minDistanceOptimized(word1, word2) {
    console.log("\n=== 编辑距离（空间优化） ===");
    console.log(`源字符串: "${word1}"`);
    console.log(`目标字符串: "${word2}"`);

    const m = word1.length;
    const n = word2.length;

    // 确保word2是较短的字符串以优化空间
    if (m < n) {
        console.log("交换字符串以优化空间使用");
        return minDistanceOptimized(word2, word1);
    }

    // 只需要两个一维数组
    let prev = Array(n + 1).fill(0);
    let curr = Array(n + 1).fill(0);

    // 初始化prev数组
    for (let j = 0; j <= n; j++) {
        prev[j] = j;
    }

    console.log(`初始化数组: [${prev.join(', ')}]`);

    for (let i = 1; i <= m; i++) {
        curr[0] = i; // 边界条件
        console.log(`\n处理 word1 的第 ${i} 个字符: '${word1[i-1]}'`);

        for (let j = 1; j <= n; j++) {
            if (word1[i - 1] === word2[j - 1]) {
                curr[j] = prev[j - 1];
                console.log(`  匹配 '${word2[j-1]}': curr[${j}] = prev[${j-1}] = ${curr[j]}`);
            } else {
                curr[j] = 1 + Math.min(prev[j], curr[j - 1], prev[j - 1]);
                console.log(`  不匹配 '${word2[j-1]}': curr[${j}] = 1 + min(${prev[j]}, ${curr[j-1]}, ${prev[j-1]}) = ${curr[j]}`);
            }
        }

        console.log(`第 ${i} 行结果: [${curr.join(', ')}]`);

        // 交换数组
        [prev, curr] = [curr, prev];
        curr.fill(0);
    }

    const result = prev[n];
    console.log(`\n最少编辑距离: ${result}`);
    return result;
}

/**
 * 方法三：递归 + 记忆化搜索
 *
 * 核心思想：
 * 从两个字符串的末尾开始递归比较
 * 使用记忆化避免重复计算
 *
 * @param {string} word1 - 源字符串
 * @param {string} word2 - 目标字符串
 * @returns {number} 最少编辑距离
 * @time O(m*n) 记忆化后每个状态只计算一次
 * @space O(m*n) 递归栈 + 记忆化表
 */
function minDistanceMemo(word1, word2) {
    console.log("\n=== 编辑距离（记忆化搜索） ===");
    console.log(`源字符串: "${word1}"`);
    console.log(`目标字符串: "${word2}"`);

    const memo = new Map();

    /**
     * 递归函数
     * @param {number} i - word1的索引
     * @param {number} j - word2的索引
     * @returns {number} 从i,j开始的最少编辑距离
     */
    function dfs(i, j) {
        // 边界条件
        if (i === 0) {
            console.log(`  边界条件: i=0, j=${j}, 需要插入 ${j} 个字符`);
            return j;
        }
        if (j === 0) {
            console.log(`  边界条件: i=${i}, j=0, 需要删除 ${i} 个字符`);
            return i;
        }

        // 检查记忆化
        const key = `${i},${j}`;
        if (memo.has(key)) {
            console.log(`  记忆化命中: (${i},${j}) = ${memo.get(key)}`);
            return memo.get(key);
        }

        console.log(`  递归计算: i=${i}(${word1[i-1]}), j=${j}(${word2[j-1]})`);

        let result;
        if (word1[i - 1] === word2[j - 1]) {
            // 字符相同，无需操作
            result = dfs(i - 1, j - 1);
            console.log(`    字符相同，结果 = dfs(${i-1},${j-1}) = ${result}`);
        } else {
            // 字符不同，尝试三种操作
            const deleteOp = dfs(i - 1, j) + 1;     // 删除
            const insertOp = dfs(i, j - 1) + 1;     // 插入
            const replaceOp = dfs(i - 1, j - 1) + 1; // 替换

            result = Math.min(deleteOp, insertOp, replaceOp);
            console.log(`    字符不同，删除=${deleteOp}, 插入=${insertOp}, 替换=${replaceOp}, 最小=${result}`);
        }

        // 记忆化
        memo.set(key, result);
        console.log(`  记忆化存储: (${i},${j}) = ${result}`);

        return result;
    }

    const result = dfs(word1.length, word2.length);
    console.log(`\n记忆化表大小: ${memo.size}`);
    console.log(`最少编辑距离: ${result}`);

    return result;
}

/**
 * 方法四：获取编辑操作序列
 *
 * 核心思想：
 * 在DP的基础上，通过回溯DP表来构建实际的编辑操作序列
 *
 * @param {string} word1 - 源字符串
 * @param {string} word2 - 目标字符串
 * @returns {Object} 包含编辑距离和操作序列的对象
 */
function getEditOperations(word1, word2) {
    console.log("\n=== 获取编辑操作序列 ===");
    console.log(`源字符串: "${word1}"`);
    console.log(`目标字符串: "${word2}"`);

    const m = word1.length;
    const n = word2.length;

    // 构建DP表
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

    // 初始化
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    // 填充DP表
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (word1[i - 1] === word2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + Math.min(
                    dp[i - 1][j],     // 删除
                    dp[i][j - 1],     // 插入
                    dp[i - 1][j - 1]  // 替换
                );
            }
        }
    }

    // 回溯构建操作序列
    const operations = [];
    let i = m, j = n;

    console.log("\n回溯过程:");
    while (i > 0 || j > 0) {
        console.log(`当前位置: i=${i}, j=${j}, dp[${i}][${j}]=${dp[i][j]}`);

        if (i === 0) {
            // 只能插入
            operations.unshift(`插入 '${word2[j-1]}' 在位置 ${i}`);
            console.log(`  边界情况：插入 '${word2[j-1]}'`);
            j--;
        } else if (j === 0) {
            // 只能删除
            operations.unshift(`删除位置 ${i-1} 的 '${word1[i-1]}'`);
            console.log(`  边界情况：删除 '${word1[i-1]}'`);
            i--;
        } else if (word1[i - 1] === word2[j - 1]) {
            // 字符相同，无需操作
            console.log(`  字符匹配: '${word1[i-1]}'，无需操作`);
            i--;
            j--;
        } else {
            // 字符不同，找到来源操作
            const deleteVal = dp[i - 1][j];
            const insertVal = dp[i][j - 1];
            const replaceVal = dp[i - 1][j - 1];
            const minVal = Math.min(deleteVal, insertVal, replaceVal);

            if (minVal === replaceVal) {
                operations.unshift(`替换位置 ${i-1} 的 '${word1[i-1]}' 为 '${word2[j-1]}'`);
                console.log(`  替换操作: '${word1[i-1]}' -> '${word2[j-1]}'`);
                i--;
                j--;
            } else if (minVal === deleteVal) {
                operations.unshift(`删除位置 ${i-1} 的 '${word1[i-1]}'`);
                console.log(`  删除操作: '${word1[i-1]}'`);
                i--;
            } else {
                operations.unshift(`插入 '${word2[j-1]}' 在位置 ${i}`);
                console.log(`  插入操作: '${word2[j-1]}'`);
                j--;
            }
        }
    }

    console.log(`\n编辑操作序列 (共${operations.length}步):`);
    operations.forEach((op, index) => {
        console.log(`  ${index + 1}. ${op}`);
    });

    return {
        distance: dp[m][n],
        operations: operations
    };
}

// ===========================================
// 辅助函数
// ===========================================

/**
 * 打印编辑距离DP表
 */
function printEditDistanceTable(dp, word1, word2) {
    const m = dp.length - 1;
    const n = dp[0].length - 1;

    // 打印表头
    let header = "     ";
    for (let j = 0; j <= n; j++) {
        if (j === 0) {
            header += "  ε ";
        } else {
            header += ` ${word2[j-1]}  `;
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
            row += ` ${word1[i-1]} |`;
        }

        for (let j = 0; j <= n; j++) {
            row += ` ${dp[i][j]}  `;
        }
        console.log(row);
    }
}

/**
 * 验证编辑距离结果
 */
function validateEditDistance(word1, word2, distance, operations) {
    console.log("\n=== 编辑距离验证 ===");
    console.log(`原字符串: "${word1}"`);
    console.log(`目标字符串: "${word2}"`);
    console.log(`编辑距离: ${distance}`);

    // 模拟执行操作序列
    let current = word1;
    console.log(`\n模拟执行操作序列:`);
    console.log(`初始: "${current}"`);

    for (let i = 0; i < operations.length; i++) {
        const operation = operations[i];
        console.log(`\n操作 ${i + 1}: ${operation}`);

        // 解析操作（这里简化实现，实际应该更严格）
        if (operation.includes('插入')) {
            // 简化处理：实际应该解析具体位置
            const char = operation.match(/'([^']+)'/)[1];
            current += char;
        } else if (operation.includes('删除')) {
            // 简化处理：删除第一个匹配字符
            const char = operation.match(/'([^']+)'/)[1];
            current = current.replace(char, '');
        } else if (operation.includes('替换')) {
            // 简化处理：替换第一个匹配字符
            const matches = operation.match(/'([^']+)'/g);
            if (matches && matches.length >= 2) {
                const from = matches[0].slice(1, -1);
                const to = matches[1].slice(1, -1);
                current = current.replace(from, to);
            }
        }

        console.log(`结果: "${current}"`);
    }

    const isValid = current === word2;
    console.log(`\n验证结果: ${isValid ? '✅' : '❌'}`);
    console.log(`操作数匹配: ${operations.length === distance ? '✅' : '❌'}`);

    return isValid && operations.length === distance;
}

/**
 * 性能测试
 */
function performanceTest() {
    console.log("\n=== 性能测试 ===");

    const testCases = [
        ["horse", "ros"],
        ["intention", "execution"],
        ["", "abc"],
        ["abc", ""],
        ["same", "same"],
        ["saturday", "sunday"]
    ];

    for (const [word1, word2] of testCases) {
        console.log(`\n测试: "${word1}" -> "${word2}"`);
        console.log(`长度: ${word1.length} x ${word2.length}`);

        const methods = [
            { name: '二维DP', func: minDistance },
            { name: '空间优化', func: minDistanceOptimized },
            { name: '记忆化搜索', func: minDistanceMemo }
        ];

        for (const method of methods) {
            const startTime = performance.now();
            const result = method.func(word1, word2);
            const endTime = performance.now();

            console.log(`${method.name}: 编辑距离=${result}, 耗时=${(endTime - startTime).toFixed(2)}ms`);
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
    console.log("编辑距离算法测试");
    console.log("=".repeat(50));

    const testCases = [
        { word1: "horse", word2: "ros", expected: 3 },
        { word1: "intention", word2: "execution", expected: 5 },
        { word1: "", word2: "a", expected: 1 },
        { word1: "a", word2: "", expected: 1 },
        { word1: "abc", word2: "abc", expected: 0 },
        { word1: "kitten", word2: "sitting", expected: 3 }
    ];

    testCases.forEach((testCase, index) => {
        console.log(`\n${"=".repeat(30)}`);
        console.log(`测试用例 ${index + 1}`);
        console.log(`${"=".repeat(30)}`);

        const { word1, word2, expected } = testCase;

        // 测试所有方法
        const methods = [
            { name: "二维DP", func: minDistance },
            { name: "空间优化", func: minDistanceOptimized },
            { name: "记忆化搜索", func: minDistanceMemo }
        ];

        const results = [];

        for (const method of methods) {
            console.log(`\n--- ${method.name} ---`);
            try {
                const result = method.func(word1, word2);
                results.push(result);

                const isCorrect = result === expected;
                console.log(`结果: ${result}, 期望: ${expected}, 正确: ${isCorrect ? '✅' : '❌'}`);
            } catch (error) {
                console.log(`❌ 方法执行失败: ${error.message}`);
                results.push(-1);
            }
        }

        // 获取编辑操作序列
        console.log("\n--- 获取编辑操作序列 ---");
        try {
            const editResult = getEditOperations(word1, word2);
            validateEditDistance(word1, word2, editResult.distance, editResult.operations);
        } catch (error) {
            console.log(`❌ 编辑操作序列构建失败: ${error.message}`);
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
    console.log("编辑距离算法演示");
    console.log("=".repeat(50));

    console.log("编辑距离问题的核心思想:");
    console.log("1. 三种操作：插入、删除、替换");
    console.log("2. 动态规划：将问题分解为子问题");
    console.log("3. 状态转移：基于字符是否匹配选择操作");
    console.log("4. 最优子结构：局部最优解构成全局最优解");

    const demoWord1 = "kitten";
    const demoWord2 = "sitting";

    console.log(`\n演示字符串:`);
    console.log(`word1: "${demoWord1}"`);
    console.log(`word2: "${demoWord2}"`);

    console.log("\n状态转移方程:");
    console.log("如果 word1[i-1] === word2[j-1]:");
    console.log("    dp[i][j] = dp[i-1][j-1]");
    console.log("否则:");
    console.log("    dp[i][j] = 1 + min(");
    console.log("        dp[i-1][j],    # 删除");
    console.log("        dp[i][j-1],    # 插入");
    console.log("        dp[i-1][j-1]   # 替换");
    console.log("    )");

    console.log("\n详细演示 - 二维DP:");
    const result = minDistance(demoWord1, demoWord2);

    console.log("\n获取编辑操作序列:");
    const editResult = getEditOperations(demoWord1, demoWord2);

    console.log("\n复杂度分析:");
    console.log("时间复杂度: O(m*n) - 需要填充整个DP表");
    console.log("空间复杂度: O(m*n) - 二维DP表，可优化为O(min(m,n))");
    console.log("应用场景: 拼写检查、DNA序列比对、版本控制等");
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
    console.log("1. Levenshtein距离：字符串间的编辑距离");
    console.log("2. 三种基本操作：插入、删除、替换");
    console.log("3. 最优子结构：子问题的最优解构成原问题最优解");
    console.log("4. 状态转移：基于字符匹配与否的决策");

    console.log("\n🔧 实现技巧:");
    console.log("1. DP表多开一行一列处理边界");
    console.log("2. 边界初始化：空字符串转换需要全部插入/删除");
    console.log("3. 可以用滚动数组优化空间复杂度");
    console.log("4. 回溯DP表可以构建实际操作序列");

    console.log("\n❗ 常见陷阱:");
    console.log("1. 边界条件初始化错误");
    console.log("2. 状态转移方程中的操作对应关系混乱");
    console.log("3. 空间优化时状态更新顺序错误");
    console.log("4. 忘记处理字符相同的情况");

    console.log("\n🎨 变体问题:");
    console.log("1. 只允许插入和删除操作");
    console.log("2. 操作有不同权重（加权编辑距离）");
    console.log("3. 最长公共子序列（LCS）");
    console.log("4. 字符串匹配问题");

    console.log("\n📊 复杂度分析:");
    console.log("1. 时间复杂度：O(m*n)");
    console.log("2. 空间复杂度：O(m*n)，可优化为O(min(m,n))");
    console.log("3. 构建操作序列需要额外O(m+n)时间");
    console.log("4. 记忆化搜索的实际效率可能更好");

    console.log("\n💡 面试技巧:");
    console.log("1. 先理解三种操作的含义");
    console.log("2. 画出小规模DP表理解状态转移");
    console.log("3. 从递归思路出发，再优化为DP");
    console.log("4. 讨论空间优化的可能性");
    console.log("5. 考虑是否需要构建操作序列");

    console.log("\n🔍 实际应用:");
    console.log("1. 拼写检查和纠错");
    console.log("2. DNA序列比对");
    console.log("3. 版本控制中的差异计算");
    console.log("4. 近似字符串匹配");
    console.log("5. 数据清洗和去重");
    console.log("6. 机器翻译质量评估");
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        minDistance,
        minDistanceOptimized,
        minDistanceMemo,
        getEditOperations,
        validateEditDistance,
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