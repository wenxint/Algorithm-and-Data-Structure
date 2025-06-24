/**
 * LeetCode 49. 字母异位词分组
 *
 * 问题描述：
 * 给你一个字符串数组，请你将字母异位词组合在一起。可以按任意顺序返回结果列表。
 * 字母异位词是由重新排列源单词的字母得到的一个新单词，所有源单词中的字母都恰好只用一次。
 *
 * 核心思想：
 * 字母异位词的关键特征是包含相同的字符和相同的字符数量，只是顺序不同
 * 主要解法有：
 * 1. 排序分组 - O(n * k log k)，k为字符串平均长度
 * 2. 字符计数分组 - O(n * k)
 * 3. 质数编码分组 - O(n * k)
 * 4. 暴力比较 - O(n² * k)
 *
 * 示例：
 * 输入：strs = ["eat", "tea", "tan", "ate", "nat", "bat"]
 * 输出：[["bat"],["nat","tan"],["ate","eat","tea"]]
 */

/**
 * 方法一：排序分组（推荐）
 *
 * 核心思想：
 * 字母异位词排序后会得到相同的字符串
 * 使用排序后的字符串作为键，将异位词分组
 * 这是最直观和常用的解法
 *
 * 算法步骤：
 * 1. 遍历字符串数组
 * 2. 对每个字符串进行字符排序
 * 3. 使用排序后的字符串作为Map的键
 * 4. 将原字符串添加到对应的分组中
 *
 * @param {string[]} strs - 字符串数组
 * @returns {string[][]} 分组后的字母异位词数组
 * @time O(n * k log k) n为字符串数量，k为字符串平均长度
 * @space O(n * k) 用于存储结果和Map
 */
function groupAnagrams(strs) {
    console.log("=== 字母异位词分组（排序法） ===");
    console.log(`输入字符串数组: [${strs.map(s => `"${s}"`).join(', ')}]`);

    if (!strs || strs.length === 0) {
        console.log("输入为空，返回空数组");
        return [];
    }

    const anagramMap = new Map();

    console.log("\n开始分组过程:");

    for (let i = 0; i < strs.length; i++) {
        const str = strs[i];

        // 对字符串进行排序，作为分组的键
        const sortedKey = str.split('').sort().join('');

        console.log(`\n处理字符串 "${str}":`);
        console.log(`  排序后的键: "${sortedKey}"`);

        // 如果Map中没有这个键，创建新的分组
        if (!anagramMap.has(sortedKey)) {
            anagramMap.set(sortedKey, []);
            console.log(`  创建新分组，键: "${sortedKey}"`);
        }

        // 将当前字符串添加到对应分组
        anagramMap.get(sortedKey).push(str);
        console.log(`  添加到分组: [${anagramMap.get(sortedKey).map(s => `"${s}"`).join(', ')}]`);

        // 显示当前所有分组状态
        console.log("  当前分组状态:");
        for (const [key, group] of anagramMap) {
            console.log(`    "${key}": [${group.map(s => `"${s}"`).join(', ')}]`);
        }
    }

    // 将Map的值转换为数组返回
    const result = Array.from(anagramMap.values());

    console.log(`\n最终结果: [${result.map(group =>
        `[${group.map(s => `"${s}"`).join(', ')}]`
    ).join(', ')}]`);

    return result;
}

/**
 * 方法二：字符计数分组
 *
 * 核心思想：
 * 字母异位词有相同的字符频次分布
 * 使用字符计数数组或字符串作为键进行分组
 * 避免了排序操作，时间复杂度更优
 *
 * @param {string[]} strs - 字符串数组
 * @returns {string[][]} 分组后的字母异位词数组
 * @time O(n * k) n为字符串数量，k为字符串平均长度
 * @space O(n * k)
 */
