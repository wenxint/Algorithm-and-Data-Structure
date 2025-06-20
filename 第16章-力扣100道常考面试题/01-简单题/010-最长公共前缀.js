/**
 * LeetCode 010: 最长公共前缀 (Longest Common Prefix)
 *
 * 题目描述：
 * 编写一个函数来查找字符串数组中的最长公共前缀。
 * 如果不存在公共前缀，返回空字符串 ""。
 *
 * 示例：
 * 输入：strs = ["flower","flow","flight"]
 * 输出："fl"
 *
 * 输入：strs = ["dog","racecar","car"]
 * 输出：""
 * 解释：输入不存在公共前缀。
 *
 * 核心思想：
 * 字符串处理和比较算法
 * 核心理念：找到所有字符串的共同开头部分，可以通过多种方式实现：
 * 1. 逐位比较 - 逐个字符比较所有字符串的相同位置
 * 2. 分治法 - 将问题分解为更小的子问题
 * 3. 二分查找 - 利用前缀长度的单调性
 * 4. 排序优化 - 只需比较排序后的第一个和最后一个字符串
 *
 * 算法原理：
 * 最长公共前缀的长度不会超过任何一个字符串的长度，
 * 且如果某个位置字符不同，则该位置之后的字符都不可能是公共前缀
 */

/**
 * 解法一：逐位比较法（推荐）
 *
 * 核心思想：
 * 以第一个字符串为基准，逐位比较所有字符串的相同位置字符
 * 一旦发现不匹配或到达某个字符串末尾，停止并返回结果
 *
 * @param {string[]} strs - 字符串数组
 * @returns {string} 最长公共前缀
 * @time O(S) S是所有字符串字符数之和，最坏情况下需要比较所有字符
 * @space O(1) 只使用常数额外空间
 */
function longestCommonPrefix(strs) {
    if (!strs || strs.length === 0) return "";
    if (strs.length === 1) return strs[0];

    // 以第一个字符串为基准
    const firstStr = strs[0];

    // 逐位比较每个字符
    for (let i = 0; i < firstStr.length; i++) {
        const char = firstStr[i];

        // 检查所有其他字符串的第i个字符
        for (let j = 1; j < strs.length; j++) {
            // 如果到达字符串末尾或字符不匹配，返回前缀
            if (i >= strs[j].length || strs[j][i] !== char) {
                return firstStr.substring(0, i);
            }
        }
    }

    // 如果完全遍历完第一个字符串，说明它就是最长公共前缀
    return firstStr;
}

/**
 * 解法二：分治法
 *
 * 核心思想：
 * 将字符串数组分为两部分，分别求出左右两部分的最长公共前缀，
 * 然后合并两个前缀得到最终结果
 *
 * @param {string[]} strs - 字符串数组
 * @returns {string} 最长公共前缀
 * @time O(S) S是所有字符串字符数之和
 * @space O(m log n) m是最长公共前缀长度，n是字符串数量（递归栈空间）
 */
function longestCommonPrefixDivideConquer(strs) {
    if (!strs || strs.length === 0) return "";

    return divideConquer(strs, 0, strs.length - 1);

    function divideConquer(strs, left, right) {
        if (left === right) {
            return strs[left];
        }

        const mid = Math.floor((left + right) / 2);
        const leftPrefix = divideConquer(strs, left, mid);
        const rightPrefix = divideConquer(strs, mid + 1, right);

        return commonPrefix(leftPrefix, rightPrefix);
    }

    function commonPrefix(str1, str2) {
        const minLength = Math.min(str1.length, str2.length);
        for (let i = 0; i < minLength; i++) {
            if (str1[i] !== str2[i]) {
                return str1.substring(0, i);
            }
        }
        return str1.substring(0, minLength);
    }
}

/**
 * 解法三：二分查找法
 *
 * 核心思想：
 * 利用前缀长度的单调性，使用二分查找确定最长公共前缀的长度
 * 前缀长度具有单调性：如果长度为x的前缀是公共的，那么长度小于x的前缀也是公共的
 *
 * @param {string[]} strs - 字符串数组
 * @returns {string} 最长公共前缀
 * @time O(S log m) S是所有字符串字符数之和，m是最短字符串长度
 * @space O(1) 只使用常数额外空间
 */
