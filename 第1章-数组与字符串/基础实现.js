/**
 * 第1章：数组与字符串 - 基础概念与核心思想
 *
 * 本文件详细讲解数组和字符串的核心概念，包含：
 * 1. 双指针技术的核心思想
 * 2. 滑动窗口技术的核心思想
 * 3. 前缀和技术的核心思想
 * 4. 每种技术的实际应用案例
 *
 * @author 数据结构与算法教程
 * @date 2024
 */

// ==================== 核心概念讲解 ====================

/**
 * 【核心概念一：双指针技术】
 *
 * 什么是双指针？
 * 双指针是一种编程技巧，使用两个指针在数组或链表中遍历，根据问题需要以不同速度或方向移动。
 *
 * 核心思想：
 * 1. 对撞指针：两个指针从数组两端向中间移动，用于查找配对、回文判断等
 * 2. 快慢指针：两个指针以不同速度移动，用于移除元素、查找环等
 * 3. 滑动窗口：双指针维护一个动态窗口，用于子数组/子串问题
 *
 * 适用场景：
 * - 数组中查找两个数的和
 * - 判断回文字符串
 * - 移除/移动数组元素
 * - 三数之和、四数之和等问题
 *
 * 时间复杂度：通常能将 O(n²) 优化到 O(n)
 */

/**
 * 双指针经典应用：对撞指针判断回文
 *
 * 核心思想：回文字符串从两端读取结果相同，使用两个指针分别从头尾开始，
 * 向中间移动并比较字符，如果所有对应位置字符都相等，则是回文。
 */
function isPalindrome(s) {
    // 预处理：保留字母数字，转小写
    const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');

    let left = 0;                      // 左指针，从头开始
    let right = cleaned.length - 1;    // 右指针，从尾开始

    // 双指针向中间移动
    while (left < right) {
        if (cleaned[left] !== cleaned[right]) {
            return false;  // 发现不匹配，不是回文
        }
        left++;   // 左指针右移
        right--;  // 右指针左移
    }

    return true;  // 全部匹配，是回文
}

/**
 * 双指针经典应用：快慢指针移除元素
 *
 * 核心思想：使用快慢指针原地移除指定元素，慢指针指向下一个有效位置，
 * 快指针遍历数组寻找有效元素，这样可以在不使用额外空间的情况下完成移除操作。
 */
function removeElement(nums, val) {
    let slow = 0;  // 慢指针：下一个有效元素的位置

    // 快指针遍历整个数组
    for (let fast = 0; fast < nums.length; fast++) {
        if (nums[fast] !== val) {
            nums[slow] = nums[fast];  // 复制有效元素
            slow++;                   // 慢指针前进
        }
    }

    return slow;  // 返回新数组长度
}

// ==================== 滑动窗口技术 ====================

/**
 * 【核心概念二：滑动窗口技术】
 *
 * 什么是滑动窗口？
 * 滑动窗口是双指针技术的特殊应用，维护一个固定或可变大小的窗口，
 * 通过移动窗口边界来解决连续子数组/子串的相关问题。
 *
 * 核心思想：
 * 1. 窗口扩大：右指针右移，将新元素加入窗口
 * 2. 窗口收缩：左指针右移，将元素移出窗口
 * 3. 窗口维护：在移动过程中维护窗口的某种性质
 *
 * 适用场景：
 * - 最长/最短子数组问题
 * - 子串匹配问题
 * - 固定/可变窗口大小的统计问题
 *
 * 时间复杂度：通常是 O(n)，每个元素最多被访问两次
 */

/**
 * 滑动窗口经典应用：无重复字符的最长子串
 *
 * 核心思想：使用哈希表记录字符最后出现位置，维护一个不包含重复字符的窗口。
 * 当遇到重复字符时，将左边界移动到重复字符的下一个位置。
 */
function lengthOfLongestSubstring(s) {
    const charIndex = new Map();  // 记录字符最后出现的位置
    let left = 0;                 // 窗口左边界
    let maxLength = 0;            // 最大长度

    for (let right = 0; right < s.length; right++) {
        const char = s[right];

        // 如果字符已存在且在当前窗口内
        if (charIndex.has(char) && charIndex.get(char) >= left) {
            left = charIndex.get(char) + 1;  // 移动左边界
        }

        charIndex.set(char, right);           // 更新字符位置
        maxLength = Math.max(maxLength, right - left + 1);  // 更新最大长度
    }

    return maxLength;
}

/**
 * 滑动窗口经典应用：最小子数组长度
 *
 * 核心思想：维护一个和大于等于目标值的最小窗口。右指针扩大窗口增加元素，
 * 当满足条件时左指针收缩窗口寻找最小长度。
 */
