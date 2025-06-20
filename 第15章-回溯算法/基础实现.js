/**
 * 第15章：回溯算法 - 基础实现
 *
 * 本文件包含：
 * 1. 回溯算法基础框架
 * 2. 排列与组合生成器
 * 3. 基础回溯问题实现
 * 4. 状态管理和剪枝优化
 */

// ================================
// 1. 回溯算法基础框架
// ================================

/**
 * 回溯算法基础框架类
 * 核心思想：提供统一的回溯算法模板，通过继承或组合方式使用
 */
class BacktrackFramework {
    constructor() {
        this.solutions = [];
        this.currentSolution = [];
        this.states = new Map();
    }

    /**
     * 执行回溯搜索
     * 核心思想：从初始状态开始，递归探索所有可能的解空间
     *
     * @param {Array} candidates - 候选元素集合
     * @param {Object} constraints - 约束条件
     * @returns {Array} 所有有效解
     * @time O(b^d) b为分支因子，d为搜索深度
     * @space O(d) 递归栈深度
     */
    solve(candidates, constraints = {}) {
        this.solutions = [];
        this.currentSolution = [];
        this.initializeStates(candidates, constraints);

        this.backtrack(candidates, constraints);
        return this.solutions;
    }

    /**
     * 回溯核心递归函数
     *
     * @param {Array} candidates - 候选集合
     * @param {Object} constraints - 约束条件
     */
    backtrack(candidates, constraints) {
        // 检查是否找到完整解
        if (this.isComplete(constraints)) {
            this.addSolution();
            return;
        }

        // 获取当前状态下的有效候选
        const validCandidates = this.getValidCandidates(candidates, constraints);

        for (let candidate of validCandidates) {
            // 检查候选是否满足约束
            if (this.isValidChoice(candidate, constraints)) {
                // 做选择
                this.makeChoice(candidate);

                // 递归探索
                this.backtrack(candidates, constraints);

                // 撤销选择（回溯）
                this.undoChoice(candidate);
            }
        }
    }

    /**
     * 初始化状态
     *
     * @param {Array} candidates - 候选集合
     * @param {Object} constraints - 约束条件
     */
    initializeStates(candidates, constraints) {
        this.states.clear();
        this.states.set('used', new Set());
        this.states.set('level', 0);
    }

    /**
     * 判断当前解是否完整
     *
     * @param {Object} constraints - 约束条件
     * @returns {boolean} 是否完整
     */
    isComplete(constraints) {
        return this.currentSolution.length === (constraints.targetLength || 0);
    }

    /**
     * 获取有效候选
     *
     * @param {Array} candidates - 候选集合
     * @param {Object} constraints - 约束条件
     * @returns {Array} 有效候选
     */
    getValidCandidates(candidates, constraints) {
        const used = this.states.get('used');
        return candidates.filter(c => !used.has(c));
    }

    /**
     * 验证选择的有效性
     *
     * @param {*} candidate - 候选选择
     * @param {Object} constraints - 约束条件
     * @returns {boolean} 是否有效
     */
    isValidChoice(candidate, constraints) {
        return true; // 默认实现，子类可重写
    }

    /**
     * 做出选择
     *
     * @param {*} candidate - 候选选择
     */
    makeChoice(candidate) {
        this.currentSolution.push(candidate);
        this.states.get('used').add(candidate);
        this.states.set('level', this.states.get('level') + 1);
    }

    /**
     * 撤销选择
     *
     * @param {*} candidate - 候选选择
     */
    undoChoice(candidate) {
        this.currentSolution.pop();
        this.states.get('used').delete(candidate);
        this.states.set('level', this.states.get('level') - 1);
    }

    /**
     * 添加解到结果集
     */
    addSolution() {
        this.solutions.push([...this.currentSolution]);
    }
}

// ================================
// 2. 排列与组合生成器
// ================================

/**
 * 排列生成器
 * 核心思想：生成给定数组的所有排列
 */
