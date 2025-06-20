/**
 * 第15章：回溯算法 - 练习题解答
 *
 * 本文件包含5道回溯算法练习题的完整解答：
 * 1. 单词搜索
 * 2. 分割回文串
 * 3. 组合总和
 * 4. 恢复IP地址
 * 5. 解数独
 */

// ================================
// 1. 单词搜索
// ================================

/**
 * 单词搜索问题
 * 核心思想：使用DFS在二维网格中搜索单词路径
 *
 * @param {string[][]} board - 二维字符网格
 * @param {string} word - 目标单词
 * @returns {boolean} 是否存在该单词
 * @time O(m×n×4^L) m、n为网格尺寸，L为单词长度
 * @space O(L) 递归深度
 */
function wordSearch(board, word) {
    if (!board || !board.length || !word) return false;

    const rows = board.length;
    const cols = board[0].length;
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // 上下左右

    /**
     * DFS搜索函数
     * 核心思想：从当前位置开始，在四个方向上递归搜索下一个字符
     *
     * @param {number} row - 当前行
     * @param {number} col - 当前列
     * @param {number} index - 当前匹配到的字符索引
     * @returns {boolean} 是否找到完整单词
     */
    function dfs(row, col, index) {
        // 找到完整单词
        if (index === word.length) {
            return true;
        }

        // 边界检查和字符匹配检查
        if (row < 0 || row >= rows || col < 0 || col >= cols ||
            board[row][col] !== word[index]) {
            return false;
        }

        // 标记当前格子为已访问
        const temp = board[row][col];
        board[row][col] = '#';

        // 在四个方向上递归搜索
        for (let [dr, dc] of directions) {
            if (dfs(row + dr, col + dc, index + 1)) {
                // 恢复现场
                board[row][col] = temp;
                return true;
            }
        }

        // 回溯：恢复当前格子的字符
        board[row][col] = temp;
        return false;
    }

    // 从每个可能的起点开始搜索
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (board[i][j] === word[0] && dfs(i, j, 0)) {
                return true;
            }
        }
    }

    return false;
}

/**
 * 单词搜索优化版本（不修改原数组）
 * 核心思想：使用独立的visited数组记录访问状态
 *
 * @param {string[][]} board - 二维字符网格
 * @param {string} word - 目标单词
 * @returns {boolean} 是否存在该单词
 * @time O(m×n×4^L)
 * @space O(m×n + L) 额外空间用于visited数组
 */
function wordSearchOptimized(board, word) {
    if (!board || !board.length || !word) return false;

    const rows = board.length;
    const cols = board[0].length;
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const visited = Array(rows).fill().map(() => Array(cols).fill(false));

    function dfs(row, col, index) {
        if (index === word.length) return true;

        if (row < 0 || row >= rows || col < 0 || col >= cols ||
            visited[row][col] || board[row][col] !== word[index]) {
            return false;
        }

        visited[row][col] = true;

        for (let [dr, dc] of directions) {
            if (dfs(row + dr, col + dc, index + 1)) {
                visited[row][col] = false;
                return true;
            }
        }

        visited[row][col] = false;
        return false;
    }

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (board[i][j] === word[0] && dfs(i, j, 0)) {
                return true;
            }
        }
    }

    return false;
}

/**
 * 多单词搜索扩展版本
 * 核心思想：使用Trie树优化多单词的同时搜索
 *
 * @param {string[][]} board - 二维字符网格
 * @param {string[]} words - 单词列表
 * @returns {string[]} 找到的单词列表
 * @time O(m×n×4^L×W) W为单词数量
 * @space O(TRIE_SIZE + m×n)
 */