function minSubArrayLen(target, nums) {
    let left = 0;              // 窗口左边界
    let sum = 0;               // 当前窗口和
    let minLength = Infinity;  // 最小长度

    for (let right = 0; right < nums.length; right++) {
        sum += nums[right];  // 扩大窗口

        // 当窗口和满足条件时，尝试收缩窗口
        while (sum >= target) {
            minLength = Math.min(minLength, right - left + 1);
            sum -= nums[left];  // 收缩窗口
            left++;
        }
    }

    return minLength === Infinity ? 0 : minLength;
}

// ==================== 前缀和技术 ====================

/**
 * 【核心概念三：前缀和技术】
 *
 * 什么是前缀和？
 * 前缀和是一种预处理技术，用于快速计算数组任意区间的元素和。
 * prefixSum[i] 表示从数组开头到位置 i 的所有元素的累积和。
 *
 * 核心思想：
 * 1. 预处理：构建前缀和数组，prefixSum[i] = arr[0] + arr[1] + ... + arr[i]
 * 2. 区间查询：区间[left, right]的和 = prefixSum[right] - prefixSum[left-1]
 * 3. 优化：将 O(n) 的区间求和优化为 O(1)
 *
 * 数学原理：
 * - 前缀和递推关系：prefixSum[i] = prefixSum[i-1] + arr[i]
 * - 区间和计算：sum(left, right) = prefixSum[right] - prefixSum[left-1]
 *
 * 适用场景：
 * - 频繁的区间求和查询
 * - 子数组和相关问题
 * - 二维矩阵的区域求和
 *
 * 时间复杂度：预处理 O(n)，查询 O(1)
 */

/**
 * 一维前缀和的实现
 *
 * 核心思想：预先计算累积和，使得任意区间求和变成两次数组访问的差值运算。
 *
 * 举例说明：
 * 原数组：    [2, 1, 4, 3, 5]
 * 前缀和：    [2, 3, 7, 10, 15]
 * 区间[1,3]和: prefixSum[3] - prefixSum[0] = 10 - 2 = 8 (即1+4+3)
 */
class PrefixSum {
    /**
     * 构造函数：构建前缀和数组
     * @param {number[]} nums - 原始数组
     */
    constructor(nums) {
        this.prefixSum = [0];  // 前缀和数组，额外添加0便于计算

        // 构建前缀和：每个位置存储从开头到当前位置的累积和
        for (let i = 0; i < nums.length; i++) {
            this.prefixSum[i + 1] = this.prefixSum[i] + nums[i];
        }
    }

    /**
     * 查询区间 [left, right] 的元素和
     * @param {number} left - 左边界（包含）
     * @param {number} right - 右边界（包含）
     * @returns {number} 区间和
     */
    rangeSum(left, right) {
        // 区间和 = 右边界前缀和 - 左边界前面的前缀和
        return this.prefixSum[right + 1] - this.prefixSum[left];
    }
}

/**
 * 前缀和经典应用：子数组和等于K的个数
 *
 * 核心思想：使用前缀和 + 哈希表。对于每个位置i，如果存在前缀和为
 * (当前前缀和 - k) 的位置，说明从那个位置到当前位置的子数组和为k。
 *
 * 数学推导：
 * 设 prefixSum[i] 为位置i的前缀和，prefixSum[j] 为位置j的前缀和
 * 如果子数组 [j+1, i] 的和为 k，则：prefixSum[i] - prefixSum[j] = k
 * 即：prefixSum[j] = prefixSum[i] - k
 */
function subarraySum(nums, k) {
    const prefixSumCount = new Map();  // 记录每个前缀和出现的次数
    prefixSumCount.set(0, 1);          // 空数组的前缀和为0，出现1次

    let prefixSum = 0;  // 当前前缀和
    let count = 0;      // 满足条件的子数组个数

    for (const num of nums) {
        prefixSum += num;  // 更新前缀和

        // 查找是否存在前缀和为 (prefixSum - k) 的位置
        if (prefixSumCount.has(prefixSum - k)) {
            count += prefixSumCount.get(prefixSum - k);
        }

        // 更新当前前缀和的出现次数
        prefixSumCount.set(prefixSum, (prefixSumCount.get(prefixSum) || 0) + 1);
    }

    return count;
}

/**
 * 二维前缀和的实现
 *
 * 核心思想：扩展一维前缀和到二维矩阵，每个位置存储从左上角(0,0)到当前位置的
 * 矩形区域的元素和。使用容斥原理计算任意矩形区域的和。
 *
 * 容斥原理：
 * 区域和 = 右下角前缀和 - 左边区域前缀和 - 上边区域前缀和 + 左上角重叠区域前缀和
 */
