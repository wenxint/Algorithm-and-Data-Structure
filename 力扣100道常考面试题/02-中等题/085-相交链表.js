/**
 * LeetCode 160. 相交链表
 *
 * 问题描述：
 * 给你两个单链表的头节点 headA 和 headB，请你找出并返回两个单链表相交的起始节点。
 * 如果两个链表不存在相交节点，返回 null。
 *
 * 题目数据保证整个链式结构中不存在环。
 * 注意，函数返回结果后，链表必须保持其原始结构。
 *
 * 核心思想：
 * 双指针法 - 两个指针分别从两个链表开始，到达末尾后换到另一个链表继续
 * 关键观察：如果相交，两指针会在相交点相遇；如果不相交，两指针会同时变为null
 * 数学原理：设链表A长度为a，链表B长度为b，公共部分长度为c
 * 指针走过的路径：A + B = a + b，B + A = b + a，两者相等，必定在相交点相遇
 *
 * 算法步骤：
 * 1. 两个指针分别从headA和headB开始遍历
 * 2. 当指针到达链表末尾时，跳转到另一个链表的头部
 * 3. 继续遍历直到两指针相遇（相交点）或都为null（不相交）
 * 4. 返回相遇点或null
 *
 * 示例：
 * listA = [4,1,8,4,5], listB = [5,6,1,8,4,5]
 * 相交于节点值为8的位置
 *
 * 可视化：
 * A: 4 -> 1 -> 8 -> 4 -> 5
 * B:      5 -> 6 -> 1 -> 8 -> 4 -> 5
 *                        ↑ 相交点
 */

// 链表节点定义
class ListNode {
    constructor(val, next = null) {
        this.val = val;
        this.next = next;
    }
}

/**
 * 方法一：双指针法（最优解）
 *
 * 核心思想：
 * 让两个指针走相同的总路径长度，这样如果有相交点，它们必定会在相交点相遇
 * 指针A：走完链表A后走链表B
 * 指针B：走完链表B后走链表A
 *
 * @param {ListNode} headA - 链表A的头节点
 * @param {ListNode} headB - 链表B的头节点
 * @return {ListNode} 相交节点或null
 * @time O(m + n) - m和n分别是两个链表的长度
 * @space O(1) - 只使用常数额外空间
 */
function getIntersectionNode(headA, headB) {
    if (!headA || !headB) {
        return null;
    }

    let pointerA = headA;
    let pointerB = headB;

    // 当两个指针不相等时继续遍历
    while (pointerA !== pointerB) {
        // 指针A到达末尾时跳转到链表B的头部，否则继续下一个节点
        pointerA = pointerA === null ? headB : pointerA.next;

        // 指针B到达末尾时跳转到链表A的头部，否则继续下一个节点
        pointerB = pointerB === null ? headA : pointerB.next;
    }

    // 返回相交点（如果相交）或null（如果不相交）
    return pointerA;
}

/**
 * 方法二：哈希集合法
 *
 * 核心思想：
 * 先遍历一个链表，将所有节点存入哈希集合
 * 再遍历另一个链表，检查每个节点是否在集合中
 *
 * @param {ListNode} headA - 链表A的头节点
 * @param {ListNode} headB - 链表B的头节点
 * @return {ListNode} 相交节点或null
 * @time O(m + n) - 需要遍历两个链表
 * @space O(m) - 需要存储链表A的所有节点
 */
function getIntersectionNodeHashSet(headA, headB) {
    if (!headA || !headB) {
        return null;
    }

    const visitedNodes = new Set();

    // 遍历链表A，将所有节点添加到集合中
    let current = headA;
    while (current) {
        visitedNodes.add(current);
        current = current.next;
    }

    // 遍历链表B，检查是否存在已访问的节点
    current = headB;
    while (current) {
        if (visitedNodes.has(current)) {
            return current; // 找到相交点
        }
        current = current.next;
    }

    return null; // 没有相交点
}

