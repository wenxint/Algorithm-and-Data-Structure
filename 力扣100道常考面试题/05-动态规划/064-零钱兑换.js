/**
 * LeetCode 322. 零钱兑换
 *
 * 问题描述：
 * 给你一个整数数组 coins ，表示不同面额的硬币；以及一个整数 amount ，表示总金额。
 * 计算并返回可以凑成总金额所需的最少的硬币个数。如果没有任何一种硬币组合能组成总金额，返回 -1 。
 *
 * 核心思想：
 * 动态规划 - 完全背包问题的变种
 * dp[i] 表示凑成金额 i 所需的最少硬币数
 * 状态转移：dp[i] = min(dp[i], dp[i-coin] + 1)
 *
 * 示例：
 * 输入：coins = [1, 2, 5], amount = 11
 * 输出：3 (11 = 5 + 5 + 1)
 */

/**
 * 零钱兑换 - 动态规划解法（面试推荐）
 * @param {number[]} coins - 硬币面额数组
 * @param {number} amount - 目标金额
 * @return {number} 最少硬币数，无法凑成返回-1
 * @time O(amount * coins.length) 时间复杂度
 * @space O(amount) 空间复杂度
 */
function coinChange(coins, amount) {
    // 边界条件处理
    if (amount === 0) return 0;
    if (!coins || coins.length === 0) return -1;

    // 初始化DP数组
    // dp[i] 表示凑成金额 i 所需的最少硬币数
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0; // 凑成金额0需要0个硬币

    // 外层循环：遍历所有金额
    for (let i = 1; i <= amount; i++) {
        // 内层循环：尝试每种硬币
        for (const coin of coins) {
            if (coin <= i) {
                // 如果可以使用这种硬币
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }

    return dp[amount] === Infinity ? -1 : dp[amount];
}

/**
 * 零钱兑换 - 记忆化递归解法
 * @param {number[]} coins - 硬币面额数组
 * @param {number} amount - 目标金额
 * @return {number} 最少硬币数
 */
function coinChangeMemo(coins, amount) {
    const memo = new Map();

    function dfs(remain) {
        // 递归终止条件
        if (remain === 0) return 0;
        if (remain < 0) return -1;

        // 查找缓存
        if (memo.has(remain)) {
            return memo.get(remain);
        }

        let minCoins = Infinity;

        // 尝试每种硬币
        for (const coin of coins) {
            const subResult = dfs(remain - coin);
            if (subResult !== -1) {
                minCoins = Math.min(minCoins, subResult + 1);
            }
        }

        const result = minCoins === Infinity ? -1 : minCoins;
        memo.set(remain, result);
        return result;
    }

    return dfs(amount);
}

/**
 * 零钱兑换 - BFS解法（另一种思路）
 * @param {number[]} coins - 硬币面额数组
 * @param {number} amount - 目标金额
 * @return {number} 最少硬币数
 */
function coinChangeBFS(coins, amount) {
    if (amount === 0) return 0;

    const visited = new Set([0]);
    const queue = [0];
    let level = 0;

    while (queue.length > 0) {
        const size = queue.length;
        level++;

        for (let i = 0; i < size; i++) {
            const current = queue.shift();

            for (const coin of coins) {
                const next = current + coin;

                if (next === amount) {
                    return level;
                }

                if (next < amount && !visited.has(next)) {
                    visited.add(next);
                    queue.push(next);
                }
            }
        }
    }

    return -1;
}

/**
 * 测试函数
 */
function testCoinChange() {
    const testCases = [
        {
            coins: [1, 2, 5],
            amount: 11,
            expected: 3,
            description: "经典案例：11 = 5 + 5 + 1"
        },
        {
            coins: [2],
            amount: 3,
            expected: -1,
            description: "无法凑成的情况"
        },
        {
            coins: [1],
            amount: 0,
            expected: 0,
            description: "金额为0"
        },
        {
            coins: [1, 3, 4],
            amount: 6,
            expected: 2,
            description: "贪心非最优：6 = 3 + 3"
        }
    ];

    console.log("🪙 零钱兑换算法测试");
    console.log("==================");

    testCases.forEach((testCase, index) => {
        console.log(`\n测试用例 ${index + 1}: ${testCase.description}`);
        console.log(`输入: coins = [${testCase.coins.join(',')}], amount = ${testCase.amount}`);

        const result1 = coinChange(testCase.coins, testCase.amount);
        const result2 = coinChangeMemo(testCase.coins, testCase.amount);
        const result3 = coinChangeBFS(testCase.coins, testCase.amount);

        console.log(`动态规划结果: ${result1}`);
        console.log(`记忆化递归结果: ${result2}`);
        console.log(`BFS结果: ${result3}`);
        console.log(`期望结果: ${testCase.expected}`);

        const passed = result1 === testCase.expected &&
                      result2 === testCase.expected &&
                      result3 === testCase.expected;

        console.log(`测试${passed ? '✅ 通过' : '❌ 失败'}`);
    });
}

// 如果在Node.js环境中运行
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        coinChange,
        coinChangeMemo,
        coinChangeBFS,
        testCoinChange
    };
}

// 如果在浏览器环境中运行
if (typeof window !== 'undefined') {
    window.coinChange = coinChange;
    window.testCoinChange = testCoinChange;
}

// 运行测试
// testCoinChange();