function groupAnagramsByCount(strs) {
    console.log("\n=== 字母异位词分组（计数法） ===");
    console.log(`输入字符串数组: [${strs.map(s => `"${s}"`).join(', ')}]`);

    if (!strs || strs.length === 0) {
        return [];
    }

    const anagramMap = new Map();

    console.log("\n开始计数分组:");

    for (let i = 0; i < strs.length; i++) {
        const str = strs[i];

        // 创建字符计数数组（假设只有小写字母a-z）
        const charCount = new Array(26).fill(0);

        console.log(`\n处理字符串 "${str}":`);

        // 统计每个字符的出现次数
        for (let j = 0; j < str.length; j++) {
            const charIndex = str.charCodeAt(j) - 'a'.charCodeAt(0);
            charCount[charIndex]++;
        }

        // 将计数数组转换为字符串作为键
        const countKey = charCount.join(',');
        console.log(`  字符计数: ${countKey}`);

        // 分组逻辑
        if (!anagramMap.has(countKey)) {
            anagramMap.set(countKey, []);
            console.log(`  创建新分组，键: "${countKey}"`);
        }

        anagramMap.get(countKey).push(str);
        console.log(`  添加到分组: [${anagramMap.get(countKey).map(s => `"${s}"`).join(', ')}]`);

        // 显示字符频次详情
        const nonZeroChars = [];
        for (let k = 0; k < 26; k++) {
            if (charCount[k] > 0) {
                const char = String.fromCharCode('a'.charCodeAt(0) + k);
                nonZeroChars.push(`${char}:${charCount[k]}`);
            }
        }
        console.log(`  字符频次: {${nonZeroChars.join(', ')}}`);
    }

    const result = Array.from(anagramMap.values());

    console.log(`\n计数法最终结果: [${result.map(group =>
        `[${group.map(s => `"${s}"`).join(', ')}]`
    ).join(', ')}]`);

    return result;
}

/**
 * 方法三：质数编码分组
 *
 * 核心思想：
 * 给每个字母分配一个质数，异位词的质数乘积相同
 * 利用质数分解的唯一性来判断异位词关系
 * 适用于字符串较短的情况，避免整数溢出
 *
 * @param {string[]} strs - 字符串数组
 * @returns {string[][]} 分组后的字母异位词数组
 * @time O(n * k)
 * @space O(n * k)
 */
function groupAnagramsByPrime(strs) {
    console.log("\n=== 字母异位词分组（质数编码法） ===");
    console.log(`输入字符串数组: [${strs.map(s => `"${s}"`).join(', ')}]`);

    if (!strs || strs.length === 0) {
        return [];
    }

    // 26个质数对应26个小写字母
    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101];

    const anagramMap = new Map();

    console.log("\n质数映射表:");
    console.log("a->2, b->3, c->5, d->7, e->11, f->13, g->17, h->19, i->23, j->29");
    console.log("k->31, l->37, m->41, n->43, o->47, p->53, q->59, r->61, s->67, t->71");
    console.log("u->73, v->79, w->83, x->89, y->97, z->101");

    console.log("\n开始质数编码分组:");

    for (let i = 0; i < strs.length; i++) {
        const str = strs[i];
        let primeProduct = 1;

        console.log(`\n处理字符串 "${str}":`);

        const calculations = [];

        // 计算质数乘积
        for (let j = 0; j < str.length; j++) {
            const charIndex = str.charCodeAt(j) - 'a'.charCodeAt(0);
            const prime = primes[charIndex];
            primeProduct *= prime;
            calculations.push(`${str[j]}(${prime})`);
        }

        console.log(`  字符质数映射: ${calculations.join(' × ')}`);
        console.log(`  质数乘积: ${primeProduct}`);

        // 分组逻辑
        if (!anagramMap.has(primeProduct)) {
            anagramMap.set(primeProduct, []);
            console.log(`  创建新分组，质数积: ${primeProduct}`);
        }

        anagramMap.get(primeProduct).push(str);
        console.log(`  添加到分组: [${anagramMap.get(primeProduct).map(s => `"${s}"`).join(', ')}]`);
    }

    const result = Array.from(anagramMap.values());

    console.log(`\n质数编码法最终结果: [${result.map(group =>
        `[${group.map(s => `"${s}"`).join(', ')}]`
    ).join(', ')}]`);

    return result;
}

/**
 * 方法四：暴力比较法
 *
 * 核心思想：
 * 对每个字符串，检查它是否与已有分组中的字符串是异位词
 * 如果是，添加到该分组；否则创建新分组
 * 时间复杂度较高，但不需要额外的键计算
 *
 * @param {string[]} strs - 字符串数组
 * @returns {string[][]} 分组后的字母异位词数组
 * @time O(n² * k)
 * @space O(n * k)
 */
