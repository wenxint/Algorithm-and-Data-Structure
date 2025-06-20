# 第2章：链表

## 📚 章节概述

链表是一种线性数据结构，通过指针将节点连接起来，与数组不同的是链表在内存中不连续存储。在前端开发中，链表的思想广泛应用于DOM树遍历、事件处理链、状态管理等场景。本章将深入讲解链表的核心算法思想：**快慢指针技术**、**递归处理**和**双指针操作**。

## 🔧 链表基础结构

### 单链表节点定义
```javascript
// 链表节点类
class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;      // 节点值
        this.next = next;    // 指向下一个节点的指针
    }
}

// 创建链表节点
const node1 = new ListNode(1);
const node2 = new ListNode(2);
const node3 = new ListNode(3);

// 连接节点形成链表：1 -> 2 -> 3 -> null
node1.next = node2;
node2.next = node3;

console.log(node1.val);      // 1
console.log(node1.next.val); // 2
```

### 双链表节点定义
```javascript
// 双链表节点类
class DoublyListNode {
    constructor(val = 0, prev = null, next = null) {
        this.val = val;      // 节点值
        this.prev = prev;    // 指向前一个节点的指针
        this.next = next;    // 指向下一个节点的指针
    }
}

// 创建双链表：null <- 1 <-> 2 <-> 3 -> null
const dNode1 = new DoublyListNode(1);
const dNode2 = new DoublyListNode(2);
const dNode3 = new DoublyListNode(3);

dNode1.next = dNode2;
dNode2.prev = dNode1;
dNode2.next = dNode3;
dNode3.prev = dNode2;
```

## 🔧 链表常见操作

### 遍历链表
```javascript
/**
 * 遍历链表并打印所有节点值
 */
function traverseList(head) {
    let current = head;
    const values = [];

    while (current !== null) {
        values.push(current.val);
        current = current.next;  // 移动到下一个节点
    }

    return values;
}

// 使用示例
const head = new ListNode(1, new ListNode(2, new ListNode(3)));
console.log(traverseList(head));  // [1, 2, 3]
```

### 在头部插入节点
```javascript
/**
 * 在链表头部插入新节点
 */
function insertAtHead(head, val) {
    const newNode = new ListNode(val);
    newNode.next = head;    // 新节点指向原头节点
    return newNode;         // 返回新的头节点
}

// 使用示例
let head = new ListNode(2, new ListNode(3));
head = insertAtHead(head, 1);  // 1 -> 2 -> 3
console.log(traverseList(head));  // [1, 2, 3]
```

### 在尾部插入节点
```javascript
/**
 * 在链表尾部插入新节点
 */
function insertAtTail(head, val) {
    const newNode = new ListNode(val);

    // 空链表情况
    if (head === null) {
        return newNode;
    }

    // 找到最后一个节点
    let current = head;
    while (current.next !== null) {
        current = current.next;
    }

    current.next = newNode;  // 连接新节点
    return head;
}

// 使用示例
let head = new ListNode(1, new ListNode(2));
head = insertAtTail(head, 3);  // 1 -> 2 -> 3
console.log(traverseList(head));  // [1, 2, 3]
```

### 删除指定值的节点
```javascript
/**
 * 删除链表中所有值为val的节点
 */
function removeElements(head, val) {
    // 创建虚拟头节点，简化删除头节点的处理
    const dummy = new ListNode(0);
    dummy.next = head;

    let current = dummy;

    while (current.next !== null) {
        if (current.next.val === val) {
            current.next = current.next.next;  // 跳过要删除的节点
        } else {
            current = current.next;  // 移动到下一个节点
        }
    }

    return dummy.next;  // 返回真实的头节点
}

// 使用示例
let head = new ListNode(1, new ListNode(2, new ListNode(1, new ListNode(3))));
head = removeElements(head, 1);  // 2 -> 3
console.log(traverseList(head));  // [2, 3]
```

### 查找链表中的元素
```javascript
/**
 * 查找链表中指定值的节点
 */
function findNode(head, val) {
    let current = head;
    let index = 0;

    while (current !== null) {
        if (current.val === val) {
            return { node: current, index: index };
        }
        current = current.next;
        index++;
    }

    return null;  // 未找到
}

// 使用示例
const head = new ListNode(1, new ListNode(2, new ListNode(3)));
const result = findNode(head, 2);
console.log(result);  // { node: ListNode, index: 1 }
```

## 💡 链表与数组的对比

### 性能对比
```javascript
// 数组操作
const arr = [1, 2, 3, 4, 5];

// O(1) - 随机访问
console.log(arr[2]);  // 3

// O(n) - 插入到开头（需要移动所有元素）
arr.unshift(0);  // [0, 1, 2, 3, 4, 5]

// 链表操作
let head = new ListNode(1, new ListNode(2, new ListNode(3)));

// O(n) - 访问第3个元素（需要遍历）
function getNodeAt(head, index) {
    let current = head;
    for (let i = 0; i < index && current; i++) {
        current = current.next;
    }
    return current;
}

// O(1) - 插入到开头
head = insertAtHead(head, 0);  // 0 -> 1 -> 2 -> 3
```