function longestCommonPrefixBinarySearch(strs) {
    if (!strs || strs.length === 0) return "";

    // 找到最短字符串的长度
    const minLength = Math.min(...strs.map(str => str.length));

    let left = 0, right = minLength;

    while (left < right) {
        const mid = Math.floor((left + right + 1) / 2);

        if (isCommonPrefix(strs, mid)) {
            left = mid; // 当前长度是公共前缀，尝试更长的
        } else {
            right = mid - 1; // 当前长度不是公共前缀，缩短长度
        }
    }

    return strs[0].substring(0, left);

    function isCommonPrefix(strs, length) {
        const prefix = strs[0].substring(0, length);
        for (let i = 1; i < strs.length; i++) {
            if (!strs[i].startsWith(prefix)) {
                return false;
            }
        }
        return true;
    }
}

/**
 * 解法四：排序优化法
 *
 * 核心思想：
 * 对字符串数组进行排序，然后只需要比较排序后的第一个和最后一个字符串
 * 因为排序后，第一个和最后一个字符串差异最大，它们的公共前缀就是所有字符串的公共前缀
 *
 * @param {string[]} strs - 字符串数组
 * @returns {string} 最长公共前缀
 * @time O(n m log n) n是字符串数量，m是平均字符串长度（排序时间）
 * @space O(n) 排序空间复杂度
 */
function longestCommonPrefixSort(strs) {
    if (!strs || strs.length === 0) return "";
    if (strs.length === 1) return strs[0];

    // 排序字符串数组
    const sortedStrs = [...strs].sort();
    const first = sortedStrs[0];
    const last = sortedStrs[sortedStrs.length - 1];

    // 只需比较第一个和最后一个字符串
    let i = 0;
    while (i < first.length && i < last.length && first[i] === last[i]) {
        i++;
    }

    return first.substring(0, i);
}

/**
 * 解法五：Trie树法
 *
 * 核心思想：
 * 构建Trie树，然后从根节点开始，沿着只有一个子节点的路径走，
 * 直到遇到有多个子节点的节点或叶子节点
 *
 * @param {string[]} strs - 字符串数组
 * @returns {string} 最长公共前缀
 * @time O(S) S是所有字符串字符数之和
 * @space O(S) Trie树的空间复杂度
 */
function longestCommonPrefixTrie(strs) {
    if (!strs || strs.length === 0) return "";

    // 构建Trie树
    class TrieNode {
        constructor() {
            this.children = new Map();
            this.isEnd = false;
        }
    }

    const root = new TrieNode();

    // 将所有字符串插入Trie树
    for (const str of strs) {
        let current = root;
        for (const char of str) {
            if (!current.children.has(char)) {
                current.children.set(char, new TrieNode());
            }
            current = current.children.get(char);
        }
        current.isEnd = true;
    }

    // 从根节点开始，找到最长公共前缀
    let prefix = "";
    let current = root;

    while (current.children.size === 1 && !current.isEnd) {
        const [char, nextNode] = current.children.entries().next().value;
        prefix += char;
        current = nextNode;
    }

    return prefix;
}

/**
 * 解法六：正则表达式法（创新解法）
 *
 * 核心思想：
 * 使用正则表达式匹配所有字符串的开头部分
 *
 * @param {string[]} strs - 字符串数组
 * @returns {string} 最长公共前缀
 * @time O(S) S是所有字符串字符数之和
 * @space O(m) m是最长公共前缀长度
 */
function longestCommonPrefixRegex(strs) {
    if (!strs || strs.length === 0) return "";
    if (strs.length === 1) return strs[0];

    let prefix = "";
    const firstStr = strs[0];

    for (let i = 0; i < firstStr.length; i++) {
        const testPrefix = firstStr.substring(0, i + 1);
        const regex = new RegExp(`^${escapeRegExp(testPrefix)}`);

        // 检查是否所有字符串都匹配这个前缀
        if (strs.every(str => regex.test(str))) {
            prefix = testPrefix;
        } else {
            break;
        }
    }

    return prefix;

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}

