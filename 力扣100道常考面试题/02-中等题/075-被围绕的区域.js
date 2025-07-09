/**
 * LeetCode 130. 被围绕的区域
 *
 * 问题描述：
 * 给你一个 m x n 的矩阵 board ，由若干字符 'X' 和 'O' ，
 * 找到所有被 'X' 围绕的区域，并将这些区域里所有的 'O' 用 'X' 填充。
 *
 * 核心思想：
 * 反向思维：先找到不被围绕的'O'（与边界相连的），剩下的就是被围绕的
 * 从边界的'O'开始，使用DFS/BFS标记所有连通的'O'为安全区域
 * 最后遍历整个矩阵，将未标记的'O'改为'X'，安全区域恢复为'O'
 *
 * 关键洞察：
 * 1. 被'X'围绕意味着无法到达边界
 * 2. 与边界相连的'O'永远不会被围绕
 * 3. 使用标记避免重复访问，防止无限递归
 *
 * 示例：
 * 输入：board = [["X","X","X","X"],["X","O","O","X"],["X","X","O","X"],["X","O","X","X"]]
 * 输出：[["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","O","X","X"]]
 */

/**
 * 方法一：深度优先搜索（DFS）- 推荐解法
 *
 * 核心思想：
 * 1. 从边界的所有'O'开始进行DFS
 * 2. 将所有与边界相连的'O'标记为'#'（表示安全区域）
 * 3. 遍历整个矩阵，将剩余的'O'改为'X'，'#'恢复为'O'
 *
 * 算法步骤：
 * 1. 遍历矩阵边界，找到所有边界上的'O'
 * 2. 对每个边界'O'进行DFS，标记所有连通的'O'为'#'
 * 3. 再次遍历整个矩阵，处理标记：'O'→'X'，'#'→'O'
 *
 * @param {character[][]} board - 输入矩阵
 * @return {void} - 原地修改，不返回值
 * @time O(m×n) - 每个单元格最多访问一次
 * @space O(m×n) - 递归栈深度，最坏情况下所有单元格都是'O'
 */
function solve(board) {
    if (!board || board.length === 0 || board[0].length === 0) {
        return;
    }

    const m = board.length;
    const n = board[0].length;

    /**
     * 深度优先搜索标记安全区域
     * @param {number} row - 当前行
     * @param {number} col - 当前列
     */
    function dfs(row, col) {
        // 边界检查和有效性检查
        if (row < 0 || row >= m || col < 0 || col >= n || board[row][col] !== 'O') {
            return;
        }

        // 标记当前单元格为安全区域
        board[row][col] = '#';

        // 递归搜索四个方向
        dfs(row - 1, col); // 上
        dfs(row + 1, col); // 下
        dfs(row, col - 1); // 左
        dfs(row, col + 1); // 右
    }

    // 第一步：从边界开始DFS，标记所有安全区域
    // 处理第一行和最后一行
    for (let col = 0; col < n; col++) {
        if (board[0][col] === 'O') {
            dfs(0, col);
        }
        if (board[m - 1][col] === 'O') {
            dfs(m - 1, col);
        }
    }

    // 处理第一列和最后一列
    for (let row = 0; row < m; row++) {
        if (board[row][0] === 'O') {
            dfs(row, 0);
        }
        if (board[row][n - 1] === 'O') {
            dfs(row, n - 1);
        }
    }

    // 第二步：遍历整个矩阵，更新标记
    for (let row = 0; row < m; row++) {
        for (let col = 0; col < n; col++) {
            if (board[row][col] === 'O') {
                // 未标记的'O'是被围绕的，改为'X'
                board[row][col] = 'X';
            } else if (board[row][col] === '#') {
                // 安全区域恢复为'O'
                board[row][col] = 'O';
            }
        }
    }
}

/**
 * 方法二：广度优先搜索（BFS）
 *
 * 核心思想：
 * 使用队列进行层级遍历，逐层标记安全区域
 * 相比DFS，BFS使用显式队列，避免递归栈溢出问题
 *
 * @param {character[][]} board - 输入矩阵
 * @return {void} - 原地修改，不返回值
 * @time O(m×n) - 每个单元格最多入队一次
 * @space O(min(m,n)) - 队列空间，最坏情况下存储所有边界元素
 */
