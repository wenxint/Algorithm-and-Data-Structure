/**
 * LeetCode 100: 串联所有单词的子串 (Substring with Concatenation of All Words)
 *
 * 题目描述：
 * 给定一个字符串 s 和一个字符串数组 words。words 中所有字符串长度相同。
 * s 中的串联子串是指一个包含 words 中所有字符串以任意顺序排列连接起来的子串。
 * 例如，如果 words = ["ab","cd","ef"]，那么 "abcdef"、"abefcd"、"cdabef"、"cdefab"、"efabcd" 和 "efcdab" 都是串联子串。
 * 返回所有串联子串在 s 中的开始索引。你可以以任意顺序返回答案。
 *
 * 示例：
 * 输入：s = "barfoothefoobarman", words = ["foo","bar"]
 * 输出：[0,9]
 * 解释：从索引 0 和 9 开始的子串分别是 "barfoo" 和 "foobar" 。
 * 输出的顺序不重要, [9,0] 也是有效答案。
 *
 * 核心思想：
 * 滑动窗口 + 哈希表 - 使用固定大小的滑动窗口，配合哈希表统计单词频次
 *
 * 算法原理：
 * 1. 预处理：统计 words 中每个单词的出现频次
 * 2. 滑动窗口：窗口大小为所有单词总长度
 * 3. 单词分割：将窗口内的字符串按单词长度分割
 * 4. 频次比较：比较分割出的单词频次与目标频次是否匹配
 * 5. 优化策略：
 *    - 从每个可能的起始位置开始滑动
 *    - 使用哈希表快速统计和比较单词频次
 *    - 避免重复计算，利用前一个窗口的结果
 *
 * 关键点：
 * - 所有单词长度相同，设为 wordLen
 * - 总窗口长度为 words.length * wordLen
 * - 需要从 0 到 wordLen-1 的每个位置开始尝试
 *
 * 时间复杂度：O(n * m)，其中 n 是字符串长度，m 是单词数量
 * 空间复杂度：O(m * k)，其中 k 是单词的平均长度
 */

/**
 * 解法一：滑动窗口 + 哈希表（推荐）
 *
 * 核心思想：
 * 使用固定大小的滑动窗口，配合哈希表统计单词频次，高效匹配
 *
 * 算法步骤：
 * 1. 预处理words数组，统计每个单词的频次
 * 2. 确定窗口大小和单词长度
 * 3. 对每个可能的起始位置进行滑动窗口匹配
 * 4. 在窗口内按单词长度切分并统计频次
 * 5. 比较频次是否匹配
 *
 * @param {string} s - 源字符串
 * @param {string[]} words - 目标单词数组
 * @returns {number[]} 所有匹配位置的起始索引
 * @time O(n * m) - n为字符串长度，m为单词数量
 * @space O(m * k) - m为单词数量，k为单词长度
 */
function findSubstring(s, words) {
    if (!s || !words || words.length === 0) {
        return [];
    }

    const result = [];
    const wordLen = words[0].length;
    const totalLen = words.length * wordLen;
    const wordCount = words.length;

    // 如果字符串长度小于所需总长度，直接返回
    if (s.length < totalLen) {
        return result;
    }

    // 统计words中每个单词的频次
    const wordsFreq = new Map();
    for (const word of words) {
        wordsFreq.set(word, (wordsFreq.get(word) || 0) + 1);
    }

    // 对每个可能的起始位置进行检查
    for (let i = 0; i <= s.length - totalLen; i++) {
        const seen = new Map();
        let matchedWords = 0;

        // 按单词长度切分当前窗口
        for (let j = i; j < i + totalLen; j += wordLen) {
            const word = s.substring(j, j + wordLen);

            // 如果单词不在目标集合中，直接跳出
            if (!wordsFreq.has(word)) {
                break;
            }

            // 统计当前单词出现次数
            seen.set(word, (seen.get(word) || 0) + 1);

            // 如果某个单词出现次数超过了目标次数，跳出
            if (seen.get(word) > wordsFreq.get(word)) {
                break;
            }

            matchedWords++;
        }

        // 如果匹配的单词数量等于目标数量，说明找到了一个解
        if (matchedWords === wordCount) {
            result.push(i);
        }
    }

    return result;
}