/**
 * 扩展功能：返回详细的前缀分析信息
 *
 * @param {string[]} strs - 字符串数组
 * @returns {Object} 包含详细分析信息的对象
 */
function longestCommonPrefixDetailed(strs) {
    if (!strs || strs.length === 0) {
        return {
            prefix: "",
            length: 0,
            strings: [],
            analysis: "空数组"
        };
    }

    if (strs.length === 1) {
        return {
            prefix: strs[0],
            length: strs[0].length,
            strings: strs,
            analysis: "单个字符串，整个字符串就是公共前缀"
        };
    }

    const prefix = longestCommonPrefix(strs);
    const minLength = Math.min(...strs.map(str => str.length));
    const maxLength = Math.max(...strs.map(str => str.length));

    return {
        prefix: prefix,
        length: prefix.length,
        strings: strs,
        stringCount: strs.length,
        minStringLength: minLength,
        maxStringLength: maxLength,
        prefixRatio: minLength > 0 ? (prefix.length / minLength * 100).toFixed(2) + '%' : '0%',
        analysis: generateAnalysis(strs, prefix)
    };

    function generateAnalysis(strs, prefix) {
        if (prefix === "") {
            return "字符串之间没有公共前缀";
        }

        const diffPositions = [];
        for (let i = prefix.length; i < Math.max(...strs.map(s => s.length)); i++) {
            const chars = new Set();
            for (const str of strs) {
                if (i < str.length) {
                    chars.add(str[i]);
                }
            }
            if (chars.size > 1) {
                diffPositions.push({
                    position: i,
                    chars: Array.from(chars)
                });
                break;
            }
        }

        return `找到长度为${prefix.length}的公共前缀"${prefix}"，分歧出现在位置${diffPositions[0]?.position || '末尾'}`;
    }
}

// 测试用例
function runTests() {
    console.log('=== LeetCode 010: 最长公共前缀 测试 ===\n');

    const testCases = [
        {
            strs: ["flower", "flow", "flight"],
            expected: "fl",
            description: '经典例子：["flower","flow","flight"] → "fl"'
        },
        {
            strs: ["dog", "racecar", "car"],
            expected: "",
            description: '无公共前缀：["dog","racecar","car"] → ""'
        },
        {
            strs: ["interspecies", "interstellar", "interstate"],
            expected: "inters",
            description: '长前缀：["interspecies","interstellar","interstate"] → "inters"'
        },
        {
            strs: ["abc"],
            expected: "abc",
            description: '单个字符串：["abc"] → "abc"'
        },
        {
            strs: [],
            expected: "",
            description: '空数组：[] → ""'
        },
        {
            strs: ["", "abc", "def"],
            expected: "",
            description: '包含空字符串：["","abc","def"] → ""'
        },
        {
            strs: ["abc", "abc", "abc"],
            expected: "abc",
            description: '相同字符串：["abc","abc","abc"] → "abc"'
        },
        {
            strs: ["a", "ab", "abc"],
            expected: "a",
            description: '逐步增长：["a","ab","abc"] → "a"'
        },
        {
            strs: ["abcdefgh", "abcdefij", "abcdeklm"],
            expected: "abcde",
            description: '中等长度前缀：长度为5的公共前缀'
        },
        {
            strs: ["programming", "program", "programmes"],
            expected: "program",
            description: '编程相关：["programming","program","programmes"] → "program"'
        }
    ];

    testCases.forEach((test, index) => {
        console.log(`测试用例 ${index + 1}: ${test.description}`);
        console.log(`输入: [${test.strs.map(s => `"${s}"`).join(', ')}]`);

        // 测试各种解法
        const result1 = longestCommonPrefix([...test.strs]);
        const result2 = longestCommonPrefixDivideConquer([...test.strs]);
        const result3 = longestCommonPrefixBinarySearch([...test.strs]);
        const result4 = longestCommonPrefixSort([...test.strs]);
        const result5 = longestCommonPrefixTrie([...test.strs]);
        const result6 = longestCommonPrefixRegex([...test.strs]);
        const detailed = longestCommonPrefixDetailed([...test.strs]);

        console.log(`逐位比较法: "${result1}"`);
        console.log(`分治法: "${result2}"`);
        console.log(`二分查找法: "${result3}"`);
        console.log(`排序优化法: "${result4}"`);
        console.log(`Trie树法: "${result5}"`);
        console.log(`正则表达式法: "${result6}"`);
        console.log(`详细分析: ${detailed.analysis}`);

        // 验证结果
        const isCorrect = result1 === test.expected;
        const allSame = [result1, result2, result3, result4, result5, result6].every(r => r === result1);
        console.log(`结果验证: ${isCorrect ? '✅ 通过' : '❌ 失败'}`);
        console.log(`方法一致性: ${allSame ? '✅ 所有方法结果一致' : '❌ 方法结果不一致'}`);
        console.log('---');
    });
}