function findWords(board, words) {
    const result = [];
    const rows = board.length;
    const cols = board[0].length;
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    // 构建Trie树
    class TrieNode {
        constructor() {
            this.children = {};
            this.word = null;
        }
    }

    const root = new TrieNode();

    // 将所有单词插入Trie树
    for (let word of words) {
        let node = root;
        for (let char of word) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
        }
        node.word = word;
    }

    function dfs(row, col, node) {
        if (row < 0 || row >= rows || col < 0 || col >= cols) return;

        const char = board[row][col];
        if (!node.children[char]) return;

        node = node.children[char];

        // 找到一个完整单词
        if (node.word) {
            result.push(node.word);
            node.word = null; // 避免重复添加
        }

        // 标记已访问
        board[row][col] = '#';

        // 四个方向递归搜索
        for (let [dr, dc] of directions) {
            dfs(row + dr, col + dc, node);
        }

        // 回溯
        board[row][col] = char;
    }

    // 从每个位置开始搜索
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            dfs(i, j, root);
        }
    }

    return result;
}

// ================================
// 2. 分割回文串
// ================================

/**
 * 分割回文串问题
 * 核心思想：递归尝试每个可能的分割点，检查分割出的子串是否为回文
 *
 * @param {string} s - 输入字符串
 * @returns {string[][]} 所有可能的回文分割方案
 * @time O(n×2^n) n为字符串长度
 * @space O(n²) 用于回文判断的预处理
 */
function palindromePartition(s) {
    const result = [];
    const n = s.length;

    // 预处理：使用动态规划计算所有子串的回文性质
    const isPalindrome = Array(n).fill().map(() => Array(n).fill(false));

    // 计算所有子串是否为回文
    for (let len = 1; len <= n; len++) {
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;
            if (len === 1) {
                isPalindrome[i][j] = true;
            } else if (len === 2) {
                isPalindrome[i][j] = (s[i] === s[j]);
            } else {
                isPalindrome[i][j] = (s[i] === s[j]) && isPalindrome[i + 1][j - 1];
            }
        }
    }

    /**
     * 回溯函数
     * 核心思想：从当前位置开始，尝试所有可能的分割点
     *
     * @param {number} start - 当前开始位置
     * @param {string[]} path - 当前路径
     */
    function backtrack(start, path) {
        // 到达字符串末尾，找到一个完整的分割方案
        if (start === n) {
            result.push([...path]);
            return;
        }

        // 尝试从start到每个可能的结束位置
        for (let end = start; end < n; end++) {
            if (isPalindrome[start][end]) {
                // 当前子串是回文，继续递归
                path.push(s.substring(start, end + 1));
                backtrack(end + 1, path);
                path.pop(); // 回溯
            }
        }
    }

    backtrack(0, []);
    return result;
}

/**
 * 分割回文串 - 统计方案数量
 * 核心思想：只统计数量，不保存具体方案，节省空间
 *
 * @param {string} s - 输入字符串
 * @returns {number} 回文分割方案的数量
 * @time O(n×2^n)
 * @space O(n²)
 */
function palindromePartitionCount(s) {
    const n = s.length;

    // 预处理回文判断
    const isPalindrome = Array(n).fill().map(() => Array(n).fill(false));

    for (let len = 1; len <= n; len++) {
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;
            if (len === 1) {
                isPalindrome[i][j] = true;
            } else if (len === 2) {
                isPalindrome[i][j] = (s[i] === s[j]);
            } else {
                isPalindrome[i][j] = (s[i] === s[j]) && isPalindrome[i + 1][j - 1];
            }
        }
    }

    function countPartitions(start) {
        if (start === n) return 1;

        let count = 0;
        for (let end = start; end < n; end++) {
            if (isPalindrome[start][end]) {
                count += countPartitions(end + 1);
            }
        }
        return count;
    }

    return countPartitions(0);
}

/**
 * 动态规划优化的回文分割计数
 * 核心思想：使用记忆化搜索避免重复计算
 *
 * @param {string} s - 输入字符串
 * @returns {number} 回文分割方案的数量
 * @time O(n²)
 * @space O(n²)
 */
