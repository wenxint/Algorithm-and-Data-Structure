/**
 * LeetCode 213. 打家劫舍 II
 *
 * 问题描述：
 * 你是一个专业的小偷，计划偷窃沿街的房屋，每间房内都藏有一定的现金。
 * 这个地方所有的房屋都围成一圈，这意味着第一个房屋和最后一个房屋是紧挨着的。
 * 同时，相邻的房屋装有相互连通的防盗系统，如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警。
 *
 * 核心思想：
 * 环形数组的动态规划问题
 * 分两种情况：1. 包含第一个房屋，不包含最后一个 2. 不包含第一个房屋，包含最后一个
 *
 * 示例：
 * 输入：nums = [2,3,2]
 * 输出：3
 */

/**
 * 打家劫舍 II
 * @param {number[]} nums
 * @return {number}
 */
function rob(nums) {
    // TODO: 实现打家劫舍II算法
    console.log("打家劫舍II算法待实现");
    return 0;
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        rob
    };
}