function groupAnagramsBruteForce(strs) {
    console.log("\n=== 字母异位词分组（暴力法） ===");
    console.log(`输入字符串数组: [${strs.map(s => `"${s}"`).join(', ')}]`);

    if (!strs || strs.length === 0) {
        return [];
    }

    const groups = [];

    console.log("\n开始暴力分组:");

    for (let i = 0; i < strs.length; i++) {
        const currentStr = strs[i];
        let foundGroup = false;

        console.log(`\n处理字符串 "${currentStr}":`);

        // 检查是否与现有分组匹配
        for (let j = 0; j < groups.length; j++) {
            const groupRepresentative = groups[j][0];

            console.log(`  检查与分组${j}的代表字符串"${groupRepresentative}"是否为异位词`);

            if (areAnagrams(currentStr, groupRepresentative)) {
                groups[j].push(currentStr);
                foundGroup = true;
                console.log(`  ✅ 是异位词，添加到分组${j}: [${groups[j].map(s => `"${s}"`).join(', ')}]`);
                break;
            } else {
                console.log(`  ❌ 不是异位词`);
            }
        }

        // 如果没有找到匹配的分组，创建新分组
        if (!foundGroup) {
            groups.push([currentStr]);
            console.log(`  创建新分组${groups.length - 1}: ["${currentStr}"]`);
        }

        // 显示当前所有分组
        console.log("  当前分组状态:");
        groups.forEach((group, index) => {
            console.log(`    分组${index}: [${group.map(s => `"${s}"`).join(', ')}]`);
        });
    }

    console.log(`\n暴力法最终结果: [${groups.map(group =>
        `[${group.map(s => `"${s}"`).join(', ')}]`
    ).join(', ')}]`);

    return groups;
}

/**
 * 检查两个字符串是否为字母异位词
 * @param {string} str1 - 字符串1
 * @param {string} str2 - 字符串2
 * @returns {boolean} 是否为异位词
 */
function areAnagrams(str1, str2) {
    if (str1.length !== str2.length) {
        return false;
    }

    const charCount = {};

    // 统计str1中每个字符的出现次数
    for (const char of str1) {
        charCount[char] = (charCount[char] || 0) + 1;
    }

    // 减去str2中每个字符的出现次数
    for (const char of str2) {
        if (!charCount[char]) {
            return false;
        }
        charCount[char]--;
    }

    // 检查是否所有字符计数都为0
    return Object.values(charCount).every(count => count === 0);
}

// ===========================================
// 辅助函数
// ===========================================

/**
 * 可视化分组结果
 * @param {string[]} strs - 原始字符串数组
 * @param {string[][]} groups - 分组结果
 */
function visualizeGroups(strs, groups) {
    console.log("\n=== 分组结果可视化 ===");

    console.log(`输入: [${strs.map(s => `"${s}"`).join(', ')}]`);
    console.log(`输出: ${groups.length}个分组`);

    groups.forEach((group, index) => {
        console.log(`\n分组 ${index + 1}: [${group.map(s => `"${s}"`).join(', ')}]`);

        // 显示异位词特征
        if (group.length > 0) {
            const representative = group[0];
            const sortedChars = representative.split('').sort().join('');
            const charFreq = {};

            for (const char of representative) {
                charFreq[char] = (charFreq[char] || 0) + 1;
            }

            console.log(`  特征: 排序后="${sortedChars}", 字符频次={${Object.entries(charFreq).map(([k, v]) => `${k}:${v}`).join(', ')}}`);

            // 验证分组内所有字符串都是异位词
            const allAnagrams = group.every(str => areAnagrams(str, representative));
            console.log(`  验证: ${allAnagrams ? '✅ 所有字符串都是异位词' : '❌ 存在非异位词'}`);
        }
    });

    // 统计信息
    const totalStrings = groups.reduce((sum, group) => sum + group.length, 0);
    const maxGroupSize = Math.max(...groups.map(group => group.length));
    const minGroupSize = Math.min(...groups.map(group => group.length));

    console.log(`\n统计信息:`);
    console.log(`  总字符串数: ${totalStrings}`);
    console.log(`  分组数量: ${groups.length}`);
    console.log(`  最大分组大小: ${maxGroupSize}`);
    console.log(`  最小分组大小: ${minGroupSize}`);
    console.log(`  平均分组大小: ${(totalStrings / groups.length).toFixed(2)}`);
}