function palindromePartitionCountDP(s) {
    const n = s.length;
    const memo = new Array(n).fill(-1);

    // 预处理回文判断
    const isPalindrome = Array(n).fill().map(() => Array(n).fill(false));

    for (let len = 1; len <= n; len++) {
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;
            if (len === 1) {
                isPalindrome[i][j] = true;
            } else if (len === 2) {
                isPalindrome[i][j] = (s[i] === s[j]);
            } else {
                isPalindrome[i][j] = (s[i] === s[j]) && isPalindrome[i + 1][j - 1];
            }
        }
    }

    function dp(start) {
        if (start === n) return 1;
        if (memo[start] !== -1) return memo[start];

        let count = 0;
        for (let end = start; end < n; end++) {
            if (isPalindrome[start][end]) {
                count += dp(end + 1);
            }
        }

        memo[start] = count;
        return count;
    }

    return dp(0);
}

// ================================
// 3. 组合总和
// ================================

/**
 * 组合总和问题（基础版本）
 * 核心思想：对每个数字，选择包含或不包含，允许重复使用
 *
 * @param {number[]} candidates - 候选数字数组
 * @param {number} target - 目标和
 * @returns {number[][]} 所有可能的组合
 * @time O(2^(target/min)) min为最小的候选数字
 * @space O(target/min) 递归深度
 */
function combinationSum(candidates, target) {
    const result = [];

    /**
     * 回溯函数
     * 核心思想：从当前索引开始，尝试使用每个候选数字
     *
     * @param {number} start - 当前开始索引
     * @param {number[]} path - 当前组合
     * @param {number} sum - 当前和
     */
    function backtrack(start, path, sum) {
        // 找到目标和
        if (sum === target) {
            result.push([...path]);
            return;
        }

        // 超过目标和，剪枝
        if (sum > target) {
            return;
        }

        // 从start开始避免重复组合
        for (let i = start; i < candidates.length; i++) {
            path.push(candidates[i]);
            // 允许重复使用同一个数字，所以下次从i开始
            backtrack(i, path, sum + candidates[i]);
            path.pop(); // 回溯
        }
    }

    backtrack(0, [], 0);
    return result;
}

/**
 * 组合总和问题（优化版本 - 排序剪枝）
 * 核心思想：先排序，提前剪枝减少不必要的搜索
 *
 * @param {number[]} candidates - 候选数字数组
 * @param {number} target - 目标和
 * @returns {number[][]} 所有可能的组合
 * @time O(2^(target/min))，实际性能有显著提升
 * @space O(target/min)
 */
function combinationSumOptimized(candidates, target) {
    const result = [];
    candidates.sort((a, b) => a - b); // 排序以便剪枝

    function backtrack(start, path, sum) {
        if (sum === target) {
            result.push([...path]);
            return;
        }

        for (let i = start; i < candidates.length; i++) {
            // 剪枝：如果当前数字已经超过剩余目标，后面的数字也会超过
            if (sum + candidates[i] > target) {
                break;
            }

            path.push(candidates[i]);
            backtrack(i, path, sum + candidates[i]);
            path.pop();
        }
    }

    backtrack(0, [], 0);
    return result;
}

/**
 * 组合总和 II（含重复数字）
 * 核心思想：处理重复数字，每个数字只能使用一次
 *
 * @param {number[]} candidates - 候选数字数组（可能含重复）
 * @param {number} target - 目标和
 * @returns {number[][]} 所有唯一的组合
 * @time O(2^n)
 * @space O(n)
 */
function combinationSum2(candidates, target) {
    const result = [];
    candidates.sort((a, b) => a - b);

    function backtrack(start, path, sum) {
        if (sum === target) {
            result.push([...path]);
            return;
        }

        for (let i = start; i < candidates.length; i++) {
            // 跳过重复数字（除了第一次使用）
            if (i > start && candidates[i] === candidates[i - 1]) {
                continue;
            }

            if (sum + candidates[i] > target) {
                break;
            }

            path.push(candidates[i]);
            // 每个数字只能使用一次，所以从i+1开始
            backtrack(i + 1, path, sum + candidates[i]);
            path.pop();
        }
    }

    backtrack(0, [], 0);
    return result;
}

