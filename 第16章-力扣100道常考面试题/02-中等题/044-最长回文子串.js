/**
 * LeetCode 5. 最长回文子串
 *
 * 问题描述：
 * 给你一个字符串 s，找到 s 中最长的回文子串。
 * 回文字符串是指正着读和倒着读都一样的字符串。
 *
 * 核心思想：
 * 回文字符串的特点是从中心向两边扩展时字符相同
 * 主要解法有：
 * 1. 中心扩展法 - O(n²)
 * 2. 动态规划 - O(n²)
 * 3. Manacher算法 - O(n)
 * 4. 暴力解法 - O(n³)
 *
 * 示例：
 * 输入：s = "babad"
 * 输出："bab" 或 "aba"
 * 解释："aba" 同样是符合题意的答案
 */

/**
 * 方法一：中心扩展法（推荐）
 *
 * 核心思想：
 * 回文字符串具有中心对称的特性，我们可以枚举每个可能的回文中心，
 * 然后向两边扩展，直到不能构成回文为止
 * 需要考虑两种情况：奇数长度回文（中心是单个字符）和偶数长度回文（中心是两个字符之间）
 *
 * 算法步骤：
 * 1. 遍历字符串的每个位置作为可能的回文中心
 * 2. 对于每个中心，分别尝试奇数长度和偶数长度的扩展
 * 3. 从中心向两边扩展，记录最长的回文子串
 * 4. 返回最长的回文子串
 *
 * @param {string} s - 输入字符串
 * @returns {string} 最长回文子串
 * @time O(n²) 每个中心最多扩展n次
 * @space O(1) 只使用常数额外空间
 */
function longestPalindrome(s) {
    console.log("=== 最长回文子串（中心扩展法） ===");
    console.log(`输入字符串: "${s}"`);

    if (!s || s.length < 1) {
        console.log("输入为空，返回空字符串");
        return "";
    }

    let start = 0; // 最长回文子串的起始位置
    let maxLength = 0; // 最长回文子串的长度

    /**
     * 从中心扩展寻找回文子串
     * @param {number} left - 左边界
     * @param {number} right - 右边界
     * @returns {number} 回文子串长度
     */
    function expandAroundCenter(left, right) {
        console.log(`    扩展中心: [${left}, ${right}]`);

        // 向两边扩展，直到不满足回文条件
        while (left >= 0 && right < s.length && s[left] === s[right]) {
            console.log(`      比较 s[${left}]='${s[left]}' 与 s[${right}]='${s[right]}'，相等，继续扩展`);
            left--;
            right++;
        }

        // 计算回文长度（注意边界调整）
        const length = right - left - 1;
        const palindrome = s.substring(left + 1, right);
        console.log(`      找到回文: "${palindrome}"，长度: ${length}`);

        return length;
    }

    console.log("\n开始遍历每个可能的回文中心:");

    for (let i = 0; i < s.length; i++) {
        console.log(`\n检查位置 ${i} (字符 '${s[i]}'):`);

        // 检查以i为中心的奇数长度回文
        console.log(`  奇数长度回文（中心: ${i}）:`);
        const oddLength = expandAroundCenter(i, i);

        // 检查以i和i+1为中心的偶数长度回文
        console.log(`  偶数长度回文（中心: ${i}, ${i + 1}）:`);
        const evenLength = expandAroundCenter(i, i + 1);

        // 更新最长回文记录
        const currentMaxLength = Math.max(oddLength, evenLength);
        if (currentMaxLength > maxLength) {
            maxLength = currentMaxLength;
            // 计算起始位置
            start = i - Math.floor((currentMaxLength - 1) / 2);
            console.log(`  ✅ 更新最长回文: 长度=${maxLength}, 起始位置=${start}`);
        }
    }

    const result = s.substring(start, start + maxLength);
    console.log(`\n最终结果: "${result}" (位置: ${start}-${start + maxLength - 1})`);
    return result;
}

