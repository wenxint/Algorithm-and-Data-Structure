/**
 * LeetCode 023: 最长回文子串 (Longest Palindromic Substring)
 *
 * 题目描述：
 * 给你一个字符串 s，找到 s 中最长的回文子串。
 *
 * 核心思想：
 * 1. 中心扩展算法：以每个字符（或字符间隙）为中心向两边扩展
 * 2. 动态规划：利用子问题的最优解构建最终解
 * 3. 马拉车算法：O(n)时间复杂度的最优解法
 *
 * 解题思路：
 * - 回文串的特点是从中心向两边对称
 * - 需要考虑奇数长度（单字符中心）和偶数长度（字符间隙中心）
 * - 可以通过预处理统一处理奇偶长度问题
 */

/**
 * 方法一：中心扩展法（推荐解法）
 *
 * 核心思想：
 * 遍历每个可能的回文中心，向两边扩展寻找最长回文串
 *
 * 算法步骤：
 * 1. 遍历字符串的每个位置作为潜在的回文中心
 * 2. 对于每个中心，分别考虑奇数长度和偶数长度的回文
 * 3. 从中心向两边扩展，直到不满足回文条件
 * 4. 记录最长的回文子串
 *
 * @param {string} s - 输入字符串
 * @returns {string} 最长回文子串
 * @time O(n²) - 每个中心最多扩展n次
 * @space O(1) - 只使用常数额外空间
 */
function longestPalindrome(s) {
    if (!s || s.length <= 1) return s;

    let start = 0;
    let maxLength = 1;

    /**
     * 从中心向两边扩展寻找回文串
     * @param {number} left - 左指针
     * @param {number} right - 右指针
     * @returns {number} 回文串长度
     */
    function expandAroundCenter(left, right) {
        // 向两边扩展，直到不满足回文条件
        while (left >= 0 && right < s.length && s[left] === s[right]) {
            left--;
            right++;
        }
        // 返回回文串长度
        return right - left - 1;
    }

    // 遍历每个可能的回文中心
    for (let i = 0; i < s.length; i++) {
        // 奇数长度回文：以s[i]为中心
        const oddLength = expandAroundCenter(i, i);

        // 偶数长度回文：以s[i]和s[i+1]之间为中心
        const evenLength = expandAroundCenter(i, i + 1);

        // 取两者中的最大值
        const currentMaxLength = Math.max(oddLength, evenLength);

        // 更新最长回文串信息
        if (currentMaxLength > maxLength) {
            maxLength = currentMaxLength;
            // 计算回文串的起始位置
            start = i - Math.floor((currentMaxLength - 1) / 2);
        }
    }

    return s.substring(start, start + maxLength);
}

/**
 * 方法二：动态规划法
 *
 * 核心思想：
 * 利用子问题的解来构建更大问题的解
 * dp[i][j] 表示从索引i到j的子串是否为回文
 *
 * 状态转移方程：
 * dp[i][j] = (s[i] === s[j]) && (j - i <= 2 || dp[i+1][j-1])
 *
 * @param {string} s - 输入字符串
 * @returns {string} 最长回文子串
 * @time O(n²) - 双重循环填充dp表
 * @space O(n²) - 二维dp数组
 */
function longestPalindromeDP(s) {
    if (!s || s.length <= 1) return s;

    const n = s.length;
    // dp[i][j] 表示从i到j的子串是否为回文
    const dp = Array(n).fill().map(() => Array(n).fill(false));

    let start = 0;
    let maxLength = 1;

    // 单个字符都是回文
    for (let i = 0; i < n; i++) {
        dp[i][i] = true;
    }

    // 检查长度为2的子串
    for (let i = 0; i < n - 1; i++) {
        if (s[i] === s[i + 1]) {
            dp[i][i + 1] = true;
            start = i;
            maxLength = 2;
        }
    }

    // 检查长度为3及以上的子串
    for (let length = 3; length <= n; length++) {
        for (let i = 0; i <= n - length; i++) {
            const j = i + length - 1;

            // 如果两端字符相同且内部是回文
            if (s[i] === s[j] && dp[i + 1][j - 1]) {
                dp[i][j] = true;

                if (length > maxLength) {
                    start = i;
                    maxLength = length;
                }
            }
        }
    }

    return s.substring(start, start + maxLength);
}

