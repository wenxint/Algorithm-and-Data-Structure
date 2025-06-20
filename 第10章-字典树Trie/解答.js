/**
 * 第10章：字典树（Trie）- 练习题解答
 *
 * 本文件包含第10章所有练习题的完整解答，每道题都提供了：
 * - 核心思想详解
 * - 多种解法实现
 * - 复杂度分析
 * - 完整测试用例
 *
 * @author AI助手
 * @date 2024
 */

// =====================================================
// 练习1：实现Trie（前缀树）
// =====================================================

/**
 * Trie节点类
 *
 * 核心思想：
 * 使用Map存储子节点，提供灵活的字符映射
 * 使用isEnd标记单词结束位置
 */
class TrieNode {
    constructor() {
        this.children = new Map(); // 子节点映射
        this.isEnd = false;        // 是否为单词结尾
    }
}

/**
 * 实现Trie（前缀树）
 *
 * 核心思想：
 * 1. 树形结构存储字符串，共享公共前缀
 * 2. 每个节点代表一个字符，从根到叶的路径代表一个字符串
 * 3. 通过isEnd标记区分完整单词和前缀
 */
class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    /**
     * 插入单词到Trie中
     *
     * 算法步骤：
     * 1. 从根节点开始遍历
     * 2. 对每个字符，检查是否存在对应子节点
     * 3. 如果不存在则创建新节点
     * 4. 移动到子节点继续处理下一个字符
     * 5. 在最后一个字符节点标记isEnd为true
     *
     * @param {string} word 要插入的单词
     * @time O(m) m为单词长度
     * @space O(m) 最坏情况下需要创建m个新节点
     */
    insert(word) {
        let node = this.root;

        for (const char of word) {
            if (!node.children.has(char)) {
                node.children.set(char, new TrieNode());
            }
            node = node.children.get(char);
        }

        node.isEnd = true; // 标记单词结束
    }

    /**
     * 搜索单词是否存在于Trie中
     *
     * 算法步骤：
     * 1. 从根节点开始遍历字符
     * 2. 如果任一字符对应的子节点不存在，返回false
     * 3. 遍历完所有字符后，检查最终节点的isEnd标记
     *
     * @param {string} word 要搜索的单词
     * @returns {boolean} 单词是否存在
     * @time O(m) m为单词长度
     * @space O(1)
     */
    search(word) {
        let node = this.root;

        for (const char of word) {
            if (!node.children.has(char)) {
                return false; // 路径不存在
            }
            node = node.children.get(char);
        }

        return node.isEnd; // 必须是完整单词
    }

    /**
     * 检查是否存在以给定前缀开头的单词
     *
     * 算法步骤：
     * 1. 从根节点开始遍历前缀字符
     * 2. 如果任一字符对应的子节点不存在，返回false
     * 3. 遍历完所有字符后返回true（不需要检查isEnd）
     *
     * @param {string} prefix 前缀字符串
     * @returns {boolean} 是否存在该前缀
     * @time O(m) m为前缀长度
     * @space O(1)
     */
    startsWith(prefix) {
        let node = this.root;

        for (const char of prefix) {
            if (!node.children.has(char)) {
                return false; // 前缀路径不存在
            }
            node = node.children.get(char);
        }

        return true; // 前缀存在
    }
}

// =====================================================
// 练习2：添加与搜索单词 - 数据结构设计
// =====================================================

/**
 * 支持通配符的单词字典
 *
 * 核心思想：
 * 在基础Trie基础上支持通配符'.'匹配
 * 使用DFS回溯处理通配符的多种可能匹配
 */
class WordDictionary {
    constructor() {
        this.root = new TrieNode();
    }

    /**
     * 添加单词到字典
     * 与基础Trie的insert操作相同
     *
     * @param {string} word 要添加的单词
     * @time O(m) m为单词长度
     * @space O(m) 最坏情况
     */
    addWord(word) {
        let node = this.root;

        for (const char of word) {
            if (!node.children.has(char)) {
                node.children.set(char, new TrieNode());
            }
            node = node.children.get(char);
        }

        node.isEnd = true;
    }

