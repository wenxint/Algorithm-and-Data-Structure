/**
 * 第12章：搜索算法 - 练习题解答
 *
 * 本文件包含5道练习题的完整解答，涵盖：
 * 1. 搜索旋转排序数组
 * 2. 寻找峰值元素
 * 3. 字符串模式匹配
 * 4. 二维矩阵搜索
 * 5. 搜索系统设计
 *
 * 作者：数据结构与算法教程
 * 日期：2024年
 */

// ==================== 题目1：搜索旋转排序数组 ====================

/**
 * 题目1解法1：标准二分搜索
 *
 * 核心思想：
 * 旋转数组可以分为两个有序部分，通过判断中点位置
 * 确定目标值在哪个有序部分，然后缩小搜索范围
 *
 * @param {number[]} nums - 旋转排序数组
 * @param {number} target - 目标值
 * @returns {number} 目标值的索引，未找到返回-1
 * @time O(log n)
 * @space O(1)
 */
function searchRotatedArray(nums, target) {
    if (!nums || nums.length === 0) return -1;

    let left = 0;
    let right = nums.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        // 找到目标值
        if (nums[mid] === target) {
            return mid;
        }

        // 判断左半部分是否有序
        if (nums[left] <= nums[mid]) {
            // 左半部分有序，判断目标值是否在左半部分
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        } else {
            // 右半部分有序，判断目标值是否在右半部分
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }

    return -1;
}

/**
 * 题目1解法2：处理重复元素的情况
 *
 * 核心思想：
 * 当存在重复元素时，nums[left] == nums[mid] 的情况下
 * 无法确定哪一部分是有序的，需要特殊处理
 *
 * @param {number[]} nums - 包含重复元素的旋转排序数组
 * @param {number} target - 目标值
 * @returns {number} 目标值的索引，未找到返回-1
 * @time O(log n) 平均，O(n) 最坏情况
 * @space O(1)
 */
function searchRotatedArrayWithDuplicates(nums, target) {
    if (!nums || nums.length === 0) return -1;

    let left = 0;
    let right = nums.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        if (nums[mid] === target) {
            return mid;
        }

        // 处理重复元素的情况
        if (nums[left] === nums[mid] && nums[mid] === nums[right]) {
            left++;
            right--;
        } else if (nums[left] <= nums[mid]) {
            // 左半部分有序
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        } else {
            // 右半部分有序
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }

    return -1;
}

/**
 * 题目1解法3：找到旋转点然后搜索
 *
 * 核心思想：
 * 先找到旋转点（最小值的位置），然后在对应的有序部分进行二分搜索
 *
 * @param {number[]} nums - 旋转排序数组
 * @param {number} target - 目标值
 * @returns {number} 目标值的索引，未找到返回-1
 */
function searchRotatedArrayByPivot(nums, target) {
    if (!nums || nums.length === 0) return -1;

    // 找到旋转点
    const pivot = findPivot(nums);

    // 根据目标值的大小决定在哪一部分搜索
    if (target >= nums[0]) {
        // 在左半部分搜索
        return binarySearch(nums, target, 0, pivot - 1);
    } else {
        // 在右半部分搜索
        return binarySearch(nums, target, pivot, nums.length - 1);
    }
}

/**
 * 找到旋转点（最小值的位置）
 */
function findPivot(nums) {
    let left = 0;
    let right = nums.length - 1;

    while (left < right) {
        const mid = Math.floor((left + right) / 2);

        if (nums[mid] > nums[right]) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }

    return left;
}

/**
 * 标准二分搜索
 */
