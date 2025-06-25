/**
 * 第1章：数组与字符串 - 算法实现
 *
 * 本文件包含数组和字符串的经典算法实现
 * 重点关注双指针、滑动窗口、前缀和等核心技巧
 *
 * @author Algorithm & Data Structure Guide
 */

// ==================== 双指针算法 ====================

/**
 * 反转数组（双指针）
 *
 * 核心思想：
 * 使用两个指针分别指向数组的头部和尾部，然后向中间移动，
 * 每次移动都交换两个指针所指向的元素，直到两个指针相遇。
 * 这样可以在O(1)的空间复杂度下完成数组反转。
 *
 * 算法步骤：
 * 1. 设置左指针指向数组开头，右指针指向数组末尾
 * 2. 当左指针小于右指针时，交换两个位置的元素
 * 3. 左指针右移，右指针左移
 * 4. 重复直到两指针相遇
 *
 * @param {any[]} arr - 待反转数组
 * @returns {any[]} 反转后的数组
 * @time O(n) - 需要遍历数组的一半
 * @space O(1) - 只使用常数额外空间
 */
function reverseArray(arr) {
    // 边界检查：空数组或单元素数组直接返回
    if (!arr || arr.length <= 1) return arr;

    let left = 0;                    // 左指针，从数组开头开始
    let right = arr.length - 1;      // 右指针，从数组末尾开始

    // 当左指针小于右指针时继续交换
    while (left < right) {
        // 交换左右指针指向的元素（使用ES6解构赋值）
        [arr[left], arr[right]] = [arr[right], arr[left]];

        left++;    // 左指针向右移动
        right--;   // 右指针向左移动
    }

    return arr;
}

// 测试用例
console.log('反转数组 [1,2,3,4,5]:', reverseArray([1,2,3,4,5])); // 预期输出: [5,4,3,2,1]


/**
 * 移除数组中的指定元素（快慢指针）
 *
 * 核心思想：
 * 使用快慢指针技术，慢指针指向下一个有效元素应该放置的位置，
 * 快指针遍历整个数组。当快指针遇到非目标元素时，就将其
 * 复制到慢指针的位置，这样可以原地移除元素。
 *
 * 算法步骤：
 * 1. 慢指针slow指向结果数组的下一个位置
 * 2. 快指针fast遍历整个数组
 * 3. 当fast指向的元素不等于目标值时，复制到slow位置
 * 4. slow指针前进，继续处理下一个位置
 *
 * @param {number[]} nums - 输入数组
 * @param {number} val - 要移除的值
 * @returns {number} 新数组长度
 * @time O(n) - 需要遍历整个数组一次
 * @space O(1) - 原地修改，只使用常数额外空间
 */
function removeElement(nums, val) {
    let slow = 0; // 慢指针：指向下一个有效元素的位置

    // 快指针遍历整个数组
    for (let fast = 0; fast < nums.length; fast++) {
        // 如果当前元素不是要移除的值
        if (nums[fast] !== val) {
            nums[slow] = nums[fast];  // 将有效元素复制到慢指针位置
            slow++;                   // 慢指针前进
        }
        // 如果是要移除的值，快指针继续前进，慢指针不动
    }

    return slow; // 返回新数组的长度
}

// 测试用例
console.log('移除元素3后数组长度:', removeElement([3,2,2,3], 3)); // 预期输出: 2


/**
 * 合并两个有序数组
 *
 * 核心思想：
 * 由于nums1有足够的空间存储合并结果，我们从后往前合并，
 * 这样可以避免覆盖nums1中还未处理的元素。比较两个数组
 * 末尾的元素，将较大的放到合并数组的末尾。
 *
 * 算法步骤：
 * 1. 设置三个指针：i指向nums1有效元素末尾，j指向nums2末尾，k指向合并结果末尾
 * 2. 比较nums1[i]和nums2[j]，将较大者放到nums1[k]
 * 3. 移动对应的指针
 * 4. 重复直到某个数组处理完
 * 5. 将剩余元素复制到结果数组
 *
 * @param {number[]} nums1 - 第一个有序数组
 * @param {number} m - nums1中有效元素个数
 * @param {number[]} nums2 - 第二个有序数组
 * @param {number} n - nums2中有效元素个数
 * @time O(m + n) - 每个元素最多被访问一次
 * @space O(1) - 原地合并，不需要额外空间
 */