/**
 * 方法二：动态规划法
 *
 * 核心思想：
 * 使用二维数组dp[i][j]表示子串s[i...j]是否为回文
 * 状态转移方程：dp[i][j] = (s[i] == s[j]) && (j - i < 3 || dp[i+1][j-1])
 * 按照子串长度从小到大的顺序填充dp表
 *
 * @param {string} s - 输入字符串
 * @returns {string} 最长回文子串
 * @time O(n²) 填充n×n的dp表
 * @space O(n²) dp表的空间
 */
function longestPalindromeDP(s) {
    console.log("\n=== 最长回文子串（动态规划法） ===");
    console.log(`输入字符串: "${s}"`);

    if (!s || s.length < 1) {
        console.log("输入为空，返回空字符串");
        return "";
    }

    const n = s.length;
    // dp[i][j] 表示子串 s[i...j] 是否为回文
    const dp = Array(n).fill(null).map(() => Array(n).fill(false));

    let start = 0; // 最长回文子串的起始位置
    let maxLength = 1; // 最长回文子串的长度

    console.log("\n初始化DP表:");

    // 初始化：所有长度为1的子串都是回文
    for (let i = 0; i < n; i++) {
        dp[i][i] = true;
        console.log(`dp[${i}][${i}] = true (单字符 '${s[i]}' 是回文)`);
    }

    console.log("\n检查长度为2的子串:");
    // 检查长度为2的子串
    for (let i = 0; i < n - 1; i++) {
        if (s[i] === s[i + 1]) {
            dp[i][i + 1] = true;
            start = i;
            maxLength = 2;
            console.log(`dp[${i}][${i + 1}] = true (子串 "${s.substring(i, i + 2)}" 是回文)`);
            console.log(`更新最长回文: "${s.substring(i, i + 2)}", 长度: 2`);
        } else {
            console.log(`dp[${i}][${i + 1}] = false (子串 "${s.substring(i, i + 2)}" 不是回文)`);
        }
    }

    console.log("\n检查长度为3及以上的子串:");
    // 检查长度为3及以上的子串
    for (let length = 3; length <= n; length++) {
        console.log(`  检查长度为 ${length} 的子串:`);

        for (let i = 0; i <= n - length; i++) {
            const j = i + length - 1; // 结束位置
            const substring = s.substring(i, j + 1);

            // 状态转移：s[i] == s[j] 且 s[i+1...j-1] 是回文
            if (s[i] === s[j] && dp[i + 1][j - 1]) {
                dp[i][j] = true;
                start = i;
                maxLength = length;
                console.log(`    dp[${i}][${j}] = true (子串 "${substring}" 是回文)`);
                console.log(`    更新最长回文: "${substring}", 长度: ${length}`);
            } else {
                dp[i][j] = false;
                const reason = s[i] !== s[j] ?
                    `首尾不等 ('${s[i]}' != '${s[j]}')` :
                    `内部不是回文 (dp[${i + 1}][${j - 1}] = ${dp[i + 1][j - 1]})`;
                console.log(`    dp[${i}][${j}] = false (子串 "${substring}" 不是回文: ${reason})`);
            }
        }
    }

    // 打印DP表
    console.log("\n最终DP表:");
    printDPTable(dp, s);

    const result = s.substring(start, start + maxLength);
    console.log(`\n最终结果: "${result}" (位置: ${start}-${start + maxLength - 1})`);
    return result;
}

/**
 * 方法三：Manacher算法（马拉车算法）
 *
 * 核心思想：
 * 通过预处理字符串（在每个字符间插入特殊字符），统一处理奇偶长度回文
 * 利用回文的对称性，避免重复计算，达到线性时间复杂度
 * 维护一个最右回文边界和对应的中心，利用已知信息加速计算
 *
 * @param {string} s - 输入字符串
 * @returns {string} 最长回文子串
 * @time O(n) 线性时间复杂度
 * @space O(n) 预处理字符串和辅助数组的空间
 */