function binarySearch(nums, target, left, right) {
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        if (nums[mid] === target) {
            return mid;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return -1;
}

// ==================== 题目2：寻找峰值元素 ====================

/**
 * 题目2解法1：二分搜索
 *
 * 核心思想：
 * 比较中点与相邻元素的大小关系，向上升的方向搜索
 * 由于边界被视为负无穷，一定能找到峰值
 *
 * @param {number[]} nums - 数组
 * @returns {number} 峰值元素的索引
 * @time O(log n)
 * @space O(1)
 */
function findPeakElement(nums) {
    if (!nums || nums.length === 0) return -1;
    if (nums.length === 1) return 0;

    let left = 0;
    let right = nums.length - 1;

    while (left < right) {
        const mid = Math.floor((left + right) / 2);

        // 比较中点与右邻居
        if (nums[mid] < nums[mid + 1]) {
            // 右边更大，峰值在右半部分
            left = mid + 1;
        } else {
            // 左边更大或相等，峰值在左半部分（包括mid）
            right = mid;
        }
    }

    return left;
}

/**
 * 题目2解法2：三分搜索
 *
 * 核心思想：
 * 将搜索空间分为三部分，通过比较两个三分点的值
 * 来确定峰值所在的区间
 *
 * @param {number[]} nums - 数组
 * @returns {number} 峰值元素的索引
 * @time O(log n)
 * @space O(1)
 */
function findPeakElementTernary(nums) {
    if (!nums || nums.length === 0) return -1;
    if (nums.length === 1) return 0;

    let left = 0;
    let right = nums.length - 1;

    while (right - left > 2) {
        const mid1 = left + Math.floor((right - left) / 3);
        const mid2 = right - Math.floor((right - left) / 3);

        if (nums[mid1] < nums[mid2]) {
            left = mid1;
        } else {
            right = mid2;
        }
    }

    // 在剩余的2-3个元素中找峰值
    let maxIndex = left;
    for (let i = left + 1; i <= right; i++) {
        if (nums[i] > nums[maxIndex]) {
            maxIndex = i;
        }
    }

    return maxIndex;
}

/**
 * 题目2解法3：找出所有峰值
 *
 * 核心思想：
 * 遍历数组，检查每个元素是否为峰值
 * 处理边界情况（第一个和最后一个元素）
 *
 * @param {number[]} nums - 数组
 * @returns {number[]} 所有峰值元素的索引
 * @time O(n)
 * @space O(k) k为峰值数量
 */
function findAllPeaks(nums) {
    if (!nums || nums.length === 0) return [];
    if (nums.length === 1) return [0];

    const peaks = [];

    // 检查第一个元素
    if (nums[0] > nums[1]) {
        peaks.push(0);
    }

    // 检查中间元素
    for (let i = 1; i < nums.length - 1; i++) {
        if (nums[i] > nums[i - 1] && nums[i] > nums[i + 1]) {
            peaks.push(i);
        }
    }

    // 检查最后一个元素
    if (nums[nums.length - 1] > nums[nums.length - 2]) {
        peaks.push(nums.length - 1);
    }

    return peaks;
}

// ==================== 题目3：字符串模式匹配 ====================

/**
 * 字符串搜索系统类
 *
 * 核心思想：
 * 提供多种字符串搜索算法，支持精确匹配、通配符匹配和多模式匹配
 * 包含性能统计和算法比较功能
 */
class StringSearchSystem {
    constructor() {
        this.searchStats = new Map();
        this.resetStats();
    }

    /**
     * 重置性能统计
     */
    resetStats() {
        this.searchStats.clear();
        this.searchStats.set('naive', { count: 0, totalTime: 0 });
        this.searchStats.set('kmp', { count: 0, totalTime: 0 });
        this.searchStats.set('boyerMoore', { count: 0, totalTime: 0 });
        this.searchStats.set('rabinKarp', { count: 0, totalTime: 0 });
    }

    /**
     * KMP字符串匹配算法
     *
     * 核心思想：
     * 通过预处理模式串构建失配函数，在匹配失败时
     * 利用已匹配的信息跳过不必要的比较
     *
     * @param {string} text - 文本串
     * @param {string} pattern - 模式串
     * @returns {number[]} 所有匹配位置的数组
     * @time O(n + m)
     * @space O(m)
     */
    kmpSearch(text, pattern) {
        const startTime = performance.now();

        if (!text || !pattern || pattern.length === 0) {
            this.updateStats('kmp', performance.now() - startTime);
            return pattern.length === 0 ? [0] : [];
        }

        // 构建失配函数（LPS数组）
        const lps = this.buildLPSArray(pattern);
        const matches = [];

        let i = 0; // text的索引
        let j = 0; // pattern的索引

        while (i < text.length) {
            if (text[i] === pattern[j]) {
                i++;
                j++;

                // 找到完整匹配
                if (j === pattern.length) {
                    matches.push(i - j);
                    j = lps[j - 1];
                }
            } else if (j > 0) {
                // 利用失配函数跳过字符
                j = lps[j - 1];
            } else {
                i++;
            }
        }

        this.updateStats('kmp', performance.now() - startTime);
        return matches;
    }

    /**
     * 构建KMP算法的失配函数（LPS数组）
     *
     * 核心思想：
     * LPS[i]表示pattern[0...i]的最长相同前缀后缀的长度
     * 用于在匹配失败时确定下一个比较位置
     */
    buildLPSArray(pattern) {
        const lps = new Array(pattern.length).fill(0);
        let len = 0; // 当前最长相同前缀后缀的长度
        let i = 1;

        while (i < pattern.length) {
            if (pattern[i] === pattern[len]) {
                len++;
                lps[i] = len;
                i++;
            } else {
                if (len > 0) {
                    len = lps[len - 1];
                } else {
                    lps[i] = 0;
                    i++;
                }
            }
        }

        return lps;
    }

    /**
     * Boyer-Moore字符串匹配算法（简化版）
     *
     * 核心思想：
     * 从右向左匹配，当发生不匹配时，利用坏字符规则
     * 跳过尽可能多的字符
     *
     * @param {string} text - 文本串
     * @param {string} pattern - 模式串
     * @returns {number[]} 所有匹配位置的数组
     * @time O(nm) 最坏情况，O(n/m) 最佳情况
     * @space O(σ) σ为字符集大小
     */
    boyerMooreSearch(text, pattern) {
        const startTime = performance.now();

        if (!text || !pattern || pattern.length === 0) {
            this.updateStats('boyerMoore', performance.now() - startTime);
            return pattern.length === 0 ? [0] : [];
        }

        // 构建坏字符表
        const badCharTable = this.buildBadCharTable(pattern);
        const matches = [];

        let shift = 0;

        while (shift <= text.length - pattern.length) {
            let j = pattern.length - 1;

            // 从右向左匹配
            while (j >= 0 && pattern[j] === text[shift + j]) {
                j--;
            }

            if (j < 0) {
                // 找到匹配
                matches.push(shift);
                shift += pattern.length;
            } else {
                // 计算跳跃距离
                const badCharShift = badCharTable.get(text[shift + j]) || pattern.length;
                shift += Math.max(1, j - badCharShift);
            }
        }

        this.updateStats('boyerMoore', performance.now() - startTime);
        return matches;
    }

    /**
     * 构建Boyer-Moore算法的坏字符表
     */
    buildBadCharTable(pattern) {
        const table = new Map();

        for (let i = 0; i < pattern.length; i++) {
            table.set(pattern[i], i);
        }

        return table;
    }

    /**
     * Rabin-Karp字符串匹配算法
     *
     * 核心思想：
     * 使用滚动哈希快速比较子串，只有哈希值相等时
     * 才进行字符逐一比较
     *
     * @param {string} text - 文本串
     * @param {string} pattern - 模式串
     * @returns {number[]} 所有匹配位置的数组
     * @time O(n + m) 平均，O(nm) 最坏
     * @space O(1)
     */
    rabinKarpSearch(text, pattern) {
        const startTime = performance.now();

        if (!text || !pattern || pattern.length === 0) {
            this.updateStats('rabinKarp', performance.now() - startTime);
            return pattern.length === 0 ? [0] : [];
        }

        const matches = [];
        const base = 256; // 字符集大小
        const prime = 101; // 质数，用于取模

        let patternHash = 0;
        let textHash = 0;
        let h = 1;

        // 计算h = base^(pattern.length-1) % prime
        for (let i = 0; i < pattern.length - 1; i++) {
            h = (h * base) % prime;
        }

        // 计算模式串和文本第一个窗口的哈希值
        for (let i = 0; i < pattern.length; i++) {
            patternHash = (base * patternHash + pattern.charCodeAt(i)) % prime;
            textHash = (base * textHash + text.charCodeAt(i)) % prime;
        }

        // 滑动窗口搜索
        for (let i = 0; i <= text.length - pattern.length; i++) {
            // 哈希值相等时进行字符比较
            if (patternHash === textHash) {
                let j = 0;
                while (j < pattern.length && text[i + j] === pattern[j]) {
                    j++;
                }

                if (j === pattern.length) {
                    matches.push(i);
                }
            }

            // 计算下一个窗口的哈希值
            if (i < text.length - pattern.length) {
                textHash = (base * (textHash - text.charCodeAt(i) * h) +
                           text.charCodeAt(i + pattern.length)) % prime;

                // 处理负数情况
                if (textHash < 0) {
                    textHash += prime;
                }
            }
        }

        this.updateStats('rabinKarp', performance.now() - startTime);
        return matches;
    }

    /**
     * 支持通配符的模式匹配
     *
     * 核心思想：
     * 使用动态规划处理通配符匹配
     * '?' 匹配任意单个字符，'*' 匹配任意字符序列
     *
     * @param {string} text - 文本串
     * @param {string} pattern - 包含通配符的模式串
     * @returns {boolean} 是否匹配
     * @time O(nm)
     * @space O(nm)
     */
    wildcardMatch(text, pattern) {
        const m = text.length;
        const n = pattern.length;

        // dp[i][j] 表示 text[0...i-1] 是否匹配 pattern[0...j-1]
        const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(false));

        // 空模式匹配空文本
        dp[0][0] = true;

        // 处理模式串开头的 '*'
        for (let j = 1; j <= n; j++) {
            if (pattern[j - 1] === '*') {
                dp[0][j] = dp[0][j - 1];
            }
        }

        // 填充DP表
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (pattern[j - 1] === '*') {
                    // '*' 可以匹配空字符或任意字符
                    dp[i][j] = dp[i][j - 1] || dp[i - 1][j];
                } else if (pattern[j - 1] === '?' || text[i - 1] === pattern[j - 1]) {
                    // '?' 或字符完全匹配
                    dp[i][j] = dp[i - 1][j - 1];
                }
            }
        }

        return dp[m][n];
    }

    /**
     * 多模式串搜索（AC自动机简化版）
     *
     * 核心思想：
     * 为每个模式串独立进行搜索，然后合并结果
     * 真正的AC自动机需要构建失败函数链
     *
     * @param {string} text - 文本串
     * @param {string[]} patterns - 模式串数组
     * @returns {Object} 每个模式串的匹配位置
     */
    multiPatternSearch(text, patterns) {
        const results = {};

        for (const pattern of patterns) {
            results[pattern] = this.kmpSearch(text, pattern);
        }

        return results;
    }

    /**
     * 更新性能统计
     */
    updateStats(algorithm, time) {
        const stats = this.searchStats.get(algorithm);
        stats.count++;
        stats.totalTime += time;
    }

    /**
     * 获取性能统计
     */
    getStats() {
        const results = {};

        for (const [algorithm, stats] of this.searchStats) {
            results[algorithm] = {
                count: stats.count,
                totalTime: stats.totalTime,
                averageTime: stats.count > 0 ? stats.totalTime / stats.count : 0
            };
        }

        return results;
    }
}