    /**
     * 搜索单词（支持通配符'.'）
     *
     * 核心思想：
     * 1. 遇到普通字符，正常匹配
     * 2. 遇到通配符'.'，尝试所有可能的子节点
     * 3. 使用DFS递归处理所有可能路径
     *
     * @param {string} word 要搜索的单词（可包含'.'）
     * @returns {boolean} 是否找到匹配的单词
     * @time O(m × 26^k) m为单词长度，k为通配符数量
     * @space O(m) 递归栈深度
     */
    search(word) {
        /**
         * DFS辅助函数
         * @param {string} word 剩余的搜索单词
         * @param {number} index 当前字符索引
         * @param {TrieNode} node 当前节点
         * @returns {boolean} 是否找到匹配
         */
        const dfs = (word, index, node) => {
            // 递归终止条件：处理完所有字符
            if (index === word.length) {
                return node.isEnd;
            }

            const char = word[index];

            if (char === '.') {
                // 通配符：尝试所有可能的子节点
                for (const childNode of node.children.values()) {
                    if (dfs(word, index + 1, childNode)) {
                        return true; // 找到匹配路径
                    }
                }
                return false; // 所有路径都不匹配
            } else {
                // 普通字符：检查是否存在对应子节点
                if (!node.children.has(char)) {
                    return false;
                }
                return dfs(word, index + 1, node.children.get(char));
            }
        };

        return dfs(word, 0, this.root);
    }
}

// =====================================================
// 练习3：单词搜索II
// =====================================================

/**
 * 在字符网格中搜索多个单词
 *
 * 核心思想：
 * 1. 使用Trie存储所有目标单词，避免重复前缀搜索
 * 2. 从网格每个位置开始DFS，沿着Trie路径搜索
 * 3. 使用visited数组避免重复访问同一位置
 *
 * @param {character[][]} board 字符网格
 * @param {string[]} words 目标单词列表
 * @returns {string[]} 在网格中找到的单词
 * @time O(M×N×4^L) M、N为网格尺寸，L为最长单词长度
 * @space O(W×L) W为单词数量，L为平均单词长度
 */
function findWords(board, words) {
    // 构建Trie
    const root = new TrieNode();

    // 将所有单词插入Trie
    for (const word of words) {
        let node = root;
        for (const char of word) {
            if (!node.children.has(char)) {
                node.children.set(char, new TrieNode());
            }
            node = node.children.get(char);
        }
        node.isEnd = true;
        node.word = word; // 在结束节点存储完整单词
    }

    const result = new Set(); // 使用Set避免重复
    const rows = board.length;
    const cols = board[0].length;

    // 四个方向：上、下、左、右
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    /**
     * DFS搜索函数
     * @param {number} row 当前行
     * @param {number} col 当前列
     * @param {TrieNode} node 当前Trie节点
     * @param {boolean[][]} visited 访问标记数组
     */
    const dfs = (row, col, node, visited) => {
        // 边界检查和访问检查
        if (row < 0 || row >= rows || col < 0 || col >= cols ||
            visited[row][col]) {
            return;
        }

        const char = board[row][col];

        // 检查Trie中是否存在当前字符
        if (!node.children.has(char)) {
            return;
        }

        node = node.children.get(char);

        // 如果找到完整单词，添加到结果中
        if (node.isEnd) {
            result.add(node.word);
        }

        // 标记当前位置为已访问
        visited[row][col] = true;

        // 向四个方向继续搜索
        for (const [dx, dy] of directions) {
            dfs(row + dx, col + dy, node, visited);
        }

        // 回溯：取消标记
        visited[row][col] = false;
    };

    // 从网格每个位置开始搜索
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const visited = Array(rows).fill().map(() => Array(cols).fill(false));
            dfs(i, j, root, visited);
        }
    }

    return Array.from(result);
}

// =====================================================
// 练习4：自动补全系统
// =====================================================

