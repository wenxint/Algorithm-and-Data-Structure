/**
 * LeetCode 61. 旋转链表
 *
 * 问题描述：
 * 给你一个链表的头节点 head ，旋转链表，将链表每个节点向右移动 k 个位置。
 *
 * 核心思想：
 * 1. 先计算链表长度
 * 2. 将链表首尾相连形成环
 * 3. 找到新的尾节点位置（长度 - k % 长度 - 1）
 * 4. 断开环形成新的链表
 *
 * 数学原理：
 * 向右旋转k位等价于向右旋转k%length位
 * 新的头节点在原链表的第(length - k%length)位置
 *
 * 示例：
 * 输入：head = [1,2,3,4,5], k = 2
 * 输出：[4,5,1,2,3]
 * 解释：向右旋转2位，4和5移到前面
 */

/**
 * 链表节点定义
 */
function ListNode(val, next) {
    this.val = (val === undefined ? 0 : val);
    this.next = (next === undefined ? null : next);
}

/**
 * 旋转链表 - 环形连接法（面试推荐）
 * @param {ListNode} head - 链表头节点
 * @param {number} k - 旋转位数
 * @return {ListNode} 旋转后的链表头节点
 * @time O(n) 时间复杂度
 * @space O(1) 空间复杂度
 */
function rotateRight(head, k) {
    // 边界条件处理
    if (!head || !head.next || k === 0) return head;

    // 第一步：计算链表长度并找到尾节点
    let length = 1;
    let tail = head;
    while (tail.next) {
        tail = tail.next;
        length++;
    }

    // 第二步：形成环形链表
    tail.next = head;

    // 第三步：计算实际旋转位数
    k = k % length;
    if (k === 0) {
        // 不需要旋转，断开环
        tail.next = null;
        return head;
    }

    // 第四步：找到新的尾节点（向前走 length - k 步）
    let newTail = head;
    for (let i = 0; i < length - k - 1; i++) {
        newTail = newTail.next;
    }

    // 第五步：新头节点是新尾节点的下一个
    const newHead = newTail.next;

    // 第六步：断开环
    newTail.next = null;

    return newHead;
}

/**
 * 旋转链表 - 双指针法
 * @param {ListNode} head - 链表头节点
 * @param {number} k - 旋转位数
 * @return {ListNode} 旋转后的链表头节点
 * @time O(n) 时间复杂度
 * @space O(1) 空间复杂度
 */
function rotateRightTwoPointers(head, k) {
    if (!head || !head.next || k === 0) return head;

    // 计算链表长度
    let length = 0;
    let current = head;
    while (current) {
        length++;
        current = current.next;
    }

    // 计算实际旋转位数
    k = k % length;
    if (k === 0) return head;

    // 使用双指针找到分割点
    let slow = head;
    let fast = head;

    // fast先走k步
    for (let i = 0; i < k; i++) {
        fast = fast.next;
    }

    // 两指针同时移动，直到fast到达尾节点
    while (fast.next) {
        slow = slow.next;
        fast = fast.next;
    }

    // 此时slow指向新的尾节点
    const newHead = slow.next;
    slow.next = null;
    fast.next = head;

    return newHead;
}

/**
 * 旋转链表 - 详细分析版本
 * @param {ListNode} head - 链表头节点
 * @param {number} k - 旋转位数
 * @return {ListNode} 旋转后的链表头节点
 */
function rotateRightWithAnalysis(head, k) {
    if (!head || !head.next || k === 0) {
        console.log('边界条件：空链表、单节点或不旋转');
        return head;
    }

    console.log(`开始旋转链表，k = ${k}`);

    // 打印原始链表
    console.log('原始链表:', printList(head));

    // 计算长度
    let length = 1;
    let tail = head;
    while (tail.next) {
        tail = tail.next;
        length++;
    }

    console.log(`链表长度: ${length}`);

    // 计算实际旋转位数
    const originalK = k;
    k = k % length;
    console.log(`原始k: ${originalK}, 优化后k: ${k}`);

    if (k === 0) {
        console.log('k是长度的倍数，无需旋转');
        return head;
    }

    // 形成环形链表
    tail.next = head;
    console.log('已形成环形链表');

    // 找到新的尾节点
    let newTail = head;
    for (let i = 0; i < length - k - 1; i++) {
        newTail = newTail.next;
    }

    const newHead = newTail.next;
    console.log(`新头节点值: ${newHead.val}`);
    console.log(`新尾节点值: ${newTail.val}`);

    // 断开环
    newTail.next = null;
    console.log('已断开环形链表');

    console.log('旋转后链表:', printList(newHead));

    return newHead;
}