// ==================== 测试函数 ====================

/**
 * 测试题目1：搜索旋转排序数组
 */
function testRotatedArraySearch() {
    console.log("=== 测试题目1：搜索旋转排序数组 ===");

    const testCases = [
        { nums: [4,5,6,7,0,1,2], target: 0, expected: 4 },
        { nums: [4,5,6,7,0,1,2], target: 3, expected: -1 },
        { nums: [1], target: 0, expected: -1 },
        { nums: [1], target: 1, expected: 0 },
        { nums: [1,3], target: 3, expected: 1 }
    ];

    console.log("方法1：标准二分搜索");
    testCases.forEach((testCase, index) => {
        const result = searchRotatedArray(testCase.nums, testCase.target);
        console.log(`测试用例${index + 1}: ${result === testCase.expected ? '✓' : '✗'}
                     输入: [${testCase.nums}], 目标: ${testCase.target},
                     期望: ${testCase.expected}, 实际: ${result}`);
    });

    console.log("\n方法2：处理重复元素");
    const duplicateTests = [
        { nums: [2,5,6,0,0,1,2], target: 0, expected: 3 },
        { nums: [2,5,6,0,0,1,2], target: 3, expected: -1 }
    ];

    duplicateTests.forEach((testCase, index) => {
        const result = searchRotatedArrayWithDuplicates(testCase.nums, testCase.target);
        console.log(`重复元素测试${index + 1}: ${result !== -1 ? '✓' : result === testCase.expected ? '✓' : '✗'}
                     输入: [${testCase.nums}], 目标: ${testCase.target}, 实际: ${result}`);
    });
}

/**
 * 测试题目2：寻找峰值元素
 */
function testFindPeakElement() {
    console.log("\n=== 测试题目2：寻找峰值元素 ===");

    const testCases = [
        { nums: [1,2,3,1], description: "单峰" },
        { nums: [1,2,1,3,5,6,4], description: "多峰" },
        { nums: [1], description: "单元素" },
        { nums: [1,2], description: "递增" },
        { nums: [2,1], description: "递减" }
    ];

    testCases.forEach((testCase, index) => {
        console.log(`\n测试用例${index + 1} (${testCase.description}): [${testCase.nums}]`);

        const binaryResult = findPeakElement(testCase.nums);
        const ternaryResult = findPeakElementTernary(testCase.nums);
        const allPeaks = findAllPeaks(testCase.nums);

        console.log(`  二分搜索结果: 索引 ${binaryResult}, 值 ${testCase.nums[binaryResult]}`);
        console.log(`  三分搜索结果: 索引 ${ternaryResult}, 值 ${testCase.nums[ternaryResult]}`);
        console.log(`  所有峰值: ${allPeaks.map(i => `索引${i}(值${testCase.nums[i]})`).join(', ')}`);
    });
}

/**
 * 测试题目3：字符串模式匹配
 */