/**
 * Trie节点（支持频率统计）
 */
class AutoCompleteTrieNode {
    constructor() {
        this.children = new Map();
        this.isEnd = false;
        this.frequency = 0; // 使用频率
        this.sentence = '';  // 完整句子
    }
}

/**
 * 自动补全系统
 *
 * 核心思想：
 * 1. 使用Trie存储所有句子及其频率
 * 2. 根据用户输入前缀，找到所有可能的补全
 * 3. 按频率降序排列，频率相同按字典序排列
 * 4. 返回前3个最热门的建议
 */
class AutocompleteSystem {
    /**
     * @param {string[]} sentences 历史句子
     * @param {number[]} times 对应的使用次数
     */
    constructor(sentences, times) {
        this.root = new AutoCompleteTrieNode();
        this.currentNode = this.root; // 当前输入状态
        this.currentInput = '';       // 当前输入字符串

        // 初始化Trie
        for (let i = 0; i < sentences.length; i++) {
            this.insertSentence(sentences[i], times[i]);
        }
    }

    /**
     * 插入句子到Trie中
     * @param {string} sentence 句子
     * @param {number} frequency 频率
     */
    insertSentence(sentence, frequency) {
        let node = this.root;

        for (const char of sentence) {
            if (!node.children.has(char)) {
                node.children.set(char, new AutoCompleteTrieNode());
            }
            node = node.children.get(char);
        }

        node.isEnd = true;
        node.frequency += frequency;
        node.sentence = sentence;
    }

    /**
     * 获取节点下所有完整句子
     * @param {AutoCompleteTrieNode} node 起始节点
     * @returns {Array} 句子数组，包含频率信息
     */
    getAllSentences(node) {
        const sentences = [];

        const dfs = (node) => {
            if (node.isEnd) {
                sentences.push({
                    sentence: node.sentence,
                    frequency: node.frequency
                });
            }

            for (const child of node.children.values()) {
                dfs(child);
            }
        };

        dfs(node);
        return sentences;
    }

    /**
     * 处理用户输入
     *
     * 算法步骤：
     * 1. 如果输入'#'，保存当前输入并重置状态
     * 2. 否则，更新当前输入状态
     * 3. 从当前节点获取所有可能的补全
     * 4. 按规则排序并返回前3个
     *
     * @param {character} c 输入字符
     * @returns {string[]} 建议列表
     * @time O(N + M log M) N为子树节点数，M为候选句子数
     * @space O(M) 存储候选句子
     */
    input(c) {
        if (c === '#') {
            // 输入结束，保存当前句子
            if (this.currentInput) {
                this.insertSentence(this.currentInput, 1);
            }
            // 重置状态
            this.currentNode = this.root;
            this.currentInput = '';
            return [];
        }

        // 更新当前输入
        this.currentInput += c;

        // 检查当前字符是否存在于Trie中
        if (!this.currentNode.children.has(c)) {
            this.currentNode = null; // 无匹配前缀
            return [];
        }

        // 移动到下一个节点
        this.currentNode = this.currentNode.children.get(c);

        // 获取所有可能的补全
        const candidates = this.getAllSentences(this.currentNode);

        // 排序：频率降序，频率相同按字典序升序
        candidates.sort((a, b) => {
            if (a.frequency !== b.frequency) {
                return b.frequency - a.frequency; // 频率降序
            }
            return a.sentence.localeCompare(b.sentence); // 字典序升序
        });

        // 返回前3个建议
        return candidates.slice(0, 3).map(item => item.sentence);
    }
}

// =====================================================
// 练习5：模糊搜索系统
// =====================================================

/**
 * 模糊搜索系统
 *
 * 核心思想：
 * 1. 在Trie遍历过程中维护编辑距离
 * 2. 使用动态规划思想，记录从查询字符串到当前路径的最小编辑距离
 * 3. 当编辑距离超过阈值时剪枝，避免无效搜索
 */
