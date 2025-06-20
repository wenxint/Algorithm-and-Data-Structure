# 第10章：字典树（Trie）

字典树（Trie），也称为前缀树或单词查找树，是一种专门用于高效存储和检索字符串集合的树状数据结构。每个节点代表一个字符，从根节点到任意节点的路径组成一个字符串前缀，而从根节点到叶子节点的路径则代表一个完整的字符串。Trie在处理字符串匹配、自动补全、拼写检查等场景中具有显著的性能优势。

## 基础操作介绍 🔧

### 访问操作

#### 查找字符串
检查字典树中是否存在指定的完整字符串。

```javascript
/**
 * 查找完整字符串
 * 
 * 核心思想：
 * 从根节点开始，按字符顺序遍历路径，最后检查终止标记
 * 
 * @param {string} word - 要查找的字符串
 * @returns {boolean} 是否存在该字符串
 */
function search(word) {
    let node = this.root;
    for (const char of word) {
        if (!node.children[char]) {
            return false; // 路径不存在
        }
        node = node.children[char];
    }
    return node.isEnd; // 检查是否为完整单词
}

// 使用示例
const trie = new Trie();
trie.insert("apple");
console.log(trie.search("apple"));   // true - 完整单词
console.log(trie.search("app"));     // false - 只是前缀
```

#### 前缀匹配
检查字典树中是否存在以指定字符串为前缀的字符串。

```javascript
/**
 * 前缀匹配
 * 
 * 核心思想：
 * 只需要验证路径是否存在，不需要检查终止标记
 * 
 * @param {string} prefix - 前缀字符串
 * @returns {boolean} 是否存在该前缀
 */
function startsWith(prefix) {
    let node = this.root;
    for (const char of prefix) {
        if (!node.children[char]) {
            return false;
        }
        node = node.children[char];
    }
    return true; // 路径存在即可
}

// 使用示例
console.log(trie.startsWith("app"));  // true - 存在以app开头的单词
console.log(trie.startsWith("xyz"));  // false - 不存在该前缀
```

### 修改操作

#### 插入字符串
将新字符串添加到字典树中。

```javascript
/**
 * 插入字符串
 * 
 * 核心思想：
 * 按字符顺序构建路径，如果节点不存在则创建，最后标记终止位置
 * 
 * @param {string} word - 要插入的字符串
 */
function insert(word) {
    let node = this.root;
    for (const char of word) {
        if (!node.children[char]) {
            node.children[char] = new TrieNode(); // 创建新节点
        }
        node = node.children[char];
    }
    node.isEnd = true; // 标记单词结束
}

// 使用示例
trie.insert("application");
trie.insert("apply");
```

#### 删除字符串
从字典树中移除指定的字符串。

```javascript
/**
 * 删除字符串
 * 
 * 核心思想：
 * 使用递归删除，只删除不被其他单词共享的节点
 * 需要考虑三种情况：
 * 1. 删除的单词是其他单词的前缀
 * 2. 其他单词是删除单词的前缀  
 * 3. 删除的单词与其他单词有公共前缀
 * 
 * @param {string} word - 要删除的字符串
 * @returns {boolean} 是否成功删除
 */
function delete(word) {
    const deleteHelper = (node, word, index) => {
        if (index === word.length) {
            if (!node.isEnd) return false; // 单词不存在
            node.isEnd = false;
            return Object.keys(node.children).length === 0; // 是否可以删除节点
        }
        
        const char = word[index];
        const childNode = node.children[char];
        if (!childNode) return false;
        
        const shouldDelete = deleteHelper(childNode, word, index + 1);
        
        if (shouldDelete) {
            delete node.children[char];
            return !node.isEnd && Object.keys(node.children).length === 0;
        }
        
        return false;
    };
    
    return deleteHelper(this.root, word, 0);
}
```

### 统计操作

#### 获取所有单词
获取字典树中存储的所有完整字符串。

```javascript
/**
 * 获取所有单词
 * 
 * 核心思想：
 * 使用深度优先搜索遍历所有路径，收集完整单词
 */
function getAllWords() {
    const words = [];
    
    const dfs = (node, prefix) => {
        if (node.isEnd) {
            words.push(prefix); // 找到完整单词
        }
        
        for (const [char, childNode] of Object.entries(node.children)) {
            dfs(childNode, prefix + char);
        }
    };
    
    dfs(this.root, "");
    return words;
}
```

## 与其他数据结构的关系 💡

### Trie与哈希表的对比