function solveBFS(board) {
    if (!board || board.length === 0 || board[0].length === 0) {
        return;
    }

    const m = board.length;
    const n = board[0].length;
    const queue = [];
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    /**
     * 广度优先搜索标记安全区域
     * @param {number} startRow - 起始行
     * @param {number} startCol - 起始列
     */
    function bfs(startRow, startCol) {
        if (board[startRow][startCol] !== 'O') return;

        queue.push([startRow, startCol]);
        board[startRow][startCol] = '#';

        while (queue.length > 0) {
            const [row, col] = queue.shift();

            // 探索四个方向
            for (const [dr, dc] of directions) {
                const newRow = row + dr;
                const newCol = col + dc;

                // 检查边界和有效性
                if (newRow >= 0 && newRow < m &&
                    newCol >= 0 && newCol < n &&
                    board[newRow][newCol] === 'O') {

                    board[newRow][newCol] = '#';
                    queue.push([newRow, newCol]);
                }
            }
        }
    }

    // 从边界开始BFS
    // 处理第一行和最后一行
    for (let col = 0; col < n; col++) {
        if (board[0][col] === 'O') {
            bfs(0, col);
        }
        if (board[m - 1][col] === 'O') {
            bfs(m - 1, col);
        }
    }

    // 处理第一列和最后一列
    for (let row = 0; row < m; row++) {
        if (board[row][0] === 'O') {
            bfs(row, 0);
        }
        if (board[row][n - 1] === 'O') {
            bfs(row, n - 1);
        }
    }

    // 更新最终结果
    for (let row = 0; row < m; row++) {
        for (let col = 0; col < n; col++) {
            if (board[row][col] === 'O') {
                board[row][col] = 'X';
            } else if (board[row][col] === '#') {
                board[row][col] = 'O';
            }
        }
    }
}

/**
 * 方法三：并查集（Union-Find）
 *
 * 核心思想：
 * 将所有边界上的'O'与一个虚拟节点连接
 * 所有'O'之间建立连通关系
 * 最后检查哪些'O'与虚拟节点连通（安全区域）
 *
 * @param {character[][]} board - 输入矩阵
 * @return {void} - 原地修改，不返回值
 * @time O(m×n×α(m×n)) - α是阿克曼函数的反函数，几乎为常数
 * @space O(m×n) - 并查集空间
 */
function solveUnionFind(board) {
    if (!board || board.length === 0 || board[0].length === 0) {
        return;
    }

    const m = board.length;
    const n = board[0].length;

    // 并查集实现
    class UnionFind {
        constructor(size) {
            this.parent = Array.from({length: size}, (_, i) => i);
            this.rank = new Array(size).fill(0);
        }

        find(x) {
            if (this.parent[x] !== x) {
                this.parent[x] = this.find(this.parent[x]); // 路径压缩
            }
            return this.parent[x];
        }

        union(x, y) {
            const rootX = this.find(x);
            const rootY = this.find(y);

            if (rootX !== rootY) {
                // 按秩合并
                if (this.rank[rootX] < this.rank[rootY]) {
                    this.parent[rootX] = rootY;
                } else if (this.rank[rootX] > this.rank[rootY]) {
                    this.parent[rootY] = rootX;
                } else {
                    this.parent[rootY] = rootX;
                    this.rank[rootX]++;
                }
            }
        }

        isConnected(x, y) {
            return this.find(x) === this.find(y);
        }
    }

    // 虚拟节点索引（表示边界）
    const dummyNode = m * n;
    const uf = new UnionFind(m * n + 1);

    // 坐标转换为一维索引
    const getIndex = (row, col) => row * n + col;

    // 方向数组
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    // 处理所有'O'单元格
    for (let row = 0; row < m; row++) {
        for (let col = 0; col < n; col++) {
            if (board[row][col] === 'O') {
                const currentIndex = getIndex(row, col);

                // 如果在边界上，与虚拟节点连接
                if (row === 0 || row === m - 1 || col === 0 || col === n - 1) {
                    uf.union(currentIndex, dummyNode);
                }

                // 与相邻的'O'建立连接
                for (const [dr, dc] of directions) {
                    const newRow = row + dr;
                    const newCol = col + dc;

                    if (newRow >= 0 && newRow < m &&
                        newCol >= 0 && newCol < n &&
                        board[newRow][newCol] === 'O') {

                        const neighborIndex = getIndex(newRow, newCol);
                        uf.union(currentIndex, neighborIndex);
                    }
                }
            }
        }
    }

    // 更新结果：不与虚拟节点连通的'O'改为'X'
    for (let row = 0; row < m; row++) {
        for (let col = 0; col < n; col++) {
            if (board[row][col] === 'O') {
                const currentIndex = getIndex(row, col);
                if (!uf.isConnected(currentIndex, dummyNode)) {
                    board[row][col] = 'X';
                }
            }
        }
    }
}

