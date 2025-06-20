/**
 * 第15章：回溯算法 - 高级算法实现
 *
 * 本文件包含：
 * 1. 图搜索回溯算法
 * 2. 约束满足问题
 * 3. 游戏回溯算法
 * 4. 优化策略和剪枝技巧
 * 5. 复杂组合优化问题
 */

// ================================
// 1. 图搜索回溯算法
// ================================

/**
 * N皇后问题解决器
 * 核心思想：在N×N棋盘上放置N个皇后，使得它们互不攻击
 */
class NQueensSolver {
    /**
     * 解决N皇后问题
     * 核心思想：逐行放置皇后，检查列、对角线冲突
     *
     * @param {number} n - 棋盘大小
     * @returns {Array<Array<string>>} 所有解决方案
     * @time O(n!)
     * @space O(n)
     */
    static solve(n) {
        const result = [];
        const board = Array(n).fill().map(() => Array(n).fill('.'));

        // 记录列和对角线的占用情况，用于快速冲突检测
        const cols = new Set();
        const diag1 = new Set(); // 主对角线 (row - col)
        const diag2 = new Set(); // 副对角线 (row + col)

        function backtrack(row) {
            if (row === n) {
                // 找到一个解，转换为字符串格式
                result.push(board.map(r => r.join('')));
                return;
            }

            for (let col = 0; col < n; col++) {
                // 检查是否冲突
                if (cols.has(col) || diag1.has(row - col) || diag2.has(row + col)) {
                    continue;
                }

                // 做选择
                board[row][col] = 'Q';
                cols.add(col);
                diag1.add(row - col);
                diag2.add(row + col);

                // 递归
                backtrack(row + 1);

                // 撤销选择
                board[row][col] = '.';
                cols.delete(col);
                diag1.delete(row - col);
                diag2.delete(row + col);
            }
        }

        backtrack(0);
        return result;
    }

    /**
     * 计算N皇后问题的解的数量（优化版本）
     * 核心思想：不需要构建实际的棋盘，只计算数量
     *
     * @param {number} n - 棋盘大小
     * @returns {number} 解的数量
     * @time O(n!)
     * @space O(n)
     */
    static countSolutions(n) {
        let count = 0;
        const cols = new Set();
        const diag1 = new Set();
        const diag2 = new Set();

        function backtrack(row) {
            if (row === n) {
                count++;
                return;
            }

            for (let col = 0; col < n; col++) {
                if (cols.has(col) || diag1.has(row - col) || diag2.has(row + col)) {
                    continue;
                }

                cols.add(col);
                diag1.add(row - col);
                diag2.add(row + col);

                backtrack(row + 1);

                cols.delete(col);
                diag1.delete(row - col);
                diag2.delete(row + col);
            }
        }

        backtrack(0);
        return count;
    }
}

/**
 * 图中路径搜索
 * 核心思想：在图中寻找从起点到终点的所有路径
 */
class GraphPathFinder {
    /**
     * 找到图中两点间的所有路径
     * 核心思想：使用回溯遍历所有可能的路径
     *
     * @param {Object} graph - 邻接表表示的图
     * @param {*} start - 起点
     * @param {*} end - 终点
     * @returns {Array<Array>} 所有路径
     * @time O(2^V) V为顶点数
     * @space O(V) 递归深度
     */
    static findAllPaths(graph, start, end) {
        const result = [];
        const visited = new Set();

        function backtrack(current, path) {
            if (current === end) {
                result.push([...path]);
                return;
            }

            // 遍历当前节点的所有邻居
            for (let neighbor of (graph[current] || [])) {
                if (!visited.has(neighbor)) {
                    // 做选择
                    visited.add(neighbor);
                    path.push(neighbor);

                    // 递归
                    backtrack(neighbor, path);

                    // 撤销选择
                    visited.delete(neighbor);
                    path.pop();
                }
            }
        }

        // 从起点开始
        visited.add(start);
        backtrack(start, [start]);

        return result;
    }

