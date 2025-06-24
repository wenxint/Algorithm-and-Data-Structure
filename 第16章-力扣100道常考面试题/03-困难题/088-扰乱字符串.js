/**
 * LeetCode 87. 扰乱字符串
 *
 * 问题描述：
 * 给定一个字符串 s1，我们可以把它递归地分割成两个非空子字符串，从而将其表示为二叉树。
 *
 * 下图是字符串 s1 = "great" 的一种可能的表示形式。
 *
 * 在扰乱这个字符串的过程中，我们可以挑选任何一个非叶节点，然后交换它的两个子节点。
 *
 * 给定两个长度相等的字符串 s1 和 s2，判断 s2 是否是 s1 的扰乱字符串。
 *
 * 核心思想：
 * 递归分治 + 记忆化搜索
 * 对于每个分割点k，检查两种情况：
 * 1. 不交换：s1[0...k] 对应 s2[0...k]，s1[k+1...n] 对应 s2[k+1...n]
 * 2. 交换：s1[0...k] 对应 s2[n-k...n]，s1[k+1...n] 对应 s2[0...n-k-1]
 *
 * 示例：
 * 输入：s1 = "great", s2 = "rgeat"
 * 输出：true
 * 解释：s1可以表示为二叉树，通过交换得到s2
 */

/**
 * 方法一：记忆化递归（推荐）
 *
 * 核心思想：
 * 递归检查每个可能的分割点，对于每个分割点考虑两种情况：
 * 1. 不交换左右子树
 * 2. 交换左右子树
 * 使用备忘录避免重复计算
 *
 * @param {string} s1 - 原字符串
 * @param {string} s2 - 目标字符串
 * @returns {boolean} s2是否是s1的扰乱字符串
 * @time O(n^4) 状态数n^3，每个状态计算O(n)
 * @space O(n^3) 备忘录空间
 */
function isScramble(s1, s2) {
    console.log("=== 扰乱字符串（记忆化递归） ===");
    console.log(`s1: "${s1}"`);
    console.log(`s2: "${s2}"`);

    if (s1.length !== s2.length) {
        console.log("长度不同，直接返回false");
        return false;
    }

    const n = s1.length;

    // 备忘录：memo[i][j][len] = s1从i开始长度为len的子串能否扰乱成s2从j开始长度为len的子串
    const memo = new Map();

    /**
     * 递归检查s1[i...i+len-1]能否扰乱成s2[j...j+len-1]
     * @param {number} i - s1的起始位置
     * @param {number} j - s2的起始位置
     * @param {number} len - 子串长度
     * @param {number} depth - 递归深度
     * @returns {boolean} 是否可以扰乱
     */
    function helper(i, j, len, depth = 0) {
        const indent = "  ".repeat(depth);
        const key = `${i},${j},${len}`;

        console.log(`${indent}检查: s1[${i}:${i+len}]="${s1.substr(i, len)}" -> s2[${j}:${j+len}]="${s2.substr(j, len)}"`);

        // 查备忘录
        if (memo.has(key)) {
            console.log(`${indent}备忘录命中: ${memo.get(key)}`);
            return memo.get(key);
        }

        // 基本情况：长度为1，直接比较字符
        if (len === 1) {
            const result = s1[i] === s2[j];
            console.log(`${indent}长度为1: '${s1[i]}' vs '${s2[j]}' = ${result}`);
            memo.set(key, result);
            return result;
        }

        // 基本情况：字符串相同
        if (s1.substr(i, len) === s2.substr(j, len)) {
            console.log(`${indent}字符串相同，返回true`);
            memo.set(key, true);
            return true;
        }

        // 优化：字符频次必须相同
        if (!hasSameCharFreq(s1.substr(i, len), s2.substr(j, len))) {
            console.log(`${indent}字符频次不同，返回false`);
            memo.set(key, false);
            return false;
        }

        console.log(`${indent}尝试所有分割点:`);

        // 尝试每个分割点
        for (let k = 1; k < len; k++) {
            console.log(`${indent}  分割点k=${k}:`);

            // 情况1：不交换
            const case1Left = helper(i, j, k, depth + 2);
            const case1Right = helper(i + k, j + k, len - k, depth + 2);
            const case1 = case1Left && case1Right;

            console.log(`${indent}    不交换: 左${case1Left} && 右${case1Right} = ${case1}`);

            if (case1) {
                console.log(`${indent}找到解法（不交换），返回true`);
                memo.set(key, true);
                return true;
            }

            // 情况2：交换
            const case2Left = helper(i, j + len - k, k, depth + 2);
            const case2Right = helper(i + k, j, len - k, depth + 2);
            const case2 = case2Left && case2Right;

            console.log(`${indent}    交换: 左${case2Left} && 右${case2Right} = ${case2}`);

            if (case2) {
                console.log(`${indent}找到解法（交换），返回true`);
                memo.set(key, true);
                return true;
            }
        }

        console.log(`${indent}所有分割点都失败，返回false`);
        memo.set(key, false);
        return false;
    }

    const result = helper(0, 0, n);
    console.log(`\n最终结果: ${result}`);

    return result;
}

