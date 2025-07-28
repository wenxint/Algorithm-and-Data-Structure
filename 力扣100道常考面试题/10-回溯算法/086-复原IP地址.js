/**
 * LeetCode 93. 复原IP地址
 *
 * 问题描述：
 * 有效IP地址正好由四个整数（每个整数位于0到255之间组成，且不能含有前导0），整数之间用'.'分隔。
 * 例如："0.1.2.201"和"192.168.1.1"是有效IP地址，但是"0.011.255.245"、"192.168.1.312"和"192.168@1.1"是无效IP地址。
 * 给定一个只包含数字的字符串s，用以表示一个IP地址，返回所有可能的有效IP地址，这些地址可以通过在s中插入'.'来形成。
 * 你不能重新排序或删除s中的任何数字。你可以按任何顺序返回答案。
 *
 * 核心思想：
 * 回溯法 - 通过递归尝试所有可能的IP地址分段方式，验证每段的有效性
 * 关键约束：
 * 1. IP地址由4段组成
 * 2. 每段数字必须在0-255之间
 * 3. 不能有前导0（除非该段就是0）
 * 4. 整个字符串必须被完全使用
 *
 * 算法步骤：
 * 1. 使用回溯法递归生成所有可能的分段方式
 * 2. 对每段进行有效性验证
 * 3. 当成功生成4段且使用完所有字符时，加入结果集
 * 4. 回溯并尝试其他分段方式
 *
 * 示例：
 * 输入：s = "25525511135"
 * 输出：["255.255.11.135","255.255.111.35"]
 */

/**
 * 方法一：标准回溯法
 *
 * 核心思想：
 * 使用递归回溯生成所有可能的IP地址分段方式，通过剪枝避免无效解
 * 每步递归尝试截取1-3位数字作为当前IP段
 *
 * @param {string} s - 输入的只包含数字的字符串
 * @return {string[]} 所有可能的有效IP地址
 * @time O(3^4) = O(81) - 每段最多有3种选择，共4段
 * @space O(4) - 递归栈深度最多为4
 */
function restoreIpAddresses(s) {
    const result = [];
    const path = [];
    
    // 回溯函数
    const backtrack = (startIndex) => {
        // 终止条件：已经分割出4段IP
        if (path.length === 4) {
            // 如果已经遍历完整个字符串，则加入结果
            if (startIndex === s.length) {
                result.push(path.join('.'));
            }
            return;
        }
        
        // 单层逻辑：尝试截取1-3位数字作为IP段
        for (let i = startIndex; i < s.length; i++) {
            // 截取的字符串
            const str = s.substring(startIndex, i + 1);
            
            // 验证IP段的有效性
            if (isValidIpSegment(str)) {
                path.push(str);
                backtrack(i + 1);
                path.pop(); // 回溯
            } else {
                // 如果当前段无效，后续更长的段也无效，直接break
                break;
            }
        }
    };
    
    // IP段有效性验证函数
    const isValidIpSegment = (str) => {
        // 长度大于1且以0开头的段无效
        if (str.length > 1 && str[0] === '0') {
            return false;
        }
        
        // 转换为数字，判断是否在0-255之间
        const num = parseInt(str);
        return num >= 0 && num <= 255;
    };
    
    backtrack(0);
    return result;
}

/**
 * 方法二：迭代法（非递归实现）
 *
 * 核心思想：
 * 使用三重循环枚举所有可能的分割点，将字符串分成4段
 * 每段进行有效性验证，通过则组合成IP地址
 *
 * @param {string} s - 输入的只包含数字的字符串
 * @return {string[]} 所有可能的有效IP地址
 * @time O(3^3) = O(27) - 三层循环，每层最多3种选择
 * @space O(1) - 只使用常数额外空间
 */
function restoreIpAddressesIterative(s) {
    const result = [];
    const n = s.length;
    
    // 三重循环枚举三个分割点
    // i, j, k 分别表示前三个段的结束位置
    for (let i = 1; i < 4 && i < n - 2; i++) {
        for (let j = i + 1; j < i + 4 && j < n - 1; j++) {
            for (let k = j + 1; k < j + 4 && k < n; k++) {
                // 分割成四段
                const seg1 = s.substring(0, i);
                const seg2 = s.substring(i, j);
                const seg3 = s.substring(j, k);
                const seg4 = s.substring(k);
                
                // 验证每段的有效性
                if (isValidIpSegment(seg1) && isValidIpSegment(seg2) && isValidIpSegment(seg3) && isValidIpSegment(seg4)) {
                    result.push(`${seg1}.${seg2}.${seg3}.${seg4}`);
                }
            }
        }
    }
    
    return result;
}

/**
 * IP段有效性验证函数
 * @param {string} str - 待验证的IP段
 * @return {boolean} 验证结果
 */