    /**
     * 寻找最短路径（使用回溯）
     * 核心思想：在所有路径中找到最短的一条
     *
     * @param {Object} graph - 邻接表表示的图
     * @param {*} start - 起点
     * @param {*} end - 终点
     * @returns {Array} 最短路径
     * @time O(2^V)
     * @space O(V)
     */
    static findShortestPath(graph, start, end) {
        let shortestPath = null;
        let minLength = Infinity;
        const visited = new Set();

        function backtrack(current, path) {
            if (current === end) {
                if (path.length < minLength) {
                    minLength = path.length;
                    shortestPath = [...path];
                }
                return;
            }

            // 剪枝：如果当前路径已经超过已知最短路径，提前退出
            if (path.length >= minLength) {
                return;
            }

            for (let neighbor of (graph[current] || [])) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    path.push(neighbor);

                    backtrack(neighbor, path);

                    visited.delete(neighbor);
                    path.pop();
                }
            }
        }

        visited.add(start);
        backtrack(start, [start]);

        return shortestPath;
    }
}

/**
 * 岛屿问题解决器
 * 核心思想：在二维网格中使用回溯算法解决岛屿相关问题
 */
class IslandSolver {
    /**
     * 计算岛屿数量
     * 核心思想：使用DFS回溯遍历连通的陆地
     *
     * @param {Array<Array<string>>} grid - 二维网格
     * @returns {number} 岛屿数量
     * @time O(m * n) m, n为网格尺寸
     * @space O(m * n) 最坏情况递归深度
     */
    static numIslands(grid) {
        if (!grid || !grid.length) return 0;

        const rows = grid.length;
        const cols = grid[0].length;
        let count = 0;

        function dfs(i, j) {
            // 边界检查和水域检查
            if (i < 0 || i >= rows || j < 0 || j >= cols || grid[i][j] !== '1') {
                return;
            }

            // 标记为已访问
            grid[i][j] = '0';

            // 探索四个方向
            dfs(i + 1, j);
            dfs(i - 1, j);
            dfs(i, j + 1);
            dfs(i, j - 1);
        }

        // 遍历整个网格
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (grid[i][j] === '1') {
                    count++;
                    dfs(i, j); // 将整个岛屿标记为已访问
                }
            }
        }

        return count;
    }

    /**
     * 计算岛屿的最大面积
     * 核心思想：在遍历岛屿时计算面积
     *
     * @param {Array<Array<number>>} grid - 二维网格
     * @returns {number} 最大岛屿面积
     * @time O(m * n)
     * @space O(m * n)
     */
    static maxAreaOfIsland(grid) {
        if (!grid || !grid.length) return 0;

        const rows = grid.length;
        const cols = grid[0].length;
        let maxArea = 0;

        function dfs(i, j) {
            if (i < 0 || i >= rows || j < 0 || j >= cols || grid[i][j] !== 1) {
                return 0;
            }

            // 标记为已访问
            grid[i][j] = 0;

            // 计算当前岛屿面积
            return 1 + dfs(i + 1, j) + dfs(i - 1, j) + dfs(i, j + 1) + dfs(i, j - 1);
        }

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (grid[i][j] === 1) {
                    maxArea = Math.max(maxArea, dfs(i, j));
                }
            }
        }

        return maxArea;
    }
}

// ================================
// 2. 约束满足问题
// ================================

/**
 * 数独解决器
 * 核心思想：在9×9网格中填入1-9的数字，满足行、列、3×3宫格约束
 */
