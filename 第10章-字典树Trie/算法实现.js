/**
 * 第10章：字典树（Trie）- 算法实现
 *
 * 本文件包含字典树的高级算法实现，主要内容：
 * 1. AC自动机（Aho-Corasick）多模式匹配
 * 2. 模糊搜索和编辑距离算法
 * 3. 单词查找游戏算法
 * 4. 最长公共子串和最短唯一前缀
 * 5. 拼写检查和纠错算法
 * 6. 字符串索引和搜索引擎应用
 * 7. 完整测试用例和性能分析
 *
 * @author 算法学习教程
 * @date 2024
 */

// 导入基础Trie实现
// 在实际使用中需要引入：const { Trie, TrieNode } = require('./基础实现.js');

// ===========================================
// AC自动机（Aho-Corasick）实现
// ===========================================

/**
 * AC自动机节点
 * 扩展基础Trie节点，添加失败指针
 */
class ACNode {
    constructor() {
        this.children = new Map();
        this.fail = null;        // 失败指针
        this.output = [];        // 输出模式串
        this.isPattern = false;  // 是否为模式串结尾
    }
}

/**
 * Aho-Corasick 自动机
 *
 * 核心思想：
 * 在Trie基础上添加失败指针，实现多模式串的并行匹配。
 * 当匹配失败时，利用失败指针快速跳转到最长的可匹配前缀。
 */
class AhoCorasick {
    constructor() {
        this.root = new ACNode();
        this.patterns = [];
    }

    /**
     * 构建模式匹配自动机
     *
     * 核心思想：
     * 1. 构建Trie树
     * 2. 使用BFS构建失败指针
     * 3. 建立输出函数
     *
     * @param {string[]} patterns 模式串数组
     * @time O(∑|Pi|) Pi为第i个模式串
     * @space O(∑|Pi|)
     */
    buildAutomaton(patterns) {
        this.patterns = patterns;

        // 1. 构建Trie树
        this.buildTrie(patterns);

        // 2. 构建失败指针
        this.buildFailurePointers();

        // 3. 构建输出函数
        this.buildOutputFunction();
    }

    /**
     * 构建Trie树
     */
    buildTrie(patterns) {
        for (let i = 0; i < patterns.length; i++) {
            const pattern = patterns[i];
            let node = this.root;

            for (const char of pattern) {
                if (!node.children.has(char)) {
                    node.children.set(char, new ACNode());
                }
                node = node.children.get(char);
            }

            node.isPattern = true;
            node.output.push(i); // 存储模式串索引
        }
    }

    /**
     * 构建失败指针
     *
     * 核心思想：
     * 使用BFS逐层构建失败指针，每个节点的失败指针指向
     * 代表其最长后缀的节点。
     */
    buildFailurePointers() {
        const queue = [];

        // 初始化：根节点的所有子节点的失败指针指向根节点
        for (const [char, child] of this.root.children) {
            child.fail = this.root;
            queue.push(child);
        }

        // BFS构建失败指针
        while (queue.length > 0) {
            const current = queue.shift();

            for (const [char, child] of current.children) {
                queue.push(child);

                // 查找失败指针
                let failNode = current.fail;
                while (failNode !== null && !failNode.children.has(char)) {
                    failNode = failNode.fail;
                }

                if (failNode === null) {
                    child.fail = this.root;
                } else {
                    child.fail = failNode.children.get(char);
                }
            }
        }
    }

    /**
     * 构建输出函数
     *
     * 核心思想：
     * 每个节点的输出不仅包括自己的模式串，
     * 还包括其失败指针路径上所有节点的模式串。
     */
    buildOutputFunction() {
        const queue = [];

        // 将根节点的所有子节点加入队列
        for (const child of this.root.children.values()) {
            queue.push(child);
        }

        while (queue.length > 0) {
            const current = queue.shift();

            // 继承失败指针节点的输出
            if (current.fail && current.fail.output.length > 0) {
                current.output.push(...current.fail.output);
            }

            // 将所有子节点加入队列
            for (const child of current.children.values()) {
                queue.push(child);
            }
        }
    }