/**
 * 方法三：计算长度差法
 *
 * 核心思想：
 * 1. 分别计算两个链表的长度
 * 2. 让较长链表的指针先走长度差步
 * 3. 然后两个指针同步前进，直到相遇
 *
 * @param {ListNode} headA - 链表A的头节点
 * @param {ListNode} headB - 链表B的头节点
 * @return {ListNode} 相交节点或null
 * @time O(m + n) - 需要两次遍历
 * @space O(1) - 只使用常数额外空间
 */
function getIntersectionNodeLengthDiff(headA, headB) {
    if (!headA || !headB) {
        return null;
    }

    // 计算链表A的长度
    let lengthA = 0;
    let current = headA;
    while (current) {
        lengthA++;
        current = current.next;
    }

    // 计算链表B的长度
    let lengthB = 0;
    current = headB;
    while (current) {
        lengthB++;
        current = current.next;
    }

    // 确定较长的链表和长度差
    let pointerA = headA;
    let pointerB = headB;
    let diff = Math.abs(lengthA - lengthB);

    // 让较长链表的指针先走差值步数
    if (lengthA > lengthB) {
        for (let i = 0; i < diff; i++) {
            pointerA = pointerA.next;
        }
    } else {
        for (let i = 0; i < diff; i++) {
            pointerB = pointerB.next;
        }
    }

    // 同步前进直到相遇
    while (pointerA && pointerB) {
        if (pointerA === pointerB) {
            return pointerA;
        }
        pointerA = pointerA.next;
        pointerB = pointerB.next;
    }

    return null;
}

/**
 * 方法四：标记法（修改原链表，不推荐）
 *
 * 核心思想：
 * 遍历链表A，给每个节点添加一个visited标记
 * 遍历链表B，检查是否有节点已被标记
 *
 * 注意：这个方法会修改原链表结构，不符合题目要求，仅供理解
 *
 * @param {ListNode} headA - 链表A的头节点
 * @param {ListNode} headB - 链表B的头节点
 * @return {ListNode} 相交节点或null
 * @time O(m + n) - 遍历两个链表
 * @space O(1) - 不使用额外空间（但修改了原链表）
 */
function getIntersectionNodeMark(headA, headB) {
    if (!headA || !headB) {
        return null;
    }

    // 标记链表A的所有节点
    let current = headA;
    while (current) {
        current.visited = true;
        current = current.next;
    }

    // 检查链表B的节点是否被标记
    current = headB;
    let intersectionNode = null;
    while (current) {
        if (current.visited) {
            intersectionNode = current;
            break;
        }
        current = current.next;
    }

    // 清理标记（恢复原链表结构）
    current = headA;
    while (current) {
        delete current.visited;
        current = current.next;
    }

    return intersectionNode;
}

// 辅助函数：创建测试链表
function createLinkedList(values) {
    if (values.length === 0) return null;

    const head = new ListNode(values[0]);
    let current = head;

    for (let i = 1; i < values.length; i++) {
        current.next = new ListNode(values[i]);
        current = current.next;
    }

    return head;
}

// 辅助函数：连接两个链表（用于创建相交链表）
function connectLists(listA, listB, intersectVal, skipA, skipB) {
    if (intersectVal === null) {
        return [listA, listB]; // 不相交
    }

    // 找到链表A的跳跃点
    let currentA = listA;
    for (let i = 0; i < skipA; i++) {
        currentA = currentA.next;
    }

    // 找到链表B的跳跃点
    let currentB = listB;
    for (let i = 0; i < skipB; i++) {
        currentB = currentB.next;
    }

    // 连接链表B到链表A的相交点
    currentB.next = currentA.next;

    return [listA, listB];
}

// 辅助函数：打印链表（避免无限循环）
function printList(head, maxNodes = 10) {
    const values = [];
    let current = head;
    let count = 0;

    while (current && count < maxNodes) {
        values.push(current.val);
        current = current.next;
        count++;
    }

    if (current) {
        values.push('...');
    }

    return values.join(' -> ');
}

