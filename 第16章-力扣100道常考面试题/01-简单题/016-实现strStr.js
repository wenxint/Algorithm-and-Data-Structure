/**
 * LeetCode 016: 实现strStr() (Implement strStr())
 *
 * 题目描述：
 * 给你两个字符串 haystack 和 needle，请你在 haystack 字符串中找出 needle 字符串的第一个匹配项的下标。
 * 如果 needle 不是 haystack 的一部分，则返回 -1。
 *
 * 核心思想：
 * 字符串匹配算法 - 在主串中查找模式串的首次出现位置
 *
 * 算法原理：
 * 1. 暴力匹配：逐位比较字符
 * 2. KMP算法：利用已匹配信息避免重复比较
 * 3. 内置方法：使用语言内置的字符串查找函数
 */

/**
 * 解法一：暴力匹配法
 *
 * 核心思想：
 * 在主串的每个位置尝试匹配模式串
 * 逐字符比较，不匹配时回退到下一个起始位置
 *
 * @param {string} haystack - 主字符串
 * @param {string} needle - 模式字符串
 * @returns {number} 首次匹配的位置，未找到返回-1
 * @time O(m*n) m是主串长度，n是模式串长度
 * @space O(1) 只使用常数额外空间
 */
function strStr(haystack, needle) {
    // 边界条件：模式串为空
    if (needle === '') return 0;

    const haystackLen = haystack.length;
    const needleLen = needle.length;

    // 模式串长度大于主串，不可能匹配
    if (needleLen > haystackLen) return -1;

    // 在主串中逐个位置尝试匹配
    for (let i = 0; i <= haystackLen - needleLen; i++) {
        let j = 0;

        // 逐字符比较
        while (j < needleLen && haystack[i + j] === needle[j]) {
            j++;
        }

        // 如果完全匹配，返回起始位置
        if (j === needleLen) {
            return i;
        }
    }

    return -1;
}

/**
 * 解法二：KMP算法（推荐）
 *
 * 核心思想：
 * 利用模式串的前缀和后缀的最长公共子序列信息
 * 避免在主串中回退，提高匹配效率
 *
 * @param {string} haystack - 主字符串
 * @param {string} needle - 模式字符串
 * @returns {number} 首次匹配的位置，未找到返回-1
 * @time O(m+n) 预处理O(n)，匹配O(m)
 * @space O(n) 存储next数组
 */
function strStrKMP(haystack, needle) {
    if (needle === '') return 0;

    const haystackLen = haystack.length;
    const needleLen = needle.length;

    if (needleLen > haystackLen) return -1;

    // 构建next数组（部分匹配表）
    const next = buildNext(needle);

    let i = 0; // 主串指针
    let j = 0; // 模式串指针

    while (i < haystackLen) {
        // 字符匹配，两个指针都前进
        if (haystack[i] === needle[j]) {
            i++;
            j++;

            // 完全匹配
            if (j === needleLen) {
                return i - needleLen;
            }
        }
        // 字符不匹配
        else {
            if (j > 0) {
                // 利用next数组跳过部分字符
                j = next[j - 1];
            } else {
                // 模式串指针在开头，主串指针前进
                i++;
            }
        }
    }

    return -1;
}

/**
 * 构建KMP算法的next数组
 *
 * 核心思想：
 * next[i] 表示pattern[0...i]的最长相等前后缀的长度
 *
 * @param {string} pattern - 模式字符串
 * @returns {number[]} next数组
 */
function buildNext(pattern) {
    const len = pattern.length;
    const next = new Array(len).fill(0);

    let prefixLen = 0; // 前缀长度
    let i = 1;         // 当前位置

    while (i < len) {
        if (pattern[i] === pattern[prefixLen]) {
            // 前后缀匹配，长度加1
            prefixLen++;
            next[i] = prefixLen;
            i++;
        } else {
            if (prefixLen > 0) {
                // 前后缀不匹配，回退前缀长度
                prefixLen = next[prefixLen - 1];
            } else {
                // 前缀长度为0，当前位置的next值为0
                next[i] = 0;
                i++;
            }
        }
    }

    return next;
}