/**
 * 旋转链表 - 递归实现
 * @param {ListNode} head - 链表头节点
 * @param {number} k - 旋转位数
 * @return {ListNode} 旋转后的链表头节点
 */
function rotateRightRecursive(head, k) {
    if (!head || !head.next || k === 0) return head;

    // 辅助函数：获取链表长度
    function getLength(node) {
        return node ? 1 + getLength(node.next) : 0;
    }

    // 辅助函数：递归旋转
    function rotate(node, steps) {
        if (steps === 0) return node;

        // 找到倒数第二个节点
        let prev = null;
        let current = node;
        while (current.next) {
            prev = current;
            current = current.next;
        }

        // 将最后一个节点移到前面
        if (prev) {
            prev.next = null;
            current.next = node;
        }

        return rotate(current, steps - 1);
    }

    const length = getLength(head);
    k = k % length;

    return rotate(head, k);
}

/**
 * 构建测试用的链表
 * @param {number[]} values - 节点值数组
 * @return {ListNode} 链表头节点
 */
function createLinkedList(values) {
    if (!values || values.length === 0) return null;

    const head = new ListNode(values[0]);
    let current = head;

    for (let i = 1; i < values.length; i++) {
        current.next = new ListNode(values[i]);
        current = current.next;
    }

    return head;
}

/**
 * 打印链表
 * @param {ListNode} head - 链表头节点
 * @return {string} 链表的字符串表示
 */
function printList(head) {
    const values = [];
    let current = head;
    let count = 0;

    while (current && count < 20) { // 防止环形链表导致无限循环
        values.push(current.val);
        current = current.next;
        count++;
    }

    if (current) {
        values.push('...');
    }

    return `[${values.join(' -> ')}]`;
}

/**
 * 链表转数组（用于测试验证）
 * @param {ListNode} head - 链表头节点
 * @return {number[]} 节点值数组
 */
function listToArray(head) {
    const result = [];
    let current = head;

    while (current) {
        result.push(current.val);
        current = current.next;
    }

    return result;
}

/**
 * 获取旋转操作的详细信息
 * @param {number[]} values - 原始数组
 * @param {number} k - 旋转位数
 * @return {object} 旋转信息
 */
function getRotationInfo(values, k) {
    const length = values.length;
    const effectiveK = k % length;

    const rotatedArray = [...values.slice(-effectiveK), ...values.slice(0, -effectiveK)];

    return {
        originalArray: values,
        rotatedArray,
        originalK: k,
        effectiveK,
        length,
        rotationSteps: effectiveK
    };
}

/**
 * 测试函数
 */
function testRotateRight() {
    const testCases = [
        {
            values: [1, 2, 3, 4, 5],
            k: 2,
            expected: [4, 5, 1, 2, 3],
            description: "标准用例：向右旋转2位"
        },
        {
            values: [0, 1, 2],
            k: 4,
            expected: [2, 0, 1],
            description: "k > length：旋转4位等价于旋转1位"
        },
        {
            values: [1, 2],
            k: 1,
            expected: [2, 1],
            description: "两节点链表：交换位置"
        },
        {
            values: [1],
            k: 1,
            expected: [1],
            description: "单节点：无论旋转多少次都不变"
        },
        {
            values: [1, 2, 3, 4, 5],
            k: 5,
            expected: [1, 2, 3, 4, 5],
            description: "k等于长度：回到原位"
        },
        {
            values: [1, 2, 3, 4, 5],
            k: 0,
            expected: [1, 2, 3, 4, 5],
            description: "k为0：不旋转"
        }
    ];

    console.log("🔄 旋转链表算法测试");
    console.log("==================");

    testCases.forEach((testCase, index) => {
        console.log(`\n测试用例 ${index + 1}: ${testCase.description}`);
        console.log(`输入: values=[${testCase.values.join(', ')}], k=${testCase.k}`);

        // 获取旋转信息
        const rotationInfo = getRotationInfo(testCase.values, testCase.k);
        console.log(`旋转分析: 长度=${rotationInfo.length}, 有效k=${rotationInfo.effectiveK}`);

        // 创建多个链表副本进行测试
        const head1 = createLinkedList(testCase.values);
        const head2 = createLinkedList(testCase.values);
        const head3 = createLinkedList(testCase.values);

        const result1 = rotateRight(head1, testCase.k);
        const result2 = rotateRightTwoPointers(head2, testCase.k);
        const result3 = rotateRightRecursive(head3, testCase.k);

        const array1 = listToArray(result1);
        const array2 = listToArray(result2);
        const array3 = listToArray(result3);

        console.log(`环形连接法结果: [${array1.join(', ')}]`);
        console.log(`双指针法结果: [${array2.join(', ')}]`);
        console.log(`递归法结果: [${array3.join(', ')}]`);
        console.log(`期望结果: [${testCase.expected.join(', ')}]`);

        // 验证结果
        const arraysEqual = (a, b) => {
            if (a.length !== b.length) return false;
            for (let i = 0; i < a.length; i++) {
                if (a[i] !== b[i]) return false;
            }
            return true;
        };

        const passed = arraysEqual(array1, testCase.expected) &&
                      arraysEqual(array2, testCase.expected) &&
                      arraysEqual(array3, testCase.expected);

        console.log(`测试${passed ? '✅ 通过' : '❌ 失败'}`);

        // 详细分析第一个用例
        if (index === 0) {
            console.log('\n--- 详细分析过程 ---');
            const analysisHead = createLinkedList(testCase.values);
            rotateRightWithAnalysis(analysisHead, testCase.k);
        }
    });
}

