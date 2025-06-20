/**
 * 第1章：数组与字符串 - 练习题解答
 *
 * 本文件包含第1章练习题的完整解答
 * 每道题提供多种解法和详细注释
 *
 * @author 数据结构与算法教程
 * @date 2024
 */

// ===== 简单题解答 =====

/**
 * 题目1：合并两个有序数组
 *
 * 核心思想：双指针从后往前合并
 * 利用nums1末尾的空余空间，避免覆盖已有元素
 *
 * @param {number[]} nums1 - 第一个有序数组，长度为m+n
 * @param {number} m - nums1中有效元素个数
 * @param {number[]} nums2 - 第二个有序数组，长度为n
 * @param {number} n - nums2中元素个数
 * @returns {void} 原地修改nums1
 * @time O(m + n) 每个元素只被处理一次
 * @space O(1) 只使用常量额外空间
 */
function merge(nums1, m, nums2, n) {
    // 从后往前的三个指针
    let i = m - 1;      // nums1有效元素的最后位置
    let j = n - 1;      // nums2的最后位置
    let k = m + n - 1;  // 合并后数组的最后位置

    // 从后往前比较并放置元素
    while (i >= 0 && j >= 0) {
        if (nums1[i] > nums2[j]) {
            nums1[k] = nums1[i];
            i--;
        } else {
            nums1[k] = nums2[j];
            j--;
        }
        k--;
    }

    // 如果nums2还有剩余元素，复制到nums1
    while (j >= 0) {
        nums1[k] = nums2[j];
        j--;
        k--;
    }

    // 如果nums1有剩余，它们已经在正确位置，无需处理
}

/**
 * 题目2：移动零
 *
 * 核心思想：快慢指针
 * slow指针指向下一个非零元素应该放置的位置
 * fast指针遍历数组寻找非零元素
 *
 * @param {number[]} nums - 整数数组
 * @returns {void} 原地修改数组
 * @time O(n) 遍历数组一次
 * @space O(1) 只使用常量额外空间
 */
function moveZeroes(nums) {
    let slow = 0; // 慢指针，指向下一个非零元素的位置

    // 快指针遍历数组
    for (let fast = 0; fast < nums.length; fast++) {
        if (nums[fast] !== 0) {
            // 找到非零元素，与slow位置交换
            if (slow !== fast) {
                [nums[slow], nums[fast]] = [nums[fast], nums[slow]];
            }
            slow++;
        }
    }
}

/**
 * 移动零的优化版本：减少不必要的交换
 */
function moveZeroesOptimized(nums) {
    let writeIndex = 0;

    // 第一遍：将所有非零元素移到前面
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] !== 0) {
            nums[writeIndex] = nums[i];
            writeIndex++;
        }
    }

    // 第二遍：将剩余位置填充为0
    for (let i = writeIndex; i < nums.length; i++) {
        nums[i] = 0;
    }
}

// ===== 中等题解答 =====

/**
 * 题目3：无重复字符的最长子串
 *
 * 核心思想：滑动窗口 + 哈希表
 * 使用哈希表记录字符最后出现的位置
 * 遇到重复字符时，调整窗口左边界
 *
 * @param {string} s - 输入字符串
 * @returns {number} 最长无重复子串的长度
 * @time O(n) 每个字符最多被访问两次
 * @space O(min(m,n)) m为字符集大小，n为字符串长度
 */
function lengthOfLongestSubstring(s) {
    const charMap = new Map(); // 字符 -> 最后出现位置
    let left = 0;              // 窗口左边界
    let maxLength = 0;         // 最大长度

    for (let right = 0; right < s.length; right++) {
        const char = s[right];

        // 如果字符已存在且在当前窗口内
        if (charMap.has(char) && charMap.get(char) >= left) {
            // 调整左边界到重复字符的下一个位置
            left = charMap.get(char) + 1;
        }

        // 更新字符位置
        charMap.set(char, right);

        // 更新最大长度
        maxLength = Math.max(maxLength, right - left + 1);
    }

    return maxLength;
}

