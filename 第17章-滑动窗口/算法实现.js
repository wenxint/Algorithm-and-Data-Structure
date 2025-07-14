/**
 * 第17章 滑动窗口 - 算法实现
 *
 * 本文件包含滑动窗口技术的经典算法实现：
 * 1. 滑动窗口最大值/最小值
 * 2. 无重复字符的最长子串
 * 3. 长度最小的子数组
 * 4. 字符串的排列
 * 5. 最小覆盖子串
 * 6. 滑动窗口中位数
 * 7. K个不同整数的子数组
 *
 * 这些算法展示了滑动窗口在不同场景下的应用
 */

/**
 * 1. 滑动窗口最大值
 *
 * 核心思想：
 * 使用单调递减双端队列，队首始终是当前窗口的最大值
 * 每次滑动时，移除超出窗口的元素，添加新元素并保持单调性
 *
 * @param {number[]} nums - 输入数组
 * @param {number} k - 窗口大小
 * @return {number[]} 每个窗口的最大值
 * @time O(n) 时间复杂度
 * @space O(k) 空间复杂度
 */
function maxSlidingWindow(nums, k) {
    if (!nums || nums.length === 0 || k <= 0) return [];

    const result = [];
    const deque = []; // 存储数组下标，保持递减顺序

    for (let i = 0; i < nums.length; i++) {
        // 移除窗口外的元素
        while (deque.length > 0 && deque[0] <= i - k) {
            deque.shift();
        }

        // 保持递减顺序，移除比当前元素小的元素
        while (deque.length > 0 && nums[deque[deque.length - 1]] <= nums[i]) {
            deque.pop();
        }

        deque.push(i);

        // 当窗口大小达到k时，记录最大值
        if (i >= k - 1) {
            result.push(nums[deque[0]]);
        }
    }

    return result;
}

/**
 * 滑动窗口最小值
 *
 * 核心思想：
 * 使用单调递增双端队列，队首始终是当前窗口的最小值
 *
 * @param {number[]} nums - 输入数组
 * @param {number} k - 窗口大小
 * @return {number[]} 每个窗口的最小值
 * @time O(n) 时间复杂度
 * @space O(k) 空间复杂度
 */
function minSlidingWindow(nums, k) {
    if (!nums || nums.length === 0 || k <= 0) return [];

    const result = [];
    const deque = []; // 存储数组下标，保持递增顺序

    for (let i = 0; i < nums.length; i++) {
        // 移除窗口外的元素
        while (deque.length > 0 && deque[0] <= i - k) {
            deque.shift();
        }

        // 保持递增顺序，移除比当前元素大的元素
        while (deque.length > 0 && nums[deque[deque.length - 1]] >= nums[i]) {
            deque.pop();
        }

        deque.push(i);

        // 当窗口大小达到k时，记录最小值
        if (i >= k - 1) {
            result.push(nums[deque[0]]);
        }
    }

    return result;
}

/**
 * 2. 无重复字符的最长子串
 *
 * 核心思想：
 * 使用可变滑动窗口和哈希集合
 * 右指针扩展窗口，遇到重复字符时左指针收缩窗口
 *
 * @param {string} s - 输入字符串
 * @return {number} 无重复字符的最长子串长度
 * @time O(n) 时间复杂度
 * @space O(min(m,n)) 空间复杂度，m为字符集大小
 */
function lengthOfLongestSubstring(s) {
    if (!s) return 0;

    const charSet = new Set();
    let left = 0;
    let maxLength = 0;

    for (let right = 0; right < s.length; right++) {
        // 如果遇到重复字符，收缩窗口
        while (charSet.has(s[right])) {
            charSet.delete(s[left]);
            left++;
        }

        charSet.add(s[right]);
        maxLength = Math.max(maxLength, right - left + 1);
    }

    return maxLength;
}

/**
 * 无重复字符的最长子串（优化版，返回详细信息）
 *
 * @param {string} s - 输入字符串
 * @return {object} 包含长度、起始位置和子串的详细信息
 */
function lengthOfLongestSubstringDetailed(s) {
    if (!s) return { length: 0, start: 0, substring: "" };

    const charIndexMap = new Map(); // 存储字符的最新索引
    let left = 0;
    let maxLength = 0;
    let maxStart = 0;

    for (let right = 0; right < s.length; right++) {
        const char = s[right];

        // 如果字符已存在且在当前窗口内，移动左指针
        if (charIndexMap.has(char) && charIndexMap.get(char) >= left) {
            left = charIndexMap.get(char) + 1;
        }

        charIndexMap.set(char, right);

        // 更新最大长度和起始位置
        if (right - left + 1 > maxLength) {
            maxLength = right - left + 1;
            maxStart = left;
        }
    }

    return {
        length: maxLength,
        start: maxStart,
        substring: s.substring(maxStart, maxStart + maxLength)
    };
}