class Matrix2DSum {
    /**
     * 构造函数：构建二维前缀和数组
     * @param {number[][]} matrix - 二维矩阵
     */
    constructor(matrix) {
        if (!matrix || !matrix.length || !matrix[0].length) return;

        const m = matrix.length;
        const n = matrix[0].length;

        // 创建 (m+1) × (n+1) 的前缀和数组，避免边界检查
        this.prefixSum = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));

        // 构建二维前缀和
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                this.prefixSum[i][j] = matrix[i-1][j-1]          // 当前元素
                    + this.prefixSum[i-1][j]      // 上方区域和
                    + this.prefixSum[i][j-1]      // 左方区域和
                    - this.prefixSum[i-1][j-1];   // 减去重复的左上角区域
            }
        }
    }

    /**
     * 计算矩形区域 (row1,col1) 到 (row2,col2) 的元素和
     * @param {number} row1 - 左上角行坐标
     * @param {number} col1 - 左上角列坐标
     * @param {number} row2 - 右下角行坐标
     * @param {number} col2 - 右下角列坐标
     * @returns {number} 矩形区域和
     */
    sumRegion(row1, col1, row2, col2) {
        // 使用容斥原理计算矩形区域和
        return this.prefixSum[row2 + 1][col2 + 1]
            - this.prefixSum[row1][col2 + 1]      // 减去上边多余部分
            - this.prefixSum[row2 + 1][col1]      // 减去左边多余部分
            + this.prefixSum[row1][col1];         // 加回重复减去的部分
    }
}

// ==================== 实际调用案例演示 ====================

console.log('=== 数组与字符串核心概念演示 ===\n');

// 1. 双指针技术演示
console.log('【双指针技术演示】');
console.log('判断 "A man a plan a canal Panama" 是否为回文:',
    isPalindrome("A man a plan a canal Panama"));

let testArray = [3, 2, 2, 3, 1, 4, 3];
console.log('原数组:', testArray);
console.log('移除元素3后的新长度:', removeElement([...testArray], 3));
console.log();

// 2. 滑动窗口技术演示
console.log('【滑动窗口技术演示】');
console.log('"abcabcbb" 中无重复字符的最长子串长度:',
    lengthOfLongestSubstring("abcabcbb"));
console.log('数组 [2,3,1,2,4,3] 中和≥7的最小子数组长度:',
    minSubArrayLen(7, [2,3,1,2,4,3]));
console.log();

// 3. 前缀和技术演示
console.log('【前缀和技术演示】');

// 一维前缀和演示
const nums = [2, 1, 4, 3, 5];
const prefixSumInstance = new PrefixSum(nums);
console.log('原数组:', nums);
console.log('区间 [1, 3] 的和:', prefixSumInstance.rangeSum(1, 3));  // 1+4+3 = 8
console.log('区间 [0, 4] 的和:', prefixSumInstance.rangeSum(0, 4));  // 2+1+4+3+5 = 15

// 子数组和为k的演示
console.log('数组 [1,1,1] 中和为2的子数组个数:', subarraySum([1,1,1], 2));

// 二维前缀和演示
const matrix = [
    [3, 0, 1, 4, 2],
    [5, 6, 3, 2, 1],
    [1, 2, 0, 1, 5],
    [4, 1, 0, 1, 7]
];
const matrix2D = new Matrix2DSum(matrix);
console.log('二维矩阵区域 (2,1) 到 (3,3) 的和:',
    matrix2D.sumRegion(2, 1, 3, 3));
console.log();

// 4. 性能对比演示
console.log('【性能优势演示】');
const largeArray = Array.from({length: 1000}, (_, i) => i + 1);

// 传统方法计算区间和（每次都遍历）
function traditionalRangeSum(arr, left, right) {
    let sum = 0;
    for (let i = left; i <= right; i++) {
        sum += arr[i];
    }
    return sum;
}

// 前缀和方法
const largePrefixSum = new PrefixSum(largeArray);

console.log('大数组长度:', largeArray.length);
console.log('传统方法计算区间[100,800]和:', traditionalRangeSum(largeArray, 100, 800));
console.log('前缀和方法计算区间[100,800]和:', largePrefixSum.rangeSum(100, 800));

// 导出所有类和函数
module.exports = {
    isPalindrome,
    removeElement,
    lengthOfLongestSubstring,
    minSubArrayLen,
    subarraySum,
    PrefixSum,
    Matrix2DSum
};