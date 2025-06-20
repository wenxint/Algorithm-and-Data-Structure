/**
 * 第13章 动态规划 - 练习题解答
 *
 * 本文件包含：
 * 1. 最长公共子序列
 * 2. 股票买卖的最佳时机
 * 3. 编辑距离
 * 4. 完全背包问题
 * 5. 矩阵链乘法
 *
 * 作者：数据结构与算法教程
 * 日期：2024年
 */

// ==================== 1. 最长公共子序列 ====================

/**
 * 最长公共子序列 - 解法1：二维DP
 *
 * 核心思想：
 * 双序列动态规划的经典问题
 * dp[i][j] 表示 text1[0...i-1] 和 text2[0...j-1] 的最长公共子序列长度
 *
 * @param {string} text1 - 第一个字符串
 * @param {string} text2 - 第二个字符串
 * @returns {number} 最长公共子序列长度
 * @time O(mn) m、n分别为两字符串长度
 * @space O(mn)
 */
function longestCommonSubsequence1(text1, text2) {
    const m = text1.length, n = text2.length;

    // dp[i][j] = text1[0...i-1] 和 text2[0...j-1] 的LCS长度
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));

    // 状态转移
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (text1[i - 1] === text2[j - 1]) {
                // 字符匹配，LCS长度+1
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                // 字符不匹配，取两种情况的最大值
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    return dp[m][n];
}

/**
 * 最长公共子序列 - 解法2：空间优化
 *
 * 核心思想：
 * 只保留当前行和上一行的状态，降低空间复杂度
 *
 * @param {string} text1
 * @param {string} text2
 * @returns {number}
 * @time O(mn)
 * @space O(min(m,n))
 */
function longestCommonSubsequence2(text1, text2) {
    // 确保text1是较短的字符串，优化空间
    if (text1.length > text2.length) {
        [text1, text2] = [text2, text1];
    }

    const m = text1.length, n = text2.length;
    let prev = new Array(m + 1).fill(0);
    let curr = new Array(m + 1).fill(0);

    for (let j = 1; j <= n; j++) {
        for (let i = 1; i <= m; i++) {
            if (text1[i - 1] === text2[j - 1]) {
                curr[i] = prev[i - 1] + 1;
            } else {
                curr[i] = Math.max(prev[i], curr[i - 1]);
            }
        }
        [prev, curr] = [curr, prev]; // 交换数组
    }

    return prev[m];
}

/**
 * 最长公共子序列 - 解法3：输出具体LCS字符串
 *
 * 核心思想：
 * 在计算DP的同时记录路径，通过回溯构造LCS字符串
 *
 * @param {string} text1
 * @param {string} text2
 * @returns {Object} {length: number, sequence: string}
 */
function longestCommonSubsequence3(text1, text2) {
    const m = text1.length, n = text2.length;
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));

    // 填充DP表
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (text1[i - 1] === text2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    // 回溯构造LCS字符串
    const lcs = [];
    let i = m, j = n;

    while (i > 0 && j > 0) {
        if (text1[i - 1] === text2[j - 1]) {
            lcs.unshift(text1[i - 1]); // 在前面插入字符
            i--;
            j--;
        } else if (dp[i - 1][j] > dp[i][j - 1]) {
            i--; // 来自上方
        } else {
            j--; // 来自左方
        }
    }

    return {
        length: dp[m][n],
        sequence: lcs.join('')
    };
}

// ==================== 2. 股票买卖的最佳时机 ====================

/**
 * 股票买卖 - 解法1：最多k次交易
 *
 * 核心思想：
 * 状态机DP，定义三维状态
 * dp[i][j][state] = 第i天进行了j次交易时的状态收益
 * state: 0-不持有股票, 1-持有股票
 *
 * @param {number} k - 最多交易次数
 * @param {number[]} prices - 股票价格数组
 * @returns {number} 最大利润
 * @time O(nk)
 * @space O(nk)
 */