// 可视化演示
function visualDemo() {
    console.log('\n=== 逐位比较法可视化演示 ===');

    const strs = ["flower", "flow", "flight"];
    console.log(`字符串数组: [${strs.map(s => `"${s}"`).join(', ')}]`);
    console.log('\n逐位比较过程:');

    const firstStr = strs[0];
    let commonPrefix = "";

    for (let i = 0; i < firstStr.length; i++) {
        const char = firstStr[i];
        console.log(`\n检查位置 ${i}, 字符 '${char}':`);

        // 显示所有字符串在当前位置的字符
        for (let j = 0; j < strs.length; j++) {
            const currentChar = i < strs[j].length ? strs[j][i] : '(超出长度)';
            const visualization = strs[j].split('').map((c, idx) => {
                if (idx < i) return c;
                if (idx === i) return `[${c}]`;
                return c;
            }).join('');
            console.log(`  "${strs[j]}" → ${visualization} → 位置${i}: '${currentChar}'`);
        }

        // 检查是否所有字符串在当前位置都有相同字符
        let allMatch = true;
        for (let j = 1; j < strs.length; j++) {
            if (i >= strs[j].length || strs[j][i] !== char) {
                allMatch = false;
                console.log(`  ❌ "${strs[j]}" 在位置 ${i} 不匹配`);
                break;
            }
        }

        if (allMatch) {
            commonPrefix += char;
            console.log(`  ✅ 所有字符串在位置 ${i} 都是 '${char}'`);
            console.log(`  当前公共前缀: "${commonPrefix}"`);
        } else {
            console.log(`  停止比较，最长公共前缀: "${commonPrefix}"`);
            break;
        }
    }

    console.log(`\n最终结果: "${commonPrefix}"`);
}

// 分治法可视化
function visualDivideConquer() {
    console.log('\n=== 分治法可视化演示 ===');

    const strs = ["flower", "flow", "flight", "fly"];
    console.log(`字符串数组: [${strs.map(s => `"${s}"`).join(', ')}]`);

    function visualDivide(strs, left, right, depth = 0) {
        const indent = '  '.repeat(depth);
        console.log(`${indent}处理区间 [${left}, ${right}]: [${strs.slice(left, right + 1).map(s => `"${s}"`).join(', ')}]`);

        if (left === right) {
            console.log(`${indent}返回: "${strs[left]}"`);
            return strs[left];
        }

        const mid = Math.floor((left + right) / 2);
        console.log(`${indent}分治点: ${mid}`);

        const leftResult = visualDivide(strs, left, mid, depth + 1);
        const rightResult = visualDivide(strs, mid + 1, right, depth + 1);

        // 合并结果
        const merged = commonPrefix(leftResult, rightResult);
        console.log(`${indent}合并 "${leftResult}" 和 "${rightResult}" → "${merged}"`);

        return merged;
    }

    function commonPrefix(str1, str2) {
        const minLength = Math.min(str1.length, str2.length);
        for (let i = 0; i < minLength; i++) {
            if (str1[i] !== str2[i]) {
                return str1.substring(0, i);
            }
        }
        return str1.substring(0, minLength);
    }

    const result = visualDivide(strs, 0, strs.length - 1);
    console.log(`\n最终结果: "${result}"`);
}

