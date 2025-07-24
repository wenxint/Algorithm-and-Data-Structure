/**
 * LeetCode 79. 单词搜索
 *
 * 问题描述：
 * 给定一个 m x n 二维字符网格 board 和一个字符串单词 word 。
 * 如果 word 存在于网格中，返回 true ；否则，返回 false 。
 * 单词必须按照字母顺序，通过相邻的单元格内的字母构成，
 * 其中"相邻"单元格是那些水平相邻或垂直相邻的单元格。
 * 同一个单元格内的字母不允许被重复使用。
 *
 * 核心思想：
 * 回溯算法是解决矩阵路径搜索问题的经典方法。
 *
 * 关键洞察：
 * 1. 从每个位置开始尝试匹配单词的第一个字符
 * 2. 使用深度优先搜索（DFS）沿着四个方向探索
 * 3. 需要标记访问状态，避免重复使用同一个单元格
 * 4. 回溯时需要恢复访问状态
 * 5. 剪枝优化：字符不匹配时立即返回
 *
 * 算法策略：
 * - 遍历矩阵的每个位置作为起点
 * - 深度优先搜索：四个方向递归搜索
 * - 状态管理：标记已访问的单元格
 * - 回溯：恢复访问状态，尝试其他路径
 * - 边界检查：防止越界访问
 *
 * 示例：
 * 输入：board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"
 * 输出：true
 */

/**
 * 方法一：回溯算法 + 状态标记（推荐）
 *
 * 核心思想：
 * 使用二维visited数组标记访问状态，通过DFS在四个方向上搜索目标单词。
 * 每次递归时检查当前位置的字符是否与word中对应位置的字符匹配，
 * 如果匹配则继续搜索，否则回溯。
 *
 * 决策过程：
 * 1. 从每个位置开始尝试匹配word的第一个字符
 * 2. 如果匹配，标记当前位置为已访问，继续搜索下一个字符
 * 3. 在四个方向（上下左右）递归搜索
 * 4. 如果找到完整单词，返回true
 * 5. 如果当前路径不通，回溯并尝试其他路径
 *
 * @param {character[][]} board - 二维字符网格
 * @param {string} word - 要搜索的单词
 * @return {boolean} 是否找到单词
 * @time O(M*N*4^L) - M*N个起点，每个位置最多4^L种路径，L为word长度
 * @space O(L) - 递归栈深度最大为word长度
 */
function exist(board, word) {
    if (!board || !board.length || !board[0].length || !word) {
        return false;
    }

    const m = board.length;
    const n = board[0].length;
    const visited = Array(m).fill(null).map(() => Array(n).fill(false));

    // 四个方向：上、右、下、左
    const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];

    /**
     * 深度优先搜索函数
     * @param {number} row - 当前行坐标
     * @param {number} col - 当前列坐标
     * @param {number} index - 当前匹配到word的第几个字符
     * @return {boolean} 从当前位置是否能找到剩余的单词
     */
    function dfs(row, col, index) {
        // 基础情况：已经匹配了整个单词
        if (index === word.length) {
            return true;
        }

        // 边界检查和字符匹配检查
        if (row < 0 || row >= m || col < 0 || col >= n ||
            visited[row][col] || board[row][col] !== word[index]) {
            return false;
        }

        // 标记当前位置为已访问
        visited[row][col] = true;

        // 在四个方向上继续搜索
        for (const [dr, dc] of directions) {
            const newRow = row + dr;
            const newCol = col + dc;

            // 递归搜索下一个字符
            if (dfs(newRow, newCol, index + 1)) {
                return true; // 找到了完整路径
            }
        }

        // 回溯：恢复访问状态
        visited[row][col] = false;
        return false;
    }

    // 从每个位置开始尝试搜索
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (dfs(i, j, 0)) {
                return true;
            }
        }
    }

    return false;
}

/**
 * 方法二：原地修改优化（空间优化）
 *
 * 核心思想：
 * 不使用额外的visited数组，而是通过修改原始矩阵来标记访问状态。
 * 访问时将字符改为特殊字符，回溯时恢复原字符。
 * 这样可以节省O(M*N)的空间复杂度。
 *
 * @param {character[][]} board - 二维字符网格
 * @param {string} word - 要搜索的单词
 * @return {boolean} 是否找到单词
 * @time O(M*N*4^L) - 时间复杂度相同
 * @space O(L) - 只需要递归栈空间
 */
