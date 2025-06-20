/**
 * 第10章：字典树（Trie）- 基础实现
 *
 * 本文件包含字典树的完整实现，主要内容：
 * 1. TrieNode 节点类实现
 * 2. Trie 字典树类实现
 * 3. 基础操作：插入、查找、删除、前缀匹配
 * 4. 高级功能：统计、遍历、序列化
 * 5. 优化版本：压缩Trie、带权重Trie
 * 6. 实际应用：自动补全、单词游戏
 * 7. 完整测试用例和性能分析
 *
 * @author 算法学习教程
 * @date 2024
 */

// ===========================================
// Trie节点类定义
// ===========================================

/**
 * Trie树节点类
 *
 * 核心思想：
 * 每个节点代表一个字符，包含指向子节点的映射和结束标记。
 * 使用对象作为children映射，支持任意字符集。
 */
class TrieNode {
    constructor() {
        this.children = {}; // 子节点映射：字符 -> TrieNode
        this.isEnd = false; // 是否为单词结束节点
        this.count = 0;     // 以此节点结尾的单词数量（用于删除优化）
    }

    /**
     * 检查是否为叶子节点
     * @returns {boolean}
     */
    isLeaf() {
        return Object.keys(this.children).length === 0;
    }

    /**
     * 获取子节点数量
     * @returns {number}
     */
    getChildrenCount() {
        return Object.keys(this.children).length;
    }

    /**
     * 检查是否包含指定字符的子节点
     * @param {string} char 字符
     * @returns {boolean}
     */
    hasChild(char) {
        return char in this.children;
    }

    /**
     * 获取指定字符的子节点
     * @param {string} char 字符
     * @returns {TrieNode|null}
     */
    getChild(char) {
        return this.children[char] || null;
    }

    /**
     * 设置子节点
     * @param {string} char 字符
     * @param {TrieNode} node 子节点
     */
    setChild(char, node) {
        this.children[char] = node;
    }

    /**
     * 删除子节点
     * @param {string} char 字符
     */
    removeChild(char) {
        delete this.children[char];
    }
}

// ===========================================
// 基础Trie类实现
// ===========================================

/**
 * 字典树（Trie）实现类
 *
 * 核心思想：
 * 使用树形结构存储字符串集合，每个节点代表一个字符，
 * 从根节点到任意节点的路径组成一个前缀。
 */
class Trie {
    /**
     * 构造函数
     */
    constructor() {
        this.root = new TrieNode();
        this.size = 0; // 存储的单词数量
    }

    /**
     * 插入单词
     *
     * 核心思想：
     * 从根节点开始，按字符顺序遍历或创建路径，
     * 在最后一个字符对应的节点标记为单词结束。
     *
     * @param {string} word 要插入的单词
     * @time O(m) m为单词长度
     * @space O(m) 最坏情况下需要创建m个新节点
     */
    insert(word) {
        if (!word || typeof word !== 'string') {
            throw new Error('Word must be a non-empty string');
        }

        let node = this.root;

        // 遍历单词的每个字符
        for (const char of word) {
            // 如果子节点不存在，创建新节点
            if (!node.hasChild(char)) {
                node.setChild(char, new TrieNode());
            }
            node = node.getChild(char);
        }

        // 标记单词结束，如果是新单词则增加计数
        if (!node.isEnd) {
            node.isEnd = true;
            this.size++;
        }
        node.count++;
    }

    /**
     * 查找完整单词
     *
     * 核心思想：
     * 从根节点开始按字符遍历路径，最后检查是否标记为单词结束。
     *
     * @param {string} word 要查找的单词
     * @returns {boolean} 是否存在该单词
     * @time O(m) m为单词长度
     * @space O(1) 常数空间
     */
    search(word) {
        if (!word || typeof word !== 'string') {
            return false;
        }

        let node = this.root;

        // 遍历单词的每个字符
        for (const char of word) {
            if (!node.hasChild(char)) {
                return false; // 路径不存在
            }
            node = node.getChild(char);
        }

        // 检查是否为完整单词
        return node.isEnd;
    }

