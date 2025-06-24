/**
 * LeetCode 212: 单词搜索 II (Word Search II)
 *
 * 问题描述：
 * 给定一个 m x n 二维字符网格 board 和一个单词列表 words，返回所有二维网格中的单词。
 * 单词必须按照字母顺序，通过相邻的单元格内的字母构成，其中"相邻"单元格是那些水平相邻或垂直相邻的单元格。
 * 同一个单元格内的字母不允许被重复使用。
 *
 * 核心思想：
 * 结合Trie树（前缀树）和DFS回溯算法：
 * 1. 将所有单词构建成Trie树，优化前缀匹配
 * 2. 对网格中每个位置进行DFS回溯搜索
 * 3. 在搜索过程中利用Trie树进行剪枝优化
 * 4. 使用visited数组避免重复访问同一单元格
 *
 * 示例：
 * 输入：board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]]
 *       words = ["oath","pea","eat","rain"]
 * 输出：["eat","oath"]
 * 解释：
 * o a a n
 * e t a e
 * i h k r
 * i f l v
 * "eat" 路径: e(1,0) -> a(1,2) -> t(1,1)
 * "oath" 路径: o(0,0) -> a(0,1) -> t(1,1) -> h(2,1)
 */

/**
 * Trie树节点类
 */
class TrieNode {
    constructor() {
        this.children = {};     // 子节点映射
        this.isEndOfWord = false;  // 是否为单词结尾
        this.word = null;      // 存储完整单词（优化：避免重复构建）
    }
}

/**
 * Trie树（前缀树）类
 */
class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    /**
     * 插入单词到Trie树
     * @param {string} word - 要插入的单词
     */
    insert(word) {
        let current = this.root;

        for (const char of word) {
            if (!current.children[char]) {
                current.children[char] = new TrieNode();
            }
            current = current.children[char];
        }

        current.isEndOfWord = true;
        current.word = word;  // 存储完整单词
    }

    /**
     * 可视化Trie树结构
     */
    visualize() {
        console.log("\n=== Trie树结构可视化 ===");

        function printNode(node, prefix = '', indent = '') {
            if (node.isEndOfWord) {
                console.log(`${indent}${prefix} [单词: ${node.word}]`);
            } else if (prefix) {
                console.log(`${indent}${prefix}`);
            }

            const children = Object.keys(node.children).sort();
            children.forEach((char, index) => {
                const isLast = index === children.length - 1;
                const nextIndent = indent + (isLast ? '    ' : '│   ');
                const connector = isLast ? '└── ' : '├── ';

                console.log(`${indent}${connector}${char}`);
                printNode(node.children[char], prefix + char, nextIndent);
            });
        }

        console.log("根节点");
        printNode(this.root);
    }
}

/**
 * 方法一：回溯 + Trie树（推荐）
 *
 * 核心思想：
 * 1. 构建Trie树存储所有单词，优化前缀匹配
 * 2. 从网格每个位置开始DFS搜索
 * 3. 搜索过程中使用Trie树进行路径验证和剪枝
 * 4. 找到单词时加入结果集，并标记已找到避免重复
 *
 * @param {character[][]} board - 字符网格
 * @param {string[]} words - 单词列表
 * @return {string[]} 找到的所有单词
 * @time O(M*N*4^L) M*N是网格大小，L是最长单词长度
 * @space O(W*L) W是单词数量，L是平均单词长度
 */