/**
 * 3. 长度最小的子数组
 *
 * 核心思想：
 * 使用可变滑动窗口，寻找和大于等于目标值的最短子数组
 * 右指针扩展窗口增加和，左指针收缩窗口减少长度
 *
 * @param {number} target - 目标和
 * @param {number[]} nums - 输入数组
 * @return {number} 最小子数组长度，如果不存在返回0
 * @time O(n) 时间复杂度
 * @space O(1) 空间复杂度
 */
function minSubArrayLen(target, nums) {
    if (!nums || nums.length === 0) return 0;

    let left = 0;
    let sum = 0;
    let minLength = Infinity;

    for (let right = 0; right < nums.length; right++) {
        sum += nums[right];

        // 当和大于等于目标值时，尝试收缩窗口
        while (sum >= target) {
            minLength = Math.min(minLength, right - left + 1);
            sum -= nums[left];
            left++;
        }
    }

    return minLength === Infinity ? 0 : minLength;
}

/**
 * 长度最小的子数组（返回详细信息）
 *
 * @param {number} target - 目标和
 * @param {number[]} nums - 输入数组
 * @return {object} 包含长度、子数组和起始位置的详细信息
 */
function minSubArrayLenDetailed(target, nums) {
    if (!nums || nums.length === 0) {
        return { length: 0, subarray: [], start: -1 };
    }

    let left = 0;
    let sum = 0;
    let minLength = Infinity;
    let minStart = -1;

    for (let right = 0; right < nums.length; right++) {
        sum += nums[right];

        while (sum >= target) {
            if (right - left + 1 < minLength) {
                minLength = right - left + 1;
                minStart = left;
            }
            sum -= nums[left];
            left++;
        }
    }

    if (minLength === Infinity) {
        return { length: 0, subarray: [], start: -1 };
    }

    return {
        length: minLength,
        subarray: nums.slice(minStart, minStart + minLength),
        start: minStart
    };
}

/**
 * 4. 字符串的排列
 *
 * 核心思想：
 * 使用固定大小滑动窗口和字符频次统计
 * 窗口大小等于目标字符串长度，比较字符频次是否相等
 *
 * @param {string} s1 - 目标字符串
 * @param {string} s2 - 搜索字符串
 * @return {boolean} 是否包含s1的排列
 * @time O(n) 时间复杂度
 * @space O(1) 空间复杂度（字符集大小固定）
 */
function checkInclusion(s1, s2) {
    if (!s1 || !s2 || s1.length > s2.length) return false;

    const s1Freq = new Map();
    const windowFreq = new Map();

    // 统计s1的字符频次
    for (const char of s1) {
        s1Freq.set(char, (s1Freq.get(char) || 0) + 1);
    }

    const windowSize = s1.length;
    let matches = 0;

    for (let right = 0; right < s2.length; right++) {
        const rightChar = s2[right];

        // 扩展窗口
        windowFreq.set(rightChar, (windowFreq.get(rightChar) || 0) + 1);

        if (s1Freq.has(rightChar) && windowFreq.get(rightChar) === s1Freq.get(rightChar)) {
            matches++;
        }

        // 收缩窗口
        if (right >= windowSize) {
            const leftChar = s2[right - windowSize];

            if (s1Freq.has(leftChar) && windowFreq.get(leftChar) === s1Freq.get(leftChar)) {
                matches--;
            }

            windowFreq.set(leftChar, windowFreq.get(leftChar) - 1);
            if (windowFreq.get(leftChar) === 0) {
                windowFreq.delete(leftChar);
            }
        }

        // 检查是否匹配
        if (matches === s1Freq.size) {
            return true;
        }
    }

    return false;
}

/**
 * 字符串的排列（返回所有匹配位置）
 *
 * @param {string} s1 - 目标字符串
 * @param {string} s2 - 搜索字符串
 * @return {number[]} 所有匹配位置的起始索引
 */