#### 空间效率对比
```javascript
/**
 * 存储效率分析
 * 
 * 假设存储单词集合：["cat", "car", "card", "care", "careful"]
 */

// 哈希表存储
const hashSet = new Set(["cat", "car", "card", "care", "careful"]);
// 空间：每个单词完整存储，总共 3+3+4+4+7 = 21 个字符

// Trie存储 - 公共前缀被合并
class TrieNode {
    constructor() {
        this.children = {};
        this.isEnd = false;
    }
}

// Trie结构（共享前缀）:
//     root
//      |
//      c
//      |
//      a
//     / \
//    t   r
//   (end) |\
//        d e
//       (end) |
//            f
//            |
//            u
//            |
//            l
//            (end)

console.log("哈希表：O(总字符数) 空间");
console.log("Trie：O(不重复字符数) 空间，有前缀压缩优势");
```

#### 查询性能对比
```javascript
/**
 * 前缀查询性能对比
 */

// 哈希表实现前缀查询
function findWordsWithPrefix(words, prefix) {
    return words.filter(word => word.startsWith(prefix));
    // 时间复杂度：O(n * m)，n为单词数，m为平均单词长度
}

// Trie实现前缀查询
function getWordsWithPrefix(prefix) {
    let node = this.root;
    // 1. 定位到前缀节点：O(prefix.length)
    for (const char of prefix) {
        if (!node.children[char]) return [];
        node = node.children[char];
    }
    
    // 2. 从前缀节点开始收集所有单词：O(结果数量)
    const words = [];
    const dfs = (node, currentPrefix) => {
        if (node.isEnd) words.push(currentPrefix);
        for (const [char, child] of Object.entries(node.children)) {
            dfs(child, currentPrefix + char);
        }
    };
    dfs(node, prefix);
    return words;
}

console.log("前缀查询：Trie的O(prefix + results) vs 哈希表的O(n * m)");
```

### Trie与其他树结构的关系

#### 与二叉搜索树的对比
```javascript
/**
 * 字符串存储方式对比
 */

// BST存储字符串（按字典序）
class BSTNode {
    constructor(word) {
        this.word = word;
        this.left = null;
        this.right = null;
    }
}

// BST插入：O(log n * m) 平均情况，m为字符串长度
function insertBST(root, word) {
    if (!root) return new BSTNode(word);
    if (word < root.word) {
        root.left = insertBST(root.left, word);
    } else {
        root.right = insertBST(root.right, word);
    }
    return root;
}

// Trie插入：O(m) 固定时间，m为字符串长度
// Trie的优势：
// 1. 插入和查询时间稳定
// 2. 天然支持前缀操作
// 3. 自动共享公共前缀

console.log("BST：适合字符串的排序和范围查询");
console.log("Trie：适合前缀匹配和自动补全");
```

## 核心算法思想 🎯

### 1. 前缀共享算法

#### 概念定义
前缀共享是Trie的核心思想，通过将具有相同前缀的字符串合并存储在同一路径上，实现空间的高效利用。

#### 实现原理
```javascript
/**
 * 前缀共享的实现机制
 * 
 * 核心思想：
 * 每个节点代表一个字符，从根到该节点的路径表示一个前缀。
 * 具有相同前缀的字符串共享相同的路径前缀部分。
 */

class CompressedTrie {
    constructor() {
        this.root = new TrieNode();
        this.wordCount = 0;
        this.nodeCount = 1; // 根节点
    }
    
    /**
     * 带统计的插入操作
     */
    insert(word) {
        let node = this.root;
        let newNodes = 0;
        
        for (const char of word) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
                newNodes++; // 统计新创建的节点
            }
            node = node.children[char];
        }
        
        if (!node.isEnd) {
            node.isEnd = true;
            this.wordCount++;
        }
        this.nodeCount += newNodes;
    }
    
    /**
     * 计算压缩率
     */
    getCompressionRatio() {
        const totalChars = this.getAllWords()
            .reduce((sum, word) => sum + word.length, 0);
        return (totalChars - this.nodeCount) / totalChars;
    }
}

// 使用示例
const compressedTrie = new CompressedTrie();
["apple", "app", "application", "apply"].forEach(word => {
    compressedTrie.insert(word);
});

console.log(`压缩率: ${compressedTrie.getCompressionRatio().toFixed(2)}`);
```