function merge(nums1, m, nums2, n) {
    let i = m - 1;         // nums1的最后一个有效元素索引
    let j = n - 1;         // nums2的最后一个元素索引
    let k = m + n - 1;     // 合并后数组的最后位置索引

    // 从后往前合并，避免覆盖nums1中未处理的元素
    while (i >= 0 && j >= 0) {
        if (nums1[i] > nums2[j]) {
            nums1[k] = nums1[i]; // nums1的元素更大，放到k位置
            i--;                 // i指针左移
        } else {
            nums1[k] = nums2[j]; // nums2的元素更大或相等，放到k位置
            j--;                 // j指针左移
        }
        k--; // k指针左移，准备下一个位置
    }

    // 如果nums2还有剩余元素，复制到nums1前面
    // （nums1的剩余元素已经在正确位置，无需移动）
    while (j >= 0) {
        nums1[k] = nums2[j];
        j--;
        k--;
    }
}

// 测试用例
const nums1 = [1,2,3,0,0,0];
merge(nums1, 3, [2,5,6], 3);
console.log('合并后数组 [1,2,3] 和 [2,5,6]:', nums1); // 预期输出: [1,2,2,3,5,6]


/**
 * 判断回文字符串（双指针）
 *
 * 核心思想：
 * 回文字符串的特点是从左往右读和从右往左读是一样的。
 * 使用双指针从两端向中间靠拢，逐一比较对应位置的字符，
 * 如果发现不匹配则不是回文，全部匹配则是回文。
 *
 * 算法步骤：
 * 1. 预处理字符串：移除非字母数字字符，转为小写
 * 2. 设置左右指针分别指向字符串两端
 * 3. 比较左右指针指向的字符是否相等
 * 4. 如果相等，两指针向中间移动；如果不等，返回false
 * 5. 当指针相遇时，说明是回文字符串
 *
 * @param {string} s - 输入字符串
 * @returns {boolean} 是否为回文
 * @time O(n) - 需要遍历字符串一次进行预处理，再遍历一半进行比较
 * @space O(n) - 需要存储预处理后的字符串
 */
function isPalindromeAdvanced(s) {
    // 预处理：移除非字母数字字符，转为小写
    // 这样可以忽略大小写和标点符号的影响
    const cleanStr = s.toLowerCase().replace(/[^a-z0-9]/g, '');

    let left = 0;                     // 左指针，从字符串开头开始
    let right = cleanStr.length - 1;  // 右指针，从字符串末尾开始

    // 双指针向中间靠拢
    while (left < right) {
        // 比较当前字符是否相等
        if (cleanStr[left] !== cleanStr[right]) {
            return false; // 发现不匹配，立即返回false
        }
        left++;  // 左指针右移
        right--; // 右指针左移
    }

    return true; // 所有字符都匹配，是回文字符串
}

// 测试用例
console.log('判断回文 "A man a plan a canal Panama":', isPalindromeAdvanced("A man a plan a canal Panama")); // 预期输出: true


// ==================== 滑动窗口算法 ====================

/**
 * 最小覆盖子串
 *
 * 核心思想：
 * 使用滑动窗口技术，维护一个可变大小的窗口。首先扩大窗口
 * 直到包含目标字符串的所有字符，然后收缩窗口以找到最小的
 * 覆盖子串。使用哈希表记录字符频次，避免重复统计。
 *
 * 算法步骤：
 * 1. 用哈希表need记录目标字符串t中各字符的需要数量
 * 2. 用哈希表window记录当前窗口中各字符的数量
 * 3. 扩大窗口：右指针右移，更新window
 * 4. 当窗口满足条件时，尝试收缩窗口：左指针右移
 * 5. 在收缩过程中记录最小的满足条件的窗口
 *
 * @param {string} s - 源字符串
 * @param {string} t - 目标字符串
 * @returns {string} 最小覆盖子串
 * @time O(|s| + |t|) - s和t各遍历一次
 * @space O(|s| + |t|) - 哈希表存储字符频次
 */