function testStringSearch() {
    console.log("\n=== 测试题目3：字符串模式匹配 ===");

    const searchSystem = new StringSearchSystem();

    // 测试用例
    const testCases = [
        { text: "ababcababa", pattern: "ababa", description: "重叠匹配" },
        { text: "hello world", pattern: "world", description: "单次匹配" },
        { text: "aaaa", pattern: "aa", description: "多次匹配" },
        { text: "abcdef", pattern: "xyz", description: "无匹配" }
    ];

    testCases.forEach((testCase, index) => {
        console.log(`\n测试用例${index + 1} (${testCase.description}):`);
        console.log(`文本: "${testCase.text}", 模式: "${testCase.pattern}"`);

        const kmpResult = searchSystem.kmpSearch(testCase.text, testCase.pattern);
        const bmResult = searchSystem.boyerMooreSearch(testCase.text, testCase.pattern);
        const rkResult = searchSystem.rabinKarpSearch(testCase.text, testCase.pattern);

        console.log(`  KMP算法: [${kmpResult.join(', ')}]`);
        console.log(`  Boyer-Moore: [${bmResult.join(', ')}]`);
        console.log(`  Rabin-Karp: [${rkResult.join(', ')}]`);
    });

    // 测试通配符匹配
    console.log("\n通配符匹配测试:");
    const wildcardTests = [
        { text: "hello", pattern: "h*o", expected: true },
        { text: "hello", pattern: "h?llo", expected: true },
        { text: "hello", pattern: "h?l*", expected: true },
        { text: "hello", pattern: "world", expected: false }
    ];

    wildcardTests.forEach((test, index) => {
        const result = searchSystem.wildcardMatch(test.text, test.pattern);
        console.log(`  测试${index + 1}: "${test.text}" 匹配 "${test.pattern}" = ${result} ${result === test.expected ? '✓' : '✗'}`);
    });

    // 测试多模式搜索
    console.log("\n多模式搜索测试:");
    const multiResult = searchSystem.multiPatternSearch("ababcababa", ["ab", "abc", "ba"]);
    console.log("  多模式搜索结果:", multiResult);

    // 性能统计
    console.log("\n性能统计:");
    console.log(searchSystem.getStats());
}

/**
 * 运行所有测试
 */
function runAllTests() {
    console.log("搜索算法练习题测试开始...\n");

    testRotatedArraySearch();
    testFindPeakElement();
    testStringSearch();

    console.log("\n前三题测试完成！");
}

// 导出函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // 题目1
        searchRotatedArray,
        searchRotatedArrayWithDuplicates,
        searchRotatedArrayByPivot,

        // 题目2
        findPeakElement,
        findPeakElementTernary,
        findAllPeaks,

        // 题目3
        StringSearchSystem,

        // 测试函数
        runAllTests,
        testRotatedArraySearch,
        testFindPeakElement,
        testStringSearch
    };
}

// 自动运行测试
if (typeof require !== 'undefined' && require.main === module) {
    runAllTests();
}

// ==================== 题目4：二维矩阵搜索 ====================

/**
 * 二维矩阵搜索系统类
 *
 * 核心思想：
 * 提供多种二维矩阵搜索策略，针对不同的矩阵特性
 * 优化搜索性能
 */
class MatrixSearchSystem {
    constructor() {
        this.searchStats = new Map();
        this.resetStats();
    }

    resetStats() {
        this.searchStats.clear();
        this.searchStats.set('linear', { count: 0, totalTime: 0 });
        this.searchStats.set('staircase', { count: 0, totalTime: 0 });
        this.searchStats.set('binary2D', { count: 0, totalTime: 0 });
        this.searchStats.set('divideConquer', { count: 0, totalTime: 0 });
    }

    /**
     * 方法1：阶梯搜索（从右上角开始）
     *
     * 核心思想：
     * 从矩阵的右上角开始搜索，利用行列有序的性质
     * 每次比较可以排除一行或一列
     *
     * @param {number[][]} matrix - 有序矩阵
     * @param {number} target - 目标值
     * @returns {number[]} [row, col] 或 [-1, -1]
     * @time O(m + n)
     * @space O(1)
     */
    staircaseSearch(matrix, target) {
        const startTime = performance.now();

        if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
            this.updateStats('staircase', performance.now() - startTime);
            return [-1, -1];
        }

        let row = 0;
        let col = matrix[0].length - 1;

        while (row < matrix.length && col >= 0) {
            if (matrix[row][col] === target) {
                this.updateStats('staircase', performance.now() - startTime);
                return [row, col];
            } else if (matrix[row][col] > target) {
                col--; // 当前值太大，向左移动
            } else {
                row++; // 当前值太小，向下移动
            }
        }