### 使用场景对比
```javascript
// 数组适用场景：需要频繁随机访问
function binarySearch(arr, target) {
    let left = 0, right = arr.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) return mid;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

// 链表适用场景：频繁插入删除操作
class LinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }

    // O(1) 头部插入
    prepend(val) {
        this.head = new ListNode(val, this.head);
        this.size++;
    }

    // O(1) 删除头节点
    removeFirst() {
        if (this.head) {
            this.head = this.head.next;
            this.size--;
        }
    }
}
```

## 🎯 快慢指针技术

### 核心思想

**快慢指针是在链表中使用两个移动速度不同的指针来解决问题的技术**。通常快指针每次移动2步，慢指针每次移动1步，这种速度差可以帮我们检测环、找中点等。

### 解题思想

快慢指针的核心应用场景：
1. **环检测**：快指针如果遇到慢指针，说明存在环
2. **找中点**：当快指针到达末尾时，慢指针正好在中点
3. **找倒数第k个节点**：快指针先走k步，然后同速移动

**什么时候使用快慢指针？**
- 需要检测链表中是否有环
- 需要找到链表的中点
- 需要找到倒数第N个节点
- 需要判断链表是否为回文

### 经典应用：检测链表中的环

**核心思想**：如果链表中存在环，快指针最终会追上慢指针。就像操场跑步，跑得快的人总会追上跑得慢的人。

```javascript
/**
 * 检测链表中是否存在环
 * 核心思想：快慢指针，如果有环快指针必定会追上慢指针
 */
function hasCycle(head) {
    if (!head || !head.next) {
        return false;  // 空链表或单节点无环
    }

    let slow = head;      // 慢指针，每次移动1步
    let fast = head;      // 快指针，每次移动2步

    while (fast && fast.next) {
        slow = slow.next;        // 慢指针移动1步
        fast = fast.next.next;   // 快指针移动2步

        if (slow === fast) {
            return true;  // 快慢指针相遇，存在环
        }
    }

    return false;  // 快指针到达末尾，无环
}

// 使用示例
// 创建有环链表：1 -> 2 -> 3 -> 2 (环)
const node1 = new ListNode(1);
const node2 = new ListNode(2);
const node3 = new ListNode(3);
node1.next = node2;
node2.next = node3;
node3.next = node2;  // 形成环

console.log(hasCycle(node1));  // true

// 创建无环链表：1 -> 2 -> 3 -> null
const head2 = new ListNode(1, new ListNode(2, new ListNode(3)));
console.log(hasCycle(head2));  // false
```

### 经典应用：找链表的中点

**核心思想**：当快指针到达链表末尾时，慢指针正好位于链表中点。

```javascript
/**
 * 找到链表的中间节点
 * 核心思想：快指针走2步，慢指针走1步，快指针到末尾时慢指针在中点
 */
function findMiddle(head) {
    if (!head) return null;

    let slow = head;      // 慢指针
    let fast = head;      // 快指针

    // 快指针每次走2步，慢指针每次走1步
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
    }

    return slow;  // 慢指针指向中间节点
}

// 使用示例
// 奇数个节点：1 -> 2 -> 3 -> 4 -> 5
const head1 = new ListNode(1, new ListNode(2, new ListNode(3,
    new ListNode(4, new ListNode(5)))));
console.log(findMiddle(head1).val);  // 3

// 偶数个节点：1 -> 2 -> 3 -> 4
const head2 = new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(4))));
console.log(findMiddle(head2).val);  // 3 (返回第二个中间节点)
```

## 🎯 递归处理技术

### 核心思想

**递归是一种将大问题分解为相同子问题的解决方法**。在链表中，递归特别适合处理"对每个节点执行相同操作"的问题。

### 解题思想

递归处理链表的基本模式：
1. **基础情况**：链表为空或只有一个节点
2. **递归情况**：处理当前节点，然后递归处理剩余部分
3. **组合结果**：将当前节点的处理结果与递归结果组合

**什么时候使用递归？**
- 需要反转链表
- 需要删除特定节点
- 需要合并多个链表
- 需要计算链表的某种属性

### 经典应用：递归反转链表

**核心思想**：将反转链表问题分解为"反转除第一个节点外的剩余部分，然后将第一个节点连接到末尾"。

```javascript
/**
 * 递归反转链表
 * 核心思想：递归反转后面部分，然后调整当前节点的连接
 */
function reverseList(head) {
    // 基础情况：空链表或单节点
    if (!head || !head.next) {
        return head;
    }

    // 递归反转后面的部分
    const newHead = reverseList(head.next);

    // 调整指针：让下一个节点指向当前节点
    head.next.next = head;  // 反转当前连接
    head.next = null;       // 断开原来的连接

    return newHead;  // 返回新的头节点
}

// 使用示例
const head = new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(4))));
console.log("原链表:", traverseList(head));      // [1, 2, 3, 4]

const reversed = reverseList(head);
console.log("反转后:", traverseList(reversed));  // [4, 3, 2, 1]
```

### 经典应用：递归合并两个有序链表

