/**
 * LeetCode 014: 最长公共前缀 (Longest Common Prefix)
 *
 * 题目描述:
 * 编写一个函数来查找字符串数组中的最长公共前缀。
 * 如果不存在公共前缀，返回空字符串 ""。
 *
 * 核心思想:
 * 寻找所有字符串的最长公共前缀，可以通过多种方式实现：
 * 1. 纵向扫描：逐个字符比较所有字符串
 * 2. 横向扫描：两两比较求公共前缀
 * 3. 分治法：递归地将问题分解
 * 4. 二分查找：在可能的前缀长度范围内搜索
 *
 * 示例输入: ["flower","flow","flight"]
 * 输出: "fl"
 *
 * 示例输入: ["dog","racecar","car"]
 * 输出: ""
 */

/**
 * 方法一：纵向扫描（推荐）
 *
 * 核心思想：
 * 从前往后逐个字符比较所有字符串的对应位置：
 * 1. 以第一个字符串为基准，逐个字符检查
 * 2. 对每个字符位置，检查所有字符串是否都有相同字符
 * 3. 一旦发现不匹配或某个字符串已结束，返回当前前缀
 *
 * @param {string[]} strs - 字符串数组
 * @returns {string} 最长公共前缀
 * @time O(S) S是所有字符串中字符的总数
 * @space O(1) 只使用常数额外空间
 */
function longestCommonPrefix(strs) {
    console.log("=== 纵向扫描法 ===");
    console.log("输入数组:", strs);

    // 边界处理：空数组
    if (!strs || strs.length === 0) {
        console.log("数组为空，返回空字符串");
        return "";
    }

    // 边界处理：只有一个字符串
    if (strs.length === 1) {
        console.log("只有一个字符串，直接返回:", strs[0]);
        return strs[0];
    }

    // 以第一个字符串为基准进行比较
    const firstStr = strs[0];
    console.log("以第一个字符串为基准:", firstStr);

    for (let i = 0; i < firstStr.length; i++) {
        const char = firstStr[i];
        console.log(`\n检查第${i}个字符: '${char}'`);

        // 检查所有其他字符串的第i个字符
        for (let j = 1; j < strs.length; j++) {
            const currentStr = strs[j];

            // 检查当前字符串是否已经结束
            if (i >= currentStr.length) {
                console.log(`字符串 '${currentStr}' 长度不足，在位置${i}结束`);
                const result = firstStr.substring(0, i);
                console.log("最长公共前缀:", result);
                return result;
            }

            // 检查字符是否匹配
            if (currentStr[i] !== char) {
                console.log(`字符串 '${currentStr}' 的第${i}个字符 '${currentStr[i]}' 与 '${char}' 不匹配`);
                const result = firstStr.substring(0, i);
                console.log("最长公共前缀:", result);
                return result;
            }

            console.log(`字符串 '${currentStr}' 的第${i}个字符匹配`);
        }

        console.log(`第${i}个字符 '${char}' 在所有字符串中都匹配`);
    }

    // 如果所有字符都匹配，说明第一个字符串就是最长公共前缀
    console.log("第一个字符串的所有字符都匹配，它就是最长公共前缀");
    console.log("最长公共前缀:", firstStr);
    return firstStr;
}

/**
 * 方法二：横向扫描
 *
 * 核心思想：
 * 依次将字符串与当前的公共前缀进行比较：
 * 1. 初始化第一个字符串为公共前缀
 * 2. 依次与后续字符串比较，更新公共前缀
 * 3. 如果公共前缀变为空，直接返回
 *
 * @param {string[]} strs - 字符串数组
 * @returns {string} 最长公共前缀
 * @time O(S) S是所有字符串中字符的总数
 * @space O(1) 只使用常数额外空间
 */
function longestCommonPrefixHorizontal(strs) {
    console.log("\n=== 横向扫描法 ===");
    console.log("输入数组:", strs);

    if (!strs || strs.length === 0) {
        return "";
    }

    let prefix = strs[0];
    console.log("初始前缀:", prefix);

    for (let i = 1; i < strs.length; i++) {
        const currentStr = strs[i];
        console.log(`\n与字符串 '${currentStr}' 比较`);

        // 求当前前缀与当前字符串的公共前缀
        let j = 0;
        while (j < prefix.length && j < currentStr.length && prefix[j] === currentStr[j]) {
            j++;
        }

        prefix = prefix.substring(0, j);
        console.log(`更新前缀为: '${prefix}'`);

        // 如果前缀为空，直接返回
        if (prefix === "") {
            console.log("前缀已为空，直接返回");
            return "";
        }
    }

    console.log("最终前缀:", prefix);
    return prefix;
}