class FuzzySearchSystem {
    /**
     * @param {string[]} dictionary 字典单词列表
     */
    constructor(dictionary) {
        this.root = new TrieNode();

        // 构建Trie
        for (const word of dictionary) {
            let node = this.root;
            for (const char of word) {
                if (!node.children.has(char)) {
                    node.children.set(char, new TrieNode());
                }
                node = node.children.get(char);
            }
            node.isEnd = true;
            node.word = word;
        }
    }

    /**
     * 模糊搜索
     *
     * 算法步骤：
     * 1. 使用DFS遍历Trie
     * 2. 在每个节点维护编辑距离数组
     * 3. 通过动态规划计算从查询字符串到当前路径的编辑距离
     * 4. 当找到单词且编辑距离≤k时，加入结果
     *
     * @param {string} target 目标字符串
     * @param {number} k 最大编辑距离
     * @returns {string[]} 满足条件的单词列表
     * @time O(|target| × |Trie| × k)
     * @space O(|target|) 动态规划数组空间
     */
    search(target, k) {
        const result = [];
        const targetLen = target.length;

        /**
         * DFS搜索函数
         * @param {TrieNode} node 当前Trie节点
         * @param {string} path 当前路径
         * @param {number[]} prevRow 上一行的编辑距离
         */
        const dfs = (node, path, prevRow) => {
            const currentRow = new Array(targetLen + 1);
            currentRow[0] = path.length; // 插入path.length个字符

            // 计算当前行的编辑距离
            for (let i = 1; i <= targetLen; i++) {
                const insertCost = currentRow[i - 1] + 1;     // 插入
                const deleteCost = prevRow[i] + 1;            // 删除
                const replaceCost = prevRow[i - 1] +
                    (target[i - 1] === path[path.length - 1] ? 0 : 1); // 替换

                currentRow[i] = Math.min(insertCost, deleteCost, replaceCost);
            }

            // 如果是完整单词且编辑距离满足要求
            if (node.isEnd && currentRow[targetLen] <= k) {
                result.push(node.word);
            }

            // 剪枝：如果当前行最小值大于k，停止搜索该分支
            if (Math.min(...currentRow) <= k) {
                // 继续搜索子节点
                for (const [char, childNode] of node.children) {
                    dfs(childNode, path + char, currentRow);
                }
            }
        };

        // 初始化第一行
        const initialRow = Array.from({length: targetLen + 1}, (_, i) => i);

        // 从根节点开始搜索
        for (const [char, childNode] of this.root.children) {
            dfs(childNode, char, initialRow);
        }

        return result;
    }
}

// =====================================================
// 测试函数
// =====================================================

/**
 * 测试所有练习题
 */
function runAllTests() {
    console.log('=== 第10章：字典树（Trie）练习题测试 ===\n');

    // 测试练习1：基础Trie
    console.log('1. 测试基础Trie实现：');
    testBasicTrie();

    // 测试练习2：通配符搜索
    console.log('\n2. 测试通配符搜索：');
    testWildcardSearch();

    // 测试练习3：单词搜索II
    console.log('\n3. 测试单词搜索II：');
    testWordSearchII();

    // 测试练习4：自动补全系统
    console.log('\n4. 测试自动补全系统：');
    testAutoComplete();

    // 测试练习5：模糊搜索系统
    console.log('\n5. 测试模糊搜索系统：');
    testFuzzySearch();
}

function testBasicTrie() {
    const trie = new Trie();

    // 测试插入和搜索
    trie.insert("apple");
    console.log(`search("apple"): ${trie.search("apple")}`);     // true
    console.log(`search("app"): ${trie.search("app")}`);         // false
    console.log(`startsWith("app"): ${trie.startsWith("app")}`); // true

    trie.insert("app");
    console.log(`search("app"): ${trie.search("app")}`);         // true

    // 测试更多单词
    trie.insert("application");
    trie.insert("apply");
    console.log(`startsWith("appl"): ${trie.startsWith("appl")}`); // true
    console.log(`search("application"): ${trie.search("application")}`); // true
}