    /**
     * 前缀匹配
     *
     * 核心思想：
     * 只需验证路径是否存在，不需要检查单词结束标记。
     *
     * @param {string} prefix 前缀字符串
     * @returns {boolean} 是否存在该前缀
     * @time O(m) m为前缀长度
     * @space O(1) 常数空间
     */
    startsWith(prefix) {
        if (!prefix || typeof prefix !== 'string') {
            return false;
        }

        let node = this.root;

        // 遍历前缀的每个字符
        for (const char of prefix) {
            if (!node.hasChild(char)) {
                return false;
            }
            node = node.getChild(char);
        }

        return true; // 路径存在即可
    }

    /**
     * 删除单词
     *
     * 核心思想：
     * 使用递归删除，只删除不被其他单词共享的节点。
     * 需要小心处理三种情况：
     * 1. 要删除的单词是其他单词的前缀
     * 2. 其他单词是要删除单词的前缀
     * 3. 要删除的单词与其他单词有公共前缀
     *
     * @param {string} word 要删除的单词
     * @returns {boolean} 是否成功删除
     * @time O(m) m为单词长度
     * @space O(m) 递归栈空间
     */
    delete(word) {
        if (!word || typeof word !== 'string') {
            return false;
        }

        // 递归删除辅助函数
        const deleteHelper = (node, word, index) => {
            // 递归终止条件：到达单词末尾
            if (index === word.length) {
                // 检查单词是否存在
                if (!node.isEnd) {
                    return false;
                }

                // 取消单词结束标记
                node.isEnd = false;
                node.count--;
                this.size--;

                // 如果节点没有子节点，可以删除
                return node.isLeaf();
            }

            const char = word[index];
            const childNode = node.getChild(char);

            // 如果路径不存在，删除失败
            if (!childNode) {
                return false;
            }

            // 递归删除
            const shouldDeleteChild = deleteHelper(childNode, word, index + 1);

            // 如果需要删除子节点
            if (shouldDeleteChild) {
                node.removeChild(char);
                // 当前节点可以删除的条件：不是单词结尾且没有其他子节点
                return !node.isEnd && node.isLeaf();
            }

            return false;
        };

        return deleteHelper(this.root, word, 0);
    }

    /**
     * 获取所有单词
     *
     * 核心思想：
     * 使用深度优先搜索遍历所有路径，收集完整单词。
     *
     * @returns {string[]} 所有存储的单词
     * @time O(ALPHABET_SIZE^m) m为最长单词长度
     * @space O(n) n为单词总数
     */
    getAllWords() {
        const words = [];

        // 深度优先搜索辅助函数
        const dfs = (node, prefix) => {
            // 如果是单词结尾，添加到结果中
            if (node.isEnd) {
                words.push(prefix);
            }

            // 遍历所有子节点
            for (const [char, childNode] of Object.entries(node.children)) {
                dfs(childNode, prefix + char);
            }
        };

        dfs(this.root, '');
        return words;
    }

    /**
     * 获取指定前缀的所有单词
     *
     * 核心思想：
     * 先定位到前缀对应的节点，然后从该节点开始DFS收集所有单词。
     *
     * @param {string} prefix 前缀
     * @returns {string[]} 以该前缀开头的所有单词
     * @time O(prefix + results)
     * @space O(results) 结果存储空间
     */
    getWordsWithPrefix(prefix) {
        if (!prefix || typeof prefix !== 'string') {
            return [];
        }

        // 定位到前缀节点
        let node = this.root;
        for (const char of prefix) {
            if (!node.hasChild(char)) {
                return []; // 前缀不存在
            }
            node = node.getChild(char);
        }

        // 从前缀节点开始收集所有单词
        const words = [];
        const dfs = (node, currentPrefix) => {
            if (node.isEnd) {
                words.push(currentPrefix);
            }

            for (const [char, childNode] of Object.entries(node.children)) {
                dfs(childNode, currentPrefix + char);
            }
        };

        dfs(node, prefix);
        return words;
    }