/**
 * 方法三：马拉车算法 (Manacher's Algorithm)
 *
 * 核心思想：
 * 通过预处理统一奇偶长度问题，利用已知信息减少重复计算
 *
 * 算法步骤：
 * 1. 预处理字符串，在字符间插入特殊字符统一奇偶长度
 * 2. 维护当前最右回文串的中心和右边界
 * 3. 利用回文的对称性，避免重复计算
 *
 * @param {string} s - 输入字符串
 * @returns {string} 最长回文子串
 * @time O(n) - 每个位置最多被访问常数次
 * @space O(n) - 存储预处理后的字符串和半径数组
 */
function longestPalindromeManacher(s) {
    if (!s || s.length <= 1) return s;

    // 预处理：在字符间插入#，统一奇偶长度
    const processed = '#' + s.split('').join('#') + '#';
    const n = processed.length;

    // 记录每个位置的回文半径
    const radius = new Array(n).fill(0);

    let center = 0; // 当前最右回文串的中心
    let rightBoundary = 0; // 当前最右回文串的右边界

    let maxLen = 0;
    let resultCenter = 0;

    for (let i = 0; i < n; i++) {
        // 利用对称性初始化当前位置的半径
        if (i < rightBoundary) {
            const mirror = 2 * center - i; // i关于center的对称点
            radius[i] = Math.min(rightBoundary - i, radius[mirror]);
        }

        // 尝试扩展回文
        while (i - radius[i] - 1 >= 0 &&
               i + radius[i] + 1 < n &&
               processed[i - radius[i] - 1] === processed[i + radius[i] + 1]) {
            radius[i]++;
        }

        // 更新最右边界和中心
        if (i + radius[i] > rightBoundary) {
            center = i;
            rightBoundary = i + radius[i];
        }

        // 更新最长回文串信息
        if (radius[i] > maxLen) {
            maxLen = radius[i];
            resultCenter = i;
        }
    }

    // 还原到原字符串的位置
    const start = (resultCenter - maxLen) / 2;
    return s.substring(start, start + maxLen);
}

/**
 * 方法四：暴力法（用于理解和对比）
 *
 * 核心思想：
 * 枚举所有可能的子串，逐一检查是否为回文
 *
 * @param {string} s - 输入字符串
 * @returns {string} 最长回文子串
 * @time O(n³) - 三重循环
 * @space O(1) - 只使用常数额外空间
 */
function longestPalindromeBruteForce(s) {
    if (!s || s.length <= 1) return s;

    /**
     * 检查子串是否为回文
     * @param {string} str - 待检查的字符串
     * @returns {boolean} 是否为回文
     */
    function isPalindrome(str) {
        let left = 0;
        let right = str.length - 1;

        while (left < right) {
            if (str[left] !== str[right]) {
                return false;
            }
            left++;
            right--;
        }

        return true;
    }

    let maxLength = 1;
    let result = s[0];

    // 枚举所有可能的子串
    for (let i = 0; i < s.length; i++) {
        for (let j = i + 1; j <= s.length; j++) {
            const substring = s.substring(i, j);

            if (isPalindrome(substring) && substring.length > maxLength) {
                maxLength = substring.length;
                result = substring;
            }
        }
    }

    return result;
}

/**
 * 方法五：优化的中心扩展法
 *
 * 核心思想：
 * 在基本中心扩展法基础上添加早期终止条件
 *
 * @param {string} s - 输入字符串
 * @returns {string} 最长回文子串
 * @time O(n²) - 但常数因子更小
 * @space O(1) - 只使用常数额外空间
 */