function maxProfit1(k, prices) {
    const n = prices.length;
    if (n <= 1) return 0;

    // 当k很大时，相当于无限次交易
    if (k >= n / 2) {
        return maxProfitUnlimited(prices);
    }

    // dp[i][j][0] = 第i天进行了j次交易且不持有股票的最大收益
    // dp[i][j][1] = 第i天进行了j次交易且持有股票的最大收益
    const dp = Array(n).fill().map(() =>
        Array(k + 1).fill().map(() => Array(2).fill(0))
    );

    // 初始化第0天
    for (let j = 0; j <= k; j++) {
        dp[0][j][0] = 0;           // 不持有股票
        dp[0][j][1] = -prices[0];  // 持有股票
    }

    for (let i = 1; i < n; i++) {
        for (let j = 0; j <= k; j++) {
            // 不持有股票：要么昨天就不持有，要么昨天持有今天卖出
            dp[i][j][0] = Math.max(dp[i-1][j][0], dp[i-1][j][1] + prices[i]);

            // 持有股票：要么昨天就持有，要么昨天不持有今天买入
            if (j > 0) {
                dp[i][j][1] = Math.max(dp[i-1][j][1], dp[i-1][j-1][0] - prices[i]);
            } else {
                dp[i][j][1] = Math.max(dp[i-1][j][1], -prices[i]);
            }
        }
    }

    return dp[n-1][k][0];
}

/**
 * 无限次交易的情况（贪心算法）
 */
function maxProfitUnlimited(prices) {
    let profit = 0;
    for (let i = 1; i < prices.length; i++) {
        if (prices[i] > prices[i-1]) {
            profit += prices[i] - prices[i-1];
        }
    }
    return profit;
}

/**
 * 股票买卖 - 解法2：空间优化版本
 *
 * 核心思想：
 * 当前状态只依赖前一天的状态，可以使用滚动数组优化空间
 *
 * @param {number} k
 * @param {number[]} prices
 * @returns {number}
 * @time O(nk)
 * @space O(k)
 */
function maxProfit2(k, prices) {
    const n = prices.length;
    if (n <= 1) return 0;

    if (k >= n / 2) {
        return maxProfitUnlimited(prices);
    }

    // 只需要保存两个状态：持有和不持有
    let hold = new Array(k + 1).fill(-prices[0]);    // 持有股票
    let sold = new Array(k + 1).fill(0);             // 不持有股票

    for (let i = 1; i < n; i++) {
        // 从后往前更新，避免使用已更新的值
        for (let j = k; j >= 1; j--) {
            sold[j] = Math.max(sold[j], hold[j] + prices[i]);
            hold[j] = Math.max(hold[j], sold[j-1] - prices[i]);
        }
    }

    return sold[k];
}

/**
 * 股票买卖 - 解法3：包含冷冻期
 *
 * 核心思想：
 * 增加冷冻期状态，卖出后必须冷冻一天
 * 三种状态：持有、不持有（可买入）、冷冻期
 *
 * @param {number[]} prices
 * @returns {number}
 */
function maxProfitWithCooldown(prices) {
    const n = prices.length;
    if (n <= 1) return 0;

    let hold = -prices[0];  // 持有股票
    let sold = 0;           // 不持有股票且非冷冻期
    let rest = 0;           // 冷冻期

    for (let i = 1; i < n; i++) {
        const prevHold = hold, prevSold = sold, prevRest = rest;

        hold = Math.max(prevHold, prevSold - prices[i]); // 继续持有或买入
        sold = prevHold + prices[i];                     // 卖出
        rest = Math.max(prevSold, prevRest);             // 休息
    }

    return Math.max(sold, rest); // 最后不能持有股票
}

// ==================== 3. 编辑距离 ====================

/**
 * 编辑距离 - 解法1：基础DP
 *
 * 核心思想：
 * dp[i][j] 表示将 word1[0...i-1] 转换为 word2[0...j-1] 的最少操作数
 * 三种操作：插入、删除、替换
 *
 * @param {string} word1
 * @param {string} word2
 * @returns {number} 最少编辑距离
 * @time O(mn)
 * @space O(mn)
 */