/**
 * 解法三：滑动窗口哈希法（Rabin-Karp）
 *
 * 核心思想：
 * 使用滚动哈希快速比较子串，只在哈希值相等时进行字符比较
 * 避免每次都逐字符比较，提高平均性能
 *
 * @param {string} haystack - 主字符串
 * @param {string} needle - 模式字符串
 * @returns {number} 首次匹配的位置，未找到返回-1
 * @time O(m+n) 平均情况，最坏O(m*n)
 * @space O(1) 只使用常数额外空间
 */
function strStrRabinKarp(haystack, needle) {
    if (needle === '') return 0;

    const haystackLen = haystack.length;
    const needleLen = needle.length;

    if (needleLen > haystackLen) return -1;

    const base = 256;      // 字符集大小
    const mod = 101;       // 质数模数，避免哈希冲突
    let needleHash = 0;    // 模式串哈希值
    let windowHash = 0;    // 当前窗口哈希值
    let h = 1;             // base^(needleLen-1) % mod

    // 计算 base^(needleLen-1) % mod
    for (let i = 0; i < needleLen - 1; i++) {
        h = (h * base) % mod;
    }

    // 计算模式串和第一个窗口的哈希值
    for (let i = 0; i < needleLen; i++) {
        needleHash = (base * needleHash + needle.charCodeAt(i)) % mod;
        windowHash = (base * windowHash + haystack.charCodeAt(i)) % mod;
    }

    // 滑动窗口比较
    for (let i = 0; i <= haystackLen - needleLen; i++) {
        // 哈希值相等时，进行字符串比较
        if (needleHash === windowHash) {
            let match = true;
            for (let j = 0; j < needleLen; j++) {
                if (haystack[i + j] !== needle[j]) {
                    match = false;
                    break;
                }
            }
            if (match) return i;
        }

        // 计算下一个窗口的哈希值
        if (i < haystackLen - needleLen) {
            windowHash = (base * (windowHash - haystack.charCodeAt(i) * h) +
                         haystack.charCodeAt(i + needleLen)) % mod;

            // 处理负数
            if (windowHash < 0) {
                windowHash += mod;
            }
        }
    }

    return -1;
}

/**
 * 解法四：内置方法
 *
 * 核心思想：
 * 直接使用JavaScript内置的indexOf方法
 * 虽然简单，但不能展示算法思维
 *
 * @param {string} haystack - 主字符串
 * @param {string} needle - 模式字符串
 * @returns {number} 首次匹配的位置，未找到返回-1
 * @time O(m*n) 依赖于内置实现
 * @space O(1) 只使用常数额外空间
 */
function strStrBuiltIn(haystack, needle) {
    if (needle === '') return 0;
    return haystack.indexOf(needle);
}

/**
 * 解法五：双指针优化暴力法
 *
 * 核心思想：
 * 在暴力法基础上，利用字符比较的结果优化下一次比较的起始位置
 *
 * @param {string} haystack - 主字符串
 * @param {string} needle - 模式字符串
 * @returns {number} 首次匹配的位置，未找到返回-1
 * @time O(m*n) 最坏情况，但实际表现较好
 * @space O(1) 只使用常数额外空间
 */
function strStrOptimized(haystack, needle) {
    if (needle === '') return 0;

    const haystackLen = haystack.length;
    const needleLen = needle.length;

    if (needleLen > haystackLen) return -1;

    for (let i = 0; i <= haystackLen - needleLen; i++) {
        // 首字符不匹配，直接跳过
        if (haystack[i] !== needle[0]) continue;

        let j = 0;
        while (j < needleLen && haystack[i + j] === needle[j]) {
            j++;
        }

        if (j === needleLen) return i;

        // 如果匹配了多个字符但最终失败，可以根据失败位置优化跳跃距离
        // 这里简化处理，实际可以实现更复杂的跳跃逻辑
    }

    return -1;
}