#### 应用场景
```javascript
/**
 * 自动补全系统
 * 
 * 核心应用：利用前缀共享实现高效的自动补全
 */
class AutoComplete {
    constructor() {
        this.trie = new Trie();
        this.frequency = new Map(); // 单词频率统计
    }
    
    /**
     * 添加单词并记录频率
     */
    addWord(word, freq = 1) {
        this.trie.insert(word);
        this.frequency.set(word, (this.frequency.get(word) || 0) + freq);
    }
    
    /**
     * 获取前缀建议（按频率排序）
     */
    getSuggestions(prefix, limit = 10) {
        const words = this.trie.getWordsWithPrefix(prefix);
        return words
            .map(word => ({
                word,
                frequency: this.frequency.get(word) || 0
            }))
            .sort((a, b) => b.frequency - a.frequency)
            .slice(0, limit)
            .map(item => item.word);
    }
}

// 应用示例
const autoComplete = new AutoComplete();
autoComplete.addWord("javascript", 100);
autoComplete.addWord("java", 150);
autoComplete.addWord("python", 120);

console.log(autoComplete.getSuggestions("ja")); // ["java", "javascript"]
```

### 2. 字符串匹配算法

#### AC自动机（基于Trie的多模式匹配）
```javascript
/**
 * AC自动机实现
 * 
 * 核心思想：
 * 在Trie的基础上构建失败链接，实现多个模式串的并行匹配。
 * 当匹配失败时，通过失败链接跳转到可能匹配的位置。
 */
class ACAutomaton {
    constructor() {
        this.root = new TrieNode();
        this.root.fail = null; // 根节点的失败链接为null
    }
    
    /**
     * 构建失败链接（KMP算法思想的扩展）
     */
    buildFailureLinks() {
        const queue = [];
        
        // 第一层节点的失败链接都指向根节点
        for (const child of Object.values(this.root.children)) {
            child.fail = this.root;
            queue.push(child);
        }
        
        // BFS构建其他层的失败链接
        while (queue.length > 0) {
            const node = queue.shift();
            
            for (const [char, child] of Object.entries(node.children)) {
                queue.push(child);
                
                // 寻找最长的可匹配后缀
                let fail = node.fail;
                while (fail && !fail.children[char]) {
                    fail = fail.fail;
                }
                
                child.fail = fail ? fail.children[char] : this.root;
                
                // 继承输出链接
                if (child.fail.isEnd) {
                    child.output = child.fail;
                }
            }
        }
    }
    
    /**
     * 多模式串匹配
     */
    search(text) {
        const matches = [];
        let node = this.root;
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            
            // 寻找匹配的路径
            while (node && !node.children[char]) {
                node = node.fail;
            }
            
            node = node ? node.children[char] : this.root;
            
            // 检查匹配结果
            let current = node;
            while (current) {
                if (current.isEnd) {
                    matches.push({
                        pattern: current.pattern,
                        position: i - current.pattern.length + 1
                    });
                }
                current = current.output;
            }
        }
        
        return matches;
    }
}
```

### 3. 压缩Trie算法

#### 基数树（Radix Tree）实现
```javascript
/**
 * 压缩Trie（基数树）
 * 
 * 核心思想：
 * 将只有一个子节点的路径压缩成一个节点，存储整个字符串片段，
 * 大大减少节点数量和空间占用。
 */
class RadixTreeNode {
    constructor(key = "") {
        this.key = key;           // 存储字符串片段
        this.isEnd = false;       // 是否为完整单词
        this.children = new Map(); // 子节点映射
    }
}

class RadixTree {
    constructor() {
        this.root = new RadixTreeNode();
    }
    
    /**
     * 插入单词（带路径压缩）
     */
    insert(word) {
        let node = this.root;
        let i = 0;
        
        while (i < word.length) {
            const char = word[i];
            
            if (!node.children.has(char)) {
                // 直接创建包含剩余字符串的节点
                const newNode = new RadixTreeNode(word.slice(i));
                newNode.isEnd = true;
                node.children.set(char, newNode);
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
                return;
            }
        }
        
        node.isEnd = true;
    }
    
    /**
     * 分裂节点（处理部分匹配的情况）
     */
    splitNode(node, splitIndex, newSuffix) {
        const oldKey = node.key;
        const oldChildren = node.children;
        const oldIsEnd = node.isEnd;
        
        // 修改当前节点
        node.key = oldKey.slice(0, splitIndex);
        node.children = new Map();
        node.isEnd = splitIndex === newSuffix.length;
        
        // 创建旧数据节点
        if (splitIndex < oldKey.length) {
            const oldDataNode = new RadixTreeNode(oldKey.slice(splitIndex));
            oldDataNode.children = oldChildren;
            oldDataNode.isEnd = oldIsEnd;
            node.children.set(oldKey[splitIndex], oldDataNode);
        }
        
        // 创建新数据节点
        if (splitIndex < newSuffix.length) {
            const newDataNode = new RadixTreeNode(newSuffix.slice(splitIndex));
            newDataNode.isEnd = true;
            node.children.set(newSuffix[splitIndex], newDataNode);
        }
    }
    
    /**
     * 计算公共前缀长度
     */
    getCommonPrefixLength(str1, str2) {
        let i = 0;
        while (i < str1.length && i < str2.length && str1[i] === str2[i]) {
            i++;
        }
        return i;
    }
}
```

