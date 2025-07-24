/**
 * LeetCode 22. 括号生成
 *
 * 问题描述：
 * 数字 n 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且有效的括号组合。
 *
 * 核心思想：
 * 回溯算法是解决这类组合生成问题的经典方法。
 *
 * 关键洞察：
 * 1. 有效括号的特征：左括号数量 = 右括号数量 = n
 * 2. 任何时刻，右括号数量不能超过左括号数量
 * 3. 左括号可以在任何时候添加（只要不超过n）
 * 4. 右括号只能在左括号数量大于右括号数量时添加
 *
 * 算法策略：
 * - 深度优先搜索：逐字符构建括号字符串
 * - 状态追踪：记录当前左括号和右括号的数量
 * - 剪枝优化：提前终止不合法的路径
 * - 回溯：尝试所有可能的组合
 *
 * 示例：
 * 输入：n = 3
 * 输出：["((()))","(()())","(())()","()(())","()()()"]
 */

/**
 * 方法一：回溯算法（推荐）
 *
 * 核心思想：
 * 使用深度优先搜索构建有效的括号组合。
 * 在每一步中，我们有两个选择：添加左括号或添加右括号。
 * 通过维护左右括号的计数，确保生成的括号组合始终有效。
 *
 * 决策树：
 * 1. 如果左括号数量 < n，可以添加左括号
 * 2. 如果右括号数量 < 左括号数量，可以添加右括号
 * 3. 如果左右括号都用完了，找到一个有效组合
 *
 * @param {number} n - 括号对数
 * @return {string[]} 所有有效的括号组合
 * @time O(4^n / √n) - 第n个卡塔兰数
 * @space O(4^n / √n) - 结果数组空间 + O(n) 递归栈空间
 */
function generateParenthesis(n) {
    const result = [];

    /**
     * 回溯函数：构建括号组合
     * @param {string} current - 当前构建的括号字符串
     * @param {number} left - 已使用的左括号数量
     * @param {number} right - 已使用的右括号数量
     */
    function backtrack(current, left, right) {
        // 基础情况：左右括号都用完了，得到一个有效组合
        if (left === n && right === n) {
            result.push(current);
            return;
        }

        // 选择1：添加左括号（如果还有左括号可用）
        if (left < n) {
            backtrack(current + '(', left + 1, right);
        }

        // 选择2：添加右括号（如果右括号数量小于左括号数量）
        if (right < left) {
            backtrack(current + ')', left, right + 1);
        }
    }

    // 从空字符串开始构建
    backtrack('', 0, 0);
    return result;
}

/**
 * 方法二：动态规划
 *
 * 核心思想：
 * 利用动态规划的思想，通过已知的较小规模的结果来构建较大规模的结果。
 * 对于n对括号，可以将其看作：(a)b 的形式，其中a是0到n-1对括号的任意有效组合，
 * b是n-1-a对括号的任意有效组合。
 *
 * 状态转移：
 * dp[i] = { "(" + dp[j] + ")" + dp[i-1-j] | j = 0,1,...,i-1 }
 *
 * @param {number} n - 括号对数
 * @return {string[]} 所有有效的括号组合
 * @time O(4^n / √n) - 第n个卡塔兰数
 * @space O(4^n / √n) - 结果数组空间
 */
function generateParenthesisDP(n) {
    // dp[i] 表示i对括号的所有有效组合
    const dp = new Array(n + 1).fill(null).map(() => []);

    // 基础情况
    dp[0] = [''];

    // 自底向上构建
    for (let i = 1; i <= n; i++) {
        for (let j = 0; j < i; j++) {
            // 对于每个i，尝试所有可能的分割方式
            for (const left of dp[j]) {
                for (const right of dp[i - 1 - j]) {
                    // 构造形式：(left)right
                    dp[i].push('(' + left + ')' + right);
                }
            }
        }
    }

    return dp[n];
}

/**
 * 方法三：闭包数方法（卡塔兰数生成）
 *
 * 核心思想：
 * 基于卡塔兰数的组合数学方法。
 * 每个有效的括号序列都可以唯一地表示为：(A)B，
 * 其中A和B是更小的有效括号序列。
 *
 * @param {number} n - 括号对数
 * @return {string[]} 所有有效的括号组合
 * @time O(4^n / √n) - 第n个卡塔兰数
 * @space O(4^n / √n) - 结果数组空间
 */
function generateParenthesisClosure(n) {
    if (n === 0) return [''];

    const result = [];

    // 对于每种可能的分割方式
    for (let i = 0; i < n; i++) {
        // i对括号在内部，n-1-i对括号在外部
        const inner = generateParenthesisClosure(i);
        const outer = generateParenthesisClosure(n - 1 - i);

        // 组合所有可能的内外括号
        for (const innerSeq of inner) {
            for (const outerSeq of outer) {
                result.push('(' + innerSeq + ')' + outerSeq);
            }
        }
    }

    return result;
}

