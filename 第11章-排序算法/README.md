# 第11章：排序算法 📊

## 章节概述

排序算法是计算机科学中最基础且重要的算法类型之一，几乎所有的程序开发都会涉及到数据排序。掌握各种排序算法的原理、实现和性能特征，对于理解算法设计思想和选择合适的解决方案至关重要。本章将深入探讨10种经典排序算法，从简单到复杂，从稳定到不稳定，全面覆盖排序算法的核心概念。

---

## 基础排序操作 🔧

### 比较操作

排序算法的核心在于元素间的比较和交换操作。

```javascript
/**
 * 比较两个元素的大小
 * @param {any} a 第一个元素
 * @param {any} b 第二个元素
 * @param {Function} compareFn 比较函数（可选）
 * @returns {number} 负数表示a<b，0表示a=b，正数表示a>b
 */
function compare(a, b, compareFn = (x, y) => x - y) {
    return compareFn(a, b);
}

// 示例调用
console.log(compare(3, 5));        // -2 (3 < 5)
console.log(compare(5, 3));        // 2 (5 > 3)
console.log(compare(3, 3));        // 0 (3 = 3)

// 自定义比较函数
const arr = [{age: 25}, {age: 30}, {age: 20}];
arr.sort((a, b) => compare(a.age, b.age));
console.log(arr); // [{age: 20}, {age: 25}, {age: 30}]
```

### 交换操作

```javascript
/**
 * 交换数组中两个位置的元素
 * @param {Array} arr 数组
 * @param {number} i 第一个位置
 * @param {number} j 第二个位置
 */
function swap(arr, i, j) {
    if (i !== j) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

// 示例调用
const numbers = [1, 2, 3, 4, 5];
swap(numbers, 0, 4);
console.log(numbers); // [5, 2, 3, 4, 1]
```

### 稳定性检测

```javascript
/**
 * 检测排序算法的稳定性
 * @param {Function} sortFn 排序函数
 * @param {Array} testData 测试数据
 * @returns {boolean} 是否稳定
 */
function checkStability(sortFn, testData = null) {
    // 使用带索引的对象进行稳定性测试
    const data = testData || [
        {value: 3, index: 0},
        {value: 1, index: 1},
        {value: 3, index: 2},
        {value: 2, index: 3},
        {value: 1, index: 4}
    ];
    
    const sorted = sortFn([...data], (a, b) => a.value - b.value);
    
    // 检查相同值的元素原始顺序是否保持
    for (let i = 0; i < sorted.length - 1; i++) {
        if (sorted[i].value === sorted[i + 1].value) {
            if (sorted[i].index > sorted[i + 1].index) {
                return false; // 稳定性被破坏
            }
        }
    }
    return true;
}
```

### 排序边界处理

```javascript
/**
 * 安全的排序函数包装器
 * @param {Array} arr 待排序数组
 * @param {Function} sortFn 排序函数
 * @param {Function} compareFn 比较函数
 * @returns {Array} 排序后的数组
 */
function safeSortWrapper(arr, sortFn, compareFn = (a, b) => a - b) {
    // 边界情况处理
    if (!Array.isArray(arr)) {
        throw new Error('输入必须是数组');
    }
    
    if (arr.length <= 1) {
        return [...arr]; // 返回副本
    }
    
    // 类型一致性检查
    const firstType = typeof arr[0];
    const allSameType = arr.every(item => typeof item === firstType);
    
    if (!allSameType) {
        console.warn('数组元素类型不一致，建议提供自定义比较函数');
    }
    
    return sortFn([...arr], compareFn);
}
```

---

## 排序算法与其他算法的关系 💡

### 排序与搜索的关系

排序为搜索算法提供了优化基础，特别是二分搜索。

```javascript
/**
 * 排序后进行二分搜索
 * @param {Array} arr 未排序数组
 * @param {any} target 目标值
 * @returns {number} 目标值的索引，不存在返回-1
 */
function sortAndBinarySearch(arr, target) {
    // 先排序
    const sorted = [...arr].sort((a, b) => a - b);
    
    // 二分搜索
    let left = 0, right = sorted.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (sorted[mid] === target) {
            return mid;
        } else if (sorted[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1;
}

// 示例
const numbers = [64, 34, 25, 12, 22, 11, 90];
console.log(sortAndBinarySearch(numbers, 25)); // 找到目标值的索引
```