function existOptimized(board, word) {
    if (!board || !board.length || !board[0].length || !word) {
        return false;
    }

    const m = board.length;
    const n = board[0].length;
    const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];

    function dfs(row, col, index) {
        // 基础情况
        if (index === word.length) {
            return true;
        }

        // 边界和字符检查
        if (row < 0 || row >= m || col < 0 || col >= n ||
            board[row][col] !== word[index]) {
            return false;
        }

        // 保存原字符并标记为已访问
        const originalChar = board[row][col];
        board[row][col] = '#'; // 使用特殊字符标记已访问

        // 四个方向搜索
        for (const [dr, dc] of directions) {
            if (dfs(row + dr, col + dc, index + 1)) {
                board[row][col] = originalChar; // 恢复原字符
                return true;
            }
        }

        // 回溯：恢复原字符
        board[row][col] = originalChar;
        return false;
    }

    // 从每个位置开始搜索
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (dfs(i, j, 0)) {
                return true;
            }
        }
    }

    return false;
}

/**
 * 方法三：Trie树优化（适用于多单词搜索）
 *
 * 核心思想：
 * 当需要在同一个board中搜索多个单词时，可以使用Trie树优化。
 * 构建所有单词的Trie树，然后进行一次DFS遍历即可找到所有单词。
 * 虽然对于单个单词搜索没有优势，但展示了算法的扩展性。
 *
 * @param {character[][]} board - 二维字符网格
 * @param {string[]} words - 要搜索的单词数组
 * @return {string[]} 找到的单词列表
 */
function findWords(board, words) {
    if (!board || !board.length || !words || !words.length) {
        return [];
    }

    // Trie树节点
    class TrieNode {
        constructor() {
            this.children = {};
            this.word = null; // 如果不为null，表示这里是一个单词的结尾
        }
    }

    // 构建Trie树
    const root = new TrieNode();
    for (const word of words) {
        let node = root;
        for (const char of word) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
        }
        node.word = word;
    }

    const result = [];
    const m = board.length;
    const n = board[0].length;
    const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];

    function dfs(row, col, node) {
        // 边界检查
        if (row < 0 || row >= m || col < 0 || col >= n) {
            return;
        }

        const char = board[row][col];
        if (char === '#' || !node.children[char]) {
            return;
        }

        node = node.children[char];

        // 如果找到一个单词
        if (node.word) {
            result.push(node.word);
            node.word = null; // 避免重复添加
        }

        // 标记已访问
        board[row][col] = '#';

        // 四个方向搜索
        for (const [dr, dc] of directions) {
            dfs(row + dr, col + dc, node);
        }

        // 回溯
        board[row][col] = char;
    }

    // 从每个位置开始搜索
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            dfs(i, j, root);
        }
    }

    return result;
}

/**
 * 可视化函数：展示搜索过程
 * @param {character[][]} board - 二维字符网格
 * @param {string} word - 要搜索的单词
 * @return {boolean} 是否找到单词
 */
function visualizeSearch(board, word) {
    console.log(`\n=== 单词搜索过程可视化 ===`);
    console.log(`搜索单词: "${word}"`);
    console.log('初始矩阵:');
    printBoard(board);

    const m = board.length;
    const n = board[0].length;
    const visited = Array(m).fill(null).map(() => Array(n).fill(false));
    const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
    const path = [];
    let step = 0;

    function dfs(row, col, index, currentPath) {
        step++;
        console.log(`\n步骤${step}: 搜索位置(${row},${col}), 匹配第${index}个字符'${word[index] || 'END'}'`);

        // 基础情况
        if (index === word.length) {
            console.log('✓ 找到完整单词！路径:', currentPath);
            return true;
        }

        // 边界和字符检查
        if (row < 0 || row >= m || col < 0 || col >= n ||
            visited[row][col] || board[row][col] !== word[index]) {
            const reason = row < 0 || row >= m || col < 0 || col >= n ? '越界' :
                          visited[row][col] ? '已访问' : '字符不匹配';
            console.log(`✗ 搜索失败: ${reason}`);
            return false;
        }

        // 标记访问
        visited[row][col] = true;
        currentPath.push(`(${row},${col}):${board[row][col]}`);
        console.log('当前路径:', currentPath);
        printBoardWithPath(board, visited);

        // 四个方向搜索
        const dirNames = ['上', '右', '下', '左'];
        for (let i = 0; i < directions.length; i++) {
            const [dr, dc] = directions[i];
            const newRow = row + dr;
            const newCol = col + dc;

            console.log(`→ 尝试向${dirNames[i]}搜索: (${newRow},${newCol})`);
            if (dfs(newRow, newCol, index + 1, [...currentPath])) {
                return true;
            }
        }

        // 回溯
        visited[row][col] = false;
        currentPath.pop();
        console.log('← 回溯，恢复访问状态');

        return false;
    }

    // 从每个位置开始尝试
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            console.log(`\n=== 从位置(${i},${j})开始搜索 ===`);
            if (dfs(i, j, 0, [])) {
                return true;
            }
            // 重置visited数组
            for (let x = 0; x < m; x++) {
                for (let y = 0; y < n; y++) {
                    visited[x][y] = false;
                }
            }
        }
    }

    console.log('\n✗ 未找到单词');
    return false;
}