class SudokuSolver {
    /**
     * 解决数独问题
     * 核心思想：逐个空格尝试数字，回溯无效选择
     *
     * @param {Array<Array<string>>} board - 数独板
     * @returns {boolean} 是否有解
     * @time O(9^(81-filled)) filled为已填入的数字数量
     * @space O(81) 递归深度
     */
    static solve(board) {
        function isValid(board, row, col, num) {
            // 检查行
            for (let j = 0; j < 9; j++) {
                if (board[row][j] === num) return false;
            }

            // 检查列
            for (let i = 0; i < 9; i++) {
                if (board[i][col] === num) return false;
            }

            // 检查3×3宫格
            const boxRow = Math.floor(row / 3) * 3;
            const boxCol = Math.floor(col / 3) * 3;
            for (let i = boxRow; i < boxRow + 3; i++) {
                for (let j = boxCol; j < boxCol + 3; j++) {
                    if (board[i][j] === num) return false;
                }
            }

            return true;
        }

        function backtrack() {
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    if (board[i][j] === '.') {
                        for (let num = '1'; num <= '9'; num++) {
                            if (isValid(board, i, j, num)) {
                                // 做选择
                                board[i][j] = num;

                                // 递归
                                if (backtrack()) {
                                    return true;
                                }

                                // 撤销选择
                                board[i][j] = '.';
                            }
                        }
                        return false; // 当前位置无解
                    }
                }
            }
            return true; // 所有位置都填满了
        }

        return backtrack();
    }

    /**
     * 获取数独的所有解
     * 核心思想：继续搜索而不是在找到第一个解时停止
     *
     * @param {Array<Array<string>>} board - 数独板
     * @returns {Array<Array<Array<string>>>} 所有解
     * @time O(9^81)
     * @space O(81)
     */
    static getAllSolutions(board) {
        const solutions = [];

        function isValid(board, row, col, num) {
            for (let j = 0; j < 9; j++) {
                if (board[row][j] === num) return false;
            }

            for (let i = 0; i < 9; i++) {
                if (board[i][col] === num) return false;
            }

            const boxRow = Math.floor(row / 3) * 3;
            const boxCol = Math.floor(col / 3) * 3;
            for (let i = boxRow; i < boxRow + 3; i++) {
                for (let j = boxCol; j < boxCol + 3; j++) {
                    if (board[i][j] === num) return false;
                }
            }

            return true;
        }

        function backtrack() {
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    if (board[i][j] === '.') {
                        for (let num = '1'; num <= '9'; num++) {
                            if (isValid(board, i, j, num)) {
                                board[i][j] = num;
                                backtrack();
                                board[i][j] = '.';
                            }
                        }
                        return;
                    }
                }
            }
            // 找到一个完整解，深拷贝保存
            solutions.push(board.map(row => [...row]));
        }

        backtrack();
        return solutions;
    }
}

/**
 * 图着色问题
 * 核心思想：给图的每个顶点着色，使得相邻顶点颜色不同
 */
class GraphColoring {
    /**
     * 图着色问题求解
     * 核心思想：为每个顶点尝试所有可能的颜色
     *
     * @param {Array<Array<number>>} graph - 邻接矩阵
     * @param {number} colors - 颜色数量
     * @returns {Array<number>|null} 着色方案或null
     * @time O(k^V) k为颜色数，V为顶点数
     * @space O(V)
     */
    static solve(graph, colors) {
        const n = graph.length;
        const coloring = new Array(n).fill(-1);

        function isSafe(vertex, color) {
            // 检查相邻顶点是否有相同颜色
            for (let i = 0; i < n; i++) {
                if (graph[vertex][i] === 1 && coloring[i] === color) {
                    return false;
                }
            }
            return true;
        }

        function backtrack(vertex) {
            if (vertex === n) {
                return true; // 所有顶点都已着色
            }

            for (let color = 0; color < colors; color++) {
                if (isSafe(vertex, color)) {
                    // 做选择
                    coloring[vertex] = color;

                    // 递归
                    if (backtrack(vertex + 1)) {
                        return true;
                    }

                    // 撤销选择
                    coloring[vertex] = -1;
                }
            }

            return false;
        }

        if (backtrack(0)) {
            return coloring;
        }
        return null;
    }

    /**
     * 寻找图的色数（最少需要的颜色数）
     * 核心思想：从1开始逐步增加颜色数，直到找到可行解
     *
     * @param {Array<Array<number>>} graph - 邻接矩阵
     * @returns {number} 色数
     * @time O(k^V * k)
     * @space O(V)
     */
    static findChromaticNumber(graph) {
        const n = graph.length;

        for (let colors = 1; colors <= n; colors++) {
            if (this.solve(graph, colors)) {
                return colors;
            }
        }

        return n; // 最坏情况需要n种颜色
    }
}

