# 第7章：堆和优先队列 📚

堆是一种特殊的完全二叉树，具有堆序性质，是实现优先队列的理想数据结构。堆在算法设计中有着广泛的应用，特别在处理"最大值"、"最小值"、"第K大"等问题时表现出色。

## 堆的基础方法介绍 🔧

### 访问操作
堆作为优先队列，主要关注的是极值元素的快速获取。

```javascript
// 获取堆顶元素（最大值或最小值）
function peek() {
    return this.heap[0];
}

// 获取堆的大小
function size() {
    return this.heap.length;
}

// 检查堆是否为空
function isEmpty() {
    return this.heap.length === 0;
}
```

### 修改操作
堆的核心操作是插入元素和删除堆顶元素，这些操作需要维护堆的性质。

```javascript
// 插入元素（上滤操作）
function insert(element) {
    this.heap.push(element);
    this.heapifyUp(this.heap.length - 1);
}

// 示例
const maxHeap = new MaxHeap();
maxHeap.insert(10);
maxHeap.insert(5);
maxHeap.insert(15);
console.log(maxHeap.peek()); // 15

// 删除堆顶元素（下滤操作）
function extractMax() {
    if (this.isEmpty()) return null;
    
    const max = this.heap[0];
    const last = this.heap.pop();
    
    if (!this.isEmpty()) {
        this.heap[0] = last;
        this.heapifyDown(0);
    }
    
    return max;
}

// 示例
console.log(maxHeap.extractMax()); // 15
console.log(maxHeap.peek()); // 10
```

### 构建操作
从无序数组构建堆是一个重要的操作，有多种实现方式。

```javascript
// 自底向上构建堆（Floyd建堆法）
function buildHeap(arr) {
    this.heap = [...arr];
    // 从最后一个非叶子节点开始下滤
    for (let i = Math.floor(this.heap.length / 2) - 1; i >= 0; i--) {
        this.heapifyDown(i);
    }
}

// 示例
const arr = [4, 1, 3, 2, 16, 9, 10, 14, 8, 7];
const heap = new MaxHeap();
heap.buildHeap(arr);
console.log(heap.heap); // [16, 14, 10, 8, 7, 9, 3, 2, 4, 1]
```

### 堆化操作
堆化是维护堆性质的核心操作，包括上滤和下滤。

```javascript
// 上滤操作：用于插入元素后恢复堆性质
function heapifyUp(index) {
    while (index > 0) {
        const parentIndex = Math.floor((index - 1) / 2);
        if (this.heap[parentIndex] >= this.heap[index]) break;
        
        this.swap(parentIndex, index);
        index = parentIndex;
    }
}

// 下滤操作：用于删除元素后恢复堆性质
function heapifyDown(index) {
    while (index < this.heap.length) {
        let largest = index;
        const leftChild = 2 * index + 1;
        const rightChild = 2 * index + 2;
        
        if (leftChild < this.heap.length && 
            this.heap[leftChild] > this.heap[largest]) {
            largest = leftChild;
        }
        
        if (rightChild < this.heap.length && 
            this.heap[rightChild] > this.heap[largest]) {
            largest = rightChild;
        }
        
        if (largest === index) break;
        
        this.swap(index, largest);
        index = largest;
    }
}
```

## 堆与其他数据结构的关系 💡

### 数组表示法
堆通常使用数组来存储，利用完全二叉树的性质实现高效的索引计算。

```javascript
// 父子节点索引关系
function getParentIndex(i) { return Math.floor((i - 1) / 2); }
function getLeftChildIndex(i) { return 2 * i + 1; }
function getRightChildIndex(i) { return 2 * i + 2; }

// 示例：数组 [16, 14, 10, 8, 7, 9, 3, 2, 4, 1] 表示的最大堆
//          16
//        /    \
//      14      10
//     /  \    /  \
//    8    7  9    3
//   / \  /
//  2  4 1
```

### 与排序算法的关系
堆排序是基于堆数据结构的比较排序算法。