function longestPalindromeOptimized(s) {
    if (!s || s.length <= 1) return s;

    let start = 0;
    let maxLength = 1;

    function expandAroundCenter(left, right) {
        while (left >= 0 && right < s.length && s[left] === s[right]) {
            left--;
            right++;
        }
        return right - left - 1;
    }

    for (let i = 0; i < s.length; i++) {
        // 早期终止：如果剩余字符串长度不足以产生更长的回文，则停止
        if (s.length - i <= maxLength / 2) {
            break;
        }

        const oddLength = expandAroundCenter(i, i);
        const evenLength = expandAroundCenter(i, i + 1);
        const currentMaxLength = Math.max(oddLength, evenLength);

        if (currentMaxLength > maxLength) {
            maxLength = currentMaxLength;
            start = i - Math.floor((currentMaxLength - 1) / 2);
        }
    }

    return s.substring(start, start + maxLength);
}

// 测试用例
function runTests() {
    console.log('=== LeetCode 023: 最长回文子串 测试 ===\n');

    const testCases = [
        {
            name: '基础测试1',
            input: 'babad',
            expected: ['bab', 'aba'], // 两个都是正确答案
            explanation: '最长回文子串是"bab"或"aba"'
        },
        {
            name: '基础测试2',
            input: 'cbbd',
            expected: ['bb'],
            explanation: '最长回文子串是"bb"'
        },
        {
            name: '单字符',
            input: 'a',
            expected: ['a'],
            explanation: '单字符本身就是回文'
        },
        {
            name: '空字符串',
            input: '',
            expected: [''],
            explanation: '空字符串返回空'
        },
        {
            name: '全相同字符',
            input: 'aaaa',
            expected: ['aaaa'],
            explanation: '全相同字符，整个字符串都是回文'
        },
        {
            name: '无回文（长度>1）',
            input: 'abcdef',
            expected: ['a', 'b', 'c', 'd', 'e', 'f'], // 任意单字符
            explanation: '没有长度大于1的回文，返回任意单字符'
        },
        {
            name: '整个字符串是回文',
            input: 'racecar',
            expected: ['racecar'],
            explanation: '整个字符串就是回文'
        },
        {
            name: '长字符串测试',
            input: 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz',
            expected: ['a', 'b'], // 任意单字符，因为没有更长的回文
            explanation: '长字符串中的最长回文'
        }
    ];

    const methods = [
        { name: '中心扩展法', func: longestPalindrome },
        { name: '动态规划法', func: longestPalindromeDP },
        { name: '马拉车算法', func: longestPalindromeManacher },
        { name: '暴力法', func: longestPalindromeBruteForce },
        { name: '优化中心扩展法', func: longestPalindromeOptimized }
    ];

    testCases.forEach(testCase => {
        console.log(`测试: ${testCase.name}`);
        console.log(`输入: "${testCase.input}"`);
        console.log(`期望: ${JSON.stringify(testCase.expected)}`);
        console.log(`说明: ${testCase.explanation}`);

        methods.forEach(method => {
            const result = method.func(testCase.input);
            const isCorrect = testCase.expected.includes(result);
            console.log(`${method.name}: "${result}" ${isCorrect ? '✓' : '✗'}`);
        });
        console.log('');
    });
}

// 性能测试
function performanceTest() {
    console.log('=== 性能测试 ===\n');

    // 生成测试字符串
    const generateTestString = (length, pattern = 'random') => {
        if (pattern === 'random') {
            return Array.from({length}, () =>
                String.fromCharCode(97 + Math.floor(Math.random() * 26))
            ).join('');
        } else if (pattern === 'palindrome') {
            const half = Array.from({length: Math.floor(length/2)}, () =>
                String.fromCharCode(97 + Math.floor(Math.random() * 26))
            ).join('');
            return half + (length % 2 ? 'x' : '') + half.split('').reverse().join('');
        }
        return 'a'.repeat(length);
    };

    const testCases = [
        { length: 100, pattern: 'random' },
        { length: 500, pattern: 'random' },
        { length: 1000, pattern: 'palindrome' },
        { length: 100, pattern: 'same' }
    ];

    const methods = [
        { name: '中心扩展法', func: longestPalindrome },
        { name: '马拉车算法', func: longestPalindromeManacher },
        { name: '优化中心扩展法', func: longestPalindromeOptimized }
    ];

    testCases.forEach(testCase => {
        console.log(`测试字符串长度: ${testCase.length}, 模式: ${testCase.pattern}`);
        const testString = generateTestString(testCase.length, testCase.pattern);

        methods.forEach(method => {
            const startTime = performance.now();
            const result = method.func(testString);
            const endTime = performance.now();

            console.log(`${method.name}: ${(endTime - startTime).toFixed(2)}ms, 结果长度: ${result.length}`);
        });
        console.log('');
    });
}