function findWords(board, words) {
    console.log("=== 回溯 + Trie树算法 ===");
    console.log("字符网格:");
    board.forEach((row, i) => console.log(`  行${i}: [${row.join(', ')}]`));
    console.log("目标单词:", words);

    if (!board || board.length === 0 || !words || words.length === 0) {
        console.log("输入无效，返回空数组");
        return [];
    }

    const rows = board.length;
    const cols = board[0].length;
    const result = [];

    // 构建Trie树
    console.log("\n=== 构建Trie树 ===");
    const trie = new Trie();
    for (const word of words) {
        trie.insert(word);
        console.log(`插入单词: ${word}`);
    }

    // 可视化Trie树（仅在单词较少时）
    if (words.length <= 10) {
        trie.visualize();
    }

    // 四个方向：上、右、下、左
    const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
    const dirNames = ['上', '右', '下', '左'];

    /**
     * DFS回溯搜索
     * @param {number} row - 当前行
     * @param {number} col - 当前列
     * @param {TrieNode} trieNode - 当前Trie节点
     * @param {boolean[][]} visited - 访问标记数组
     * @param {string} currentPath - 当前路径（用于调试）
     */
    function dfs(row, col, trieNode, visited, currentPath = '') {
        console.log(`    DFS: 位置(${row}, ${col}), 字符='${board[row][col]}', 路径='${currentPath}'`);

        // 边界检查
        if (row < 0 || row >= rows || col < 0 || col >= cols || visited[row][col]) {
            console.log(`      越界或已访问，返回`);
            return;
        }

        const char = board[row][col];

        // 检查Trie树中是否存在该字符
        if (!trieNode.children[char]) {
            console.log(`      Trie中不存在字符'${char}'，剪枝返回`);
            return;
        }

        // 移动到下一个Trie节点
        const nextTrieNode = trieNode.children[char];
        const newPath = currentPath + char;

        // 检查是否找到单词
        if (nextTrieNode.isEndOfWord && nextTrieNode.word) {
            console.log(`      ✅ 找到单词: ${nextTrieNode.word}`);
            result.push(nextTrieNode.word);
            // 标记为已找到，避免重复添加
            nextTrieNode.isEndOfWord = false;
            nextTrieNode.word = null;
        }

        // 标记当前位置为已访问
        visited[row][col] = true;
        console.log(`      标记(${row}, ${col})为已访问`);

        // 探索四个方向
        for (let i = 0; i < directions.length; i++) {
            const [dr, dc] = directions[i];
            const newRow = row + dr;
            const newCol = col + dc;

            console.log(`      探索${dirNames[i]}方向: (${newRow}, ${newCol})`);
            dfs(newRow, newCol, nextTrieNode, visited, newPath);
        }

        // 回溯：撤销访问标记
        visited[row][col] = false;
        console.log(`      回溯: 取消(${row}, ${col})的访问标记`);
    }

    console.log("\n=== 开始网格搜索 ===");
    // 从每个位置开始搜索
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            console.log(`\n从位置(${i}, ${j})开始搜索，字符='${board[i][j]}'`);
            const visited = Array.from({ length: rows }, () => new Array(cols).fill(false));
            dfs(i, j, trie.root, visited);
        }
    }

    console.log(`\n最终找到的单词: [${result.map(w => `"${w}"`).join(', ')}]`);
    return result;
}

/**
 * 方法二：暴力回溯（对比方法）
 *
 * 核心思想：
 * 对每个单词单独进行网格搜索，不使用Trie树优化
 * 这种方法效率较低，但逻辑简单，用于对比和理解
 *
 * @param {character[][]} board - 字符网格
 * @param {string[]} words - 单词列表
 * @return {string[]} 找到的所有单词
 * @time O(W*M*N*4^L) W是单词数，M*N是网格大小，L是单词长度
 * @space O(L) 递归栈深度
 */
function findWordsBruteForce(board, words) {
    console.log("\n=== 暴力回溯算法 ===");

    if (!board || board.length === 0 || !words || words.length === 0) {
        return [];
    }

    const rows = board.length;
    const cols = board[0].length;
    const result = [];
    const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];

    /**
     * 搜索单个单词
     * @param {string} word - 目标单词
     * @return {boolean} 是否找到单词
     */
    function searchWord(word) {
        console.log(`  搜索单词: ${word}`);

        function dfs(row, col, index, visited) {
            if (index === word.length) {
                console.log(`    找到单词 ${word}`);
                return true;
            }

            if (row < 0 || row >= rows || col < 0 || col >= cols ||
                visited[row][col] || board[row][col] !== word[index]) {
                return false;
            }

            visited[row][col] = true;

            for (const [dr, dc] of directions) {
                if (dfs(row + dr, col + dc, index + 1, visited)) {
                    visited[row][col] = false;
                    return true;
                }
            }

            visited[row][col] = false;
            return false;
        }

        // 从每个位置开始搜索
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (board[i][j] === word[0]) {
                    const visited = Array.from({ length: rows }, () => new Array(cols).fill(false));
                    if (dfs(i, j, 0, visited)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    // 逐个搜索每个单词
    for (const word of words) {
        if (searchWord(word)) {
            result.push(word);
        }
    }

    console.log(`暴力回溯结果: [${result.map(w => `"${w}"`).join(', ')}]`);
    return result;
}

/**
 * 方法三：优化的Trie回溯（进阶优化）
 *
 * 核心思想：
 * 在Trie+回溯基础上添加更多优化：
 * 1. 动态删除Trie节点减少内存占用
 * 2. 字符频率预检查优化
 * 3. 早期剪枝策略
 *
 * @param {character[][]} board - 字符网格
 * @param {string[]} words - 单词列表
 * @return {string[]} 找到的所有单词
 */
function findWordsOptimized(board, words) {
    console.log("\n=== 优化Trie回溯算法 ===");

    if (!board || board.length === 0 || !words || words.length === 0) {
        return [];
    }

    // 字符频率统计优化
    const boardChars = new Set();
    for (const row of board) {
        for (const char of row) {
            boardChars.add(char);
        }
    }

    // 过滤包含网格中不存在字符的单词
    const validWords = words.filter(word => {
        for (const char of word) {
            if (!boardChars.has(char)) {
                console.log(`  过滤单词 ${word}：包含网格中不存在的字符 '${char}'`);
                return false;
            }
        }
        return true;
    });

    console.log(`字符频率优化：${words.length} -> ${validWords.length} 个有效单词`);

    if (validWords.length === 0) {
        return [];
    }

    const rows = board.length;
    const cols = board[0].length;
    const result = [];

    // 构建Trie树
    const trie = new Trie();
    for (const word of validWords) {
        trie.insert(word);
    }

    const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];

    function dfs(row, col, trieNode, visited) {
        if (row < 0 || row >= rows || col < 0 || col >= cols || visited[row][col]) {
            return;
        }

        const char = board[row][col];
        if (!trieNode.children[char]) {
            return;
        }

        const nextTrieNode = trieNode.children[char];

        // 找到单词
        if (nextTrieNode.isEndOfWord && nextTrieNode.word) {
            result.push(nextTrieNode.word);
            console.log(`  找到单词: ${nextTrieNode.word}`);
            nextTrieNode.isEndOfWord = false;
            nextTrieNode.word = null;
        }

        visited[row][col] = true;

        // 探索四个方向
        for (const [dr, dc] of directions) {
            dfs(row + dr, col + dc, nextTrieNode, visited);
        }

        visited[row][col] = false;

        // 动态删除优化：如果节点不再有用，删除它
        if (Object.keys(nextTrieNode.children).length === 0 && !nextTrieNode.isEndOfWord) {
            delete trieNode.children[char];
        }
    }

    // 从每个位置开始搜索
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const visited = Array.from({ length: rows }, () => new Array(cols).fill(false));
            dfs(i, j, trie.root, visited);
        }
    }

    console.log(`优化算法结果: [${result.map(w => `"${w}"`).join(', ')}]`);
    return result;
}