// ================================
// 3. 游戏回溯算法
// ================================

/**
 * 八皇后变种：马的遍历问题
 * 核心思想：马在棋盘上走遍所有格子，每个格子只能走一次
 */
class KnightTour {
    /**
     * 骑士巡游问题
     * 核心思想：使用回溯算法找到马的一条遍历路径
     *
     * @param {number} n - 棋盘大小
     * @param {number} startX - 起始x坐标
     * @param {number} startY - 起始y坐标
     * @returns {Array<Array<number>>|null} 路径矩阵或null
     * @time O(8^(n²))
     * @space O(n²)
     */
    static solve(n, startX = 0, startY = 0) {
        const board = Array(n).fill().map(() => Array(n).fill(-1));
        const moves = [
            [2, 1], [2, -1], [-2, 1], [-2, -1],
            [1, 2], [1, -2], [-1, 2], [-1, -2]
        ];

        function isValid(x, y) {
            return x >= 0 && x < n && y >= 0 && y < n && board[x][y] === -1;
        }

        function backtrack(x, y, moveCount) {
            // 标记当前位置
            board[x][y] = moveCount;

            // 如果所有格子都访问过，成功
            if (moveCount === n * n - 1) {
                return true;
            }

            // 尝试所有可能的马的移动
            for (let [dx, dy] of moves) {
                const nextX = x + dx;
                const nextY = y + dy;

                if (isValid(nextX, nextY)) {
                    if (backtrack(nextX, nextY, moveCount + 1)) {
                        return true;
                    }
                }
            }

            // 回溯
            board[x][y] = -1;
            return false;
        }

        if (backtrack(startX, startY, 0)) {
            return board;
        }
        return null;
    }

    /**
     * 使用启发式优化的骑士巡游
     * 核心思想：优先选择可达位置较少的下一步（Warnsdorff规则）
     *
     * @param {number} n - 棋盘大小
     * @param {number} startX - 起始x坐标
     * @param {number} startY - 起始y坐标
     * @returns {Array<Array<number>>|null} 路径矩阵或null
     * @time O(n²) 平均情况下大大优化
     * @space O(n²)
     */
    static solveWithHeuristic(n, startX = 0, startY = 0) {
        const board = Array(n).fill().map(() => Array(n).fill(-1));
        const moves = [
            [2, 1], [2, -1], [-2, 1], [-2, -1],
            [1, 2], [1, -2], [-1, 2], [-1, -2]
        ];

        function isValid(x, y) {
            return x >= 0 && x < n && y >= 0 && y < n && board[x][y] === -1;
        }

        function countAccessible(x, y) {
            let count = 0;
            for (let [dx, dy] of moves) {
                if (isValid(x + dx, y + dy)) {
                    count++;
                }
            }
            return count;
        }

        function getNextMoves(x, y) {
            const nextMoves = [];
            for (let [dx, dy] of moves) {
                const nextX = x + dx;
                const nextY = y + dy;
                if (isValid(nextX, nextY)) {
                    nextMoves.push({
                        x: nextX,
                        y: nextY,
                        accessibility: countAccessible(nextX, nextY)
                    });
                }
            }
            // 按可达性排序（Warnsdorff规则）
            return nextMoves.sort((a, b) => a.accessibility - b.accessibility);
        }

        function backtrack(x, y, moveCount) {
            board[x][y] = moveCount;

            if (moveCount === n * n - 1) {
                return true;
            }

            const nextMoves = getNextMoves(x, y);
            for (let move of nextMoves) {
                if (backtrack(move.x, move.y, moveCount + 1)) {
                    return true;
                }
            }

            board[x][y] = -1;
            return false;
        }

        if (backtrack(startX, startY, 0)) {
            return board;
        }
        return null;
    }
}

/**
 * 数字游戏：数独变种
 * 核心思想：在网格中填入数字，满足特定的和约束
 */
