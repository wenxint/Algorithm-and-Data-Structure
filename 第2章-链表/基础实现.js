/**
 * 第2章 - 链表基础实现
 *
 * 本文件包含：
 * 1. 单链表的完整实现
 * 2. 双链表的完整实现
 * 3. 基础操作方法
 * 4. 性能分析和测试用例
 */

// ========== 单链表节点定义 ==========

/**
 * 单链表节点类
 * 每个节点包含数据和指向下一个节点的指针
 */
class ListNode {
    /**
     * 构造函数
     * @param {*} val - 节点值
     * @param {ListNode} next - 下一个节点的引用
     */
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

// ========== 单链表完整实现 ==========

/**
 * 单链表数据结构实现
 *
 * 核心思想：
 * 链表是一种线性数据结构，通过指针连接节点
 * 相比数组，链表在插入和删除操作上更高效，但随机访问效率较低
 *
 * 主要特点：
 * - 动态大小：可以在运行时动态增减
 * - 内存效率：只分配需要的内存
 * - 插入删除效率：O(1)时间复杂度（已知位置时）
 */
class LinkedList {
    /**
     * 构造函数
     */
    constructor() {
        this.head = null;  // 头节点
        this.size = 0;     // 链表长度
    }

    /**
     * 获取链表长度
     * @returns {number} 链表长度
     * @time O(1)
     * @space O(1)
     */
    getSize() {
        return this.size;
    }

    /**
     * 检查链表是否为空
     * @returns {boolean} 是否为空
     * @time O(1)
     * @space O(1)
     */
    isEmpty() {
        return this.size === 0;
    }

    /**
     * 在链表头部添加元素
     * @param {*} val - 要添加的值
     * @time O(1)
     * @space O(1)
     */
    prepend(val) {
        const newNode = new ListNode(val, this.head);
        this.head = newNode;
        this.size++;
    }

    /**
     * 在链表尾部添加元素
     * @param {*} val - 要添加的值
     * @time O(n)
     * @space O(1)
     */
    append(val) {
        const newNode = new ListNode(val);

        if (this.head === null) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next !== null) {
                current = current.next;
            }
            current.next = newNode;
        }
        this.size++;
    }

    /**
     * 在指定索引位置插入元素
     * @param {number} index - 插入位置
     * @param {*} val - 要插入的值
     * @time O(n)
     * @space O(1)
     */
    insertAt(index, val) {
        if (index < 0 || index > this.size) {
            throw new Error('Index out of bounds');
        }

        if (index === 0) {
            this.prepend(val);
            return;
        }

        const newNode = new ListNode(val);
        let current = this.head;

        // 找到插入位置的前一个节点
        for (let i = 0; i < index - 1; i++) {
            current = current.next;
        }

        newNode.next = current.next;
        current.next = newNode;
        this.size++;
    }

    /**
     * 删除头节点
     * @returns {*} 被删除的值
     * @time O(1)
     * @space O(1)
     */
    removeFirst() {
        if (this.head === null) {
            throw new Error('List is empty');
        }

        const removedVal = this.head.val;
        this.head = this.head.next;
        this.size--;
        return removedVal;
    }

    /**
     * 删除尾节点
     * @returns {*} 被删除的值
     * @time O(n)
     * @space O(1)
     */
    removeLast() {
        if (this.head === null) {
            throw new Error('List is empty');
        }

        if (this.head.next === null) {
            const removedVal = this.head.val;
            this.head = null;
            this.size--;
            return removedVal;
        }

        let current = this.head;
        while (current.next.next !== null) {
            current = current.next;
        }

        const removedVal = current.next.val;
        current.next = null;
        this.size--;
        return removedVal;
    }

    /**
     * 删除指定索引的元素
     * @param {number} index - 要删除的索引
     * @returns {*} 被删除的值
     * @time O(n)
     * @space O(1)
     */
    removeAt(index) {
        if (index < 0 || index >= this.size) {
            throw new Error('Index out of bounds');
        }

        if (index === 0) {
            return this.removeFirst();
        }

        let current = this.head;
        for (let i = 0; i < index - 1; i++) {
            current = current.next;
        }

        const removedVal = current.next.val;
        current.next = current.next.next;
        this.size--;
        return removedVal;
    }

    /**
     * 获取指定索引的元素
     * @param {number} index - 索引
     * @returns {*} 元素值
     * @time O(n)
     * @space O(1)
     */
    get(index) {
        if (index < 0 || index >= this.size) {
            throw new Error('Index out of bounds');
        }

        let current = this.head;
        for (let i = 0; i < index; i++) {
            current = current.next;
        }
        return current.val;
    }

    /**
     * 查找元素的索引
     * @param {*} val - 要查找的值
     * @returns {number} 元素索引，未找到返回-1
     * @time O(n)
     * @space O(1)
     */
    indexOf(val) {
        let current = this.head;
        let index = 0;

        while (current !== null) {
            if (current.val === val) {
                return index;
            }
            current = current.next;
            index++;
        }
        return -1;
    }

    /**
     * 检查是否包含指定元素
     * @param {*} val - 要查找的值
     * @returns {boolean} 是否包含
     * @time O(n)
     * @space O(1)
     */
    contains(val) {
        return this.indexOf(val) !== -1;
    }

    /**
     * 转换为数组
     * @returns {Array} 数组表示
     * @time O(n)
     * @space O(n)
     */
    toArray() {
        const result = [];
        let current = this.head;
        while (current !== null) {
            result.push(current.val);
            current = current.next;
        }
        return result;
    }

    /**
     * 反转链表
     * @time O(n)
     * @space O(1)
     */
    reverse() {
        let prev = null;
        let current = this.head;

        while (current !== null) {
            const next = current.next;  // 保存下一个节点
            current.next = prev;        // 反转当前连接
            prev = current;             // prev后移
            current = next;             // current后移
        }

        this.head = prev;  // 更新头节点
    }

    /**
     * 清空链表
     * @time O(1)
     * @space O(1)
     */
    clear() {
        this.head = null;
        this.size = 0;
    }

    /**
     * 字符串表示
     * @returns {string} 字符串表示
     */
    toString() {
        if (this.head === null) {
            return 'Empty List';
        }

        const values = this.toArray();
        return values.join(' -> ') + ' -> null';
    }
}

