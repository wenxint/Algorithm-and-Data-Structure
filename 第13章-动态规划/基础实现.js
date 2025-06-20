/**
 * 第13章 动态规划 - 基础实现
 *
 * 本文件包含：
 * 1. 线性动态规划算法
 * 2. 背包问题动态规划
 * 3. 路径动态规划
 * 4. 区间动态规划
 * 5. 状态压缩动态规划
 * 6. 性能测试与分析
 *
 * 作者：数据结构与算法教程
 * 日期：2024年
 */

// ==================== 1. 线性动态规划 ====================

/**
 * 斐波那契数列（经典入门题）
 *
 * 核心思想：
 * 每个数字是前两个数字的和
 * F(n) = F(n-1) + F(n-2)
 *
 * @param {number} n - 第n个斐波那契数
 * @returns {number} 斐波那契数
 * @time O(n)
 * @space O(1)
 */
function fibonacci(n) {
    if (n <= 1) return n;

    let prev2 = 0; // F(0)
    let prev1 = 1; // F(1)
    let current = 0;

    for (let i = 2; i <= n; i++) {
        current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }

    return current;
}

/**
 * 爬楼梯问题
 *
 * 核心思想：
 * 到达第n级楼梯可以从第n-1级或第n-2级上来
 * dp[n] = dp[n-1] + dp[n-2]
 *
 * @param {number} n - 楼梯级数
 * @returns {number} 爬楼梯的方法数
 * @time O(n)
 * @space O(1)
 */
function climbStairs(n) {
    if (n <= 2) return n;

    let first = 1;  // 1级楼梯的方法数
    let second = 2; // 2级楼梯的方法数

    for (let i = 3; i <= n; i++) {
        const third = first + second;
        first = second;
        second = third;
    }

    return second;
}

/**
 * 最大子数组和（Kadane算法）
 *
 * 核心思想：
 * dp[i]表示以第i个元素结尾的最大子数组和
 * dp[i] = max(nums[i], dp[i-1] + nums[i])
 *
 * @param {number[]} nums - 输入数组
 * @returns {number} 最大子数组和
 * @time O(n)
 * @space O(1)
 */
function maxSubArray(nums) {
    if (nums.length === 0) return 0;

    let maxEndingHere = nums[0];
    let maxSoFar = nums[0];

    for (let i = 1; i < nums.length; i++) {
        // 选择开始新的子数组，或扩展现有子数组
        maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);
        maxSoFar = Math.max(maxSoFar, maxEndingHere);
    }

    return maxSoFar;
}

/**
 * 最长递增子序列（LIS）
 *
 * 核心思想：
 * dp[i]表示以第i个元素结尾的最长递增子序列长度
 * 对于每个位置，检查所有前面的位置进行状态转移
 *
 * @param {number[]} nums - 输入数组
 * @returns {number} 最长递增子序列长度
 * @time O(n²)
 * @space O(n)
 */