    /**
     * 统计以指定前缀开头的单词数量
     *
     * @param {string} prefix 前缀
     * @returns {number} 单词数量
     */
    countWordsWithPrefix(prefix) {
        return this.getWordsWithPrefix(prefix).length;
    }

    /**
     * 获取存储的单词总数
     *
     * @returns {number} 单词总数
     */
    getSize() {
        return this.size;
    }

    /**
     * 检查Trie是否为空
     *
     * @returns {boolean} 是否为空
     */
    isEmpty() {
        return this.size === 0;
    }

    /**
     * 清空Trie
     */
    clear() {
        this.root = new TrieNode();
        this.size = 0;
    }

    /**
     * 获取最长公共前缀
     *
     * 核心思想：
     * 从根节点开始，只要所有单词都经过某个路径，就继续延伸前缀。
     *
     * @returns {string} 最长公共前缀
     */
    getLongestCommonPrefix() {
        let prefix = '';
        let node = this.root;

        // 只要只有一个子节点且不是单词结尾，就继续延伸
        while (node.getChildrenCount() === 1 && !node.isEnd) {
            const chars = Object.keys(node.children);
            if (chars.length !== 1) break;

            const char = chars[0];
            prefix += char;
            node = node.getChild(char);
        }

        return prefix;
    }
}

// ===========================================
// 压缩Trie实现（优化空间使用）
// ===========================================

/**
 * 压缩Trie节点
 * 存储字符串片段而不是单个字符
 */
class CompressedTrieNode {
    constructor(key = '') {
        this.key = key;           // 存储的字符串片段
        this.isEnd = false;       // 是否为单词结尾
        this.children = new Map(); // 子节点映射
    }
}

/**
 * 压缩Trie（基数树）实现
 *
 * 核心思想：
 * 将只有一个子节点的路径压缩成一个节点，存储整个字符串片段。
 * 大大减少节点数量，节省空间。
 */
class CompressedTrie {
    constructor() {
        this.root = new CompressedTrieNode();
        this.size = 0;
    }

    /**
     * 插入单词（带路径压缩）
     *
     * @param {string} word 要插入的单词
     */
    insert(word) {
        if (!word) return;

        let node = this.root;
        let i = 0;

        while (i < word.length) {
            const char = word[i];

            if (!node.children.has(char)) {
                // 创建包含剩余字符串的新节点
                const newNode = new CompressedTrieNode(word.slice(i));
                newNode.isEnd = true;
                node.children.set(char, newNode);
                this.size++;
                return;
            }

            const child = node.children.get(char);
            const commonLength = this.getCommonPrefixLength(
                word.slice(i), child.key
            );

            if (commonLength === child.key.length) {
                // 完全匹配，继续向下
                node = child;
                i += commonLength;
            } else {
                // 部分匹配，需要分裂节点
                this.splitNode(child, commonLength, word.slice(i));
                this.size++;
                return;
            }
        }

        if (!node.isEnd) {
            node.isEnd = true;
            this.size++;
        }
    }

    /**
     * 分裂节点
     * 处理部分匹配的情况
     */
    splitNode(node, splitIndex, newSuffix) {
        const oldKey = node.key;
        const oldChildren = node.children;
        const oldIsEnd = node.isEnd;

        // 修改当前节点为公共前缀
        node.key = oldKey.slice(0, splitIndex);
        node.children = new Map();
        node.isEnd = splitIndex === newSuffix.length;

        // 创建原有数据的子节点
        if (splitIndex < oldKey.length) {
            const oldDataNode = new CompressedTrieNode(oldKey.slice(splitIndex));
            oldDataNode.children = oldChildren;
            oldDataNode.isEnd = oldIsEnd;
            node.children.set(oldKey[splitIndex], oldDataNode);
        }

        // 创建新数据的子节点
        if (splitIndex < newSuffix.length) {
            const newDataNode = new CompressedTrieNode(newSuffix.slice(splitIndex));
            newDataNode.isEnd = true;
            node.children.set(newSuffix[splitIndex], newDataNode);
        }
    }

