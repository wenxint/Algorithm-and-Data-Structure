/**
 * LeetCode 128. 最长连续序列
 *
 * 问题描述：
 * 给定一个未排序的整数数组 nums ，找出数字连续的最长序列（不要求序列元素在原数组中连续）的长度。
 * 请你设计并实现时间复杂度为 O(n) 的算法解决此问题。
 *
 * 核心思想：
 * 哈希表：将数组转为集合，只从序列起点开始计算长度
 *
 * 示例：
 * 输入：nums = [100,4,200,1,3,2]
 * 输出：4
 */

/**
 * 最长连续序列
 * @param {number[]} nums
 * @return {number}
 */
function longestConsecutive(nums) {
    // TODO: 实现最长连续序列算法
    console.log("最长连续序列算法待实现");
    return 0;
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        longestConsecutive
    };
}