// 算法演示
function demonstrateAlgorithm() {
    console.log('=== 算法演示 ===\n');

    const s = 'babad';
    console.log(`测试字符串: "${s}"`);
    console.log('索引位置:   01234');

    console.log('\n中心扩展法过程：');

    let maxLength = 1;
    let start = 0;

    function expandAroundCenter(left, right, type) {
        console.log(`\n${type}长度回文，中心: ${left === right ? left : `${left},${right}`}`);
        let steps = 0;

        while (left >= 0 && right < s.length && s[left] === s[right]) {
            steps++;
            console.log(`  步骤${steps}: s[${left}]='${s[left]}' === s[${right}]='${s[right]}' ✓`);
            console.log(`  当前回文: "${s.substring(left, right + 1)}"`);
            left--;
            right++;
        }

        if (left >= 0 && right < s.length) {
            console.log(`  停止: s[${left}]='${s[left]}' !== s[${right}]='${s[right]}' ✗`);
        } else {
            console.log(`  停止: 到达边界`);
        }

        const length = right - left - 1;
        console.log(`  最终长度: ${length}`);
        return length;
    }

    for (let i = 0; i < s.length; i++) {
        console.log(`\n--- 以位置${i}为中心 ---`);

        // 奇数长度
        const oddLength = expandAroundCenter(i, i, '奇数');

        // 偶数长度
        const evenLength = expandAroundCenter(i, i + 1, '偶数');

        const currentMaxLength = Math.max(oddLength, evenLength);

        if (currentMaxLength > maxLength) {
            maxLength = currentMaxLength;
            start = i - Math.floor((currentMaxLength - 1) / 2);
            console.log(`  ✓ 更新最长回文: "${s.substring(start, start + maxLength)}"`);
        }
    }

    console.log(`\n最终结果: "${s.substring(start, start + maxLength)}"`);
}

// 马拉车算法可视化
function demonstrateManacher() {
    console.log('=== 马拉车算法演示 ===\n');

    const s = 'ababa';
    console.log(`原字符串: "${s}"`);

    // 预处理
    const processed = '#' + s.split('').join('#') + '#';
    console.log(`预处理后: "${processed}"`);
    console.log('索引:      ' + Array.from({length: processed.length}, (_, i) => i).join(''));

    const n = processed.length;
    const radius = new Array(n).fill(0);

    let center = 0;
    let rightBoundary = 0;

    console.log('\n计算过程：');

    for (let i = 0; i < n; i++) {
        console.log(`\n位置${i} (字符='${processed[i]}'):`);

        if (i < rightBoundary) {
            const mirror = 2 * center - i;
            radius[i] = Math.min(rightBoundary - i, radius[mirror]);
            console.log(`  利用对称性: mirror=${mirror}, 初始radius[${i}]=${radius[i]}`);
        }

        // 尝试扩展
        let expandCount = 0;
        while (i - radius[i] - 1 >= 0 &&
               i + radius[i] + 1 < n &&
               processed[i - radius[i] - 1] === processed[i + radius[i] + 1]) {
            radius[i]++;
            expandCount++;
        }

        if (expandCount > 0) {
            console.log(`  扩展${expandCount}次，最终radius[${i}]=${radius[i]}`);
        }

        if (i + radius[i] > rightBoundary) {
            center = i;
            rightBoundary = i + radius[i];
            console.log(`  更新中心=${center}, 右边界=${rightBoundary}`);
        }
    }

    console.log(`\n半径数组: [${radius.join(', ')}]`);

    // 找到最长回文
    const maxRadius = Math.max(...radius);
    const maxIndex = radius.indexOf(maxRadius);
    const originalStart = (maxIndex - maxRadius) / 2;
    const result = s.substring(originalStart, originalStart + maxRadius);

    console.log(`最大半径: ${maxRadius}, 位置: ${maxIndex}`);
    console.log(`最长回文: "${result}"`);
}