class KenKenSolver {
    /**
     * 解决KenKen数字游戏
     * 核心思想：在n×n网格中填入1-n的数字，满足笼子的运算约束
     *
     * @param {number} n - 网格大小
     * @param {Array<Object>} cages - 笼子约束
     * @returns {Array<Array<number>>|null} 解或null
     * @time O(n^(n²))
     * @space O(n²)
     */
    static solve(n, cages) {
        const board = Array(n).fill().map(() => Array(n).fill(0));

        function isValid(row, col, num) {
            // 检查行约束
            for (let j = 0; j < n; j++) {
                if (j !== col && board[row][j] === num) {
                    return false;
                }
            }

            // 检查列约束
            for (let i = 0; i < n; i++) {
                if (i !== row && board[i][col] === num) {
                    return false;
                }
            }

            return true;
        }

        function checkCageConstraint(cage) {
            const { cells, operation, target } = cage;
            const values = cells.map(([r, c]) => board[r][c]).filter(v => v !== 0);

            if (values.length !== cells.length) {
                return true; // 还有空格，暂时有效
            }

            switch (operation) {
                case '+':
                    return values.reduce((sum, v) => sum + v, 0) === target;
                case '*':
                    return values.reduce((prod, v) => prod * v, 1) === target;
                case '-':
                    return values.length === 2 && Math.abs(values[0] - values[1]) === target;
                case '/':
                    return values.length === 2 &&
                           (values[0] / values[1] === target || values[1] / values[0] === target);
                default:
                    return false;
            }
        }

        function backtrack(row, col) {
            if (row === n) {
                // 检查所有笼子约束
                return cages.every(cage => checkCageConstraint(cage));
            }

            const nextRow = col === n - 1 ? row + 1 : row;
            const nextCol = col === n - 1 ? 0 : col + 1;

            for (let num = 1; num <= n; num++) {
                if (isValid(row, col, num)) {
                    board[row][col] = num;

                    // 检查相关笼子约束
                    const relatedCages = cages.filter(cage =>
                        cage.cells.some(([r, c]) => r === row && c === col)
                    );

                    const constraintsOk = relatedCages.every(cage => {
                        const values = cage.cells.map(([r, c]) => board[r][c]);
                        const filledCount = values.filter(v => v !== 0).length;

                        if (filledCount === cage.cells.length) {
                            return checkCageConstraint(cage);
                        }
                        return true; // 部分填充，暂时有效
                    });

                    if (constraintsOk && backtrack(nextRow, nextCol)) {
                        return true;
                    }

                    board[row][col] = 0;
                }
            }

            return false;
        }

        if (backtrack(0, 0)) {
            return board;
        }
        return null;
    }
}

// ================================
// 4. 优化策略和剪枝技巧
// ================================

/**
 * 回溯算法优化器
 * 核心思想：提供各种优化策略来提高回溯算法的性能
 */
class BacktrackOptimizer {
    /**
     * 最小剩余值启发式（MRV）
     * 核心思想：优先选择剩余合法值最少的变量
     *
     * @param {Array} variables - 变量列表
     * @param {Function} getDomainSize - 获取变量域大小的函数
     * @returns {*} 下一个要处理的变量
     * @time O(n)
     * @space O(1)
     */
    static minimumRemainingValues(variables, getDomainSize) {
        let minVariable = null;
        let minSize = Infinity;

        for (let variable of variables) {
            const size = getDomainSize(variable);
            if (size < minSize && size > 0) {
                minSize = size;
                minVariable = variable;
            }
        }

        return minVariable;
    }

    /**
     * 度启发式（Degree Heuristic）
     * 核心思想：优先选择与最多未赋值变量相关的变量
     *
     * @param {Array} variables - 变量列表
     * @param {Function} getConstrainedCount - 获取约束变量数的函数
     * @returns {*} 下一个要处理的变量
     * @time O(n)
     * @space O(1)
     */
    static degreeHeuristic(variables, getConstrainedCount) {
        let maxVariable = null;
        let maxCount = -1;

        for (let variable of variables) {
            const count = getConstrainedCount(variable);
            if (count > maxCount) {
                maxCount = count;
                maxVariable = variable;
            }
        }

        return maxVariable;
    }

