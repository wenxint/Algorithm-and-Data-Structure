/**
 * LeetCode 3. 无重复字符的最长子串
 *
 * 问题描述：
 * 给定一个字符串 s ，请你找出其中不含有重复字符的最长子串的长度。
 *
 * 核心思想：
 * 使用滑动窗口技术，维护一个无重复字符的窗口
 * 当遇到重复字符时，移动左边界直到窗口内无重复字符
 * 主要解法有：
 * 1. 滑动窗口 + 哈希表 - O(n)
 * 2. 滑动窗口 + 数组索引 - O(n)
 * 3. 暴力解法 - O(n³)
 * 4. 优化的滑动窗口 - O(n)
 *
 * 示例：
 * 输入：s = "abcabcbb"
 * 输出：3
 * 解释：因为无重复字符的最长子串是 "abc"，所以其长度为 3。
 */

/**
 * 方法一：滑动窗口 + 哈希表（推荐）
 *
 * 核心思想：
 * 使用两个指针维护一个滑动窗口，窗口内保持所有字符都不重复
 * 使用哈希表记录每个字符最后出现的位置
 * 当遇到重复字符时，直接将左指针移动到重复字符的下一个位置
 *
 * 算法步骤：
 * 1. 使用左右两个指针维护滑动窗口
 * 2. 用哈希表记录字符最后出现的索引
 * 3. 右指针向右扩展，如果遇到重复字符，调整左指针
 * 4. 每次扩展后更新最大长度
 *
 * @param {string} s - 输入字符串
 * @returns {number} 最长无重复子串长度
 * @time O(n) 每个字符最多被访问两次
 * @space O(min(m,n)) m是字符集大小，n是字符串长度
 */
function lengthOfLongestSubstring(s) {
    console.log("=== 无重复字符的最长子串（滑动窗口 + 哈希表） ===");
    console.log(`输入字符串: "${s}"`);

    if (!s || s.length === 0) {
        console.log("输入为空，返回 0");
        return 0;
    }

    const charMap = new Map(); // 字符 -> 最后出现位置的映射
    let left = 0; // 滑动窗口左边界
    let maxLength = 0; // 最长子串长度
    let maxStart = 0; // 最长子串起始位置
    let maxEnd = 0; // 最长子串结束位置

    console.log("\n开始滑动窗口遍历:");

    for (let right = 0; right < s.length; right++) {
        const currentChar = s[right];
        console.log(`\n第 ${right + 1} 步: 处理字符 '${currentChar}' (索引 ${right})`);

        // 如果当前字符在窗口内出现过，需要调整左边界
        if (charMap.has(currentChar) && charMap.get(currentChar) >= left) {
            const lastIndex = charMap.get(currentChar);
            console.log(`  发现重复字符 '${currentChar}'，上次出现位置: ${lastIndex}`);
            left = lastIndex + 1;
            console.log(`  调整左边界到: ${left}`);
        }

        // 更新当前字符的位置
        charMap.set(currentChar, right);
        console.log(`  更新字符映射: '${currentChar}' -> ${right}`);

        // 计算当前窗口长度
        const currentLength = right - left + 1;
        console.log(`  当前窗口: [${left}, ${right}], 子串: "${s.substring(left, right + 1)}", 长度: ${currentLength}`);

        // 更新最大长度记录
        if (currentLength > maxLength) {
            maxLength = currentLength;
            maxStart = left;
            maxEnd = right;
            console.log(`  ✅ 更新最大长度: ${maxLength}, 最长子串: "${s.substring(maxStart, maxEnd + 1)}"`);
        }

        // 显示当前哈希表状态
        const mapEntries = Array.from(charMap.entries())
            .filter(([char, index]) => index >= left)
            .map(([char, index]) => `${char}:${index}`)
            .join(', ');
        console.log(`  当前窗口内字符映射: {${mapEntries}}`);
    }

    const result = s.substring(maxStart, maxEnd + 1);
    console.log(`\n最终结果: 最长无重复子串长度 = ${maxLength}`);
    console.log(`最长子串: "${result}" (位置: ${maxStart}-${maxEnd})`);
    return maxLength;
}

/**
 * 方法二：滑动窗口 + 数组索引
 *
 * 核心思想：
 * 使用数组代替哈希表来记录字符的索引，适用于字符集有限的情况
 * 对于ASCII字符，使用大小为128的数组；对于扩展ASCII，使用256
 *
 * @param {string} s - 输入字符串
 * @returns {number} 最长无重复子串长度
 * @time O(n) 线性时间复杂度
 * @space O(1) 固定大小的数组空间
 */