// 性能测试
function performanceTest() {
    console.log('\n=== 性能对比测试 ===');

    const testSizes = [100, 1000, 5000];

    testSizes.forEach(size => {
        console.log(`\n测试规模: ${size} 个字符串`);

        // 生成测试数据：有公共前缀的字符串
        const commonPrefix = "commonprefix";
        const strs = [];
        for (let i = 0; i < size; i++) {
            const suffix = Math.random().toString(36).substring(2, 10);
            strs.push(commonPrefix + suffix);
        }

        console.log(`生成的字符串平均长度: ${Math.floor(strs.reduce((sum, s) => sum + s.length, 0) / strs.length)}`);
        console.log(`期望公共前缀: "${commonPrefix}"`);

        // 测试不同方法
        console.time('逐位比较法');
        const result1 = longestCommonPrefix([...strs]);
        console.timeEnd('逐位比较法');

        console.time('分治法');
        const result2 = longestCommonPrefixDivideConquer([...strs]);
        console.timeEnd('分治法');

        console.time('二分查找法');
        const result3 = longestCommonPrefixBinarySearch([...strs]);
        console.timeEnd('二分查找法');

        console.time('排序优化法');
        const result4 = longestCommonPrefixSort([...strs]);
        console.timeEnd('排序优化法');

        // Trie树法在大数据时可能较慢
        if (size <= 1000) {
            console.time('Trie树法');
            const result5 = longestCommonPrefixTrie([...strs]);
            console.timeEnd('Trie树法');
        } else {
            console.log('Trie树法: 跳过（数据量太大）');
        }

        console.log(`实际公共前缀长度: ${result1.length}`);
    });
}

// 复杂度分析
function complexityAnalysis() {
    console.log('\n=== 算法复杂度分析 ===');

    console.log('1. 逐位比较法（推荐）:');
    console.log('   时间复杂度: O(S) - S是所有字符串字符数之和');
    console.log('   空间复杂度: O(1) - 只使用常数额外空间');
    console.log('   优点: 简单直观，空间效率高，适合大多数情况');
    console.log('   缺点: 在最坏情况下需要检查所有字符');

    console.log('\n2. 分治法:');
    console.log('   时间复杂度: O(S) - S是所有字符串字符数之和');
    console.log('   空间复杂度: O(m log n) - m是前缀长度，n是字符串数量');
    console.log('   优点: 思路清晰，适合并行处理');
    console.log('   缺点: 递归调用开销，空间复杂度较高');

    console.log('\n3. 二分查找法:');
    console.log('   时间复杂度: O(S log m) - S是字符数和，m是最短字符串长度');
    console.log('   空间复杂度: O(1) - 只使用常数额外空间');
    console.log('   优点: 利用了前缀长度的单调性');
    console.log('   缺点: 对于短前缀可能不如直接比较');

    console.log('\n4. 排序优化法:');
    console.log('   时间复杂度: O(n m log n) - n是字符串数量，m是平均长度');
    console.log('   空间复杂度: O(n) - 排序需要额外空间');
    console.log('   优点: 只需比较两个字符串，思路巧妙');
    console.log('   缺点: 排序开销大，可能不如直接方法');

    console.log('\n5. Trie树法:');
    console.log('   时间复杂度: O(S) - 构建和查找都是线性时间');
    console.log('   空间复杂度: O(S) - 需要存储所有字符');
    console.log('   优点: 可以处理更复杂的前缀查询');
    console.log('   缺点: 空间开销大，对于简单问题过于复杂');

    console.log('\n推荐解法: 逐位比较法');
    console.log('理由: 简单高效，空间复杂度最优，易于理解和实现');
}