### 排序与分治算法

许多高效排序算法都采用分治思想，如归并排序和快速排序。

```javascript
/**
 * 分治思想的通用框架
 * @param {Array} arr 待处理数组
 * @param {number} left 左边界
 * @param {number} right 右边界
 * @param {Function} divide 分割函数
 * @param {Function} conquer 征服函数
 * @param {Function} combine 合并函数
 */
function divideAndConquer(arr, left, right, divide, conquer, combine) {
    // 基本情况
    if (left >= right) {
        return conquer(arr, left, right);
    }
    
    // 分割
    const mid = divide(left, right);
    
    // 递归征服
    const leftResult = divideAndConquer(arr, left, mid, divide, conquer, combine);
    const rightResult = divideAndConquer(arr, mid + 1, right, divide, conquer, combine);
    
    // 合并结果
    return combine(leftResult, rightResult);
}
```

### 排序与堆数据结构

堆排序利用了堆这种数据结构的特性，体现了数据结构与算法的密切关系。

```javascript
/**
 * 最大堆的基本操作
 */
class MaxHeap {
    constructor() {
        this.heap = [];
    }
    
    /**
     * 获取父节点索引
     */
    getParentIndex(index) {
        return Math.floor((index - 1) / 2);
    }
    
    /**
     * 获取左子节点索引
     */
    getLeftChildIndex(index) {
        return 2 * index + 1;
    }
    
    /**
     * 获取右子节点索引
     */
    getRightChildIndex(index) {
        return 2 * index + 2;
    }
    
    /**
     * 向上调整（用于插入）
     */
    heapifyUp(index) {
        while (index > 0) {
            const parentIndex = this.getParentIndex(index);
            if (this.heap[parentIndex] >= this.heap[index]) {
                break;
            }
            swap(this.heap, parentIndex, index);
            index = parentIndex;
        }
    }
    
    /**
     * 向下调整（用于删除）
     */
    heapifyDown(index) {
        while (this.getLeftChildIndex(index) < this.heap.length) {
            const leftChild = this.getLeftChildIndex(index);
            const rightChild = this.getRightChildIndex(index);
            
            let maxIndex = index;
            
            if (this.heap[leftChild] > this.heap[maxIndex]) {
                maxIndex = leftChild;
            }
            
            if (rightChild < this.heap.length && 
                this.heap[rightChild] > this.heap[maxIndex]) {
                maxIndex = rightChild;
            }
            
            if (maxIndex === index) {
                break;
            }
            
            swap(this.heap, index, maxIndex);
            index = maxIndex;
        }
    }
}
```

---

## 核心排序算法思想 🎯

### 1. 基于比较的排序算法

#### 冒泡排序思想
**核心概念**：通过反复比较相邻元素并交换位置，让大元素像气泡一样"浮"到数组末尾。

```javascript
/**
 * 冒泡排序（优化版本）
 * 
 * 核心思想：
 * 每一轮比较中，通过相邻元素的比较和交换，
 * 将当前轮次的最大值"冒泡"到正确位置
 * 
 * @param {Array} arr 待排序数组
 * @returns {Array} 排序后的数组
 * @time O(n²) 平均和最坏情况，O(n) 最好情况
 * @space O(1)
 */
function bubbleSort(arr) {
    const n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
        let swapped = false; // 优化：检测是否发生交换
        
        // 每轮将最大元素冒泡到末尾
        for (let j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr, j, j + 1);
                swapped = true;
            }
        }
        
        // 如果一轮没有交换，说明已排序
        if (!swapped) {
            break;
        }
    }
    
    return arr;
}
```

#### 选择排序思想
**核心概念**：每次从未排序部分选择最小元素，放到已排序部分的末尾。