/**
 * 使用数组优化的版本（仅适用于ASCII字符）
 */
function lengthOfLongestSubstringArray(s) {
    const charIndex = new Array(128).fill(-1); // ASCII字符索引
    let left = 0;
    let maxLength = 0;

    for (let right = 0; right < s.length; right++) {
        const charCode = s.charCodeAt(right);

        // 如果字符在当前窗口内出现过
        if (charIndex[charCode] >= left) {
            left = charIndex[charCode] + 1;
        }

        charIndex[charCode] = right;
        maxLength = Math.max(maxLength, right - left + 1);
    }

    return maxLength;
}

/**
 * 题目4：长度最小的子数组
 *
 * 核心思想：滑动窗口
 * 右指针扩大窗口直到满足条件
 * 左指针收缩窗口寻找最小长度
 *
 * @param {number} target - 目标和
 * @param {number[]} nums - 正整数数组
 * @returns {number} 满足条件的最小子数组长度，不存在返回0
 * @time O(n) 每个元素最多被访问两次
 * @space O(1) 只使用常量额外空间
 */
function minSubArrayLen(target, nums) {
    let left = 0;           // 窗口左边界
    let sum = 0;            // 当前窗口和
    let minLength = Infinity; // 最小长度

    for (let right = 0; right < nums.length; right++) {
        // 扩大窗口
        sum += nums[right];

        // 收缩窗口：当前和大于等于目标值时
        while (sum >= target) {
            // 更新最小长度
            minLength = Math.min(minLength, right - left + 1);

            // 移除左边元素，收缩窗口
            sum -= nums[left];
            left++;
        }
    }

    return minLength === Infinity ? 0 : minLength;
}

/**
 * 二分查找 + 前缀和的解法（时间复杂度O(n log n)）
 */
function minSubArrayLenBinary(target, nums) {
    const n = nums.length;
    const prefixSum = new Array(n + 1).fill(0);

    // 构建前缀和数组
    for (let i = 0; i < n; i++) {
        prefixSum[i + 1] = prefixSum[i] + nums[i];
    }

    let minLength = Infinity;

    for (let i = 0; i < n; i++) {
        // 二分查找第一个满足条件的位置
        const targetSum = target + prefixSum[i];
        const bound = binarySearch(prefixSum, targetSum);

        if (bound !== -1) {
            minLength = Math.min(minLength, bound - i);
        }
    }

    return minLength === Infinity ? 0 : minLength;
}

function binarySearch(arr, target) {
    let left = 0, right = arr.length - 1;
    let result = -1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] >= target) {
            result = mid;
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }

    return result;
}

// ===== 困难题解答 =====

/**
 * 题目5：最小覆盖子串
 *
 * 核心思想：滑动窗口 + 字符频次匹配
 * 先扩大窗口直到包含所有字符
 * 再收缩窗口寻找最小覆盖子串
 *
 * @param {string} s - 源字符串
 * @param {string} t - 目标字符串
 * @returns {string} 最小覆盖子串，不存在返回空字符串
 * @time O(|s| + |t|) 每个字符最多被访问两次
 * @space O(|s| + |t|) 哈希表存储字符频次
 */
function minWindow(s, t) {
    if (s.length < t.length) return "";

    // 统计目标字符串的字符频次
    const need = new Map();
    for (const char of t) {
        need.set(char, (need.get(char) || 0) + 1);
    }

    const window = new Map(); // 当前窗口的字符频次
    let left = 0;             // 窗口左边界
    let valid = 0;            // 已满足条件的字符种类数
    let start = 0;            // 最小覆盖子串的起始位置
    let len = Infinity;       // 最小覆盖子串的长度

    for (let right = 0; right < s.length; right++) {
        const rightChar = s[right];

        // 扩大窗口
        if (need.has(rightChar)) {
            window.set(rightChar, (window.get(rightChar) || 0) + 1);

            // 如果当前字符的频次满足要求
            if (window.get(rightChar) === need.get(rightChar)) {
                valid++;
            }
        }

        // 收缩窗口：当窗口已包含所有必需字符时
        while (valid === need.size) {
            // 更新最小覆盖子串
            if (right - left + 1 < len) {
                start = left;
                len = right - left + 1;
            }

            const leftChar = s[left];

            // 收缩窗口
            if (need.has(leftChar)) {
                // 如果移除后不满足条件
                if (window.get(leftChar) === need.get(leftChar)) {
                    valid--;
                }
                window.set(leftChar, window.get(leftChar) - 1);
            }

            left++;
        }
    }

    return len === Infinity ? "" : s.substr(start, len);
}