**核心思想**：比较两个链表的头节点，选择较小的作为结果头节点，然后递归合并剩余部分。

```javascript
/**
 * 合并两个有序链表
 * 核心思想：递归比较头节点，选择较小的节点然后合并剩余部分
 */
function mergeTwoLists(list1, list2) {
    // 基础情况：其中一个链表为空
    if (!list1) return list2;
    if (!list2) return list1;

    // 比较头节点，选择较小的作为结果头节点
    if (list1.val <= list2.val) {
        list1.next = mergeTwoLists(list1.next, list2);  // 递归合并
        return list1;
    } else {
        list2.next = mergeTwoLists(list1, list2.next);  // 递归合并
        return list2;
    }
}

// 使用示例
const list1 = new ListNode(1, new ListNode(2, new ListNode(4)));  // 1->2->4
const list2 = new ListNode(1, new ListNode(3, new ListNode(4)));  // 1->3->4

const merged = mergeTwoLists(list1, list2);
console.log(traverseList(merged));  // [1, 1, 2, 3, 4, 4]
```

## 🎯 双指针操作技术

### 核心思想

**双指针操作是使用两个指针协同工作来解决链表问题的技术**。与快慢指针不同，这里的双指针通常以相同速度移动，但有不同的目的。

### 解题思想

双指针操作的常见模式：
1. **虚拟头节点**：简化边界条件处理
2. **前驱指针**：用于删除操作
3. **距离控制**：维持指针间的固定距离

**什么时候使用双指针操作？**
- 需要删除特定位置的节点
- 需要找倒数第K个节点
- 需要分割或重组链表

### 经典应用：删除倒数第N个节点

**核心思想**：使用两个指针，让它们保持N的距离，当前面的指针到达末尾时，后面的指针正好指向倒数第N个节点的前一个位置。

```javascript
/**
 * 删除链表的倒数第N个节点
 * 核心思想：双指针保持N的距离，前指针到末尾时后指针定位到目标位置
 */
function removeNthFromEnd(head, n) {
    // 创建虚拟头节点，简化删除头节点的情况
    const dummy = new ListNode(0);
    dummy.next = head;

    let first = dummy;   // 第一个指针
    let second = dummy;  // 第二个指针

    // 第一个指针先移动n+1步
    for (let i = 0; i <= n; i++) {
        first = first.next;
    }

    // 两个指针同时移动，直到第一个指针到达末尾
    while (first !== null) {
        first = first.next;
        second = second.next;
    }

    // 此时second指向倒数第n个节点的前一个节点
    second.next = second.next.next;  // 删除倒数第n个节点

    return dummy.next;
}

// 使用示例
const head = new ListNode(1, new ListNode(2, new ListNode(3,
    new ListNode(4, new ListNode(5)))));  // 1->2->3->4->5

const result = removeNthFromEnd(head, 2);  // 删除倒数第2个节点(4)
console.log(traverseList(result));  // [1, 2, 3, 5]
```

### 经典应用：旋转链表

**核心思想**：先将链表连成环，然后在正确的位置断开形成新的链表。

```javascript
/**
 * 向右旋转链表k个位置
 * 核心思想：连成环然后在正确位置断开
 */
function rotateRight(head, k) {
    if (!head || !head.next || k === 0) {
        return head;
    }

    // 计算链表长度并连成环
    let length = 1;
    let tail = head;
    while (tail.next) {
        tail = tail.next;
        length++;
    }
    tail.next = head;  // 连成环

    // 计算新头节点的位置
    k = k % length;  // 处理k大于链表长度的情况
    const stepsToNewHead = length - k;

    // 找到新头节点的前一个节点
    let newTail = head;
    for (let i = 1; i < stepsToNewHead; i++) {
        newTail = newTail.next;
    }

    const newHead = newTail.next;
    newTail.next = null;  // 断开环

    return newHead;
}

// 使用示例
const head = new ListNode(1, new ListNode(2, new ListNode(3,
    new ListNode(4, new ListNode(5)))));  // 1->2->3->4->5

const rotated = rotateRight(head, 2);  // 向右旋转2位
console.log(traverseList(rotated));  // [4, 5, 1, 2, 3]
```

## 🎯 算法思想总结

### 时间复杂度对比

| 操作类型 | 数组 | 链表 | 优化思想 |
|---------|------|------|----------|
| 随机访问 | O(1) | O(n) | 数组使用索引直接访问 |
| 头部插入 | O(n) | O(1) | 链表只需调整指针 |
| 尾部插入 | O(1) | O(n) | 链表需遍历到末尾 |
| 删除节点 | O(n) | O(1) | 链表已知前驱节点时 |
| 查找元素 | O(n) | O(n) | 都需要遍历查找 |

### 核心设计思想

1. **快慢指针技术**：利用速度差解决环检测、中点查找等问题
2. **递归处理技术**：将复杂问题分解为相同的子问题，简化逻辑
3. **双指针操作技术**：通过指针协作实现复杂的链表操作

链表虽然在随机访问方面不如数组，但在动态插入删除方面有着明显优势，是实现其他复杂数据结构的基础。掌握这些核心技术，就能灵活处理各种链表相关问题。