function testWildcardSearch() {
    const wordDict = new WordDictionary();

    wordDict.addWord("bad");
    wordDict.addWord("dad");
    wordDict.addWord("mad");

    console.log(`search("pad"): ${wordDict.search("pad")}`); // false
    console.log(`search("bad"): ${wordDict.search("bad")}`); // true
    console.log(`search(".ad"): ${wordDict.search(".ad")}`); // true
    console.log(`search("b.."): ${wordDict.search("b..")}`); // true
    console.log(`search("..."): ${wordDict.search("...")}`); // true
    console.log(`search("...."): ${wordDict.search("....")}`); // false
}

function testWordSearchII() {
    const board = [
        ["o","a","a","n"],
        ["e","t","a","e"],
        ["i","h","k","r"],
        ["i","f","l","v"]
    ];
    const words = ["oath","pea","eat","rain"];

    const result = findWords(board, words);
    console.log(`findWords结果: [${result.join(', ')}]`);
    console.log(`预期结果: [eat, oath]`);
}

function testAutoComplete() {
    const sentences = ["i love you", "island","ironman", "i love leetcode"];
    const times = [5,3,2,2];
    const system = new AutocompleteSystem(sentences, times);

    console.log(`input('i'): [${system.input('i').join(', ')}]`);
    console.log(`input(' '): [${system.input(' ').join(', ')}]`);
    console.log(`input('a'): [${system.input('a').join(', ')}]`);
    console.log(`input('#'): [${system.input('#').join(', ')}]`);
}

function testFuzzySearch() {
    const dictionary = ["cat", "car", "card", "care", "careful"];
    const fuzzySearch = new FuzzySearchSystem(dictionary);

    console.log(`search("ca", 1): [${fuzzySearch.search("ca", 1).join(', ')}]`);
    console.log(`search("care", 1): [${fuzzySearch.search("care", 1).join(', ')}]`);
    console.log(`search("cot", 2): [${fuzzySearch.search("cot", 2).join(', ')}]`);
}

/**
 * 性能测试
 */
function performanceTest() {
    console.log('\n=== 性能测试 ===');

    // 测试大量数据的Trie性能
    const trie = new Trie();
    const words = [];

    // 生成测试数据
    for (let i = 0; i < 10000; i++) {
        const word = Math.random().toString(36).substr(2, Math.floor(Math.random() * 10) + 3);
        words.push(word);
    }

    // 插入性能测试
    console.time('插入10000个单词');
    for (const word of words) {
        trie.insert(word);
    }
    console.timeEnd('插入10000个单词');

    // 搜索性能测试
    console.time('搜索10000次');
    for (const word of words) {
        trie.search(word);
    }
    console.timeEnd('搜索10000次');

    // 前缀匹配性能测试
    console.time('前缀匹配1000次');
    for (let i = 0; i < 1000; i++) {
        const prefix = words[i].substr(0, 3);
        trie.startsWith(prefix);
    }
    console.timeEnd('前缀匹配1000次');
}

// =====================================================
// 复杂度分析总结
// =====================================================

/**
 * 时间复杂度对比
 *
 * | 操作 | Trie | Hash表 | 数组 |
 * |------|------|--------|------|
 * | 插入 | O(m) | O(m) | O(n) |
 * | 搜索 | O(m) | O(m) | O(n) |
 * | 前缀匹配 | O(p) | O(n×p) | O(n×p) |
 * | 删除 | O(m) | O(m) | O(n) |
 *
 * 其中：m为单词长度，n为单词数量，p为前缀长度
 *
 * 空间复杂度：
 * - Trie: O(ALPHABET_SIZE × N × M)
 * - Hash表: O(N × M)
 * - 数组: O(N × M)
 *
 * Trie的优势：
 * 1. 前缀操作效率高
 * 2. 内存中共享公共前缀
 * 3. 支持模糊匹配和自动补全
 * 4. 字典序遍历简单
 */

// 运行测试
if (require.main === module) {
    runAllTests();
    performanceTest();
}