/**
 * 辅助函数：打印矩阵
 */
function printBoard(board) {
    for (const row of board) {
        console.log(row.join(' '));
    }
}

/**
 * 辅助函数：打印带路径标记的矩阵
 */
function printBoardWithPath(board, visited) {
    for (let i = 0; i < board.length; i++) {
        const row = [];
        for (let j = 0; j < board[0].length; j++) {
            if (visited[i][j]) {
                row.push(`[${board[i][j]}]`);
            } else {
                row.push(` ${board[i][j]} `);
            }
        }
        console.log(row.join(''));
    }
}

// 测试用例
console.log('=== LeetCode 79. 单词搜索 测试 ===\n');

// 测试用例1：标准情况
console.log('测试用例1: 标准搜索');
const board1 = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]];
const word1 = "ABCCED";
console.log('矩阵:');
printBoard(board1);
console.log(`搜索单词: "${word1}"`);
console.log('预期输出: true');
console.log('实际输出:', exist(board1, word1));
console.log('优化方法:', existOptimized(JSON.parse(JSON.stringify(board1)), word1));
console.log();

// 测试用例2：单词不存在
console.log('测试用例2: 单词不存在');
const word2 = "ABCB";
console.log(`搜索单词: "${word2}"`);
console.log('预期输出: false');
console.log('实际输出:', exist(board1, word2));
console.log();

// 测试用例3：单字符单词
console.log('测试用例3: 单字符单词');
const board3 = [["A"]];
const word3 = "A";
console.log('矩阵:');
printBoard(board3);
console.log(`搜索单词: "${word3}"`);
console.log('预期输出: true');
console.log('实际输出:', exist(board3, word3));
console.log();

// 测试用例4：复杂路径
console.log('测试用例4: 复杂路径');
const board4 = [["C","A","A"],["A","A","A"],["B","C","D"]];
const word4 = "AAB";
console.log('矩阵:');
printBoard(board4);
console.log(`搜索单词: "${word4}"`);
console.log('预期输出: true');
console.log('实际输出:', exist(board4, word4));
console.log();

// 测试用例5：边界情况
console.log('测试用例5: 空输入');
console.log('空矩阵:', exist([], "A"));
console.log('空单词:', exist(board1, ""));
console.log();

// Trie树方法测试（多单词搜索）
console.log('=== Trie树方法测试（多单词搜索）===');
const words = ["ABCCED", "SEE", "ABCB"];
console.log('搜索单词列表:', words);
console.log('找到的单词:', findWords(JSON.parse(JSON.stringify(board1)), words));
console.log();

// 性能测试
console.log('=== 性能测试 ===');
function performanceTest() {
    // 生成测试矩阵
    function generateBoard(rows, cols) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const board = [];
        for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < cols; j++) {
                row.push(chars[Math.floor(Math.random() * chars.length)]);
            }
            board.push(row);
        }
        return board;
    }

    const testCases = [
        { size: '3x3', rows: 3, cols: 3 },
        { size: '4x4', rows: 4, cols: 4 },
        { size: '5x5', rows: 5, cols: 5 },
    ];

    console.log('矩阵大小\t标准方法(ms)\t优化方法(ms)\t结果一致');
    console.log(''.padEnd(50, '-'));

    for (const { size, rows, cols } of testCases) {
        const board = generateBoard(rows, cols);
        const word = 'ABCD'; // 固定搜索单词

        // 标准方法
        const start1 = performance.now();
        const result1 = exist(JSON.parse(JSON.stringify(board)), word);
        const time1 = (performance.now() - start1).toFixed(3);

        // 优化方法
        const start2 = performance.now();
        const result2 = existOptimized(JSON.parse(JSON.stringify(board)), word);
        const time2 = (performance.now() - start2).toFixed(3);

        console.log(`${size}\t\t${time1}\t\t${time2}\t\t${result1 === result2}`);
    }
}

performanceTest();

// 可视化演示（小规模）
const smallBoard = [["A","B"],["C","D"]];
const smallWord = "AB";
visualizeSearch(smallBoard, smallWord);

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        exist,
        existOptimized,
        findWords,
        visualizeSearch,
        printBoard,
        printBoardWithPath
    };
}