function lengthOfLongestSubstringArray(s) {
    console.log("\n=== 无重复字符的最长子串（滑动窗口 + 数组索引） ===");
    console.log(`输入字符串: "${s}"`);

    if (!s || s.length === 0) {
        console.log("输入为空，返回 0");
        return 0;
    }

    // 使用数组记录字符最后出现的位置，-1表示未出现
    const charIndex = new Array(128).fill(-1);
    let left = 0;
    let maxLength = 0;
    let maxStart = 0;
    let maxEnd = 0;

    console.log("\n开始滑动窗口遍历:");

    for (let right = 0; right < s.length; right++) {
        const currentChar = s[right];
        const charCode = currentChar.charCodeAt(0);
        console.log(`\n第 ${right + 1} 步: 处理字符 '${currentChar}' (ASCII: ${charCode}, 索引: ${right})`);

        // 检查字符是否在当前窗口内重复
        const lastIndex = charIndex[charCode];
        if (lastIndex >= left) {
            console.log(`  发现重复字符 '${currentChar}'，上次出现位置: ${lastIndex}`);
            left = lastIndex + 1;
            console.log(`  调整左边界到: ${left}`);
        }

        // 更新字符的最新位置
        charIndex[charCode] = right;
        console.log(`  更新字符索引: charIndex[${charCode}] = ${right}`);

        // 计算当前窗口长度
        const currentLength = right - left + 1;
        const currentSubstring = s.substring(left, right + 1);
        console.log(`  当前窗口: [${left}, ${right}], 子串: "${currentSubstring}", 长度: ${currentLength}`);

        // 更新最大长度
        if (currentLength > maxLength) {
            maxLength = currentLength;
            maxStart = left;
            maxEnd = right;
            console.log(`  ✅ 更新最大长度: ${maxLength}, 最长子串: "${s.substring(maxStart, maxEnd + 1)}"`);
        }

        // 显示当前窗口内的字符
        const windowChars = [];
        for (let i = left; i <= right; i++) {
            windowChars.push(`${s[i]}:${i}`);
        }
        console.log(`  当前窗口字符: [${windowChars.join(', ')}]`);
    }

    const result = s.substring(maxStart, maxEnd + 1);
    console.log(`\n最终结果: 最长无重复子串长度 = ${maxLength}`);
    console.log(`最长子串: "${result}" (位置: ${maxStart}-${maxEnd})`);
    return maxLength;
}

/**
 * 方法三：暴力解法
 *
 * 核心思想：
 * 枚举所有可能的子串，检查每个子串是否包含重复字符
 * 虽然时间复杂度较高，但逻辑简单直观
 *
 * @param {string} s - 输入字符串
 * @returns {number} 最长无重复子串长度
 * @time O(n³) 枚举子串O(n²)，检查重复O(n)
 * @space O(min(m,n)) 存储字符集合的空间
 */
function lengthOfLongestSubstringBruteForce(s) {
    console.log("\n=== 无重复字符的最长子串（暴力解法） ===");
    console.log(`输入字符串: "${s}"`);

    if (!s || s.length === 0) {
        console.log("输入为空，返回 0");
        return 0;
    }

    /**
     * 检查子串是否包含重复字符
     * @param {string} substr - 待检查的子串
     * @param {number} start - 起始位置
     * @param {number} end - 结束位置
     * @returns {boolean} 是否无重复字符
     */
    function hasUniqueChars(substr, start, end) {
        const charSet = new Set();
        for (let i = 0; i < substr.length; i++) {
            const char = substr[i];
            if (charSet.has(char)) {
                console.log(`      发现重复字符 '${char}' 在位置 ${start + i}`);
                return false;
            }
            charSet.add(char);
        }
        return true;
    }

    let maxLength = 0;
    let maxSubstring = "";

    console.log("\n枚举所有子串:");

    // 按长度从大到小枚举（优化：一旦找到就是最长的）
    for (let length = s.length; length >= 1; length--) {
        console.log(`\n检查长度为 ${length} 的子串:`);

        for (let start = 0; start <= s.length - length; start++) {
            const end = start + length - 1;
            const substring = s.substring(start, start + length);
            console.log(`  检查子串 "${substring}" (位置: ${start}-${end}):`);

            if (hasUniqueChars(substring, start, end)) {
                console.log(`    ✅ 无重复字符，长度: ${length}`);
                console.log(`    找到最长无重复子串: "${substring}"`);
                return length;
            } else {
                console.log(`    ❌ 包含重复字符`);
            }
        }
    }

    return maxLength;
}