function lengthOfLIS(nums) {
    if (nums.length === 0) return 0;

    const dp = new Array(nums.length).fill(1);
    let maxLength = 1;

    for (let i = 1; i < nums.length; i++) {
        for (let j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
        maxLength = Math.max(maxLength, dp[i]);
    }

    return maxLength;
}

/**
 * 打家劫舍问题
 *
 * 核心思想：
 * 不能抢劫相邻的房屋
 * dp[i] = max(dp[i-1], dp[i-2] + nums[i])
 *
 * @param {number[]} nums - 各房屋的金额
 * @returns {number} 能抢到的最大金额
 * @time O(n)
 * @space O(1)
 */
function rob(nums) {
    if (nums.length === 0) return 0;
    if (nums.length === 1) return nums[0];

    let prev2 = 0;          // dp[i-2]
    let prev1 = nums[0];    // dp[i-1]

    for (let i = 1; i < nums.length; i++) {
        const current = Math.max(prev1, prev2 + nums[i]);
        prev2 = prev1;
        prev1 = current;
    }

    return prev1;
}

// ==================== 2. 背包动态规划 ====================

/**
 * 0-1背包问题
 *
 * 核心思想：
 * 对于每个物品，选择拿或不拿
 * dp[i][j] = max(dp[i-1][j], dp[i-1][j-weight[i]] + value[i])
 *
 * @param {number[]} weights - 物品重量
 * @param {number[]} values - 物品价值
 * @param {number} capacity - 背包容量
 * @returns {number} 最大价值
 * @time O(n * capacity)
 * @space O(capacity)
 */
function knapsack01(weights, values, capacity) {
    const n = weights.length;
    const dp = new Array(capacity + 1).fill(0);

    for (let i = 0; i < n; i++) {
        // 从右到左更新，避免状态覆盖
        for (let j = capacity; j >= weights[i]; j--) {
            dp[j] = Math.max(dp[j], dp[j - weights[i]] + values[i]);
        }
    }

    return dp[capacity];
}

/**
 * 完全背包问题
 *
 * 核心思想：
 * 每种物品可以取无限次
 * 状态转移时考虑重复使用同一物品
 *
 * @param {number[]} weights - 物品重量
 * @param {number[]} values - 物品价值
 * @param {number} capacity - 背包容量
 * @returns {number} 最大价值
 * @time O(n * capacity)
 * @space O(capacity)
 */
function completeKnapsack(weights, values, capacity) {
    const n = weights.length;
    const dp = new Array(capacity + 1).fill(0);

    for (let i = 0; i < n; i++) {
        // 从左到右更新，允许重复使用
        for (let j = weights[i]; j <= capacity; j++) {
            dp[j] = Math.max(dp[j], dp[j - weights[i]] + values[i]);
        }
    }

    return dp[capacity];
}

/**
 * 零钱兑换问题
 *
 * 核心思想：
 * 求组成目标金额的最少硬币数
 * dp[i] = min(dp[i], dp[i - coin] + 1)
 *
 * @param {number[]} coins - 硬币面额
 * @param {number} amount - 目标金额
 * @returns {number} 最少硬币数，-1表示无法组成
 * @time O(amount * coins.length)
 * @space O(amount)
 */
function coinChange(coins, amount) {
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;

    for (let i = 1; i <= amount; i++) {
        for (const coin of coins) {
            if (coin <= i) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }

    return dp[amount] === Infinity ? -1 : dp[amount];
}

// ==================== 3. 路径动态规划 ====================

/**
 * 不同路径问题
 *
 * 核心思想：
 * 只能向右或向下移动
 * dp[i][j] = dp[i-1][j] + dp[i][j-1]
 *
 * @param {number} m - 网格行数
 * @param {number} n - 网格列数
 * @returns {number} 路径数量
 * @time O(m * n)
 * @space O(n)
 */
function uniquePaths(m, n) {
    const dp = new Array(n).fill(1);

    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            dp[j] += dp[j - 1];
        }
    }

    return dp[n - 1];
}

/**
 * 最小路径和
 *
 * 核心思想：
 * 从左上角到右下角的最小路径和
 * dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])
 *
 * @param {number[][]} grid - 网格
 * @returns {number} 最小路径和
 * @time O(m * n)
 * @space O(n)
 */
function minPathSum(grid) {
    const m = grid.length;
    const n = grid[0].length;
    const dp = new Array(n);

    // 初始化第一行
    dp[0] = grid[0][0];
    for (let j = 1; j < n; j++) {
        dp[j] = dp[j - 1] + grid[0][j];
    }

    // 逐行更新
    for (let i = 1; i < m; i++) {
        dp[0] += grid[i][0]; // 第一列

        for (let j = 1; j < n; j++) {
            dp[j] = grid[i][j] + Math.min(dp[j], dp[j - 1]);
        }
    }

    return dp[n - 1];
}

/**
 * 三角形最小路径和
 *
 * 核心思想：
 * 从顶部到底部的最小路径和
 * 每步只能移动到下一行相邻的节点
 *
 * @param {number[][]} triangle - 三角形数组
 * @returns {number} 最小路径和
 * @time O(n²)
 * @space O(n)
 */
function minimumTotal(triangle) {
    const n = triangle.length;
    const dp = [...triangle[n - 1]]; // 从底部开始

    // 从倒数第二行开始向上计算
    for (let i = n - 2; i >= 0; i--) {
        for (let j = 0; j <= i; j++) {
            dp[j] = triangle[i][j] + Math.min(dp[j], dp[j + 1]);
        }
    }

    return dp[0];
}

// ==================== 4. 区间动态规划 ====================

/**
 * 最长回文子序列
 *
 * 核心思想：
 * dp[i][j]表示s[i...j]的最长回文子序列长度
 * 如果s[i] == s[j]，则dp[i][j] = dp[i+1][j-1] + 2
 *
 * @param {string} s - 输入字符串
 * @returns {number} 最长回文子序列长度
 * @time O(n²)
 * @space O(n²)
 */