/**
 * 解法二：优化的滑动窗口（减少重复计算）
 *
 * 核心思想：
 * 针对每个可能的起始偏移量，使用真正的滑动窗口，避免重复计算
 *
 * 算法步骤：
 * 1. 按单词长度为间隔，分组处理起始位置
 * 2. 对每组使用滑动窗口，动态维护单词频次
 * 3. 当窗口大小超过目标时，移除左侧单词
 * 4. 当窗口匹配时，记录位置
 *
 * @param {string} s - 源字符串
 * @param {string[]} words - 目标单词数组
 * @returns {number[]} 所有匹配位置的起始索引
 * @time O(n + m * k) - 更优的时间复杂度
 * @space O(m * k) - 空间复杂度相同
 */
function findSubstringOptimized(s, words) {
    if (!s || !words || words.length === 0) {
        return [];
    }

    const result = [];
    const wordLen = words[0].length;
    const totalLen = words.length * wordLen;
    const wordCount = words.length;

    if (s.length < totalLen) {
        return result;
    }

    // 统计目标单词频次
    const wordsFreq = new Map();
    for (const word of words) {
        wordsFreq.set(word, (wordsFreq.get(word) || 0) + 1);
    }

    // 对每个可能的起始偏移量使用滑动窗口
    for (let offset = 0; offset < wordLen; offset++) {
        let left = offset;
        let right = offset;
        const currentFreq = new Map();
        let matchedCount = 0;

        while (right + wordLen <= s.length) {
            // 添加右侧单词
            const rightWord = s.substring(right, right + wordLen);
            right += wordLen;

            if (wordsFreq.has(rightWord)) {
                currentFreq.set(rightWord, (currentFreq.get(rightWord) || 0) + 1);

                if (currentFreq.get(rightWord) === wordsFreq.get(rightWord)) {
                    matchedCount++;
                }
            } else {
                // 如果遇到不在words中的单词，重置窗口
                currentFreq.clear();
                matchedCount = 0;
                left = right;
                continue;
            }

            // 如果窗口过大，移除左侧单词
            while (right - left > totalLen) {
                const leftWord = s.substring(left, left + wordLen);
                left += wordLen;

                if (currentFreq.get(leftWord) === wordsFreq.get(leftWord)) {
                    matchedCount--;
                }

                currentFreq.set(leftWord, currentFreq.get(leftWord) - 1);
                if (currentFreq.get(leftWord) === 0) {
                    currentFreq.delete(leftWord);
                }
            }

            // 如果某个单词出现次数过多，移动左指针
            while (currentFreq.get(rightWord) > wordsFreq.get(rightWord)) {
                const leftWord = s.substring(left, left + wordLen);
                left += wordLen;

                if (currentFreq.get(leftWord) === wordsFreq.get(leftWord)) {
                    matchedCount--;
                }

                currentFreq.set(leftWord, currentFreq.get(leftWord) - 1);
            }

            // 检查是否找到匹配
            if (matchedCount === wordsFreq.size && right - left === totalLen) {
                result.push(left);
            }
        }
    }

    return result;
}

/**
 * 解法三：暴力解法 + 排列验证
 *
 * 核心思想：
 * 遍历所有可能的起始位置，检查每个位置是否为有效的串联子串
 *
 * 算法步骤：
 * 1. 遍历字符串的每个可能起始位置
 * 2. 提取对应长度的子串
 * 3. 将子串按单词长度切分
 * 4. 验证切分出的单词是否与words匹配
 *
 * @param {string} s - 源字符串
 * @param {string[]} words - 目标单词数组
 * @returns {number[]} 所有匹配位置的起始索引
 * @time O(n * m * k) - 更高的时间复杂度
 * @space O(m * k) - 空间复杂度相同
 */