/**
 * 方法二：动态规划（自底向上）
 *
 * 核心思想：
 * dp[i][j][len] = s1从位置i开始长度为len的子串能否扰乱成s2从位置j开始长度为len的子串
 * 从小长度到大长度逐步构建解
 *
 * @param {string} s1 - 原字符串
 * @param {string} s2 - 目标字符串
 * @returns {boolean} s2是否是s1的扰乱字符串
 * @time O(n^4) 三重循环n^3，内层循环n
 * @space O(n^3) 三维DP数组
 */
function isScrambleDP(s1, s2) {
    console.log("\n=== 扰乱字符串（动态规划） ===");
    console.log(`s1: "${s1}"`);
    console.log(`s2: "${s2}"`);

    if (s1.length !== s2.length) return false;
    if (s1 === s2) return true;

    const n = s1.length;

    // dp[i][j][len] = s1从i开始长度len能否扰乱成s2从j开始长度len
    const dp = Array(n).fill(null).map(() =>
        Array(n).fill(null).map(() =>
            Array(n + 1).fill(false)
        )
    );

    console.log("\n初始化DP表:");

    // 初始化：长度为1的情况
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            dp[i][j][1] = s1[i] === s2[j];
            if (dp[i][j][1]) {
                console.log(`dp[${i}][${j}][1] = true: '${s1[i]}' == '${s2[j]}'`);
            }
        }
    }

    console.log("\n动态规划计算过程:");

    // 按长度从小到大计算
    for (let len = 2; len <= n; len++) {
        console.log(`\n计算长度 ${len}:`);

        for (let i = 0; i <= n - len; i++) {
            for (let j = 0; j <= n - len; j++) {
                const substr1 = s1.substr(i, len);
                const substr2 = s2.substr(j, len);

                // 字符串相同的情况
                if (substr1 === substr2) {
                    dp[i][j][len] = true;
                    console.log(`  dp[${i}][${j}][${len}] = true (相同字符串): "${substr1}"`);
                    continue;
                }

                // 字符频次不同直接跳过
                if (!hasSameCharFreq(substr1, substr2)) {
                    continue;
                }

                console.log(`  检查 s1[${i}:${i+len}]="${substr1}" -> s2[${j}:${j+len}]="${substr2}"`);

                // 尝试每个分割点
                for (let k = 1; k < len && !dp[i][j][len]; k++) {
                    // 不交换的情况
                    const noSwap = dp[i][j][k] && dp[i + k][j + k][len - k];

                    // 交换的情况
                    const swap = dp[i][j + len - k][k] && dp[i + k][j][len - k];

                    if (noSwap || swap) {
                        dp[i][j][len] = true;
                        console.log(`    分割点k=${k}: ${noSwap ? '不交换' : '交换'}成功`);
                        break;
                    }
                }

                if (dp[i][j][len]) {
                    console.log(`  dp[${i}][${j}][${len}] = true`);
                }
            }
        }
    }

    const result = dp[0][0][n];
    console.log(`\nDP结果: ${result}`);

    return result;
}

/**
 * 方法三：暴力递归（教学用）
 *
 * 核心思想：
 * 纯递归，不使用备忘录，会有大量重复计算
 * 仅用于理解算法思路
 *
 * @param {string} s1 - 原字符串
 * @param {string} s2 - 目标字符串
 * @returns {boolean} s2是否是s1的扰乱字符串
 * @time O(4^n) 指数级，仅适用于小字符串
 * @space O(n) 递归栈深度
 */