/**
 * 工具函数：验证括号序列是否有效
 * @param {string} s - 括号字符串
 * @return {boolean} 是否为有效的括号序列
 */
function isValid(s) {
    let count = 0;
    for (const char of s) {
        if (char === '(') {
            count++;
        } else if (char === ')') {
            count--;
            if (count < 0) return false; // 右括号过多
        }
    }
    return count === 0; // 左右括号数量相等
}

/**
 * 可视化函数：展示回溯过程
 * @param {number} n - 括号对数
 */
function visualizeBacktrack(n) {
    console.log(`\n=== 括号生成回溯过程可视化 (n=${n}) ===`);

    const result = [];
    let step = 0;

    function backtrack(current, left, right, depth) {
        const indent = '  '.repeat(depth);
        step++;

        console.log(`${indent}步骤${step}: current="${current}", left=${left}, right=${right}`);

        // 基础情况
        if (left === n && right === n) {
            console.log(`${indent}✓ 找到有效组合: "${current}"`);
            result.push(current);
            return;
        }

        // 添加左括号
        if (left < n) {
            console.log(`${indent}→ 尝试添加左括号 '('`);
            backtrack(current + '(', left + 1, right, depth + 1);
        }

        // 添加右括号
        if (right < left) {
            console.log(`${indent}→ 尝试添加右括号 ')'`);
            backtrack(current + ')', left, right + 1, depth + 1);
        }

        console.log(`${indent}← 回溯到: "${current}"`);
    }

    backtrack('', 0, 0, 0);
    console.log(`\n总共找到 ${result.length} 个有效组合：`, result);
}

// 测试用例
console.log('=== LeetCode 22. 括号生成 测试 ===\n');

// 测试用例1：基础情况
console.log('测试用例1: n = 1');
console.log('预期输出: ["()"]');
console.log('实际输出:', generateParenthesis(1));
console.log('验证结果:', generateParenthesis(1).every(isValid));
console.log();

// 测试用例2：标准情况
console.log('测试用例2: n = 2');
console.log('预期输出: ["(())","()()"]');
console.log('实际输出:', generateParenthesis(2));
console.log('验证结果:', generateParenthesis(2).every(isValid));
console.log();

// 测试用例3：复杂情况
console.log('测试用例3: n = 3');
console.log('预期输出: ["((()))","(()())","(())()","()(())","()()()"]');
console.log('实际输出:', generateParenthesis(3));
console.log('验证结果:', generateParenthesis(3).every(isValid));
console.log();

// 测试用例4：边界情况
console.log('测试用例4: n = 0');
console.log('预期输出: [""]');
console.log('实际输出:', generateParenthesis(0));
console.log();

// 方法比较测试
console.log('=== 方法比较测试 ===');
const n = 3;
console.log(`\n对于 n = ${n}:`);
console.log('回溯方法:', generateParenthesis(n));
console.log('动态规划方法:', generateParenthesisDP(n));
console.log('闭包数方法:', generateParenthesisClosure(n));

// 验证所有方法结果一致性
const result1 = generateParenthesis(n).sort();
const result2 = generateParenthesisDP(n).sort();
const result3 = generateParenthesisClosure(n).sort();
console.log('结果一致性:',
    JSON.stringify(result1) === JSON.stringify(result2) &&
    JSON.stringify(result2) === JSON.stringify(result3));

// 性能测试
console.log('\n=== 性能测试 ===');
function performanceTest() {
    const testCases = [1, 2, 3, 4, 5];

    console.log('n\t回溯(ms)\t动态规划(ms)\t闭包数(ms)\t结果数量');
    console.log(''.padEnd(60, '-'));

    for (const n of testCases) {
        // 回溯方法
        const start1 = performance.now();
        const result1 = generateParenthesis(n);
        const time1 = (performance.now() - start1).toFixed(3);

        // 动态规划方法
        const start2 = performance.now();
        const result2 = generateParenthesisDP(n);
        const time2 = (performance.now() - start2).toFixed(3);

        // 闭包数方法
        const start3 = performance.now();
        const result3 = generateParenthesisClosure(n);
        const time3 = (performance.now() - start3).toFixed(3);

        console.log(`${n}\t${time1}\t\t${time2}\t\t${time3}\t\t${result1.length}`);
    }
}

performanceTest();

// 可视化演示（小规模）
visualizeBacktrack(2);

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateParenthesis,
        generateParenthesisDP,
        generateParenthesisClosure,
        isValid,
        visualizeBacktrack
    };
}