/**
 * LeetCode 094: 最小覆盖子串 (Minimum Window Substring)
 *
 * 题目描述：
 * 给你一个字符串 s 、一个字符串 t 。返回 s 中涵盖 t 所有字符的最小子串。
 * 如果 s 中不存在涵盖 t 所有字符的子串，则返回空字符串 "" 。
 *
 * 注意：
 * - 对于 t 中重复字符，我们寻找的子字符串中该字符数量必须不少于 t 中该字符数量。
 * - 如果 s 中存在这样的子串，我们保证它是唯一的答案。
 *
 * 示例：
 * 输入：s = "ADOBECODEBANC", t = "ABC"
 * 输出："BANC"
 * 解释：最小覆盖子串 "BANC" 包含来自字符串 t 的 'A'、'B' 和 'C'。
 *
 * 核心思想：
 * 滑动窗口 + 哈希表 - 使用双指针维护一个滑动窗口，动态调整窗口大小
 *
 * 算法原理：
 * 1. 目标统计：统计字符串 t 中每个字符的频次
 * 2. 窗口扩展：右指针扩展窗口，直到包含所有目标字符
 * 3. 窗口收缩：左指针收缩窗口，寻找最小覆盖子串
 * 4. 最优更新：每次找到有效窗口时更新最小结果
 * 5. 重复过程：继续扩展收缩，直到右指针到达末尾
 *
 * 时间复杂度：O(|s| + |t|)
 * 空间复杂度：O(|s| + |t|)
 */

/**
 * 解法一：滑动窗口（推荐）
 *
 * 核心思想：
 * 使用双指针维护一个滑动窗口，动态调整窗口大小来寻找最小覆盖子串
 *
 * 算法步骤：
 * 1. 统计目标字符串t中每个字符的频次
 * 2. 使用右指针扩展窗口，直到窗口包含所有目标字符
 * 3. 使用左指针收缩窗口，寻找最小覆盖子串
 * 4. 重复扩展收缩过程，记录最小窗口
 *
 * @param {string} s - 源字符串
 * @param {string} t - 目标字符串
 * @returns {string} 最小覆盖子串
 * @time O(|s| + |t|) - 每个字符最多被访问两次
 * @space O(|s| + |t|) - 哈希表存储字符频次
 */
function minWindow(s, t) {
    if (!s || !t || s.length < t.length) return "";

    // 统计目标字符串中每个字符的频次
    const targetCount = new Map();
    for (const char of t) {
        targetCount.set(char, (targetCount.get(char) || 0) + 1);
    }

    // 滑动窗口变量
    let left = 0, right = 0;
    let minLen = Infinity, minStart = 0;

    // 窗口中字符频次统计
    const windowCount = new Map();

    // 有效字符数（满足频次要求的字符种类数）
    let validChars = 0;
    const requiredChars = targetCount.size;

    while (right < s.length) {
        // 1. 扩展窗口：右指针移动，加入新字符
        const rightChar = s[right];
        windowCount.set(rightChar, (windowCount.get(rightChar) || 0) + 1);

        // 检查是否满足某个字符的频次要求
        if (targetCount.has(rightChar) &&
            windowCount.get(rightChar) === targetCount.get(rightChar)) {
            validChars++;
        }

        // 2. 收缩窗口：当窗口包含所有目标字符时
        while (validChars === requiredChars) {
            // 更新最小窗口
            if (right - left + 1 < minLen) {
                minLen = right - left + 1;
                minStart = left;
            }

            // 左指针移动，移除字符
            const leftChar = s[left];
            windowCount.set(leftChar, windowCount.get(leftChar) - 1);

            // 检查移除字符是否影响有效性
            if (targetCount.has(leftChar) &&
                windowCount.get(leftChar) < targetCount.get(leftChar)) {
                validChars--;
            }

            left++;
        }

        right++;
    }

    return minLen === Infinity ? "" : s.substring(minStart, minStart + minLen);
}

/**
 * 解法二：暴力解法
 *
 * 核心思想：
 * 枚举所有可能的子串，检查是否包含目标字符串的所有字符
 *
 * 算法步骤：
 * 1. 枚举所有可能的子串起始位置
 * 2. 从起始位置开始扩展，检查是否包含所有目标字符
 * 3. 记录满足条件的最小子串
 *
 * @param {string} s - 源字符串
 * @param {string} t - 目标字符串
 * @returns {string} 最小覆盖子串
 * @time O(|s|² × |t|) - 枚举所有子串并检查
 * @space O(|t|) - 存储目标字符频次
 */