function findSubstringBruteForce(s, words) {
    if (!s || !words || words.length === 0) {
        return [];
    }

    const result = [];
    const wordLen = words[0].length;
    const totalLen = words.length * wordLen;

    if (s.length < totalLen) {
        return result;
    }

    // 统计目标单词频次
    const wordsFreq = new Map();
    for (const word of words) {
        wordsFreq.set(word, (wordsFreq.get(word) || 0) + 1);
    }

    // 检查每个可能的起始位置
    for (let i = 0; i <= s.length - totalLen; i++) {
        if (isValidConcatenation(s, i, wordLen, totalLen, wordsFreq)) {
            result.push(i);
        }
    }

    return result;
}

/**
 * 验证指定位置是否为有效的串联子串
 * @param {string} s - 源字符串
 * @param {number} start - 起始位置
 * @param {number} wordLen - 单词长度
 * @param {number} totalLen - 总长度
 * @param {Map} wordsFreq - 目标单词频次
 * @returns {boolean} 是否为有效串联
 */
function isValidConcatenation(s, start, wordLen, totalLen, wordsFreq) {
    const seen = new Map();

    // 按单词长度切分子串
    for (let i = start; i < start + totalLen; i += wordLen) {
        const word = s.substring(i, i + wordLen);

        // 如果单词不在目标集合中，返回false
        if (!wordsFreq.has(word)) {
            return false;
        }

        seen.set(word, (seen.get(word) || 0) + 1);

        // 如果某个单词出现次数超过目标，返回false
        if (seen.get(word) > wordsFreq.get(word)) {
            return false;
        }
    }

    // 检查所有单词的频次是否完全匹配
    for (const [word, count] of wordsFreq) {
        if (seen.get(word) !== count) {
            return false;
        }
    }

    return true;
}

/**
 * 解法四：哈希表预过滤优化
 *
 * 核心思想：
 * 先快速过滤不可能的位置，然后对可能的位置进行详细检查
 *
 * @param {string} s - 源字符串
 * @param {string[]} words - 目标单词数组
 * @returns {number[]} 所有匹配位置的起始索引
 * @time O(n * m) - 平均情况下更快
 * @space O(m * k + n) - 需要额外的预过滤空间
 */
function findSubstringWithPrefilter(s, words) {
    if (!s || !words || words.length === 0) {
        return [];
    }

    const result = [];
    const wordLen = words[0].length;
    const totalLen = words.length * wordLen;

    if (s.length < totalLen) {
        return result;
    }

    // 构建单词集合用于快速查找
    const wordSet = new Set(words);
    const wordsFreq = new Map();
    for (const word of words) {
        wordsFreq.set(word, (wordsFreq.get(word) || 0) + 1);
    }

    // 预过滤：找出所有可能包含目标单词的位置
    const candidates = [];
    for (let i = 0; i <= s.length - wordLen; i++) {
        const word = s.substring(i, i + wordLen);
        if (wordSet.has(word)) {
            candidates.push(i);
        }
    }

    // 对候选位置进行详细检查
    for (const candidate of candidates) {
        if (candidate > s.length - totalLen) {
            break;
        }

        // 检查从candidate开始是否为有效串联
        const seen = new Map();
        let isValid = true;

        for (let i = candidate; i < candidate + totalLen; i += wordLen) {
            const word = s.substring(i, i + wordLen);

            if (!wordsFreq.has(word)) {
                isValid = false;
                break;
            }

            seen.set(word, (seen.get(word) || 0) + 1);
            if (seen.get(word) > wordsFreq.get(word)) {
                isValid = false;
                break;
            }
        }

        if (isValid && seen.size === wordsFreq.size) {
            let allMatch = true;
            for (const [word, count] of wordsFreq) {
                if (seen.get(word) !== count) {
                    allMatch = false;
                    break;
                }
            }
            if (allMatch) {
                result.push(candidate);
            }
        }
    }

    return result;
}

/**
 * 扩展应用：变长单词的串联子串
 *
 * 核心思想：
 * 处理单词长度不同的情况，需要使用更复杂的匹配策略
 *
 * @param {string} s - 源字符串
 * @param {string[]} words - 目标单词数组（长度可能不同）
 * @returns {number[]} 所有匹配位置的起始索引
 */