/**
 * 方法三：分治法
 *
 * 核心思想：
 * 将问题分解为子问题，递归求解：
 * 1. 将字符串数组分为两部分
 * 2. 递归求解左右两部分的公共前缀
 * 3. 合并两个公共前缀得到最终结果
 *
 * @param {string[]} strs - 字符串数组
 * @returns {string} 最长公共前缀
 * @time O(S) S是所有字符串中字符的总数
 * @space O(m*log n) 递归栈空间，m是字符串平均长度，n是字符串数量
 */
function longestCommonPrefixDivideConquer(strs) {
    console.log("\n=== 分治法 ===");

    if (!strs || strs.length === 0) {
        return "";
    }

    /**
     * 递归函数：求解指定范围内字符串的公共前缀
     */
    function divide(start, end) {
        console.log(`处理范围 [${start}, ${end}]`);

        // 基础情况：只有一个字符串
        if (start === end) {
            console.log(`基础情况，返回字符串: '${strs[start]}'`);
            return strs[start];
        }

        // 分治：分为两部分
        const mid = Math.floor((start + end) / 2);
        console.log(`分治，中点: ${mid}`);

        const leftPrefix = divide(start, mid);
        const rightPrefix = divide(mid + 1, end);

        console.log(`合并: '${leftPrefix}' 和 '${rightPrefix}'`);

        // 合并两个前缀
        return mergePrefix(leftPrefix, rightPrefix);
    }

    /**
     * 合并两个字符串的公共前缀
     */
    function mergePrefix(str1, str2) {
        let i = 0;
        while (i < str1.length && i < str2.length && str1[i] === str2[i]) {
            i++;
        }
        const result = str1.substring(0, i);
        console.log(`合并结果: '${result}'`);
        return result;
    }

    return divide(0, strs.length - 1);
}

/**
 * 方法四：二分查找优化
 *
 * 核心思想：
 * 在可能的前缀长度范围内进行二分查找：
 * 1. 最短字符串的长度是前缀长度的上界
 * 2. 二分查找最长的有效前缀长度
 * 3. 对每个长度检查是否为有效前缀
 *
 * @param {string[]} strs - 字符串数组
 * @returns {string} 最长公共前缀
 * @time O(S*log m) S是所有字符串中字符的总数，m是最短字符串长度
 * @space O(1) 只使用常数额外空间
 */
function longestCommonPrefixBinarySearch(strs) {
    console.log("\n=== 二分查找法 ===");

    if (!strs || strs.length === 0) {
        return "";
    }

    // 找到最短字符串的长度
    let minLength = Math.min(...strs.map(str => str.length));
    console.log("最短字符串长度:", minLength);

    /**
     * 检查指定长度的前缀是否为公共前缀
     */
    function isCommonPrefix(length) {
        const prefix = strs[0].substring(0, length);
        console.log(`检查长度${length}的前缀: '${prefix}'`);

        for (let i = 1; i < strs.length; i++) {
            if (!strs[i].startsWith(prefix)) {
                console.log(`字符串 '${strs[i]}' 不以 '${prefix}' 开头`);
                return false;
            }
        }

        console.log(`长度${length}的前缀是有效的`);
        return true;
    }

    let left = 0, right = minLength;

    while (left < right) {
        const mid = Math.floor((left + right + 1) / 2);
        console.log(`二分查找: left=${left}, right=${right}, mid=${mid}`);

        if (isCommonPrefix(mid)) {
            left = mid;  // 当前长度有效，尝试更长的
            console.log(`长度${mid}有效，尝试更长的前缀`);
        } else {
            right = mid - 1;  // 当前长度无效，尝试更短的
            console.log(`长度${mid}无效，尝试更短的前缀`);
        }
    }

    const result = strs[0].substring(0, left);
    console.log("最终结果:", result);
    return result;
}

/**
 * 验证结果的正确性
 */
function validateResult(strs, result) {
    console.log("\n=== 结果验证 ===");
    console.log("输入数组:", strs);
    console.log("计算结果:", result);

    // 检查是否所有字符串都以result开头
    for (const str of strs) {
        if (!str.startsWith(result)) {
            console.log(`❌ 错误：字符串 '${str}' 不以 '${result}' 开头`);
            return false;
        }
    }

    // 检查是否可以更长（验证最长性）
    if (result.length < Math.min(...strs.map(s => s.length))) {
        const nextChar = strs[0][result.length];
        let canExtend = true;

        for (const str of strs) {
            if (str.length <= result.length || str[result.length] !== nextChar) {
                canExtend = false;
                break;
            }
        }

        if (canExtend) {
            console.log(`❌ 错误：前缀可以扩展为 '${result + nextChar}'`);
            return false;
        }
    }

    console.log("✅ 结果验证通过");
    return true;
}