        this.updateStats('staircase', performance.now() - startTime);
        return [-1, -1];
    }

    /**
     * 方法2：二分搜索（适用于严格有序矩阵）
     *
     * 核心思想：
     * 将二维矩阵视为一维有序数组进行二分搜索
     * 要求每行第一个元素大于前一行最后一个元素
     *
     * @param {number[][]} matrix - 严格有序矩阵
     * @param {number} target - 目标值
     * @returns {number[]} [row, col] 或 [-1, -1]
     * @time O(log(mn))
     * @space O(1)
     */
    binarySearch2D(matrix, target) {
        const startTime = performance.now();

        if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
            this.updateStats('binary2D', performance.now() - startTime);
            return [-1, -1];
        }

        const m = matrix.length;
        const n = matrix[0].length;
        let left = 0;
        let right = m * n - 1;

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            const row = Math.floor(mid / n);
            const col = mid % n;
            const value = matrix[row][col];

            if (value === target) {
                this.updateStats('binary2D', performance.now() - startTime);
                return [row, col];
            } else if (value < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        this.updateStats('binary2D', performance.now() - startTime);
        return [-1, -1];
    }

    /**
     * 方法3：分治搜索
     *
     * 核心思想：
     * 选择矩阵中间元素作为基准，将矩阵分为四个象限
     * 根据目标值与基准的关系排除不可能的象限
     *
     * @param {number[][]} matrix - 有序矩阵
     * @param {number} target - 目标值
     * @returns {number[]} [row, col] 或 [-1, -1]
     * @time O(n^log₂3) ≈ O(n^1.58)
     * @space O(log n)
     */
    divideConquerSearch(matrix, target) {
        const startTime = performance.now();

        if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
            this.updateStats('divideConquer', performance.now() - startTime);
            return [-1, -1];
        }

        const result = this.divideConquerHelper(matrix, target, 0, matrix.length - 1, 0, matrix[0].length - 1);
        this.updateStats('divideConquer', performance.now() - startTime);
        return result;
    }

    /**
     * 分治搜索的递归辅助函数
     */
    divideConquerHelper(matrix, target, rowStart, rowEnd, colStart, colEnd) {
        if (rowStart > rowEnd || colStart > colEnd) {
            return [-1, -1];
        }

        // 选择中间元素
        const midRow = Math.floor((rowStart + rowEnd) / 2);
        const midCol = Math.floor((colStart + colEnd) / 2);
        const midValue = matrix[midRow][midCol];

        if (midValue === target) {
            return [midRow, midCol];
        }

        if (midValue > target) {
            // 搜索左上、左下、右上三个象限
            let result = this.divideConquerHelper(matrix, target, rowStart, midRow - 1, colStart, colEnd);
            if (result[0] !== -1) return result;

            result = this.divideConquerHelper(matrix, target, midRow, rowEnd, colStart, midCol - 1);
            if (result[0] !== -1) return result;

            return [-1, -1];
        } else {
            // 搜索左下、右上、右下三个象限
            let result = this.divideConquerHelper(matrix, target, midRow + 1, rowEnd, colStart, midCol);
            if (result[0] !== -1) return result;

            result = this.divideConquerHelper(matrix, target, rowStart, midRow, midCol + 1, colEnd);
            if (result[0] !== -1) return result;

            result = this.divideConquerHelper(matrix, target, midRow + 1, rowEnd, midCol + 1, colEnd);
            if (result[0] !== -1) return result;

            return [-1, -1];
        }
    }

    /**
     * 方法4：范围搜索
     *
     * 核心思想：
     * 找到矩阵中在指定范围内的所有元素
     * 利用矩阵的有序性质优化搜索
     *
     * @param {number[][]} matrix - 有序矩阵
     * @param {number} minVal - 最小值
     * @param {number} maxVal - 最大值
     * @returns {Array<Array<number>>} 所有在范围内的位置
     */
    rangeSearch(matrix, minVal, maxVal) {
        const results = [];

        if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
            return results;
        }

        for (let i = 0; i < matrix.length; i++) {
            // 在每一行中进行范围搜索
            const rowResults = this.rangeSearchInRow(matrix[i], minVal, maxVal, i);
            results.push(...rowResults);
        }

        return results;
    }

    /**
     * 在单行中进行范围搜索
     */
    rangeSearchInRow(row, minVal, maxVal, rowIndex) {
        const results = [];

        // 找到最小值的位置
        const startCol = this.lowerBound(row, minVal);
        // 找到最大值的位置
        const endCol = this.upperBound(row, maxVal);

        for (let j = startCol; j < endCol; j++) {
            if (row[j] >= minVal && row[j] <= maxVal) {
                results.push([rowIndex, j, row[j]]);
            }
        }

        return results;
    }

    /**
     * 找到第一个大于等于target的位置
     */
    lowerBound(arr, target) {
        let left = 0;
        let right = arr.length;

        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (arr[mid] < target) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }

        return left;
    }

    /**
     * 找到第一个大于target的位置
     */
    upperBound(arr, target) {
        let left = 0;
        let right = arr.length;

        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (arr[mid] <= target) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }

        return left;
    }

    /**
     * 更新性能统计
     */
    updateStats(algorithm, time) {
        const stats = this.searchStats.get(algorithm);
        stats.count++;
        stats.totalTime += time;
    }

    /**
     * 获取性能统计
     */
    getStats() {
        const results = {};

        for (const [algorithm, stats] of this.searchStats) {
            results[algorithm] = {
                count: stats.count,
                totalTime: stats.totalTime,
                averageTime: stats.count > 0 ? stats.totalTime / stats.count : 0
            };
        }

        return results;
    }
}

// ==================== 题目5：搜索系统设计 ====================

/**
 * 完整的搜索引擎系统
 *
 * 核心思想：
 * 构建一个功能完整的搜索引擎，包括索引、搜索、
 * 相关性评分、模糊匹配、搜索建议等功能
 */
class SearchEngineSystem {
    constructor(options = {}) {
        // 倒排索引：词 -> {文档ID: {频率, 位置}}
        this.invertedIndex = new Map();

        // 文档存储：文档ID -> {内容, 词数, 元数据}
        this.documents = new Map();

        // 前缀树用于搜索建议
        this.trie = new TrieNode();

        // 缓存
        this.searchCache = new Map();
        this.maxCacheSize = options.maxCacheSize || 1000;

        // 统计信息
        this.stats = {
            totalDocuments: 0,
            totalWords: 0,
            searchCount: 0,
            cacheHits: 0,
            cacheSize: 0
        };

        // 配置参数
        this.config = {
            minWordLength: options.minWordLength || 2,
            maxSnippetLength: options.maxSnippetLength || 200,
            fuzzyThreshold: options.fuzzyThreshold || 0.7,
            maxSuggestions: options.maxSuggestions || 10
        };
    }

    /**
     * 添加文档到索引
     *
     * @param {string} docId - 文档ID
     * @param {string} content - 文档内容
     * @param {Object} metadata - 元数据
     */
    addDocument(docId, content, metadata = {}) {
        // 文本预处理
        const words = this.preprocessText(content);
        const wordCount = words.length;

        // 存储文档
        this.documents.set(docId, {
            content,
            words,
            wordCount,
            metadata,
            addedAt: Date.now()
        });

        // 更新倒排索引
        const wordFreq = new Map();

        words.forEach((word, position) => {
            // 统计词频
            wordFreq.set(word, (wordFreq.get(word) || 0) + 1);

            // 更新倒排索引
            if (!this.invertedIndex.has(word)) {
                this.invertedIndex.set(word, new Map());
            }

            if (!this.invertedIndex.get(word).has(docId)) {
                this.invertedIndex.get(word).set(docId, {
                    frequency: 0,
                    positions: []
                });
            }

            const docInfo = this.invertedIndex.get(word).get(docId);
            docInfo.frequency = wordFreq.get(word);
            docInfo.positions.push(position);

            // 添加到前缀树
            this.addToTrie(word);
        });

        // 更新统计信息
        this.stats.totalDocuments++;
        this.stats.totalWords += wordCount;

        // 清除相关缓存
        this.clearRelevantCache(words);
    }