function minWindow(s, t) {
    // 边界检查
    if (!s || !t || s.length < t.length) return "";

    // 统计目标字符串中各字符的频次
    const need = new Map();
    for (const char of t) {
        need.set(char, (need.get(char) || 0) + 1);
    }

    const window = new Map();          // 记录当前窗口中字符频次
    let left = 0, right = 0;           // 窗口的左右边界
    let valid = 0;                     // 窗口中满足需要的字符种类数
    let start = 0, len = Infinity;     // 记录最小覆盖子串的起始位置和长度

    // 右指针扩大窗口
    while (right < s.length) {
        // 将右边界字符加入窗口
        const rightChar = s[right];
        right++; // 扩大窗口

        // 如果当前字符是需要的字符
        if (need.has(rightChar)) {
            window.set(rightChar, (window.get(rightChar) || 0) + 1);
            // 如果当前字符的频次达到需要的频次，valid加一
            if (window.get(rightChar) === need.get(rightChar)) {
                valid++;
            }
        }

        // 当窗口满足条件时，尝试收缩窗口
        while (valid === need.size) {
            // 更新最小覆盖子串
            if (right - left < len) {
                start = left;
                len = right - left;
            }

            // 将左边界字符移出窗口
            const leftChar = s[left];
            left++; // 收缩窗口

            // 如果移出的字符是需要的字符
            if (need.has(leftChar)) {
                // 如果移出后频次不足，valid减一
                if (window.get(leftChar) === need.get(leftChar)) {
                    valid--;
                }
                window.set(leftChar, window.get(leftChar) - 1);
            }
        }
    }

    // 返回最小覆盖子串，如果不存在则返回空字符串
    return len === Infinity ? "" : s.substr(start, len);
}

// 测试用例
console.log('最小覆盖子串 "ADOBECODEBANC", "ABC":', minWindow("ADOBECODEBANC", "ABC")); // 预期输出: "BANC"


/**
 * 长度最小的子数组（滑动窗口）
 *
 * 核心思想：
 * 使用滑动窗口维护一个动态大小的子数组，窗口内元素和大于等于目标值。
 * 右指针不断扩大窗口增加元素，当满足条件时左指针收缩窗口寻找最小长度。
 *
 * 算法步骤：
 * 1. 左指针从0开始，右指针遍历数组
 * 2. 右指针移动时将元素加入窗口（累加到sum）
 * 3. 当窗口和大于等于target时，记录当前长度
 * 4. 收缩左指针，尝试找到更小的满足条件的窗口
 * 5. 重复直到右指针到达数组末尾
 *
 * @param {number} target - 目标和
 * @param {number[]} nums - 正整数数组
 * @returns {number} 最小长度
 * @time O(n) - 每个元素最多被访问两次（左右指针各一次）
 * @space O(1) - 只使用常数额外空间
 */
function minSubArrayLen(target, nums) {
    let left = 0;              // 窗口左边界
    let sum = 0;               // 当前窗口元素和
    let minLen = Infinity;     // 记录最小长度

    // 右指针遍历数组，扩大窗口
    for (let right = 0; right < nums.length; right++) {
        sum += nums[right]; // 将右边界元素加入窗口

        // 当窗口和满足条件时，尝试收缩窗口
        while (sum >= target) {
            // 更新最小长度
            minLen = Math.min(minLen, right - left + 1);

            // 移出左边界元素，收缩窗口
            sum -= nums[left];
            left++;
        }
    }

    // 如果没找到满足条件的子数组，返回0
    return minLen === Infinity ? 0 : minLen;
}

// 测试用例
console.log('最小子数组长度 target=7, [2,3,1,2,4,3]:', minSubArrayLen(7, [2,3,1,2,4,3])); // 预期输出: 2


/**
 * 水果成篮（最多包含两种类型的最长子数组）
 *
 * 核心思想：
 * 这是一个变形的滑动窗口问题，要求找到最多包含两种不同元素的最长子数组。
 * 使用哈希表记录窗口中每种水果的数量，当种类超过2时收缩左边界。
 *
 * 算法步骤：
 * 1. 使用Map记录当前窗口中每种水果的数量
 * 2. 右指针扩大窗口，将新水果加入篮子
 * 3. 如果篮子中水果种类超过2种，收缩左边界
 * 4. 在每次移动后更新最大水果数量
 *
 * @param {number[]} fruits - 水果类型数组
 * @returns {number} 最大数量
 * @time O(n) - 每个元素最多被访问两次
 * @space O(1) - 哈希表最多存储3个元素
 */
