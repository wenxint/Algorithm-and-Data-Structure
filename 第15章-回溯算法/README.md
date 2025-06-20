# 第15章：回溯算法

## 概述 📚

回溯算法是一种通过探索所有可能的候选解来找出所有解的算法。如果候选解被确认不是一个解（或者不是最后一个解），回溯算法会通过在上一步进行一些变化抛弃该解，即回溯并且再次尝试。回溯算法实际上是一个类似枚举的搜索尝试过程，主要是在搜索尝试过程中寻找问题的解，当发现已不满足求解条件时，就"回溯"返回，尝试别的路径。

## 基础回溯操作 🔧

### 回溯算法模板

```javascript
/**
 * 回溯算法通用模板
 * 核心思想：在每一步都尝试所有可能的选择，如果发现不能得到有效解，就回退到上一步
 * 
 * @param {Array} result - 存储所有解的数组
 * @param {Array} currentSolution - 当前正在构建的解
 * @param {Array} candidates - 候选集合
 * @param {Object} state - 当前状态信息
 */
function backtrackTemplate(result, currentSolution, candidates, state) {
    // 终止条件：找到一个完整解
    if (isComplete(currentSolution, state)) {
        result.push([...currentSolution]); // 注意要深拷贝
        return;
    }
    
    // 遍历所有可能的选择
    for (let candidate of getCandidates(candidates, state)) {
        // 做选择
        if (isValid(candidate, currentSolution, state)) {
            currentSolution.push(candidate);
            updateState(state, candidate, true);
            
            // 递归探索
            backtrackTemplate(result, currentSolution, candidates, state);
            
            // 撤销选择（回溯）
            currentSolution.pop();
            updateState(state, candidate, false);
        }
    }
}

// 辅助函数示例
function isComplete(solution, state) {
    // 判断当前解是否完整
    return solution.length === state.targetLength;
}

function getCandidates(candidates, state) {
    // 获取当前状态下的候选集合
    return candidates.filter(c => !state.used.has(c));
}

function isValid(candidate, solution, state) {
    // 判断候选选择是否有效
    return !state.used.has(candidate);
}

function updateState(state, candidate, isAdd) {
    // 更新状态
    if (isAdd) {
        state.used.add(candidate);
    } else {
        state.used.delete(candidate);
    }
}
```

### 全排列生成

```javascript
/**
 * 生成数组的所有排列
 * 核心思想：对于每个位置，尝试放入所有未使用的元素
 * 
 * @param {Array} nums - 输入数组
 * @returns {Array<Array>} 所有排列
 */
function permutations(nums) {
    const result = [];
    const used = new Array(nums.length).fill(false);
    
    function backtrack(current) {
        // 终止条件：排列长度等于原数组长度
        if (current.length === nums.length) {
            result.push([...current]);
            return;
        }
        
        // 尝试每个未使用的数字
        for (let i = 0; i < nums.length; i++) {
            if (!used[i]) {
                // 做选择
                current.push(nums[i]);
                used[i] = true;
                
                // 递归
                backtrack(current);
                
                // 撤销选择
                current.pop();
                used[i] = false;
            }
        }
    }
    
    backtrack([]);
    return result;
}

// 使用示例
console.log(permutations([1, 2, 3]));
// [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
```

### 组合生成

```javascript
/**
 * 生成从n个数字中选择k个的所有组合
 * 核心思想：从当前位置开始，尝试选择每个可能的数字
 * 
 * @param {number} n - 总数字个数
 * @param {number} k - 选择的数字个数
 * @returns {Array<Array>} 所有组合
 */
function combinations(n, k) {
    const result = [];
    
    function backtrack(start, current) {
        // 终止条件：组合长度达到k
        if (current.length === k) {
            result.push([...current]);
            return;
        }
        
        // 从start开始尝试每个数字
        for (let i = start; i <= n; i++) {
            // 做选择
            current.push(i);
            
            // 递归（注意下一轮从i+1开始，避免重复）
            backtrack(i + 1, current);
            
            // 撤销选择
            current.pop();
        }
    }
    
    backtrack(1, []);
    return result;
}

// 使用示例
console.log(combinations(4, 2));
// [[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]
```

### 子集生成

```javascript
/**
 * 生成数组的所有子集
 * 核心思想：对于每个元素，有选择和不选择两种情况
 * 
 * @param {Array} nums - 输入数组
 * @returns {Array<Array>} 所有子集
 */
function subsets(nums) {
    const result = [];
    
    function backtrack(start, current) {
        // 每到达一个状态就是一个有效的子集
        result.push([...current]);
        
        // 从start开始尝试添加每个元素
        for (let i = start; i < nums.length; i++) {
            // 做选择
            current.push(nums[i]);
            
            // 递归
            backtrack(i + 1, current);
            
            // 撤销选择
            current.pop();
        }
    }
    
    backtrack(0, []);
    return result;
}

// 使用示例
console.log(subsets([1, 2, 3]));
// [[],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3]]
```

## 回溯算法与其他算法的关系 💡

### 与深度优先搜索的关系