/**
 * 组合总和 III（限制数字个数）
 * 核心思想：在1-9中选择k个数字，使和为n
 *
 * @param {number} k - 数字个数
 * @param {number} n - 目标和
 * @returns {number[][]} 所有可能的组合
 * @time O(C(9,k))
 * @space O(k)
 */
function combinationSum3(k, n) {
    const result = [];

    function backtrack(start, path, sum) {
        if (path.length === k) {
            if (sum === n) {
                result.push([...path]);
            }
            return;
        }

        // 剪枝：剩余数字不够或者和已经超过目标
        if (path.length > k || sum > n) {
            return;
        }

        for (let i = start; i <= 9; i++) {
            // 剪枝：如果剩余的最大可能和都达不到目标
            const remaining = k - path.length;
            const maxPossible = sum + (i + i + remaining - 1) * remaining / 2;
            if (maxPossible < n) {
                continue;
            }

            path.push(i);
            backtrack(i + 1, path, sum + i);
            path.pop();
        }
    }

    backtrack(1, [], 0);
    return result;
}

// ================================
// 4. 恢复IP地址
// ================================

/**
 * 恢复IP地址问题
 * 核心思想：将字符串分成4段，每段必须是有效的IP地址段
 *
 * @param {string} s - 输入字符串
 * @returns {string[]} 所有可能的IP地址
 * @time O(3^4) = O(81) 每段最多3种分割方式
 * @space O(1) 不考虑结果存储空间
 */
function restoreIpAddresses(s) {
    const result = [];
    const n = s.length;

    // 长度检查：IP地址长度必须在4-12之间
    if (n < 4 || n > 12) return result;

    /**
     * 检查字符串段是否为有效的IP地址段
     * 核心思想：检查数值范围和前导零
     *
     * @param {string} segment - 字符串段
     * @returns {boolean} 是否有效
     */
    function isValidSegment(segment) {
        // 长度检查
        if (segment.length === 0 || segment.length > 3) {
            return false;
        }

        // 前导零检查：除了"0"本身，不允许前导零
        if (segment.length > 1 && segment[0] === '0') {
            return false;
        }

        // 数值范围检查
        const num = parseInt(segment);
        return num >= 0 && num <= 255;
    }

    /**
     * 回溯函数
     * 核心思想：尝试所有可能的分割方式
     *
     * @param {number} start - 当前开始位置
     * @param {string[]} segments - 已分割的段
     */
    function backtrack(start, segments) {
        // 已分割出4段
        if (segments.length === 4) {
            if (start === n) {
                // 刚好用完所有字符
                result.push(segments.join('.'));
            }
            return;
        }

        // 剩余段数超过剩余字符数，或剩余字符数超过剩余段数*3
        const remaining = 4 - segments.length;
        const remainingChars = n - start;
        if (remainingChars < remaining || remainingChars > remaining * 3) {
            return;
        }

        // 尝试1-3个字符作为一段
        for (let len = 1; len <= 3 && start + len <= n; len++) {
            const segment = s.substring(start, start + len);
            if (isValidSegment(segment)) {
                segments.push(segment);
                backtrack(start + len, segments);
                segments.pop(); // 回溯
            }
        }
    }

    backtrack(0, []);
    return result;
}

/**
 * 恢复IP地址（迭代优化版本）
 * 核心思想：直接枚举三个分割点的位置
 *
 * @param {string} s - 输入字符串
 * @returns {string[]} 所有可能的IP地址
 * @time O(1) 固定循环次数
 * @space O(1)
 */