    /**
     * 多模式匹配搜索
     *
     * 核心思想：
     * 在文本中一次性查找所有模式串的出现位置，
     * 利用失败指针避免重复匹配。
     *
     * @param {string} text 目标文本
     * @returns {Array} 匹配结果 [{pattern, start, end}]
     * @time O(|T| + ∑|Pi| + z) T为文本，z为匹配数量
     * @space O(∑|Pi|)
     */
    search(text) {
        const results = [];
        let current = this.root;

        for (let i = 0; i < text.length; i++) {
            const char = text[i];

            // 寻找可以匹配当前字符的状态
            while (current !== this.root && !current.children.has(char)) {
                current = current.fail;
            }

            if (current.children.has(char)) {
                current = current.children.get(char);
            }

            // 检查是否有模式串匹配
            for (const patternIndex of current.output) {
                const pattern = this.patterns[patternIndex];
                const start = i - pattern.length + 1;
                results.push({
                    pattern: pattern,
                    patternIndex: patternIndex,
                    start: start,
                    end: i
                });
            }
        }

        return results;
    }

    /**
     * 检查文本是否包含任意模式串
     *
     * @param {string} text 目标文本
     * @returns {boolean} 是否包含模式串
     */
    containsAny(text) {
        let current = this.root;

        for (const char of text) {
            while (current !== this.root && !current.children.has(char)) {
                current = current.fail;
            }

            if (current.children.has(char)) {
                current = current.children.get(char);
            }

            if (current.output.length > 0) {
                return true;
            }
        }

        return false;
    }

    /**
     * 获取匹配统计信息
     *
     * @param {string} text 目标文本
     * @returns {Object} 统计信息
     */
    getMatchStatistics(text) {
        const matches = this.search(text);
        const patternCounts = new Map();

        for (const match of matches) {
            const count = patternCounts.get(match.pattern) || 0;
            patternCounts.set(match.pattern, count + 1);
        }

        return {
            totalMatches: matches.length,
            uniquePatterns: patternCounts.size,
            patternCounts: Object.fromEntries(patternCounts),
            matches: matches
        };
    }
}

// ===========================================
// 模糊搜索和编辑距离算法
// ===========================================

/**
 * 模糊搜索Trie
 *
 * 核心思想：
 * 在Trie基础上实现容错搜索，允许一定数量的编辑操作
 * （插入、删除、替换）来匹配目标字符串。
 */
class FuzzySearchTrie {
    constructor() {
        this.root = new Map();
        this.words = new Set();
    }

    /**
     * 插入单词
     *
     * @param {string} word 单词
     */
    insert(word) {
        this.words.add(word);
        let node = this.root;

        for (const char of word) {
            if (!node.has(char)) {
                node.set(char, new Map());
            }
            node = node.get(char);
        }

        node.set('$', true); // 标记单词结束
    }

    /**
     * 模糊搜索
     *
     * 核心思想：
     * 使用动态规划思想，在Trie遍历过程中维护编辑距离，
     * 剪枝掉超过容错距离的分支。
     *
     * @param {string} target 目标字符串
     * @param {number} maxDistance 最大编辑距离
     * @returns {Array} 匹配的单词及其编辑距离
     * @time O(|target| * |Trie| * maxDistance)
     * @space O(|target| * maxDistance)
     */
    fuzzySearch(target, maxDistance) {
        const results = [];

        // 初始化第一行：从空字符串到target前缀的编辑距离
        const initialRow = Array.from({length: target.length + 1}, (_, i) => i);

        // 从根节点开始递归搜索
        this.searchRecursive(
            this.root,
            '',
            target,
            initialRow,
            maxDistance,
            results
        );

        // 按编辑距离排序
        results.sort((a, b) => a.distance - b.distance);

        return results;
    }