// 测试用例
function runTests() {
    console.log('=== LeetCode 016: 实现strStr() 测试 ===\n');

    const testCases = [
        {
            haystack: "sadbutsad",
            needle: "sad",
            expected: 0,
            description: '基础匹配：模式串在开头'
        },
        {
            haystack: "leetcode",
            needle: "leeto",
            expected: -1,
            description: '不匹配情况'
        },
        {
            haystack: "hello",
            needle: "ll",
            expected: 2,
            description: '中间匹配'
        },
        {
            haystack: "aaaaa",
            needle: "bba",
            expected: -1,
            description: '完全不匹配'
        },
        {
            haystack: "",
            needle: "",
            expected: 0,
            description: '空字符串匹配'
        },
        {
            haystack: "a",
            needle: "a",
            expected: 0,
            description: '单字符匹配'
        },
        {
            haystack: "mississippi",
            needle: "issip",
            expected: 4,
            description: 'KMP算法测试案例'
        },
        {
            haystack: "abcabcabcabc",
            needle: "abcabc",
            expected: 0,
            description: '重复模式测试'
        }
    ];

    testCases.forEach((test, index) => {
        console.log(`测试用例 ${index + 1}: ${test.description}`);
        console.log(`主串: "${test.haystack}"`);
        console.log(`模式串: "${test.needle}"`);

        // 测试所有解法
        const result1 = strStr(test.haystack, test.needle);
        const result2 = strStrKMP(test.haystack, test.needle);
        const result3 = strStrRabinKarp(test.haystack, test.needle);
        const result4 = strStrBuiltIn(test.haystack, test.needle);
        const result5 = strStrOptimized(test.haystack, test.needle);

        console.log(`暴力匹配法结果: ${result1}`);
        console.log(`KMP算法结果: ${result2}`);
        console.log(`滑动窗口哈希法结果: ${result3}`);
        console.log(`内置方法结果: ${result4}`);
        console.log(`优化暴力法结果: ${result5}`);

        // 验证结果
        const results = [result1, result2, result3, result4, result5];
        const allCorrect = results.every(result => result === test.expected);
        console.log(`期望结果: ${test.expected}`);
        console.log(`结果验证: ${allCorrect ? '✅ 通过' : '❌ 失败'}`);
        console.log('---');
    });
}

// 性能测试
function performanceTest() {
    console.log('\n=== 性能测试 ===');

    // 创建大规模测试数据
    const longHaystack = 'a'.repeat(10000) + 'b' + 'a'.repeat(1000);
    const pattern = 'a'.repeat(500) + 'b';

    console.log(`主串长度: ${longHaystack.length}`);
    console.log(`模式串长度: ${pattern.length}`);

    console.time('暴力匹配法');
    const result1 = strStr(longHaystack, pattern);
    console.timeEnd('暴力匹配法');

    console.time('KMP算法');
    const result2 = strStrKMP(longHaystack, pattern);
    console.timeEnd('KMP算法');

    console.time('滑动窗口哈希法');
    const result3 = strStrRabinKarp(longHaystack, pattern);
    console.timeEnd('滑动窗口哈希法');

    console.time('内置方法');
    const result4 = strStrBuiltIn(longHaystack, pattern);
    console.timeEnd('内置方法');

    console.log(`所有方法结果一致: ${result1 === result2 && result2 === result3 && result3 === result4 ? '✅' : '❌'}`);
    console.log(`找到位置: ${result1}`);
}

// KMP算法详解
function kmpAlgorithmDemo() {
    console.log('\n=== KMP算法详解 ===');

    const pattern = "ABCDABCDABDE";
    console.log(`模式串: ${pattern}`);

    const next = buildNext(pattern);
    console.log('next数组构建过程:');

    for (let i = 0; i < pattern.length; i++) {
        console.log(`next[${i}] = ${next[i]} (字符 '${pattern[i]}')`);
    }

    console.log('\nKMP算法核心思想:');
    console.log('1. next[i] 表示 pattern[0...i] 的最长相等前后缀长度');
    console.log('2. 匹配失败时，利用 next 数组跳过已经匹配的部分');
    console.log('3. 避免主串指针回退，提高效率');

    console.log('\n示例匹配过程:');
    const text = "ABCDABCDABCDABCDABDE";
    console.log(`主串: ${text}`);
    console.log(`模式串: ${pattern}`);

    const result = strStrKMP(text, pattern);
    console.log(`匹配结果: 位置 ${result}`);
}