/**
 * 方法四：优化的滑动窗口（一次遍历）
 *
 * 核心思想：
 * 在基本滑动窗口的基础上，使用更简洁的实现
 * 直接记录字符出现次数，通过计数来判断是否有重复
 *
 * @param {string} s - 输入字符串
 * @returns {number} 最长无重复子串长度
 * @time O(n) 每个字符最多访问两次
 * @space O(min(m,n)) 字符计数空间
 */
function lengthOfLongestSubstringOptimized(s) {
    console.log("\n=== 无重复字符的最长子串（优化滑动窗口） ===");
    console.log(`输入字符串: "${s}"`);

    if (!s || s.length === 0) {
        console.log("输入为空，返回 0");
        return 0;
    }

    const charCount = new Map(); // 字符计数
    let left = 0;
    let maxLength = 0;
    let maxStart = 0;
    let maxEnd = 0;

    console.log("\n开始优化滑动窗口遍历:");

    for (let right = 0; right < s.length; right++) {
        const rightChar = s[right];
        console.log(`\n第 ${right + 1} 步: 扩展右边界到字符 '${rightChar}' (索引 ${right})`);

        // 将右边界字符加入窗口
        charCount.set(rightChar, (charCount.get(rightChar) || 0) + 1);
        console.log(`  字符 '${rightChar}' 计数变为: ${charCount.get(rightChar)}`);

        // 如果出现重复字符，收缩左边界
        while (charCount.get(rightChar) > 1) {
            const leftChar = s[left];
            console.log(`  发现重复，收缩左边界: 移除字符 '${leftChar}' (索引 ${left})`);

            charCount.set(leftChar, charCount.get(leftChar) - 1);
            if (charCount.get(leftChar) === 0) {
                charCount.delete(leftChar);
                console.log(`  字符 '${leftChar}' 从窗口中完全移除`);
            } else {
                console.log(`  字符 '${leftChar}' 计数变为: ${charCount.get(leftChar)}`);
            }

            left++;
        }

        // 计算当前窗口长度
        const currentLength = right - left + 1;
        const currentSubstring = s.substring(left, right + 1);
        console.log(`  当前窗口: [${left}, ${right}], 子串: "${currentSubstring}", 长度: ${currentLength}`);

        // 更新最大长度
        if (currentLength > maxLength) {
            maxLength = currentLength;
            maxStart = left;
            maxEnd = right;
            console.log(`  ✅ 更新最大长度: ${maxLength}, 最长子串: "${s.substring(maxStart, maxEnd + 1)}"`);
        }

        // 显示当前窗口状态
        const windowInfo = Array.from(charCount.entries())
            .map(([char, count]) => `${char}:${count}`)
            .join(', ');
        console.log(`  当前窗口字符计数: {${windowInfo}}`);
    }

    const result = s.substring(maxStart, maxEnd + 1);
    console.log(`\n最终结果: 最长无重复子串长度 = ${maxLength}`);
    console.log(`最长子串: "${result}" (位置: ${maxStart}-${maxEnd})`);
    return maxLength;
}

// ===========================================
// 辅助函数
// ===========================================

/**
 * 验证结果的正确性
 * @param {string} s - 原字符串
 * @param {number} result - 算法结果
 * @returns {boolean} 是否正确
 */
function validateResult(s, result) {
    console.log("\n=== 结果验证 ===");
    console.log(`原字符串: "${s}"`);
    console.log(`算法结果: ${result}`);

    if (!s || s.length === 0) {
        const isCorrect = result === 0;
        console.log(`空字符串验证: ${isCorrect ? '✅' : '❌'}`);
        return isCorrect;
    }

    // 方法1：暴力验证，找到所有无重复字符的子串
    let actualMaxLength = 0;
    let longestSubstrings = [];

    for (let i = 0; i < s.length; i++) {
        for (let j = i; j < s.length; j++) {
            const substring = s.substring(i, j + 1);
            const charSet = new Set(substring);

            // 检查是否无重复字符
            if (charSet.size === substring.length) {
                if (substring.length > actualMaxLength) {
                    actualMaxLength = substring.length;
                    longestSubstrings = [substring];
                } else if (substring.length === actualMaxLength) {
                    longestSubstrings.push(substring);
                }
            }
        }
    }

    console.log(`实际最大长度: ${actualMaxLength}`);
    console.log(`所有最长子串: [${longestSubstrings.map(s => `"${s}"`).join(', ')}]`);

    const isCorrect = result === actualMaxLength;
    console.log(`结果正确: ${isCorrect ? '✅' : '❌'}`);

    return isCorrect;
}