    /**
     * 计算两个字符串的公共前缀长度
     */
    getCommonPrefixLength(str1, str2) {
        let i = 0;
        while (i < str1.length && i < str2.length && str1[i] === str2[i]) {
            i++;
        }
        return i;
    }

    /**
     * 搜索单词
     */
    search(word) {
        let node = this.root;
        let i = 0;

        while (i < word.length) {
            const char = word[i];

            if (!node.children.has(char)) {
                return false;
            }

            const child = node.children.get(char);
            const remaining = word.slice(i);

            if (remaining.startsWith(child.key)) {
                i += child.key.length;
                node = child;
            } else {
                return false;
            }
        }

        return node.isEnd;
    }
}

// ===========================================
// 带权重的Trie（支持频率统计）
// ===========================================

/**
 * 带权重的Trie节点
 */
class WeightedTrieNode extends TrieNode {
    constructor() {
        super();
        this.weight = 0; // 单词权重/频率
    }
}

/**
 * 带权重的Trie
 * 支持单词频率统计和按权重排序
 */
class WeightedTrie extends Trie {
    constructor() {
        super();
        this.root = new WeightedTrieNode();
    }

    /**
     * 插入单词并设置权重
     *
     * @param {string} word 单词
     * @param {number} weight 权重
     */
    insertWithWeight(word, weight = 1) {
        if (!word) return;

        let node = this.root;

        for (const char of word) {
            if (!node.hasChild(char)) {
                node.setChild(char, new WeightedTrieNode());
            }
            node = node.getChild(char);
        }

        if (!node.isEnd) {
            node.isEnd = true;
            this.size++;
        }
        node.weight += weight; // 累加权重
    }

    /**
     * 获取单词权重
     *
     * @param {string} word 单词
     * @returns {number} 权重
     */
    getWeight(word) {
        let node = this.root;

        for (const char of word) {
            if (!node.hasChild(char)) {
                return 0;
            }
            node = node.getChild(char);
        }

        return node.isEnd ? node.weight : 0;
    }

    /**
     * 获取按权重排序的前缀建议
     *
     * @param {string} prefix 前缀
     * @param {number} limit 返回数量限制
     * @returns {Array} 按权重排序的单词列表
     */
    getSuggestionsByWeight(prefix, limit = 10) {
        const words = this.getWordsWithPrefix(prefix);

        // 获取每个单词的权重并排序
        const wordsWithWeight = words.map(word => ({
            word,
            weight: this.getWeight(word)
        }));

        wordsWithWeight.sort((a, b) => b.weight - a.weight);

        return wordsWithWeight.slice(0, limit).map(item => item.word);
    }
}

// ===========================================
// 实际应用：自动补全系统
// ===========================================

/**
 * 自动补全系统
 * 基于Trie实现的智能补全功能
 */
class AutoCompleteSystem {
    constructor() {
        this.trie = new WeightedTrie();
        this.history = new Map(); // 搜索历史
    }

    /**
     * 添加候选词
     *
     * @param {string} word 单词
     * @param {number} frequency 使用频率
     */
    addCandidate(word, frequency = 1) {
        this.trie.insertWithWeight(word.toLowerCase(), frequency);
    }

    /**
     * 批量添加候选词
     *
     * @param {Array} words 单词数组 [{word, frequency}]
     */
    addCandidates(words) {
        words.forEach(item => {
            this.addCandidate(item.word, item.frequency || 1);
        });
    }

    /**
     * 获取自动补全建议
     *
     * @param {string} prefix 输入前缀
     * @param {number} limit 返回数量限制
     * @returns {Array} 补全建议
     */
    getSuggestions(prefix, limit = 5) {
        if (!prefix) return [];

        const normalizedPrefix = prefix.toLowerCase();

        // 更新搜索历史
        const historyCount = this.history.get(normalizedPrefix) || 0;
        this.history.set(normalizedPrefix, historyCount + 1);

        // 获取基于权重的建议
        const suggestions = this.trie.getSuggestionsByWeight(normalizedPrefix, limit);

        // 结合搜索历史进行重新排序
        return this.reorderByHistory(suggestions, normalizedPrefix);
    }

