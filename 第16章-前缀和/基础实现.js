/**
 * 第16章：前缀和 - 基础数据结构实现
 *
 * 本文件包含前缀和相关的基础数据结构实现：
 * 1. 一维前缀和类
 * 2. 二维前缀和类
 * 3. 差分数组类
 * 4. 前缀异或类
 */

/**
 * 一维前缀和类
 *
 * 核心功能：
 * - 构建前缀和数组
 * - O(1)时间查询区间和
 * - 支持动态更新
 */
class PrefixSum1D {
    /**
     * 构造函数
     * @param {number[]} arr - 初始数组
     */
    constructor(arr = []) {
        this.originalArray = [...arr];
        this.prefixSum = [];
        this.buildPrefixSum();
    }

    /**
     * 构建前缀和数组
     *
     * 核心思想：
     * prefixSum[i] = arr[0] + arr[1] + ... + arr[i-1]
     * prefixSum[0] = 0，便于处理边界情况
     *
     * @time O(n) - 遍历一次数组
     * @space O(n) - 存储前缀和数组
     */
    buildPrefixSum() {
        const n = this.originalArray.length;
        this.prefixSum = new Array(n + 1).fill(0);

        for (let i = 0; i < n; i++) {
            this.prefixSum[i + 1] = this.prefixSum[i] + this.originalArray[i];
        }
    }

    /**
     * 查询区间[left, right]的和（包含两端）
     *
     * 核心公式：
     * sum(left, right) = prefixSum[right + 1] - prefixSum[left]
     *
     * @param {number} left - 左端点索引
     * @param {number} right - 右端点索引
     * @returns {number} 区间和
     * @time O(1) - 常数时间查询
     * @space O(1) - 常数额外空间
     */
    rangeSum(left, right) {
        // 边界检查
        if (left < 0 || right >= this.originalArray.length || left > right) {
            throw new Error('Invalid range');
        }

        return this.prefixSum[right + 1] - this.prefixSum[left];
    }

    /**
     * 更新数组中某个位置的值
     * @param {number} index - 要更新的索引
     * @param {number} newValue - 新值
     */
    update(index, newValue) {
        if (index < 0 || index >= this.originalArray.length) {
            throw new Error('Index out of bounds');
        }

        this.originalArray[index] = newValue;
        this.buildPrefixSum(); // 重新构建前缀和
    }

    /**
     * 获取数组长度
     * @returns {number} 数组长度
     */
    length() {
        return this.originalArray.length;
    }

    /**
     * 获取原数组的副本
     * @returns {number[]} 原数组副本
     */
    getArray() {
        return [...this.originalArray];
    }

    /**
     * 获取前缀和数组的副本
     * @returns {number[]} 前缀和数组副本
     */
    getPrefixSum() {
        return [...this.prefixSum];
    }
}

/**
 * 二维前缀和类
 *
 * 核心功能：
 * - 构建二维前缀和矩阵
 * - O(1)时间查询矩形区域和
 */
class PrefixSum2D {
    /**
     * 构造函数
     * @param {number[][]} matrix - 初始矩阵
     */
    constructor(matrix = []) {
        this.originalMatrix = matrix.map(row => [...row]);
        this.prefixSum = [];
        this.rows = matrix.length;
        this.cols = matrix.length > 0 ? matrix[0].length : 0;
        this.buildPrefixSum();
    }

    /**
     * 构建二维前缀和矩阵
     *
     * 核心思想：
     * prefixSum[i][j] = 从(0,0)到(i-1,j-1)的矩形区域和
     * 递推公式：prefixSum[i][j] = prefixSum[i-1][j] + prefixSum[i][j-1]
     *                           - prefixSum[i-1][j-1] + matrix[i-1][j-1]
     *
     * @time O(m×n) - 遍历整个矩阵
     * @space O(m×n) - 存储前缀和矩阵
     */
    buildPrefixSum() {
        if (this.rows === 0 || this.cols === 0) {
            this.prefixSum = [];
            return;
        }

        // 初始化前缀和矩阵，多一行一列用于边界处理
        this.prefixSum = Array.from({length: this.rows + 1},
                                  () => new Array(this.cols + 1).fill(0));

        // 构建前缀和矩阵
        for (let i = 1; i <= this.rows; i++) {
            for (let j = 1; j <= this.cols; j++) {
                this.prefixSum[i][j] = this.prefixSum[i-1][j] + this.prefixSum[i][j-1]
                                     - this.prefixSum[i-1][j-1]
                                     + this.originalMatrix[i-1][j-1];
            }
        }
    }