function minWindowBruteForce(s, t) {
    if (!s || !t || s.length < t.length) return "";

    // 统计目标字符串频次
    const targetCount = new Map();
    for (const char of t) {
        targetCount.set(char, (targetCount.get(char) || 0) + 1);
    }

    let minLen = Infinity;
    let result = "";

    // 枚举所有起始位置
    for (let i = 0; i < s.length; i++) {
        const windowCount = new Map();

        // 从起始位置开始扩展
        for (let j = i; j < s.length; j++) {
            const char = s[j];
            windowCount.set(char, (windowCount.get(char) || 0) + 1);

            // 检查当前窗口是否覆盖所有目标字符
            if (isValidWindow(windowCount, targetCount)) {
                if (j - i + 1 < minLen) {
                    minLen = j - i + 1;
                    result = s.substring(i, j + 1);
                }
                break; // 找到最小覆盖后就跳出
            }
        }
    }

    return result;
}

/**
 * 检查窗口是否有效（包含所有目标字符）
 * @param {Map} windowCount - 窗口字符频次
 * @param {Map} targetCount - 目标字符频次
 * @returns {boolean} 是否有效
 */
function isValidWindow(windowCount, targetCount) {
    for (const [char, count] of targetCount) {
        if ((windowCount.get(char) || 0) < count) {
            return false;
        }
    }
    return true;
}

/**
 * 解法三：优化滑动窗口
 *
 * 核心思想：
 * 预处理源字符串，只保留目标字符串中存在的字符，减少不必要的处理
 *
 * 算法步骤：
 * 1. 过滤源字符串，只保留目标字符串中的字符
 * 2. 在过滤后的字符串上应用滑动窗口
 * 3. 将结果映射回原字符串位置
 *
 * @param {string} s - 源字符串
 * @param {string} t - 目标字符串
 * @returns {string} 最小覆盖子串
 * @time O(|s| + |t|) - 线性时间复杂度
 * @space O(|s| + |t|) - 存储过滤字符
 */
function minWindowOptimized(s, t) {
    if (!s || !t || s.length < t.length) return "";

    // 统计目标字符频次
    const targetCount = new Map();
    for (const char of t) {
        targetCount.set(char, (targetCount.get(char) || 0) + 1);
    }

    // 过滤源字符串，只保留目标字符
    const filteredS = [];
    for (let i = 0; i < s.length; i++) {
        if (targetCount.has(s[i])) {
            filteredS.push([i, s[i]]); // [原位置, 字符]
        }
    }

    if (filteredS.length === 0) return "";

    // 在过滤后的字符串上应用滑动窗口
    let left = 0, right = 0;
    let minLen = Infinity, minStart = 0, minEnd = 0;

    const windowCount = new Map();
    let validChars = 0;
    const requiredChars = targetCount.size;

    while (right < filteredS.length) {
        // 扩展窗口
        const rightChar = filteredS[right][1];
        windowCount.set(rightChar, (windowCount.get(rightChar) || 0) + 1);

        if (windowCount.get(rightChar) === targetCount.get(rightChar)) {
            validChars++;
        }

        // 收缩窗口
        while (validChars === requiredChars) {
            const currentLen = filteredS[right][0] - filteredS[left][0] + 1;
            if (currentLen < minLen) {
                minLen = currentLen;
                minStart = filteredS[left][0];
                minEnd = filteredS[right][0];
            }

            const leftChar = filteredS[left][1];
            windowCount.set(leftChar, windowCount.get(leftChar) - 1);

            if (windowCount.get(leftChar) < targetCount.get(leftChar)) {
                validChars--;
            }

            left++;
        }

        right++;
    }

    return minLen === Infinity ? "" : s.substring(minStart, minEnd + 1);
}

/**
 * 解法四：字符数组优化
 *
 * 核心思想：
 * 使用字符数组代替哈希表，提高常数因子的性能
 * 适用于ASCII字符集的情况
 *
 * @param {string} s - 源字符串
 * @param {string} t - 目标字符串
 * @returns {string} 最小覆盖子串
 * @time O(|s| + |t|) - 线性时间复杂度
 * @space O(1) - 常数空间（ASCII字符集）
 */
function minWindowArray(s, t) {
    if (!s || !t || s.length < t.length) return "";

    // 使用数组存储字符频次（ASCII字符）
    const targetCount = new Array(128).fill(0);
    const windowCount = new Array(128).fill(0);

    let requiredChars = 0;

    // 统计目标字符频次
    for (const char of t) {
        if (targetCount[char.charCodeAt(0)] === 0) {
            requiredChars++;
        }
        targetCount[char.charCodeAt(0)]++;
    }

    let left = 0, right = 0;
    let minLen = Infinity, minStart = 0;
    let validChars = 0;

    while (right < s.length) {
        // 扩展窗口
        const rightCode = s[right].charCodeAt(0);
        windowCount[rightCode]++;

        if (windowCount[rightCode] === targetCount[rightCode]) {
            validChars++;
        }

        // 收缩窗口
        while (validChars === requiredChars) {
            if (right - left + 1 < minLen) {
                minLen = right - left + 1;
                minStart = left;
            }

            const leftCode = s[left].charCodeAt(0);
            windowCount[leftCode]--;

            if (windowCount[leftCode] < targetCount[leftCode]) {
                validChars--;
            }

            left++;
        }

        right++;
    }

    return minLen === Infinity ? "" : s.substring(minStart, minStart + minLen);
}