function restoreIpAddressesIterative(s) {
    const result = [];
    const n = s.length;

    if (n < 4 || n > 12) return result;

    function isValid(segment) {
        if (segment.length === 0 || segment.length > 3) return false;
        if (segment.length > 1 && segment[0] === '0') return false;
        const num = parseInt(segment);
        return num >= 0 && num <= 255;
    }

    // 枚举三个分割点
    for (let i = 1; i < n && i <= 3; i++) {
        for (let j = i + 1; j < n && j <= i + 3; j++) {
            for (let k = j + 1; k < n && k <= j + 3; k++) {
                const seg1 = s.substring(0, i);
                const seg2 = s.substring(i, j);
                const seg3 = s.substring(j, k);
                const seg4 = s.substring(k);

                if (isValid(seg1) && isValid(seg2) &&
                    isValid(seg3) && isValid(seg4)) {
                    result.push([seg1, seg2, seg3, seg4].join('.'));
                }
            }
        }
    }

    return result;
}

// ================================
// 5. 解数独
// ================================

/**
 * 解数独问题
 * 核心思想：使用回溯算法逐个填入数字，满足行、列、宫格约束
 *
 * @param {string[][]} board - 数独板（'.'表示空格）
 * @returns {boolean} 是否成功解决
 * @time O(9^(81-filled)) filled为已填入的数字数量
 * @space O(81) 递归深度
 */
function solveSudoku(board) {
    /**
     * 检查在指定位置放置数字是否有效
     * 核心思想：检查行、列、3×3宫格约束
     *
     * @param {number} row - 行索引
     * @param {number} col - 列索引
     * @param {string} num - 要放置的数字
     * @returns {boolean} 是否有效
     */
    function isValid(row, col, num) {
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

    /**
     * 回溯求解函数
     * 核心思想：逐个填充空格，回溯无效选择
     *
     * @returns {boolean} 是否找到解
     */
    function solve() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] === '.') {
                    // 尝试数字1-9
                    for (let num = '1'; num <= '9'; num++) {
                        if (isValid(i, j, num)) {
                            // 做选择
                            board[i][j] = num;

                            // 递归求解
                            if (solve()) {
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

    return solve();
}

/**
 * 解数独优化版本（使用启发式）
 * 核心思想：优先填充候选数字最少的格子（MRV启发式）
 *
 * @param {string[][]} board - 数独板
 * @returns {boolean} 是否成功解决
 * @time O(9^(81-filled))，实际性能显著提升
 * @space O(81)
 */
function solveSudokuOptimized(board) {
    /**
     * 获取位置的候选数字
     * 核心思想：计算在该位置可以放置的所有有效数字
     *
     * @param {number} row - 行索引
     * @param {number} col - 列索引
     * @returns {string[]} 候选数字列表
     */
    function getCandidates(row, col) {
        if (board[row][col] !== '.') return [];

        const used = new Set();

        // 记录行中已使用的数字
        for (let j = 0; j < 9; j++) {
            if (board[row][j] !== '.') {
                used.add(board[row][j]);
            }
        }

        // 记录列中已使用的数字
        for (let i = 0; i < 9; i++) {
            if (board[i][col] !== '.') {
                used.add(board[i][col]);
            }
        }

        // 记录3×3宫格中已使用的数字
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        for (let i = boxRow; i < boxRow + 3; i++) {
            for (let j = boxCol; j < boxCol + 3; j++) {
                if (board[i][j] !== '.') {
                    used.add(board[i][j]);
                }
            }
        }

        // 返回未使用的数字
        const candidates = [];
        for (let num = '1'; num <= '9'; num++) {
            if (!used.has(num)) {
                candidates.push(num);
            }
        }

        return candidates;
    }

    /**
     * 找到候选数字最少的空格
     * 核心思想：MRV（最小剩余值）启发式
     *
     * @returns {Object|null} {row, col, candidates} 或 null
     */
    function findBestCell() {
        let bestCell = null;
        let minCandidates = 10;

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] === '.') {
                    const candidates = getCandidates(i, j);
                    if (candidates.length < minCandidates) {
                        minCandidates = candidates.length;
                        bestCell = { row: i, col: j, candidates };

                        // 如果没有候选数字，立即返回
                        if (minCandidates === 0) {
                            return bestCell;
                        }
                    }
                }
            }
        }

        return bestCell;
    }

    function solve() {
        const cell = findBestCell();

        // 没有空格，解决成功
        if (!cell) return true;

        // 没有候选数字，无解
        if (cell.candidates.length === 0) return false;

        // 尝试每个候选数字
        for (let num of cell.candidates) {
            board[cell.row][cell.col] = num;

            if (solve()) {
                return true;
            }

            board[cell.row][cell.col] = '.';
        }

        return false;
    }

    return solve();
}