```javascript
function heapSort(arr) {
    const heap = new MaxHeap();
    heap.buildHeap(arr);
    
    const result = [];
    while (!heap.isEmpty()) {
        result.unshift(heap.extractMax()); // 每次取出最大值放在前面
    }
    
    return result;
}

// 示例
const unsorted = [4, 1, 3, 2, 16, 9, 10, 14, 8, 7];
const sorted = heapSort(unsorted);
console.log(sorted); // [1, 2, 3, 4, 7, 8, 9, 10, 14, 16]
```

### 优先队列实现
堆是实现优先队列最常用的数据结构。

```javascript
class PriorityQueue {
    constructor(compareFn = (a, b) => a - b) {
        this.heap = [];
        this.compare = compareFn;
    }
    
    enqueue(element, priority) {
        this.heap.push({ element, priority });
        this.heapifyUp(this.heap.length - 1);
    }
    
    dequeue() {
        if (this.isEmpty()) return null;
        const max = this.heap[0];
        const last = this.heap.pop();
        
        if (!this.isEmpty()) {
            this.heap[0] = last;
            this.heapifyDown(0);
        }
        
        return max.element;
    }
}

// 示例：任务调度
const taskQueue = new PriorityQueue((a, b) => b.priority - a.priority);
taskQueue.enqueue("低优先级任务", 1);
taskQueue.enqueue("高优先级任务", 5);
taskQueue.enqueue("中优先级任务", 3);

console.log(taskQueue.dequeue()); // "高优先级任务"
console.log(taskQueue.dequeue()); // "中优先级任务"
```

## 核心算法思想 🎯

### 1. 堆化算法（Heapify）

**核心思想**：堆化是维护堆性质的基础操作，分为上滤（sift up）和下滤（sift down）两种。

**应用场景**：插入元素后需要上滤，删除堆顶后需要下滤。

```javascript
/**
 * 建堆算法 - Floyd方法
 * 
 * 核心思想：
 * 从最后一个非叶子节点开始，自底向上进行下滤操作
 * 这种方法比逐个插入更高效
 * 
 * @param {number[]} arr - 待建堆的数组
 * @time O(n) - 线性时间复杂度
 * @space O(1) - 原地建堆
 */
function buildMaxHeap(arr) {
    const n = arr.length;
    // 从最后一个非叶子节点开始
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapifyDown(arr, i, n);
    }
}

function heapifyDown(arr, index, heapSize) {
    let largest = index;
    const left = 2 * index + 1;
    const right = 2 * index + 2;
    
    if (left < heapSize && arr[left] > arr[largest]) {
        largest = left;
    }
    
    if (right < heapSize && arr[right] > arr[largest]) {
        largest = right;
    }
    
    if (largest !== index) {
        [arr[index], arr[largest]] = [arr[largest], arr[index]];
        heapifyDown(arr, largest, heapSize);
    }
}

// 示例
const array = [4, 10, 3, 5, 1];
buildMaxHeap(array);
console.log(array); // [10, 5, 3, 4, 1]
```

### 2. Top-K 问题

**核心思想**：使用大小为K的堆来维护当前的Top-K元素，根据要求选择最大堆或最小堆。

**解题思路**：
- 求第K大元素：使用大小为K的**最小堆**
- 求第K小元素：使用大小为K的**最大堆**
- 堆顶元素即为所求

```javascript
/**
 * 寻找数组中第K大的元素
 * 
 * 核心思想：
 * 使用最小堆维护当前最大的K个元素
 * 堆的大小始终保持为K，堆顶就是第K大元素
 * 
 * @param {number[]} nums - 输入数组
 * @param {number} k - 第k大
 * @returns {number} 第k大的元素
 * @time O(n log k) - n个元素，每次堆操作log k
 * @space O(k) - 堆的大小
 */
function findKthLargest(nums, k) {
    const minHeap = new MinHeap();
    
    for (const num of nums) {
        minHeap.insert(num);
        if (minHeap.size() > k) {
            minHeap.extractMin(); // 移除最小元素
        }
    }
    
    return minHeap.peek(); // 堆顶就是第k大元素
}

// 示例
console.log(findKthLargest([3,2,1,5,6,4], 2)); // 5
console.log(findKthLargest([3,2,3,1,2,4,5,5,6], 4)); // 4
```

