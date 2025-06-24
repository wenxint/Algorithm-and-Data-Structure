/**
 * LeetCode 22. 括号生成
 *
 * 问题描述：
 * 数字 n 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且有效的括号组合。
 *
 * 核心思想：
 * 回溯算法：
 * 1. 左括号数量不能超过n
 * 2. 右括号数量不能超过左括号数量
 * 3. 当左右括号都用完时，得到一个有效组合
 *
 * 示例：
 * 输入：n = 3
 * 输出：["((()))","(()())","(())()","()(())","()()()"]
 */

/**
 * 括号生成
 * @param {number} n
 * @return {string[]}
 */
function generateParenthesis(n) {
    // TODO: 实现括号生成算法
    console.log("括号生成算法待实现");
    return [];
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateParenthesis
    };
}