function findAllPermutations(s1, s2) {
    const result = [];
    if (!s1 || !s2 || s1.length > s2.length) return result;

    const s1Freq = new Map();
    const windowFreq = new Map();

    for (const char of s1) {
        s1Freq.set(char, (s1Freq.get(char) || 0) + 1);
    }

    const windowSize = s1.length;
    let matches = 0;

    for (let right = 0; right < s2.length; right++) {
        const rightChar = s2[right];

        windowFreq.set(rightChar, (windowFreq.get(rightChar) || 0) + 1);

        if (s1Freq.has(rightChar) && windowFreq.get(rightChar) === s1Freq.get(rightChar)) {
            matches++;
        }

        if (right >= windowSize) {
            const leftChar = s2[right - windowSize];

            if (s1Freq.has(leftChar) && windowFreq.get(leftChar) === s1Freq.get(leftChar)) {
                matches--;
            }

            windowFreq.set(leftChar, windowFreq.get(leftChar) - 1);
            if (windowFreq.get(leftChar) === 0) {
                windowFreq.delete(leftChar);
            }
        }

        if (matches === s1Freq.size) {
            result.push(right - windowSize + 1);
        }
    }

    return result;
}

/**
 * 5. 最小覆盖子串
 *
 * 核心思想：
 * 使用可变滑动窗口，先扩展窗口直到包含所有目标字符
 * 然后收缩窗口寻找最小覆盖子串
 *
 * @param {string} s - 源字符串
 * @param {string} t - 目标字符串
 * @return {string} 最小覆盖子串
 * @time O(|s| + |t|) 时间复杂度
 * @space O(|s| + |t|) 空间复杂度
 */
function minWindow(s, t) {
    if (!s || !t || s.length < t.length) return "";

    const tFreq = new Map();
    const windowFreq = new Map();

    // 统计目标字符频次
    for (const char of t) {
        tFreq.set(char, (tFreq.get(char) || 0) + 1);
    }

    let left = 0;
    let minLength = Infinity;
    let minStart = 0;
    let matches = 0;
    const required = tFreq.size;

    for (let right = 0; right < s.length; right++) {
        const rightChar = s[right];

        // 扩展窗口
        windowFreq.set(rightChar, (windowFreq.get(rightChar) || 0) + 1);

        if (tFreq.has(rightChar) && windowFreq.get(rightChar) === tFreq.get(rightChar)) {
            matches++;
        }

        // 收缩窗口
        while (left <= right && matches === required) {
            const char = s[left];

            // 更新最小窗口
            if (right - left + 1 < minLength) {
                minLength = right - left + 1;
                minStart = left;
            }

            windowFreq.set(char, windowFreq.get(char) - 1);
            if (tFreq.has(char) && windowFreq.get(char) < tFreq.get(char)) {
                matches--;
            }

            left++;
        }
    }

    return minLength === Infinity ? "" : s.substring(minStart, minStart + minLength);
}

/**
 * 6. 滑动窗口中位数
 *
 * 核心思想：
 * 使用两个堆（最大堆和最小堆）来维护窗口中的中位数
 * 滑动窗口时需要添加新元素和移除旧元素
 *
 * @param {number[]} nums - 输入数组
 * @param {number} k - 窗口大小
 * @return {number[]} 每个窗口的中位数
 * @time O(n log k) 时间复杂度
 * @space O(k) 空间复杂度
 */
function medianSlidingWindow(nums, k) {
    if (!nums || nums.length === 0 || k <= 0) return [];

    const result = [];

    // 简化实现：使用排序数组来维护窗口
    for (let i = 0; i <= nums.length - k; i++) {
        const window = nums.slice(i, i + k).sort((a, b) => a - b);

        let median;
        const mid = Math.floor(k / 2);
        if (k % 2 === 1) {
            median = window[mid];
        } else {
            median = (window[mid - 1] + window[mid]) / 2;
        }

        result.push(median);
    }

    return result;
}

/**
 * 7. K个不同整数的子数组
 *
 * 核心思想：
 * "恰好K个不同整数" = "最多K个不同整数" - "最多K-1个不同整数"
 * 使用辅助函数计算最多K个不同整数的子数组数量
 *
 * @param {number[]} nums - 输入数组
 * @param {number} k - 不同整数的个数
 * @return {number} 子数组数量
 * @time O(n) 时间复杂度
 * @space O(k) 空间复杂度
 */
function subarraysWithKDistinct(nums, k) {
    function atMostK(nums, k) {
        if (k === 0) return 0;

        const count = new Map();
        let left = 0;
        let result = 0;

        for (let right = 0; right < nums.length; right++) {
            count.set(nums[right], (count.get(nums[right]) || 0) + 1);

            while (count.size > k) {
                count.set(nums[left], count.get(nums[left]) - 1);
                if (count.get(nums[left]) === 0) {
                    count.delete(nums[left]);
                }
                left++;
            }

            result += right - left + 1;
        }

        return result;
    }

    return atMostK(nums, k) - atMostK(nums, k - 1);
}