function longestPalindromeSubseq(s) {
    const n = s.length;
    const dp = Array(n).fill(null).map(() => Array(n).fill(0));

    // 单个字符是回文
    for (let i = 0; i < n; i++) {
        dp[i][i] = 1;
    }

    // 按区间长度从小到大
    for (let len = 2; len <= n; len++) {
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;

            if (s[i] === s[j]) {
                dp[i][j] = dp[i + 1][j - 1] + 2;
            } else {
                dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
            }
        }
    }

    return dp[0][n - 1];
}

/**
 * 矩阵链乘法
 *
 * 核心思想：
 * 找到最优的矩阵相乘顺序以最小化乘法次数
 * dp[i][j]表示计算矩阵链Ai...Aj的最小乘法次数
 *
 * @param {number[]} p - 矩阵维度数组
 * @returns {number} 最小乘法次数
 * @time O(n³)
 * @space O(n²)
 */
function matrixChainOrder(p) {
    const n = p.length - 1; // 矩阵数量
    const dp = Array(n).fill(null).map(() => Array(n).fill(0));

    // 按区间长度从小到大
    for (let len = 2; len <= n; len++) {
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;
            dp[i][j] = Infinity;

            // 尝试所有可能的分割点
            for (let k = i; k < j; k++) {
                const cost = dp[i][k] + dp[k + 1][j] + p[i] * p[k + 1] * p[j + 1];
                dp[i][j] = Math.min(dp[i][j], cost);
            }
        }
    }

    return dp[0][n - 1];
}

// ==================== 5. 字符串动态规划 ====================

/**
 * 编辑距离（Levenshtein Distance）
 *
 * 核心思想：
 * 将word1转换为word2的最少操作数
 * 操作包括：插入、删除、替换
 *
 * @param {string} word1 - 源字符串
 * @param {string} word2 - 目标字符串
 * @returns {number} 最小编辑距离
 * @time O(m * n)
 * @space O(n)
 */
function minDistance(word1, word2) {
    const m = word1.length;
    const n = word2.length;

    // 使用滚动数组优化空间
    let dp = new Array(n + 1);

    // 初始化第一行
    for (let j = 0; j <= n; j++) {
        dp[j] = j;
    }

    for (let i = 1; i <= m; i++) {
        const newDp = new Array(n + 1);
        newDp[0] = i;

        for (let j = 1; j <= n; j++) {
            if (word1[i - 1] === word2[j - 1]) {
                newDp[j] = dp[j - 1]; // 字符相同，不需要操作
            } else {
                newDp[j] = Math.min(
                    dp[j] + 1,      // 删除
                    newDp[j - 1] + 1, // 插入
                    dp[j - 1] + 1   // 替换
                );
            }
        }

        dp = newDp;
    }

    return dp[n];
}

/**
 * 最长公共子序列（LCS）
 *
 * 核心思想：
 * 找到两个字符串的最长公共子序列
 * 如果字符相同，则长度+1；否则取较大值
 *
 * @param {string} text1 - 字符串1
 * @param {string} text2 - 字符串2
 * @returns {number} 最长公共子序列长度
 * @time O(m * n)
 * @space O(n)
 */
function longestCommonSubsequence(text1, text2) {
    const m = text1.length;
    const n = text2.length;

    let dp = new Array(n + 1).fill(0);

    for (let i = 1; i <= m; i++) {
        const newDp = new Array(n + 1).fill(0);

        for (let j = 1; j <= n; j++) {
            if (text1[i - 1] === text2[j - 1]) {
                newDp[j] = dp[j - 1] + 1;
            } else {
                newDp[j] = Math.max(dp[j], newDp[j - 1]);
            }
        }

        dp = newDp;
    }

    return dp[n];
}

// ==================== 性能测试工具 ====================

/**
 * 动态规划性能测试类
 */
class DPPerformanceTester {
    constructor() {
        this.results = new Map();
    }

    /**
     * 测试算法性能
     */
    testAlgorithm(name, algorithm, ...args) {
        const startTime = performance.now();
        const result = algorithm(...args);
        const endTime = performance.now();

        const timeUsed = endTime - startTime;

        if (!this.results.has(name)) {
            this.results.set(name, []);
        }

        this.results.get(name).push({
            result,
            timeUsed,
            args: args.map(arg => Array.isArray(arg) ? `Array(${arg.length})` : arg)
        });

        return { result, timeUsed };
    }