// 字符串处理技巧总结
function stringProcessingTechniques() {
    console.log('\n=== 字符串处理技巧总结 ===');

    console.log('常见字符串算法问题:');
    console.log('1. 最长公共前缀（本题）');
    console.log('2. 最长公共子序列');
    console.log('3. 最长回文子串');
    console.log('4. 字符串匹配（KMP算法）');
    console.log('5. 编辑距离');
    console.log('6. 字符串压缩');

    console.log('\n字符串比较技巧:');
    console.log('- 逐字符比较：适用于前缀、后缀问题');
    console.log('- 双指针：适用于回文、匹配问题');
    console.log('- 滑动窗口：适用于子串问题');
    console.log('- 哈希表：适用于字符统计问题');

    // 演示相关字符串问题
    console.log('\n相关问题示例:');

    // 最长公共后缀
    function longestCommonSuffix(strs) {
        if (!strs || strs.length === 0) return "";

        const firstStr = strs[0];
        for (let i = firstStr.length - 1; i >= 0; i--) {
            const suffix = firstStr.substring(i);
            if (strs.every(str => str.endsWith(suffix))) {
                return suffix;
            }
        }
        return "";
    }

    const suffixExample = ["testing", "running", "jumping"];
    console.log(`最长公共后缀: [${suffixExample.map(s => `"${s}"`).join(', ')}] → "${longestCommonSuffix(suffixExample)}"`);

    // 字符串距离（编辑距离简化版）
    function stringDistance(str1, str2) {
        let distance = 0;
        const maxLength = Math.max(str1.length, str2.length);

        for (let i = 0; i < maxLength; i++) {
            const char1 = i < str1.length ? str1[i] : '';
            const char2 = i < str2.length ? str2[i] : '';
            if (char1 !== char2) distance++;
        }

        return distance;
    }

    console.log(`字符串距离: "abc" 和 "abd" → ${stringDistance("abc", "abd")}`);
    console.log(`字符串距离: "hello" 和 "world" → ${stringDistance("hello", "world")}`);
}

// 实际应用场景
function practicalApplications() {
    console.log('\n=== 实际应用场景 ===');

    console.log('1. 文件路径处理:');
    console.log('   - 找到多个文件的共同目录路径');
    console.log('   - 文件系统中的路径优化');

    console.log('\n2. URL处理:');
    console.log('   - 网站URL的公共前缀提取');
    console.log('   - API接口的基础路径');

    console.log('\n3. 搜索引擎:');
    console.log('   - 搜索建议的公共前缀');
    console.log('   - 搜索结果的相关性分析');

    console.log('\n4. 数据库优化:');
    console.log('   - 索引前缀压缩');
    console.log('   - 字符串存储优化');

    // 模拟实际应用
    console.log('\n模拟应用：文件路径公共目录提取');
    const filePaths = [
        "/home/user/documents/projects/project1/src/main.js",
        "/home/user/documents/projects/project1/src/utils.js",
        "/home/user/documents/projects/project1/tests/test.js"
    ];

    console.log('文件路径:');
    filePaths.forEach(path => console.log(`  ${path}`));

    const commonPath = longestCommonPrefix(filePaths);
    console.log(`\n公共路径: ${commonPath}`);
    console.log('优化后的相对路径:');
    filePaths.forEach(path => {
        const relativePath = path.substring(commonPath.length);
        console.log(`  ${relativePath || '.'}`);
    });

    console.log('\n模拟应用：API接口基础路径');
    const apiUrls = [
        "https://api.example.com/v1/users/profile",
        "https://api.example.com/v1/users/settings",
        "https://api.example.com/v1/users/history"
    ];

    console.log('API URLs:');
    apiUrls.forEach(url => console.log(`  ${url}`));

    const baseUrl = longestCommonPrefix(apiUrls);
    console.log(`\n基础URL: ${baseUrl}`);
    console.log('简化后的端点:');
    apiUrls.forEach(url => {
        const endpoint = url.substring(baseUrl.length);
        console.log(`  ${endpoint}`);
    });
}