/**
 * 验证分组结果的正确性
 * @param {string[]} original - 原始字符串数组
 * @param {string[][]} groups - 分组结果
 * @returns {boolean} 是否正确
 */
function validateGrouping(original, groups) {
    console.log("\n=== 结果验证 ===");

    // 检查是否包含所有原始字符串
    const allGroupedStrs = groups.flat();
    const sortedOriginal = [...original].sort();
    const sortedGrouped = [...allGroupedStrs].sort();

    console.log(`原始数组: [${sortedOriginal.map(s => `"${s}"`).join(', ')}]`);
    console.log(`分组结果: [${sortedGrouped.map(s => `"${s}"`).join(', ')}]`);

    if (JSON.stringify(sortedOriginal) !== JSON.stringify(sortedGrouped)) {
        console.log("❌ 分组结果与原始数组不匹配");
        return false;
    }

    // 检查每个分组内的字符串是否都是异位词
    for (let i = 0; i < groups.length; i++) {
        const group = groups[i];
        console.log(`\n验证分组 ${i + 1}: [${group.map(s => `"${s}"`).join(', ')}]`);

        if (group.length < 2) {
            console.log(`  单字符串分组，自动通过验证`);
            continue;
        }

        const representative = group[0];
        for (let j = 1; j < group.length; j++) {
            if (!areAnagrams(representative, group[j])) {
                console.log(`❌ "${representative}" 和 "${group[j]}" 不是异位词`);
                return false;
            }
        }
        console.log(`  ✅ 分组内所有字符串都是异位词`);
    }

    // 检查不同分组间的字符串不是异位词
    for (let i = 0; i < groups.length; i++) {
        for (let j = i + 1; j < groups.length; j++) {
            if (areAnagrams(groups[i][0], groups[j][0])) {
                console.log(`❌ 分组${i + 1}和分组${j + 1}的代表字符串是异位词，应该合并`);
                return false;
            }
        }
    }

    console.log("✅ 分组结果验证通过");
    return true;
}

/**
 * 性能测试
 */