    /**
     * 递归搜索辅助函数
     *
     * @param {Map} node 当前节点
     * @param {string} currentWord 当前构建的单词
     * @param {string} target 目标字符串
     * @param {number[]} previousRow 上一行的编辑距离
     * @param {number} maxDistance 最大编辑距离
     * @param {Array} results 结果数组
     */
    searchRecursive(node, currentWord, target, previousRow, maxDistance, results) {
        // 如果找到单词结束标记
        if (node.has('$')) {
            const distance = previousRow[target.length];
            if (distance <= maxDistance) {
                results.push({
                    word: currentWord,
                    distance: distance
                });
            }
        }

        // 剪枝：如果当前行的最小值已经超过最大距离，停止搜索
        if (Math.min(...previousRow) > maxDistance) {
            return;
        }

        // 遍历所有可能的字符
        for (const [char, childNode] of node) {
            if (char === '$') continue;

            // 计算当前行的编辑距离
            const currentRow = [previousRow[0] + 1]; // 插入操作

            for (let i = 1; i <= target.length; i++) {
                const insertCost = currentRow[i - 1] + 1;  // 插入
                const deleteCost = previousRow[i] + 1;      // 删除
                const replaceCost = previousRow[i - 1] +
                    (char === target[i - 1] ? 0 : 1);      // 替换

                currentRow[i] = Math.min(insertCost, deleteCost, replaceCost);
            }

            // 递归搜索子节点
            this.searchRecursive(
                childNode,
                currentWord + char,
                target,
                currentRow,
                maxDistance,
                results
            );
        }
    }

    /**
     * 拼写建议
     *
     * @param {string} word 可能拼错的单词
     * @param {number} maxSuggestions 最大建议数
     * @returns {Array} 拼写建议
     */
    getSpellingSuggestions(word, maxSuggestions = 5) {
        // 尝试不同的容错距离
        for (let distance = 1; distance <= 3; distance++) {
            const suggestions = this.fuzzySearch(word, distance);
            if (suggestions.length >= maxSuggestions) {
                return suggestions.slice(0, maxSuggestions);
            }
        }

        return this.fuzzySearch(word, 3).slice(0, maxSuggestions);
    }

    /**
     * 自动纠错
     *
     * @param {string} text 包含错误的文本
     * @param {number} threshold 纠错阈值
     * @returns {string} 纠错后的文本
     */
    autoCorrect(text, threshold = 2) {
        const words = text.split(/\s+/);
        const correctedWords = [];

        for (const word of words) {
            // 清理标点符号
            const cleanWord = word.replace(/[^\w]/g, '').toLowerCase();

            if (this.words.has(cleanWord)) {
                correctedWords.push(word); // 单词正确，保持原样
            } else {
                // 查找最佳建议
                const suggestions = this.fuzzySearch(cleanWord, threshold);
                if (suggestions.length > 0) {
                    // 保持原有的大小写和标点
                    const corrected = this.preserveCase(word, suggestions[0].word);
                    correctedWords.push(corrected);
                } else {
                    correctedWords.push(word); // 没有找到建议，保持原样
                }
            }
        }

        return correctedWords.join(' ');
    }

    /**
     * 保持原单词的大小写和标点符号
     */
    preserveCase(original, corrected) {
        let result = corrected;

        // 简单的大小写转换
        if (original[0] === original[0].toUpperCase()) {
            result = result[0].toUpperCase() + result.slice(1);
        }

        // 保留末尾的标点符号
        const lastChar = original[original.length - 1];
        if (!/\w/.test(lastChar)) {
            result += lastChar;
        }

        return result;
    }
}

// ===========================================
// 单词查找游戏算法
// ===========================================

/**
 * 单词搜索游戏
 *
 * 核心思想：
 * 在字符网格中查找所有可能的单词，使用Trie优化搜索过程，
 * 结合回溯算法遍历所有可能的路径。
 */
