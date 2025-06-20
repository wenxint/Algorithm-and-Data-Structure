/**
 * LeetCode 23: 合并K个升序链表 (Merge k Sorted Lists)
 * 难度：困难
 *
 * 题目描述：
 * 给你一个链表数组，每个链表都已经按升序排列。
 * 请你将所有链表合并到一个升序链表中，返回合并后的链表。
 *
 * 核心思想：
 * 这是一个多路归并问题。可以使用多种方法解决：
 * 1. 逐一合并：依次合并两个链表，时间复杂度较高
 * 2. 优先队列（堆）：维护一个最小堆，每次取出最小值
 * 3. 分治法：类似归并排序，两两合并，递归进行
 * 4. 转换为数组：将所有值放入数组排序后重建链表
 *
 * 算法步骤：
 * 1. 分治法：递归地将链表数组分成两半，分别合并后再合并结果
 * 2. 优先队列：将所有链表头节点放入堆，每次取最小值并加入其下一个节点
 */

/**
 * 链表节点定义
 */
class ListNode {
    constructor(val, next) {
        this.val = (val === undefined ? 0 : val);
        this.next = (next === undefined ? null : next);
    }
}

/**
 * 最小堆实现
 * 核心思想：维护一个最小堆来快速获取最小值
 */
class MinHeap {
    constructor(compareFunction) {
        this.heap = [];
        this.compare = compareFunction || ((a, b) => a - b);
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
     * 交换两个节点
     */
    swap(index1, index2) {
        [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
    }

    /**
     * 向上调整（插入时使用）
     */
    heapifyUp(index) {
        if (index === 0) return;

        const parentIndex = this.getParentIndex(index);
        if (this.compare(this.heap[index], this.heap[parentIndex]) < 0) {
            this.swap(index, parentIndex);
            this.heapifyUp(parentIndex);
        }
    }

    /**
     * 向下调整（删除时使用）
     */
    heapifyDown(index) {
        const leftIndex = this.getLeftChildIndex(index);
        const rightIndex = this.getRightChildIndex(index);
        let minIndex = index;

        if (leftIndex < this.heap.length &&
            this.compare(this.heap[leftIndex], this.heap[minIndex]) < 0) {
            minIndex = leftIndex;
        }

        if (rightIndex < this.heap.length &&
            this.compare(this.heap[rightIndex], this.heap[minIndex]) < 0) {
            minIndex = rightIndex;
        }

        if (minIndex !== index) {
            this.swap(index, minIndex);
            this.heapifyDown(minIndex);
        }
    }

    /**
     * 插入元素
     */
    push(value) {
        this.heap.push(value);
        this.heapifyUp(this.heap.length - 1);
    }

    /**
     * 删除并返回最小元素
     */
    pop() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();

        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.heapifyDown(0);
        return min;
    }

    /**
     * 获取最小元素（不删除）
     */
    peek() {
        return this.heap.length > 0 ? this.heap[0] : null;
    }

    /**
     * 检查堆是否为空
     */
    isEmpty() {
        return this.heap.length === 0;
    }

    /**
     * 获取堆大小
     */
    size() {
        return this.heap.length;
    }
}

/**
 * 合并K个升序链表 - 优先队列方法
 * 核心思想：使用最小堆维护所有链表的当前最小节点
 *
 * 算法步骤：
 * 1. 将所有链表的头节点加入最小堆
 * 2. 每次从堆中取出最小节点，加入结果链表
 * 3. 如果该节点有下一个节点，将下一个节点加入堆
 * 4. 重复直到堆为空
 *
 * @param {ListNode[]} lists - 链表数组
 * @returns {ListNode} 合并后的链表头节点
 * @time O(n log k) n为总节点数，k为链表数量
 * @space O(k) 堆的大小
 */
function mergeKListsHeap(lists) {
    if (!lists || lists.length === 0) return null;

    // 创建最小堆，按节点值比较
    const minHeap = new MinHeap((a, b) => a.val - b.val);

    // 将所有非空链表的头节点加入堆
    for (let list of lists) {
        if (list) {
            minHeap.push(list);
        }
    }

    // 创建虚拟头节点
    const dummy = new ListNode(0);
    let current = dummy;

    // 从堆中依次取出最小节点
    while (!minHeap.isEmpty()) {
        const minNode = minHeap.pop();
        current.next = minNode;
        current = current.next;

        // 如果该节点有下一个节点，加入堆
        if (minNode.next) {
            minHeap.push(minNode.next);
        }
    }

    return dummy.next;
}

/**
 * 合并K个升序链表 - 分治法
 * 核心思想：类似归并排序，递归地两两合并链表
 *
 * 算法步骤：
 * 1. 如果只有一个链表，直接返回
 * 2. 将链表数组分成两半
 * 3. 递归合并左半部分和右半部分
 * 4. 合并两个结果链表
 *
 * @param {ListNode[]} lists - 链表数组
 * @returns {ListNode} 合并后的链表头节点
 * @time O(n log k) n为总节点数，k为链表数量
 * @space O(log k) 递归栈深度
 */
function mergeKListsDivideConquer(lists) {
    if (!lists || lists.length === 0) return null;
    if (lists.length === 1) return lists[0];

    // 分治合并
    function merge(lists, start, end) {
        if (start === end) return lists[start];
        if (start > end) return null;

        const mid = Math.floor((start + end) / 2);
        const left = merge(lists, start, mid);
        const right = merge(lists, mid + 1, end);

        return mergeTwoLists(left, right);
    }

    return merge(lists, 0, lists.length - 1);
}

/**
 * 合并两个升序链表
 * 核心思想：使用双指针技术逐个比较节点
 *
 * @param {ListNode} list1 - 第一个链表
 * @param {ListNode} list2 - 第二个链表
 * @returns {ListNode} 合并后的链表头节点
 * @time O(m + n) m和n分别为两个链表的长度
 * @space O(1) 只使用常数额外空间
 */
function mergeTwoLists(list1, list2) {
    const dummy = new ListNode(0);
    let current = dummy;

    while (list1 && list2) {
        if (list1.val <= list2.val) {
            current.next = list1;
            list1 = list1.next;
        } else {
            current.next = list2;
            list2 = list2.next;
        }
        current = current.next;
    }

    // 连接剩余节点
    current.next = list1 || list2;

    return dummy.next;
}

/**
 * 合并K个升序链表 - 逐一合并
 * 核心思想：依次合并两个链表
 *
 * @param {ListNode[]} lists - 链表数组
 * @returns {ListNode} 合并后的链表头节点
 * @time O(n * k) n为平均链表长度，k为链表数量
 * @space O(1) 只使用常数额外空间
 */
function mergeKListsSequential(lists) {
    if (!lists || lists.length === 0) return null;

    let result = lists[0];
    for (let i = 1; i < lists.length; i++) {
        result = mergeTwoLists(result, lists[i]);
    }

    return result;
}

/**
 * 合并K个升序链表 - 转换为数组方法
 * 核心思想：将所有节点值收集到数组中，排序后重建链表
 *
 * @param {ListNode[]} lists - 链表数组
 * @returns {ListNode} 合并后的链表头节点
 * @time O(n log n) n为总节点数
 * @space O(n) 存储所有节点值
 */
function mergeKListsArray(lists) {
    if (!lists || lists.length === 0) return null;

    const values = [];

    // 收集所有节点值
    for (let list of lists) {
        let current = list;
        while (current) {
            values.push(current.val);
            current = current.next;
        }
    }

    if (values.length === 0) return null;

    // 排序
    values.sort((a, b) => a - b);

    // 重建链表
    const dummy = new ListNode(0);
    let current = dummy;

    for (let val of values) {
        current.next = new ListNode(val);
        current = current.next;
    }

    return dummy.next;
}

/**
 * 合并K个升序链表 - 优化的分治法
 * 核心思想：使用迭代的方式进行两两合并，避免递归
 *
 * @param {ListNode[]} lists - 链表数组
 * @returns {ListNode} 合并后的链表头节点
 * @time O(n log k)
 * @space O(1)
 */
function mergeKListsIterative(lists) {
    if (!lists || lists.length === 0) return null;

    while (lists.length > 1) {
        const mergedLists = [];

        // 两两合并
        for (let i = 0; i < lists.length; i += 2) {
            const list1 = lists[i];
            const list2 = i + 1 < lists.length ? lists[i + 1] : null;
            mergedLists.push(mergeTwoLists(list1, list2));
        }

        lists = mergedLists;
    }

    return lists[0];
}

/**
 * 合并K个升序数组
 * 核心思想：扩展链表合并到数组合并
 *
 * @param {number[][]} arrays - 升序数组列表
 * @returns {number[]} 合并后的升序数组
 * @time O(n log k)
 * @space O(n)
 */
function mergeKSortedArrays(arrays) {
    if (!arrays || arrays.length === 0) return [];

    const minHeap = new MinHeap((a, b) => a.val - b.val);
    const result = [];

    // 将每个数组的第一个元素加入堆
    for (let i = 0; i < arrays.length; i++) {
        if (arrays[i].length > 0) {
            minHeap.push({
                val: arrays[i][0],
                arrayIndex: i,
                elementIndex: 0
            });
        }
    }

    while (!minHeap.isEmpty()) {
        const minItem = minHeap.pop();
        result.push(minItem.val);

        // 如果该数组还有下一个元素，加入堆
        const nextIndex = minItem.elementIndex + 1;
        if (nextIndex < arrays[minItem.arrayIndex].length) {
            minHeap.push({
                val: arrays[minItem.arrayIndex][nextIndex],
                arrayIndex: minItem.arrayIndex,
                elementIndex: nextIndex
            });
        }
    }

    return result;
}

/**
 * 查找K个升序链表中的第K小元素
 * 核心思想：使用最小堆，取出前K个元素
 *
 * @param {ListNode[]} lists - 链表数组
 * @param {number} k - 第k小
 * @returns {number} 第k小的元素值
 * @time O(k log k)
 * @space O(k)
 */
function findKthSmallestInKLists(lists, k) {
    if (!lists || lists.length === 0 || k <= 0) return null;

    const minHeap = new MinHeap((a, b) => a.val - b.val);

    // 将所有链表的头节点加入堆
    for (let list of lists) {
        if (list) {
            minHeap.push(list);
        }
    }

    let count = 0;
    while (!minHeap.isEmpty() && count < k) {
        const minNode = minHeap.pop();
        count++;

        if (count === k) {
            return minNode.val;
        }

        // 如果该节点有下一个节点，加入堆
        if (minNode.next) {
            minHeap.push(minNode.next);
        }
    }

    return null; // 没有第k小的元素
}

// ================================
// 工具函数和测试
// ================================

/**
 * 创建链表
 * @param {Array} arr - 数组
 * @returns {ListNode} 链表头节点
 */
function createLinkedList(arr) {
    if (!arr || arr.length === 0) return null;

    const head = new ListNode(arr[0]);
    let current = head;

    for (let i = 1; i < arr.length; i++) {
        current.next = new ListNode(arr[i]);
        current = current.next;
    }

    return head;
}

/**
 * 链表转数组
 * @param {ListNode} head - 链表头节点
 * @returns {Array} 数组
 */
function linkedListToArray(head) {
    const result = [];
    let current = head;

    while (current) {
        result.push(current.val);
        current = current.next;
    }

    return result;
}

/**
 * 打印链表
 * @param {ListNode} head - 链表头节点
 * @param {string} name - 链表名称
 */
function printLinkedList(head, name = "链表") {
    const arr = linkedListToArray(head);
    console.log(`${name}: [${arr.join(' -> ')}]`);
}

/**
 * 验证链表是否有序
 * @param {ListNode} head - 链表头节点
 * @returns {boolean} 是否有序
 */
function isListSorted(head) {
    if (!head || !head.next) return true;

    let current = head;
    while (current.next) {
        if (current.val > current.next.val) {
            return false;
        }
        current = current.next;
    }

    return true;
}

/**
 * 测试合并K个升序链表的所有方法
 */
function testMergeKLists() {
    console.log("=== 合并K个升序链表测试 ===\n");

    // 创建测试数据
    const lists1 = [
        createLinkedList([1, 4, 5]),
        createLinkedList([1, 3, 4]),
        createLinkedList([2, 6])
    ];

    const lists2 = [
        createLinkedList([]),
        createLinkedList([1])
    ];

    const lists3 = [
        createLinkedList([1, 2, 3]),
        createLinkedList([4, 5, 6]),
        createLinkedList([7, 8, 9])
    ];

    console.log("1. 基本测试用例:");
    console.log("输入链表:");
    lists1.forEach((list, index) => {
        printLinkedList(list, `链表${index + 1}`);
    });

    console.log("\n各种方法的结果:");

    // 优先队列方法
    const result1 = mergeKListsHeap(lists1.map(list => createLinkedList(linkedListToArray(list))));
    printLinkedList(result1, "优先队列方法");
    console.log("是否有序:", isListSorted(result1));

    // 分治法
    const result2 = mergeKListsDivideConquer(lists1.map(list => createLinkedList(linkedListToArray(list))));
    printLinkedList(result2, "分治法");
    console.log("是否有序:", isListSorted(result2));

    // 逐一合并
    const result3 = mergeKListsSequential(lists1.map(list => createLinkedList(linkedListToArray(list))));
    printLinkedList(result3, "逐一合并");
    console.log("是否有序:", isListSorted(result3));

    // 数组方法
    const result4 = mergeKListsArray(lists1.map(list => createLinkedList(linkedListToArray(list))));
    printLinkedList(result4, "数组方法");
    console.log("是否有序:", isListSorted(result4));

    // 迭代分治
    const result5 = mergeKListsIterative(lists1.map(list => createLinkedList(linkedListToArray(list))));
    printLinkedList(result5, "迭代分治");
    console.log("是否有序:", isListSorted(result5));

    console.log("\n2. 边界情况测试:");
    console.log("包含空链表的情况:");
    lists2.forEach((list, index) => {
        printLinkedList(list, `链表${index + 1}`);
    });

    const result6 = mergeKListsHeap(lists2.map(list => createLinkedList(linkedListToArray(list))));
    printLinkedList(result6, "合并结果");

    console.log("\n3. 大规模测试:");
    console.log("输入链表:");
    lists3.forEach((list, index) => {
        printLinkedList(list, `链表${index + 1}`);
    });

    const result7 = mergeKListsHeap(lists3.map(list => createLinkedList(linkedListToArray(list))));
    printLinkedList(result7, "合并结果");

    console.log("\n4. 扩展功能测试:");

    // 合并K个升序数组
    const arrays = [[1, 4, 5], [1, 3, 4], [2, 6]];
    console.log("合并K个升序数组:");
    console.log("输入:", arrays);
    console.log("输出:", mergeKSortedArrays(arrays));

    // 查找第K小元素
    const k = 4;
    const kthSmallest = findKthSmallestInKLists(lists1.map(list => createLinkedList(linkedListToArray(list))), k);
    console.log(`\n查找第${k}小元素: ${kthSmallest}`);

    console.log("\n=== 测试完成 ===");
}

/**
 * 性能测试
 */
function performanceTest() {
    console.log("\n=== 性能测试 ===");

    const kValues = [10, 50, 100];
    const listLength = 100;

    kValues.forEach(k => {
        console.log(`\n测试规模: ${k}个链表，每个链表${listLength}个元素`);

        // 生成测试数据
        const lists = [];
        for (let i = 0; i < k; i++) {
            const arr = [];
            for (let j = 0; j < listLength; j++) {
                arr.push(i * listLength + j * 2); // 确保有序
            }
            lists.push(createLinkedList(arr));
        }

        // 测试优先队列方法
        const start1 = performance.now();
        mergeKListsHeap(lists.map(list => createLinkedList(linkedListToArray(list))));
        const end1 = performance.now();
        console.log(`优先队列方法: ${(end1 - start1).toFixed(2)}ms`);

        // 测试分治法
        const start2 = performance.now();
        mergeKListsDivideConquer(lists.map(list => createLinkedList(linkedListToArray(list))));
        const end2 = performance.now();
        console.log(`分治法: ${(end2 - start2).toFixed(2)}ms`);

        // 测试迭代分治
        const start3 = performance.now();
        mergeKListsIterative(lists.map(list => createLinkedList(linkedListToArray(list))));
        const end3 = performance.now();
        console.log(`迭代分治: ${(end3 - start3).toFixed(2)}ms`);

        // 测试数组方法
        const start4 = performance.now();
        mergeKListsArray(lists.map(list => createLinkedList(linkedListToArray(list))));
        const end4 = performance.now();
        console.log(`数组方法: ${(end4 - start4).toFixed(2)}ms`);
    });
}

/**
 * 复杂度分析
 */
function complexityAnalysis() {
    console.log("\n=== 复杂度分析 ===");
    console.log("n = 总节点数, k = 链表数量\n");

    console.log("1. 优先队列方法:");
    console.log("   时间复杂度: O(n log k) - 每个节点进出堆一次");
    console.log("   空间复杂度: O(k) - 堆的大小");

    console.log("\n2. 分治法:");
    console.log("   时间复杂度: O(n log k) - 类似归并排序");
    console.log("   空间复杂度: O(log k) - 递归栈深度");

    console.log("\n3. 逐一合并:");
    console.log("   时间复杂度: O(n * k) - 每次合并链表长度递增");
    console.log("   空间复杂度: O(1) - 只使用常数额外空间");

    console.log("\n4. 数组方法:");
    console.log("   时间复杂度: O(n log n) - 排序的复杂度");
    console.log("   空间复杂度: O(n) - 存储所有节点值");

    console.log("\n5. 迭代分治:");
    console.log("   时间复杂度: O(n log k) - 与递归分治相同");
    console.log("   空间复杂度: O(1) - 避免递归栈");

    console.log("\n推荐使用: 优先队列方法或分治法，平衡了时间和空间复杂度");
}

// 导出函数供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ListNode,
        MinHeap,
        mergeKListsHeap,
        mergeKListsDivideConquer,
        mergeKListsSequential,
        mergeKListsArray,
        mergeKListsIterative,
        mergeTwoLists,
        mergeKSortedArrays,
        findKthSmallestInKLists,
        createLinkedList,
        linkedListToArray,
        printLinkedList,
        isListSorted,
        testMergeKLists,
        performanceTest,
        complexityAnalysis
    };
} else {
    // 浏览器环境下运行测试
    testMergeKLists();
    performanceTest();
    complexityAnalysis();
}