    /**
     * 最少约束值启发式（LCV）
     * 核心思想：优先选择对其他变量约束影响最小的值
     *
     * @param {*} variable - 当前变量
     * @param {Array} domain - 变量的域
     * @param {Function} getConstraintCost - 获取约束代价的函数
     * @returns {Array} 排序后的值列表
     * @time O(d log d) d为域大小
     * @space O(d)
     */
    static leastConstrainingValue(variable, domain, getConstraintCost) {
        return domain.sort((a, b) => {
            const costA = getConstraintCost(variable, a);
            const costB = getConstraintCost(variable, b);
            return costA - costB;
        });
    }

    /**
     * 前向检查（Forward Checking）
     * 核心思想：在赋值后立即检查相关变量的域，提早发现冲突
     *
     * @param {*} variable - 当前变量
     * @param {*} value - 赋予的值
     * @param {Map} domains - 所有变量的域
     * @param {Function} getConstraints - 获取约束的函数
     * @returns {Map|null} 更新后的域或null（如果有冲突）
     * @time O(cd) c为约束数，d为平均域大小
     * @space O(n) n为变量数
     */
    static forwardCheck(variable, value, domains, getConstraints) {
        const newDomains = new Map();

        // 深拷贝当前域
        for (let [var_key, domain] of domains) {
            newDomains.set(var_key, [...domain]);
        }

        // 更新当前变量的域
        newDomains.set(variable, [value]);

        // 检查所有相关约束
        const constraints = getConstraints(variable);
        for (let constraint of constraints) {
            const constrainedVar = constraint.getOtherVariable(variable);
            const currentDomain = newDomains.get(constrainedVar);

            if (!currentDomain) continue;

            const filteredDomain = currentDomain.filter(val =>
                constraint.isSatisfied(variable, value, constrainedVar, val)
            );

            if (filteredDomain.length === 0) {
                return null; // 域为空，冲突
            }

            newDomains.set(constrainedVar, filteredDomain);
        }

        return newDomains;
    }

    /**
     * 弧一致性检查（Arc Consistency）
     * 核心思想：确保每个变量的每个值都与相关变量的某个值一致
     *
     * @param {Map} domains - 变量域
     * @param {Array} constraints - 约束列表
     * @returns {Map|null} 过滤后的域或null（如果不一致）
     * @time O(cd³) c为约束数，d为最大域大小
     * @space O(n)
     */
    static arcConsistency(domains, constraints) {
        const newDomains = new Map();

        // 深拷贝域
        for (let [variable, domain] of domains) {
            newDomains.set(variable, [...domain]);
        }

        const queue = [...constraints];

        while (queue.length > 0) {
            const constraint = queue.shift();
            const [var1, var2] = constraint.getVariables();

            const domain1 = newDomains.get(var1);
            const domain2 = newDomains.get(var2);

            const filteredDomain1 = domain1.filter(val1 =>
                domain2.some(val2 => constraint.isSatisfied(var1, val1, var2, val2))
            );

            if (filteredDomain1.length !== domain1.length) {
                if (filteredDomain1.length === 0) {
                    return null; // 不一致
                }

                newDomains.set(var1, filteredDomain1);

                // 添加相关约束到队列
                const relatedConstraints = constraints.filter(c =>
                    c !== constraint && c.involves(var1)
                );
                queue.push(...relatedConstraints);
            }
        }

        return newDomains;
    }
}

// ================================
// 5. 复杂组合优化问题
// ================================

/**
 * 旅行商问题（TSP）回溯解法
 * 核心思想：寻找访问所有城市且回到起点的最短路径
 */