// ==================== 测试用例 ====================

/**
 * 测试函数
 */
function runTests() {
    console.log("=== LeetCode 130. 被围绕的区域 测试 ===\n");

    // 辅助函数：深拷贝二维数组
    function deepCopy(board) {
        return board.map(row => [...row]);
    }

    // 辅助函数：打印矩阵
    function printBoard(board, title) {
        console.log(`${title}:`);
        board.forEach(row => console.log(row.join(' ')));
        console.log();
    }

    // 测试用例1：标准情况
    console.log("测试用例1：标准情况");
    const board1 = [
        ["X","X","X","X"],
        ["X","O","O","X"],
        ["X","X","O","X"],
        ["X","O","X","X"]
    ];
    const board1Copy1 = deepCopy(board1);
    const board1Copy2 = deepCopy(board1);
    const board1Copy3 = deepCopy(board1);

    printBoard(board1, "原始矩阵");

    solve(board1Copy1);
    printBoard(board1Copy1, "DFS结果");

    solveBFS(board1Copy2);
    printBoard(board1Copy2, "BFS结果");

    solveUnionFind(board1Copy3);
    printBoard(board1Copy3, "并查集结果");

    // 测试用例2：全部被围绕
    console.log("测试用例2：全部被围绕");
    const board2 = [
        ["X","X","X"],
        ["X","O","X"],
        ["X","X","X"]
    ];
    const board2Copy = deepCopy(board2);

    printBoard(board2, "原始矩阵");
    solve(board2Copy);
    printBoard(board2Copy, "处理后");

    // 测试用例3：边界连通
    console.log("测试用例3：边界连通");
    const board3 = [
        ["O","O","O"],
        ["O","O","O"],
        ["O","O","O"]
    ];
    const board3Copy = deepCopy(board3);

    printBoard(board3, "原始矩阵");
    solve(board3Copy);
    printBoard(board3Copy, "处理后");

    // 测试用例4：复杂情况
    console.log("测试用例4：复杂情况");
    const board4 = [
        ["O","X","X","O","X"],
        ["X","O","O","X","O"],
        ["X","O","X","O","X"],
        ["O","X","O","O","O"],
        ["X","X","O","X","O"]
    ];
    const board4Copy = deepCopy(board4);

    printBoard(board4, "原始矩阵");
    solve(board4Copy);
    printBoard(board4Copy, "处理后");

    // 测试用例5：单行单列
    console.log("测试用例5：边界情况");
    const board5 = [["O","O","O"]];
    const board5Copy = deepCopy(board5);

    printBoard(board5, "单行矩阵");
    solve(board5Copy);
    printBoard(board5Copy, "处理后");

    const board6 = [["O"],["O"],["O"]];
    const board6Copy = deepCopy(board6);

    printBoard(board6, "单列矩阵");
    solve(board6Copy);
    printBoard(board6Copy, "处理后");
}

// ==================== 性能测试 ====================

/**
 * 性能测试
 */