/**
 * 检查数独是否有唯一解
 * 核心思想：找到两个不同的解来判断是否唯一
 *
 * @param {string[][]} board - 数独板
 * @returns {boolean} 是否有唯一解
 * @time O(9^(81-filled))
 * @space O(81)
 */
function hasUniqueSolution(board) {
    const solutions = [];

    function isValid(row, col, num) {
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

    function solve() {
        // 如果已经找到2个解，停止搜索
        if (solutions.length >= 2) return;

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] === '.') {
                    for (let num = '1'; num <= '9'; num++) {
                        if (isValid(i, j, num)) {
                            board[i][j] = num;
                            solve();
                            board[i][j] = '.';
                        }
                    }
                    return;
                }
            }
        }

        // 找到一个完整解
        solutions.push(board.map(row => [...row]));
    }

    solve();
    return solutions.length === 1;
}

// ================================
// 测试函数
// ================================

/**
 * 测试所有练习题的解答
 */
function testBacktrackExercises() {
    console.log("=== 第15章回溯算法练习题测试 ===\n");

    // 测试1: 单词搜索
    console.log("1. 单词搜索测试:");
    const board1 = [
        ["A","B","C","E"],
        ["S","F","C","S"],
        ["A","D","E","E"]
    ];
    console.log("搜索 'ABCCED':", wordSearch(board1, "ABCCED"));
    console.log("搜索 'SEE':", wordSearch(board1, "SEE"));
    console.log("搜索 'ABCB':", wordSearch(board1, "ABCB"));

    // 测试2: 分割回文串
    console.log("\n2. 分割回文串测试:");
    console.log("'aab' 的分割方案:", palindromePartition("aab"));
    console.log("'aab' 的分割数量:", palindromePartitionCount("aab"));

    // 测试3: 组合总和
    console.log("\n3. 组合总和测试:");
    console.log("candidates=[2,3,6,7], target=7:", combinationSum([2,3,6,7], 7));
    console.log("candidates=[2,3,5], target=8:", combinationSum([2,3,5], 8));

    // 测试4: 恢复IP地址
    console.log("\n4. 恢复IP地址测试:");
    console.log("'25525511135':", restoreIpAddresses("25525511135"));
    console.log("'0000':", restoreIpAddresses("0000"));

    // 测试5: 解数独
    console.log("\n5. 解数独测试:");
    const sudokuBoard = [
        ["5","3",".",".","7",".",".",".","."],
        ["6",".",".","1","9","5",".",".","."],
        [".","9","8",".",".",".",".","6","."],
        ["8",".",".",".","6",".",".",".","3"],
        ["4",".",".","8",".","3",".",".","1"],
        ["7",".",".",".","2",".",".",".","6"],
        [".","6",".",".",".",".","2","8","."],
        [".",".",".","4","1","9",".",".","5"],
        [".",".",".",".","8",".",".","7","9"]
    ];
    console.log("数独求解结果:", solveSudoku(sudokuBoard) ? "成功" : "失败");

    console.log("\n=== 测试完成 ===");
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        wordSearch,
        wordSearchOptimized,
        findWords,
        palindromePartition,
        palindromePartitionCount,
        palindromePartitionCountDP,
        combinationSum,
        combinationSumOptimized,
        combinationSum2,
        combinationSum3,
        restoreIpAddresses,
        restoreIpAddressesIterative,
        solveSudoku,
        solveSudokuOptimized,
        hasUniqueSolution,
        testBacktrackExercises
    };
} else {
    // 浏览器环境下运行测试
    testBacktrackExercises();
}