// 测试用例
function testGetIntersectionNode() {
    console.log("=== 相交链表算法测试 ===\n");

    const testCases = [
        {
            listAValues: [4, 1, 8, 4, 5],
            listBValues: [5, 6, 1, 8, 4, 5],
            intersectVal: 8,
            skipA: 2,
            skipB: 3,
            description: "标准相交案例"
        },
        {
            listAValues: [1, 9, 1, 2, 4],
            listBValues: [3, 2, 4],
            intersectVal: 2,
            skipA: 3,
            skipB: 1,
            description: "相交于后半部分"
        },
        {
            listAValues: [2, 6, 4],
            listBValues: [1, 5],
            intersectVal: null,
            skipA: 0,
            skipB: 0,
            description: "不相交的链表"
        },
        {
            listAValues: [1],
            listBValues: [1],
            intersectVal: 1,
            skipA: 0,
            skipB: 0,
            description: "单节点相交"
        },
        {
            listAValues: [1, 2],
            listBValues: [1],
            intersectVal: null,
            skipA: 0,
            skipB: 0,
            description: "单节点不相交"
        }
    ];

    testCases.forEach(({ listAValues, listBValues, intersectVal, skipA, skipB, description }, index) => {
        console.log(`测试用例 ${index + 1}: ${description}`);

        // 创建独立的链表
        let listA = createLinkedList(listAValues);
        let listB = createLinkedList(listBValues);

        // 如果需要相交，连接链表
        if (intersectVal !== null) {
            [listA, listB] = connectLists(listA, listB, intersectVal, skipA, skipB);
        }

        console.log(`链表A: ${printList(listA)}`);
        console.log(`链表B: ${printList(listB)}`);
        console.log(`期望相交值: ${intersectVal}`);

        // 测试各种方法
        const result1 = getIntersectionNode(listA, listB);
        const result2 = getIntersectionNodeHashSet(listA, listB);
        const result3 = getIntersectionNodeLengthDiff(listA, listB);
        const result4 = getIntersectionNodeMark(listA, listB);

        console.log(`双指针法结果: ${result1 ? result1.val : 'null'}`);
        console.log(`哈希集合法结果: ${result2 ? result2.val : 'null'}`);
        console.log(`长度差法结果: ${result3 ? result3.val : 'null'}`);
        console.log(`标记法结果: ${result4 ? result4.val : 'null'}`);

        // 验证结果
        const expected = intersectVal;
        const actual = result1 ? result1.val : null;
        console.log(`验证: ${actual === expected ? '✓' : '✗'} 结果正确`);
        console.log("---");
    });
}

// 性能测试
function performanceTest() {
    console.log("=== 性能测试 ===\n");

    const sizes = [1000, 10000, 50000];

    sizes.forEach(size => {
        // 创建两个长链表
        const listAValues = Array.from({ length: size }, (_, i) => i);
        const listBValues = Array.from({ length: size }, (_, i) => i + size);

        let listA = createLinkedList(listAValues);
        let listB = createLinkedList(listBValues);

        // 让它们在中间相交
        const skipA = Math.floor(size / 2);
        const skipB = Math.floor(size / 2);
        [listA, listB] = connectLists(listA, listB, listAValues[skipA], skipA, skipB);

        console.log(`链表长度: ${size}`);

        // 测试双指针法
        const start1 = performance.now();
        const result1 = getIntersectionNode(listA, listB);
        const end1 = performance.now();
        console.log(`双指针法: ${(end1 - start1).toFixed(4)}ms, 结果: ${result1 ? result1.val : 'null'}`);

        // 测试哈希集合法
        const start2 = performance.now();
        const result2 = getIntersectionNodeHashSet(listA, listB);
        const end2 = performance.now();
        console.log(`哈希集合法: ${(end2 - start2).toFixed(4)}ms, 结果: ${result2 ? result2.val : 'null'}`);

        // 测试长度差法
        const start3 = performance.now();
        const result3 = getIntersectionNodeLengthDiff(listA, listB);
        const end3 = performance.now();
        console.log(`长度差法: ${(end3 - start3).toFixed(4)}ms, 结果: ${result3 ? result3.val : 'null'}`);

        console.log("---");
    });
}