function isScrambleBruteForce(s1, s2) {
    console.log("\n=== 扰乱字符串（暴力递归） ===");
    console.log(`s1: "${s1}"`);
    console.log(`s2: "${s2}"`);

    if (s1.length !== s2.length) return false;

    let callCount = 0;

    function helper(str1, str2, depth = 0) {
        callCount++;
        const indent = "  ".repeat(depth);

        if (callCount <= 100) {
            console.log(`${indent}helper("${str1}", "${str2}")`);
        }

        // 基本情况
        if (str1 === str2) {
            if (callCount <= 100) console.log(`${indent}相同字符串，返回true`);
            return true;
        }

        if (str1.length === 1) {
            if (callCount <= 100) console.log(`${indent}长度为1且不同，返回false`);
            return false;
        }

        // 字符频次检查
        if (!hasSameCharFreq(str1, str2)) {
            if (callCount <= 100) console.log(`${indent}字符频次不同，返回false`);
            return false;
        }

        const n = str1.length;

        // 尝试每个分割点
        for (let i = 1; i < n; i++) {
            // 不交换
            const case1 = helper(str1.substr(0, i), str2.substr(0, i), depth + 1) &&
                         helper(str1.substr(i), str2.substr(i), depth + 1);

            if (case1) {
                if (callCount <= 100) console.log(`${indent}找到解（不交换），返回true`);
                return true;
            }

            // 交换
            const case2 = helper(str1.substr(0, i), str2.substr(n - i), depth + 1) &&
                         helper(str1.substr(i), str2.substr(0, n - i), depth + 1);

            if (case2) {
                if (callCount <= 100) console.log(`${indent}找到解（交换），返回true`);
                return true;
            }
        }

        if (callCount <= 100) console.log(`${indent}所有情况都失败，返回false`);
        return false;
    }

    const result = helper(s1, s2);
    console.log(`\n暴力递归结果: ${result}`);
    console.log(`总调用次数: ${callCount}`);

    return result;
}

/**
 * 方法四：迭代深化搜索
 *
 * 核心思想：
 * 限制递归深度，逐步增加深度搜索
 * 可以提前找到解，避免深度优先搜索的盲目性
 *
 * @param {string} s1 - 原字符串
 * @param {string} s2 - 目标字符串
 * @returns {boolean} s2是否是s1的扰乱字符串
 * @time O(4^n) 最坏情况，但平均更好
 * @space O(n) 递归栈深度
 */
function isScrambleIterativeDeepening(s1, s2) {
    console.log("\n=== 扰乱字符串（迭代深化） ===");
    console.log(`s1: "${s1}"`);
    console.log(`s2: "${s2}"`);

    if (s1.length !== s2.length) return false;
    if (s1 === s2) return true;

    const maxDepth = s1.length * 2; // 最大深度估计

    for (let depthLimit = 1; depthLimit <= maxDepth; depthLimit++) {
        console.log(`\n尝试深度限制: ${depthLimit}`);

        const result = depthLimitedSearch(s1, s2, depthLimit);

        if (result === true) {
            console.log(`在深度${depthLimit}找到解`);
            return true;
        } else if (result === false) {
            console.log(`在深度${depthLimit}确认无解`);
            return false;
        }
        // result === 'cutoff' 继续增加深度
    }

    console.log("达到最大深度限制，返回false");
    return false;

    function depthLimitedSearch(str1, str2, limit, depth = 0) {
        if (str1 === str2) return true;

        if (depth >= limit) return 'cutoff';
        if (str1.length === 1) return false;
        if (!hasSameCharFreq(str1, str2)) return false;

        const n = str1.length;
        let cutoffOccurred = false;

        for (let i = 1; i < n; i++) {
            // 不交换
            const result1 = depthLimitedSearch(str1.substr(0, i), str2.substr(0, i), limit, depth + 1);
            if (result1 === 'cutoff') {
                cutoffOccurred = true;
            } else if (result1 === true) {
                const result2 = depthLimitedSearch(str1.substr(i), str2.substr(i), limit, depth + 1);
                if (result2 === true) return true;
                if (result2 === 'cutoff') cutoffOccurred = true;
            }

            // 交换
            const result3 = depthLimitedSearch(str1.substr(0, i), str2.substr(n - i), limit, depth + 1);
            if (result3 === 'cutoff') {
                cutoffOccurred = true;
            } else if (result3 === true) {
                const result4 = depthLimitedSearch(str1.substr(i), str2.substr(0, n - i), limit, depth + 1);
                if (result4 === true) return true;
                if (result4 === 'cutoff') cutoffOccurred = true;
            }
        }

        return cutoffOccurred ? 'cutoff' : false;
    }
}

// ===========================================
// 辅助函数
// ===========================================

