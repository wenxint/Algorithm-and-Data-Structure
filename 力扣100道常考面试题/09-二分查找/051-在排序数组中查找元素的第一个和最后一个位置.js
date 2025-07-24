/**
 * LeetCode 34. 在排序数组中查找元素的第一个和最后一个位置
 *
 * 问题描述：
 * 给你一个按照非递减顺序排列的整数数组 nums，和一个目标值 target。
 * 请你找出给定目标值在数组中的开始位置和结束位置。
 * 如果数组中不存在目标值 target，返回 [-1, -1]。
 *
 * 你必须设计并实现时间复杂度为 O(log n) 的算法解决此问题。
 *
 * 核心思想：
 * 使用二分查找算法分别找到目标值的左边界和右边界
 * - 左边界：第一个等于target的位置
 * - 右边界：最后一个等于target的位置
 *
 * 示例：
 * 输入: nums = [5,7,7,8,8,10], target = 8
 * 输出: [3,4]
 */

/**
 * 方法一：标准二分查找 - 分别查找左右边界
 *
 * 核心思想：
 * 使用两次二分查找：
 * 1. 查找左边界：找第一个 >= target 的位置
 * 2. 查找右边界：找最后一个 <= target 的位置
 *
 * 算法步骤：
 * 1. 使用二分查找找到左边界
 * 2. 使用二分查找找到右边界
 * 3. 验证边界的有效性
 *
 * @param {number[]} nums - 有序数组
 * @param {number} target - 目标值
 * @returns {number[]} [起始位置, 结束位置] 或 [-1, -1]
 * @time O(log n) - 两次二分查找
 * @space O(1) - 只使用常数空间
 */
function searchRange(nums, target) {
    // 查找左边界
    const leftBound = findLeftBound(nums, target);

    // 如果没找到目标值
    if (leftBound === -1) {
        return [-1, -1];
    }

    // 查找右边界
    const rightBound = findRightBound(nums, target);

    return [leftBound, rightBound];
}

/**
 * 查找左边界（第一个等于target的位置）
 */
function findLeftBound(nums, target) {
    let left = 0, right = nums.length - 1;
    let result = -1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        if (nums[mid] === target) {
            result = mid;           // 记录可能的答案
            right = mid - 1;        // 继续向左查找
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return result;
}

/**
 * 查找右边界（最后一个等于target的位置）
 */
function findRightBound(nums, target) {
    let left = 0, right = nums.length - 1;
    let result = -1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        if (nums[mid] === target) {
            result = mid;           // 记录可能的答案
            left = mid + 1;         // 继续向右查找
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return result;
}

/**
 * 方法二：优化的二分查找
 *
 * 核心思想：
 * 使用统一的二分查找模板，通过不同的条件来查找边界
 *
 * @param {number[]} nums - 有序数组
 * @param {number} target - 目标值
 * @returns {number[]} [起始位置, 结束位置] 或 [-1, -1]
 * @time O(log n) - 两次二分查找
 * @space O(1) - 只使用常数空间
 */
function searchRangeOptimized(nums, target) {
    // 查找第一个 >= target 的位置
    const left = binarySearchLeft(nums, target);

    // 如果没找到或者找到的位置不是target
    if (left === nums.length || nums[left] !== target) {
        return [-1, -1];
    }

    // 查找第一个 > target 的位置，然后减1得到最后一个 = target 的位置
    const right = binarySearchLeft(nums, target + 1) - 1;

    return [left, right];
}

/**
 * 查找第一个 >= target 的位置
 */
function binarySearchLeft(nums, target) {
    let left = 0, right = nums.length;

    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }

    return left;
}

// ===========================================
// 测试用例
// ===========================================

/**
 * 测试函数
 */
function runTests() {
    console.log("=".repeat(50));
    console.log("搜索范围算法测试");
    console.log("=".repeat(50));

    const testCases = [
        { nums: [5,7,7,8,8,10], target: 8, expected: [3,4] },
        { nums: [5,7,7,8,8,10], target: 6, expected: [-1,-1] },
        { nums: [], target: 0, expected: [-1,-1] },
        { nums: [1], target: 1, expected: [0,0] },
        { nums: [2,2], target: 2, expected: [0,1] },
        { nums: [1,1,1,1,1], target: 1, expected: [0,4] },
        { nums: [1,2,3,4,5], target: 3, expected: [2,2] }
    ];

    testCases.forEach((testCase, index) => {
        console.log(`\n--- 测试用例 ${index + 1} ---`);
        console.log(`输入: nums = [${testCase.nums.join(', ')}], target = ${testCase.target}`);
        console.log(`期望: [${testCase.expected.join(', ')}]`);

        // 测试方法一
        const result1 = searchRange([...testCase.nums], testCase.target);
        console.log(`方法一结果: [${result1.join(', ')}] ${JSON.stringify(result1) === JSON.stringify(testCase.expected) ? '✅' : '❌'}`);

        // 测试方法二
        const result2 = searchRangeOptimized([...testCase.nums], testCase.target);
        console.log(`方法二结果: [${result2.join(', ')}] ${JSON.stringify(result2) === JSON.stringify(testCase.expected) ? '✅' : '❌'}`);
    });
}

// ===========================================
// 面试要点
// ===========================================

/**
 * 面试关键点总结
 */
function interviewKeyPoints() {
    console.log("\n" + "=".repeat(50));
    console.log("面试关键点");
    console.log("=".repeat(50));

    console.log("\n🎯 核心概念:");
    console.log("1. 题目要求O(log n)时间复杂度，必须使用二分查找");
    console.log("2. 关键是理解左边界和右边界的查找逻辑");
    console.log("3. 左边界：第一个等于target的位置");
    console.log("4. 右边界：最后一个等于target的位置");

    console.log("\n🔧 实现技巧:");
    console.log("1. 查找左边界：找到target后继续向左搜索");
    console.log("2. 查找右边界：找到target后继续向右搜索");
    console.log("3. 统一模板：查找第一个>=target和第一个>target的位置");
    console.log("4. 边界处理：注意数组越界和target不存在的情况");

    console.log("\n❗ 常见陷阱:");
    console.log("1. 边界条件：空数组、单元素数组");
    console.log("2. 循环终止条件：left <= right vs left < right");
    console.log("3. 中点计算：避免整数溢出");
    console.log("4. 返回值检查：确保找到的位置确实是target");
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        searchRange,
        searchRangeOptimized,
        findLeftBound,
        findRightBound,
        binarySearchLeft,
        runTests,
        interviewKeyPoints
    };
}

// 如果在浏览器环境中，运行演示
if (typeof window !== 'undefined') {
    runTests();
    interviewKeyPoints();
}