function longestPalindromeManacher(s) {
    console.log("\n=== 最长回文子串（Manacher算法） ===");
    console.log(`输入字符串: "${s}"`);

    if (!s || s.length < 1) {
        console.log("输入为空，返回空字符串");
        return "";
    }

    // 预处理字符串，在每个字符间插入#，首尾加^和$防止越界
    const processedStr = "^#" + s.split('').join('#') + "#$";
    console.log(`预处理后字符串: "${processedStr}"`);

    const n = processedStr.length;
    const radius = new Array(n).fill(0); // 每个位置的回文半径
    let center = 0; // 回文中心
    let rightBoundary = 0; // 最右回文边界

    let maxLength = 0; // 最长回文长度
    let resultCenter = 0; // 最长回文的中心

    console.log("\n开始Manacher算法:");

    for (let i = 1; i < n - 1; i++) {
        console.log(`\n处理位置 ${i} (字符 '${processedStr[i]}'):`);

        // 利用回文的对称性初始化半径
        if (i < rightBoundary) {
            const mirror = 2 * center - i; // i关于center的对称点
            radius[i] = Math.min(rightBoundary - i, radius[mirror]);
            console.log(`  位置 ${i} 在回文范围内，对称点: ${mirror}`);
            console.log(`  初始半径: min(${rightBoundary} - ${i}, ${radius[mirror]}) = ${radius[i]}`);
        } else {
            radius[i] = 0;
            console.log(`  位置 ${i} 不在回文范围内，初始半径: 0`);
        }

        // 尝试扩展回文
        console.log(`  开始扩展回文:`);
        while (processedStr[i + radius[i] + 1] === processedStr[i - radius[i] - 1]) {
            radius[i]++;
            const leftChar = processedStr[i - radius[i]];
            const rightChar = processedStr[i + radius[i]];
            console.log(`    扩展成功: '${leftChar}' == '${rightChar}'，半径变为 ${radius[i]}`);
        }

        // 如果回文扩展超过了当前右边界，更新中心和右边界
        if (i + radius[i] > rightBoundary) {
            center = i;
            rightBoundary = i + radius[i];
            console.log(`  更新回文中心: ${center}, 右边界: ${rightBoundary}`);
        }

        // 更新最长回文记录
        if (radius[i] > maxLength) {
            maxLength = radius[i];
            resultCenter = i;
            console.log(`  ✅ 更新最长回文: 中心=${resultCenter}, 半径=${maxLength}`);
        }

        console.log(`  当前半径数组: [${radius.slice(0, 10).join(', ')}${n > 10 ? '...' : ''}]`);
    }

    // 从处理后的字符串还原到原字符串
    const originalStart = Math.floor((resultCenter - maxLength) / 2);
    const result = s.substring(originalStart, originalStart + maxLength);

    console.log(`\n最终结果: "${result}"`);
    console.log(`原字符串位置: ${originalStart}-${originalStart + maxLength - 1}`);
    console.log(`处理后字符串中心: ${resultCenter}, 半径: ${maxLength}`);

    return result;
}

/**
 * 方法四：暴力解法
 *
 * 核心思想：
 * 枚举所有可能的子串，检查每个子串是否为回文
 * 虽然时间复杂度较高，但逻辑简单，适合理解问题
 *
 * @param {string} s - 输入字符串
 * @returns {string} 最长回文子串
 * @time O(n³) 枚举子串O(n²)，检查回文O(n)
 * @space O(1) 只使用常数额外空间
 */