/**
 * 性能测试
 */
function performanceTest() {
    console.log("\n📊 性能测试");
    console.log("===========");

    const sizes = [1000, 5000, 10000];

    sizes.forEach(size => {
        console.log(`\n链表大小: ${size}节点`);

        // 创建测试链表
        const values = Array.from({ length: size }, (_, i) => i + 1);
        const k = Math.floor(size / 3); // 旋转约1/3的长度

        console.log(`旋转位数: ${k}`);

        // 测试环形连接法
        let head1 = createLinkedList(values);
        let start = performance.now();
        rotateRight(head1, k);
        let end = performance.now();
        console.log(`环形连接法: ${(end - start).toFixed(4)}ms`);

        // 测试双指针法
        let head2 = createLinkedList(values);
        start = performance.now();
        rotateRightTwoPointers(head2, k);
        end = performance.now();
        console.log(`双指针法: ${(end - start).toFixed(4)}ms`);

        // 递归法性能较差，只在小规模时测试
        if (size <= 1000) {
            let head3 = createLinkedList(values);
            start = performance.now();
            rotateRightRecursive(head3, k);
            end = performance.now();
            console.log(`递归法: ${(end - start).toFixed(4)}ms`);
        } else {
            console.log(`递归法: 跳过（规模太大）`);
        }
    });
}

/**
 * 算法思想演示
 */
function demonstrateRotationConcept() {
    console.log("\n🎯 旋转链表算法思想演示");
    console.log("=======================");

    const values = [1, 2, 3, 4, 5];
    const k = 2;

    console.log(`原始链表: [${values.join(' -> ')}]`);
    console.log(`向右旋转 ${k} 位`);

    console.log('\n步骤分解:');
    console.log('1. 计算链表长度: 5');
    console.log('2. 计算有效旋转位数: k % length = 2 % 5 = 2');
    console.log('3. 新头节点位置: length - k = 5 - 2 = 3 (索引为3的节点)');
    console.log('4. 分割点: 索引2和索引3之间');

    console.log('\n可视化过程:');
    console.log('原始: 1 -> 2 -> 3 -> 4 -> 5 -> null');
    console.log('     ↑              ↑    ↑');
    console.log('    头部         新尾部 新头部');
    console.log('');
    console.log('步骤1: 1 -> 2 -> 3 -> 4 -> 5 -> 1 (形成环)');
    console.log('步骤2: 找到新尾部(3)和新头部(4)');
    console.log('步骤3: 断开3->4的连接');
    console.log('结果: 4 -> 5 -> 1 -> 2 -> 3 -> null');

    console.log('\n数学原理:');
    console.log('向右旋转k位 = 将后k个元素移到前面');
    console.log('新头节点 = 原链表第(length - k % length)个节点');
    console.log('新尾节点 = 原链表第(length - k % length - 1)个节点');
}

// 如果在Node.js环境中运行
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ListNode,
        rotateRight,
        rotateRightTwoPointers,
        rotateRightWithAnalysis,
        rotateRightRecursive,
        createLinkedList,
        printList,
        listToArray,
        getRotationInfo,
        testRotateRight,
        performanceTest,
        demonstrateRotationConcept
    };
}

// 如果在浏览器环境中运行
if (typeof window !== 'undefined') {
    window.rotateRight = rotateRight;
    window.testRotateRight = testRotateRight;
}

// 运行测试
// testRotateRight();
// performanceTest();
// demonstrateRotationConcept();