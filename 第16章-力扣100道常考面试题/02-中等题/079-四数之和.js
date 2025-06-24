/**
 * LeetCode 18. 四数之和
 *
 * 问题描述：
 * 给你一个由 n 个整数组成的数组 nums ，和一个目标值 target 。
 * 请你找出并返回满足下述全部条件的、不重复的四元组 [nums[a], nums[b], nums[c], nums[d]]
 *
 * 核心思想：
 * 双指针：在三数之和基础上再加一层循环
 * 先排序，固定前两个数，用双指针找剩下两个数
 *
 * 示例：
 * 输入：nums = [1,0,-1,0,-2,2], target = 0
 * 输出：[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]
 */

/**
 * 四数之和
 * @param {number[]} nums
 * @param {number} target
 * @return {number[][]}
 */
function fourSum(nums, target) {
    // TODO: 实现四数之和算法
    console.log("四数之和算法待实现");
    return [];
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fourSum
    };
}