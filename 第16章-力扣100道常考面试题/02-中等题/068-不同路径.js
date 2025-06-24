/**
 * LeetCode 62. 不同路径
 *
 * 问题描述：
 * 一个机器人位于一个 m x n 网格的左上角（起始点在下图中标记为 "Start" ）。
 * 机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角（在下图中标记为 "Finish" ）。
 * 问总共有多少条不同的路径？
 *
 * 核心思想：
 * 动态规划：dp[i][j] 表示到达位置(i,j)的路径数
 * 状态转移：dp[i][j] = dp[i-1][j] + dp[i][j-1]
 *
 * 示例：
 * 输入：m = 3, n = 7
 * 输出：28
 */

/**
 * 不同路径
 * @param {number} m
 * @param {number} n
 * @return {number}
 */
function uniquePaths(m, n) {
    // TODO: 实现不同路径算法
    console.log("不同路径算法待实现");
    return 0;
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        uniquePaths
    };
}