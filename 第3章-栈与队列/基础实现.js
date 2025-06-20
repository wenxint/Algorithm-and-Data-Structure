/**
 * 第3章：栈与队列 - 基础实现
 *
 * 本文件包含：
 * 1. 栈（Stack）的完整实现
 * 2. 队列（Queue）的完整实现
 * 3. 双端队列（Deque）的实现
 * 4. 基于链表的实现版本
 * 5. 性能分析和测试用例
 *
 * @author Algorithm Tutorial
 * @date 2024
 */

// ==================== 栈的实现 ====================

/**
 * 基于数组的栈实现
 *
 * 核心思想：
 * 使用数组的末尾作为栈顶，利用push和pop的O(1)特性
 * 简单高效，适合大部分应用场景
 */
class ArrayStack {
    constructor() {
        this.items = [];
    }

    /**
     * 入栈操作
     * @param {*} element - 要入栈的元素
     * @time O(1) - 数组末尾插入
     * @space O(1) - 只需要一个新位置
     */
    push(element) {
        this.items.push(element);
    }

    /**
     * 出栈操作
     * @returns {*} 栈顶元素，栈为空时返回undefined
     * @time O(1) - 数组末尾删除
     * @space O(1) - 只释放一个位置
     */
    pop() {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.items.pop();
    }

    /**
     * 查看栈顶元素（不删除）
     * @returns {*} 栈顶元素，栈为空时返回undefined
     * @time O(1) - 直接访问数组末尾
     * @space O(1)
     */
    peek() {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.items[this.items.length - 1];
    }

    /**
     * 检查栈是否为空
     * @returns {boolean} 是否为空
     * @time O(1)
     * @space O(1)
     */
    isEmpty() {
        return this.items.length === 0;
    }

    /**
     * 获取栈的大小
     * @returns {number} 栈中元素的数量
     * @time O(1)
     * @space O(1)
     */
    size() {
        return this.items.length;
    }

    /**
     * 清空栈
     * @time O(1) - 重新赋值数组
     * @space O(1)
     */
    clear() {
        this.items = [];
    }

    /**
     * 转换为数组（栈底到栈顶）
     * @returns {Array} 包含栈中所有元素的数组
     * @time O(n) - 需要复制所有元素
     * @space O(n) - 新数组空间
     */
    toArray() {
        return [...this.items];
    }

    /**
     * 字符串表示
     * @returns {string} 栈的字符串表示
     * @time O(n) - 遍历所有元素
     * @space O(n) - 字符串空间
     */
    toString() {
        return `Stack[${this.items.join(', ')}] <- top`;
    }
}

// ==================== 队列的实现 ====================

/**
 * 基于数组的队列实现
 *
 * 核心思想：
 * 使用数组的开头作为队头，末尾作为队尾
 * 注意：shift操作是O(n)的，在大量数据时性能较差
 */
class ArrayQueue {
    constructor() {
        this.items = [];
    }

    /**
     * 入队操作
     * @param {*} element - 要入队的元素
     * @time O(1) - 数组末尾插入
     * @space O(1)
     */
    enqueue(element) {
        this.items.push(element);
    }

    /**
     * 出队操作
     * @returns {*} 队头元素，队列为空时返回undefined
     * @time O(n) - 需要移动所有元素
     * @space O(1)
     */
    dequeue() {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.items.shift();
    }

    /**
     * 查看队头元素（不删除）
     * @returns {*} 队头元素，队列为空时返回undefined
     * @time O(1) - 直接访问数组第一个元素
     * @space O(1)
     */
    front() {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.items[0];
    }

    /**
     * 查看队尾元素
     * @returns {*} 队尾元素，队列为空时返回undefined
     * @time O(1) - 直接访问数组最后一个元素
     * @space O(1)
     */
    rear() {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.items[this.items.length - 1];
    }

    /**
     * 检查队列是否为空
     * @returns {boolean} 是否为空
     * @time O(1)
     * @space O(1)
     */
    isEmpty() {
        return this.items.length === 0;
    }

    /**
     * 获取队列大小
     * @returns {number} 队列中元素的数量
     * @time O(1)
     * @space O(1)
     */
    size() {
        return this.items.length;
    }

    /**
     * 清空队列
     * @time O(1)
     * @space O(1)
     */
    clear() {
        this.items = [];
    }