```javascript
/**
 * 选择排序
 * 
 * 核心思想：
 * 将数组分为已排序和未排序两部分
 * 每次从未排序部分选择最小元素放到已排序部分末尾
 * 
 * @param {Array} arr 待排序数组
 * @returns {Array} 排序后的数组
 * @time O(n²) 所有情况
 * @space O(1)
 */
function selectionSort(arr) {
    const n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
        let minIndex = i; // 假设当前位置是最小值
        
        // 在未排序部分找到真正的最小值
        for (let j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        
        // 将最小值交换到正确位置
        if (minIndex !== i) {
            swap(arr, i, minIndex);
        }
    }
    
    return arr;
}
```

#### 插入排序思想
**核心概念**：将数组分为已排序和未排序两部分，逐个将未排序元素插入到已排序部分的正确位置。

```javascript
/**
 * 插入排序
 * 
 * 核心思想：
 * 类似于整理扑克牌，逐张将牌插入到手中已排序牌的正确位置
 * 通过比较和移动，为新元素找到合适的插入位置
 * 
 * @param {Array} arr 待排序数组
 * @returns {Array} 排序后的数组
 * @time O(n²) 平均和最坏情况，O(n) 最好情况
 * @space O(1)
 */
function insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        const current = arr[i]; // 当前要插入的元素
        let j = i - 1;
        
        // 在已排序部分找到插入位置
        while (j >= 0 && arr[j] > current) {
            arr[j + 1] = arr[j]; // 元素后移
            j--;
        }
        
        arr[j + 1] = current; // 插入到正确位置
    }
    
    return arr;
}
```

### 2. 高效排序算法思想

#### 归并排序思想
**核心概念**：分治思想，将大问题分解为小问题，然后合并解决方案。

```javascript
/**
 * 归并排序
 * 
 * 核心思想：
 * 分治法的经典应用：
 * 1. 分：将数组递归分割为两半
 * 2. 治：对子数组递归排序
 * 3. 合：将两个有序子数组合并为一个有序数组
 * 
 * @param {Array} arr 待排序数组
 * @returns {Array} 排序后的数组
 * @time O(n log n) 所有情况
 * @space O(n) 需要额外空间存储临时数组
 */
function mergeSort(arr) {
    if (arr.length <= 1) {
        return [...arr];
    }
    
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));   // 递归排序左半部分
    const right = mergeSort(arr.slice(mid));     // 递归排序右半部分
    
    return merge(left, right); // 合并两个有序数组
}

/**
 * 合并两个有序数组
 * @param {Array} left 左有序数组
 * @param {Array} right 右有序数组
 * @returns {Array} 合并后的有序数组
 */
function merge(left, right) {
    const result = [];
    let i = 0, j = 0;
    
    // 比较两个数组的元素，选择较小的加入结果
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            result.push(left[i++]);
        } else {
            result.push(right[j++]);
        }
    }
    
    // 添加剩余元素
    result.push(...left.slice(i));
    result.push(...right.slice(j));
    
    return result;
}
```

#### 快速排序思想
**核心概念**：选择基准元素，将数组分为小于基准和大于基准两部分，然后递归排序。

```javascript
/**
 * 快速排序
 * 
 * 核心思想：
 * 分治法的另一种实现：
 * 1. 选择基准元素（pivot）
 * 2. 分区：将小于基准的元素放左边，大于基准的放右边
 * 3. 递归：对左右两部分分别进行快速排序
 * 
 * @param {Array} arr 待排序数组
 * @param {number} left 左边界
 * @param {number} right 右边界
 * @returns {Array} 排序后的数组
 * @time O(n log n) 平均情况，O(n²) 最坏情况
 * @space O(log n) 递归栈空间
 */
function quickSort(arr, left = 0, right = arr.length - 1) {
    if (left < right) {
        // 分区操作，返回基准元素的最终位置
        const pivotIndex = partition(arr, left, right);
        
        // 递归排序左右子数组
        quickSort(arr, left, pivotIndex - 1);
        quickSort(arr, pivotIndex + 1, right);
    }
    
    return arr;
}

/**
 * 分区函数（Lomuto分区方案）
 * @param {Array} arr 数组
 * @param {number} left 左边界
 * @param {number} right 右边界
 * @returns {number} 基准元素的最终位置
 */
function partition(arr, left, right) {
    const pivot = arr[right]; // 选择最后一个元素作为基准
    let i = left - 1; // 小于基准元素的边界
    
    for (let j = left; j < right; j++) {
        if (arr[j] <= pivot) {
            i++;
            swap(arr, i, j);
        }
    }
    
    swap(arr, i + 1, right); // 将基准元素放到正确位置
    return i + 1;
}
```