class WordSearchGame {
    constructor(dictionary) {
        this.trie = this.buildTrie(dictionary);
        this.directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];
    }

    /**
     * 构建字典Trie
     */
    buildTrie(words) {
        const trie = {};
        for (const word of words) {
            let node = trie;
            for (const char of word.toLowerCase()) {
                if (!node[char]) {
                    node[char] = {};
                }
                node = node[char];
            }
            node.isWord = true;
            node.word = word;
        }
        return trie;
    }

    /**
     * 在网格中查找所有单词
     *
     * 核心思想：
     * 从每个位置开始DFS搜索，使用Trie剪枝无效路径。
     *
     * @param {string[][]} board 字符网格
     * @returns {Array} 找到的所有单词
     * @time O(M*N*4^L) M,N为网格大小，L为最长单词长度
     * @space O(L) 递归栈深度
     */
    findWords(board) {
        if (!board || board.length === 0) return [];

        const rows = board.length;
        const cols = board[0].length;
        const results = new Set();

        // 从每个位置开始搜索
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                this.dfs(board, i, j, this.trie, '', results);
            }
        }

        return Array.from(results);
    }

    /**
     * 深度优先搜索
     *
     * @param {string[][]} board 字符网格
     * @param {number} row 当前行
     * @param {number} col 当前列
     * @param {Object} node 当前Trie节点
     * @param {string} path 当前路径
     * @param {Set} results 结果集合
     */
    dfs(board, row, col, node, path, results) {
        // 边界检查
        if (row < 0 || row >= board.length ||
            col < 0 || col >= board[0].length) {
            return;
        }

        const char = board[row][col].toLowerCase();

        // 检查当前字符是否在Trie中
        if (!node[char] || board[row][col] === '#') {
            return;
        }

        // 标记当前位置已访问
        const originalChar = board[row][col];
        board[row][col] = '#';

        const nextNode = node[char];
        const currentPath = path + originalChar;

        // 如果找到一个完整单词
        if (nextNode.isWord) {
            results.add(nextNode.word);
        }

        // 向8个方向继续搜索
        for (const [dx, dy] of this.directions) {
            this.dfs(board, row + dx, col + dy, nextNode, currentPath, results);
        }

        // 回溯：恢复当前位置
        board[row][col] = originalChar;
    }

    /**
     * 查找指定长度的单词
     *
     * @param {string[][]} board 字符网格
     * @param {number} length 单词长度
     * @returns {Array} 指定长度的单词
     */
    findWordsByLength(board, length) {
        const allWords = this.findWords(board);
        return allWords.filter(word => word.length === length);
    }

    /**
     * 获取游戏统计信息
     *
     * @param {string[][]} board 字符网格
     * @returns {Object} 游戏统计
     */
    getGameStats(board) {
        const words = this.findWords(board);
        const lengthDistribution = {};
        let totalScore = 0;

        for (const word of words) {
            const len = word.length;
            lengthDistribution[len] = (lengthDistribution[len] || 0) + 1;

            // 计算分数（长度越长分数越高）
            totalScore += len * len;
        }

        return {
            totalWords: words.length,
            totalScore: totalScore,
            lengthDistribution: lengthDistribution,
            longestWord: words.reduce((a, b) => a.length > b.length ? a : b, ''),
            averageLength: words.length > 0 ?
                words.reduce((sum, word) => sum + word.length, 0) / words.length : 0
        };
    }
}

// ===========================================
// 字符串索引和搜索引擎应用
// ===========================================

/**
 * 倒排索引
 *
 * 核心思想：
 * 使用Trie构建词汇到文档的倒排映射，
 * 支持快速的全文搜索和相关性排序。
 */
class InvertedIndex {
    constructor() {
        this.termTrie = {}; // 词汇Trie
        this.documents = new Map(); // 文档存储
        this.termFrequency = new Map(); // 词频统计
        this.documentFrequency = new Map(); // 文档频率
    }

    /**
     * 添加文档到索引
     *
     * @param {string} docId 文档ID
     * @param {string} content 文档内容
     */
    addDocument(docId, content) {
        this.documents.set(docId, content);

        // 分词和标准化
        const terms = this.tokenize(content);
        const termCount = new Map();

        // 统计词频
        for (const term of terms) {
            termCount.set(term, (termCount.get(term) || 0) + 1);
        }

        // 更新倒排索引
        for (const [term, count] of termCount) {
            this.addTermToIndex(term, docId, count);
        }
    }