    /**
     * 转换为数组（队头到队尾）
     * @returns {Array} 包含队列中所有元素的数组
     * @time O(n)
     * @space O(n)
     */
    toArray() {
        return [...this.items];
    }

    /**
     * 字符串表示
     * @returns {string} 队列的字符串表示
     * @time O(n)
     * @space O(n)
     */
    toString() {
        return `Queue[${this.items.join(', ')}] <- rear`;
    }
}

/**
 * 优化的队列实现（使用双指针）
 *
 * 核心思想：
 * 使用两个指针front和rear来标记队头和队尾
 * 避免shift操作，提高出队性能
 * 当空间浪费过多时进行压缩
 */
class OptimizedQueue {
    constructor() {
        this.items = [];
        this.frontIndex = 0;  // 队头指针
        this.rearIndex = 0;   // 队尾指针（下一个插入位置）
    }

    /**
     * 入队操作
     * @param {*} element - 要入队的元素
     * @time O(1) - 直接在指定位置插入
     * @space O(1)
     */
    enqueue(element) {
        this.items[this.rearIndex] = element;
        this.rearIndex++;
    }

    /**
     * 出队操作
     * @returns {*} 队头元素，队列为空时返回undefined
     * @time O(1) - 移动指针，不移动元素
     * @space O(1)
     */
    dequeue() {
        if (this.isEmpty()) {
            return undefined;
        }

        const element = this.items[this.frontIndex];
        delete this.items[this.frontIndex];  // 删除引用，帮助垃圾回收
        this.frontIndex++;

        // 当队列为空时重置指针
        if (this.frontIndex === this.rearIndex) {
            this.frontIndex = 0;
            this.rearIndex = 0;
        }

        // 当浪费空间过多时进行压缩
        if (this.frontIndex > this.items.length / 2) {
            this._compress();
        }

        return element;
    }

    /**
     * 压缩队列，移除前面的空位
     * @private
     * @time O(n) - 需要复制所有有效元素
     * @space O(n) - 新数组空间
     */
    _compress() {
        const newItems = [];
        for (let i = this.frontIndex; i < this.rearIndex; i++) {
            newItems.push(this.items[i]);
        }
        this.items = newItems;
        this.rearIndex = this.rearIndex - this.frontIndex;
        this.frontIndex = 0;
    }

    /**
     * 查看队头元素
     * @returns {*} 队头元素
     * @time O(1)
     * @space O(1)
     */
    front() {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.items[this.frontIndex];
    }

    /**
     * 查看队尾元素
     * @returns {*} 队尾元素
     * @time O(1)
     * @space O(1)
     */
    rear() {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.items[this.rearIndex - 1];
    }

    /**
     * 检查队列是否为空
     * @returns {boolean} 是否为空
     * @time O(1)
     * @space O(1)
     */
    isEmpty() {
        return this.frontIndex === this.rearIndex;
    }

    /**
     * 获取队列大小
     * @returns {number} 队列中元素的数量
     * @time O(1)
     * @space O(1)
     */
    size() {
        return this.rearIndex - this.frontIndex;
    }

    /**
     * 清空队列
     * @time O(1)
     * @space O(1)
     */
    clear() {
        this.items = [];
        this.frontIndex = 0;
        this.rearIndex = 0;
    }

    /**
     * 转换为数组
     * @returns {Array} 队列元素数组
     * @time O(n)
     * @space O(n)
     */
    toArray() {
        const result = [];
        for (let i = this.frontIndex; i < this.rearIndex; i++) {
            result.push(this.items[i]);
        }
        return result;
    }

    /**
     * 字符串表示
     * @returns {string} 队列的字符串表示
     * @time O(n)
     * @space O(n)
     */
    toString() {
        return `OptimizedQueue[${this.toArray().join(', ')}] <- rear`;
    }
}

// ==================== 双端队列的实现 ====================

/**
 * 双端队列（Deque）实现
 *
 * 核心思想：
 * 允许在队列的两端进行插入和删除操作
 * 结合了栈和队列的特性，更加灵活
 */
class Deque {
    constructor() {
        this.items = [];
    }

    /**
     * 在队头插入元素
     * @param {*} element - 要插入的元素
     * @time O(n) - 需要移动所有元素
     * @space O(1)
     */
    addFront(element) {
        this.items.unshift(element);
    }