class TSPSolver {
    /**
     * 使用回溯算法解决TSP问题
     * 核心思想：枚举所有可能的路径，记录最短距离
     *
     * @param {Array<Array<number>>} distances - 城市间距离矩阵
     * @returns {Object} 最短路径和距离
     * @time O(n!)
     * @space O(n)
     */
    static solve(distances) {
        const n = distances.length;
        let minDistance = Infinity;
        let bestPath = [];
        const visited = new Array(n).fill(false);

        function backtrack(currentCity, path, distance) {
            if (path.length === n) {
                // 回到起点
                const totalDistance = distance + distances[currentCity][0];
                if (totalDistance < minDistance) {
                    minDistance = totalDistance;
                    bestPath = [...path, 0];
                }
                return;
            }

            // 剪枝：如果当前距离已经超过最佳距离，提前退出
            if (distance >= minDistance) {
                return;
            }

            for (let nextCity = 0; nextCity < n; nextCity++) {
                if (!visited[nextCity]) {
                    visited[nextCity] = true;
                    path.push(nextCity);

                    backtrack(
                        nextCity,
                        path,
                        distance + distances[currentCity][nextCity]
                    );

                    path.pop();
                    visited[nextCity] = false;
                }
            }
        }

        // 从城市0开始
        visited[0] = true;
        backtrack(0, [0], 0);

        return {
            path: bestPath,
            distance: minDistance
        };
    }

    /**
     * 带启发式的TSP求解
     * 核心思想：使用最小生成树作为下界进行剪枝
     *
     * @param {Array<Array<number>>} distances - 城市间距离矩阵
     * @returns {Object} 最短路径和距离
     * @time O(n!)，但实际运行时间大大改善
     * @space O(n)
     */
    static solveWithMST(distances) {
        const n = distances.length;
        let minDistance = Infinity;
        let bestPath = [];
        const visited = new Array(n).fill(false);

        function calculateMSTLowerBound(unvisited, currentCity) {
            if (unvisited.length <= 1) return 0;

            // 计算未访问城市的最小生成树
            const mstCost = 0;
            // 这里简化实现，实际应该计算MST
            // 返回一个下界估计
            return mstCost;
        }

        function backtrack(currentCity, path, distance) {
            if (path.length === n) {
                const totalDistance = distance + distances[currentCity][0];
                if (totalDistance < minDistance) {
                    minDistance = totalDistance;
                    bestPath = [...path, 0];
                }
                return;
            }

            // 启发式剪枝
            const unvisited = [];
            for (let i = 0; i < n; i++) {
                if (!visited[i]) unvisited.push(i);
            }

            const lowerBound = distance + calculateMSTLowerBound(unvisited, currentCity);
            if (lowerBound >= minDistance) {
                return;
            }

            for (let nextCity of unvisited) {
                visited[nextCity] = true;
                path.push(nextCity);

                backtrack(
                    nextCity,
                    path,
                    distance + distances[currentCity][nextCity]
                );

                path.pop();
                visited[nextCity] = false;
            }
        }

        visited[0] = true;
        backtrack(0, [0], 0);

        return {
            path: bestPath,
            distance: minDistance
        };
    }
}

/**
 * 集合覆盖问题
 * 核心思想：选择最少的集合来覆盖所有元素
 */
class SetCoverSolver {
    /**
     * 使用回溯算法解决集合覆盖问题
     * 核心思想：枚举所有可能的集合组合
     *
     * @param {Array<Set>} sets - 集合数组
     * @param {Set} universe - 需要覆盖的全集
     * @returns {Array<number>} 最优解的集合索引
     * @time O(2^n) n为集合数量
     * @space O(n)
     */
    static solve(sets, universe) {
        let minSets = Infinity;
        let bestSolution = [];

        function backtrack(index, selected, covered) {
            // 剪枝：如果已选择的集合数量超过当前最优解
            if (selected.length >= minSets) {
                return;
            }

            // 检查是否完全覆盖
            if (covered.size === universe.size) {
                if (selected.length < minSets) {
                    minSets = selected.length;
                    bestSolution = [...selected];
                }
                return;
            }

            // 如果已经遍历完所有集合但未完全覆盖
            if (index === sets.length) {
                return;
            }

            // 选择当前集合
            const currentSet = sets[index];
            const newCovered = new Set([...covered, ...currentSet]);
            selected.push(index);
            backtrack(index + 1, selected, newCovered);
            selected.pop();

            // 不选择当前集合
            backtrack(index + 1, selected, covered);
        }

        backtrack(0, [], new Set());
        return bestSolution;
    }