function totalFruit(fruits) {
    const basket = new Map(); // 篮子，记录每种水果的数量
    let left = 0;             // 窗口左边界
    let maxFruits = 0;        // 记录最大水果数量

    // 右指针遍历所有水果
    for (let right = 0; right < fruits.length; right++) {
        // 将右边界的水果加入篮子
        const fruit = fruits[right];
        basket.set(fruit, (basket.get(fruit) || 0) + 1);

        // 如果篮子中超过2种水果，收缩左边界
        while (basket.size > 2) {
            // 移出左边界的水果
            const leftFruit = fruits[left];
            basket.set(leftFruit, basket.get(leftFruit) - 1);

            // 如果某种水果数量为0，从篮子中移除
            if (basket.get(leftFruit) === 0) {
                basket.delete(leftFruit);
            }
            left++; // 收缩窗口
        }

        // 更新最大水果数量
        maxFruits = Math.max(maxFruits, right - left + 1);
    }

    return maxFruits;
}

// 测试用例
console.log('水果成篮 [1,2,1,3,3,2,2]:', totalFruit([1,2,1,3,3,2,2])); // 预期输出: 4


// ==================== 前缀和算法 ====================

/**
 * 前缀和算法（修复版本）
 *
 * 核心思想：
 * 构建前缀和数组，使得任意区间的和查询从O(n)优化到O(1)。
 * 前缀和数组中每个位置存储从数组开头到当前位置的累积和。
 *
 * 算法步骤：
 * 1. 创建前缀和数组，长度比原数组多1（便于处理边界）
 * 2. 计算每个位置的前缀和：prefixSum[i] = prefixSum[i-1] + arr[i-1]
 * 3. 区间[left, right]的和 = prefixSum[right+1] - prefixSum[left]
 *
 * @param {number[]} arr - 原始数组
 * @returns {number[]} 前缀和数组
 * @time O(n) 构建前缀和数组
 * @space O(n) 额外的前缀和数组空间
 */
function buildPrefixSum(arr) {
    // 创建前缀和数组，长度为 arr.length + 1
    const prefixSum = new Array(arr.length + 1).fill(0);

    // 计算前缀和：prefixSum[i] 表示 arr[0] + arr[1] + ... + arr[i-1]
    for (let i = 0; i < arr.length; i++) {
        prefixSum[i + 1] = prefixSum[i] + arr[i];
    }

    return prefixSum;
}

// 测试用例
const testArr = [1, 2, 3, 4, 5];
const prefixSumArr = buildPrefixSum(testArr);
console.log('原数组:', testArr); // 预期输出: [1, 2, 3, 4, 5]
console.log('前缀和数组:', prefixSumArr); // 预期输出: [0, 1, 3, 6, 10, 15]


/**
 * 查询区间和（使用预构建的前缀和数组）
 *
 * @param {number[]} prefixSum - 前缀和数组
 * @param {number} left - 左边界（包含）
 * @param {number} right - 右边界（包含）
 * @returns {number} 区间[left, right]的和
 * @time O(1) 常数时间查询
 */
function rangeSum(prefixSum, left, right) {
    // 区间[left, right]的和 = prefixSum[right + 1] - prefixSum[left]
    return prefixSum[right + 1] - prefixSum[left];
}

// 测试用例
console.log('区间[1,3]的和:', rangeSum(prefixSumArr, 1, 3)); // 2+3+4 = 9


/**
 * 子数组和等于K的个数
 *
 * 核心思想：
 * 使用前缀和+哈希表的技巧。对于每个位置i，如果存在位置j使得
 * prefixSum[i] - prefixSum[j] = k，那么子数组[j+1, i]的和就等于k。
 * 转换为prefixSum[j] = prefixSum[i] - k，用哈希表快速查找。
 *
 * 算法步骤：
 * 1. 用哈希表记录每个前缀和出现的次数
 * 2. 遍历数组，计算当前前缀和
 * 3. 查找是否存在前缀和为(当前前缀和-k)的位置
 * 4. 更新当前前缀和的计数
 *
 * @param {number[]} nums - 整数数组
 * @param {number} k - 目标和
 * @returns {number} 子数组个数
 * @time O(n) - 遍历数组一次，哈希表操作O(1)
 * @space O(n) - 哈希表存储前缀和
 */