    /**
     * 在队尾插入元素
     * @param {*} element - 要插入的元素
     * @time O(1) - 数组末尾插入
     * @space O(1)
     */
    addRear(element) {
        this.items.push(element);
    }

    /**
     * 从队头删除元素
     * @returns {*} 队头元素
     * @time O(n) - 需要移动所有元素
     * @space O(1)
     */
    removeFront() {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.items.shift();
    }

    /**
     * 从队尾删除元素
     * @returns {*} 队尾元素
     * @time O(1) - 数组末尾删除
     * @space O(1)
     */
    removeRear() {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.items.pop();
    }

    /**
     * 查看队头元素
     * @returns {*} 队头元素
     * @time O(1)
     * @space O(1)
     */
    peekFront() {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.items[0];
    }

    /**
     * 查看队尾元素
     * @returns {*} 队尾元素
     * @time O(1)
     * @space O(1)
     */
    peekRear() {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.items[this.items.length - 1];
    }

    /**
     * 检查是否为空
     * @returns {boolean} 是否为空
     * @time O(1)
     * @space O(1)
     */
    isEmpty() {
        return this.items.length === 0;
    }

    /**
     * 获取大小
     * @returns {number} 元素数量
     * @time O(1)
     * @space O(1)
     */
    size() {
        return this.items.length;
    }

    /**
     * 清空双端队列
     * @time O(1)
     * @space O(1)
     */
    clear() {
        this.items = [];
    }

    /**
     * 转换为数组
     * @returns {Array} 双端队列元素数组
     * @time O(n)
     * @space O(n)
     */
    toArray() {
        return [...this.items];
    }

    /**
     * 字符串表示
     * @returns {string} 双端队列的字符串表示
     * @time O(n)
     * @space O(n)
     */
    toString() {
        return `Deque[${this.items.join(', ')}]`;
    }
}

// ==================== 基于链表的实现 ====================

/**
 * 链表节点
 */
class ListNode {
    constructor(val = null, next = null) {
        this.val = val;
        this.next = next;
    }
}

/**
 * 基于链表的栈实现
 *
 * 核心思想：
 * 使用链表头部作为栈顶，所有操作都是O(1)
 * 不需要预分配空间，内存使用更灵活
 */
class LinkedStack {
    constructor() {
        this.head = null;  // 栈顶指针
        this.length = 0;
    }

    /**
     * 入栈操作
     * @param {*} element - 要入栈的元素
     * @time O(1) - 在链表头部插入
     * @space O(1) - 只需要一个新节点
     */
    push(element) {
        const newNode = new ListNode(element, this.head);
        this.head = newNode;
        this.length++;
    }

    /**
     * 出栈操作
     * @returns {*} 栈顶元素
     * @time O(1) - 删除链表头部
     * @space O(1)
     */
    pop() {
        if (this.isEmpty()) {
            return undefined;
        }

        const poppedValue = this.head.val;
        this.head = this.head.next;
        this.length--;
        return poppedValue;
    }

    /**
     * 查看栈顶元素
     * @returns {*} 栈顶元素
     * @time O(1)
     * @space O(1)
     */
    peek() {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.head.val;
    }

    /**
     * 检查是否为空
     * @returns {boolean} 是否为空
     * @time O(1)
     * @space O(1)
     */
    isEmpty() {
        return this.head === null;
    }

    /**
     * 获取栈大小
     * @returns {number} 栈中元素数量
     * @time O(1)
     * @space O(1)
     */
    size() {
        return this.length;
    }

    /**
     * 清空栈
     * @time O(1)
     * @space O(1)
     */
    clear() {
        this.head = null;
        this.length = 0;
    }

    /**
     * 转换为数组
     * @returns {Array} 栈中元素数组（栈底到栈顶）
     * @time O(n)
     * @space O(n)
     */
    toArray() {
        const result = [];
        let current = this.head;
        while (current) {
            result.unshift(current.val);  // 头插法，保持栈底到栈顶顺序
            current = current.next;
        }
        return result;
    }

    /**
     * 字符串表示
     * @returns {string} 栈的字符串表示
     * @time O(n)
     * @space O(n)
     */
    toString() {
        return `LinkedStack[${this.toArray().join(', ')}] <- top`;
    }
}

