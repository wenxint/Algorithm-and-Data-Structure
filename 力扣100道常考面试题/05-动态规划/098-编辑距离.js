/**
 * LeetCode 098: 编辑距离 (Edit Distance)
 *
 * 题目描述：
 * 给你两个单词 word1 和 word2， 请返回将 word1 转换成 word2 所使用的最少操作数。
 * 你可以对一个单词进行如下三种操作：
 * - 插入一个字符
 * - 删除一个字符
 * - 替换一个字符
 *
 * 示例：
 * 输入：word1 = "horse", word2 = "ros"
 * 输出：3
 * 解释：
 * horse -> rorse (将 'h' 替换为 'r')
 * rorse -> rose (删除 'r')
 * rose -> ros (删除 'e')
 *
 * 核心思想：
 * 动态规划 - 经典的字符串编辑距离问题，使用二维DP表记录子问题最优解
 *
 * 算法原理：
 * 1. 状态定义：dp[i][j] 表示将 word1[0...i-1] 转换为 word2[0...j-1] 的最小操作数
 * 2. 初始状态：
 *    - dp[i][0] = i （删除 word1 的前 i 个字符）
 *    - dp[0][j] = j （插入 word2 的前 j 个字符）
 * 3. 状态转移：
 *    - 如果 word1[i-1] == word2[j-1]：dp[i][j] = dp[i-1][j-1]
 *    - 否则：dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
 *      其中：dp[i-1][j] + 1 表示删除操作
 *           dp[i][j-1] + 1 表示插入操作
 *           dp[i-1][j-1] + 1 表示替换操作
 * 4. 最终结果：dp[m][n] 即为最小编辑距离
 *
 * 时间复杂度：O(m × n)
 * 空间复杂度：O(m × n)，可优化为 O(min(m, n))
 */

/**
 * 解法一：二维动态规划（推荐）
 *
 * 核心思想：
 * 使用二维DP表记录所有子问题的最优解，自底向上构建最终答案
 *
 * 算法步骤：
 * 1. 初始化DP表，设置边界条件
 * 2. 逐个字符比较，根据是否相等选择不同的状态转移
 * 3. 三种操作中选择代价最小的方案
 *
 * @param {string} word1 - 源字符串
 * @param {string} word2 - 目标字符串
 * @returns {number} 最小编辑距离
 * @time O(m × n) - m、n分别为两个字符串的长度
 * @space O(m × n) - DP表空间
 */
function minDistance(word1, word2) {
    const m = word1.length;
    const n = word2.length;

    // dp[i][j] 表示 word1[0...i-1] 转换为 word2[0...j-1] 的最小操作数
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));

    // 初始化边界条件
    // word1 转换为空字符串，需要删除所有字符
    for (let i = 0; i <= m; i++) {
        dp[i][0] = i;
    }

    // 空字符串转换为 word2，需要插入所有字符
    for (let j = 0; j <= n; j++) {
        dp[0][j] = j;
    }

    // 动态规划填表
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (word1[i - 1] === word2[j - 1]) {
                // 字符相同，不需要操作
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                // 字符不同，选择三种操作中代价最小的
                dp[i][j] = 1 + Math.min(
                    dp[i - 1][j],     // 删除操作：删除 word1[i-1]
                    dp[i][j - 1],     // 插入操作：插入 word2[j-1]
                    dp[i - 1][j - 1]  // 替换操作：替换 word1[i-1] 为 word2[j-1]
                );
            }
        }
    }

    return dp[m][n];
}

/**
 * 解法二：一维动态规划（空间优化）
 *
 * 核心思想：
 * 观察到状态转移只依赖于当前行和上一行，使用滚动数组优化空间
 *
 * 算法步骤：
 * 1. 使用一维数组表示当前行状态
 * 2. 从左到右更新，保存必要的上一行信息
 * 3. 逐行计算，最终得到结果
 *
 * @param {string} word1 - 源字符串
 * @param {string} word2 - 目标字符串
 * @returns {number} 最小编辑距离
 * @time O(m × n) - 时间复杂度不变
 * @space O(min(m, n)) - 只使用一维数组
 */
function minDistanceOptimized(word1, word2) {
    const m = word1.length;
    const n = word2.length;

    // 确保 word2 是较短的字符串，减少空间使用
    if (m < n) {
        return minDistanceOptimized(word2, word1);
    }

    // 使用一维数组，长度为较短字符串长度 + 1
    let dp = Array(n + 1).fill(0);

    // 初始化：空字符串转换为 word2 的前 j 个字符
    for (let j = 0; j <= n; j++) {
        dp[j] = j;
    }

    // 逐行计算
    for (let i = 1; i <= m; i++) {
        let prev = dp[0]; // 保存 dp[i-1][j-1] 的值
        dp[0] = i; // 设置 dp[i][0] = i

        for (let j = 1; j <= n; j++) {
            const temp = dp[j]; // 保存当前 dp[i-1][j] 的值

            if (word1[i - 1] === word2[j - 1]) {
                dp[j] = prev; // 不需要操作
            } else {
                dp[j] = 1 + Math.min(
                    dp[j],        // 删除操作（原 dp[i-1][j]）
                    dp[j - 1],    // 插入操作（dp[i][j-1]）
                    prev          // 替换操作（原 dp[i-1][j-1]）
                );
            }

            prev = temp; // 更新 prev 为下一轮的 dp[i-1][j-1]
        }
    }

    return dp[n];
}