```javascript
/**
 * 图的深度优先搜索与回溯
 * 核心思想：DFS本质上就是一种回溯，访问完一个节点后需要回到上一级
 */
class GraphDFS {
    constructor(graph) {
        this.graph = graph;
        this.visited = new Set();
        this.path = [];
    }
    
    findAllPaths(start, end) {
        const allPaths = [];
        
        const backtrack = (current) => {
            // 到达终点，记录路径
            if (current === end) {
                allPaths.push([...this.path]);
                return;
            }
            
            // 探索所有邻居
            for (let neighbor of this.graph[current] || []) {
                if (!this.visited.has(neighbor)) {
                    // 做选择
                    this.visited.add(neighbor);
                    this.path.push(neighbor);
                    
                    // 递归
                    backtrack(neighbor);
                    
                    // 撤销选择
                    this.visited.delete(neighbor);
                    this.path.pop();
                }
            }
        };
        
        // 从起点开始
        this.visited.add(start);
        this.path.push(start);
        backtrack(start);
        
        return allPaths;
    }
}

// 使用示例
const graph = {
    'A': ['B', 'C'],
    'B': ['D', 'E'],
    'C': ['F'],
    'D': [],
    'E': ['F'],
    'F': []
};

const dfs = new GraphDFS(graph);
console.log(dfs.findAllPaths('A', 'F'));
// [['A', 'C', 'F'], ['A', 'B', 'E', 'F']]
```

### 与动态规划的关系

```javascript
/**
 * 回溯 vs 动态规划：以爬楼梯问题为例
 * 回溯：枚举所有可能的爬楼梯方式
 * DP：计算爬楼梯的方法数
 */

// 回溯：找出所有爬楼梯的具体方案
function climbStairsBacktrack(n) {
    const result = [];
    
    function backtrack(current, remaining) {
        if (remaining === 0) {
            result.push([...current]);
            return;
        }
        
        // 可以爬1步或2步
        for (let step of [1, 2]) {
            if (step <= remaining) {
                current.push(step);
                backtrack(current, remaining - step);
                current.pop();
            }
        }
    }
    
    backtrack([], n);
    return result;
}

// 动态规划：计算方法数
function climbStairsDP(n) {
    if (n <= 2) return n;
    
    const dp = new Array(n + 1);
    dp[1] = 1;
    dp[2] = 2;
    
    for (let i = 3; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
}

// 示例对比
console.log("回溯找出所有方案:", climbStairsBacktrack(4));
console.log("DP计算方案数:", climbStairsDP(4));
```

### 与贪心算法的关系

```javascript
/**
 * 背包问题：回溯 vs 贪心
 * 回溯：找出最优解
 * 贪心：快速找出近似解
 */

// 0-1背包问题的回溯解法
function knapsackBacktrack(weights, values, capacity) {
    let maxValue = 0;
    let bestSolution = [];
    
    function backtrack(index, currentWeight, currentValue, solution) {
        if (index === weights.length) {
            if (currentValue > maxValue) {
                maxValue = currentValue;
                bestSolution = [...solution];
            }
            return;
        }
        
        // 不选择当前物品
        backtrack(index + 1, currentWeight, currentValue, solution);
        
        // 选择当前物品（如果容量允许）
        if (currentWeight + weights[index] <= capacity) {
            solution.push(index);
            backtrack(index + 1, currentWeight + weights[index], 
                     currentValue + values[index], solution);
            solution.pop();
        }
    }
    
    backtrack(0, 0, 0, []);
    return { maxValue, bestSolution };
}

// 分数背包的贪心解法
function fractionalKnapsackGreedy(weights, values, capacity) {
    const items = weights.map((w, i) => ({
        index: i,
        weight: w,
        value: values[i],
        ratio: values[i] / w
    }));
    
    // 按价值密度排序
    items.sort((a, b) => b.ratio - a.ratio);
    
    let totalValue = 0;
    let remainingCapacity = capacity;
    const solution = [];
    
    for (let item of items) {
        if (item.weight <= remainingCapacity) {
            // 完全装入
            solution.push({ index: item.index, fraction: 1 });
            totalValue += item.value;
            remainingCapacity -= item.weight;
        } else if (remainingCapacity > 0) {
            // 部分装入
            const fraction = remainingCapacity / item.weight;
            solution.push({ index: item.index, fraction });
            totalValue += item.value * fraction;
            break;
        }
    }
    
    return { totalValue, solution };
}
```

## 核心回溯算法思想 🎯

### 1. 排列组合思想

排列组合是回溯算法最基础的应用，通过系统地生成所有可能的排列或组合来解决问题。

**核心概念**：
- 状态空间树的遍历
- 选择与撤销选择的对称性
- 剪枝优化

**解题思想**：
1. 定义状态表示
2. 确定选择列表
3. 实现选择和撤销
4. 添加剪枝条件

**经典应用：N皇后问题**