/**
 * 基于链表的队列实现
 *
 * 核心思想：
 * 使用链表头部作为队头，尾部作为队尾
 * 维护head和tail指针，所有操作都是O(1)
 */
class LinkedQueue {
    constructor() {
        this.head = null;  // 队头指针
        this.tail = null;  // 队尾指针
        this.length = 0;
    }

    /**
     * 入队操作
     * @param {*} element - 要入队的元素
     * @time O(1) - 在链表尾部插入
     * @space O(1)
     */
    enqueue(element) {
        const newNode = new ListNode(element);

        if (this.isEmpty()) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.tail.next = newNode;
            this.tail = newNode;
        }
        this.length++;
    }

    /**
     * 出队操作
     * @returns {*} 队头元素
     * @time O(1) - 删除链表头部
     * @space O(1)
     */
    dequeue() {
        if (this.isEmpty()) {
            return undefined;
        }

        const dequeuedValue = this.head.val;
        this.head = this.head.next;

        // 如果队列变空，更新tail指针
        if (this.head === null) {
            this.tail = null;
        }

        this.length--;
        return dequeuedValue;
    }

    /**
     * 查看队头元素
     * @returns {*} 队头元素
     * @time O(1)
     * @space O(1)
     */
    front() {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.head.val;
    }

    /**
     * 查看队尾元素
     * @returns {*} 队尾元素
     * @time O(1)
     * @space O(1)
     */
    rear() {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.tail.val;
    }

    /**
     * 检查是否为空
     * @returns {boolean} 是否为空
     * @time O(1)
     * @space O(1)
     */
    isEmpty() {
        return this.head === null;
    }

    /**
     * 获取队列大小
     * @returns {number} 队列中元素数量
     * @time O(1)
     * @space O(1)
     */
    size() {
        return this.length;
    }

    /**
     * 清空队列
     * @time O(1)
     * @space O(1)
     */
    clear() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }

    /**
     * 转换为数组
     * @returns {Array} 队列元素数组（队头到队尾）
     * @time O(n)
     * @space O(n)
     */
    toArray() {
        const result = [];
        let current = this.head;
        while (current) {
            result.push(current.val);
            current = current.next;
        }
        return result;
    }

    /**
     * 字符串表示
     * @returns {string} 队列的字符串表示
     * @time O(n)
     * @space O(n)
     */
    toString() {
        return `LinkedQueue[${this.toArray().join(', ')}] <- rear`;
    }
}

// ==================== 测试和演示 ====================

/**
 * 栈的基础操作测试
 */
function testStackOperations() {
    console.log("=== 栈的基础操作测试 ===");

    // 测试数组栈
    const arrayStack = new ArrayStack();
    console.log("数组栈测试:");
    arrayStack.push(1);
    arrayStack.push(2);
    arrayStack.push(3);
    console.log("入栈1,2,3后:", arrayStack.toString());
    console.log("栈顶元素:", arrayStack.peek());
    console.log("出栈:", arrayStack.pop());
    console.log("出栈后:", arrayStack.toString());
    console.log("栈大小:", arrayStack.size());
    console.log("是否为空:", arrayStack.isEmpty());

    // 测试链表栈
    const linkedStack = new LinkedStack();
    console.log("\n链表栈测试:");
    linkedStack.push(1);
    linkedStack.push(2);
    linkedStack.push(3);
    console.log("入栈1,2,3后:", linkedStack.toString());
    console.log("栈顶元素:", linkedStack.peek());
    console.log("出栈:", linkedStack.pop());
    console.log("出栈后:", linkedStack.toString());
    console.log("栈大小:", linkedStack.size());
    console.log("是否为空:", linkedStack.isEmpty());
}

/**
 * 队列的基础操作测试
 */