    /**
     * 根据搜索历史重新排序
     */
    reorderByHistory(suggestions, prefix) {
        return suggestions.sort((a, b) => {
            const historyA = this.history.get(a) || 0;
            const historyB = this.history.get(b) || 0;
            const weightA = this.trie.getWeight(a);
            const weightB = this.trie.getWeight(b);

            // 综合考虑历史搜索和原始权重
            const scoreA = weightA + historyA * 0.5;
            const scoreB = weightB + historyB * 0.5;

            return scoreB - scoreA;
        });
    }

    /**
     * 学习用户选择
     *
     * @param {string} selectedWord 用户选择的单词
     */
    learnSelection(selectedWord) {
        // 增加选中单词的权重
        this.trie.insertWithWeight(selectedWord.toLowerCase(), 2);
    }

    /**
     * 获取统计信息
     */
    getStats() {
        return {
            totalWords: this.trie.getSize(),
            searchHistory: this.history.size,
            mostSearched: [...this.history.entries()]
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
        };
    }
}

// ===========================================
// 测试用例和性能分析
// ===========================================

/**
 * 基础功能测试
 */
function testBasicOperations() {
    console.log("=== Trie基础操作测试 ===");

    const trie = new Trie();

    // 测试插入
    const words = ["apple", "app", "apricot", "application", "apply"];
    words.forEach(word => trie.insert(word));

    console.log("1. 插入测试：");
    console.log(`插入单词：${words.join(', ')}`);
    console.log(`总单词数：${trie.getSize()}`);

    // 测试查找
    console.log("\n2. 查找测试：");
    console.log(`search("app")：${trie.search("app")}`);           // true
    console.log(`search("appl")：${trie.search("appl")}`);         // false
    console.log(`search("application")：${trie.search("application")}`); // true

    // 测试前缀匹配
    console.log("\n3. 前缀匹配测试：");
    console.log(`startsWith("app")：${trie.startsWith("app")}`);   // true
    console.log(`startsWith("apr")：${trie.startsWith("apr")}`);   // true
    console.log(`startsWith("xyz")：${trie.startsWith("xyz")}`);   // false

    // 测试前缀单词获取
    console.log("\n4. 前缀单词获取测试：");
    console.log(`getWordsWithPrefix("app")：${JSON.stringify(trie.getWordsWithPrefix("app"))}`);
    console.log(`getWordsWithPrefix("apr")：${JSON.stringify(trie.getWordsWithPrefix("apr"))}`);

    // 测试删除
    console.log("\n5. 删除测试：");
    console.log(`删除前总数：${trie.getSize()}`);
    console.log(`delete("app")：${trie.delete("app")}`);
    console.log(`删除后总数：${trie.getSize()}`);
    console.log(`search("app")：${trie.search("app")}`);           // false
    console.log(`search("apple")：${trie.search("apple")}`);       // true (仍存在)

    console.log("\n");
}

/**
 * 压缩Trie测试
 */
function testCompressedTrie() {
    console.log("=== 压缩Trie测试 ===");

    const compressedTrie = new CompressedTrie();
    const words = ["romane", "romanus", "romulus", "rubens", "rubicon", "rubicundus"];

    words.forEach(word => compressedTrie.insert(word));

    console.log("1. 压缩Trie插入测试：");
    console.log(`插入单词：${words.join(', ')}`);
    console.log(`总单词数：${compressedTrie.size}`);

    console.log("\n2. 压缩Trie查找测试：");
    console.log(`search("romane")：${compressedTrie.search("romane")}`);     // true
    console.log(`search("roman")：${compressedTrie.search("roman")}`);       // false
    console.log(`search("rubicon")：${compressedTrie.search("rubicon")}`);   // true

    console.log("\n");
}

/**
 * 自动补全系统测试
 */