    /**
     * 分词处理
     *
     * @param {string} text 文本
     * @returns {string[]} 词汇列表
     */
    tokenize(text) {
        return text.toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 0);
    }

    /**
     * 添加词汇到索引
     *
     * @param {string} term 词汇
     * @param {string} docId 文档ID
     * @param {number} count 词频
     */
    addTermToIndex(term, docId, count) {
        // 更新Trie
        let node = this.termTrie;
        for (const char of term) {
            if (!node[char]) {
                node[char] = {};
            }
            node = node[char];
        }

        if (!node.postings) {
            node.postings = new Map();
        }
        node.postings.set(docId, count);

        // 更新统计信息
        const tfKey = `${term}_${docId}`;
        this.termFrequency.set(tfKey, count);

        const dfCount = this.documentFrequency.get(term) || 0;
        this.documentFrequency.set(term, dfCount + (count > 0 ? 1 : 0));
    }

    /**
     * 搜索文档
     *
     * 核心思想：
     * 使用TF-IDF算法计算文档相关性，
     * 结合词汇的倒排列表快速定位候选文档。
     *
     * @param {string} query 查询字符串
     * @param {number} limit 返回结果数量限制
     * @returns {Array} 搜索结果
     * @time O(|query| + |results|*log|results|)
     * @space O(|results|)
     */
    search(query, limit = 10) {
        const queryTerms = this.tokenize(query);
        const docScores = new Map();
        const totalDocs = this.documents.size;

        for (const term of queryTerms) {
            const postings = this.getTermPostings(term);
            if (!postings) continue;

            const df = this.documentFrequency.get(term) || 1;
            const idf = Math.log(totalDocs / df);

            for (const [docId, tf] of postings) {
                const tfIdf = tf * idf;
                docScores.set(docId, (docScores.get(docId) || 0) + tfIdf);
            }
        }

        // 排序并返回前N个结果
        const results = Array.from(docScores.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([docId, score]) => ({
                docId,
                score,
                content: this.documents.get(docId),
                snippet: this.generateSnippet(this.documents.get(docId), queryTerms)
            }));

        return results;
    }

    /**
     * 获取词汇的倒排列表
     *
     * @param {string} term 词汇
     * @returns {Map|null} 倒排列表
     */
    getTermPostings(term) {
        let node = this.termTrie;
        for (const char of term) {
            if (!node[char]) {
                return null;
            }
            node = node[char];
        }
        return node.postings || null;
    }

    /**
     * 生成搜索结果摘要
     *
     * @param {string} content 文档内容
     * @param {string[]} queryTerms 查询词汇
     * @returns {string} 摘要
     */
    generateSnippet(content, queryTerms, maxLength = 200) {
        const words = content.split(/\s+/);
        let bestStart = 0;
        let maxMatches = 0;

        // 查找包含最多查询词汇的窗口
        for (let i = 0; i <= words.length - 20; i++) {
            const window = words.slice(i, i + 20).join(' ').toLowerCase();
            const matches = queryTerms.filter(term =>
                window.includes(term.toLowerCase())
            ).length;

            if (matches > maxMatches) {
                maxMatches = matches;
                bestStart = i;
            }
        }

        // 生成摘要
        const snippet = words.slice(bestStart, bestStart + 20).join(' ');
        return snippet.length > maxLength ?
            snippet.substring(0, maxLength) + '...' : snippet;
    }

    /**
     * 自动补全查询
     *
     * @param {string} prefix 查询前缀
     * @param {number} limit 返回数量限制
     * @returns {Array} 补全建议
     */
    autocompleteQuery(prefix, limit = 5) {
        const suggestions = [];

        // 在Trie中查找前缀
        let node = this.termTrie;
        for (const char of prefix.toLowerCase()) {
            if (!node[char]) {
                return suggestions;
            }
            node = node[char];
        }

        // DFS收集所有以该前缀开头的词汇
        this.collectTerms(node, prefix.toLowerCase(), suggestions, limit);

        // 按文档频率排序
        suggestions.sort((a, b) => {
            const freqA = this.documentFrequency.get(a) || 0;
            const freqB = this.documentFrequency.get(b) || 0;
            return freqB - freqA;
        });

        return suggestions.slice(0, limit);
    }

    /**
     * 收集词汇（DFS辅助函数）
     */
    collectTerms(node, currentTerm, suggestions, limit) {
        if (suggestions.length >= limit) return;

        if (node.postings) {
            suggestions.push(currentTerm);
        }

        for (const [char, childNode] of Object.entries(node)) {
            if (char !== 'postings') {
                this.collectTerms(childNode, currentTerm + char, suggestions, limit);
            }
        }
    }

    /**
     * 获取索引统计信息
     *
     * @returns {Object} 统计信息
     */
    getIndexStats() {
        const totalTerms = this.documentFrequency.size;
        const totalDocuments = this.documents.size;
        const avgTermsPerDoc = totalDocuments > 0 ?
            this.termFrequency.size / totalDocuments : 0;

        return {
            totalTerms,
            totalDocuments,
            avgTermsPerDoc,
            indexSize: this.estimateIndexSize()
        };
    }

    /**
     * 估算索引大小（简化计算）
     */
    estimateIndexSize() {
        let size = 0;

        // 估算Trie大小
        const countNodes = (node) => {
            let count = 1;
            for (const [key, child] of Object.entries(node)) {
                if (key !== 'postings') {
                    count += countNodes(child);
                }
            }
            return count;
        };

        size += countNodes(this.termTrie);
        size += this.termFrequency.size;
        size += this.documentFrequency.size;

        return size;
    }
}