function subarraySum(nums, k) {
    const prefixSumMap = new Map(); // 记录前缀和出现的次数
    prefixSumMap.set(0, 1);         // 空前缀的和为0，出现1次

    let prefixSum = 0;  // 当前前缀和
    let count = 0;      // 满足条件的子数组个数

    for (const num of nums) {
        prefixSum += num; // 更新前缀和

        // 查找是否存在前缀和为 prefixSum - k 的位置
        // 如果存在，说明从那个位置到当前位置的子数组和为k
        if (prefixSumMap.has(prefixSum - k)) {
            count += prefixSumMap.get(prefixSum - k);
        }

        // 更新当前前缀和的出现次数
        prefixSumMap.set(prefixSum, (prefixSumMap.get(prefixSum) || 0) + 1);
    }

    return count;
}

// 测试用例
console.log('子数组和为k=2的个数 [1,1,1]:', subarraySum([1,1,1], 2)); // 预期输出: 2


/**
 * 二维区域和检索
 *
 * 核心思想：
 * 构建二维前缀和数组，每个位置存储从左上角(0,0)到当前位置的矩形区域和。
 * 查询任意矩形区域和时，使用容斥原理：总和 = 右下 - 左边 - 上边 + 左上角
 *
 * 算法步骤：
 * 1. 构建前缀和数组，prefixSum[i][j] = 从(0,0)到(i-1,j-1)的区域和
 * 2. 利用递推关系：prefixSum[i][j] = matrix[i-1][j-1] + prefixSum[i-1][j] + prefixSum[i][j-1] - prefixSum[i-1][j-1]
 * 3. 查询时使用容斥原理计算任意矩形区域和
 */
class NumMatrix {
    /**
     * @param {number[][]} matrix - 二维矩阵
     */
    constructor(matrix) {
        if (!matrix || !matrix.length || !matrix[0].length) return;

        const m = matrix.length;    // 矩阵行数
        const n = matrix[0].length; // 矩阵列数

        // 构建二维前缀和数组，大小为(m+1)×(n+1)，避免边界检查
        this.prefixSum = Array(m + 1).fill().map(() => Array(n + 1).fill(0));

        // 计算前缀和
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                // 当前位置的前缀和 = 当前元素 + 上方前缀和 + 左方前缀和 - 左上角前缀和
                this.prefixSum[i][j] = matrix[i-1][j-1]           // 当前元素
                    + this.prefixSum[i-1][j]      // 上方区域和
                    + this.prefixSum[i][j-1]      // 左方区域和
                    - this.prefixSum[i-1][j-1];   // 减去重复计算的左上角区域和
            }
        }
    }

    /**
     * 计算矩形区域内元素的和
     *
     * 核心思想：
     * 使用容斥原理计算矩形区域和。目标区域和等于：
     * 右下角前缀和 - 左边区域前缀和 - 上边区域前缀和 + 左上角区域前缀和
     *
     * @param {number} row1 - 左上角行索引
     * @param {number} col1 - 左上角列索引
     * @param {number} row2 - 右下角行索引
     * @param {number} col2 - 右下角列索引
     * @returns {number} 区域和
     * @time O(1) - 直接通过前缀和数组计算
     */
    sumRegion(row1, col1, row2, col2) {
        // 使用容斥原理计算矩形区域和
        return this.prefixSum[row2 + 1][col2 + 1]     // 右下角到(0,0)的区域和
            - this.prefixSum[row1][col2 + 1]          // 减去上边多余区域
            - this.prefixSum[row2 + 1][col1]          // 减去左边多余区域
            + this.prefixSum[row1][col1];             // 加回重复减去的左上角区域
    }
}

// 测试用例
const matrix = [[3, 0, 1], [5, 6, 3], [1, 2, 0]];
const numMatrix = new NumMatrix(matrix);
console.log('二维区域和 (0,0) 到 (2,2):', numMatrix.sumRegion(0, 0, 2, 2)); // 预期输出: 20


// ==================== 字符串匹配算法 ====================

/**
 * KMP字符串匹配算法
 *
 * 核心思想：
 * KMP算法的核心是避免不必要的回溯。通过预处理模式串构建next数组
 * （部分匹配表），记录模式串中每个位置的最长相等前后缀长度。
 * 当匹配失败时，利用next数组快速移动模式串指针。
 *
 * 算法步骤：
 * 1. 构建next数组：对于模式串的每个位置，计算最长相等前后缀长度
 * 2. 主匹配过程：遍历主串，当字符不匹配时使用next数组跳转
 * 3. 如果模式串完全匹配，返回匹配位置
 *
 * @param {string} haystack - 主串
 * @param {string} needle - 模式串
 * @returns {number} 第一次匹配的位置，未找到返回-1
 * @time O(m + n) - m为主串长度，n为模式串长度
 * @space O(m) - next数组的空间
 */