function testAutoComplete() {
    console.log("=== 自动补全系统测试 ===");

    const autoComplete = new AutoCompleteSystem();

    // 添加候选词
    const candidates = [
        {word: "javascript", frequency: 100},
        {word: "java", frequency: 150},
        {word: "python", frequency: 120},
        {word: "php", frequency: 80},
        {word: "pascal", frequency: 30},
        {word: "perl", frequency: 40}
    ];

    autoComplete.addCandidates(candidates);

    console.log("1. 添加候选词完成");
    console.log(`候选词：${candidates.map(c => c.word).join(', ')}`);

    console.log("\n2. 自动补全测试：");
    console.log(`输入"ja"的建议：${JSON.stringify(autoComplete.getSuggestions("ja"))}`);
    console.log(`输入"p"的建议：${JSON.stringify(autoComplete.getSuggestions("p"))}`);

    // 模拟用户选择
    autoComplete.learnSelection("java");
    autoComplete.learnSelection("python");

    console.log("\n3. 学习后的建议：");
    console.log(`输入"ja"的建议：${JSON.stringify(autoComplete.getSuggestions("ja"))}`);
    console.log(`输入"p"的建议：${JSON.stringify(autoComplete.getSuggestions("p"))}`);

    console.log("\n4. 统计信息：");
    console.log(JSON.stringify(autoComplete.getStats(), null, 2));

    console.log("\n");
}

/**
 * 性能测试
 */
function performanceTest() {
    console.log("=== Trie性能测试 ===");

    // 生成测试数据
    const generateWords = (count, maxLength = 10) => {
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

    const testWords = generateWords(10000);
    const trie = new Trie();

    // 插入性能测试
    console.time("插入10000个单词");
    testWords.forEach(word => trie.insert(word));
    console.timeEnd("插入10000个单词");

    // 查找性能测试
    const searchWords = testWords.slice(0, 1000);
    console.time("查找1000个单词");
    searchWords.forEach(word => trie.search(word));
    console.timeEnd("查找1000个单词");

    // 前缀查询性能测试
    const prefixes = testWords.slice(0, 100).map(word => word.slice(0, 3));
    console.time("100次前缀查询");
    prefixes.forEach(prefix => trie.getWordsWithPrefix(prefix));
    console.timeEnd("100次前缀查询");

    console.log(`\n性能统计：`);
    console.log(`- 存储单词数：${trie.getSize()}`);
    console.log(`- 平均查找时间：${(1000 / 1000).toFixed(3)}ms per word`);

    console.log("\n");
}

/**
 * 内存使用分析
 */
function memoryAnalysis() {
    console.log("=== Trie内存使用分析 ===");

    const trie = new Trie();
    const compressedTrie = new CompressedTrie();

    // 测试相同的单词集合
    const words = ["apple", "app", "application", "apply", "apt", "april", "apricot"];

    // 插入到普通Trie
    words.forEach(word => trie.insert(word));

    // 插入到压缩Trie
    words.forEach(word => compressedTrie.insert(word));

    // 计算节点数（简化估算）
    const countNodes = (node) => {
        let count = 1;
        for (const child of Object.values(node.children)) {
            count += countNodes(child);
        }
        return count;
    };

    const trieNodes = countNodes(trie.root);

    console.log("内存使用对比：");
    console.log(`- 测试单词：${words.join(', ')}`);
    console.log(`- 普通Trie节点数：${trieNodes}`);
    console.log(`- 压缩Trie节点数：${compressedTrie.size + 1}`); // 简化计算
    console.log(`- 节省比例：${((trieNodes - compressedTrie.size - 1) / trieNodes * 100).toFixed(1)}%`);

    console.log("\n");
}

/**
 * 运行所有测试
 */
function runAllTests() {
    console.log("第10章：字典树（Trie）- 完整测试\n");

    testBasicOperations();
    testCompressedTrie();
    testAutoComplete();
    performanceTest();
    memoryAnalysis();

    console.log("=== 所有测试完成 ===");
}

// 导出类和函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TrieNode,
        Trie,
        CompressedTrie,
        WeightedTrie,
        AutoCompleteSystem,
        runAllTests
    };
}

// 如果直接运行此文件，执行测试
if (typeof require !== 'undefined' && require.main === module) {
    runAllTests();
}