function minDistance1(word1, word2) {
    const m = word1.length, n = word2.length;

    // dp[i][j] = word1[0...i-1] 转换为 word2[0...j-1] 的最少操作数
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));

    // 初始化边界条件
    for (let i = 0; i <= m; i++) {
        dp[i][0] = i; // word1[0...i-1] 转换为空字符串需要i次删除
    }
    for (let j = 0; j <= n; j++) {
        dp[0][j] = j; // 空字符串转换为 word2[0...j-1] 需要j次插入
    }

    // 状态转移
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (word1[i - 1] === word2[j - 1]) {
                // 字符相同，无需额外操作
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                // 字符不同，取三种操作的最小值
                dp[i][j] = 1 + Math.min(
                    dp[i - 1][j],     // 删除 word1[i-1]
                    dp[i][j - 1],     // 插入 word2[j-1]
                    dp[i - 1][j - 1]  // 替换 word1[i-1] 为 word2[j-1]
                );
            }
        }
    }

    return dp[m][n];
}

/**
 * 编辑距离 - 解法2：空间优化
 *
 * 核心思想：
 * 使用滚动数组，只保留当前行和上一行
 *
 * @param {string} word1
 * @param {string} word2
 * @returns {number}
 * @time O(mn)
 * @space O(min(m,n))
 */
function minDistance2(word1, word2) {
    // 确保word2是较短的字符串
    if (word1.length < word2.length) {
        [word1, word2] = [word2, word1];
    }

    const m = word1.length, n = word2.length;
    let prev = Array(n + 1).fill().map((_, i) => i);
    let curr = new Array(n + 1);

    for (let i = 1; i <= m; i++) {
        curr[0] = i;

        for (let j = 1; j <= n; j++) {
            if (word1[i - 1] === word2[j - 1]) {
                curr[j] = prev[j - 1];
            } else {
                curr[j] = 1 + Math.min(prev[j], curr[j - 1], prev[j - 1]);
            }
        }

        [prev, curr] = [curr, prev];
    }

    return prev[n];
}

/**
 * 编辑距离 - 解法3：记录操作序列
 *
 * 核心思想：
 * 在计算DP的同时记录操作类型，最后回溯输出操作序列
 *
 * @param {string} word1
 * @param {string} word2
 * @returns {Object} {distance: number, operations: Array}
 */
function minDistance3(word1, word2) {
    const m = word1.length, n = word2.length;

    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
    const operations = Array(m + 1).fill().map(() => Array(n + 1).fill(''));

    // 初始化
    for (let i = 0; i <= m; i++) {
        dp[i][0] = i;
        operations[i][0] = 'delete';
    }
    for (let j = 0; j <= n; j++) {
        dp[0][j] = j;
        operations[0][j] = 'insert';
    }

    // 状态转移
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (word1[i - 1] === word2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
                operations[i][j] = 'match';
            } else {
                const deleteOp = dp[i - 1][j] + 1;
                const insertOp = dp[i][j - 1] + 1;
                const replaceOp = dp[i - 1][j - 1] + 1;

                const minOp = Math.min(deleteOp, insertOp, replaceOp);
                dp[i][j] = minOp;

                if (minOp === deleteOp) {
                    operations[i][j] = 'delete';
                } else if (minOp === insertOp) {
                    operations[i][j] = 'insert';
                } else {
                    operations[i][j] = 'replace';
                }
            }
        }
    }

    // 回溯构造操作序列
    const opSequence = [];
    let i = m, j = n;

    while (i > 0 || j > 0) {
        const op = operations[i][j];

        if (op === 'match') {
            i--; j--;
        } else if (op === 'delete') {
            opSequence.unshift(`删除 '${word1[i-1]}' 在位置 ${i-1}`);
            i--;
        } else if (op === 'insert') {
            opSequence.unshift(`插入 '${word2[j-1]}' 在位置 ${i}`);
            j--;
        } else if (op === 'replace') {
            opSequence.unshift(`替换 '${word1[i-1]}' 为 '${word2[j-1]}' 在位置 ${i-1}`);
            i--; j--;
        }
    }

    return {
        distance: dp[m][n],
        operations: opSequence
    };
}

// ==================== 4. 完全背包问题 ====================