function testQueueOperations() {
    console.log("\n=== 队列的基础操作测试 ===");

    // 测试普通队列
    const arrayQueue = new ArrayQueue();
    console.log("数组队列测试:");
    arrayQueue.enqueue(1);
    arrayQueue.enqueue(2);
    arrayQueue.enqueue(3);
    console.log("入队1,2,3后:", arrayQueue.toString());
    console.log("队头元素:", arrayQueue.front());
    console.log("队尾元素:", arrayQueue.rear());
    console.log("出队:", arrayQueue.dequeue());
    console.log("出队后:", arrayQueue.toString());

    // 测试优化队列
    const optimizedQueue = new OptimizedQueue();
    console.log("\n优化队列测试:");
    optimizedQueue.enqueue(1);
    optimizedQueue.enqueue(2);
    optimizedQueue.enqueue(3);
    console.log("入队1,2,3后:", optimizedQueue.toString());
    console.log("出队:", optimizedQueue.dequeue());
    console.log("出队后:", optimizedQueue.toString());

    // 测试链表队列
    const linkedQueue = new LinkedQueue();
    console.log("\n链表队列测试:");
    linkedQueue.enqueue(1);
    linkedQueue.enqueue(2);
    linkedQueue.enqueue(3);
    console.log("入队1,2,3后:", linkedQueue.toString());
    console.log("队头元素:", linkedQueue.front());
    console.log("队尾元素:", linkedQueue.rear());
    console.log("出队:", linkedQueue.dequeue());
    console.log("出队后:", linkedQueue.toString());
}

/**
 * 双端队列操作测试
 */
function testDequeOperations() {
    console.log("\n=== 双端队列操作测试 ===");

    const deque = new Deque();
    console.log("双端队列测试:");

    // 从两端插入
    deque.addFront(2);
    deque.addRear(3);
    deque.addFront(1);
    deque.addRear(4);
    console.log("操作后:", deque.toString());  // [1, 2, 3, 4]

    // 查看两端
    console.log("队头元素:", deque.peekFront());  // 1
    console.log("队尾元素:", deque.peekRear());   // 4

    // 从两端删除
    console.log("队头删除:", deque.removeFront()); // 1
    console.log("队尾删除:", deque.removeRear());  // 4
    console.log("删除后:", deque.toString());      // [2, 3]
}

/**
 * 性能比较测试
 */
function performanceComparison() {
    console.log("\n=== 性能比较测试 ===");

    const testSize = 10000;

    // 测试栈性能
    console.log("栈性能测试:");

    // 数组栈
    console.time("数组栈 - 10000次push/pop");
    const arrayStack = new ArrayStack();
    for (let i = 0; i < testSize; i++) {
        arrayStack.push(i);
    }
    for (let i = 0; i < testSize; i++) {
        arrayStack.pop();
    }
    console.timeEnd("数组栈 - 10000次push/pop");

    // 链表栈
    console.time("链表栈 - 10000次push/pop");
    const linkedStack = new LinkedStack();
    for (let i = 0; i < testSize; i++) {
        linkedStack.push(i);
    }
    for (let i = 0; i < testSize; i++) {
        linkedStack.pop();
    }
    console.timeEnd("链表栈 - 10000次push/pop");

    // 测试队列性能
    console.log("\n队列性能测试:");

    // 普通数组队列
    console.time("数组队列 - 1000次enqueue/dequeue");
    const arrayQueue = new ArrayQueue();
    for (let i = 0; i < 1000; i++) {  // 减少测试规模，因为shift操作较慢
        arrayQueue.enqueue(i);
    }
    for (let i = 0; i < 1000; i++) {
        arrayQueue.dequeue();
    }
    console.timeEnd("数组队列 - 1000次enqueue/dequeue");

    // 优化队列
    console.time("优化队列 - 10000次enqueue/dequeue");
    const optimizedQueue = new OptimizedQueue();
    for (let i = 0; i < testSize; i++) {
        optimizedQueue.enqueue(i);
    }
    for (let i = 0; i < testSize; i++) {
        optimizedQueue.dequeue();
    }
    console.timeEnd("优化队列 - 10000次enqueue/dequeue");

    // 链表队列
    console.time("链表队列 - 10000次enqueue/dequeue");
    const linkedQueue = new LinkedQueue();
    for (let i = 0; i < testSize; i++) {
        linkedQueue.enqueue(i);
    }
    for (let i = 0; i < testSize; i++) {
        linkedQueue.dequeue();
    }
    console.timeEnd("链表队列 - 10000次enqueue/dequeue");
}

// 运行所有测试
if (typeof require !== 'undefined' && require.main === module) {
    testStackOperations();
    testQueueOperations();
    testDequeOperations();
    performanceComparison();

    console.log("\n=== 所有测试完成！ ===");
}

// 导出所有类，供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ArrayStack,
        ArrayQueue,
        OptimizedQueue,
        Deque,
        LinkedStack,
        LinkedQueue,
        ListNode
    };
}