/**
 * 可视化搜索路径
 */
function visualizeSearchPath(board, word) {
    console.log(`\n=== 搜索路径可视化: "${word}" ===`);

    const rows = board.length;
    const cols = board[0].length;
    const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
    const dirNames = ['↑', '→', '↓', '←'];

    function findPath(startRow, startCol) {
        const path = [];

        function dfs(row, col, index, visited, currentPath) {
            if (index === word.length) {
                path.push([...currentPath]);
                return true;
            }

            if (row < 0 || row >= rows || col < 0 || col >= cols ||
                visited[row][col] || board[row][col] !== word[index]) {
                return false;
            }

            visited[row][col] = true;
            currentPath.push([row, col]);

            for (let i = 0; i < directions.length; i++) {
                const [dr, dc] = directions[i];
                if (dfs(row + dr, col + dc, index + 1, visited, currentPath)) {
                    visited[row][col] = false;
                    currentPath.pop();
                    return true;
                }
            }

            visited[row][col] = false;
            currentPath.pop();
            return false;
        }

        if (board[startRow][startCol] === word[0]) {
            const visited = Array.from({ length: rows }, () => new Array(cols).fill(false));
            dfs(startRow, startCol, 0, visited, []);
        }

        return path;
    }

    // 寻找所有可能的路径
    let allPaths = [];
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const paths = findPath(i, j);
            allPaths = allPaths.concat(paths);
        }
    }

    if (allPaths.length > 0) {
        console.log(`找到 ${allPaths.length} 条路径:`);
        allPaths.forEach((path, index) => {
            console.log(`路径 ${index + 1}:`);
            const pathStr = path.map(([r, c], i) => `${word[i]}(${r},${c})`).join(' -> ');
            console.log(`  ${pathStr}`);

            // 可视化路径在网格中的位置
            const grid = Array.from({ length: rows }, () => new Array(cols).fill('.'));
            path.forEach(([r, c], i) => {
                grid[r][c] = `${i + 1}`;
            });

            console.log("  网格中的路径:");
            grid.forEach(row => console.log(`    ${row.join(' ')}`));
        });
    } else {
        console.log("未找到路径");
    }
}

/**
 * 验证不同方法的结果一致性
 */