/**
 * 性能测试
 */
function performanceTest() {
    console.log("\n=== 性能测试 ===");

    const testCases = [
        // 小规模测试
        ["flower", "flow", "flight"],
        ["dog", "racecar", "car"],
        ["abc", "abc", "abc"],
        ["", "abc", "def"],

        // 大规模测试
        Array(1000).fill().map((_, i) => "prefix" + "a".repeat(i % 100)),
        Array(1000).fill("samePrefixWithDifferentSuffix").map((str, i) => str + i)
    ];

    const methods = [
        { name: "纵向扫描", func: longestCommonPrefix },
        { name: "横向扫描", func: longestCommonPrefixHorizontal },
        { name: "分治法", func: longestCommonPrefixDivideConquer },
        { name: "二分查找", func: longestCommonPrefixBinarySearch }
    ];

    testCases.forEach((testCase, index) => {
        if (index < 4) {  // 只对小规模测试显示详细信息
            console.log(`\n--- 测试用例 ${index + 1}: ${JSON.stringify(testCase)} ---`);

            methods.forEach(method => {
                console.log(`\n${method.name}:`);
                const start = performance.now();
                const result = method.func([...testCase]);
                const end = performance.now();

                console.log(`结果: "${result}", 耗时: ${(end - start).toFixed(3)}ms`);
                validateResult(testCase, result);
            });
        }
    });
}

/**
 * 算法核心概念演示
 */
function demonstrateAlgorithm() {
    console.log("\n=== 算法核心概念演示 ===");

    console.log("\n1. 字符串前缀的定义：");
    console.log("前缀是从字符串开头开始的连续子字符串");
    console.log("例如 'flower' 的前缀有: '', 'f', 'fl', 'flo', 'flow', 'flowe', 'flower'");

    console.log("\n2. 公共前缀的含义：");
    console.log("所有字符串都具有的最长前缀");
    console.log("例如 ['flower', 'flow', 'flight'] 的公共前缀是 'fl'");

    console.log("\n3. 四种算法的特点比较：");
    console.log("纵向扫描：逐字符比较，直观高效");
    console.log("横向扫描：两两合并，递增求解");
    console.log("分治法：递归分解，分而治之");
    console.log("二分查找：长度二分，减少比较");

    console.log("\n4. 复杂度分析：");
    console.log("时间复杂度：都是 O(S)，S是所有字符的总数");
    console.log("空间复杂度：纵向和横向 O(1)，分治 O(m*log n)，二分 O(1)");

    console.log("\n5. 适用场景：");
    console.log("纵向扫描：一般推荐，代码简洁");
    console.log("横向扫描：字符串数量较少时");
    console.log("分治法：教学演示递归思想");
    console.log("二分查找：字符串很长但前缀可能很短时");
}

// 测试运行
function runTests() {
    console.log("🚀 开始测试最长公共前缀算法");

    // 基础测试用例
    const testCases = [
        ["flower", "flow", "flight"],      // 有公共前缀
        ["dog", "racecar", "car"],        // 无公共前缀
        ["interspecies", "interstellar", "interstate"],  // 较长公共前缀
        ["abc"],                          // 单个字符串
        [""],                            // 空字符串
        [],                              // 空数组
        ["same", "same", "same"],        // 完全相同
        ["a", "aa", "aaa"]              // 递增长度
    ];

    testCases.forEach((testCase, index) => {
        console.log(`\n${'='.repeat(50)}`);
        console.log(`测试用例 ${index + 1}: ${JSON.stringify(testCase)}`);
        console.log(`${'='.repeat(50)}`);

        if (testCase.length <= 5) {  // 只对小数组显示详细过程
            const result1 = longestCommonPrefix([...testCase]);
            const result2 = longestCommonPrefixHorizontal([...testCase]);

            // 验证结果一致性
            console.log(`\n✅ 验证: 纵向扫描结果 "${result1}" ${result1 === result2 ? "==" : "!="} 横向扫描结果 "${result2}"`);
        }
    });

    // 运行性能测试
    performanceTest();

    // 演示算法核心概念
    demonstrateAlgorithm();

    console.log("\n🎉 测试完成！");
}

// 如果直接运行此文件，执行测试
if (typeof require !== 'undefined' && require.main === module) {
    runTests();
}