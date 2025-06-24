/**
 * LeetCode 130. 被围绕的区域
 *
 * 问题描述：
 * 给你一个 m x n 的矩阵 board ，由若干字符 'X' 和 'O' ，
 * 找到所有被 'X' 围绕的区域，并将这些区域里所有的 'O' 用 'X' 填充。
 *
 * 核心思想：
 * 反向思维：先找到不被围绕的'O'（与边界相连的），剩下的就是被围绕的
 *
 * 示例：
 * 输入：board = [["X","X","X","X"],["X","O","O","X"],["X","X","O","X"],["X","O","X","X"]]
 * 输出：[["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","O","X","X"]]
 */

/**
 * 被围绕的区域
 * @param {character[][]} board
 * @return {void} Do not return anything, modify board in-place instead.
 */
function solve(board) {
    // TODO: 实现被围绕的区域算法
    console.log("被围绕的区域算法待实现");
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        solve
    };
}