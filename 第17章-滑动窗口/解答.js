/**
 * 第17章 滑动窗口 - 练习题解答
 *
 * 本文件包含5道滑动窗口练习题的详细解答：
 * 1. 长度为K的子数组的最大和
 * 2. 最小覆盖子串
 * 3. 滑动窗口最大值
 * 4. K个不同整数的子数组
 * 5. 替换后的最长重复字符
 *
 * 每道题都提供多种解法、详细分析和测试用例
 */

// ====================练习题1：长度为K的子数组的最大和====================

/**
 * 练习题1 - 滑动窗口解法（推荐）
 *
 * 核心思想：
 * 使用固定大小滑动窗口，通过添加右边元素、移除左边元素来更新窗口和
 * 避免重复计算，将O(n*k)优化为O(n)
 *
 * @param {number[]} nums - 输入数组
 * @param {number} k - 子数组长度
 * @return {number} 最大和
 * @time O(n) 时间复杂度
 * @space O(1) 空间复杂度
 */
function maxSumSubarrayK(nums, k) {
    if (!nums || nums.length < k || k <= 0) return 0;

    let windowSum = 0;

    // 计算第一个窗口的和
    for (let i = 0; i < k; i++) {
        windowSum += nums[i];
    }

    let maxSum = windowSum;

    // 滑动窗口计算其他窗口的和
    for (let i = k; i < nums.length; i++) {
        windowSum = windowSum - nums[i - k] + nums[i]; // 移除左边，添加右边
        maxSum = Math.max(maxSum, windowSum);
    }

    return maxSum;
}

/**
 * 练习题1 - 暴力解法（对比用）
 *
 * @param {number[]} nums - 输入数组
 * @param {number} k - 子数组长度
 * @return {number} 最大和
 * @time O(n*k) 时间复杂度
 * @space O(1) 空间复杂度
 */
function maxSumSubarrayKBruteForce(nums, k) {
    if (!nums || nums.length < k || k <= 0) return 0;

    let maxSum = -Infinity;

    for (let i = 0; i <= nums.length - k; i++) {
        let currentSum = 0;
        for (let j = i; j < i + k; j++) {
            currentSum += nums[j];
        }
        maxSum = Math.max(maxSum, currentSum);
    }

    return maxSum;
}

// ====================练习题2：最小覆盖子串====================

/**
 * 练习题2 - 滑动窗口解法（推荐）
 *
 * 核心思想：
 * 1. 先扩展右指针直到窗口包含所有目标字符
 * 2. 然后收缩左指针寻找最小覆盖子串
 * 3. 重复此过程直到遍历完整个字符串
 *
 * @param {string} s - 源字符串
 * @param {string} t - 目标字符串
 * @return {string} 最小覆盖子串
 * @time O(|s| + |t|) 时间复杂度
 * @space O(|s| + |t|) 空间复杂度
 */
