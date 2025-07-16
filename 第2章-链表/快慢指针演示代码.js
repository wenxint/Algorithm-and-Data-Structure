/**
 * 快慢指针检测环算法演示代码
 *
 * 这个文件包含了完整的快慢指针算法实现，以及详细的可视化演示过程
 *
 * 核心思想：
 * 1. 第一阶段：快慢指针检测环的存在
 * 2. 第二阶段：重置指针找到环的入口
 *
 * 作者：算法学习助手
 * 日期：2024
 */

/**
 * 链表节点定义
 */
class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

/**
 * 快慢指针检测环算法（完整版）
 *
 * 核心思想：
 * 1. 快指针每次走2步，慢指针每次走1步
 * 2. 如果有环，快指针必定会追上慢指针
 * 3. 重置一个指针到头部，两指针同步移动找到环入口
 *
 * @param {ListNode} head - 链表头节点
 * @returns {ListNode|null} 环的入口节点，无环返回null
 */
function detectCycle(head) {
    if (!head || !head.next) return null;

    console.log('🚀 开始快慢指针检测环算法');
    console.log('=====================================\n');

    // 第一阶段：检测是否有环
    console.log('📍 第一阶段：检测是否有环');
    let slow = head;
    let fast = head;
    let step = 0;

    while (fast && fast.next) {
        slow = slow.next;      // 慢指针每次移动1步
        fast = fast.next.next; // 快指针每次移动2步
        step++;

        console.log(`步骤 ${step}: 慢指针位置 ${slow.val}, 快指针位置 ${fast.val}`);

        // 相遇说明有环
        if (slow === fast) {
            console.log(`🎯 在步骤 ${step} 相遇！慢指针和快指针都在节点 ${slow.val}`);
            break;
        }
    }

    // 没有环
    if (!fast || !fast.next) {
        console.log('❌ 没有检测到环');
        return null;
    }

    console.log('\n📍 第二阶段：找到环的入口');
    // 第二阶段：找到环的入口
    slow = head; // 重置慢指针到头部
    step = 0;

    console.log('🔄 重置慢指针到头部，快指针保持在相遇点');
    console.log(`初始状态: 慢指针在节点 ${slow.val}, 快指针在节点 ${fast.val}`);

    // 两指针以相同速度移动
    while (slow !== fast) {
        slow = slow.next;
        fast = fast.next;
        step++;
        console.log(`步骤 ${step}: 慢指针在节点 ${slow.val}, 快指针在节点 ${fast.val}`);
    }

    console.log(`\n✅ 找到环入口！入口节点值为 ${slow.val}`);
    return slow; // 相遇点就是环入口
}

/**
 * 仅检测是否有环（简化版）
 *
 * @param {ListNode} head - 链表头节点
 * @returns {boolean} 是否有环
 */
function hasCycle(head) {
    if (!head || !head.next) return false;

    let slow = head;
    let fast = head;

    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;

        if (slow === fast) return true;
    }

    return false;
}

/**
 * 计算环的长度
 *
 * @param {ListNode} head - 链表头节点
 * @returns {number} 环的长度，无环返回0
 */
function getCycleLength(head) {
    if (!head || !head.next) return 0;

    // 先找到相遇点
    let slow = head, fast = head;

    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow === fast) break;
    }

    if (!fast || !fast.next) return 0;

    // 从相遇点计算环长
    let length = 1;
    let current = slow.next;

    while (current !== slow) {
        current = current.next;
        length++;
    }

    console.log(`🔄 环的长度为: ${length}`);
    return length;
}

/**
 * 获取环的完整信息
 *
 * @param {ListNode} head - 链表头节点
 * @returns {Object} 环的详细信息
 */
function getCycleInfo(head) {
    const entryNode = detectCycle(head);

    if (!entryNode) {
        return {
            hasCycle: false,
            entryNode: null,
            distanceToEntry: -1,
            cycleLength: 0
        };
    }

    // 计算头部到环入口的距离
    let distance = 0;
    let current = head;
    while (current !== entryNode) {
        current = current.next;
        distance++;
    }

    // 计算环长度
    const cycleLength = getCycleLength(head);

    return {
        hasCycle: true,
        entryNode: entryNode,
        entryValue: entryNode.val,
        distanceToEntry: distance,
        cycleLength: cycleLength
    };
}

/**
 * 创建测试用的环形链表
 *
 * 链表结构：1 → 2 → 3 → 4 → 5
 *                   ↑       ↓
 *                   8 ← 7 ← 6
 *
 * @returns {ListNode} 链表头节点
 */
function createCyclicList() {
    // 创建节点
    const node1 = new ListNode(1);
    const node2 = new ListNode(2);
    const node3 = new ListNode(3); // 环入口
    const node4 = new ListNode(4);
    const node5 = new ListNode(5);
    const node6 = new ListNode(6);
    const node7 = new ListNode(7);
    const node8 = new ListNode(8);

    // 构建链表
    node1.next = node2;
    node2.next = node3;
    node3.next = node4;
    node4.next = node5;
    node5.next = node6;
    node6.next = node7;
    node7.next = node8;
    node8.next = node3; // 形成环，指向节点3

    return node1;
}

/**
 * 创建无环链表
 *
 * @returns {ListNode} 链表头节点
 */
function createNormalList() {
    const node1 = new ListNode(1);
    const node2 = new ListNode(2);
    const node3 = new ListNode(3);
    const node4 = new ListNode(4);
    const node5 = new ListNode(5);

    node1.next = node2;
    node2.next = node3;
    node3.next = node4;
    node4.next = node5;
    // node5.next = null; // 无环

    return node1;
}