/**
 * 解法三：递归 + 记忆化搜索
 *
 * 核心思想：
 * 使用递归自然地表达子问题关系，通过记忆化避免重复计算
 *
 * 算法步骤：
 * 1. 递归处理字符串的每个位置
 * 2. 根据字符是否相等选择不同的递归分支
 * 3. 使用记忆化存储已计算的结果
 *
 * @param {string} word1 - 源字符串
 * @param {string} word2 - 目标字符串
 * @returns {number} 最小编辑距离
 * @time O(m × n) - 记忆化后每个状态只计算一次
 * @space O(m × n) - 递归栈 + 记忆化缓存
 */
function minDistanceMemo(word1, word2) {
    const memo = new Map();

    function dfs(i, j) {
        // 记忆化查找
        const key = `${i},${j}`;
        if (memo.has(key)) {
            return memo.get(key);
        }

        let result;

        // 边界条件
        if (i === 0) {
            result = j; // 插入 j 个字符
        } else if (j === 0) {
            result = i; // 删除 i 个字符
        } else if (word1[i - 1] === word2[j - 1]) {
            // 字符相同，递归处理下一个位置
            result = dfs(i - 1, j - 1);
        } else {
            // 字符不同，选择三种操作中代价最小的
            result = 1 + Math.min(
                dfs(i - 1, j),     // 删除操作
                dfs(i, j - 1),     // 插入操作
                dfs(i - 1, j - 1)  // 替换操作
            );
        }

        memo.set(key, result);
        return result;
    }

    return dfs(word1.length, word2.length);
}

/**
 * 解法四：路径回溯（显示具体操作）
 *
 * 核心思想：
 * 在动态规划的基础上，记录具体的操作路径，可以显示详细的编辑步骤
 *
 * @param {string} word1 - 源字符串
 * @param {string} word2 - 目标字符串
 * @returns {Object} 包含最小距离和操作序列
 * @time O(m × n) - DP计算 + 路径回溯
 * @space O(m × n) - DP表 + 操作序列
 */
function minDistanceWithPath(word1, word2) {
    const m = word1.length;
    const n = word2.length;

    // DP表和操作记录表
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
    const operations = Array(m + 1).fill().map(() => Array(n + 1).fill(''));

    // 初始化
    for (let i = 0; i <= m; i++) {
        dp[i][0] = i;
        if (i > 0) operations[i][0] = 'DELETE';
    }

    for (let j = 0; j <= n; j++) {
        dp[0][j] = j;
        if (j > 0) operations[0][j] = 'INSERT';
    }

    // 动态规划填表
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (word1[i - 1] === word2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
                operations[i][j] = 'MATCH';
            } else {
                const deleteOp = dp[i - 1][j] + 1;
                const insertOp = dp[i][j - 1] + 1;
                const replaceOp = dp[i - 1][j - 1] + 1;

                if (deleteOp <= insertOp && deleteOp <= replaceOp) {
                    dp[i][j] = deleteOp;
                    operations[i][j] = 'DELETE';
                } else if (insertOp <= replaceOp) {
                    dp[i][j] = insertOp;
                    operations[i][j] = 'INSERT';
                } else {
                    dp[i][j] = replaceOp;
                    operations[i][j] = 'REPLACE';
                }
            }
        }
    }

    // 回溯路径
    const path = [];
    let i = m, j = n;

    while (i > 0 || j > 0) {
        const op = operations[i][j];

        switch (op) {
            case 'MATCH':
                path.unshift(`保持 '${word1[i - 1]}'`);
                i--; j--;
                break;
            case 'DELETE':
                path.unshift(`删除 '${word1[i - 1]}'`);
                i--;
                break;
            case 'INSERT':
                path.unshift(`插入 '${word2[j - 1]}'`);
                j--;
                break;
            case 'REPLACE':
                path.unshift(`替换 '${word1[i - 1]}' 为 '${word2[j - 1]}'`);
                i--; j--;
                break;
        }
    }

    return {
        distance: dp[m][n],
        operations: path
    };
}

/**
 * 扩展应用：最长公共子序列转编辑距离
 *
 * 核心思想：
 * 编辑距离和最长公共子序列有密切关系
 * editDistance(s1, s2) = |s1| + |s2| - 2 * LCS(s1, s2)
 *
 * @param {string} word1 - 源字符串
 * @param {string} word2 - 目标字符串
 * @returns {number} 最小编辑距离
 */
function minDistanceFromLCS(word1, word2) {
    function longestCommonSubsequence(text1, text2) {
        const m = text1.length;
        const n = text2.length;
        const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));

        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (text1[i - 1] === text2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }

        return dp[m][n];
    }

    const lcs = longestCommonSubsequence(word1, word2);
    return word1.length + word2.length - 2 * lcs;
}