    /**
     * 删除文档
     *
     * @param {string} docId - 文档ID
     */
    removeDocument(docId) {
        if (!this.documents.has(docId)) {
            return false;
        }

        const doc = this.documents.get(docId);

        // 从倒排索引中移除
        for (const word of doc.words) {
            if (this.invertedIndex.has(word)) {
                this.invertedIndex.get(word).delete(docId);

                // 如果没有文档包含这个词，删除该词
                if (this.invertedIndex.get(word).size === 0) {
                    this.invertedIndex.delete(word);
                }
            }
        }

        // 删除文档
        this.documents.delete(docId);

        // 更新统计
        this.stats.totalDocuments--;
        this.stats.totalWords -= doc.wordCount;

        // 清除缓存
        this.searchCache.clear();

        return true;
    }

    /**
     * 搜索文档
     *
     * @param {string} query - 查询字符串
     * @param {Object} options - 搜索选项
     * @returns {Array<Object>} 搜索结果
     */
    search(query, options = {}) {
        const startTime = performance.now();
        this.stats.searchCount++;

        // 检查缓存
        const cacheKey = JSON.stringify({ query, options });
        if (this.searchCache.has(cacheKey)) {
            this.stats.cacheHits++;
            return this.searchCache.get(cacheKey);
        }

        const {
            limit = 10,
            offset = 0,
            sortBy = 'relevance', // 'relevance', 'date', 'title'
            includeSnippets = true
        } = options;

        // 预处理查询
        const queryWords = this.preprocessText(query);
        if (queryWords.length === 0) {
            return [];
        }

        // 计算文档分数
        const docScores = this.calculateDocumentScores(queryWords);

        // 排序文档
        const sortedDocs = this.sortDocuments(docScores, sortBy);

        // 分页
        const paginatedDocs = sortedDocs.slice(offset, offset + limit);

        // 构建结果
        const results = paginatedDocs.map(([docId, score]) => {
            const doc = this.documents.get(docId);
            const result = {
                docId,
                score,
                title: doc.metadata.title || docId,
                metadata: doc.metadata
            };

            if (includeSnippets) {
                result.snippet = this.generateSnippet(docId, queryWords);
            }

            return result;
        });

        // 缓存结果
        this.addToCache(cacheKey, results);

        // 记录性能
        const searchTime = performance.now() - startTime;

        return {
            results,
            total: sortedDocs.length,
            searchTime,
            query: queryWords
        };
    }

    /**
     * 计算TF-IDF分数
     */
    calculateDocumentScores(queryWords) {
        const docScores = new Map();
        const totalDocs = this.stats.totalDocuments;

        for (const word of queryWords) {
            if (!this.invertedIndex.has(word)) continue;

            const wordDocs = this.invertedIndex.get(word);
            const df = wordDocs.size; // 文档频率
            const idf = Math.log(totalDocs / df); // 逆文档频率

            for (const [docId, info] of wordDocs) {
                const doc = this.documents.get(docId);
                const tf = info.frequency / doc.wordCount; // 词频
                const tfidf = tf * idf;

                docScores.set(docId, (docScores.get(docId) || 0) + tfidf);
            }
        }

        return docScores;
    }

    /**
     * 模糊搜索
     *
     * @param {string} query - 可能有拼写错误的查询
     * @param {Object} options - 搜索选项
     * @returns {Array<Object>} 搜索结果
     */
    fuzzySearch(query, options = {}) {
        const correctedQuery = this.correctSpelling(query);

        // 如果拼写纠正后的查询与原查询不同，提供建议
        const suggestions = correctedQuery !== query ?
            this.getSuggestions(query, { limit: 3 }) : [];

        const results = this.search(correctedQuery, options);

        return {
            ...results,
            originalQuery: query,
            correctedQuery,
            suggestions
        };
    }

    /**
     * 拼写纠正
     */
    correctSpelling(query) {
        const words = this.preprocessText(query);
        const correctedWords = [];

        for (const word of words) {
            let bestMatch = word;
            let maxSimilarity = 0;

            // 在索引中找到最相似的词
            for (const indexWord of this.invertedIndex.keys()) {
                const similarity = this.calculateSimilarity(word, indexWord);
                if (similarity > maxSimilarity && similarity >= this.config.fuzzyThreshold) {
                    maxSimilarity = similarity;
                    bestMatch = indexWord;
                }
            }

            correctedWords.push(bestMatch);
        }

        return correctedWords.join(' ');
    }

