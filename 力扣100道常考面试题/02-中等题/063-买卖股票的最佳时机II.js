/**
 * LeetCode 122. 买卖股票的最佳时机 II
 *
 * 问题描述：
 * 给你一个整数数组 prices ，其中 prices[i] 表示某支股票第 i 天的价格。
 * 在每一天，你可以决定是否购买和/或出售股票。你在任何时候最多只能持有一股股票。
 * 你也可以先购买，然后在同一天出售。
 * 返回你能获得的最大利润。
 *
 * 核心思想：
 * 贪心算法：只要今天价格比昨天高，就在昨天买入今天卖出
 * 相当于捕获所有上涨区间的利润
 *
 * 示例：
 * 输入：prices = [7,1,5,3,6,4]
 * 输出：7
 */

/**
 * 买卖股票的最佳时机 II
 * @param {number[]} prices
 * @return {number}
 */
function maxProfit(prices) {
    // TODO: 实现买卖股票的最佳时机II算法
    console.log("买卖股票的最佳时机II算法待实现");
    return 0;
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        maxProfit
    };
}