// ========== 双链表节点定义 ==========

/**
 * 双链表节点类
 * 每个节点包含数据和指向前后节点的指针
 */
class DoublyListNode {
    /**
     * 构造函数
     * @param {*} val - 节点值
     * @param {DoublyListNode} prev - 前一个节点
     * @param {DoublyListNode} next - 下一个节点
     */
    constructor(val = 0, prev = null, next = null) {
        this.val = val;
        this.prev = prev;
        this.next = next;
    }
}

// ========== 双链表完整实现 ==========

/**
 * 双链表数据结构实现
 *
 * 核心思想：
 * 双链表相比单链表，每个节点都有指向前一个节点的指针
 * 这使得双向遍历和删除操作更加高效
 *
 * 主要特点：
 * - 双向遍历：可以从头到尾或从尾到头遍历
 * - 删除效率：已知节点时删除为O(1)
 * - 空间代价：每个节点需要额外的prev指针
 */
class DoublyLinkedList {
    /**
     * 构造函数
     */
    constructor() {
        this.head = null;  // 头节点
        this.tail = null;  // 尾节点
        this.size = 0;     // 链表长度
    }

    /**
     * 获取链表长度
     * @returns {number} 链表长度
     * @time O(1)
     * @space O(1)
     */
    getSize() {
        return this.size;
    }

    /**
     * 检查链表是否为空
     * @returns {boolean} 是否为空
     * @time O(1)
     * @space O(1)
     */
    isEmpty() {
        return this.size === 0;
    }

    /**
     * 在头部添加元素
     * @param {*} val - 要添加的值
     * @time O(1)
     * @space O(1)
     */
    prepend(val) {
        const newNode = new DoublyListNode(val);

        if (this.head === null) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            newNode.next = this.head;
            this.head.prev = newNode;
            this.head = newNode;
        }
        this.size++;
    }

    /**
     * 在尾部添加元素
     * @param {*} val - 要添加的值
     * @time O(1)
     * @space O(1)
     */
    append(val) {
        const newNode = new DoublyListNode(val);

        if (this.tail === null) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.tail.next = newNode;
            newNode.prev = this.tail;
            this.tail = newNode;
        }
        this.size++;
    }

    /**
     * 删除头节点
     * @returns {*} 被删除的值
     * @time O(1)
     * @space O(1)
     */
    removeFirst() {
        if (this.head === null) {
            throw new Error('List is empty');
        }

        const removedVal = this.head.val;

        if (this.head === this.tail) {
            // 只有一个节点
            this.head = null;
            this.tail = null;
        } else {
            this.head = this.head.next;
            this.head.prev = null;
        }

        this.size--;
        return removedVal;
    }

    /**
     * 删除尾节点
     * @returns {*} 被删除的值
     * @time O(1)
     * @space O(1)
     */
    removeLast() {
        if (this.tail === null) {
            throw new Error('List is empty');
        }

        const removedVal = this.tail.val;

        if (this.head === this.tail) {
            // 只有一个节点
            this.head = null;
            this.tail = null;
        } else {
            this.tail = this.tail.prev;
            this.tail.next = null;
        }

        this.size--;
        return removedVal;
    }

    /**
     * 删除指定节点
     * @param {DoublyListNode} node - 要删除的节点
     * @time O(1)
     * @space O(1)
     */
    removeNode(node) {
        if (node === this.head) {
            this.removeFirst();
        } else if (node === this.tail) {
            this.removeLast();
        } else {
            node.prev.next = node.next;
            node.next.prev = node.prev;
            this.size--;
        }
    }

    /**
     * 正向遍历转数组
     * @returns {Array} 数组表示
     * @time O(n)
     * @space O(n)
     */
    toArrayForward() {
        const result = [];
        let current = this.head;
        while (current !== null) {
            result.push(current.val);
            current = current.next;
        }
        return result;
    }

    /**
     * 反向遍历转数组
     * @returns {Array} 数组表示
     * @time O(n)
     * @space O(n)
     */
    toArrayBackward() {
        const result = [];
        let current = this.tail;
        while (current !== null) {
            result.push(current.val);
            current = current.prev;
        }
        return result;
    }

    /**
     * 字符串表示
     * @returns {string} 字符串表示
     */
    toString() {
        if (this.head === null) {
            return 'Empty DoublyLinkedList';
        }

        const values = this.toArrayForward();
        return 'null <- ' + values.join(' <-> ') + ' -> null';
    }
}