```javascript
/**
 * N皇后问题
 * 核心思想：在N×N的棋盘上放置N个皇后，使得它们互不攻击
 */
function solveNQueens(n) {
    const result = [];
    const board = Array(n).fill().map(() => Array(n).fill('.'));
    
    function isValid(row, col) {
        // 检查列
        for (let i = 0; i < row; i++) {
            if (board[i][col] === 'Q') return false;
        }
        
        // 检查左上对角线
        for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
            if (board[i][j] === 'Q') return false;
        }
        
        // 检查右上对角线
        for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
            if (board[i][j] === 'Q') return false;
        }
        
        return true;
    }
    
    function backtrack(row) {
        if (row === n) {
            // 找到一个解
            result.push(board.map(r => r.join('')));
            return;
        }
        
        for (let col = 0; col < n; col++) {
            if (isValid(row, col)) {
                // 做选择
                board[row][col] = 'Q';
                
                // 递归
                backtrack(row + 1);
                
                // 撤销选择
                board[row][col] = '.';
            }
        }
    }
    
    backtrack(0);
    return result;
}

// 示例
console.log(solveNQueens(4));
```

### 2. 路径搜索思想

路径搜索思想用于在图或网格中寻找满足特定条件的路径。

**核心概念**：
- 状态转移
- 路径记录
- 访问标记

**解题思想**：
1. 定义起点和终点
2. 标记访问状态
3. 探索所有可能方向
4. 记录有效路径

**经典应用：单词搜索**

```javascript
/**
 * 单词搜索
 * 核心思想：在二维字符网格中搜索单词
 */
function wordSearch(board, word) {
    const rows = board.length;
    const cols = board[0].length;
    const visited = Array(rows).fill().map(() => Array(cols).fill(false));
    
    function backtrack(row, col, index) {
        // 找到完整单词
        if (index === word.length) {
            return true;
        }
        
        // 边界检查
        if (row < 0 || row >= rows || col < 0 || col >= cols || 
            visited[row][col] || board[row][col] !== word[index]) {
            return false;
        }
        
        // 做选择
        visited[row][col] = true;
        
        // 探索四个方向
        const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
        for (let [dr, dc] of directions) {
            if (backtrack(row + dr, col + dc, index + 1)) {
                return true;
            }
        }
        
        // 撤销选择
        visited[row][col] = false;
        return false;
    }
    
    // 从每个位置开始尝试
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (backtrack(i, j, 0)) {
                return true;
            }
        }
    }
    
    return false;
}

// 示例
const board = [
    ['A','B','C','E'],
    ['S','F','C','S'],
    ['A','D','E','E']
];
console.log(wordSearch(board, "ABCCED")); // true
```

### 3. 分割组合思想

分割组合思想用于将一个整体按照某种规则分割成多个部分。

**核心概念**：
- 分割点选择
- 子问题验证
- 组合构建

**解题思想**：
1. 确定分割规则
2. 验证分割有效性
3. 递归处理剩余部分
4. 组合所有有效分割

**经典应用：回文串分割**

```javascript
/**
 * 回文串分割
 * 核心思想：将字符串分割成若干回文子串
 */
function partitionPalindrome(s) {
    const result = [];
    
    function isPalindrome(str, left, right) {
        while (left < right) {
            if (str[left] !== str[right]) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    }
    
    function backtrack(start, current) {
        if (start === s.length) {
            result.push([...current]);
            return;
        }
        
        for (let end = start; end < s.length; end++) {
            if (isPalindrome(s, start, end)) {
                // 做选择
                current.push(s.substring(start, end + 1));
                
                // 递归
                backtrack(end + 1, current);
                
                // 撤销选择
                current.pop();
            }
        }
    }
    
    backtrack(0, []);
    return result;
}

// 示例
console.log(partitionPalindrome("aab"));
// [["a","a","b"],["aa","b"]]
```

### 4. 约束满足思想

约束满足思想用于解决具有多个约束条件的问题。

**核心概念**：
- 约束检查
- 冲突检测
- 启发式优化

**解题思想**：
1. 定义约束条件
2. 实现约束检查
3. 选择合适的搜索策略
4. 添加剪枝优化

**经典应用：数独求解**

```javascript
/**
 * 数独求解器
 * 核心思想：在9×9网格中填入数字，满足行、列、宫格约束
 */
function solveSudoku(board) {
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
                    return false; // 无解
                }
            }
        }
        return true; // 找到解
    }
    
    backtrack();
    return board;
}
```

## 算法思想总结 🎯

| 回溯思想 | 时间复杂度 | 空间复杂度 | 核心设计理念 |
|---------|-----------|-----------|-------------|
| 排列组合思想 | O(n!) | O(n) | 系统枚举所有可能的排列组合 |
| 路径搜索思想 | O(4^n) | O(n) | 在状态空间中搜索满足条件的路径 |
| 分割组合思想 | O(2^n) | O(n) | 将问题分割成子问题并组合解 |
| 约束满足思想 | O(b^d) | O(d) | 在约束条件下搜索可行解 |

**适用总结**：
- 排列组合思想：适用于需要枚举所有可能排列或组合的问题
- 路径搜索思想：适用于图论、网格搜索和路径规划问题  
- 分割组合思想：适用于字符串分割、数组分割等分治问题
- 约束满足思想：适用于数独、N皇后等具有复杂约束的问题 