// ===========================================
// 测试用例和性能分析
// ===========================================

/**
 * AC自动机测试
 */
function testAhoCorasick() {
    console.log("=== AC自动机测试 ===");

    const ac = new AhoCorasick();
    const patterns = ["he", "she", "his", "hers"];
    const text = "ushers";

    console.log("1. 构建自动机：");
    console.log(`模式串：${patterns.join(', ')}`);
    ac.buildAutomaton(patterns);

    console.log("\n2. 多模式匹配：");
    console.log(`文本：${text}`);
    const matches = ac.search(text);
    console.log("匹配结果：");
    matches.forEach(match => {
        console.log(`  "${match.pattern}" 在位置 [${match.start}, ${match.end}]`);
    });

    console.log("\n3. 统计信息：");
    const stats = ac.getMatchStatistics(text);
    console.log(JSON.stringify(stats, null, 2));

    console.log("\n");
}

/**
 * 模糊搜索测试
 */
function testFuzzySearch() {
    console.log("=== 模糊搜索测试 ===");

    const fuzzyTrie = new FuzzySearchTrie();
    const dictionary = ["apple", "application", "apply", "apricot", "banana", "band", "bandana"];

    console.log("1. 构建字典：");
    dictionary.forEach(word => fuzzyTrie.insert(word));
    console.log(`字典单词：${dictionary.join(', ')}`);

    console.log("\n2. 模糊搜索测试：");
    const target = "aple"; // 拼写错误的"apple"
    console.log(`搜索目标："${target}"（最大编辑距离：2）`);

    const results = fuzzyTrie.fuzzySearch(target, 2);
    console.log("搜索结果：");
    results.forEach(result => {
        console.log(`  "${result.word}" (编辑距离：${result.distance})`);
    });

    console.log("\n3. 拼写建议测试：");
    const suggestions = fuzzyTrie.getSpellingSuggestions("aplicaton");
    console.log(`"aplicaton"的拼写建议：${suggestions.map(s => s.word).join(', ')}`);

    console.log("\n4. 自动纠错测试：");
    const errorText = "I like aples and banannas";
    const corrected = fuzzyTrie.autoCorrect(errorText);
    console.log(`原文：${errorText}`);
    console.log(`纠错：${corrected}`);

    console.log("\n");
}

/**
 * 单词游戏测试
 */
function testWordGame() {
    console.log("=== 单词查找游戏测试 ===");

    const dictionary = ["cat", "car", "card", "care", "careful", "cars", "carry", "deer", "dear"];
    const game = new WordSearchGame(dictionary);

    const board = [
        ['c', 'a', 'r'],
        ['a', 'a', 'r'],
        ['t', 'r', 'd']
    ];

    console.log("1. 游戏板：");
    board.forEach(row => console.log(`  ${row.join(' ')}`));

    console.log("\n2. 找到的单词：");
    const words = game.findWords(board);
    console.log(`  ${words.join(', ')}`);

    console.log("\n3. 游戏统计：");
    const stats = game.getGameStats(board);
    console.log(JSON.stringify(stats, null, 2));

    console.log("\n");
}