### 4. 模糊匹配算法

#### 编辑距离Trie
```javascript
/**
 * 支持模糊匹配的Trie
 * 
 * 核心思想：
 * 在搜索过程中允许一定数量的编辑操作（插入、删除、替换），
 * 实现容错的字符串匹配。
 */
class FuzzyTrie {
    constructor() {
        this.trie = new Trie();
    }
    
    /**
     * 模糊搜索（允许最多k个编辑距离）
     */
    fuzzySearch(word, maxDistance) {
        const results = [];
        const currentRow = Array.from({length: word.length + 1}, (_, i) => i);
        
        this.searchRecursive(
            this.trie.root, "", word, currentRow, results, maxDistance
        );
        
        return results;
    }
    
    /**
     * 递归搜索（动态规划计算编辑距离）
     */
    searchRecursive(node, prefix, word, previousRow, results, maxDistance) {
        const currentRow = [previousRow[0] + 1];
        
        // 计算当前行的编辑距离
        for (let i = 1; i <= word.length; i++) {
            const insertCost = currentRow[i - 1] + 1;
            const deleteCost = previousRow[i] + 1;
            const replaceCost = previousRow[i - 1] + 
                (word[i - 1] === prefix[prefix.length - 1] ? 0 : 1);
            
            currentRow[i] = Math.min(insertCost, deleteCost, replaceCost);
        }
        
        // 检查是否找到匹配
        if (currentRow[word.length] <= maxDistance && node.isEnd) {
            results.push({
                word: prefix,
                distance: currentRow[word.length]
            });
        }
        
        // 剪枝：如果当前行的最小值已经超过阈值，停止搜索
        if (Math.min(...currentRow) <= maxDistance) {
            for (const [char, childNode] of Object.entries(node.children)) {
                this.searchRecursive(
                    childNode, prefix + char, word, currentRow, results, maxDistance
                );
            }
        }
    }
}

// 使用示例
const fuzzyTrie = new FuzzyTrie();
["hello", "world", "help", "held"].forEach(word => {
    fuzzyTrie.trie.insert(word);
});

const results = fuzzyTrie.fuzzySearch("helo", 1);
console.log(results); // [{word: "hello", distance: 1}, {word: "help", distance: 1}]
```

## 算法思想总结 🎯

| 算法思想 | 时间复杂度 | 空间复杂度 | 适用场景 |
|---------|------------|------------|----------|
| **基础Trie操作** | O(m) | O(ALPHABET_SIZE * N * M) | 精确字符串匹配、前缀查询 |
| **前缀共享** | O(m) | O(共享前缀数) | 字典存储、自动补全 |
| **AC自动机** | O(n + m + z) | O(ALPHABET_SIZE * m) | 多模式串匹配、敏感词过滤 |
| **压缩Trie** | O(m) | O(压缩后节点数) | 大规模字典、内存优化 |
| **模糊匹配** | O(m * n * k) | O(m * n) | 拼写检查、相似字符串查找 |

**参数说明**：
- m: 单个字符串长度
- n: 文本长度  
- N: 字符串数量
- M: 平均字符串长度
- k: 允许的编辑距离
- z: 匹配结果数量

### 设计思想对比

1. **空间换时间**：通过预构建树结构，实现O(m)的查询时间
2. **前缀压缩**：共享公共前缀，减少空间占用
3. **失败转移**：借鉴KMP思想，实现高效的多模式匹配
4. **动态规划**：结合编辑距离算法，支持模糊匹配

### 适用场景总结

- **精确匹配**：字典查询、单词验证
- **前缀查询**：自动补全、搜索建议
- **多模式匹配**：敏感词过滤、病毒特征码检测
- **模糊匹配**：拼写检查、相似度搜索
- **压缩存储**：大规模词典、移动端应用 