function minWindow(s, t) {
    if (!s || !t || s.length < t.length) return "";

    // 统计目标字符频次
    const tFreq = new Map();
    for (const char of t) {
        tFreq.set(char, (tFreq.get(char) || 0) + 1);
    }

    const windowFreq = new Map();
    let left = 0;
    let minLength = Infinity;
    let minStart = 0;
    let matches = 0; // 满足条件的字符种类数
    const required = tFreq.size; // 需要满足的字符种类数

    for (let right = 0; right < s.length; right++) {
        const rightChar = s[right];

        // 扩展窗口
        windowFreq.set(rightChar, (windowFreq.get(rightChar) || 0) + 1);

        // 检查是否满足该字符的频次要求
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

            // 移除左边字符
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
 * 练习题2 - 详细分析版本
 *
 * @param {string} s - 源字符串
 * @param {string} t - 目标字符串
 * @return {object} 包含结果和详细信息
 */
function minWindowDetailed(s, t) {
    console.log(`\n开始寻找最小覆盖子串`);
    console.log(`源字符串: "${s}"`);
    console.log(`目标字符串: "${t}"`);

    if (!s || !t || s.length < t.length) {
        console.log(`无效输入或源字符串太短`);
        return { result: "", steps: [] };
    }

    const tFreq = new Map();
    for (const char of t) {
        tFreq.set(char, (tFreq.get(char) || 0) + 1);
    }
    console.log(`目标字符频次:`, Object.fromEntries(tFreq));

    const windowFreq = new Map();
    let left = 0;
    let minLength = Infinity;
    let minStart = 0;
    let matches = 0;
    const required = tFreq.size;
    const steps = [];

    for (let right = 0; right < s.length; right++) {
        const rightChar = s[right];

        // 扩展窗口
        windowFreq.set(rightChar, (windowFreq.get(rightChar) || 0) + 1);

        if (tFreq.has(rightChar) && windowFreq.get(rightChar) === tFreq.get(rightChar)) {
            matches++;
        }

        // 收缩窗口
        while (left <= right && matches === required) {
            const currentWindow = s.substring(left, right + 1);

            if (right - left + 1 < minLength) {
                minLength = right - left + 1;
                minStart = left;
                steps.push({
                    window: currentWindow,
                    left,
                    right,
                    length: minLength,
                    isMin: true
                });
                console.log(`找到更小的覆盖子串: "${currentWindow}" (长度: ${minLength})`);
            }

            const char = s[left];
            windowFreq.set(char, windowFreq.get(char) - 1);
            if (tFreq.has(char) && windowFreq.get(char) < tFreq.get(char)) {
                matches--;
            }
            left++;
        }
    }

    const result = minLength === Infinity ? "" : s.substring(minStart, minStart + minLength);
    console.log(`\n最终结果: "${result}"`);

    return { result, steps, minLength: minLength === Infinity ? 0 : minLength };
}

// ====================练习题3：滑动窗口最大值====================

/**
 * 练习题3 - 单调队列解法（推荐）
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
 * 练习题3 - 暴力解法（对比用）
 *
 * @param {number[]} nums - 输入数组
 * @param {number} k - 窗口大小
 * @return {number[]} 每个窗口的最大值
 * @time O(n*k) 时间复杂度
 * @space O(1) 空间复杂度
 */
function maxSlidingWindowBruteForce(nums, k) {
    if (!nums || nums.length === 0 || k <= 0) return [];

    const result = [];

    for (let i = 0; i <= nums.length - k; i++) {
        let maxVal = nums[i];
        for (let j = i + 1; j < i + k; j++) {
            maxVal = Math.max(maxVal, nums[j]);
        }
        result.push(maxVal);
    }

    return result;
}

/**
 * 练习题3 - 单调队列详细分析版本
 */
function maxSlidingWindowDetailed(nums, k) {
    console.log(`\n开始滑动窗口最大值分析`);
    console.log(`输入数组: [${nums.join(', ')}]`);
    console.log(`窗口大小: ${k}`);

    if (!nums || nums.length === 0 || k <= 0) return [];

    const result = [];
    const deque = [];
    let step = 0;

    for (let i = 0; i < nums.length; i++) {
        step++;
        console.log(`\n步骤${step}: 处理元素 ${nums[i]} (索引${i})`);

        // 移除窗口外的元素
        while (deque.length > 0 && deque[0] <= i - k) {
            const removed = deque.shift();
            console.log(`  移除窗口外元素: nums[${removed}] = ${nums[removed]}`);
        }

        // 保持递减顺序
        while (deque.length > 0 && nums[deque[deque.length - 1]] <= nums[i]) {
            const removed = deque.pop();
            console.log(`  移除较小元素: nums[${removed}] = ${nums[removed]}`);
        }

        deque.push(i);
        console.log(`  添加当前元素到队列: nums[${i}] = ${nums[i]}`);
        console.log(`  当前队列索引: [${deque.join(', ')}]`);
        console.log(`  当前队列值: [${deque.map(idx => nums[idx]).join(', ')}]`);

        if (i >= k - 1) {
            const maxVal = nums[deque[0]];
            result.push(maxVal);
            console.log(`  ✅ 窗口[${i-k+1}, ${i}]的最大值: ${maxVal}`);
        }
    }

    console.log(`\n最终结果: [${result.join(', ')}]`);
    return result;
}

// ====================练习题4：K个不同整数的子数组====================

/**
 * 练习题4 - 转换思想解法（推荐）
 *
 * 核心思想：
 * "恰好K个不同整数" = "最多K个不同整数" - "最多K-1个不同整数"
 * 将难以直接解决的问题转换为两个相对简单的子问题
 *
 * @param {number[]} nums - 输入数组
 * @param {number} k - 不同整数的个数
 * @return {number} 子数组数量
 * @time O(n) 时间复杂度
 * @space O(k) 空间复杂度
 */
function subarraysWithKDistinct(nums, k) {
    /**
     * 计算最多包含K个不同整数的子数组数量
     */
    function atMostK(nums, k) {
        if (k === 0) return 0;

        const count = new Map();
        let left = 0;
        let result = 0;

        for (let right = 0; right < nums.length; right++) {
            // 添加右边元素
            count.set(nums[right], (count.get(nums[right]) || 0) + 1);

            // 收缩窗口直到满足条件
            while (count.size > k) {
                count.set(nums[left], count.get(nums[left]) - 1);
                if (count.get(nums[left]) === 0) {
                    count.delete(nums[left]);
                }
                left++;
            }

            // 以right为右端点的所有子数组数量
            result += right - left + 1;
        }

        return result;
    }

    return atMostK(nums, k) - atMostK(nums, k - 1);
}

/**
 * 练习题4 - 详细分析版本
 */
function subarraysWithKDistinctDetailed(nums, k) {
    console.log(`\n开始分析K个不同整数的子数组`);
    console.log(`输入数组: [${nums.join(', ')}]`);
    console.log(`K值: ${k}`);

    function atMostKDetailed(nums, k, label) {
        console.log(`\n计算${label}:`);
        if (k === 0) return 0;

        const count = new Map();
        let left = 0;
        let result = 0;
        const subarrays = [];

        for (let right = 0; right < nums.length; right++) {
            count.set(nums[right], (count.get(nums[right]) || 0) + 1);

            while (count.size > k) {
                count.set(nums[left], count.get(nums[left]) - 1);
                if (count.get(nums[left]) === 0) {
                    count.delete(nums[left]);
                }
                left++;
            }

            const windowSubarrays = right - left + 1;
            result += windowSubarrays;

            // 记录以right为右端点的子数组
            for (let i = left; i <= right; i++) {
                subarrays.push(nums.slice(i, right + 1));
            }

            console.log(`  窗口[${left}, ${right}]: 不同整数${count.size}个, 新增子数组${windowSubarrays}个`);
        }

        console.log(`  ${label}结果: ${result}`);
        console.log(`  子数组示例: ${subarrays.slice(0, 10).map(arr => `[${arr.join(',')}]`).join(', ')}${subarrays.length > 10 ? '...' : ''}`);

        return result;
    }

    const atMostK = atMostKDetailed(nums, k, `最多${k}个不同整数的子数组数量`);
    const atMostKMinus1 = atMostKDetailed(nums, k - 1, `最多${k-1}个不同整数的子数组数量`);
    const result = atMostK - atMostKMinus1;

    console.log(`\n最终答案: ${atMostK} - ${atMostKMinus1} = ${result}`);

    return result;
}

// ====================练习题5：替换后的最长重复字符====================

/**
 * 练习题5 - 滑动窗口解法（推荐）
 *
 * 核心思想：
 * 1. 维护一个滑动窗口，窗口内最多有k个字符需要被替换
 * 2. 窗口内出现次数最多的字符不需要被替换
 * 3. 当"窗口大小 - 最大字符频次 > k"时，收缩窗口
 *
 * @param {string} s - 输入字符串
 * @param {number} k - 最多可替换的字符数
 * @return {number} 最长重复字符子串长度
 * @time O(n) 时间复杂度
 * @space O(1) 空间复杂度（字符集大小固定）
 */
function characterReplacement(s, k) {
    if (!s) return 0;

    const charCount = new Map();
    let left = 0;
    let maxCount = 0; // 窗口内出现次数最多的字符的频次
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
 * 练习题5 - 详细分析版本
 */
function characterReplacementDetailed(s, k) {
    console.log(`\n开始分析替换后的最长重复字符`);
    console.log(`输入字符串: "${s}"`);
    console.log(`最多替换次数: ${k}`);

    if (!s) return 0;

    const charCount = new Map();
    let left = 0;
    let maxCount = 0;
    let maxLength = 0;
    let bestWindow = { start: 0, end: 0, char: '', length: 0 };

    for (let right = 0; right < s.length; right++) {
        const rightChar = s[right];
        charCount.set(rightChar, (charCount.get(rightChar) || 0) + 1);

        const oldMaxCount = maxCount;
        maxCount = Math.max(maxCount, charCount.get(rightChar));

        const windowSize = right - left + 1;
        const replacements = windowSize - maxCount;

        console.log(`\n步骤${right + 1}: 添加字符 '${rightChar}'`);
        console.log(`  窗口: "${s.substring(left, right + 1)}" [${left}, ${right}]`);
        console.log(`  字符频次: ${JSON.stringify(Object.fromEntries(charCount))}`);
        console.log(`  最大频次: ${maxCount} (${oldMaxCount !== maxCount ? '更新' : '不变'})`);
        console.log(`  窗口大小: ${windowSize}, 需要替换: ${replacements}`);

        // 收缩窗口
        while (replacements > k) {
            const leftChar = s[left];
            charCount.set(leftChar, charCount.get(leftChar) - 1);
            if (charCount.get(leftChar) === 0) {
                charCount.delete(leftChar);
            }
            left++;

            const newWindowSize = right - left + 1;
            const newReplacements = newWindowSize - maxCount;

            console.log(`  收缩窗口: 移除 '${leftChar}', 新窗口: "${s.substring(left, right + 1)}"`);
            console.log(`  新的替换次数: ${newReplacements}`);

            if (newReplacements <= k) break;
        }

        const currentLength = right - left + 1;
        if (currentLength > maxLength) {
            maxLength = currentLength;

            // 找到当前窗口中出现次数最多的字符
            let mostFrequentChar = '';
            let maxFreq = 0;
            for (const [char, freq] of charCount) {
                if (freq > maxFreq) {
                    maxFreq = freq;
                    mostFrequentChar = char;
                }
            }

            bestWindow = {
                start: left,
                end: right,
                char: mostFrequentChar,
                length: currentLength
            };

            console.log(`  ✅ 找到更长的窗口: 长度 ${maxLength}`);
        }
    }

    console.log(`\n最佳窗口:`);
    console.log(`  位置: [${bestWindow.start}, ${bestWindow.end}]`);
    console.log(`  内容: "${s.substring(bestWindow.start, bestWindow.end + 1)}"`);
    console.log(`  主要字符: '${bestWindow.char}'`);
    console.log(`  最长长度: ${bestWindow.length}`);

    return maxLength;
}

// ====================测试函数====================

/**
 * 测试所有练习题
 */
function testAllProblems() {
    console.log("🎯 第17章滑动窗口练习题测试");
    console.log("===========================");

    // 测试练习题1
    console.log("\n📝 练习题1: 长度为K的子数组的最大和");
    console.log("--------------------------------");

    const test1Cases = [
        { nums: [2, 1, 5, 1, 3, 2], k: 3, expected: 9 },
        { nums: [1, 12, -5, -6, 50, 3], k: 4, expected: 51 },
        { nums: [1, 2, 3, 4, 5], k: 2, expected: 9 }
    ];

    test1Cases.forEach((testCase, index) => {
        console.log(`\n测试用例 ${index + 1}:`);
        console.log(`输入: nums=[${testCase.nums.join(', ')}], k=${testCase.k}`);

        const result1 = maxSumSubarrayK(testCase.nums, testCase.k);
        const result2 = maxSumSubarrayKBruteForce(testCase.nums, testCase.k);

        console.log(`滑动窗口解法: ${result1}`);
        console.log(`暴力解法: ${result2}`);
        console.log(`期望结果: ${testCase.expected}`);
        console.log(`测试${result1 === testCase.expected && result2 === testCase.expected ? '✅ 通过' : '❌ 失败'}`);
    });

    // 测试练习题2
    console.log("\n📝 练习题2: 最小覆盖子串");
    console.log("----------------------");

    const test2Cases = [
        { s: "ADOBECODEBANC", t: "ABC", expected: "BANC" },
        { s: "a", t: "a", expected: "a" },
        { s: "a", t: "aa", expected: "" }
    ];

    test2Cases.forEach((testCase, index) => {
        console.log(`\n测试用例 ${index + 1}:`);
        console.log(`输入: s="${testCase.s}", t="${testCase.t}"`);

        const result = minWindow(testCase.s, testCase.t);
        console.log(`结果: "${result}"`);
        console.log(`期望: "${testCase.expected}"`);
        console.log(`测试${result === testCase.expected ? '✅ 通过' : '❌ 失败'}`);

        if (index === 0) {
            minWindowDetailed(testCase.s, testCase.t);
        }
    });

    // 测试练习题3
    console.log("\n📝 练习题3: 滑动窗口最大值");
    console.log("-------------------------");

    const test3Cases = [
        { nums: [1, 3, -1, -3, 5, 3, 6, 7], k: 3, expected: [3, 3, 5, 5, 6, 7] },
        { nums: [1], k: 1, expected: [1] },
        { nums: [1, -1], k: 1, expected: [1, -1] }
    ];

    test3Cases.forEach((testCase, index) => {
        console.log(`\n测试用例 ${index + 1}:`);
        console.log(`输入: nums=[${testCase.nums.join(', ')}], k=${testCase.k}`);

        const result1 = maxSlidingWindow(testCase.nums, testCase.k);
        const result2 = maxSlidingWindowBruteForce(testCase.nums, testCase.k);

        console.log(`单调队列解法: [${result1.join(', ')}]`);
        console.log(`暴力解法: [${result2.join(', ')}]`);
        console.log(`期望结果: [${testCase.expected.join(', ')}]`);

        const match1 = JSON.stringify(result1) === JSON.stringify(testCase.expected);
        const match2 = JSON.stringify(result2) === JSON.stringify(testCase.expected);
        console.log(`测试${match1 && match2 ? '✅ 通过' : '❌ 失败'}`);

        if (index === 0) {
            maxSlidingWindowDetailed(testCase.nums, testCase.k);
        }
    });

    // 测试练习题4
    console.log("\n📝 练习题4: K个不同整数的子数组");
    console.log("-----------------------------");

    const test4Cases = [
        { nums: [1, 2, 1, 2, 3], k: 2, expected: 7 },
        { nums: [1, 2, 1, 3, 4], k: 3, expected: 3 }
    ];

    test4Cases.forEach((testCase, index) => {
        console.log(`\n测试用例 ${index + 1}:`);
        console.log(`输入: nums=[${testCase.nums.join(', ')}], k=${testCase.k}`);

        const result = subarraysWithKDistinct(testCase.nums, testCase.k);
        console.log(`结果: ${result}`);
        console.log(`期望: ${testCase.expected}`);
        console.log(`测试${result === testCase.expected ? '✅ 通过' : '❌ 失败'}`);

        if (index === 0) {
            subarraysWithKDistinctDetailed(testCase.nums, testCase.k);
        }
    });

    // 测试练习题5
    console.log("\n📝 练习题5: 替换后的最长重复字符");
    console.log("------------------------------");

    const test5Cases = [
        { s: "ABAB", k: 2, expected: 4 },
        { s: "AABABBA", k: 1, expected: 4 },
        { s: "ABCDE", k: 1, expected: 2 }
    ];

    test5Cases.forEach((testCase, index) => {
        console.log(`\n测试用例 ${index + 1}:`);
        console.log(`输入: s="${testCase.s}", k=${testCase.k}`);

        const result = characterReplacement(testCase.s, testCase.k);
        console.log(`结果: ${result}`);
        console.log(`期望: ${testCase.expected}`);
        console.log(`测试${result === testCase.expected ? '✅ 通过' : '❌ 失败'}`);

        if (index === 0) {
            characterReplacementDetailed(testCase.s, testCase.k);
        }
    });
}

/**
 * 性能测试
 */
function performanceTest() {
    console.log("\n📊 性能测试");
    console.log("===========");

    const sizes = [1000, 5000, 10000];

    sizes.forEach(size => {
        console.log(`\n测试规模: ${size}`);

        // 生成测试数据
        const nums = Array.from({ length: size }, (_, i) => Math.floor(Math.random() * 100));
        const k = Math.floor(size / 10);

        // 测试练习题1的两种解法
        console.log(`练习题1 - 长度为${k}的子数组最大和:`);

        let start = performance.now();
        const result1 = maxSumSubarrayK(nums, k);
        let end = performance.now();
        console.log(`  滑动窗口: ${(end - start).toFixed(4)}ms, 结果: ${result1}`);

        if (size <= 1000) { // 暴力解法只在小规模时测试
            start = performance.now();
            const result2 = maxSumSubarrayKBruteForce(nums, k);
            end = performance.now();
            console.log(`  暴力解法: ${(end - start).toFixed(4)}ms, 结果: ${result2}`);
            console.log(`  结果一致性: ${result1 === result2 ? '✅' : '❌'}`);
        }

        // 测试练习题3的两种解法
        console.log(`练习题3 - 滑动窗口最大值 (k=${k}):`);

        start = performance.now();
        const result3 = maxSlidingWindow(nums, k);
        end = performance.now();
        console.log(`  单调队列: ${(end - start).toFixed(4)}ms, 结果长度: ${result3.length}`);

        if (size <= 1000) {
            start = performance.now();
            const result4 = maxSlidingWindowBruteForce(nums, k);
            end = performance.now();
            console.log(`  暴力解法: ${(end - start).toFixed(4)}ms, 结果长度: ${result4.length}`);
            console.log(`  结果一致性: ${JSON.stringify(result3) === JSON.stringify(result4) ? '✅' : '❌'}`);
        }
    });
}

// 导出所有函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        maxSumSubarrayK,
        maxSumSubarrayKBruteForce,
        minWindow,
        minWindowDetailed,
        maxSlidingWindow,
        maxSlidingWindowBruteForce,
        maxSlidingWindowDetailed,
        subarraysWithKDistinct,
        subarraysWithKDistinctDetailed,
        characterReplacement,
        characterReplacementDetailed,
        testAllProblems,
        performanceTest
    };
}

// 如果在浏览器环境中运行
if (typeof window !== 'undefined') {
    window.maxSumSubarrayK = maxSumSubarrayK;
    window.minWindow = minWindow;
    window.maxSlidingWindow = maxSlidingWindow;
    window.subarraysWithKDistinct = subarraysWithKDistinct;
    window.characterReplacement = characterReplacement;
    window.testAllProblems = testAllProblems;
}

// 运行测试
// testAllProblems();
// performanceTest();