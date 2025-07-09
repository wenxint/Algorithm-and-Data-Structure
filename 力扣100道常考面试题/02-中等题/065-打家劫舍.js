/**
 * LeetCode 198. 打家劫舍
 *
 * 问题描述：
 * 你是一个专业的小偷，计划偷窃沿街的房屋。每间房内都藏有一定的现金，
 * 影响你偷窃的唯一制约因素就是相邻的房屋装有相互连通的防盗系统，
 * 如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警。
 *
 * 核心思想：
 * 动态规划：对于每间房屋，有偷和不偷两种选择
 * dp[i] = max(dp[i-2] + nums[i], dp[i-1])
 *
 * 示例：
 * 输入：[1,2,3,1]
 * 输出：4
 */

/**
 * 打家劫舍
 * @param {number[]} nums
 * @return {number}
 */
function rob(nums) {
    // TODO: 实现打家劫舍算法
    console.log("打家劫舍算法待实现");
    return 0;
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        rob
    };
}