    /**
     * 查询矩形区域的和
     *
     * 容斥原理：
     * sum = prefixSum[row2+1][col2+1] - prefixSum[row1][col2+1]
     *     - prefixSum[row2+1][col1] + prefixSum[row1][col1]
     *
     * @param {number} row1 - 左上角行索引
     * @param {number} col1 - 左上角列索引
     * @param {number} row2 - 右下角行索引
     * @param {number} col2 - 右下角列索引
     * @returns {number} 矩形区域和
     * @time O(1) - 常数时间查询
     * @space O(1) - 常数额外空间
     */
    rangeSum(row1, col1, row2, col2) {
        // 边界检查
        if (row1 < 0 || col1 < 0 || row2 >= this.rows || col2 >= this.cols ||
            row1 > row2 || col1 > col2) {
            throw new Error('Invalid range');
        }

        return this.prefixSum[row2 + 1][col2 + 1] - this.prefixSum[row1][col2 + 1]
             - this.prefixSum[row2 + 1][col1] + this.prefixSum[row1][col1];
    }

    /**
     * 更新矩阵中某个位置的值
     * @param {number} row - 行索引
     * @param {number} col - 列索引
     * @param {number} newValue - 新值
     */
    update(row, col, newValue) {
        if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
            throw new Error('Index out of bounds');
        }

        this.originalMatrix[row][col] = newValue;
        this.buildPrefixSum(); // 重新构建前缀和
    }

    /**
     * 获取矩阵维度
     * @returns {{rows: number, cols: number}} 矩阵维度
     */
    dimensions() {
        return { rows: this.rows, cols: this.cols };
    }

    /**
     * 获取原矩阵的副本
     * @returns {number[][]} 原矩阵副本
     */
    getMatrix() {
        return this.originalMatrix.map(row => [...row]);
    }

    /**
     * 获取前缀和矩阵的副本
     * @returns {number[][]} 前缀和矩阵副本
     */
    getPrefixSum() {
        return this.prefixSum.map(row => [...row]);
    }
}

/**
 * 差分数组类
 *
 * 核心功能：
 * - 支持区间修改操作
 * - 批量更新后重构原数组
 */
class DifferenceArray {
    /**
     * 构造函数
     * @param {number[]} arr - 初始数组
     */
    constructor(arr = []) {
        this.originalArray = [...arr];
        this.differenceArray = [];
        this.buildDifferenceArray();
    }

    /**
     * 构建差分数组
     *
     * 核心思想：
     * diff[i] = arr[i] - arr[i-1] (i > 0)
     * diff[0] = arr[0]
     *
     * @time O(n) - 遍历一次数组
     * @space O(n) - 存储差分数组
     */
    buildDifferenceArray() {
        const n = this.originalArray.length;
        this.differenceArray = new Array(n);

        if (n === 0) return;

        this.differenceArray[0] = this.originalArray[0];
        for (let i = 1; i < n; i++) {
            this.differenceArray[i] = this.originalArray[i] - this.originalArray[i-1];
        }
    }

    /**
     * 区间更新：将[left, right]区间的所有元素加上val
     *
     * 核心思想：
     * diff[left] += val   // 从left开始增加val
     * diff[right+1] -= val  // 从right+1开始减少val
     *
     * @param {number} left - 左端点索引
     * @param {number} right - 右端点索引
     * @param {number} val - 增加的值
     * @time O(1) - 常数时间更新
     * @space O(1) - 常数额外空间
     */
    rangeUpdate(left, right, val) {
        // 边界检查
        if (left < 0 || right >= this.originalArray.length || left > right) {
            throw new Error('Invalid range');
        }

        this.differenceArray[left] += val;
        if (right + 1 < this.differenceArray.length) {
            this.differenceArray[right + 1] -= val;
        }
    }

    /**
     * 重构原数组（应用所有更新）
     *
     * 核心思想：
     * 对差分数组求前缀和得到更新后的原数组
     *
     * @returns {number[]} 更新后的数组
     * @time O(n) - 遍历一次数组
     * @space O(n) - 返回新数组
     */
    getUpdatedArray() {
        const n = this.differenceArray.length;
        if (n === 0) return [];

        const result = new Array(n);
        result[0] = this.differenceArray[0];

        for (let i = 1; i < n; i++) {
            result[i] = result[i-1] + this.differenceArray[i];
        }

        return result;
    }

    /**
     * 获取差分数组的副本
     * @returns {number[]} 差分数组副本
     */
    getDifferenceArray() {
        return [...this.differenceArray];
    }

    /**
     * 重置为原始状态
     */
    reset() {
        this.buildDifferenceArray();
    }
}

/**
 * 前缀异或类
 *
 * 核心功能：
 * - 构建前缀异或数组
 * - O(1)时间查询区间异或值
 */
class PrefixXOR {
    /**
     * 构造函数
     * @param {number[]} arr - 初始数组
     */
    constructor(arr = []) {
        this.originalArray = [...arr];
        this.prefixXor = [];
        this.buildPrefixXor();
    }