// ========== 测试和演示代码 ==========

console.log('=== 单链表测试 ===');

// 创建单链表实例
const list = new LinkedList();

// 测试添加操作
console.log('添加元素：');
list.append(1);
list.append(2);
list.append(3);
list.prepend(0);
console.log('当前链表：', list.toString());  // 0 -> 1 -> 2 -> 3 -> null
console.log('链表长度：', list.getSize());    // 4

// 测试插入操作
console.log('\n插入元素：');
list.insertAt(2, 1.5);
console.log('在索引2插入1.5后：', list.toString());  // 0 -> 1 -> 1.5 -> 2 -> 3 -> null

// 测试访问操作
console.log('\n访问元素：');
console.log('索引2的元素：', list.get(2));           // 1.5
console.log('元素2的索引：', list.indexOf(2));       // 3
console.log('是否包含元素3：', list.contains(3));    // true

// 测试删除操作
console.log('\n删除元素：');
console.log('删除第一个元素：', list.removeFirst()); // 0
console.log('删除最后一个元素：', list.removeLast()); // 3
console.log('删除索引1的元素：', list.removeAt(1));   // 1.5
console.log('删除后的链表：', list.toString());       // 1 -> 2 -> null

// 测试反转操作
console.log('\n反转链表：');
list.reverse();
console.log('反转后：', list.toString());             // 2 -> 1 -> null

console.log('\n=== 双链表测试 ===');

// 创建双链表实例
const doublyList = new DoublyLinkedList();

// 测试添加操作
console.log('添加元素：');
doublyList.append(1);
doublyList.append(2);
doublyList.append(3);
doublyList.prepend(0);
console.log('当前双链表：', doublyList.toString());

// 测试正反向遍历
console.log('\n遍历测试：');
console.log('正向遍历：', doublyList.toArrayForward());   // [0, 1, 2, 3]
console.log('反向遍历：', doublyList.toArrayBackward());  // [3, 2, 1, 0]

// 测试删除操作
console.log('\n删除操作：');
console.log('删除第一个元素：', doublyList.removeFirst()); // 0
console.log('删除最后一个元素：', doublyList.removeLast()); // 3
console.log('删除后的双链表：', doublyList.toString());

// 性能对比测试
console.log('\n=== 性能对比测试 ===');

function performanceTest() {
    const arrayList = [];
    const linkedList = new LinkedList();
    const n = 1000;

    // 数组头部插入测试
    console.time('数组头部插入1000次');
    for (let i = 0; i < n; i++) {
        arrayList.unshift(i);
    }
    console.timeEnd('数组头部插入1000次');

    // 链表头部插入测试
    console.time('链表头部插入1000次');
    for (let i = 0; i < n; i++) {
        linkedList.prepend(i);
    }
    console.timeEnd('链表头部插入1000次');

    // 数组随机访问测试
    console.time('数组随机访问1000次');
    for (let i = 0; i < n; i++) {
        const index = Math.floor(Math.random() * arrayList.length);
        arrayList[index];
    }
    console.timeEnd('数组随机访问1000次');

    // 链表随机访问测试
    console.time('链表随机访问1000次');
    for (let i = 0; i < n; i++) {
        const index = Math.floor(Math.random() * linkedList.getSize());
        linkedList.get(index);
    }
    console.timeEnd('链表随机访问1000次');
}

performanceTest();

// 导出类和函数供其他模块使用
module.exports = {
    ListNode,
    LinkedList,
    DoublyListNode,
    DoublyLinkedList
};