// 边界情况分析
function edgeCaseAnalysis() {
    console.log('=== 边界情况分析 ===\n');

    const edgeCases = [
        {
            name: '空字符串',
            input: '',
            analysis: '特殊情况，直接返回空字符串'
        },
        {
            name: '单字符',
            input: 'a',
            analysis: '单字符本身就是回文，长度为1'
        },
        {
            name: '两个相同字符',
            input: 'aa',
            analysis: '偶数长度回文的最简情况'
        },
        {
            name: '两个不同字符',
            input: 'ab',
            analysis: '无长度>1的回文，返回任意单字符'
        },
        {
            name: '全相同字符',
            input: 'aaaa',
            analysis: '整个字符串都是回文'
        },
        {
            name: '无重复字符',
            input: 'abcde',
            analysis: '只有单字符回文，返回长度为1的子串'
        },
        {
            name: '对称回文',
            input: 'racecar',
            analysis: '经典的奇数长度回文'
        },
        {
            name: '中心对称',
            input: 'abccba',
            analysis: '经典的偶数长度回文'
        }
    ];

    edgeCases.forEach(testCase => {
        console.log(`情况: ${testCase.name}`);
        console.log(`输入: "${testCase.input}"`);
        console.log(`分析: ${testCase.analysis}`);

        const result = longestPalindrome(testCase.input);
        console.log(`结果: "${result}" (长度=${result.length})`);
        console.log('');
    });
}

// 复杂度分析
function complexityAnalysis() {
    console.log('=== 复杂度分析 ===\n');

    const methods = [
        {
            name: '中心扩展法',
            timeComplexity: 'O(n²)',
            spaceComplexity: 'O(1)',
            description: 'n个中心，每个最多扩展n次'
        },
        {
            name: '动态规划法',
            timeComplexity: 'O(n²)',
            spaceComplexity: 'O(n²)',
            description: '填充n×n的dp表'
        },
        {
            name: '马拉车算法',
            timeComplexity: 'O(n)',
            spaceComplexity: 'O(n)',
            description: '线性时间，最优解法'
        },
        {
            name: '暴力法',
            timeComplexity: 'O(n³)',
            spaceComplexity: 'O(1)',
            description: 'n²个子串，每个检查需要O(n)'
        },
        {
            name: '优化中心扩展法',
            timeComplexity: 'O(n²)',
            spaceComplexity: 'O(1)',
            description: '添加剪枝，常数因子更小'
        }
    ];

    console.log('各方法复杂度对比：');
    console.log('方法\t\t\t时间复杂度\t空间复杂度\t说明');
    console.log('-'.repeat(80));

    methods.forEach(method => {
        console.log(`${method.name.padEnd(15)}\t${method.timeComplexity}\t\t${method.spaceComplexity}\t\t${method.description}`);
    });

    console.log('\n推荐解法选择：');
    console.log('1. 面试中推荐中心扩展法：思路清晰，易于理解和实现');
    console.log('2. 追求最优性能用马拉车算法：O(n)时间复杂度');
    console.log('3. 学习用动态规划法：体现子问题最优子结构');
}

// 扩展应用
function extendedApplications() {
    console.log('=== 扩展应用 ===\n');

    console.log('1. 回文相关问题：');
    console.log('   - 回文子序列（不要求连续）');
    console.log('   - 最短回文串（在前面添加字符）');
    console.log('   - 分割回文串');

    console.log('\n2. 字符串处理：');
    console.log('   - 最长公共子串');
    console.log('   - 字符串匹配算法');
    console.log('   - 回文检测优化');

    // 示例：检查多个字符串是否包含回文
    function hasLongPalindrome(strings, minLength = 3) {
        const results = [];

        strings.forEach(str => {
            const longest = longestPalindrome(str);
            const hasLong = longest.length >= minLength;
            results.push({
                string: str,
                longestPalindrome: longest,
                hasLongPalindrome: hasLong
            });
        });

        return results;
    }

    console.log('\n实例应用 - 批量回文检测：');
    const testStrings = ['hello', 'racecar', 'abccba', 'programming', 'madam'];
    const palindromeResults = hasLongPalindrome(testStrings);

    palindromeResults.forEach(result => {
        console.log(`"${result.string}" -> 最长回文: "${result.longestPalindrome}" (${result.hasLongPalindrome ? '有' : '无'}长回文)`);
    });
}