/**
 * 性能测试和验证
 */
function runPerformanceTest() {
    console.log("=== 编辑距离算法性能测试 ===");

    const testCases = [
        { word1: "a", word2: "ab", expected: 1 },
        { word1: "horse", word2: "ros", expected: 3 },
        { word1: "intention", word2: "execution", expected: 5 },
        { word1: "", word2: "abc", expected: 3 },
        { word1: "abc", word2: "", expected: 3 },
        { word1: "abc", word2: "abc", expected: 0 },
        { word1: "sunday", word2: "saturday", expected: 3 }
    ];

    console.log("\n基础功能测试：");
    testCases.forEach((test, index) => {
        const result1 = minDistance(test.word1, test.word2);
        const result2 = minDistanceOptimized(test.word1, test.word2);
        const result3 = minDistanceMemo(test.word1, test.word2);
        const result4 = minDistanceFromLCS(test.word1, test.word2);

        console.log(`测试 ${index + 1}: "${test.word1}" -> "${test.word2}"`);
        console.log(`  二维DP: ${result1}, 一维DP: ${result2}, 记忆化: ${result3}, LCS方法: ${result4}`);
        console.log(`  期望: ${test.expected}, 通过: ${result1 === test.expected ? '✓' : '✗'}`);
    });

    // 性能对比测试
    console.log("\n性能对比测试（较长字符串）：");
    const longStr1 = "abcdefghijklmnopqrstuvwxyz".repeat(2);
    const longStr2 = "zyxwvutsrqponmlkjihgfedcba".repeat(2);

    console.time("二维DP");
    const result1 = minDistance(longStr1, longStr2);
    console.timeEnd("二维DP");

    console.time("一维DP");
    const result2 = minDistanceOptimized(longStr1, longStr2);
    console.timeEnd("一维DP");

    console.time("记忆化递归");
    const result3 = minDistanceMemo(longStr1, longStr2);
    console.timeEnd("记忆化递归");

    console.log(`结果一致性: ${result1 === result2 && result2 === result3 ? '✓' : '✗'}`);
}

// 测试用例
console.log("=== LeetCode 098: 编辑距离 测试 ===");

const testCases = [
    { word1: "horse", word2: "ros" },
    { word1: "intention", word2: "execution" },
    { word1: "", word2: "a" },
    { word1: "a", word2: "" },
    { word1: "abc", word2: "yabd" },
    { word1: "plasma", word2: "altruism" }
];

console.log("\n解法一：二维动态规划");
testCases.forEach((test, index) => {
    const result = minDistance(test.word1, test.word2);
    console.log(`测试 ${index + 1}: "${test.word1}" -> "${test.word2}" = ${result}`);
});

console.log("\n解法二：一维DP优化");
testCases.forEach((test, index) => {
    const result = minDistanceOptimized(test.word1, test.word2);
    console.log(`测试 ${index + 1}: "${test.word1}" -> "${test.word2}" = ${result}`);
});

console.log("\n解法三：递归记忆化");
testCases.forEach((test, index) => {
    const result = minDistanceMemo(test.word1, test.word2);
    console.log(`测试 ${index + 1}: "${test.word1}" -> "${test.word2}" = ${result}`);
});

console.log("\n解法四：路径回溯");
const pathResult = minDistanceWithPath("horse", "ros");
console.log("详细操作步骤：");
console.log(`最小编辑距离: ${pathResult.distance}`);
console.log("操作序列:");
pathResult.operations.forEach((op, index) => {
    console.log(`  ${index + 1}. ${op}`);
});

// 运行性能测试
runPerformanceTest();

/**
 * 算法总结：
 *
 * 1. 二维动态规划（推荐）：
 *    - 时间复杂度：O(m × n)
 *    - 空间复杂度：O(m × n)
 *    - 优点：思路清晰，易于理解，可以回溯路径
 *    - 适用：需要知道具体操作步骤的场景
 *
 * 2. 一维DP优化：
 *    - 时间复杂度：O(m × n)
 *    - 空间复杂度：O(min(m, n))
 *    - 优点：空间效率高
 *    - 适用：只需要最小距离值的场景
 *
 * 3. 递归记忆化：
 *    - 时间复杂度：O(m × n)
 *    - 空间复杂度：O(m × n)
 *    - 优点：递归思路自然
 *    - 缺点：有递归栈开销
 *
 * 4. 路径回溯：
 *    - 时间复杂度：O(m × n)
 *    - 空间复杂度：O(m × n)
 *    - 优点：可以展示具体的编辑操作
 *    - 适用：需要显示编辑步骤的应用
 *
 * 核心要点：
 * - 状态转移方程是算法的核心
 * - 三种基本操作：插入、删除、替换
 * - 边界条件的处理很重要
 * - 空间优化的关键在于观察状态依赖关系
 * - 编辑距离是字符串算法的基础问题
 */