function performanceTest() {
    console.log("\n=== 性能测试 ===");

    // 生成测试用例
    const generateTestCase = (size, avgLength = 5) => {
        const baseWords = [];
        const charPool = 'abcdefghijklmnopqrstuvwxyz';

        // 生成基础单词
        for (let i = 0; i < Math.min(size / 3, 10); i++) {
            let word = '';
            const wordLength = Math.floor(Math.random() * avgLength) + 1;
            for (let j = 0; j < wordLength; j++) {
                word += charPool[Math.floor(Math.random() * charPool.length)];
            }
            baseWords.push(word);
        }

        // 生成异位词
        const result = [];
        for (let i = 0; i < size; i++) {
            const baseWord = baseWords[Math.floor(Math.random() * baseWords.length)];
            const shuffled = baseWord.split('').sort(() => Math.random() - 0.5).join('');
            result.push(shuffled);
        }

        return result;
    };

    const testCases = [
        ["eat", "tea", "tan", "ate", "nat", "bat"],
        ["a"],
        ["", ""],
        generateTestCase(20, 4),
        generateTestCase(100, 6),
        generateTestCase(500, 5)
    ];

    const methods = [
        { name: '排序分组', func: groupAnagrams },
        { name: '计数分组', func: groupAnagramsByCount },
        { name: '质数编码', func: groupAnagramsByPrime },
        { name: '暴力比较', func: groupAnagramsBruteForce }
    ];

    for (let i = 0; i < testCases.length; i++) {
        const testStrs = testCases[i];
        console.log(`\n测试用例 ${i + 1}: 字符串数量 ${testStrs.length}`);
        console.log(`字符串: [${testStrs.slice(0, 8).map(s => `"${s}"`).join(', ')}${testStrs.length > 8 ? '...' : ''}]`);

        const results = [];

        for (const method of methods) {
            // 跳过大数组的暴力解法
            if (method.name === '暴力比较' && testStrs.length > 100) {
                console.log(`${method.name}: 跳过（数组过大）`);
                continue;
            }

            const startTime = performance.now();
            const result = method.func([...testStrs]);
            const endTime = performance.now();

            results.push(result);
            console.log(`${method.name}: ${result.length}个分组, 耗时: ${(endTime - startTime).toFixed(3)}ms`);
        }

        // 检查结果一致性
        console.log("结果验证:");
        const validResults = results.filter(r => r !== undefined);
        for (let j = 0; j < validResults.length; j++) {
            const isValid = validateGrouping(testStrs, validResults[j]);
            console.log(`  方法${j + 1}: ${isValid ? '✅' : '❌'}`);
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
    console.log("字母异位词分组算法测试");
    console.log("=".repeat(50));

    const testCases = [
        {
            input: ["eat", "tea", "tan", "ate", "nat", "bat"],
            description: "标准测试用例"
        },
        {
            input: [""],
            description: "空字符串"
        },
        {
            input: ["a"],
            description: "单字符"
        },
        {
            input: ["ab", "ba", "abc", "cab", "bca"],
            description: "混合长度异位词"
        },
        {
            input: ["abc", "def", "ghi"],
            description: "无异位词"
        },
        {
            input: ["aab", "aba", "baa", "aaa"],
            description: "重复字符"
        },
        {
            input: [],
            description: "空数组"
        }
    ];

    testCases.forEach((testCase, index) => {
        console.log(`\n${"=".repeat(30)}`);
        console.log(`测试用例 ${index + 1}: ${testCase.description}`);
        console.log(`${"=".repeat(30)}`);

        const { input } = testCase;
        console.log(`输入: [${input.map(s => `"${s}"`).join(', ')}]`);

        // 测试所有方法
        const methods = [
            { name: "排序分组", func: groupAnagrams },
            { name: "计数分组", func: groupAnagramsByCount },
            { name: "质数编码", func: groupAnagramsByPrime },
            { name: "暴力比较", func: groupAnagramsBruteForce }
        ];

        const results = [];

        for (const method of methods) {
            console.log(`\n--- ${method.name} ---`);
            try {
                const result = method.func([...input]);
                results.push(result);

                console.log(`结果: [${result.map(group =>
                    `[${group.map(s => `"${s}"`).join(', ')}]`
                ).join(', ')}]`);

                // 验证结果
                const isValid = validateGrouping(input, result);
                console.log(`验证: ${isValid ? '✅' : '❌'}`);
            } catch (error) {
                console.log(`❌ 方法执行失败: ${error.message}`);
                results.push(null);
            }
        }

        // 可视化第一个有意义的测试用例
        if (index === 0 && input.length > 0 && results[0]) {
            visualizeGroups(input, results[0]);
        }
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
    console.log("字母异位词分组算法演示");
    console.log("=".repeat(50));

    console.log("字母异位词分组问题的核心思想:");
    console.log("1. 异位词具有相同的字符组成和频次");
    console.log("2. 排序后字符串相同是异位词的充要条件");
    console.log("3. 字符计数数组提供更高效的识别方法");
    console.log("4. 质数编码利用唯一分解定理");

    const demoStrs = ["eat", "tea", "tan", "ate", "nat", "bat"];
    console.log(`\n演示数组: [${demoStrs.map(s => `"${s}"`).join(', ')}]`);

    console.log("\n算法特点对比:");
    console.log("1. 排序分组: 时间O(n*k log k)，空间O(n*k)，最通用");
    console.log("2. 计数分组: 时间O(n*k)，空间O(n*k)，最高效");
    console.log("3. 质数编码: 时间O(n*k)，空间O(n*k)，数学巧妙");
    console.log("4. 暴力比较: 时间O(n²*k)，空间O(n*k)，最直观");

    console.log("\n详细演示 - 排序分组法:");
    const result = groupAnagrams(demoStrs);

    // 可视化结果
    visualizeGroups(demoStrs, result);

    console.log("\n算法应用场景:");
    console.log("- 单词游戏中的字母重排");
    console.log("- 文档相似性检测");
    console.log("- 密码学中的字符分析");
    console.log("- 自然语言处理的词形还原");
}

// ===========================================
// 面试要点
// ===========================================

/**
 * 面试关键点总结
 */
function interviewKeyPoints() {
    console.log("\n" + "=".repeat(50));
    console.log("面试关键点");
    console.log("=".repeat(50));

    console.log("\n🎯 核心概念:");
    console.log("1. 异位词的数学定义和特征");
    console.log("2. 哈希表在分组问题中的应用");
    console.log("3. 字符串排序的时间复杂度分析");
    console.log("4. 字符计数数组的优化思想");

    console.log("\n🔧 实现技巧:");
    console.log("1. 使用Map存储分组，键为特征字符串");
    console.log("2. 字符数组转字符串作为哈希键");
    console.log("3. 质数编码避免字符串比较");
    console.log("4. 空字符串和单字符的边界处理");

    console.log("\n❗ 常见陷阱:");
    console.log("1. 忘记处理空字符串的情况");
    console.log("2. 字符计数时假设只有小写字母");
    console.log("3. 质数编码可能导致整数溢出");
    console.log("4. Map的键需要保证唯一性");
    console.log("5. 返回结果的格式要求（数组的数组）");

    console.log("\n🎨 变体问题:");
    console.log("1. 有效的字母异位词（两个字符串比较）");
    console.log("2. 找到字符串中所有字母异位词");
    console.log("3. 字母异位词的最小删除次数");
    console.log("4. 重新排列字符串使其回文");
    console.log("5. 同构字符串");

    console.log("\n📊 复杂度分析:");
    console.log("时间复杂度:");
    console.log("- 排序分组: O(n * k log k)");
    console.log("- 计数分组: O(n * k)");
    console.log("- 质数编码: O(n * k)");
    console.log("- 暴力比较: O(n² * k)");

    console.log("\n空间复杂度:");
    console.log("- 所有方法: O(n * k) 用于存储结果");

    console.log("\n💡 面试技巧:");
    console.log("1. 先从最直观的排序方法开始");
    console.log("2. 讨论字符计数的优化思路");
    console.log("3. 提及质数编码的数学巧思");
    console.log("4. 考虑字符集大小的影响");
    console.log("5. 分析不同方法的适用场景");

    console.log("\n🔍 相关概念:");
    console.log("1. 哈希表的设计和冲突处理");
    console.log("2. 字符串处理的常用技巧");
    console.log("3. 分治思想在分组问题中的应用");
    console.log("4. 数学方法在算法优化中的价值");

    console.log("\n🌟 实际应用:");
    console.log("1. 搜索引擎的查询扩展");
    console.log("2. 拼写检查器的候选词生成");
    console.log("3. 生物信息学的DNA序列分析");
    console.log("4. 密码学的频率分析");
    console.log("5. 文本分析的词汇统计");

    console.log("\n📋 异位词分组解题模板:");
    console.log("```javascript");
    console.log("function groupAnagrams(strs) {");
    console.log("    if (!strs || strs.length === 0) return [];");
    console.log("    ");
    console.log("    const anagramMap = new Map();");
    console.log("    ");
    console.log("    for (const str of strs) {");
    console.log("        // 方法1：排序作为键");
    console.log("        const key = str.split('').sort().join('');");
    console.log("        ");
    console.log("        // 方法2：字符计数作为键");
    console.log("        // const count = new Array(26).fill(0);");
    console.log("        // for (const char of str) {");
    console.log("        //     count[char.charCodeAt(0) - 97]++;");
    console.log("        // }");
    console.log("        // const key = count.join(',');");
    console.log("        ");
    console.log("        if (!anagramMap.has(key)) {");
    console.log("            anagramMap.set(key, []);");
    console.log("        }");
    console.log("        anagramMap.get(key).push(str);");
    console.log("    }");
    console.log("    ");
    console.log("    return Array.from(anagramMap.values());");
    console.log("}");
    console.log("```");
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        groupAnagrams,
        groupAnagramsByCount,
        groupAnagramsByPrime,
        groupAnagramsBruteForce,
        areAnagrams,
        visualizeGroups,
        validateGrouping,
        performanceTest,
        runTests,
        demonstrateAlgorithm,
        interviewKeyPoints
    };
}

// 如果在浏览器环境中，运行演示
if (typeof window !== 'undefined') {
    runTests();
    demonstrateAlgorithm();
    interviewKeyPoints();
}