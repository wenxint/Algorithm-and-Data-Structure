/**
 * LeetCode 099: N皇后 (N-Queens)
 *
 * 题目描述：
 * 按照国际象棋的规则，皇后可以攻击与之处在同一行或同一列或同一斜线上的棋子。
 * n 皇后问题 研究的是如何将 n 个皇后放置在 n × n 的棋盘上，并且使皇后彼此之间不能相互攻击。
 * 给你一个整数 n ，返回所有不同的 n 皇后问题 的解决方案。
 * 每一种解法包含一个不同的 n 皇后问题 的棋子放置方案，该方案中 'Q' 和 '.' 分别代表了皇后和空位。
 *
 * 示例：
 * 输入：n = 4
 * 输出：[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]
 * 解释：存在两个不同的 4 皇后问题的解决方案
 *
 * 核心思想：
 * 回溯算法 - 逐行放置皇后，使用剪枝优化避免无效搜索
 *
 * 算法原理：
 * 1. 逐行递归：从第一行开始，依次在每行放置一个皇后
 * 2. 冲突检测：检查当前位置是否与已放置的皇后冲突
 *    - 列冲突：同一列不能有两个皇后
 *    - 对角线冲突：主对角线和副对角线不能有两个皇后
 * 3. 剪枝优化：使用数组快速判断列和对角线的占用情况
 * 4. 解的构造：当成功放置n个皇后时，构造解决方案
 * 5. 回溯过程：尝试失败时回退，继续尝试下一个位置
 *
 * 优化技巧：
 * - 使用 cols、diag1、diag2 数组标记占用状态
 * - 主对角线标识：row - col + n - 1
 * - 副对角线标识：row + col
 *
 * 时间复杂度：O(n!)
 * 空间复杂度：O(n)
 */

/**
 * 解法一：回溯 + 剪枝优化（推荐）
 *
 * 核心思想：
 * 使用数组标记列和对角线的占用状态，O(1) 时间复杂度检查冲突
 *
 * 算法步骤：
 * 1. 初始化占用状态数组（列、主对角线、副对角线）
 * 2. 逐行递归放置皇后，对每个可能位置进行尝试
 * 3. 使用剪枝优化，快速判断位置是否有效
 * 4. 找到解时构造棋盘字符串表示
 *
 * @param {number} n - 棋盘大小和皇后数量
 * @returns {string[][]} 所有可能的解决方案
 * @time O(n!) - 最坏情况下需要尝试所有排列
 * @space O(n) - 递归栈和状态数组
 */
function solveNQueens(n) {
    const result = [];
    const queens = Array(n).fill(-1); // queens[i] 表示第 i 行皇后放在第几列

    // 标记数组，用于快速冲突检测
    const cols = Array(n).fill(false);        // 列占用状态
    const diag1 = Array(2 * n - 1).fill(false); // 主对角线占用状态
    const diag2 = Array(2 * n - 1).fill(false); // 副对角线占用状态

    /**
     * 回溯递归函数
     * @param {number} row - 当前处理的行
     */
    function backtrack(row) {
        if (row === n) {
            // 找到一个解，构造棋盘
            result.push(buildBoard(queens, n));
            return;
        }

        // 尝试在当前行的每一列放置皇后
        for (let col = 0; col < n; col++) {
            // 检查当前位置是否安全（无冲突）
            if (isValid(row, col)) {
                // 放置皇后并标记占用状态
                placeQueen(row, col);

                // 递归处理下一行
                backtrack(row + 1);

                // 回溯：移除皇后并清除占用状态
                removeQueen(row, col);
            }
        }
    }

    /**
     * 检查位置是否有效（无冲突）
     * @param {number} row - 行
     * @param {number} col - 列
     * @returns {boolean} 是否可以放置皇后
     */
    function isValid(row, col) {
        return !cols[col] &&
               !diag1[row - col + n - 1] &&
               !diag2[row + col];
    }

    /**
     * 放置皇后并标记占用状态
     * @param {number} row - 行
     * @param {number} col - 列
     */
    function placeQueen(row, col) {
        queens[row] = col;
        cols[col] = true;
        diag1[row - col + n - 1] = true;
        diag2[row + col] = true;
    }

    /**
     * 移除皇后并清除占用状态
     * @param {number} row - 行
     * @param {number} col - 列
     */
    function removeQueen(row, col) {
        queens[row] = -1;
        cols[col] = false;
        diag1[row - col + n - 1] = false;
        diag2[row + col] = false;
    }

    backtrack(0);
    return result;
}