    /**
     * 构建前缀异或数组
     *
     * 核心思想：
     * prefixXor[i] = arr[0] ^ arr[1] ^ ... ^ arr[i-1]
     * prefixXor[0] = 0，便于处理边界情况
     *
     * @time O(n) - 遍历一次数组
     * @space O(n) - 存储前缀异或数组
     */
    buildPrefixXor() {
        const n = this.originalArray.length;
        this.prefixXor = new Array(n + 1).fill(0);

        for (let i = 0; i < n; i++) {
            this.prefixXor[i + 1] = this.prefixXor[i] ^ this.originalArray[i];
        }
    }

    /**
     * 查询区间[left, right]的异或值（包含两端）
     *
     * 核心性质：
     * A ^ A = 0, A ^ 0 = A
     * xor(left, right) = prefixXor[right + 1] ^ prefixXor[left]
     *
     * @param {number} left - 左端点索引
     * @param {number} right - 右端点索引
     * @returns {number} 区间异或值
     * @time O(1) - 常数时间查询
     * @space O(1) - 常数额外空间
     */
    rangeXor(left, right) {
        // 边界检查
        if (left < 0 || right >= this.originalArray.length || left > right) {
            throw new Error('Invalid range');
        }

        return this.prefixXor[right + 1] ^ this.prefixXor[left];
    }

    /**
     * 更新数组中某个位置的值
     * @param {number} index - 要更新的索引
     * @param {number} newValue - 新值
     */
    update(index, newValue) {
        if (index < 0 || index >= this.originalArray.length) {
            throw new Error('Index out of bounds');
        }

        this.originalArray[index] = newValue;
        this.buildPrefixXor(); // 重新构建前缀异或
    }

    /**
     * 获取前缀异或数组的副本
     * @returns {number[]} 前缀异或数组副本
     */
    getPrefixXor() {
        return [...this.prefixXor];
    }
}

// 测试用例
function runBasicTests() {
    console.log('=== 前缀和基础实现测试 ===\n');

    // 测试一维前缀和
    console.log('--- 一维前缀和测试 ---');
    const arr1D = [1, 2, 3, 4, 5];
    const prefix1D = new PrefixSum1D(arr1D);

    console.log(`原数组: [${arr1D.join(', ')}]`);
    console.log(`前缀和数组: [${prefix1D.getPrefixSum().join(', ')}]`);
    console.log(`区间[1,3]的和: ${prefix1D.rangeSum(1, 3)}`); // 2+3+4 = 9
    console.log(`区间[0,4]的和: ${prefix1D.rangeSum(0, 4)}`); // 1+2+3+4+5 = 15

    // 测试二维前缀和
    console.log('\n--- 二维前缀和测试 ---');
    const matrix2D = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
    ];
    const prefix2D = new PrefixSum2D(matrix2D);

    console.log('原矩阵:');
    matrix2D.forEach(row => console.log(`[${row.join(', ')}]`));
    console.log(`矩形区域(0,0)到(1,1)的和: ${prefix2D.rangeSum(0, 0, 1, 1)}`); // 1+2+4+5 = 12
    console.log(`矩形区域(1,1)到(2,2)的和: ${prefix2D.rangeSum(1, 1, 2, 2)}`); // 5+6+8+9 = 28

    // 测试差分数组
    console.log('\n--- 差分数组测试 ---');
    const arrDiff = [1, 2, 3, 4, 5];
    const diffArray = new DifferenceArray(arrDiff);

    console.log(`原数组: [${arrDiff.join(', ')}]`);
    console.log(`差分数组: [${diffArray.getDifferenceArray().join(', ')}]`);

    // 应用区间更新
    diffArray.rangeUpdate(1, 3, 2); // [1,3]区间加2
    diffArray.rangeUpdate(2, 4, 3); // [2,4]区间加3

    const updatedArray = diffArray.getUpdatedArray();
    console.log(`更新后数组: [${updatedArray.join(', ')}]`); // [1, 4, 8, 9, 8]

    // 测试前缀异或
    console.log('\n--- 前缀异或测试 ---');
    const arrXor = [4, 2, 2, 6, 4];
    const prefixXor = new PrefixXOR(arrXor);

    console.log(`原数组: [${arrXor.join(', ')}]`);
    console.log(`前缀异或数组: [${prefixXor.getPrefixXor().join(', ')}]`);
    console.log(`区间[1,3]的异或值: ${prefixXor.rangeXor(1, 3)}`); // 2^2^6 = 6
    console.log(`区间[0,4]的异或值: ${prefixXor.rangeXor(0, 4)}`); // 4^2^2^6^4 = 6
}

// 如果在Node.js环境中运行测试
if (typeof require !== 'undefined' && require.main === module) {
    runBasicTests();
}

// Node.js导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PrefixSum1D,
        PrefixSum2D,
        DifferenceArray,
        PrefixXOR,
        runBasicTests
    };
}