/**
 * 性能测试
 */
function performanceTest() {
    console.log("\n=== 性能测试 ===");

    // 生成测试用例
    const generateTestString = (length, charSet = 'abcdefghijklmnopqrstuvwxyz') => {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += charSet[Math.floor(Math.random() * charSet.length)];
        }
        return result;
    };

    const testCases = [
        "abcabcbb",
        "bbbbb",
        "pwwkew",
        generateTestString(100, 'abcde'),
        generateTestString(1000, 'abcdefghij'),
        "a".repeat(1000), // 全相同字符
        "abcdefghijklmnopqrstuvwxyz", // 全不同字符
        "" // 空字符串
    ];

    const methods = [
        { name: '滑动窗口+哈希表', func: lengthOfLongestSubstring },
        { name: '滑动窗口+数组', func: lengthOfLongestSubstringArray },
        { name: '优化滑动窗口', func: lengthOfLongestSubstringOptimized },
        { name: '暴力解法', func: lengthOfLongestSubstringBruteForce }
    ];

    for (let i = 0; i < testCases.length; i++) {
        const testStr = testCases[i];
        console.log(`\n测试字符串 ${i + 1}: "${testStr.substring(0, 20)}${testStr.length > 20 ? '...' : ''}" (长度: ${testStr.length})`);

        const results = [];

        for (const method of methods) {
            // 对于长字符串跳过暴力解法
            if (method.name === '暴力解法' && testStr.length > 50) {
                console.log(`${method.name}: 跳过（字符串过长）`);
                continue;
            }

            const startTime = performance.now();
            const result = method.func(testStr);
            const endTime = performance.now();

            results.push(result);
            console.log(`${method.name}: ${result}, 耗时: ${(endTime - startTime).toFixed(3)}ms`);
        }

        // 检查结果一致性
        const validResults = results.filter(r => r !== undefined);
        const allSame = validResults.every(r => r === validResults[0]);
        console.log(`所有方法结果一致: ${allSame ? '✅' : '❌'}`);
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
    console.log("无重复字符的最长子串算法测试");
    console.log("=".repeat(50));

    const testCases = [
        { input: "abcabcbb", expected: 3 },
        { input: "bbbbb", expected: 1 },
        { input: "pwwkew", expected: 3 },
        { input: "", expected: 0 },
        { input: " ", expected: 1 },
        { input: "au", expected: 2 },
        { input: "dvdf", expected: 3 },
        { input: "abcdef", expected: 6 },
        { input: "aab", expected: 2 },
        { input: "cdd", expected: 2 }
    ];

    testCases.forEach((testCase, index) => {
        console.log(`\n${"=".repeat(30)}`);
        console.log(`测试用例 ${index + 1}: "${testCase.input}"`);
        console.log(`${"=".repeat(30)}`);

        // 测试所有方法
        const methods = [
            { name: "滑动窗口+哈希表", func: lengthOfLongestSubstring },
            { name: "滑动窗口+数组", func: lengthOfLongestSubstringArray },
            { name: "优化滑动窗口", func: lengthOfLongestSubstringOptimized },
            { name: "暴力解法", func: lengthOfLongestSubstringBruteForce }
        ];

        const results = [];

        for (const method of methods) {
            console.log(`\n--- ${method.name} ---`);
            try {
                const result = method.func(testCase.input);
                results.push(result);

                const isCorrect = result === testCase.expected;
                console.log(`结果: ${result}, 期望: ${testCase.expected}, 正确: ${isCorrect ? '✅' : '❌'}`);

                // 验证结果
                validateResult(testCase.input, result);
            } catch (error) {
                console.log(`❌ 方法执行失败: ${error.message}`);
                results.push(null);
            }
        }

        // 检查所有方法结果是否一致
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
    console.log("无重复字符的最长子串算法演示");
    console.log("=".repeat(50));

    console.log("滑动窗口算法的核心思想:");
    console.log("1. 使用双指针维护一个动态窗口");
    console.log("2. 右指针扩展窗口，左指针收缩窗口");
    console.log("3. 保持窗口内所有字符都不重复");
    console.log("4. 记录过程中遇到的最大窗口长度");

    const demoString = "abcabcbb";
    console.log(`\n演示字符串: "${demoString}"`);

    console.log("\n算法特点对比:");
    console.log("1. 滑动窗口+哈希表: 通用性强，适用于任意字符集");
    console.log("2. 滑动窗口+数组: 适用于ASCII字符，空间效率高");
    console.log("3. 优化滑动窗口: 使用计数方式，逻辑更直观");
    console.log("4. 暴力解法: 思路简单，适合小数据量");

    console.log("\n滑动窗口技术的关键点:");
    console.log("- 窗口的扩展和收缩条件");
    console.log("- 如何高效地检测重复元素");
    console.log("- 何时更新最优解");
    console.log("- 边界条件的处理");

    console.log("\n详细演示 - 滑动窗口+哈希表:");
    const result = lengthOfLongestSubstring(demoString);

    console.log("\n时间复杂度分析:");
    console.log("滑动窗口方法: O(n) - 每个字符最多被访问2次");
    console.log("暴力解法: O(n³) - 三重循环");

    console.log("\n空间复杂度分析:");
    console.log("哈希表方法: O(min(m,n)) - m为字符集大小");
    console.log("数组方法: O(1) - 固定大小数组");
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
    console.log("1. 滑动窗口技术的基本原理");
    console.log("2. 双指针维护动态窗口的方法");
    console.log("3. 哈希表在重复检测中的应用");
    console.log("4. 窗口扩展和收缩的时机判断");

    console.log("\n🔧 实现技巧:");
    console.log("1. 哈希表记录字符最后出现位置");
    console.log("2. 左指针的跳跃式移动优化");
    console.log("3. 数组代替哈希表的空间优化");
    console.log("4. 字符计数的重复检测方法");

    console.log("\n❗ 常见陷阱:");
    console.log("1. 左指针移动时的边界判断");
    console.log("2. 字符索引更新的时机");
    console.log("3. 空字符串和单字符的边界情况");
    console.log("4. 字符集大小对空间复杂度的影响");
    console.log("5. 重复字符位置的正确处理");

    console.log("\n🎨 变体问题:");
    console.log("1. 至多包含K个不同字符的最长子串");
    console.log("2. 至多包含两个不同字符的最长子串");
    console.log("3. 无重复字符的最长子序列");
    console.log("4. 替换后的最长重复字符");
    console.log("5. 包含所有字符的最小窗口");

    console.log("\n📊 复杂度分析:");
    console.log("时间复杂度:");
    console.log("- 滑动窗口: O(n)");
    console.log("- 暴力解法: O(n³)");

    console.log("\n空间复杂度:");
    console.log("- 哈希表方法: O(min(m,n))");
    console.log("- 数组方法: O(1)");
    console.log("- 其中m为字符集大小，n为字符串长度");

    console.log("\n💡 面试技巧:");
    console.log("1. 先确认字符集范围（ASCII、Unicode等）");
    console.log("2. 从暴力解法开始，逐步优化到滑动窗口");
    console.log("3. 解释清楚滑动窗口的扩展和收缩逻辑");
    console.log("4. 考虑使用数组代替哈希表的优化");
    console.log("5. 注意处理边界情况和特殊输入");

    console.log("\n🔍 相关概念:");
    console.log("1. 滑动窗口算法模板");
    console.log("2. 双指针技术的应用");
    console.log("3. 哈希表在字符串处理中的作用");
    console.log("4. 字符串问题的常见优化策略");

    console.log("\n🌟 实际应用:");
    console.log("1. 网络数据流的重复检测");
    console.log("2. 文本编辑器的查找功能");
    console.log("3. 数据库查询优化");
    console.log("4. 缓存系统的键值管理");
    console.log("5. 密码强度检测");

    console.log("\n📋 滑动窗口算法模板:");
    console.log("```javascript");
    console.log("function slidingWindow(s) {");
    console.log("    let left = 0, right = 0;");
    console.log("    let window = new Map();");
    console.log("    ");
    console.log("    while (right < s.length) {");
    console.log("        // 扩展窗口");
    console.log("        let c = s[right];");
    console.log("        right++;");
    console.log("        // 更新窗口内数据");
    console.log("        ");
    console.log("        while (窗口需要收缩) {");
    console.log("            // 收缩窗口");
    console.log("            let d = s[left];");
    console.log("            left++;");
    console.log("            // 更新窗口内数据");
    console.log("        }");
    console.log("    }");
    console.log("}");
    console.log("```");
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        lengthOfLongestSubstring,
        lengthOfLongestSubstringArray,
        lengthOfLongestSubstringBruteForce,
        lengthOfLongestSubstringOptimized,
        validateResult,
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