/**
 * 构造棋盘字符串表示
 * @param {number[]} queens - 皇后位置数组
 * @param {number} n - 棋盘大小
 * @returns {string[]} 棋盘的字符串表示
 */
function buildBoard(queens, n) {
    const board = [];
    for (let i = 0; i < n; i++) {
        let row = '';
        for (let j = 0; j < n; j++) {
            row += queens[i] === j ? 'Q' : '.';
        }
        board.push(row);
    }
    return board;
}

/**
 * 解法二：位运算优化版本
 *
 * 核心思想：
 * 使用位运算来表示列和对角线的占用状态，进一步优化性能
 *
 * 算法步骤：
 * 1. 用整数的位来表示占用状态
 * 2. 使用位运算快速计算可用位置
 * 3. 通过位移操作更新对角线状态
 *
 * @param {number} n - 棋盘大小
 * @returns {string[][]} 所有解决方案
 * @time O(n!) - 时间复杂度相同但常数因子更小
 * @space O(n) - 空间复杂度相同
 */
function solveNQueensBit(n) {
    const result = [];
    const queens = Array(n).fill(-1);

    function backtrack(row, cols, diag1, diag2) {
        if (row === n) {
            result.push(buildBoard(queens, n));
            return;
        }

        // 计算当前行可以放置皇后的位置
        // available 的第 i 位为 1 表示第 i 列可以放置皇后
        let available = ((1 << n) - 1) & (~(cols | diag1 | diag2));

        while (available) {
            // 获取最右边的 1 的位置
            const position = available & (-available);

            // 计算列号
            const col = Math.log2(position);

            // 放置皇后
            queens[row] = col;

            // 递归：更新占用状态
            backtrack(
                row + 1,
                cols | position,           // 更新列占用
                (diag1 | position) << 1,   // 更新主对角线占用
                (diag2 | position) >> 1    // 更新副对角线占用
            );

            // 移除当前尝试的位置
            available &= available - 1;
        }
    }

    backtrack(0, 0, 0, 0);
    return result;
}

/**
 * 解法三：基础回溯（便于理解）
 *
 * 核心思想：
 * 最直观的回溯实现，每次都重新检查所有冲突
 *
 * 算法步骤：
 * 1. 逐行放置皇后
 * 2. 对每个位置检查与之前皇后的冲突
 * 3. 使用回溯探索所有可能性
 *
 * @param {number} n - 棋盘大小
 * @returns {string[][]} 所有解决方案
 * @time O(n!) - 最坏情况
 * @space O(n) - 递归栈空间
 */
function solveNQueensBasic(n) {
    const result = [];
    const board = Array(n).fill().map(() => Array(n).fill('.'));

    function backtrack(row) {
        if (row === n) {
            // 找到解，保存当前棋盘状态
            const solution = board.map(row => row.join(''));
            result.push([...solution]);
            return;
        }

        for (let col = 0; col < n; col++) {
            if (isValidBasic(board, row, col, n)) {
                // 放置皇后
                board[row][col] = 'Q';

                // 递归下一行
                backtrack(row + 1);

                // 回溯
                board[row][col] = '.';
            }
        }
    }

    backtrack(0);
    return result;
}

/**
 * 基础冲突检测函数
 * @param {string[][]} board - 棋盘状态
 * @param {number} row - 当前行
 * @param {number} col - 当前列
 * @param {number} n - 棋盘大小
 * @returns {boolean} 是否可以放置皇后
 */