function findVariableLengthSubstring(s, words) {
    if (!s || !words || words.length === 0) {
        return [];
    }

    const result = [];
    const totalLen = words.reduce((sum, word) => sum + word.length, 0);

    if (s.length < totalLen) {
        return result;
    }

    // 生成所有可能的排列
    const permutations = generatePermutations(words);
    const targetSet = new Set(permutations);

    // 检查每个可能的起始位置
    for (let i = 0; i <= s.length - totalLen; i++) {
        const substring = s.substring(i, i + totalLen);
        if (targetSet.has(substring)) {
            result.push(i);
        }
    }

    return result;
}

/**
 * 生成字符串数组的所有排列
 * @param {string[]} words - 单词数组
 * @returns {string[]} 所有排列的字符串
 */
function generatePermutations(words) {
    if (words.length === 0) return [''];
    if (words.length === 1) return [words[0]];

    const result = [];

    for (let i = 0; i < words.length; i++) {
        const current = words[i];
        const remaining = words.slice(0, i).concat(words.slice(i + 1));
        const permutationsOfRemaining = generatePermutations(remaining);

        for (const perm of permutationsOfRemaining) {
            result.push(current + perm);
        }
    }

    return result;
}

/**
 * 性能测试和验证
 */
function runPerformanceTest() {
    console.log("=== 串联所有单词的子串算法性能测试 ===");

    const testCases = [
        {
            s: "barfoothefoobarman",
            words: ["foo", "bar"],
            expected: [0, 9]
        },
        {
            s: "wordgoodgoodgoodbestword",
            words: ["word", "good", "best", "word"],
            expected: []
        },
        {
            s: "barfoobar",
            words: ["foo", "bar"],
            expected: [0, 3]
        },
        {
            s: "lingmindraboofooowingdingbarrwingmonkeypoundcake",
            words: ["fooo", "barr", "wing", "ding", "wing"],
            expected: [13]
        }
    ];

    console.log("\n基础功能测试：");
    testCases.forEach((test, index) => {
        const result1 = findSubstring(test.s, test.words);
        const result2 = findSubstringOptimized(test.s, test.words);
        const result3 = findSubstringBruteForce(test.s, test.words);

        console.log(`测试 ${index + 1}:`);
        console.log(`  输入: s="${test.s}", words=[${test.words.map(w => `"${w}"`).join(',')}]`);
        console.log(`  基础算法: [${result1.join(',')}]`);
        console.log(`  优化算法: [${result2.join(',')}]`);
        console.log(`  暴力算法: [${result3.join(',')}]`);
        console.log(`  期望结果: [${test.expected.join(',')}]`);

        const isCorrect = JSON.stringify(result1.sort()) === JSON.stringify(test.expected.sort());
        console.log(`  结果正确: ${isCorrect ? '✓' : '✗'}`);
    });

    // 性能对比测试
    console.log("\n性能对比测试：");
    const largeS = "abcdefghijk".repeat(100);
    const largeWords = ["abc", "def", "ghi"];

    console.time("基础滑动窗口");
    findSubstring(largeS, largeWords);
    console.timeEnd("基础滑动窗口");

    console.time("优化滑动窗口");
    findSubstringOptimized(largeS, largeWords);
    console.timeEnd("优化滑动窗口");

    console.time("暴力解法");
    findSubstringBruteForce(largeS, largeWords);
    console.timeEnd("暴力解法");
}

// 测试用例
console.log("=== LeetCode 100: 串联所有单词的子串 测试 ===");

const testCases = [
    { s: "barfoothefoobarman", words: ["foo", "bar"] },
    { s: "wordgoodgoodgoodbestword", words: ["word", "good", "best", "word"] },
    { s: "barfoobar", words: ["foo", "bar"] },
    { s: "goodgoodbestword", words: ["word", "good", "best", "good"] },
    { s: "a", words: ["a"] }
];