// 复杂度分析
function complexityAnalysis() {
    console.log('\n=== 算法复杂度分析 ===');

    console.log('1. 暴力匹配法:');
    console.log('   时间复杂度: O(m*n) - 最坏情况每个位置都要完全比较');
    console.log('   空间复杂度: O(1) - 只使用常数额外空间');
    console.log('   优点: 实现简单，易理解');
    console.log('   缺点: 效率低，有大量重复比较');
    console.log('');

    console.log('2. KMP算法（推荐）:');
    console.log('   时间复杂度: O(m+n) - 预处理O(n)，匹配O(m)');
    console.log('   空间复杂度: O(n) - 存储next数组');
    console.log('   优点: 线性时间复杂度，避免回退');
    console.log('   缺点: 实现复杂，需要额外空间');
    console.log('');

    console.log('3. 滑动窗口哈希法:');
    console.log('   时间复杂度: O(m+n) 平均，O(m*n) 最坏');
    console.log('   空间复杂度: O(1) - 只使用常数空间');
    console.log('   优点: 平均性能好，实现相对简单');
    console.log('   缺点: 哈希冲突时性能退化');
    console.log('');

    console.log('4. 内置方法:');
    console.log('   时间复杂度: 依赖具体实现（通常是优化的KMP或Boyer-Moore）');
    console.log('   空间复杂度: 依赖具体实现');
    console.log('   优点: 简单直接，通常经过优化');
    console.log('   缺点: 无法展示算法思维');
}

// 扩展应用
function extendedApplications() {
    console.log('\n=== 扩展应用 ===');

    console.log('1. 多模式匹配:');
    console.log('   - Aho-Corasick算法：同时查找多个模式串');
    console.log('   - 应用于关键词过滤、病毒特征检测');
    console.log('');

    console.log('2. 近似字符串匹配:');
    console.log('   - 编辑距离算法：允许一定数量的错误');
    console.log('   - 应用于拼写检查、DNA序列比对');
    console.log('');

    console.log('3. 前端应用场景:');
    console.log('   - 文本搜索和高亮');
    console.log('   - 内容过滤和敏感词检测');
    console.log('   - 代码编辑器的查找替换功能');
    console.log('   - URL路由匹配');
    console.log('');

    console.log('4. 算法优化:');
    console.log('   - Boyer-Moore算法：从右向左匹配');
    console.log('   - Sunday算法：跳跃距离更大');
    console.log('   - 后缀数组：预处理文本用于多次查询');
}

// 实际应用示例
function practicalExample() {
    console.log('\n=== 实际应用示例 ===');

    // 模拟简单的文本搜索功能
    function textSearch(content, keyword) {
        const results = [];
        let position = 0;

        while (position < content.length) {
            const index = strStrKMP(content.slice(position), keyword);
            if (index === -1) break;

            const actualPosition = position + index;
            results.push(actualPosition);
            position = actualPosition + 1; // 查找下一个出现位置
        }

        return results;
    }

    const content = "JavaScript是一种编程语言。学习JavaScript很重要。";
    const keyword = "JavaScript";

    const positions = textSearch(content, keyword);
    console.log(`文本: "${content}"`);
    console.log(`关键词: "${keyword}"`);
    console.log(`出现位置: [${positions.join(', ')}]`);

    // 高亮显示（模拟）
    let highlighted = content;
    positions.reverse().forEach(pos => {
        highlighted = highlighted.slice(0, pos) +
                     `【${keyword}】` +
                     highlighted.slice(pos + keyword.length);
    });
    console.log(`高亮结果: "${highlighted}"`);
}

// 运行测试
if (require.main === module) {
    runTests();
    performanceTest();
    kmpAlgorithmDemo();
    complexityAnalysis();
    extendedApplications();
    practicalExample();
}