/**
 * 检查两个字符串的字符频次是否相同
 * @param {string} s1 - 字符串1
 * @param {string} s2 - 字符串2
 * @returns {boolean} 字符频次是否相同
 */
function hasSameCharFreq(s1, s2) {
    if (s1.length !== s2.length) return false;

    const freq1 = {};
    const freq2 = {};

    for (let i = 0; i < s1.length; i++) {
        freq1[s1[i]] = (freq1[s1[i]] || 0) + 1;
        freq2[s2[i]] = (freq2[s2[i]] || 0) + 1;
    }

    for (const char in freq1) {
        if (freq1[char] !== freq2[char]) {
            return false;
        }
    }

    return true;
}

/**
 * 验证结果一致性
 * @param {string} s1 - 原字符串
 * @param {string} s2 - 目标字符串
 * @param {boolean[]} results - 各方法的结果
 */
function validateResults(s1, s2, results) {
    console.log("\n=== 结果验证 ===");

    const allSame = results.every(result => result === results[0]);
    console.log(`所有方法结果一致: ${allSame ? '✅' : '❌'}`);

    if (!allSame) {
        console.log(`不同结果: [${results.join(', ')}]`);
    }
}

/**
 * 可视化扰乱过程
 * @param {string} s1 - 原字符串
 * @param {string} s2 - 目标字符串
 */
function visualizeScrambling(s1, s2) {
    console.log("\n=== 扰乱过程可视化 ===");

    if (s1.length > 8) {
        console.log("字符串太长，跳过可视化");
        return;
    }

    console.log(`原字符串: "${s1}"`);
    console.log(`目标字符串: "${s2}"`);

    if (!hasSameCharFreq(s1, s2)) {
        console.log("字符频次不同，无法扰乱");
        return;
    }

    console.log("\n可能的扰乱方式（示意）:");

    // 简单展示几种可能的分割方式
    for (let i = 1; i < s1.length; i++) {
        const left = s1.substring(0, i);
        const right = s1.substring(i);

        console.log(`分割点${i}: "${left}" | "${right}"`);
        console.log(`  不交换: "${left}${right}"`);
        console.log(`  交换: "${right}${left}"`);
    }
}

/**
 * 性能测试
 */
function performanceTest() {
    console.log("\n=== 性能测试 ===");

    const testCases = [
        { s1: "great", s2: "rgeat", desc: "经典正例" },
        { s1: "abcdef", s2: "fecabd", desc: "长度6正例" },
        { s1: "abc", s2: "acb", desc: "简单正例" },
        { s1: "abc", s2: "bca", desc: "简单负例" },
        { s1: "a", s2: "a", desc: "单字符正例" },
        { s1: "a", s2: "b", desc: "单字符负例" },
        { s1: "abcd", s2: "bdac", desc: "长度4负例" },
        { s1: "hwarzkqf", s2: "qhwarzfk", desc: "复杂例子" }
    ];

    const methods = [
        { name: "记忆化递归", func: isScramble },
        { name: "动态规划", func: isScrambleDP }
    ];

    for (const testCase of testCases) {
        const { s1, s2, desc } = testCase;
        console.log(`\n测试: ${desc}`);
        console.log(`s1="${s1}", s2="${s2}"`);

        const results = [];

        for (const method of methods) {
            try {
                const startTime = performance.now();
                const result = method.func(s1, s2);
                const endTime = performance.now();

                results.push(result);
                console.log(`${method.name}: 结果=${result}, 耗时=${(endTime - startTime).toFixed(3)}ms`);
            } catch (error) {
                console.log(`${method.name}: 执行失败 - ${error.message}`);
                results.push(null);
            }
        }

        // 短字符串测试暴力方法
        if (s1.length <= 6) {
            methods.push({ name: "暴力递归", func: isScrambleBruteForce });
            try {
                const startTime = performance.now();
                const result = isScrambleBruteForce(s1, s2);
                const endTime = performance.now();

                results.push(result);
                console.log(`暴力递归: 结果=${result}, 耗时=${(endTime - startTime).toFixed(3)}ms`);
            } catch (error) {
                console.log(`暴力递归: 执行失败 - ${error.message}`);
                results.push(null);
            }
        }

        validateResults(s1, s2, results);

        if (s1.length <= 6) {
            visualizeScrambling(s1, s2);
        }
    }
}

// ===========================================
// 测试用例
// ===========================================

/**
 * 测试函数
 */