/**
 * 数学原理演示
 *
 * 通过具体的数值展示数学关系
 */
function demonstrateMathPrinciple() {
    console.log('\n🧮 数学原理演示');
    console.log('=====================================');

    console.log('📐 假设链表结构：');
    console.log('头部 → ... → 环入口 → ... → 相遇点 → ... → 环入口');
    console.log('      ↑      ↑        ↑');
    console.log('      0      a        a+b');
    console.log('');

    console.log('📊 变量定义：');
    console.log('• a = 头部到环入口的距离');
    console.log('• b = 环入口到相遇点的距离');
    console.log('• c = 相遇点到环入口的距离');
    console.log('• 环长 = b + c');
    console.log('');

    console.log('🔍 以我们的测试链表为例：');
    console.log('• a = 2 (节点1→2→3)');
    console.log('• b = 3 (节点3→4→5→6，假设在节点6相遇)');
    console.log('• c = 2 (节点6→7→8→3)');
    console.log('• 环长 = b + c = 3 + 2 = 5');
    console.log('');

    console.log('⚡ 关键数学关系：');
    console.log('快指针距离 = 2 × 慢指针距离');
    console.log('a + b + k(b + c) = 2(a + b)');
    console.log('化简得：a = (k-1)(b + c) + c');
    console.log('');

    console.log('🎯 这意味着：');
    console.log('从头部走a步到环入口 = 从相遇点走a步也到环入口');
    console.log('因为走a步 = 走c步到入口 + 走(k-1)圈回到入口');
}

/**
 * 可视化链表结构
 *
 * @param {ListNode} head - 链表头节点
 * @param {number} maxNodes - 最大显示节点数（防止无限循环）
 */
function visualizeList(head, maxNodes = 15) {
    console.log('\n🎨 链表结构可视化：');
    console.log('=====================================');

    if (!head) {
        console.log('空链表');
        return;
    }

    let current = head;
    let visited = new Set();
    let nodeList = [];
    let cycleStart = -1;

    for (let i = 0; i < maxNodes && current; i++) {
        if (visited.has(current)) {
            cycleStart = nodeList.findIndex(node => node === current);
            break;
        }

        visited.add(current);
        nodeList.push(current);
        current = current.next;
    }

    // 构建可视化字符串
    let visualization = '';
    for (let i = 0; i < nodeList.length; i++) {
        visualization += `[${nodeList[i].val}]`;
        if (i < nodeList.length - 1) {
            visualization += ' → ';
        }
    }

    if (cycleStart !== -1) {
        visualization += ` → [${nodeList[cycleStart].val}] (环入口)`;
        console.log(visualization);
        console.log(`🔄 检测到环！环入口为节点 ${nodeList[cycleStart].val}`);
        console.log(`📏 头部到环入口距离：${cycleStart}`);
    } else {
        console.log(visualization);
        console.log('✅ 无环链表');
    }
}

/**
 * 运行完整的演示
 */
function runFullDemo() {
    console.log('🎓 快慢指针检测环算法完整演示');
    console.log('==========================================\n');

    // 演示1：有环链表
    console.log('📋 测试案例1：有环链表');
    console.log('==========================================');
    const cyclicList = createCyclicList();
    visualizeList(cyclicList);

    const cycleInfo = getCycleInfo(cyclicList);
    console.log('\n📊 环信息统计：');
    console.log(`• 是否有环: ${cycleInfo.hasCycle}`);
    console.log(`• 环入口节点值: ${cycleInfo.entryValue}`);
    console.log(`• 头部到环入口距离: ${cycleInfo.distanceToEntry}`);
    console.log(`• 环长度: ${cycleInfo.cycleLength}`);

    console.log('\n' + '='.repeat(50));

    // 演示2：无环链表
    console.log('\n📋 测试案例2：无环链表');
    console.log('==========================================');
    const normalList = createNormalList();
    visualizeList(normalList);

    const normalInfo = getCycleInfo(normalList);
    console.log('\n📊 链表信息：');
    console.log(`• 是否有环: ${normalInfo.hasCycle}`);
    console.log(`• 环入口节点: ${normalInfo.entryNode}`);

    // 数学原理演示
    demonstrateMathPrinciple();
}

/**
 * 性能测试
 */
function performanceTest() {
    console.log('\n⚡ 性能测试');
    console.log('=====================================');

    // 创建大链表进行性能测试
    function createLargeCyclicList(size) {
        const head = new ListNode(1);
        let current = head;

        // 创建链表
        for (let i = 2; i <= size; i++) {
            current.next = new ListNode(i);
            current = current.next;
        }

        // 在中间位置创建环
        const cycleStart = Math.floor(size / 2);
        let cycleNode = head;
        for (let i = 1; i < cycleStart; i++) {
            cycleNode = cycleNode.next;
        }

        current.next = cycleNode; // 形成环
        return head;
    }

    const sizes = [1000, 10000, 100000];

    sizes.forEach(size => {
        const largeList = createLargeCyclicList(size);

        const startTime = performance.now();
        const result = detectCycle(largeList);
        const endTime = performance.now();

        console.log(`📊 链表大小: ${size}, 检测时间: ${(endTime - startTime).toFixed(2)}ms, 环入口: ${result.val}`);
    });
}

// 🚀 执行演示
if (require.main === module) {
    runFullDemo();
    // performanceTest(); // 取消注释以运行性能测试
}

module.exports = {
    ListNode,
    detectCycle,
    hasCycle,
    getCycleLength,
    getCycleInfo,
    createCyclicList,
    createNormalList,
    visualizeList,
    demonstrateMathPrinciple
};