    /**
     * 计算两个字符串的相似度（使用Levenshtein距离）
     */
    calculateSimilarity(str1, str2) {
        const matrix = [];
        const len1 = str1.length;
        const len2 = str2.length;

        // 初始化矩阵
        for (let i = 0; i <= len1; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= len2; j++) {
            matrix[0][j] = j;
        }

        // 计算编辑距离
        for (let i = 1; i <= len1; i++) {
            for (let j = 1; j <= len2; j++) {
                if (str1[i - 1] === str2[j - 1]) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j] + 1,     // 删除
                        matrix[i][j - 1] + 1,     // 插入
                        matrix[i - 1][j - 1] + 1  // 替换
                    );
                }
            }
        }

        const distance = matrix[len1][len2];
        const maxLen = Math.max(len1, len2);
        return maxLen > 0 ? 1 - distance / maxLen : 1;
    }

    /**
     * 获取搜索建议
     *
     * @param {string} prefix - 前缀
     * @param {Object} options - 选项
     * @returns {Array<string>} 建议列表
     */
    getSuggestions(prefix, options = {}) {
        const { limit = this.config.maxSuggestions } = options;
        const suggestions = [];

        const words = this.preprocessText(prefix);
        if (words.length === 0) return suggestions;

        const lastWord = words[words.length - 1];

        // 从前缀树中获取建议
        const trieSuggestions = this.getTrieSuggestions(lastWord, limit);
        suggestions.push(...trieSuggestions);

        // 如果建议不够，添加模糊匹配的建议
        if (suggestions.length < limit) {
            const fuzzyMatches = this.getFuzzyMatches(lastWord, limit - suggestions.length);
            suggestions.push(...fuzzyMatches);
        }

        return suggestions.slice(0, limit);
    }

    /**
     * 从前缀树获取建议
     */
    getTrieSuggestions(prefix, limit) {
        const suggestions = [];
        const node = this.findTrieNode(prefix);

        if (node) {
            this.collectTrieWords(node, prefix, suggestions, limit);
        }

        return suggestions;
    }

    /**
     * 获取模糊匹配的词
     */
    getFuzzyMatches(word, limit) {
        const matches = [];

        for (const indexWord of this.invertedIndex.keys()) {
            if (indexWord.includes(word) || word.includes(indexWord)) {
                const similarity = this.calculateSimilarity(word, indexWord);
                matches.push({ word: indexWord, similarity });
            }
        }

        return matches
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, limit)
            .map(match => match.word);
    }

    /**
     * 文本预处理
     */
    preprocessText(text) {
        return text.toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length >= this.config.minWordLength);
    }

    /**
     * 生成搜索结果摘要
     */
    generateSnippet(docId, queryWords, maxLength = this.config.maxSnippetLength) {
        const doc = this.documents.get(docId);
        const content = doc.content;
        const words = content.split(/\s+/);

        // 找到包含查询词最多的窗口
        let bestStart = 0;
        let maxScore = 0;
        const windowSize = 30;

        for (let i = 0; i <= words.length - windowSize; i++) {
            let score = 0;
            const window = words.slice(i, i + windowSize);

            for (const queryWord of queryWords) {
                for (const word of window) {
                    if (word.toLowerCase().includes(queryWord.toLowerCase())) {
                        score++;
                    }
                }
            }

            if (score > maxScore) {
                maxScore = score;
                bestStart = i;
            }
        }

        const snippet = words.slice(bestStart, bestStart + windowSize).join(' ');
        return snippet.length > maxLength ?
               snippet.substring(0, maxLength) + '...' : snippet;
    }

    /**
     * 前缀树节点
     */
    addToTrie(word) {
        let node = this.trie;
        for (const char of word) {
            if (!node.children.has(char)) {
                node.children.set(char, new TrieNode());
            }
            node = node.children.get(char);
        }
        node.isEndOfWord = true;
        node.frequency = (node.frequency || 0) + 1;
    }

    findTrieNode(prefix) {
        let node = this.trie;
        for (const char of prefix) {
            if (!node.children.has(char)) {
                return null;
            }
            node = node.children.get(char);
        }
        return node;
    }

    collectTrieWords(node, prefix, suggestions, limit) {
        if (suggestions.length >= limit) return;

        if (node.isEndOfWord) {
            suggestions.push(prefix);
        }

        for (const [char, childNode] of node.children) {
            this.collectTrieWords(childNode, prefix + char, suggestions, limit);
        }
    }

    /**
     * 缓存管理
     */
    addToCache(key, value) {
        if (this.searchCache.size >= this.maxCacheSize) {
            const firstKey = this.searchCache.keys().next().value;
            this.searchCache.delete(firstKey);
        }

        this.searchCache.set(key, value);
        this.stats.cacheSize = this.searchCache.size;
    }

    clearRelevantCache(words) {
        const keysToDelete = [];

        for (const key of this.searchCache.keys()) {
            const queryData = JSON.parse(key);
            const queryWords = this.preprocessText(queryData.query);

            // 如果缓存的查询包含了新添加文档的词，清除该缓存
            if (queryWords.some(word => words.includes(word))) {
                keysToDelete.push(key);
            }
        }

        keysToDelete.forEach(key => this.searchCache.delete(key));
        this.stats.cacheSize = this.searchCache.size;
    }

    sortDocuments(docScores, sortBy) {
        const docs = Array.from(docScores.entries());

        switch (sortBy) {
            case 'date':
                return docs.sort((a, b) => {
                    const docA = this.documents.get(a[0]);
                    const docB = this.documents.get(b[0]);
                    return docB.addedAt - docA.addedAt;
                });
            case 'title':
                return docs.sort((a, b) => {
                    const docA = this.documents.get(a[0]);
                    const docB = this.documents.get(b[0]);
                    const titleA = docA.metadata.title || a[0];
                    const titleB = docB.metadata.title || b[0];
                    return titleA.localeCompare(titleB);
                });
            default: // relevance
                return docs.sort((a, b) => b[1] - a[1]);
        }
    }

    /**
     * 获取系统统计信息
     */
    getStats() {
        return {
            ...this.stats,
            indexSize: this.invertedIndex.size,
            cacheHitRate: this.stats.searchCount > 0 ?
                this.stats.cacheHits / this.stats.searchCount : 0
        };
    }

    /**
     * 清除所有数据
     */
    clear() {
        this.invertedIndex.clear();
        this.documents.clear();
        this.searchCache.clear();
        this.trie = new TrieNode();
        this.stats = {
            totalDocuments: 0,
            totalWords: 0,
            searchCount: 0,
            cacheHits: 0,
            cacheSize: 0
        };
    }
}

/**
 * 前缀树节点类
 */
class TrieNode {
    constructor() {
        this.children = new Map();
        this.isEndOfWord = false;
        this.frequency = 0;
    }
}

// ==================== 补充测试函数 ====================

/**
 * 测试题目4：二维矩阵搜索
 */