// IP段有效性验证函数（内部使用）
function isValidIpSegment(str) {
    // 长度大于1且以0开头的段无效
    if (str.length > 1 && str[0] === '0') {
        return false;
    }
    
    // 转换为数字，判断是否在0-255之间
    const num = parseInt(str);
    return num >= 0 && num <= 255;
}

/**
 * 测试用例集合
 */
function testRestoreIpAddresses() {
    console.log("=== 复原IP地址算法测试 ===\n");
    
    const testCases = [
        {
            s: "25525511135",
            expected: ["255.255.11.135","255.255.111.35"],
            description: "标准测试用例"
        },
        {
            s: "0000",
            expected: ["0.0.0.0"],
            description: "全零测试用例"
        },
        {
            s: "101023",
            expected: ["1.0.10.23","1.0.102.3","10.1.0.23","10.10.2.3","101.0.2.3"],
            description: "多种可能的测试用例"
        },
        {
            s: "010010",
            expected: ["0.10.0.10","0.100.1.0"],
            description: "包含前导零的边界测试"
        },
        {
            s: "1111",
            expected: ["1.1.1.1"],
            description: "四段均为1的简单测试"
        },
        {
            s: "000",
            expected: [],
            description: "长度不足的测试用例"
        },
        {
            s: "25525511135000",
            expected: [],
            description: "长度过长的测试用例"
        }
    ];
    
    testCases.forEach(({ s, expected, description }, index) => {
        console.log(`测试用例 ${index + 1}: ${description}`);
        console.log(`输入: "${s}"`);
/**
 * 性能测试
 */
function performanceTest() {
    console.log("\n=== 性能测试 ===\n");
    
    const testCases = [
        { s: "25525511135", name: "标准测试用例" },
        { s: "101023", name: "多种可能测试用例" },
        { s: "010010", name: "边界情况测试用例" }
    ];
    
    testCases.forEach(({ s, name }) => {
        console.log(`测试: ${name}`);
        console.log(`字符串长度: ${s.length}`);
        
        // 测试回溯法性能
        const startBacktrack = performance.now();
        for (let i = 0; i < 1000; i++) {
            restoreIpAddresses(s);
        }
        const endBacktrack = performance.now();
        
        // 测试迭代法性能
        const startIterative = performance.now();
        for (let i = 0; i < 1000; i++) {
            restoreIpAddressesIterative(s);
        }
        const endIterative = performance.now();
        
        console.log(`回溯法: ${(endBacktrack - startBacktrack).toFixed(4)}ms`);
        console.log(`迭代法: ${(endIterative - startIterative).toFixed(4)}ms`);
        console.log(`迭代法相对回溯法的性能提升: ${((endBacktrack - endIterative) / endBacktrack * 100).toFixed(2)}%`);
        console.log("---");
    });
}

/**
 * 算法可视化
 */
function visualizeBacktracking() {
    console.log("\n=== 回溯算法可视化 ===\n");
    
    const s = "25525511135";
    console.log(`输入字符串: "${s}"`);
    console.log("回溯过程:\n");
    
    const result = [];
    const path = [];
    let step = 1;
    
    function backtrackVisualize(startIndex, depth) {
        const indent = '  '.repeat(depth);
        
        console.log(`${indent}步骤 ${step++}: 从位置 ${startIndex} 开始搜索`);
        console.log(`${indent}当前路径: [${path.join('.')}]`);
        
        if (path.length === 4) {
            if (startIndex === s.length) {
                console.log(`${indent}✓ 找到有效IP: ${path.join('.')}`);
                result.push([...path]);
            } else {
                console.log(`${indent}✗ 路径已达4段，但未使用完所有字符`);
            }
            return;
        }
        
        for (let i = startIndex; i < s.length; i++) {
            const segment = s.substring(startIndex, i + 1);
            console.log(`${indent}尝试截取: "${segment}" (位置 ${startIndex} 到 ${i})`);
            
            if (isValidIpSegment(segment)) {
                path.push(segment);
                backtrackVisualize(i + 1, depth + 1);
                path.pop();
                console.log(`${indent}回溯: 移除段 "${segment}"`);
            } else {
                console.log(`${indent}✗ 段 "${segment}" 无效，停止当前分支搜索`);
                break; // 无效则无需尝试更长的段
            }
        }
    }
    
    backtrackVisualize(0, 1);
    
    console.log("\n最终找到的所有有效IP地址:");
    console.log(result.map(ip => `  ${ip.join('.')}`).join('\n'));
}

// 执行所有测试和分析
function runAllTests() {
    testRestoreIpAddresses();
    complexityAnalysis();
    ipSegmentValidationAnalysis();
    performanceTest();
    visualizeBacktracking();
}

// 运行所有测试
runAllTests();
}

/**
 * 模块导出
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        restoreIpAddresses,
        restoreIpAddressesIterative,
        isValidIpSegment
    };
}