// 问题变形和扩展
function problemVariants() {
    console.log('\n=== 问题变形和扩展 ===');

    console.log('1. 最长公共子串（连续）:');
    function longestCommonSubstring(strs) {
        if (!strs || strs.length === 0) return "";

        const first = strs[0];
        let longest = "";

        for (let i = 0; i < first.length; i++) {
            for (let j = i + 1; j <= first.length; j++) {
                const substr = first.substring(i, j);
                if (strs.every(str => str.includes(substr)) && substr.length > longest.length) {
                    longest = substr;
                }
            }
        }

        return longest;
    }

    const substrExample = ["abcdef", "xyzabc", "abc123"];
    console.log(`   输入: [${substrExample.map(s => `"${s}"`).join(', ')}]`);
    console.log(`   最长公共子串: "${longestCommonSubstring(substrExample)}"`);

    console.log('\n2. K个字符串的最长公共前缀:');
    function kLongestCommonPrefix(strs, k) {
        if (k > strs.length) return "";

        // 找到所有k个字符串的组合中最长的公共前缀
        let maxPrefix = "";

        function combinations(arr, k) {
            if (k === 1) return arr.map(x => [x]);
            if (k === arr.length) return [arr];

            const result = [];
            for (let i = 0; i <= arr.length - k; i++) {
                const head = arr[i];
                const tailCombinations = combinations(arr.slice(i + 1), k - 1);
                for (const tail of tailCombinations) {
                    result.push([head, ...tail]);
                }
            }
            return result;
        }

        const combos = combinations(strs, k);
        for (const combo of combos) {
            const prefix = longestCommonPrefix(combo);
            if (prefix.length > maxPrefix.length) {
                maxPrefix = prefix;
            }
        }

        return maxPrefix;
    }

    const kExample = ["abc", "def", "abcd", "abef"];
    const k = 2;
    console.log(`   输入: [${kExample.map(s => `"${s}"`).join(', ')}], k=${k}`);
    console.log(`   任意${k}个字符串的最长公共前缀: "${kLongestCommonPrefix(kExample, k)}"`);

    console.log('\n3. 忽略大小写的公共前缀:');
    function longestCommonPrefixIgnoreCase(strs) {
        return longestCommonPrefix(strs.map(str => str.toLowerCase()));
    }

    const caseExample = ["Hello", "HELP", "helicopter"];
    console.log(`   输入: [${caseExample.map(s => `"${s}"`).join(', ')}]`);
    console.log(`   忽略大小写: "${longestCommonPrefixIgnoreCase(caseExample)}"`);

    console.log('\n4. 带通配符的公共前缀:');
    function longestCommonPrefixWildcard(strs, wildcard = '*') {
        // 简化版本：将通配符视为可匹配任意字符
        if (!strs || strs.length === 0) return "";

        const firstStr = strs[0];
        for (let i = 0; i < firstStr.length; i++) {
            const charSet = new Set();

            for (const str of strs) {
                if (i >= str.length) return firstStr.substring(0, i);
                charSet.add(str[i]);
            }

            // 如果有通配符，认为该位置匹配
            if (!charSet.has(wildcard) && charSet.size > 1) {
                return firstStr.substring(0, i);
            }
        }

        return firstStr;
    }

    const wildcardExample = ["ab*d", "abcd", "ab*d"];
    console.log(`   输入: [${wildcardExample.map(s => `"${s}"`).join(', ')}]`);
    console.log(`   带通配符: "${longestCommonPrefixWildcard(wildcardExample)}"`);
}

// 运行所有测试
if (require.main === module) {
    runTests();
    visualDemo();
    visualDivideConquer();
    performanceTest();
    complexityAnalysis();
    stringProcessingTechniques();
    practicalApplications();
    problemVariants();
}

// 导出函数供其他模块使用
module.exports = {
    longestCommonPrefix,
    longestCommonPrefixDivideConquer,
    longestCommonPrefixBinarySearch,
    longestCommonPrefixSort,
    longestCommonPrefixTrie,
    longestCommonPrefixRegex,
    longestCommonPrefixDetailed
};