class PermutationGenerator {
    /**
     * 生成全排列
     * 核心思想：对每个位置，尝试放入所有未使用的元素
     *
     * @param {Array} nums - 输入数组
     * @returns {Array<Array>} 所有排列
     * @time O(n! * n)
     * @space O(n)
     */
    static generate(nums) {
        const result = [];
        const used = new Array(nums.length).fill(false);

        function backtrack(current) {
            // 排列完成
            if (current.length === nums.length) {
                result.push([...current]);
                return;
            }

            // 尝试每个未使用的元素
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

    /**
     * 生成有重复元素的排列
     * 核心思想：通过排序和跳过重复元素来避免重复排列
     *
     * @param {Array} nums - 输入数组（可能有重复）
     * @returns {Array<Array>} 无重复的所有排列
     * @time O(n! * n)
     * @space O(n)
     */
    static generateUnique(nums) {
        const result = [];
        const used = new Array(nums.length).fill(false);

        // 排序以便处理重复元素
        nums.sort((a, b) => a - b);

        function backtrack(current) {
            if (current.length === nums.length) {
                result.push([...current]);
                return;
            }

            for (let i = 0; i < nums.length; i++) {
                // 跳过已使用的元素
                if (used[i]) continue;

                // 跳过重复元素：如果当前元素和前一个元素相同，
                // 且前一个元素未被使用，则跳过当前元素
                if (i > 0 && nums[i] === nums[i - 1] && !used[i - 1]) {
                    continue;
                }

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

        backtrack([]);
        return result;
    }

    /**
     * 生成下一个排列
     * 核心思想：找到字典序的下一个排列
     *
     * @param {Array} nums - 当前排列（会被修改）
     * @returns {boolean} 是否存在下一个排列
     * @time O(n)
     * @space O(1)
     */
    static nextPermutation(nums) {
        let i = nums.length - 2;

        // 从右向左找到第一个升序位置
        while (i >= 0 && nums[i] >= nums[i + 1]) {
            i--;
        }

        if (i >= 0) {
            // 从右向左找到第一个大于nums[i]的元素
            let j = nums.length - 1;
            while (j >= 0 && nums[j] <= nums[i]) {
                j--;
            }

            // 交换
            [nums[i], nums[j]] = [nums[j], nums[i]];
        }

        // 反转i+1后面的所有元素
        let left = i + 1;
        let right = nums.length - 1;
        while (left < right) {
            [nums[left], nums[right]] = [nums[right], nums[left]];
            left++;
            right--;
        }

        return i >= 0;
    }
}

/**
 * 组合生成器
 * 核心思想：生成从n个元素中选择k个元素的所有组合
 */
class CombinationGenerator {
    /**
     * 生成组合
     * 核心思想：从当前位置开始，尝试选择每个可能的元素
     *
     * @param {Array} nums - 候选数组
     * @param {number} k - 选择个数
     * @returns {Array<Array>} 所有组合
     * @time O(C(n,k) * k)
     * @space O(k)
     */
    static generate(nums, k) {
        const result = [];

        function backtrack(start, current) {
            // 组合完成
            if (current.length === k) {
                result.push([...current]);
                return;
            }

            // 从start位置开始选择
            for (let i = start; i < nums.length; i++) {
                // 剪枝：如果剩余元素不够组成目标长度，提前退出
                if (nums.length - i < k - current.length) {
                    break;
                }

                // 做选择
                current.push(nums[i]);

                // 递归（下一次从i+1开始，避免重复）
                backtrack(i + 1, current);

                // 撤销选择
                current.pop();
            }
        }

        backtrack(0, []);
        return result;
    }

    /**
     * 生成有重复元素的组合
     * 核心思想：处理重复元素，避免重复组合
     *
     * @param {Array} nums - 候选数组（可能有重复）
     * @param {number} k - 选择个数
     * @returns {Array<Array>} 无重复的所有组合
     * @time O(2^n)
     * @space O(k)
     */
    static generateUnique(nums, k) {
        const result = [];

        // 排序以便处理重复元素
        nums.sort((a, b) => a - b);

        function backtrack(start, current) {
            if (current.length === k) {
                result.push([...current]);
                return;
            }

            for (let i = start; i < nums.length; i++) {
                // 跳过重复元素
                if (i > start && nums[i] === nums[i - 1]) {
                    continue;
                }

                // 剪枝
                if (nums.length - i < k - current.length) {
                    break;
                }

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

    /**
     * 生成组合总和
     * 核心思想：找到所有和为目标值的组合（元素可重复使用）
     *
     * @param {Array} candidates - 候选数组
     * @param {number} target - 目标和
     * @returns {Array<Array>} 所有组合
     * @time O(n^(target/min))
     * @space O(target/min)
     */
    static combinationSum(candidates, target) {
        const result = [];
        candidates.sort((a, b) => a - b); // 排序以便剪枝

        function backtrack(start, current, sum) {
            if (sum === target) {
                result.push([...current]);
                return;
            }

            if (sum > target) {
                return; // 剪枝：和超过目标值
            }

            for (let i = start; i < candidates.length; i++) {
                // 剪枝：如果当前数字已经大于目标值，后面的更大的数字也不用考虑
                if (candidates[i] > target - sum) {
                    break;
                }

                // 做选择
                current.push(candidates[i]);

                // 递归（注意：可以重复使用同一个数字，所以下次从i开始）
                backtrack(i, current, sum + candidates[i]);

                // 撤销选择
                current.pop();
            }
        }

        backtrack(0, [], 0);
        return result;
    }
}

/**
 * 子集生成器
 * 核心思想：生成给定数组的所有子集（幂集）
 */
class SubsetGenerator {
    /**
     * 生成所有子集
     * 核心思想：对每个元素，有选择和不选择两种情况
     *
     * @param {Array} nums - 输入数组
     * @returns {Array<Array>} 所有子集
     * @time O(2^n * n)
     * @space O(n)
     */
    static generate(nums) {
        const result = [];

        function backtrack(start, current) {
            // 每个状态都是一个有效的子集
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

    /**
     * 生成有重复元素的子集
     * 核心思想：处理重复元素，避免重复子集
     *
     * @param {Array} nums - 输入数组（可能有重复）
     * @returns {Array<Array>} 无重复的所有子集
     * @time O(2^n * n)
     * @space O(n)
     */
    static generateUnique(nums) {
        const result = [];

        // 排序以便处理重复元素
        nums.sort((a, b) => a - b);

        function backtrack(start, current) {
            result.push([...current]);

            for (let i = start; i < nums.length; i++) {
                // 跳过重复元素
                if (i > start && nums[i] === nums[i - 1]) {
                    continue;
                }

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

    /**
     * 使用位操作生成子集
     * 核心思想：用二进制位表示每个元素是否被选择
     *
     * @param {Array} nums - 输入数组
     * @returns {Array<Array>} 所有子集
     * @time O(2^n * n)
     * @space O(1) 不考虑结果空间
     */
    static generateWithBits(nums) {
        const result = [];
        const n = nums.length;

        // 遍历所有可能的二进制组合
        for (let mask = 0; mask < (1 << n); mask++) {
            const subset = [];

            // 检查每一位
            for (let i = 0; i < n; i++) {
                if (mask & (1 << i)) {
                    subset.push(nums[i]);
                }
            }

            result.push(subset);
        }

        return result;
    }
}

// ================================
// 3. 基础回溯问题实现
// ================================

/**
 * 电话号码的字母组合
 * 核心思想：对每个数字，尝试其对应的所有字母
 */
class PhoneNumberCombinations {
    constructor() {
        this.digitToLetters = {
            '2': 'abc',
            '3': 'def',
            '4': 'ghi',
            '5': 'jkl',
            '6': 'mno',
            '7': 'pqrs',
            '8': 'tuv',
            '9': 'wxyz'
        };
    }

    /**
     * 生成电话号码的字母组合
     *
     * @param {string} digits - 数字字符串
     * @returns {Array<string>} 所有字母组合
     * @time O(3^m * 4^n) m为对应3个字母的数字个数，n为对应4个字母的数字个数
     * @space O(3^m * 4^n)
     */
    letterCombinations(digits) {
        if (!digits) return [];

        const result = [];

        const backtrack = (index, current) => {
            // 组合完成
            if (index === digits.length) {
                result.push(current);
                return;
            }

            // 获取当前数字对应的字母
            const letters = this.digitToLetters[digits[index]];

            // 尝试每个字母
            for (let letter of letters) {
                backtrack(index + 1, current + letter);
            }
        };

        backtrack(0, '');
        return result;
    }
}

/**
 * 括号生成
 * 核心思想：在每个位置选择放置左括号或右括号，保持括号的有效性
 */
class ParenthesesGenerator {
    /**
     * 生成所有有效的括号组合
     *
     * @param {number} n - 括号对数
     * @returns {Array<string>} 所有有效括号组合
     * @time O(4^n / √n) 卡特兰数
     * @space O(4^n / √n)
     */
    static generate(n) {
        const result = [];

        function backtrack(current, left, right) {
            // 括号用完，检查是否有效
            if (left === n && right === n) {
                result.push(current);
                return;
            }

            // 可以添加左括号
            if (left < n) {
                backtrack(current + '(', left + 1, right);
            }

            // 可以添加右括号（右括号数量不能超过左括号）
            if (right < left) {
                backtrack(current + ')', left, right + 1);
            }
        }

        backtrack('', 0, 0);
        return result;
    }
}

/**
 * 单词拆分（是否可以拆分）
 * 核心思想：尝试每个可能的拆分点，检查前缀是否在字典中
 */
class WordBreak {
    /**
     * 检查单词是否可以拆分（回溯解法）
     *
     * @param {string} s - 目标字符串
     * @param {Array<string>} wordDict - 单词字典
     * @returns {boolean} 是否可以拆分
     * @time O(2^n) 最坏情况
     * @space O(n) 递归深度
     */
    static canBreak(s, wordDict) {
        const wordSet = new Set(wordDict);
        const memo = new Map();

        function backtrack(start) {
            // 已经处理完整个字符串
            if (start === s.length) {
                return true;
            }

            // 记忆化：避免重复计算
            if (memo.has(start)) {
                return memo.get(start);
            }

            // 尝试每个可能的结束位置
            for (let end = start + 1; end <= s.length; end++) {
                const word = s.substring(start, end);

                if (wordSet.has(word) && backtrack(end)) {
                    memo.set(start, true);
                    return true;
                }
            }

            memo.set(start, false);
            return false;
        }

        return backtrack(0);
    }

    /**
     * 返回所有可能的拆分方案
     *
     * @param {string} s - 目标字符串
     * @param {Array<string>} wordDict - 单词字典
     * @returns {Array<string>} 所有拆分方案
     * @time O(2^n * n)
     * @space O(2^n * n)
     */
    static allBreaks(s, wordDict) {
        const wordSet = new Set(wordDict);
        const result = [];

        function backtrack(start, current) {
            if (start === s.length) {
                result.push(current.join(' '));
                return;
            }

            for (let end = start + 1; end <= s.length; end++) {
                const word = s.substring(start, end);

                if (wordSet.has(word)) {
                    current.push(word);
                    backtrack(end, current);
                    current.pop();
                }
            }
        }

        backtrack(0, []);
        return result;
    }
}

// ================================
// 4. 状态管理和剪枝优化
// ================================

/**
 * 状态管理器
 * 核心思想：统一管理回溯过程中的状态变化
 */
class StateManager {
    constructor() {
        this.states = new Map();
        this.history = [];
    }

    /**
     * 设置状态
     *
     * @param {string} key - 状态键
     * @param {*} value - 状态值
     */
    setState(key, value) {
        const oldValue = this.states.get(key);
        this.states.set(key, value);

        // 记录历史以便回溯
        this.history.push({ key, oldValue, newValue: value });
    }

    /**
     * 获取状态
     *
     * @param {string} key - 状态键
     * @returns {*} 状态值
     */
    getState(key) {
        return this.states.get(key);
    }

    /**
     * 回溯一步
     */
    rollback() {
        if (this.history.length === 0) return;

        const lastChange = this.history.pop();
        if (lastChange.oldValue === undefined) {
            this.states.delete(lastChange.key);
        } else {
            this.states.set(lastChange.key, lastChange.oldValue);
        }
    }

    /**
     * 创建快照
     *
     * @returns {Map} 当前状态快照
     */
    snapshot() {
        return new Map(this.states);
    }

    /**
     * 恢复快照
     *
     * @param {Map} snapshot - 状态快照
     */
    restore(snapshot) {
        this.states = new Map(snapshot);
        this.history = [];
    }
}

/**
 * 剪枝优化器
 * 核心思想：通过各种剪枝策略减少搜索空间
 */
class PruningOptimizer {
    /**
     * 边界剪枝：检查剩余选择是否足够达到目标
     *
     * @param {number} current - 当前已选择数量
     * @param {number} remaining - 剩余可选择数量
     * @param {number} target - 目标数量
     * @returns {boolean} 是否应该剪枝
     */
    static boundaryPrune(current, remaining, target) {
        return current + remaining < target;
    }

    /**
     * 重复剪枝：跳过重复的选择
     *
     * @param {Array} candidates - 候选数组（已排序）
     * @param {number} index - 当前索引
     * @param {number} start - 起始索引
     * @returns {boolean} 是否应该跳过
     */
    static duplicatePrune(candidates, index, start) {
        return index > start && candidates[index] === candidates[index - 1];
    }

    /**
     * 数值剪枝：对于数值问题的剪枝
     *
     * @param {number} currentSum - 当前和
     * @param {number} target - 目标值
     * @param {number} candidate - 候选值
     * @returns {boolean} 是否应该剪枝
     */
    static valuePrune(currentSum, target, candidate) {
        return currentSum + candidate > target;
    }

    /**
     * 启发式剪枝：基于启发式信息的剪枝
     *
     * @param {*} currentState - 当前状态
     * @param {Function} heuristic - 启发式函数
     * @returns {boolean} 是否应该剪枝
     */
    static heuristicPrune(currentState, heuristic) {
        return heuristic(currentState) === false;
    }
}

// ================================
// 测试和示例
// ================================

/**
 * 测试所有实现
 */
function testBacktrackImplementations() {
    console.log("=== 回溯算法基础实现测试 ===\n");

    // 测试排列生成
    console.log("1. 排列生成测试:");
    const nums1 = [1, 2, 3];
    console.log(`输入: [${nums1}]`);
    console.log("全排列:", PermutationGenerator.generate(nums1));

    const nums2 = [1, 1, 2];
    console.log(`输入: [${nums2}]`);
    console.log("去重排列:", PermutationGenerator.generateUnique(nums2));

    // 测试组合生成
    console.log("\n2. 组合生成测试:");
    const nums3 = [1, 2, 3, 4];
    console.log(`从 [${nums3}] 中选择 2 个:`);
    console.log("组合:", CombinationGenerator.generate(nums3, 2));

    console.log("组合总和(目标7):", CombinationGenerator.combinationSum([2, 3, 6, 7], 7));

    // 测试子集生成
    console.log("\n3. 子集生成测试:");
    const nums4 = [1, 2, 3];
    console.log(`输入: [${nums4}]`);
    console.log("所有子集:", SubsetGenerator.generate(nums4));
    console.log("位操作子集:", SubsetGenerator.generateWithBits(nums4));

    // 测试电话号码组合
    console.log("\n4. 电话号码组合测试:");
    const phone = new PhoneNumberCombinations();
    console.log("数字 '23' 的字母组合:", phone.letterCombinations('23'));

    // 测试括号生成
    console.log("\n5. 括号生成测试:");
    console.log("n=3 的有效括号:", ParenthesesGenerator.generate(3));

    // 测试单词拆分
    console.log("\n6. 单词拆分测试:");
    const s = "leetcode";
    const dict = ["leet", "code"];
    console.log(`"${s}" 是否可以拆分:`, WordBreak.canBreak(s, dict));
    console.log("所有拆分方案:", WordBreak.allBreaks(s, dict));

    console.log("\n=== 测试完成 ===");
}

// 运行测试
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        BacktrackFramework,
        PermutationGenerator,
        CombinationGenerator,
        SubsetGenerator,
        PhoneNumberCombinations,
        ParenthesesGenerator,
        WordBreak,
        StateManager,
        PruningOptimizer,
        testBacktrackImplementations
    };
} else {
    // 浏览器环境下运行测试
    testBacktrackImplementations();
}