function strStr(haystack, needle) {
    if (!needle) return 0; // 空模式串匹配任何位置

    /**
     * 构建next数组（部分匹配表）
     * next[i]表示模式串前i+1个字符的最长相等前后缀长度
     */
    function buildNext(pattern) {
        const next = new Array(pattern.length).fill(0);
        let j = 0; // 前缀指针

        // 从第二个字符开始计算
        for (let i = 1; i < pattern.length; i++) {
            // 当字符不匹配时，回退到next[j-1]
            while (j > 0 && pattern[i] !== pattern[j]) {
                j = next[j - 1];
            }

            // 如果字符匹配，前缀长度加1
            if (pattern[i] === pattern[j]) {
                j++;
            }

            next[i] = j; // 记录当前位置的最长前缀长度
        }

        return next;
    }

    const next = buildNext(needle);
    let j = 0; // 模式串指针

    // 遍历主串进行匹配
    for (let i = 0; i < haystack.length; i++) {
        // 当字符不匹配时，使用next数组跳转
        while (j > 0 && haystack[i] !== needle[j]) {
            j = next[j - 1];
        }

        // 如果字符匹配，模式串指针前进
        if (haystack[i] === needle[j]) {
            j++;
        }

        // 如果模式串完全匹配，返回匹配位置
        if (j === needle.length) {
            return i - j + 1;
        }
    }

    return -1; // 未找到匹配
}

// 测试用例
console.log('Rabin-Karp查找 "world" 在 "hello world" 中的位置:', strStrRabinKarp("hello world", "world")); // 预期输出: 6


// 测试用例
console.log('KMP查找 "hello" 在 "hello world" 中的位置:', strStr("hello world", "hello")); // 预期输出: 0


/**
 * Rabin-Karp字符串匹配算法
 *
 * 核心思想：
 * 使用滚动哈希技术，为模式串和主串的每个长度为m的子串计算哈希值。
 * 通过比较哈希值快速排除不可能的匹配，只有哈希值相等时才进行字符比较。
 * 滚动哈希可以在O(1)时间内更新窗口哈希值。
 *
 * 算法步骤：
 * 1. 计算模式串和主串第一个窗口的哈希值
 * 2. 滑动窗口，使用滚动哈希技术更新窗口哈希值
 * 3. 比较哈希值，相等时进行字符串比较确认
 * 4. 继续滑动直到找到匹配或到达主串末尾
 *
 * @param {string} haystack - 主串
 * @param {string} needle - 模式串
 * @returns {number} 第一次匹配的位置
 * @time O(mn) 最坏情况，平均O(n+m) - n为主串长度，m为模式串长度
 * @space O(1) - 只使用常数额外空间
 */
function strStrRabinKarp(haystack, needle) {
    if (!needle) return 0;
    if (needle.length > haystack.length) return -1;

    const base = 256;   // 字符集大小
    const mod = 101;    // 质数模数，避免哈希冲突

    let needleHash = 0; // 模式串哈希值
    let windowHash = 0; // 当前窗口哈希值
    let h = 1;          // base^(m-1) % mod

    // 计算h = base^(m-1) % mod，用于滚动哈希
    for (let i = 0; i < needle.length - 1; i++) {
        h = (h * base) % mod;
    }

    // 计算模式串和第一个窗口的哈希值
    for (let i = 0; i < needle.length; i++) {
        needleHash = (base * needleHash + needle.charCodeAt(i)) % mod;
        windowHash = (base * windowHash + haystack.charCodeAt(i)) % mod;
    }

    // 滑动窗口检查每个位置
    for (let i = 0; i <= haystack.length - needle.length; i++) {
        // 如果哈希值匹配，进行字符比较确认
        if (needleHash === windowHash) {
            let j;
            for (j = 0; j < needle.length; j++) {
                if (haystack[i + j] !== needle[j]) break;
            }
            if (j === needle.length) return i; // 找到完全匹配
        }

        // 计算下一个窗口的哈希值（滚动哈希）
        if (i < haystack.length - needle.length) {
            // 移除左边字符，添加右边字符
            windowHash = (base * (windowHash - haystack.charCodeAt(i) * h)
                + haystack.charCodeAt(i + needle.length)) % mod;

            // 确保哈希值为正数
            if (windowHash < 0) windowHash += mod;
        }
    }

    return -1; // 未找到匹配
}