function performanceTest() {
    console.log("=== 性能测试 ===\n");

    // 生成测试矩阵
    function generateBoard(m, n, oRatio = 0.3) {
        const board = [];
        for (let i = 0; i < m; i++) {
            const row = [];
            for (let j = 0; j < n; j++) {
                row.push(Math.random() < oRatio ? 'O' : 'X');
            }
            board.push(row);
        }
        return board;
    }

    // 深拷贝函数
    function deepCopy(board) {
        return board.map(row => [...row]);
    }

    // 性能测试函数
    function testPerformance(method, board, methodName) {
        const start = performance.now();
        method(board);
        const end = performance.now();
        return end - start;
    }

    const sizes = [
        {m: 50, n: 50},
        {m: 100, n: 100},
        {m: 200, n: 200}
    ];

    sizes.forEach(({m, n}) => {
        console.log(`\n测试规模: ${m}×${n}`);
        const originalBoard = generateBoard(m, n);

        // DFS测试
        const board1 = deepCopy(originalBoard);
        const time1 = testPerformance(solve, board1, "DFS");

        // BFS测试
        const board2 = deepCopy(originalBoard);
        const time2 = testPerformance(solveBFS, board2, "BFS");

        // 并查集测试
        const board3 = deepCopy(originalBoard);
        const time3 = testPerformance(solveUnionFind, board3, "并查集");

        console.log(`DFS耗时: ${time1.toFixed(2)}ms`);
        console.log(`BFS耗时: ${time2.toFixed(2)}ms`);
        console.log(`并查集耗时: ${time3.toFixed(2)}ms`);
    });
}

// ==================== 算法复杂度分析 ====================

/**
 * 算法复杂度总结
 */
function complexityAnalysis() {
    console.log("=== 算法复杂度分析 ===\n");

    console.log("方法对比：");
    console.log("┌─────────────┬─────────────┬─────────────┬────────────────┐");
    console.log("│    方法     │  时间复杂度  │  空间复杂度  │      特点      │");
    console.log("├─────────────┼─────────────┼─────────────┼────────────────┤");
    console.log("│ DFS (推荐)  │   O(m×n)    │   O(m×n)    │ 简洁，易理解   │");
    console.log("│ BFS         │   O(m×n)    │ O(min(m,n)) │ 避免栈溢出     │");
    console.log("│ 并查集      │ O(m×n×α(n)) │   O(m×n)    │ 理论优雅       │");
    console.log("└─────────────┴─────────────┴─────────────┴────────────────┘");

    console.log("\n算法选择建议：");
    console.log("• 一般情况：推荐使用DFS，代码简洁清晰");
    console.log("• 大矩阵：BFS避免递归栈溢出问题");
    console.log("• 理论学习：并查集展示了另一种解题思路");

    console.log("\n核心设计思想：");
    console.log("• 反向思维：寻找不被围绕的区域");
    console.log("• 边界驱动：从边界开始探索");
    console.log("• 标记技巧：使用临时标记避免重复处理");
}

// ==================== 可视化演示 ====================

/**
 * 可视化DFS过程
 */
function visualizeDFS() {
    console.log("=== DFS过程可视化 ===\n");

    const board = [
        ["X","X","X","X"],
        ["X","O","O","X"],
        ["X","X","O","X"],
        ["X","O","X","X"]
    ];

    console.log("原始矩阵：");
    board.forEach(row => console.log(row.join(' ')));
    console.log();

    const m = board.length;
    const n = board[0].length;
    let step = 1;

    function visualDFS(row, col, stepNum) {
        if (row < 0 || row >= m || col < 0 || col >= n || board[row][col] !== 'O') {
            return;
        }

        board[row][col] = '#';
        console.log(`步骤${stepNum}: 标记位置(${row},${col})`);
        board.forEach(r => console.log(r.join(' ')));
        console.log();

        // 递归搜索四个方向
        visualDFS(row - 1, col, stepNum + 1);
        visualDFS(row + 1, col, stepNum + 1);
        visualDFS(row, col - 1, stepNum + 1);
        visualDFS(row, col + 1, stepNum + 1);
    }

    // 从边界开始
    console.log("从边界(3,1)开始DFS：");
    visualDFS(3, 1, step);

    console.log("最终标记完成后，'#'表示安全区域，'O'表示被围绕区域");
}

// 运行测试
if (require.main === module) {
    runTests();
    performanceTest();
    complexityAnalysis();
    visualizeDFS();
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        solve,
        solveBFS,
        solveUnionFind
    };
}