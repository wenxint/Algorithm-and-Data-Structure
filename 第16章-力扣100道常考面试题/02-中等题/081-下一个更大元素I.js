/**
 * LeetCode 496. 下一个更大元素 I
 *
 * 问题描述：
 * nums1 中数字 x 的 下一个更大元素 是指 x 在 nums2 中对应位置 右侧 的 第一个 比 x 大的元素。
 * 给你两个 没有重复元素 的数组 nums1 和 nums2 ，下标从 0 开始计数，
 * 其中nums1 是 nums2 的子集。
 *
 * 核心思想：
 * 单调栈 + 哈希表：先用单调栈找出nums2中每个元素的下一个更大元素
 *
 * 示例：
 * 输入：nums1 = [4,1,2], nums2 = [1,3,4,2]
 * 输出：[-1,3,-1]
 */

/**
 * 下一个更大元素 I
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
function nextGreaterElement(nums1, nums2) {
    // TODO: 实现下一个更大元素I算法
    console.log("下一个更大元素I算法待实现");
    return [];
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        nextGreaterElement
    };
}