### 3. 数据流中位数

**核心思想**：使用两个堆来维护数据流的中位数：最大堆存储较小的一半，最小堆存储较大的一半。

**平衡策略**：
- 保持两个堆的大小差不超过1
- 中位数在堆顶，时间复杂度O(1)

```javascript
/**
 * 数据流中位数查找器
 * 
 * 核心思想：
 * 使用两个堆维护数据流：
 * - maxHeap：存储较小的一半数据（最大堆）
 * - minHeap：存储较大的一半数据（最小堆）
 * 
 * 平衡条件：
 * |maxHeap.size - minHeap.size| <= 1
 */
class MedianFinder {
    constructor() {
        this.maxHeap = new MaxHeap(); // 存储较小的一半
        this.minHeap = new MinHeap(); // 存储较大的一半
    }
    
    addNum(num) {
        // 先放入maxHeap，再把maxHeap的最大值放入minHeap
        this.maxHeap.insert(num);
        this.minHeap.insert(this.maxHeap.extractMax());
        
        // 保持平衡：maxHeap的大小 >= minHeap的大小
        if (this.maxHeap.size() < this.minHeap.size()) {
            this.maxHeap.insert(this.minHeap.extractMin());
        }
    }
    
    findMedian() {
        if (this.maxHeap.size() > this.minHeap.size()) {
            return this.maxHeap.peek();
        } else {
            return (this.maxHeap.peek() + this.minHeap.peek()) / 2;
        }
    }
}
```

### 4. 堆排序算法

**核心思想**：利用堆的性质进行排序，分为两个阶段：建堆和排序。

**算法步骤**：
1. 建立最大堆
2. 将堆顶（最大值）与末尾交换
3. 减少堆大小，重新堆化
4. 重复步骤2-3

```javascript
/**
 * 堆排序算法
 * 
 * 核心思想：
 * 利用堆的性质进行原地排序
 * 第一阶段：建立最大堆
 * 第二阶段：逐个取出最大值放到末尾
 * 
 * @param {number[]} arr - 待排序数组
 * @time O(n log n) - 建堆O(n) + n次堆化O(log n)
 * @space O(1) - 原地排序
 */
function heapSort(arr) {
    const n = arr.length;
    
    // 第一阶段：建立最大堆
    buildMaxHeap(arr);
    
    // 第二阶段：排序
    for (let i = n - 1; i > 0; i--) {
        // 将堆顶（最大值）交换到末尾
        [arr[0], arr[i]] = [arr[i], arr[0]];
        
        // 减少堆大小，重新堆化
        heapifyDown(arr, 0, i);
    }
    
    return arr;
}

// 示例
const array = [64, 34, 25, 12, 22, 11, 90];
heapSort(array);
console.log(array); // [11, 12, 22, 25, 34, 64, 90]
```

## 算法思想总结 🎯

| 算法思想 | 时间复杂度 | 空间复杂度 | 适用场景 |
|---------|------------|------------|----------|
| 堆化算法 | O(log n) | O(1) | 维护堆性质 |
| 建堆算法 | O(n) | O(1) | 从数组构建堆 |
| Top-K问题 | O(n log k) | O(k) | 寻找最大/最小的K个元素 |
| 堆排序 | O(n log n) | O(1) | 原地排序 |
| 数据流中位数 | O(log n) | O(n) | 动态维护中位数 |

**设计思想总结**：
- **堆化**：通过比较和交换维护堆的完全二叉树性质
- **分治**：Top-K问题通过部分排序减少时间复杂度
- **双堆**：数据流中位数通过两个堆的协作实现平衡
- **原地**：堆排序在原数组上操作，节省空间

**适用性总结**：
- 需要频繁获取最值时，优先考虑堆
- Top-K类问题的标准解法
- 动态数据流的统计问题
- 优先级相关的调度问题 