function isValidBasic(board, row, col, n) {
    // 检查列冲突
    for (let i = 0; i < row; i++) {
        if (board[i][col] === 'Q') {
            return false;
        }
    }

    // 检查主对角线冲突（左上到右下）
    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
        if (board[i][j] === 'Q') {
            return false;
        }
    }

    // 检查副对角线冲突（右上到左下）
    for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
        if (board[i][j] === 'Q') {
            return false;
        }
    }

    return true;
}

/**
 * N皇后问题求解数量版本
 *
 * 核心思想：
 * 只统计解的数量，不需要构造具体的解
 *
 * @param {number} n - 棋盘大小
 * @returns {number} 解的数量
 * @time O(n!) - 时间复杂度相同
 * @space O(n) - 空间复杂度更小
 */
function totalNQueens(n) {
    let count = 0;
    const cols = Array(n).fill(false);
    const diag1 = Array(2 * n - 1).fill(false);
    const diag2 = Array(2 * n - 1).fill(false);

    function backtrack(row) {
        if (row === n) {
            count++;
            return;
        }

        for (let col = 0; col < n; col++) {
            if (!cols[col] && !diag1[row - col + n - 1] && !diag2[row + col]) {
                // 标记占用
                cols[col] = true;
                diag1[row - col + n - 1] = true;
                diag2[row + col] = true;

                backtrack(row + 1);

                // 清除标记
                cols[col] = false;
                diag1[row - col + n - 1] = false;
                diag2[row + col] = false;
            }
        }
    }

    backtrack(0);
    return count;
}

/**
 * 可视化N皇后解决方案
 *
 * @param {string[]} solution - 单个解决方案
 * @param {number} n - 棋盘大小
 */
function printSolution(solution, n) {
    console.log(`N皇后解决方案 (${n}x${n}):`);
    console.log("+" + "-".repeat(n * 2 - 1) + "+");

    for (let i = 0; i < n; i++) {
        let row = "|";
        for (let j = 0; j < n; j++) {
            row += solution[i][j];
            if (j < n - 1) row += " ";
        }
        row += "|";
        console.log(row);
    }

    console.log("+" + "-".repeat(n * 2 - 1) + "+");
}

/**
 * 扩展应用：N皇后变种问题
 *
 * 变种1：不能攻击的车（Rook）问题
 * 只需要考虑行列冲突，不考虑对角线
 *
 * @param {number} n - 棋盘大小
 * @returns {number} 解的数量
 */
function totalNRooks(n) {
    // N个车的放置方法就是N的阶乘
    let result = 1;
    for (let i = 1; i <= n; i++) {
        result *= i;
    }
    return result;
}

/**
 * 变种2：限制条件的N皇后
 * 某些位置不能放置皇后
 *
 * @param {number} n - 棋盘大小
 * @param {number[][]} forbidden - 禁止位置的数组
 * @returns {string[][]} 所有解决方案
 */
function solveNQueensWithForbidden(n, forbidden) {
    const result = [];
    const queens = Array(n).fill(-1);
    const forbiddenSet = new Set(forbidden.map(pos => `${pos[0]},${pos[1]}`));

    const cols = Array(n).fill(false);
    const diag1 = Array(2 * n - 1).fill(false);
    const diag2 = Array(2 * n - 1).fill(false);

    function backtrack(row) {
        if (row === n) {
            result.push(buildBoard(queens, n));
            return;
        }

        for (let col = 0; col < n; col++) {
            // 检查是否为禁止位置
            if (forbiddenSet.has(`${row},${col}`)) {
                continue;
            }

            if (!cols[col] && !diag1[row - col + n - 1] && !diag2[row + col]) {
                queens[row] = col;
                cols[col] = true;
                diag1[row - col + n - 1] = true;
                diag2[row + col] = true;

                backtrack(row + 1);

                queens[row] = -1;
                cols[col] = false;
                diag1[row - col + n - 1] = false;
                diag2[row + col] = false;
            }
        }
    }

    backtrack(0);
    return result;
}

// 测试用例
console.log("=== LeetCode 099: N皇后 测试 ===");

// 测试不同大小的N皇后问题
const testSizes = [1, 4, 8];