    /**
     * 获取性能统计
     */
    getStats() {
        const stats = {};

        for (const [name, results] of this.results) {
            const times = results.map(r => r.timeUsed);
            stats[name] = {
                count: results.length,
                avgTime: times.reduce((a, b) => a + b, 0) / times.length,
                minTime: Math.min(...times),
                maxTime: Math.max(...times),
                results: results
            };
        }

        return stats;
    }

    /**
     * 清除统计数据
     */
    clear() {
        this.results.clear();
    }
}

// ==================== 导出和测试 ====================

/**
 * 运行基础动态规划测试
 */
function runBasicDPTests() {
    console.log("=== 动态规划基础实现测试 ===\n");

    const tester = new DPPerformanceTester();

    // 测试线性DP
    console.log("1. 线性动态规划测试:");
    console.log(`斐波那契(10): ${tester.testAlgorithm('fibonacci', fibonacci, 10).result}`);
    console.log(`爬楼梯(10): ${tester.testAlgorithm('climbStairs', climbStairs, 10).result}`);
    console.log(`最大子数组和: ${tester.testAlgorithm('maxSubArray', maxSubArray, [-2,1,-3,4,-1,2,1,-5,4]).result}`);
    console.log(`最长递增子序列: ${tester.testAlgorithm('lengthOfLIS', lengthOfLIS, [10,9,2,5,3,7,101,18]).result}`);
    console.log(`打家劫舍: ${tester.testAlgorithm('rob', rob, [2,7,9,3,1]).result}`);

    // 测试背包DP
    console.log("\n2. 背包动态规划测试:");
    const weights = [1, 3, 4, 5];
    const values = [1, 4, 5, 7];
    console.log(`0-1背包: ${tester.testAlgorithm('knapsack01', knapsack01, weights, values, 7).result}`);
    console.log(`完全背包: ${tester.testAlgorithm('completeKnapsack', completeKnapsack, [1, 2, 3], [1, 2, 3], 5).result}`);
    console.log(`零钱兑换: ${tester.testAlgorithm('coinChange', coinChange, [1, 3, 4], 6).result}`);

    // 测试路径DP
    console.log("\n3. 路径动态规划测试:");
    console.log(`不同路径: ${tester.testAlgorithm('uniquePaths', uniquePaths, 3, 7).result}`);
    const grid = [[1,3,1],[1,5,1],[4,2,1]];
    console.log(`最小路径和: ${tester.testAlgorithm('minPathSum', minPathSum, grid).result}`);
    const triangle = [[2],[3,4],[6,5,7],[4,1,8,3]];
    console.log(`三角形最小路径和: ${tester.testAlgorithm('minimumTotal', minimumTotal, triangle).result}`);

    // 测试区间DP
    console.log("\n4. 区间动态规划测试:");
    console.log(`最长回文子序列: ${tester.testAlgorithm('longestPalindromeSubseq', longestPalindromeSubseq, "bbbab").result}`);
    console.log(`矩阵链乘法: ${tester.testAlgorithm('matrixChainOrder', matrixChainOrder, [1,2,3,4,5]).result}`);

    // 测试字符串DP
    console.log("\n5. 字符串动态规划测试:");
    console.log(`编辑距离: ${tester.testAlgorithm('minDistance', minDistance, "horse", "ros").result}`);
    console.log(`最长公共子序列: ${tester.testAlgorithm('longestCommonSubsequence', longestCommonSubsequence, "abcde", "ace").result}`);

    // 性能统计
    console.log("\n=== 性能统计 ===");
    const stats = tester.getStats();
    Object.keys(stats).forEach(name => {
        const stat = stats[name];
        console.log(`${name}: 平均 ${stat.avgTime.toFixed(3)}ms`);
    });
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // 线性DP
        fibonacci,
        climbStairs,
        maxSubArray,
        lengthOfLIS,
        rob,

        // 背包DP
        knapsack01,
        completeKnapsack,
        coinChange,

        // 路径DP
        uniquePaths,
        minPathSum,
        minimumTotal,

        // 区间DP
        longestPalindromeSubseq,
        matrixChainOrder,

        // 字符串DP
        minDistance,
        longestCommonSubsequence,

        // 工具类
        DPPerformanceTester,
        runBasicDPTests
    };
}