/**
 * 完全背包 - 解法1：标准DP
 *
 * 核心思想：
 * dp[i] 表示容量为i的背包能获得的最大价值
 * 每个物品可以选择无限次，内层循环正向遍历
 *
 * @param {number[]} volumes - 物品体积数组
 * @param {number[]} values - 物品价值数组
 * @param {number} capacity - 背包容量
 * @returns {number} 最大价值
 * @time O(n * capacity)
 * @space O(capacity)
 */
function completeKnapsack1(volumes, values, capacity) {
    const n = volumes.length;
    const dp = new Array(capacity + 1).fill(0);

    // 遍历每个物品
    for (let i = 0; i < n; i++) {
        // 正向遍历容量（完全背包的关键）
        for (let w = volumes[i]; w <= capacity; w++) {
            dp[w] = Math.max(dp[w], dp[w - volumes[i]] + values[i]);
        }
    }

    return dp[capacity];
}

/**
 * 完全背包 - 解法2：输出选择方案
 *
 * 核心思想：
 * 记录每个状态的选择情况，回溯构造具体方案
 *
 * @param {number[]} volumes
 * @param {number[]} values
 * @param {number} capacity
 * @returns {Object} {maxValue: number, items: Array}
 */
function completeKnapsack2(volumes, values, capacity) {
    const n = volumes.length;
    const dp = new Array(capacity + 1).fill(0);
    const choice = new Array(capacity + 1).fill(-1); // 记录选择的物品

    for (let i = 0; i < n; i++) {
        for (let w = volumes[i]; w <= capacity; w++) {
            if (dp[w - volumes[i]] + values[i] > dp[w]) {
                dp[w] = dp[w - volumes[i]] + values[i];
                choice[w] = i; // 记录在容量w时选择了物品i
            }
        }
    }

    // 回溯构造方案
    const items = [];
    let w = capacity;

    while (w > 0 && choice[w] !== -1) {
        const item = choice[w];
        items.push({
            index: item,
            volume: volumes[item],
            value: values[item]
        });
        w -= volumes[item];
    }

    return {
        maxValue: dp[capacity],
        items: items.reverse()
    };
}

/**
 * 完全背包 - 解法3：硬币找零变形
 *
 * 核心思想：
 * 求凑成目标金额的最少硬币数量
 * dp[i] 表示凑成金额i的最少硬币数
 *
 * @param {number[]} coins - 硬币面额数组
 * @param {number} amount - 目标金额
 * @returns {number} 最少硬币数，无解返回-1
 */