function runTests() {
    console.log("=".repeat(50));
    console.log("扰乱字符串算法测试");
    console.log("=".repeat(50));

    const testCases = [
        { s1: "great", s2: "rgeat", expected: true, description: "经典正例" },
        { s1: "abcdef", s2: "fecabd", expected: true, description: "长字符串正例" },
        { s1: "abc", s2: "acb", expected: true, description: "简单正例" },
        { s1: "abc", s2: "bca", expected: false, description: "简单负例" },
        { s1: "a", s2: "a", expected: true, description: "单字符相同" },
        { s1: "a", s2: "b", expected: false, description: "单字符不同" },
        { s1: "", s2: "", expected: true, description: "空字符串" },
        { s1: "ab", s2: "ba", expected: true, description: "两字符交换" },
        { s1: "abc", s2: "def", expected: false, description: "完全不同" }
    ];

    testCases.forEach((testCase, index) => {
        console.log(`\n${"=".repeat(30)}`);
        console.log(`测试用例 ${index + 1}: ${testCase.description}`);
        console.log(`${"=".repeat(30)}`);

        const { s1, s2, expected } = testCase;
        console.log(`s1="${s1}", s2="${s2}", 期望结果: ${expected}`);

        const methods = [
            { name: "记忆化递归", func: isScramble },
            { name: "动态规划", func: isScrambleDP }
        ];

        // 短字符串测试暴力方法
        if (s1.length <= 5) {
            methods.push(
                { name: "暴力递归", func: isScrambleBruteForce },
                { name: "迭代深化", func: isScrambleIterativeDeepening }
            );
        }

        const results = [];

        for (const method of methods) {
            console.log(`\n--- ${method.name} ---`);
            try {
                const result = method.func(s1, s2);
                results.push(result);

                const isCorrect = result === expected;
                console.log(`结果: ${result}, 期望: ${expected}, 正确: ${isCorrect ? '✅' : '❌'}`);
            } catch (error) {
                console.log(`❌ 方法执行失败: ${error.message}`);
                results.push(null);
            }
        }

        // 检查结果一致性
        console.log("\n--- 方法一致性检查 ---");
        const validResults = results.filter(r => r !== null);
        const allSame = validResults.every(result => result === validResults[0]);
        console.log(`所有方法结果一致: ${allSame ? '✅' : '❌'}`);
    });

    // 性能测试
    performanceTest();
}

// ===========================================
// 算法演示
// ===========================================

/**
 * 算法演示函数
 */
function demonstrateAlgorithm() {
    console.log("\n" + "=".repeat(50));
    console.log("扰乱字符串算法演示");
    console.log("=".repeat(50));

    console.log("问题核心:");
    console.log("1. 字符串可以递归分割成二叉树");
    console.log("2. 可以交换任意非叶节点的左右子树");
    console.log("3. 判断一个字符串是否可以通过这种操作得到另一个字符串");

    const demoS1 = "great";
    const demoS2 = "rgeat";
    console.log(`\n演示例子: s1="${demoS1}", s2="${demoS2}"`);

    console.log("\n递归分治思路:");
    console.log("• 对于每个分割点，考虑两种情况：");
    console.log("  1. 不交换：左对左，右对右");
    console.log("  2. 交换：左对右，右对左");
    console.log("• 递归检查子问题");

    console.log("\n详细演示 - 记忆化递归:");
    const result = isScramble(demoS1, demoS2);

    console.log("\n算法复杂度分析:");
    console.log("1. 记忆化递归: 时间O(n^4)，空间O(n^3)，推荐解法");
    console.log("2. 动态规划: 时间O(n^4)，空间O(n^3)，自底向上");
    console.log("3. 暴力递归: 时间O(4^n)，仅用于理解");
    console.log("4. 迭代深化: 时间O(4^n)，但可能提前找到解");

    console.log("\n关键优化:");
    console.log("• 字符频次检查：提前剪枝");
    console.log("• 记忆化搜索：避免重复计算");
    console.log("• 字符串相等检查：提前返回");

    console.log("\n实际应用场景:");
    console.log("• 字符串变换问题");
    console.log("• 树结构重组问题");
    console.log("• 递归分治算法设计");
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isScramble,
        isScrambleDP,
        isScrambleBruteForce,
        isScrambleIterativeDeepening,
        hasSameCharFreq,
        validateResults,
        visualizeScrambling,
        performanceTest,
        runTests,
        demonstrateAlgorithm
    };
}

// 如果在浏览器环境中，运行演示
if (typeof window !== 'undefined') {
    runTests();
    demonstrateAlgorithm();
}