/**
 * 搜索引擎测试
 */
function testSearchEngine() {
    console.log("=== 搜索引擎测试 ===");

    const index = new InvertedIndex();

    // 添加测试文档
    const documents = [
        {id: "doc1", content: "JavaScript is a programming language"},
        {id: "doc2", content: "Python is also a programming language"},
        {id: "doc3", content: "JavaScript and Python are popular languages"},
        {id: "doc4", content: "Web development uses JavaScript extensively"}
    ];

    console.log("1. 构建索引：");
    documents.forEach(doc => {
        index.addDocument(doc.id, doc.content);
        console.log(`  添加文档：${doc.id}`);
    });

    console.log("\n2. 搜索测试：");
    const query = "JavaScript programming";
    console.log(`查询："${query}"`);

    const results = index.search(query);
    console.log("搜索结果：");
    results.forEach((result, i) => {
        console.log(`  ${i + 1}. ${result.docId} (得分：${result.score.toFixed(3)})`);
        console.log(`     摘要：${result.snippet}`);
    });

    console.log("\n3. 自动补全测试：");
    const prefix = "prog";
    const suggestions = index.autocompleteQuery(prefix);
    console.log(`"${prefix}"的补全建议：${suggestions.join(', ')}`);

    console.log("\n4. 索引统计：");
    const stats = index.getIndexStats();
    console.log(JSON.stringify(stats, null, 2));

    console.log("\n");
}

/**
 * 性能基准测试
 */
function performanceBenchmark() {
    console.log("=== Trie算法性能基准测试 ===");

    // 生成测试数据
    const generateRandomWords = (count, maxLength = 10) => {
        const words = [];
        for (let i = 0; i < count; i++) {
            let word = '';
            const length = Math.floor(Math.random() * maxLength) + 3;
            for (let j = 0; j < length; j++) {
                word += String.fromCharCode(97 + Math.floor(Math.random() * 26));
            }
            words.push(word);
        }
        return words;
    };

    const testWords = generateRandomWords(1000);
    const patterns = testWords.slice(0, 50);
    const text = testWords.join(' ');

    console.log("1. AC自动机性能测试：");
    console.time("AC自动机构建");
    const ac = new AhoCorasick();
    ac.buildAutomaton(patterns);
    console.timeEnd("AC自动机构建");

    console.time("AC自动机搜索");
    ac.search(text);
    console.timeEnd("AC自动机搜索");

    console.log("\n2. 模糊搜索性能测试：");
    const fuzzyTrie = new FuzzySearchTrie();
    console.time("模糊搜索Trie构建");
    testWords.forEach(word => fuzzyTrie.insert(word));
    console.timeEnd("模糊搜索Trie构建");

    console.time("模糊搜索");
    fuzzyTrie.fuzzySearch("test", 2);
    console.timeEnd("模糊搜索");

    console.log("\n3. 倒排索引性能测试：");
    const index = new InvertedIndex();
    console.time("倒排索引构建");
    for (let i = 0; i < 100; i++) {
        index.addDocument(`doc${i}`, testWords.slice(i * 5, (i + 1) * 5).join(' '));
    }
    console.timeEnd("倒排索引构建");

    console.time("搜索查询");
    index.search("test query");
    console.timeEnd("搜索查询");

    console.log("\n=== 性能测试完成 ===");
}

/**
 * 运行所有测试
 */
function runAllTests() {
    console.log("第10章：字典树（Trie）- 算法实现完整测试\n");

    testAhoCorasick();
    testFuzzySearch();
    testWordGame();
    testSearchEngine();
    performanceBenchmark();

    console.log("=== 所有测试完成 ===");
}

// 导出类和函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AhoCorasick,
        FuzzySearchTrie,
        WordSearchGame,
        InvertedIndex,
        runAllTests
    };
}

// 如果直接运行此文件，执行测试
if (typeof require !== 'undefined' && require.main === module) {
    runAllTests();
}