function coinChange(coins, amount) {
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0; // 凑成金额0需要0个硬币

    for (let coin of coins) {
        for (let i = coin; i <= amount; i++) {
            if (dp[i - coin] !== Infinity) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }

    return dp[amount] === Infinity ? -1 : dp[amount];
}

/**
 * 硬币找零：输出具体方案
 */
function coinChangeWithPath(coins, amount) {
    const dp = new Array(amount + 1).fill(Infinity);
    const parent = new Array(amount + 1).fill(-1);
    dp[0] = 0;

    for (let coin of coins) {
        for (let i = coin; i <= amount; i++) {
            if (dp[i - coin] + 1 < dp[i]) {
                dp[i] = dp[i - coin] + 1;
                parent[i] = coin; // 记录使用的硬币
            }
        }
    }

    if (dp[amount] === Infinity) {
        return { minCoins: -1, path: [] };
    }

    // 构造路径
    const path = [];
    let current = amount;
    while (current > 0) {
        const coin = parent[current];
        path.push(coin);
        current -= coin;
    }

    return {
        minCoins: dp[amount],
        path: path.sort((a, b) => b - a)
    };
}

// ==================== 5. 矩阵链乘法 ====================

/**
 * 矩阵链乘法 - 解法1：基础区间DP
 *
 * 核心思想：
 * dp[i][j] 表示计算矩阵Ai到Aj的乘积所需的最少标量乘法次数
 * 枚举所有可能的分割点k，取最小值
 *
 * @param {number[]} p - 矩阵维度数组，p[i-1]×p[i]是第i个矩阵的维度
 * @returns {number} 最少标量乘法次数
 * @time O(n³)
 * @space O(n²)
 */
function matrixChainOrder1(p) {
    const n = p.length - 1; // 矩阵个数

    // dp[i][j] = 计算矩阵Ai到Aj的最少乘法次数
    const dp = Array(n + 1).fill().map(() => Array(n + 1).fill(0));

    // 枚举链长度
    for (let len = 2; len <= n; len++) {
        // 枚举起始位置
        for (let i = 1; i <= n - len + 1; i++) {
            const j = i + len - 1; // 结束位置
            dp[i][j] = Infinity;

            // 枚举分割点
            for (let k = i; k < j; k++) {
                const cost = dp[i][k] + dp[k + 1][j] + p[i - 1] * p[k] * p[j];
                dp[i][j] = Math.min(dp[i][j], cost);
            }
        }
    }

    return dp[1][n];
}

/**
 * 矩阵链乘法 - 解法2：输出最优括号化方案
 *
 * 核心思想：
 * 在计算DP的同时记录最优分割点，通过递归构造括号化方案
 *
 * @param {number[]} p
 * @returns {Object} {minMultiplications: number, optimalParentheses: string}
 */
function matrixChainOrder2(p) {
    const n = p.length - 1;
    const dp = Array(n + 1).fill().map(() => Array(n + 1).fill(0));
    const split = Array(n + 1).fill().map(() => Array(n + 1).fill(0)); // 记录最优分割点

    // 区间DP
    for (let len = 2; len <= n; len++) {
        for (let i = 1; i <= n - len + 1; i++) {
            const j = i + len - 1;
            dp[i][j] = Infinity;

            for (let k = i; k < j; k++) {
                const cost = dp[i][k] + dp[k + 1][j] + p[i - 1] * p[k] * p[j];
                if (cost < dp[i][j]) {
                    dp[i][j] = cost;
                    split[i][j] = k; // 记录最优分割点
                }
            }
        }
    }

    // 递归构造括号化方案
    function buildParentheses(i, j) {
        if (i === j) {
            return `A${i}`;
        } else {
            const k = split[i][j];
            const left = buildParentheses(i, k);
            const right = buildParentheses(k + 1, j);
            return `(${left}${right})`;
        }
    }

    return {
        minMultiplications: dp[1][n],
        optimalParentheses: buildParentheses(1, n)
    };
}

/**
 * 矩阵链乘法 - 解法3：记忆化搜索
 *
 * 核心思想：
 * 使用递归 + 记忆化的方式解决，代码更直观
 *
 * @param {number[]} p
 * @returns {number}
 */
function matrixChainOrder3(p) {
    const n = p.length - 1;
    const memo = new Map();

    function dp(i, j) {
        if (i === j) return 0;

        const key = `${i},${j}`;
        if (memo.has(key)) return memo.get(key);

        let minCost = Infinity;

        for (let k = i; k < j; k++) {
            const cost = dp(i, k) + dp(k + 1, j) + p[i - 1] * p[k] * p[j];
            minCost = Math.min(minCost, cost);
        }

        memo.set(key, minCost);
        return minCost;
    }

    return dp(1, n);
}

// ==================== 测试函数 ====================

/**
 * 测试第1题：最长公共子序列
 */
function testLCS() {
    console.log("=== 测试最长公共子序列 ===");

    const text1 = "abcde", text2 = "ace";

    console.log(`输入: text1 = "${text1}", text2 = "${text2}"`);
    console.log(`解法1 (二维DP): ${longestCommonSubsequence1(text1, text2)}`);
    console.log(`解法2 (空间优化): ${longestCommonSubsequence2(text1, text2)}`);

    const result3 = longestCommonSubsequence3(text1, text2);
    console.log(`解法3 (输出LCS): 长度=${result3.length}, 序列="${result3.sequence}"`);

    console.log();
}

/**
 * 测试第2题：股票买卖
 */
function testStockTrading() {
    console.log("=== 测试股票买卖的最佳时机 ===");

    const k = 2, prices = [3, 2, 6, 5, 0, 3];

    console.log(`输入: k = ${k}, prices = [${prices.join(', ')}]`);
    console.log(`解法1 (三维DP): ${maxProfit1(k, prices)}`);
    console.log(`解法2 (空间优化): ${maxProfit2(k, prices)}`);

    const prices2 = [1, 2, 3, 0, 2];
    console.log(`\n冷冻期测试: prices = [${prices2.join(', ')}]`);
    console.log(`包含冷冻期: ${maxProfitWithCooldown(prices2)}`);

    console.log();
}

/**
 * 测试第3题：编辑距离
 */
function testEditDistance() {
    console.log("=== 测试编辑距离 ===");

    const word1 = "horse", word2 = "ros";

    console.log(`输入: word1 = "${word1}", word2 = "${word2}"`);
    console.log(`解法1 (基础DP): ${minDistance1(word1, word2)}`);
    console.log(`解法2 (空间优化): ${minDistance2(word1, word2)}`);

    const result3 = minDistance3(word1, word2);
    console.log(`解法3 (输出操作): 距离=${result3.distance}`);
    console.log("操作序列:");
    result3.operations.forEach(op => console.log(`  ${op}`));

    console.log();
}

/**
 * 测试第4题：完全背包
 */
function testCompleteKnapsack() {
    console.log("=== 测试完全背包问题 ===");

    const volumes = [1, 3, 4], values = [15, 20, 30], capacity = 4;

    console.log(`输入: volumes = [${volumes.join(', ')}], values = [${values.join(', ')}], capacity = ${capacity}`);
    console.log(`解法1 (标准DP): ${completeKnapsack1(volumes, values, capacity)}`);

    const result2 = completeKnapsack2(volumes, values, capacity);
    console.log(`解法2 (输出方案): 最大价值=${result2.maxValue}`);
    console.log("选择的物品:");
    result2.items.forEach((item, index) => {
        console.log(`  第${index + 1}个: 索引${item.index}, 体积${item.volume}, 价值${item.value}`);
    });

    // 硬币找零测试
    const coins = [1, 3, 4], amount = 6;
    console.log(`\n硬币找零: coins = [${coins.join(', ')}], amount = ${amount}`);
    console.log(`最少硬币数: ${coinChange(coins, amount)}`);

    const pathResult = coinChangeWithPath(coins, amount);
    console.log(`具体方案: ${pathResult.path.join(' + ')} = ${amount}`);

    console.log();
}

/**
 * 测试第5题：矩阵链乘法
 */
function testMatrixChainMultiplication() {
    console.log("=== 测试矩阵链乘法 ===");

    const p = [1, 2, 3, 4, 5];

    console.log(`输入: 矩阵维度 = [${p.join(' × ')}]`);
    console.log("矩阵: A1(1×2), A2(2×3), A3(3×4), A4(4×5)");

    console.log(`解法1 (基础区间DP): ${matrixChainOrder1(p)}`);

    const result2 = matrixChainOrder2(p);
    console.log(`解法2 (输出方案): 最少乘法次数=${result2.minMultiplications}`);
    console.log(`最优括号化: ${result2.optimalParentheses}`);

    console.log(`解法3 (记忆化搜索): ${matrixChainOrder3(p)}`);

    console.log();
}

/**
 * 运行所有测试
 */
function runAllTests() {
    console.log("第13章 动态规划 - 练习题解答测试\n");

    testLCS();
    testStockTrading();
    testEditDistance();
    testCompleteKnapsack();
    testMatrixChainMultiplication();

    console.log("=== 所有测试完成 ===");
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // 最长公共子序列
        longestCommonSubsequence1,
        longestCommonSubsequence2,
        longestCommonSubsequence3,

        // 股票买卖
        maxProfit1,
        maxProfit2,
        maxProfitUnlimited,
        maxProfitWithCooldown,

        // 编辑距离
        minDistance1,
        minDistance2,
        minDistance3,

        // 完全背包
        completeKnapsack1,
        completeKnapsack2,
        coinChange,
        coinChangeWithPath,

        // 矩阵链乘法
        matrixChainOrder1,
        matrixChainOrder2,
        matrixChainOrder3,

        // 测试函数
        testLCS,
        testStockTrading,
        testEditDistance,
        testCompleteKnapsack,
        testMatrixChainMultiplication,
        runAllTests
    };
}

// 如果直接运行此文件，执行测试
if (typeof require !== 'undefined' && require.main === module) {
    runAllTests();
}