// ==================== 数组排列组合 ====================

/**
 * 下一个排列
 *
 * 核心思想：
 * 下一个排列是指字典序中下一个更大的排列。算法思路是：
 * 1. 从右向左找到第一个升序对
 * 2. 从右向左找到第一个比升序对左元素大的数
 * 3. 交换这两个数
 * 4. 将升序对右边的部分反转
 *
 * 算法步骤：
 * 1. 从右向左找第一个nums[i] < nums[i+1]的位置i
 * 2. 如果找不到，说明是最大排列，反转整个数组
 * 3. 从右向左找第一个nums[j] > nums[i]的位置j
 * 4. 交换nums[i]和nums[j]
 * 5. 反转i+1到末尾的部分
 *
 * @param {number[]} nums - 数组
 * @time O(n) - 最多遍历数组3次
 * @space O(1) - 原地修改
 */
function nextPermutation(nums) {
    let i = nums.length - 2;

    // 从右向左找到第一个升序对（nums[i] < nums[i+1]）
    while (i >= 0 && nums[i] >= nums[i + 1]) {
        i--;
    }

    // 如果找到了升序对
    if (i >= 0) {
        let j = nums.length - 1;
        // 从右向左找到第一个大于nums[i]的数
        while (j >= 0 && nums[j] <= nums[i]) {
            j--;
        }
        // 交换nums[i]和nums[j]
        [nums[i], nums[j]] = [nums[j], nums[i]];
    }

    // 反转i+1之后的部分，得到最小的排列
    let left = i + 1, right = nums.length - 1;
    while (left < right) {
        [nums[left], nums[right]] = [nums[right], nums[left]];
        left++;
        right--;
    }
}

// 测试用例
const nums = [1,2,3];
nextPermutation(nums);
console.log('下一个排列 [1,2,3]:', nums); // 预期输出: [1,3,2]


/**
 * 旋转数组
 *
 * 核心思想：
 * 数组向右旋转k步等价于：将数组分为两部分，后k个元素移到前面。
 * 使用三次反转来实现：
 * 1. 反转整个数组
 * 2. 反转前k个元素
 * 3. 反转后n-k个元素
 *
 * 算法步骤：
 * 1. k对数组长度取模，处理k大于数组长度的情况
 * 2. 反转整个数组
 * 3. 反转前k个元素
 * 4. 反转剩余的n-k个元素
 *
 * @param {number[]} nums - 数组
 * @param {number} k - 旋转步数
 * @time O(n) - 每个元素被反转常数次
 * @space O(1) - 原地操作
 */
function rotate(nums, k) {
    k = k % nums.length; // 处理k大于数组长度的情况

    // 辅助函数：反转数组指定范围
    function reverse(arr, start, end) {
        while (start < end) {
            [arr[start], arr[end]] = [arr[end], arr[start]];
            start++;
            end--;
        }
    }

    // 三次反转实现旋转
    reverse(nums, 0, nums.length - 1);  // 反转整个数组
    reverse(nums, 0, k - 1);            // 反转前k个元素
    reverse(nums, k, nums.length - 1);  // 反转后n-k个元素
}

// 测试用例
const rotateNums = [1,2,3,4,5,6,7];
rotate(rotateNums, 3);
console.log('旋转数组 [1,2,3,4,5,6,7] 3步:', rotateNums); // 预期输出: [5,6,7,1,2,3,4]


// ==================== 测试用例 ====================

console.log('=== 算法实现测试 ===');

// 测试双指针算法


// 测试滑动窗口算法
console.log('\n--- 滑动窗口算法测试 ---');

// 测试前缀和算法
console.log('\n--- 前缀和算法测试 ---');


// 导出所有函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        reverseArray,
        removeElement,
        merge,
        isPalindromeAdvanced,
        minWindow,
        minSubArrayLen,
        totalFruit,
        buildPrefixSum,
        rangeSum,
        subarraySum,
        NumMatrix,
        strStr,
        strStrRabinKarp,
        nextPermutation,
        rotate
    };
}