/**
 * 使用数组优化的版本（仅适用于ASCII字符）
 */
function minWindowArray(s, t) {
    if (s.length < t.length) return "";

    const need = new Array(128).fill(0);  // 需要的字符频次
    const window = new Array(128).fill(0); // 窗口中的字符频次
    let needCount = 0; // 需要的不同字符数量

    // 统计目标字符频次
    for (const char of t) {
        if (need[char.charCodeAt(0)] === 0) {
            needCount++;
        }
        need[char.charCodeAt(0)]++;
    }

    let left = 0, valid = 0;
    let start = 0, len = Infinity;

    for (let right = 0; right < s.length; right++) {
        const rightCode = s.charCodeAt(right);

        if (need[rightCode] > 0) {
            window[rightCode]++;
            if (window[rightCode] === need[rightCode]) {
                valid++;
            }
        }

        while (valid === needCount) {
            if (right - left + 1 < len) {
                start = left;
                len = right - left + 1;
            }

            const leftCode = s.charCodeAt(left);
            if (need[leftCode] > 0) {
                if (window[leftCode] === need[leftCode]) {
                    valid--;
                }
                window[leftCode]--;
            }
            left++;
        }
    }

    return len === Infinity ? "" : s.substr(start, len);
}

// ===== 测试用例 =====

// 测试题目1：合并两个有序数组
console.log("=== 测试题目1：合并两个有序数组 ===");
let nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3;
merge(nums1, m, nums2, n);
console.log("合并结果:", nums1); // [1,2,2,3,5,6]

// 测试题目2：移动零
console.log("\n=== 测试题目2：移动零 ===");
let arr1 = [0,1,0,3,12];
moveZeroes(arr1);
console.log("移动零后:", arr1); // [1,3,12,0,0]

let arr2 = [0,1,0,3,12];
moveZeroesOptimized(arr2);
console.log("优化版本:", arr2); // [1,3,12,0,0]

// 测试题目3：无重复字符的最长子串
console.log("\n=== 测试题目3：无重复字符的最长子串 ===");
console.log("abcabcbb:", lengthOfLongestSubstring("abcabcbb")); // 3
console.log("bbbbb:", lengthOfLongestSubstring("bbbbb")); // 1
console.log("pwwkew:", lengthOfLongestSubstring("pwwkew")); // 3

// 测试题目4：长度最小的子数组
console.log("\n=== 测试题目4：长度最小的子数组 ===");
console.log("target=7, [2,3,1,2,4,3]:", minSubArrayLen(7, [2,3,1,2,4,3])); // 2
console.log("target=4, [1,4,4]:", minSubArrayLen(4, [1,4,4])); // 1
console.log("target=11, [1,1,1,1,1,1,1,1]:", minSubArrayLen(11, [1,1,1,1,1,1,1,1])); // 0

// 测试题目5：最小覆盖子串
console.log("\n=== 测试题目5：最小覆盖子串 ===");
console.log('s="ADOBECODEBANC", t="ABC":', minWindow("ADOBECODEBANC", "ABC")); // "BANC"
console.log('s="a", t="a":', minWindow("a", "a")); // "a"
console.log('s="a", t="aa":', minWindow("a", "aa")); // ""

// 导出所有函数供其他模块使用
module.exports = {
    merge,
    moveZeroes,
    moveZeroesOptimized,
    lengthOfLongestSubstring,
    lengthOfLongestSubstringArray,
    minSubArrayLen,
    minSubArrayLenBinary,
    minWindow,
    minWindowArray
};