/**
 * 扩展应用：最小窗口子序列
 *
 * 核心思想：
 * 寻找包含目标子序列的最小窗口（保持相对顺序）
 *
 * @param {string} s - 源字符串
 * @param {string} t - 目标子序列
 * @returns {string} 最小窗口子序列
 * @time O(|s| × |t|) - 双指针匹配
 * @space O(1) - 常数空间
 */
function minWindowSubsequence(s, t) {
    if (!s || !t) return "";

    let minLen = Infinity;
    let result = "";

    for (let i = 0; i < s.length; i++) {
        if (s[i] === t[0]) {
            let sIndex = i, tIndex = 0;

            // 前向匹配子序列
            while (sIndex < s.length && tIndex < t.length) {
                if (s[sIndex] === t[tIndex]) {
                    tIndex++;
                }
                sIndex++;
            }

            // 如果匹配成功，反向寻找最小窗口
            if (tIndex === t.length) {
                let end = sIndex - 1;
                tIndex--;

                while (tIndex >= 0) {
                    if (s[end] === t[tIndex]) {
                        tIndex--;
                    }
                    end--;
                }

                if (sIndex - 1 - end < minLen) {
                    minLen = sIndex - 1 - end;
                    result = s.substring(end + 1, sIndex);
                }
            }
        }
    }

    return result;
}

// 测试用例
console.log("=== LeetCode 094: 最小覆盖子串 测试 ===");

const testCases = [
    { s: "ADOBECODEBANC", t: "ABC" },
    { s: "a", t: "a" },
    { s: "a", t: "aa" },
    { s: "ab", t: "b" },
    { s: "bba", t: "ab" },
    { s: "ADOBECODEBANC", t: "AABC" },
    { s: "wegdtzwabazduwcsx", t: "aabc" }
];

console.log("\n解法一：滑动窗口");
testCases.forEach((test, index) => {
    const result = minWindow(test.s, test.t);
    console.log(`测试 ${index + 1}: s="${test.s}", t="${test.t}" => "${result}"`);
});

console.log("\n解法二：暴力解法");
testCases.forEach((test, index) => {
    const result = minWindowBruteForce(test.s, test.t);
    console.log(`测试 ${index + 1}: s="${test.s}", t="${test.t}" => "${result}"`);
});

console.log("\n解法三：优化滑动窗口");
testCases.forEach((test, index) => {
    const result = minWindowOptimized(test.s, test.t);
    console.log(`测试 ${index + 1}: s="${test.s}", t="${test.t}" => "${result}"`);
});

console.log("\n解法四：字符数组优化");
testCases.forEach((test, index) => {
    const result = minWindowArray(test.s, test.t);
    console.log(`测试 ${index + 1}: s="${test.s}", t="${test.t}" => "${result}"`);
});

console.log("\n扩展：最小窗口子序列");
const subseqTests = [
    { s: "abcdebdde", t: "bde" },
    { s: "jmeqksfrsdcmsiwvaovztaqenprpvnbstl", t: "u" },
    { s: "cnhczmccqouqadqtmjjzl", t: "mm" }
];

subseqTests.forEach((test, index) => {
    const result = minWindowSubsequence(test.s, test.t);
    console.log(`子序列测试 ${index + 1}: s="${test.s}", t="${test.t}" => "${result}"`);
});

/**
 * 算法总结：
 *
 * 1. 滑动窗口（推荐）：
 *    - 时间复杂度：O(|s| + |t|)
 *    - 空间复杂度：O(|s| + |t|)
 *    - 优点：最优解法，每个字符最多访问两次
 *    - 核心：双指针维护动态窗口
 *
 * 2. 暴力解法：
 *    - 时间复杂度：O(|s|² × |t|)
 *    - 空间复杂度：O(|t|)
 *    - 优点：思路简单，容易理解
 *    - 缺点：时间复杂度较高
 *
 * 3. 优化滑动窗口：
 *    - 时间复杂度：O(|s| + |t|)
 *    - 空间复杂度：O(|s| + |t|)
 *    - 优点：减少无效字符处理
 *    - 适用：目标字符较少的情况
 *
 * 4. 字符数组优化：
 *    - 时间复杂度：O(|s| + |t|)
 *    - 空间复杂度：O(1)
 *    - 优点：常数因子更优
 *    - 限制：仅适用于ASCII字符
 *
 * 核心要点：
 * - 滑动窗口是解决字符串匹配问题的经典方法
 * - 合理使用哈希表统计字符频次
 * - 理解窗口扩展和收缩的时机
 * - 考虑字符集范围进行优化
 */