function longestPalindromeBruteForce(s) {
    console.log("\n=== 最长回文子串（暴力解法） ===");
    console.log(`输入字符串: "${s}"`);

    if (!s || s.length < 1) {
        console.log("输入为空，返回空字符串");
        return "";
    }

    /**
     * 检查字符串是否为回文
     * @param {string} str - 待检查的字符串
     * @returns {boolean} 是否为回文
     */
    function isPalindrome(str) {
        const n = str.length;
        for (let i = 0; i < Math.floor(n / 2); i++) {
            if (str[i] !== str[n - 1 - i]) {
                return false;
            }
        }
        return true;
    }

    let longestPalin = "";
    let maxLength = 0;

    console.log("\n枚举所有子串:");

    // 按长度从大到小枚举（优化：一旦找到就是最长的）
    for (let length = s.length; length >= 1; length--) {
        console.log(`\n检查长度为 ${length} 的子串:`);

        for (let i = 0; i <= s.length - length; i++) {
            const substring = s.substring(i, i + length);
            console.log(`  检查子串 "${substring}" (位置: ${i}-${i + length - 1}):`);

            if (isPalindrome(substring)) {
                console.log(`    ✅ 是回文，长度: ${length}`);
                console.log(`    找到最长回文子串: "${substring}"`);
                return substring;
            } else {
                console.log(`    ❌ 不是回文`);
            }
        }
    }

    return longestPalin;
}

// ===========================================
// 辅助函数
// ===========================================

/**
 * 打印DP表格
 * @param {boolean[][]} dp - DP表
 * @param {string} s - 原字符串
 */
function printDPTable(dp, s) {
    const n = dp.length;
    console.log("DP表 (true表示回文，false表示非回文):");

    // 打印列标题
    let header = "    ";
    for (let j = 0; j < n; j++) {
        header += j.toString().padStart(6);
    }
    console.log(header);

    // 打印字符行
    let charRow = "    ";
    for (let j = 0; j < n; j++) {
        charRow += ("'" + s[j] + "'").padStart(6);
    }
    console.log(charRow);

    // 打印分隔线
    console.log("    " + "-".repeat(n * 6));

    // 打印DP表内容
    for (let i = 0; i < n; i++) {
        let row = `${i}:'${s[i]}'`;
        for (let j = 0; j < n; j++) {
            if (j < i) {
                row += "     -"; // 下三角不使用
            } else {
                row += (dp[i][j] ? "  true" : " false");
            }
        }
        console.log(row);
    }
}

/**
 * 验证回文子串结果
 * @param {string} s - 原字符串
 * @param {string} result - 算法结果
 * @returns {boolean} 是否正确
 */
function validatePalindrome(s, result) {
    console.log("\n=== 结果验证 ===");
    console.log(`原字符串: "${s}"`);
    console.log(`算法结果: "${result}"`);

    // 检查结果是否为原字符串的子串
    const isSubstring = s.includes(result);
    console.log(`是子串: ${isSubstring ? '✅' : '❌'}`);

    // 检查结果是否为回文
    const isPalin = result === result.split('').reverse().join('');
    console.log(`是回文: ${isPalin ? '✅' : '❌'}`);

    // 检查是否存在更长的回文子串（暴力验证）
    let hasLonger = false;
    for (let i = 0; i < s.length; i++) {
        for (let j = i + result.length + 1; j <= s.length; j++) {
            const substr = s.substring(i, j);
            if (substr === substr.split('').reverse().join('')) {
                hasLonger = true;
                console.log(`❌ 发现更长回文: "${substr}"`);
                break;
            }
        }
        if (hasLonger) break;
    }

    if (!hasLonger) {
        console.log(`长度最优: ✅`);
    }

    return isSubstring && isPalin && !hasLonger;
}

/**
 * 性能测试
 */