### 3. 特殊排序算法思想

#### 堆排序思想
**核心概念**：利用堆数据结构的性质，通过建堆和反复提取最大值来排序。

```javascript
/**
 * 堆排序
 * 
 * 核心思想：
 * 1. 建堆：将无序数组构造成最大堆
 * 2. 排序：反复提取堆顶最大元素，放到数组末尾
 * 3. 调整：每次提取后重新调整堆结构
 * 
 * @param {Array} arr 待排序数组
 * @returns {Array} 排序后的数组
 * @time O(n log n) 所有情况
 * @space O(1) 原地排序
 */
function heapSort(arr) {
    const n = arr.length;
    
    // 建堆：从最后一个非叶子节点开始向下调整
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }
    
    // 排序：反复提取堆顶元素
    for (let i = n - 1; i > 0; i--) {
        swap(arr, 0, i);      // 将堆顶最大元素交换到末尾
        heapify(arr, i, 0);   // 重新调整堆
    }
    
    return arr;
}

/**
 * 堆调整函数
 * @param {Array} arr 数组
 * @param {number} n 堆大小
 * @param {number} i 要调整的节点索引
 */
function heapify(arr, n, i) {
    let largest = i;           // 假设当前节点最大
    const left = 2 * i + 1;    // 左子节点
    const right = 2 * i + 2;   // 右子节点
    
    // 找到父节点和子节点中的最大值
    if (left < n && arr[left] > arr[largest]) {
        largest = left;
    }
    
    if (right < n && arr[right] > arr[largest]) {
        largest = right;
    }
    
    // 如果最大值不是当前节点，则交换并继续调整
    if (largest !== i) {
        swap(arr, i, largest);
        heapify(arr, n, largest);
    }
}
```

---

## 排序算法性能对比 📈

| 算法 | 平均时间 | 最坏时间 | 最好时间 | 空间复杂度 | 稳定性 | 适用场景 |
|------|----------|----------|----------|------------|--------|----------|
| 冒泡排序 | O(n²) | O(n²) | O(n) | O(1) | 稳定 | 教学演示 |
| 选择排序 | O(n²) | O(n²) | O(n²) | O(1) | 不稳定 | 内存受限 |
| 插入排序 | O(n²) | O(n²) | O(n) | O(1) | 稳定 | 小数据集 |
| 归并排序 | O(n log n) | O(n log n) | O(n log n) | O(n) | 稳定 | 大数据集 |
| 快速排序 | O(n log n) | O(n²) | O(n log n) | O(log n) | 不稳定 | 一般用途 |
| 堆排序 | O(n log n) | O(n log n) | O(n log n) | O(1) | 不稳定 | 内存受限 |

## 算法选择指南 🎯

### 数据规模考虑
- **小数据集(n < 50)**：插入排序、选择排序
- **中等数据集(50 ≤ n ≤ 10000)**：快速排序、堆排序
- **大数据集(n > 10000)**：归并排序、快速排序

### 稳定性要求
- **需要稳定排序**：归并排序、插入排序、冒泡排序
- **无稳定性要求**：快速排序、堆排序、选择排序

### 内存限制
- **内存受限**：堆排序、快速排序、插入排序
- **内存充足**：归并排序

### 数据特征
- **基本有序**：插入排序、冒泡排序
- **随机分布**：快速排序
- **需要最坏情况保证**：堆排序、归并排序

通过深入理解这些排序算法的核心思想和适用场景，你将能够在实际开发中选择最合适的排序策略，并为学习更高级的算法奠定坚实的基础。 