function testMatrixSearch() {
    console.log("\n=== 测试题目4：二维矩阵搜索 ===");

    const matrixSystem = new MatrixSearchSystem();

    // 测试矩阵（每行升序，每列升序）
    const matrix1 = [
        [1,  2,  8,  9],
        [2,  4,  9,  12],
        [4,  7,  10, 13],
        [6,  8,  11, 15]
    ];

    // 严格有序矩阵（适用于二分搜索）
    const matrix2 = [
        [1,  3,  5,  7],
        [10, 11, 16, 20],
        [23, 30, 34, 60]
    ];

    const testCases = [
        { matrix: matrix1, target: 7, name: "普通有序矩阵" },
        { matrix: matrix1, target: 5, name: "目标不存在" },
        { matrix: matrix2, target: 11, name: "严格有序矩阵" }
    ];

    testCases.forEach((testCase, index) => {
        console.log(`\n测试用例${index + 1} (${testCase.name}): 搜索 ${testCase.target}`);

        const stairResult = matrixSystem.staircaseSearch(testCase.matrix, testCase.target);
        const binaryResult = matrixSystem.binarySearch2D(testCase.matrix, testCase.target);
        const divideResult = matrixSystem.divideConquerSearch(testCase.matrix, testCase.target);

        console.log(`  阶梯搜索: [${stairResult.join(', ')}]`);
        console.log(`  二分搜索: [${binaryResult.join(', ')}]`);
        console.log(`  分治搜索: [${divideResult.join(', ')}]`);
    });

    // 测试范围搜索
    console.log("\n范围搜索测试:");
    const rangeResults = matrixSystem.rangeSearch(matrix1, 5, 10);
    console.log("范围 [5, 10] 内的元素:");
    rangeResults.forEach(([row, col, val]) => {
        console.log(`  位置 [${row}, ${col}]: 值 ${val}`);
    });

    // 性能统计
    console.log("\n性能统计:");
    console.log(matrixSystem.getStats());
}

/**
 * 测试题目5：搜索系统设计
 */
function testSearchEngineSystem() {
    console.log("\n=== 测试题目5：搜索系统设计 ===");

    const searchEngine = new SearchEngineSystem({
        maxCacheSize: 100,
        fuzzyThreshold: 0.6
    });

    // 添加测试文档
    const documents = [
        { id: "doc1", content: "JavaScript is a programming language for web development",
          metadata: { title: "JavaScript Basics", category: "programming" }},
        { id: "doc2", content: "Python programming language for data science and machine learning",
          metadata: { title: "Python Guide", category: "programming" }},
        { id: "doc3", content: "Web development with HTML CSS and JavaScript frameworks",
          metadata: { title: "Web Development", category: "frontend" }},
        { id: "doc4", content: "Data structures and algorithms in computer science",
          metadata: { title: "CS Fundamentals", category: "computer-science" }},
        { id: "doc5", content: "Machine learning algorithms and artificial intelligence",
          metadata: { title: "AI & ML", category: "ai" }}
    ];

    console.log("添加文档到索引...");
    documents.forEach(doc => {
        searchEngine.addDocument(doc.id, doc.content, doc.metadata);
    });

    console.log(`成功添加 ${documents.length} 个文档`);

    // 测试搜索功能
    console.log("\n=== 搜索测试 ===");

    const searchQueries = [
        "programming language",
        "web development",
        "machine learning",
        "algorithms"
    ];

    searchQueries.forEach(query => {
        console.log(`\n搜索: "${query}"`);
        const results = searchEngine.search(query, { limit: 3 });

        console.log(`找到 ${results.total} 个结果 (耗时 ${results.searchTime.toFixed(2)}ms):`);
        results.results.forEach((result, index) => {
            console.log(`  ${index + 1}. ${result.title} (评分: ${result.score.toFixed(3)})`);
            console.log(`     摘要: ${result.snippet}`);
        });
    });

    // 测试模糊搜索
    console.log("\n=== 模糊搜索测试 ===");
    const fuzzyQuery = "programing"; // 故意拼错
    console.log(`模糊搜索: "${fuzzyQuery}"`);
    const fuzzyResults = searchEngine.fuzzySearch(fuzzyQuery, { limit: 2 });

    console.log(`原始查询: "${fuzzyResults.originalQuery}"`);
    console.log(`纠正后: "${fuzzyResults.correctedQuery}"`);
    console.log(`建议: [${fuzzyResults.suggestions.join(', ')}]`);
    console.log(`结果数量: ${fuzzyResults.total}`);

    // 测试搜索建议
    console.log("\n=== 搜索建议测试 ===");
    const prefixes = ["prog", "web", "data"];

    prefixes.forEach(prefix => {
        const suggestions = searchEngine.getSuggestions(prefix, { limit: 5 });
        console.log(`前缀 "${prefix}" 的建议: [${suggestions.join(', ')}]`);
    });

    // 测试文档删除
    console.log("\n=== 文档管理测试 ===");
    console.log("删除文档 doc2...");
    const deleteResult = searchEngine.removeDocument("doc2");
    console.log(`删除结果: ${deleteResult ? '成功' : '失败'}`);

    // 再次搜索验证
    const verifyResults = searchEngine.search("Python programming");
    console.log(`删除后搜索 "Python programming": ${verifyResults.total} 个结果`);

    // 系统统计
    console.log("\n=== 系统统计 ===");
    const stats = searchEngine.getStats();
    console.log(`文档总数: ${stats.totalDocuments}`);
    console.log(`词汇总数: ${stats.totalWords}`);
    console.log(`索引大小: ${stats.indexSize}`);
    console.log(`搜索次数: ${stats.searchCount}`);
    console.log(`缓存命中率: ${(stats.cacheHitRate * 100).toFixed(1)}%`);
    console.log(`缓存大小: ${stats.cacheSize}`);
}

/**
 * 运行题目4和题目5的测试
 */
function runRemainingTests() {
    console.log("继续测试题目4和题目5...\n");

    testMatrixSearch();
    testSearchEngineSystem();

    console.log("\n所有测试完成！");
}

// 更新主测试函数
function runAllTests() {
    console.log("搜索算法练习题测试开始...\n");

    testRotatedArraySearch();
    testFindPeakElement();
    testStringSearch();
    testMatrixSearch();
    testSearchEngineSystem();

    console.log("\n所有测试完成！");
}

// 导出更新
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // 题目1
        searchRotatedArray,
        searchRotatedArrayWithDuplicates,
        searchRotatedArrayByPivot,

        // 题目2
        findPeakElement,
        findPeakElementTernary,
        findAllPeaks,

        // 题目3
        StringSearchSystem,

        // 题目4
        MatrixSearchSystem,

        // 题目5
        SearchEngineSystem,
        TrieNode,

        // 测试函数
        runAllTests,
        testRotatedArraySearch,
        testFindPeakElement,
        testStringSearch,
        testMatrixSearch,
        testSearchEngineSystem
    };
}