testSizes.forEach(n => {
    console.log(`\n${n}皇后问题：`);

    console.time(`${n}皇后-优化回溯`);
    const solutions1 = solveNQueens(n);
    console.timeEnd(`${n}皇后-优化回溯`);

    console.time(`${n}皇后-位运算`);
    const solutions2 = solveNQueensBit(n);
    console.timeEnd(`${n}皇后-位运算`);

    console.time(`${n}皇后-基础回溯`);
    const solutions3 = solveNQueensBasic(n);
    console.timeEnd(`${n}皇后-基础回溯`);

    const count = totalNQueens(n);

    console.log(`解的数量: ${solutions1.length} (优化回溯)`);
    console.log(`解的数量: ${solutions2.length} (位运算)`);
    console.log(`解的数量: ${solutions3.length} (基础回溯)`);
    console.log(`解的数量: ${count} (计数版本)`);
    console.log(`结果一致性: ${solutions1.length === solutions2.length &&
                              solutions2.length === solutions3.length &&
                              solutions3.length === count ? '✓' : '✗'}`);

    // 显示第一个解（如果存在）
    if (solutions1.length > 0) {
        console.log("\n第一个解决方案：");
        printSolution(solutions1[0], n);
    }
});

// 测试扩展应用
console.log("\n=== 扩展应用测试 ===");

console.log(`\n4个车的放置方法数: ${totalNRooks(4)}`);

const forbiddenPositions = [[0, 0], [1, 1]];
const forbiddenSolutions = solveNQueensWithForbidden(4, forbiddenPositions);
console.log(`4皇后问题（禁止 (0,0) 和 (1,1) 位置）解的数量: ${forbiddenSolutions.length}`);

/**
 * 性能分析和优化技巧
 */
function performanceAnalysis() {
    console.log("\n=== N皇后算法性能分析 ===");

    console.log("\n1. 算法复杂度分析：");
    console.log("   - 时间复杂度: O(n!) - 最坏情况下需要尝试所有排列");
    console.log("   - 空间复杂度: O(n) - 递归栈和状态数组");
    console.log("   - 实际性能: 由于剪枝优化，实际运行时间远小于理论值");

    console.log("\n2. 优化技巧总结：");
    console.log("   - 使用数组标记占用状态，O(1) 冲突检测");
    console.log("   - 位运算进一步减少常数因子");
    console.log("   - 对角线编号技巧简化计算");
    console.log("   - 及早剪枝避免无效搜索");

    console.log("\n3. 对角线编号公式：");
    console.log("   - 主对角线: row - col + n - 1");
    console.log("   - 副对角线: row + col");
    console.log("   - 这样可以将2D坐标映射到1D数组索引");

    console.log("\n4. 应用场景：");
    console.log("   - 约束满足问题的经典范例");
    console.log("   - 回溯算法的标准应用");
    console.log("   - 组合优化问题的求解思路");
}

performanceAnalysis();

/**
 * 算法总结：
 *
 * 1. 回溯 + 剪枝优化（推荐）：
 *    - 时间复杂度：O(n!)
 *    - 空间复杂度：O(n)
 *    - 优点：高效的冲突检测，代码清晰
 *    - 适用：大多数N皇后问题场景
 *
 * 2. 位运算优化：
 *    - 时间复杂度：O(n!)
 *    - 空间复杂度：O(n)
 *    - 优点：常数因子更小，性能最优
 *    - 适用：对性能要求极高的场景
 *
 * 3. 基础回溯：
 *    - 时间复杂度：O(n!)
 *    - 空间复杂度：O(n²)
 *    - 优点：易于理解和实现
 *    - 适用：学习和教学目的
 *
 * 4. 计数版本：
 *    - 时间复杂度：O(n!)
 *    - 空间复杂度：O(n)
 *    - 优点：空间效率最高
 *    - 适用：只需要统计解的数量
 *
 * 核心要点：
 * - 回溯是解决约束满足问题的经典方法
 * - 剪枝优化是提升性能的关键
 * - 状态表示和冲突检测的设计很重要
 * - 位运算可以进一步优化性能
 * - N皇后问题是理解回溯算法的最佳例子
 */