// 算法可视化演示
function visualizeAlgorithm() {
    console.log("=== 双指针法过程可视化 ===\n");

    // 创建测试链表：A = [4,1,8,4,5], B = [5,6,1,8,4,5]，在8处相交
    const listA = createLinkedList([4, 1]);
    const sharedPart = createLinkedList([8, 4, 5]);
    listA.next.next = sharedPart;

    const listB = createLinkedList([5, 6, 1]);
    listB.next.next.next = sharedPart;

    console.log("链表结构:");
    console.log("A: 4 -> 1 -> 8 -> 4 -> 5");
    console.log("B: 5 -> 6 -> 1 -> 8 -> 4 -> 5");
    console.log("              ↑ 相交点\n");

    console.log("双指针移动过程:");

    let pointerA = listA;
    let pointerB = listB;
    let step = 1;
    let switchedA = false;
    let switchedB = false;

    while (pointerA !== pointerB && step <= 20) {
        console.log(`步骤 ${step}:`);
        console.log(`  指针A位置: ${pointerA ? pointerA.val : 'null'}${!switchedA ? ' (在链表A)' : ' (在链表B)'}`);
        console.log(`  指针B位置: ${pointerB ? pointerB.val : 'null'}${!switchedB ? ' (在链表B)' : ' (在链表A)'}`);

        if (pointerA === pointerB) {
            console.log(`  ✓ 两指针相遇！相交节点值: ${pointerA.val}`);
            break;
        }

        // 移动指针A
        if (pointerA === null) {
            pointerA = listB;
            switchedA = true;
            console.log(`  指针A到达链表末尾，跳转到链表B`);
        } else {
            pointerA = pointerA.next;
        }

        // 移动指针B
        if (pointerB === null) {
            pointerB = listA;
            switchedB = true;
            console.log(`  指针B到达链表末尾，跳转到链表A`);
        } else {
            pointerB = pointerB.next;
        }

        console.log("");
        step++;
    }
}

// 算法复杂度分析
function complexityAnalysis() {
    console.log("=== 算法复杂度分析 ===\n");

    console.log("各种方法的时间和空间复杂度对比：\n");

    const methods = [
        {
            name: "双指针法",
            time: "O(m + n)",
            space: "O(1)",
            pros: "空间效率最高，代码简洁",
            cons: "需要理解数学原理"
        },
        {
            name: "哈希集合法",
            time: "O(m + n)",
            space: "O(m)",
            pros: "直观易懂，容易实现",
            cons: "需要额外空间存储节点"
        },
        {
            name: "长度差法",
            time: "O(m + n)",
            space: "O(1)",
            pros: "逻辑清晰，易于理解",
            cons: "需要两次遍历计算长度"
        },
        {
            name: "标记法",
            time: "O(m + n)",
            space: "O(1)",
            pros: "不需要额外数据结构",
            cons: "修改原链表结构，不符合要求"
        }
    ];

    methods.forEach(({ name, time, space, pros, cons }) => {
        console.log(`${name}:`);
        console.log(`  时间复杂度: ${time}`);
        console.log(`  空间复杂度: ${space}`);
        console.log(`  优点: ${pros}`);
        console.log(`  缺点: ${cons}\n`);
    });

    console.log("推荐使用双指针法，因为它在时间和空间复杂度上都是最优的。");
}

// 运行测试
if (require.main === module) {
    testGetIntersectionNode();
    performanceTest();
    visualizeAlgorithm();
    complexityAnalysis();
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ListNode,
        getIntersectionNode,
        getIntersectionNodeHashSet,
        getIntersectionNodeLengthDiff,
        getIntersectionNodeMark,
        createLinkedList
    };
}