console.log("\n解法一：基础滑动窗口");
testCases.forEach((test, index) => {
    const result = findSubstring(test.s, test.words);
    console.log(`测试 ${index + 1}: s="${test.s}", words=[${test.words.join(',')}] => [${result.join(',')}]`);
});

console.log("\n解法二：优化滑动窗口");
testCases.forEach((test, index) => {
    const result = findSubstringOptimized(test.s, test.words);
    console.log(`测试 ${index + 1}: s="${test.s}", words=[${test.words.join(',')}] => [${result.join(',')}]`);
});

console.log("\n解法三：暴力解法");
testCases.forEach((test, index) => {
    const result = findSubstringBruteForce(test.s, test.words);
    console.log(`测试 ${index + 1}: s="${test.s}", words=[${test.words.join(',')}] => [${result.join(',')}]`);
});

// 运行性能测试
runPerformanceTest();

/**
 * 调试工具：可视化匹配过程
 * @param {string} s - 源字符串
 * @param {string[]} words - 目标单词数组
 * @param {number} index - 要调试的位置
 */
function debugSubstringMatch(s, words, index) {
    console.log(`\n=== 调试位置 ${index} 的匹配过程 ===`);

    const wordLen = words[0].length;
    const totalLen = words.length * wordLen;

    if (index + totalLen > s.length) {
        console.log("位置超出范围");
        return;
    }

    const substring = s.substring(index, index + totalLen);
    console.log(`子串: "${substring}"`);

    console.log("单词分割:");
    const extractedWords = [];
    for (let i = 0; i < totalLen; i += wordLen) {
        const word = substring.substring(i, i + wordLen);
        extractedWords.push(word);
        console.log(`  位置 ${i}-${i + wordLen - 1}: "${word}"`);
    }

    const wordsFreq = new Map();
    const extractedFreq = new Map();

    for (const word of words) {
        wordsFreq.set(word, (wordsFreq.get(word) || 0) + 1);
    }

    for (const word of extractedWords) {
        extractedFreq.set(word, (extractedFreq.get(word) || 0) + 1);
    }

    console.log("\n频次比较:");
    console.log("目标频次:", Object.fromEntries(wordsFreq));
    console.log("实际频次:", Object.fromEntries(extractedFreq));

    let isMatch = wordsFreq.size === extractedFreq.size;
    for (const [word, count] of wordsFreq) {
        if (extractedFreq.get(word) !== count) {
            isMatch = false;
            break;
        }
    }

    console.log(`匹配结果: ${isMatch ? '✓' : '✗'}`);
}

// 调试示例
debugSubstringMatch("barfoothefoobarman", ["foo", "bar"], 0);
debugSubstringMatch("barfoothefoobarman", ["foo", "bar"], 9);

/**
 * 算法总结：
 *
 * 1. 基础滑动窗口（推荐）：
 *    - 时间复杂度：O(n * m)
 *    - 空间复杂度：O(m * k)
 *    - 优点：实现简单，逻辑清晰
 *    - 适用：大多数情况下的首选方案
 *
 * 2. 优化滑动窗口：
 *    - 时间复杂度：O(n + m * k)
 *    - 空间复杂度：O(m * k)
 *    - 优点：避免重复计算，性能更优
 *    - 适用：大数据量和性能敏感场景
 *
 * 3. 暴力解法：
 *    - 时间复杂度：O(n * m * k)
 *    - 空间复杂度：O(m * k)
 *    - 优点：易于理解和实现
 *    - 适用：学习目的和小数据集
 *
 * 4. 预过滤优化：
 *    - 时间复杂度：O(n * m)
 *    - 空间复杂度：O(m * k + n)
 *    - 优点：在稀疏匹配场景下性能更好
 *    - 适用：目标单词在源字符串中分布稀疏的情况
 *
 * 核心要点：
 * - 滑动窗口是解决定长子串匹配的经典方法
 * - 哈希表用于快速统计和比较频次
 * - 优化的关键在于避免重复计算
 * - 需要特别注意边界条件和单词长度
 * - 算法的选择应根据具体的数据特征
 */