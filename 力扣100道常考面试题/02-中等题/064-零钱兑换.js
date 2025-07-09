/**
 * LeetCode 322. 零钱兑换
 *
 * 问题描述：
 * 给你一个整数数组 coins ，表示不同面额的硬币；以及一个整数 amount ，表示总金额。
 * 计算并返回可以凑成总金额所需的最少的硬币个数。如果没有任何一种硬币组合能组成总金额，返回 -1 。
 *
 * 核心思想：
 * 动态规划：dp[i] 表示凑成金额 i 所需的最少硬币数
 * 状态转移：dp[i] = min(dp[i], dp[i-coin] + 1)
 *
 * 示例：
 * 输入：coins = [1, 2, 5], amount = 11
 * 输出：3
 */

/**
 * 零钱兑换
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
function coinChange(coins, amount) {
    // TODO: 实现零钱兑换算法
    console.log("零钱兑换算法待实现");
    return -1;
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        coinChange
    };
}