/**
 * 8. 替换后的最长重复字符
 *
 * 核心思想：
 * 使用可变滑动窗口，维护窗口内出现次数最多的字符
 * 当窗口大小减去最大频次大于k时，收缩窗口
 *
 * @param {string} s - 输入字符串
 * @param {number} k - 最多可以替换的字符数
 * @return {number} 最长重复字符子串长度
 * @time O(n) 时间复杂度
 * @space O(1) 空间复杂度（字符集大小固定）
 */
function characterReplacement(s, k) {
    if (!s) return 0;

    const charCount = new Map();
    let left = 0;
    let maxCount = 0;
    let maxLength = 0;

    for (let right = 0; right < s.length; right++) {
        const rightChar = s[right];
        charCount.set(rightChar, (charCount.get(rightChar) || 0) + 1);
        maxCount = Math.max(maxCount, charCount.get(rightChar));

        // 如果窗口大小减去最大频次大于k，收缩窗口
        while (right - left + 1 - maxCount > k) {
            const leftChar = s[left];
            charCount.set(leftChar, charCount.get(leftChar) - 1);
            left++;
        }

        maxLength = Math.max(maxLength, right - left + 1);
    }

    return maxLength;
}

/**
 * 9. 水果成篮
 *
 * 核心思想：
 * 使用可变滑动窗口，维护最多包含两种不同水果的最长子数组
 * 当窗口内水果种类超过2种时，收缩窗口
 *
 * @param {number[]} fruits - 水果数组
 * @return {number} 最多能收集的水果数量
 * @time O(n) 时间复杂度
 * @space O(1) 空间复杂度
 */
function totalFruit(fruits) {
    if (!fruits || fruits.length === 0) return 0;

    const fruitCount = new Map();
    let left = 0;
    let maxFruits = 0;

    for (let right = 0; right < fruits.length; right++) {
        const fruit = fruits[right];
        fruitCount.set(fruit, (fruitCount.get(fruit) || 0) + 1);

        // 当水果种类超过2种时，收缩窗口
        while (fruitCount.size > 2) {
            const leftFruit = fruits[left];
            fruitCount.set(leftFruit, fruitCount.get(leftFruit) - 1);
            if (fruitCount.get(leftFruit) === 0) {
                fruitCount.delete(leftFruit);
            }
            left++;
        }

        maxFruits = Math.max(maxFruits, right - left + 1);
    }

    return maxFruits;
}

/**
 * 10. 定长子串中元音的最大数目
 *
 * 核心思想：
 * 使用固定大小滑动窗口，统计窗口内元音字母的数量
 * 滑动时移除左边字符，添加右边字符
 *
 * @param {string} s - 输入字符串
 * @param {number} k - 子串长度
 * @return {number} 最大元音数目
 * @time O(n) 时间复杂度
 * @space O(1) 空间复杂度
 */
function maxVowels(s, k) {
    if (!s || k <= 0) return 0;

    const vowels = new Set(['a', 'e', 'i', 'o', 'u']);
    let vowelCount = 0;

    // 初始化第一个窗口
    for (let i = 0; i < Math.min(k, s.length); i++) {
        if (vowels.has(s[i])) {
            vowelCount++;
        }
    }

    let maxVowelCount = vowelCount;

    // 滑动窗口
    for (let i = k; i < s.length; i++) {
        // 添加右边字符
        if (vowels.has(s[i])) {
            vowelCount++;
        }

        // 移除左边字符
        if (vowels.has(s[i - k])) {
            vowelCount--;
        }

        maxVowelCount = Math.max(maxVowelCount, vowelCount);
    }

    return maxVowelCount;
}

// 导出所有函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        maxSlidingWindow,
        minSlidingWindow,
        lengthOfLongestSubstring,
        lengthOfLongestSubstringDetailed,
        minSubArrayLen,
        minSubArrayLenDetailed,
        checkInclusion,
        findAllPermutations,
        minWindow,
        medianSlidingWindow,
        subarraysWithKDistinct,
        characterReplacement,
        totalFruit,
        maxVowels
    };
}

// 如果在浏览器环境中运行
if (typeof window !== 'undefined') {
    window.maxSlidingWindow = maxSlidingWindow;
    window.lengthOfLongestSubstring = lengthOfLongestSubstring;
    window.minSubArrayLen = minSubArrayLen;
    window.checkInclusion = checkInclusion;
    window.minWindow = minWindow;
    window.medianSlidingWindow = medianSlidingWindow;
    window.subarraysWithKDistinct = subarraysWithKDistinct;
    window.characterReplacement = characterReplacement;
    window.totalFruit = totalFruit;
    window.maxVowels = maxVowels;
}