function validateResults(board, words) {
    console.log("\n=== 结果验证 ===");

    const result1 = findWords(board.map(row => [...row]), [...words]);
    const result2 = findWordsBruteForce(board.map(row => [...row]), [...words]);
    const result3 = findWordsOptimized(board.map(row => [...row]), [...words]);

    // 排序结果以便比较
    const sorted1 = result1.sort();
    const sorted2 = result2.sort();
    const sorted3 = result3.sort();

    console.log(`Trie回溯结果: [${sorted1.map(w => `"${w}"`).join(', ')}]`);
    console.log(`暴力回溯结果: [${sorted2.map(w => `"${w}"`).join(', ')}]`);
    console.log(`优化算法结果: [${sorted3.map(w => `"${w}"`).join(', ')}]`);

    const isConsistent = (
        JSON.stringify(sorted1) === JSON.stringify(sorted2) &&
        JSON.stringify(sorted2) === JSON.stringify(sorted3)
    );

    console.log(`结果一致性: ${isConsistent ? '✅' : '❌'}`);

    return result1;
}

/**
 * 性能测试
 */
function performanceTest() {
    console.log("\n=== 性能测试 ===");

    const testCases = [
        {
            board: [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]],
            words: ["oath","pea","eat","rain"]
        },
        {
            board: [["a","b"],["c","d"]],
            words: ["ab","cb","ad","bd","ac","ca","da","bc","db","adcb","dabc","abb","acb"]
        }
    ];

    testCases.forEach((testCase, index) => {
        console.log(`\n--- 测试用例 ${index + 1} ---`);
        console.log(`网格大小: ${testCase.board.length}x${testCase.board[0].length}`);
        console.log(`单词数量: ${testCase.words.length}`);

        const methods = [
            { name: 'Trie回溯', func: findWords },
            { name: '暴力回溯', func: findWordsBruteForce },
            { name: '优化算法', func: findWordsOptimized }
        ];

        methods.forEach(method => {
            const boardCopy = testCase.board.map(row => [...row]);
            const wordsCopy = [...testCase.words];

            const start = performance.now();
            const result = method.func(boardCopy, wordsCopy);
            const end = performance.now();

            console.log(`${method.name}: ${result.length}个单词, ${(end - start).toFixed(3)}ms`);
        });
    });
}

/**
 * 算法核心概念演示
 */
function demonstrateAlgorithm() {
    console.log("\n=== 算法核心概念演示 ===");

    console.log("\n1. Trie树的优势：");
    console.log("① 前缀匹配：快速判断是否存在以某前缀开头的单词");
    console.log("② 剪枝优化：当前缀不存在时，可以提前终止搜索");
    console.log("③ 空间效率：多个单词共享公共前缀");

    console.log("\n2. 回溯算法要点：");
    console.log("① 状态标记：使用visited数组避免重复访问");
    console.log("② 状态恢复：回溯时恢复visited状态");
    console.log("③ 边界检查：防止数组越界");

    console.log("\n3. 优化策略：");
    console.log("① 字符频率检查：过滤包含不存在字符的单词");
    console.log("② 动态删除：删除不再需要的Trie节点");
    console.log("③ 结果去重：找到单词后立即标记避免重复");

    console.log("\n4. 时间复杂度分析：");
    console.log("Trie构建：O(W*L)，W是单词数，L是平均长度");
    console.log("网格搜索：O(M*N*4^L)，M*N是网格大小，L是最长单词长度");
    console.log("总体：O(W*L + M*N*4^L)");

    console.log("\n5. 空间复杂度分析：");
    console.log("Trie存储：O(W*L)");
    console.log("递归栈：O(L)");
    console.log("访问数组：O(M*N)");

    console.log("\n6. 实际应用场景：");
    console.log("单词游戏、拼字游戏、文本搜索、自动补全等");
}

// 测试运行
function runTests() {
    console.log("🚀 开始测试单词搜索II算法");

    // 基础测试用例
    const testCases = [
        {
            board: [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]],
            words: ["oath","pea","eat","rain"]
        },
        {
            board: [["a","b"],["c","d"]],
            words: ["ab","cb","ad","bd","ac","ca","da","bc","db","adcb","dabc","abb","acb"]
        },
        {
            board: [["a"]],
            words: ["a"]
        }
    ];

    testCases.forEach((testCase, index) => {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`测试用例 ${index + 1}`);
        console.log(`${'='.repeat(60)}`);

        const result = validateResults(testCase.board, testCase.words);

        // 对简单案例进行路径可视化
        if (testCase.board.length <= 4 && result.length > 0) {
            result.forEach(word => {
                if (word.length <= 6) {  // 只可视化较短的单词
                    visualizeSearchPath(testCase.board, word);
                }
            });
        }
    });

    // 运行性能测试
    performanceTest();

    // 演示算法核心概念
    demonstrateAlgorithm();

    console.log("\n🎉 测试完成！");
}

// 如果直接运行此文件，执行测试
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        findWords,
        findWordsBruteForce,
        findWordsOptimized,
        TrieNode,
        Trie,
        visualizeSearchPath,
        runTests
    };
} else if (typeof window === 'undefined') {
    // Node.js环境下直接运行测试
    runTests();
}