function performanceTest() {
    console.log("\n=== 性能测试 ===");

    // 生成测试用例
    const generateTestString = (length, charSet = 'abcde') => {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += charSet[Math.floor(Math.random() * charSet.length)];
        }
        return result;
    };

    const testCases = [
        "babad",
        "cbbd",
        generateTestString(50, 'abc'),
        generateTestString(100, 'abcd'),
        "a".repeat(100), // 全相同字符
        "abcdefghijklmnopqrstuvwxyz" // 无回文
    ];

    const methods = [
        { name: '中心扩展法', func: longestPalindrome },
        { name: '动态规划法', func: longestPalindromeDP },
        { name: 'Manacher算法', func: longestPalindromeManacher },
        { name: '暴力解法', func: longestPalindromeBruteForce }
    ];

    for (let i = 0; i < testCases.length; i++) {
        const testStr = testCases[i];
        console.log(`\n测试字符串 ${i + 1}: "${testStr.substring(0, 20)}${testStr.length > 20 ? '...' : ''}" (长度: ${testStr.length})`);

        const results = [];

        for (const method of methods) {
            // 对于长字符串跳过暴力解法
            if (method.name === '暴力解法' && testStr.length > 20) {
                console.log(`${method.name}: 跳过（字符串过长）`);
                continue;
            }

            const startTime = performance.now();
            const result = method.func(testStr);
            const endTime = performance.now();

            results.push(result);
            console.log(`${method.name}: "${result}" (长度: ${result.length}), 耗时: ${(endTime - startTime).toFixed(3)}ms`);
        }

        // 检查结果一致性
        const validResults = results.filter(r => r !== undefined);
        const allSameLength = validResults.every(r => r.length === validResults[0].length);
        console.log(`结果长度一致: ${allSameLength ? '✅' : '❌'}`);
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
    console.log("最长回文子串算法测试");
    console.log("=".repeat(50));

    const testCases = [
        { input: "babad", expectedLength: 3 },
        { input: "cbbd", expectedLength: 2 },
        { input: "a", expectedLength: 1 },
        { input: "ac", expectedLength: 1 },
        { input: "racecar", expectedLength: 7 },
        { input: "noon", expectedLength: 4 },
        { input: "abcdef", expectedLength: 1 },
        { input: "aabbaa", expectedLength: 6 }
    ];

    testCases.forEach((testCase, index) => {
        console.log(`\n${"=".repeat(30)}`);
        console.log(`测试用例 ${index + 1}: "${testCase.input}"`);
        console.log(`${"=".repeat(30)}`);

        // 测试所有方法
        const methods = [
            { name: "中心扩展法", func: longestPalindrome },
            { name: "动态规划法", func: longestPalindromeDP },
            { name: "Manacher算法", func: longestPalindromeManacher },
            { name: "暴力解法", func: longestPalindromeBruteForce }
        ];

        const results = [];

        for (const method of methods) {
            console.log(`\n--- ${method.name} ---`);
            try {
                const result = method.func(testCase.input);
                results.push(result);

                const isCorrectLength = result.length === testCase.expectedLength;
                console.log(`结果: "${result}", 长度: ${result.length}, 期望长度: ${testCase.expectedLength}`);
                console.log(`长度正确: ${isCorrectLength ? '✅' : '❌'}`);

                // 验证结果
                validatePalindrome(testCase.input, result);
            } catch (error) {
                console.log(`❌ 方法执行失败: ${error.message}`);
                results.push(null);
            }
        }

        // 检查所有方法结果长度是否一致
        console.log("\n--- 方法一致性检查 ---");
        const validResults = results.filter(r => r !== null);
        const allSameLength = validResults.every(result => result.length === validResults[0].length);
        console.log(`所有方法结果长度一致: ${allSameLength ? '✅' : '❌'}`);
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
    console.log("最长回文子串算法演示");
    console.log("=".repeat(50));

    console.log("回文子串问题的四种主要解法:");
    console.log("1. 中心扩展法 - O(n²)，易理解，空间效率高");
    console.log("2. 动态规划法 - O(n²)，空间换时间，清晰展示状态转移");
    console.log("3. Manacher算法 - O(n)，最优时间复杂度，利用回文对称性");
    console.log("4. 暴力解法 - O(n³)，最直观的方法");

    const demoString = "babad";
    console.log(`\n演示字符串: "${demoString}"`);

    console.log("\n算法特点对比:");
    console.log("- 中心扩展：直观易懂，适合面试现场实现");
    console.log("- 动态规划：状态清晰，便于理解回文性质");
    console.log("- Manacher：最优复杂度，工程实践首选");
    console.log("- 暴力解法：逻辑简单，适合验证其他算法");

    console.log("\n详细演示 - 中心扩展法:");
    const result = longestPalindrome(demoString);

    console.log("\n时间复杂度对比:");
    console.log("中心扩展法: O(n²)");
    console.log("动态规划法: O(n²)");
    console.log("Manacher算法: O(n)");
    console.log("暴力解法: O(n³)");

    console.log("\n空间复杂度对比:");
    console.log("中心扩展法: O(1)");
    console.log("动态规划法: O(n²)");
    console.log("Manacher算法: O(n)");
    console.log("暴力解法: O(1)");
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
    console.log("1. 回文字符串的对称性特征");
    console.log("2. 奇数长度vs偶数长度回文的处理差异");
    console.log("3. 中心扩展的两种情况（单中心/双中心）");
    console.log("4. Manacher算法的对称性利用");

    console.log("\n🔧 实现技巧:");
    console.log("1. 中心扩展：分别处理奇偶长度回文");
    console.log("2. 动态规划：状态转移dp[i][j] = (s[i]==s[j]) && dp[i+1][j-1]");
    console.log("3. Manacher：预处理统一奇偶，利用已知信息加速");
    console.log("4. 边界处理：避免数组越界和空字符串情况");

    console.log("\n❗ 常见陷阱:");
    console.log("1. 忘记处理偶数长度回文的情况");
    console.log("2. 中心扩展时边界条件判断错误");
    console.log("3. DP状态转移的边界初始化");
    console.log("4. Manacher算法的字符串预处理");
    console.log("5. 结果索引计算错误");

    console.log("\n🎨 变体问题:");
    console.log("1. 回文子序列（不要求连续）");
    console.log("2. 最短回文字符串");
    console.log("3. 分割回文串");
    console.log("4. 验证回文字符串");
    console.log("5. 回文对");

    console.log("\n📊 复杂度分析:");
    console.log("时间复杂度:");
    console.log("- 中心扩展: O(n²)");
    console.log("- 动态规划: O(n²)");
    console.log("- Manacher: O(n)");
    console.log("- 暴力解法: O(n³)");

    console.log("\n空间复杂度:");
    console.log("- 中心扩展: O(1)");
    console.log("- 动态规划: O(n²)");
    console.log("- Manacher: O(n)");
    console.log("- 暴力解法: O(1)");

    console.log("\n💡 面试技巧:");
    console.log("1. 先确认是否需要返回所有最长回文还是任意一个");
    console.log("2. 询问字符串长度范围，选择合适算法");
    console.log("3. 从简单的中心扩展开始，再优化到Manacher");
    console.log("4. 解释清楚奇偶回文的处理方式");
    console.log("5. 考虑边界情况和特殊输入");

    console.log("\n🔍 相关概念:");
    console.log("1. 字符串处理的基本技巧");
    console.log("2. 动态规划在字符串问题中的应用");
    console.log("3. 利用问题性质优化算法复杂度");
    console.log("4. 预处理技巧简化问题");

    console.log("\n🌟 实际应用:");
    console.log("1. DNA序列分析中的重复模式检测");
    console.log("2. 文本编辑器的查找替换功能");
    console.log("3. 数据压缩中的模式识别");
    console.log("4. 密码学中的模式分析");
    console.log("5. 自然语言处理中的语言模式识别");
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        longestPalindrome,
        longestPalindromeDP,
        longestPalindromeManacher,
        longestPalindromeBruteForce,
        validatePalindrome,
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