// 实际应用示例
function practicalExample() {
    console.log('=== 实际应用示例 ===\n');

    console.log('场景：文本处理中的回文词识别');
    console.log('应用：自然语言处理、拼写检查、文本分析');

    // 模拟文本中的回文词检测
    function findPalindromeWords(text) {
        // 简单的单词分割（实际应用中会更复杂）
        const words = text.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/);
        const palindromes = [];

        words.forEach(word => {
            if (word.length >= 3) { // 只检查长度>=3的单词
                const longest = longestPalindrome(word);
                if (longest.length === word.length && longest.length >= 3) {
                    palindromes.push(word);
                }
            }
        });

        return palindromes;
    }

    const sampleText = "A man, a plan, a canal: Panama! Was it a car or a cat I saw? Racecar drivers are fast.";
    console.log(`示例文本: "${sampleText}"`);

    const foundPalindromes = findPalindromeWords(sampleText);
    console.log(`发现的回文词: [${foundPalindromes.join(', ')}]`);

    // DNA序列中的回文检测
    console.log('\nDNA序列回文检测：');
    const dnaSequences = ['ATCGATCG', 'GAATTC', 'AAGCTT', 'RANDOM'];

    dnaSequences.forEach(seq => {
        const palindrome = longestPalindrome(seq);
        console.log(`${seq}: 最长回文 "${palindrome}" (长度${palindrome.length})`);
    });
}

// 面试要点总结
function interviewKeyPoints() {
    console.log('=== 面试要点总结 ===\n');

    console.log('🎯 核心考点：');
    console.log('1. 字符串处理和回文识别');
    console.log('2. 中心扩展思想的应用');
    console.log('3. 动态规划的状态设计');
    console.log('4. 时间空间复杂度的权衡');

    console.log('\n💡 解题思路：');
    console.log('1. 理解回文的性质：中心对称');
    console.log('2. 考虑奇偶长度两种情况');
    console.log('3. 从暴力解法开始，逐步优化');
    console.log('4. 掌握中心扩展的核心思想');

    console.log('\n🔍 常见陷阱：');
    console.log('1. 忘记处理奇偶长度回文');
    console.log('2. 边界条件处理不当');
    console.log('3. 字符串索引越界');
    console.log('4. 空字符串和单字符的特殊情况');

    console.log('\n📈 优化思路：');
    console.log('1. 中心扩展法：直观易懂，O(n²)');
    console.log('2. 马拉车算法：最优解法，O(n)');
    console.log('3. 动态规划：体现最优子结构');
    console.log('4. 剪枝优化：减少不必要的计算');

    console.log('\n🎪 变形问题：');
    console.log('1. 最长回文子序列');
    console.log('2. 回文串分割');
    console.log('3. 构造最短回文串');
    console.log('4. 回文对问题');
}

// 导出所有方法
module.exports = {
    longestPalindrome,
    longestPalindromeDP,
    longestPalindromeManacher,
    longestPalindromeBruteForce,
    longestPalindromeOptimized,
    runTests,
    performanceTest,
    demonstrateAlgorithm,
    demonstrateManacher,
    edgeCaseAnalysis,
    complexityAnalysis,
    extendedApplications,
    practicalExample,
    interviewKeyPoints
};

// 如果直接运行此文件，则执行测试
if (require.main === module) {
    runTests();
    performanceTest();
    demonstrateAlgorithm();
    demonstrateManacher();
    edgeCaseAnalysis();
    complexityAnalysis();
    extendedApplications();
    practicalExample();
    interviewKeyPoints();
}