    /**
     * 带贪心启发式的集合覆盖
     * 核心思想：优先选择覆盖最多未覆盖元素的集合
     *
     * @param {Array<Set>} sets - 集合数组
     * @param {Set} universe - 需要覆盖的全集
     * @returns {Array<number>} 解的集合索引
     * @time O(n²m) n为集合数，m为元素数
     * @space O(n)
     */
    static solveGreedy(sets, universe) {
        const solution = [];
        const covered = new Set();
        const remaining = new Set(universe);

        while (remaining.size > 0) {
            let bestSet = -1;
            let maxCover = 0;

            // 找到覆盖最多剩余元素的集合
            for (let i = 0; i < sets.length; i++) {
                if (solution.includes(i)) continue;

                const newCover = [...sets[i]].filter(elem => remaining.has(elem)).length;
                if (newCover > maxCover) {
                    maxCover = newCover;
                    bestSet = i;
                }
            }

            if (bestSet === -1) break; // 无法进一步覆盖

            // 选择最佳集合
            solution.push(bestSet);
            for (let elem of sets[bestSet]) {
                covered.add(elem);
                remaining.delete(elem);
            }
        }

        return solution;
    }
}

// ================================
// 测试和示例
// ================================

/**
 * 测试高级回溯算法实现
 */
function testAdvancedBacktrackAlgorithms() {
    console.log("=== 高级回溯算法测试 ===\n");

    // 测试N皇后问题
    console.log("1. N皇后问题测试:");
    const nQueensSolutions = NQueensSolver.solve(4);
    console.log("4皇后解的数量:", nQueensSolutions.length);
    console.log("第一个解:", nQueensSolutions[0]);

    // 测试数独求解
    console.log("\n2. 数独求解测试:");
    const sudokuBoard = [
        ["5", "3", ".", ".", "7", ".", ".", ".", "."],
        ["6", ".", ".", "1", "9", "5", ".", ".", "."],
        [".", "9", "8", ".", ".", ".", ".", "6", "."],
        ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
        ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
        ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
        [".", "6", ".", ".", ".", ".", "2", "8", "."],
        [".", ".", ".", "4", "1", "9", ".", ".", "5"],
        [".", ".", ".", ".", "8", ".", ".", "7", "9"]
    ];
    console.log("数独求解结果:", SudokuSolver.solve(sudokuBoard) ? "有解" : "无解");

    // 测试骑士巡游
    console.log("\n3. 骑士巡游测试:");
    const knightTour = KnightTour.solve(5);
    console.log("5x5棋盘骑士巡游:", knightTour ? "有解" : "无解");

    // 测试图着色
    console.log("\n4. 图着色测试:");
    const graph = [
        [0, 1, 1, 1],
        [1, 0, 1, 0],
        [1, 1, 0, 1],
        [1, 0, 1, 0]
    ];
    const coloring = GraphColoring.solve(graph, 3);
    console.log("图着色结果:", coloring);

    // 测试TSP
    console.log("\n5. 旅行商问题测试:");
    const distances = [
        [0, 10, 15, 20],
        [10, 0, 35, 25],
        [15, 35, 0, 30],
        [20, 25, 30, 0]
    ];
    const tspResult = TSPSolver.solve(distances);
    console.log("TSP最短路径:", tspResult.path);
    console.log("TSP最短距离:", tspResult.distance);

    console.log("\n=== 测试完成 ===");
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        NQueensSolver,
        GraphPathFinder,
        IslandSolver,
        SudokuSolver,
        GraphColoring,
        KnightTour,
        KenKenSolver,
        BacktrackOptimizer,
        TSPSolver,
        SetCoverSolver,
        testAdvancedBacktrackAlgorithms
    };
} else {
    // 浏览器环境下运行测试
    testAdvancedBacktrackAlgorithms();
}