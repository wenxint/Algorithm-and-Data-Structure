/**
 * LeetCode 142. 环形链表 II
 *
 * 问题描述：
 * 给定一个链表的头节点 head ，返回链表开始入环的第一个节点。
 * 如果链表无环，则返回 null。
 * 如果链表中有某个节点，可以通过连续跟踪 next 指针再次到达，则链表中存在环。
 * 为了表示给定链表中的环，评测系统内部使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。
 * 如果 pos 是 -1，则在该链表中没有环。注意：pos 不作为参数进行传递，仅仅是为了标识链表的实际情况。
 *
 * 核心思想：
 * Floyd判圈算法（龟兔赛跑算法）
 * 1. 使用快慢指针检测是否有环
 * 2. 如果有环，找到环的入口节点
 * 数学原理：设环外长度为a，环内长度为b，快慢指针相遇点距离环入口为c
 * 则有：slow走了a+c，fast走了a+c+kb（k为fast在环内走的圈数）
 * 因为fast速度是slow的2倍，所以：2(a+c) = a+c+kb
 * 化简得：a = kb-c = (k-1)b + (b-c)
 *
 * 示例：
 * 输入：head = [3,2,0,-4], pos = 1
 * 输出：返回索引为1的链表节点
 * 解释：链表中有一个环，其尾部连接到第二个节点。
 */

/**
 * 链表节点定义
 */
function ListNode(val) {
    this.val = val;
    this.next = null;
}

/**
 * 环形链表 II - Floyd算法（面试推荐）
 * @param {ListNode} head - 链表头节点
 * @return {ListNode} 环的入口节点，无环返回null
 * @time O(n) 时间复杂度
 * @space O(1) 空间复杂度
 */
function detectCycle(head) {
    if (!head || !head.next) return null;

    // 第一阶段：检测是否有环
    let slow = head;
    let fast = head;

    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;

        // 快慢指针相遇，说明有环
        if (slow === fast) {
            break;
        }
    }

    // 没有环
    if (!fast || !fast.next) {
        return null;
    }

    // 第二阶段：找到环的入口
    // 将慢指针重新指向头部，两个指针以相同速度移动
    slow = head;
    while (slow !== fast) {
        slow = slow.next;
        fast = fast.next;
    }

    return slow;  // 相遇点就是环的入口
}

/**
 * 环形链表 II - 哈希表法
 * @param {ListNode} head - 链表头节点
 * @return {ListNode} 环的入口节点
 * @time O(n) 时间复杂度
 * @space O(n) 空间复杂度
 */
function detectCycleHashSet(head) {
    const visited = new Set();
    let current = head;

    while (current) {
        if (visited.has(current)) {
            return current;  // 第一个重复访问的节点就是环入口
        }
        visited.add(current);
        current = current.next;
    }

    return null;  // 没有环
}

/**
 * 环形链表 II - 详细分析版本
 * @param {ListNode} head - 链表头节点
 * @return {ListNode} 环的入口节点
 */
function detectCycleWithAnalysis(head) {
    if (!head || !head.next) {
        console.log('链表为空或只有一个节点，无环');
        return null;
    }

    console.log('开始检测环形链表');

    // 第一阶段：使用快慢指针检测环
    let slow = head;
    let fast = head;
    let step = 0;

    console.log('\n第一阶段：检测是否有环');

    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
        step++;

        console.log(`步骤${step}: slow在节点${getNodeInfo(slow)}, fast在节点${getNodeInfo(fast)}`);

        if (slow === fast) {
            console.log(`快慢指针在步骤${step}相遇！确认有环存在`);
            break;
        }
    }

    if (!fast || !fast.next) {
        console.log('无环，返回null');
        return null;
    }

    // 第二阶段：找到环的入口
    console.log('\n第二阶段：寻找环的入口');
    slow = head;
    step = 0;

    console.log('重置slow到头部，fast留在相遇点');

    while (slow !== fast) {
        console.log(`步骤${step}: slow在节点${getNodeInfo(slow)}, fast在节点${getNodeInfo(fast)}`);
        slow = slow.next;
        fast = fast.next;
        step++;
    }

    console.log(`经过${step}步后，两指针在环入口相遇：节点${getNodeInfo(slow)}`);
    return slow;
}

/**
 * 获取节点信息（用于调试）
 * @param {ListNode} node - 节点
 * @return {string} 节点信息
 */
function getNodeInfo(node) {
    return node ? `(值=${node.val})` : 'null';
}

/**
 * 环形链表 II - 获取环的详细信息
 * @param {ListNode} head - 链表头节点
 * @return {object} 包含环的详细信息
 */
function getCycleInfo(head) {
    if (!head || !head.next) {
        return { hasCycle: false };
    }

    // 检测环
    let slow = head;
    let fast = head;

    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;

        if (slow === fast) {
            break;
        }
    }

    if (!fast || !fast.next) {
        return { hasCycle: false };
    }

    // 找到环入口
    const meetingPoint = slow;
    slow = head;
    let cycleStart = null;

    while (slow !== fast) {
        slow = slow.next;
        fast = fast.next;
    }
    cycleStart = slow;

    // 计算环外长度
    let beforeCycleLength = 0;
    let current = head;
    while (current !== cycleStart) {
        beforeCycleLength++;
        current = current.next;
    }

    // 计算环长度
    let cycleLength = 1;
    current = cycleStart.next;
    while (current !== cycleStart) {
        cycleLength++;
        current = current.next;
    }

    // 计算总长度
    let totalLength = beforeCycleLength + cycleLength;

    return {
        hasCycle: true,
        cycleStart,
        cycleStartValue: cycleStart.val,
        beforeCycleLength,
        cycleLength,
        totalLength,
        meetingPoint,
        meetingPointValue: meetingPoint.val
    };
}

/**
 * 环形链表 II - 标记法（修改节点值）
 * @param {ListNode} head - 链表头节点
 * @return {ListNode} 环的入口节点
 */
function detectCycleByMarking(head) {
    const VISITED_MARK = 100001;  // 使用一个特殊值标记访问过的节点
    let current = head;

    while (current) {
        if (current.val === VISITED_MARK) {
            return current;  // 找到环入口
        }

        const next = current.next;
        current.val = VISITED_MARK;  // 标记为已访问
        current = next;
    }

    return null;  // 没有环
}

/**
 * 创建测试用的环形链表
 * @param {number[]} values - 节点值数组
 * @param {number} pos - 环的起始位置，-1表示无环
 * @return {ListNode} 链表头节点
 */
function createLinkedListWithCycle(values, pos) {
    if (!values || values.length === 0) return null;

    // 创建所有节点
    const nodes = values.map(val => new ListNode(val));

    // 连接节点
    for (let i = 0; i < nodes.length - 1; i++) {
        nodes[i].next = nodes[i + 1];
    }

    // 如果有环，连接尾节点到指定位置
    if (pos >= 0 && pos < nodes.length) {
        nodes[nodes.length - 1].next = nodes[pos];
    }

    return nodes[0];
}

/**
 * 打印链表（避免无限循环）
 * @param {ListNode} head - 链表头节点
 * @param {number} maxNodes - 最大打印节点数
 */
function printLinkedList(head, maxNodes = 20) {
    const values = [];
    let current = head;
    let count = 0;

    while (current && count < maxNodes) {
        values.push(current.val);
        current = current.next;
        count++;
    }

    if (current) {
        values.push('...(有环或链表过长)');
    }

    console.log(`链表: [${values.join(' -> ')}]`);
}

/**
 * 测试函数
 */
function testDetectCycle() {
    const testCases = [
        {
            values: [3, 2, 0, -4],
            pos: 1,
            expected: 1,  // 期望返回索引1的节点
            description: "标准环形链表：尾节点指向索引1"
        },
        {
            values: [1, 2],
            pos: 0,
            expected: 0,  // 期望返回索引0的节点
            description: "两节点环：尾节点指向头节点"
        },
        {
            values: [1],
            pos: -1,
            expected: null,
            description: "单节点无环"
        },
        {
            values: [1, 2, 3, 4, 5],
            pos: -1,
            expected: null,
            description: "多节点无环链表"
        },
        {
            values: [1, 2, 3, 4, 5],
            pos: 2,
            expected: 2,
            description: "环在中间：尾节点指向索引2"
        },
        {
            values: [1],
            pos: 0,
            expected: 0,
            description: "自环：单节点指向自己"
        }
    ];

    console.log("🔗 环形链表 II 算法测试");
    console.log("=====================");

    testCases.forEach((testCase, index) => {
        console.log(`\n测试用例 ${index + 1}: ${testCase.description}`);
        console.log(`输入: values=[${testCase.values.join(', ')}], pos=${testCase.pos}`);

        const head = createLinkedListWithCycle(testCase.values, testCase.pos);
        printLinkedList(head);

        // 创建多个副本进行测试（因为标记法会修改原链表）
        const head1 = createLinkedListWithCycle(testCase.values, testCase.pos);
        const head2 = createLinkedListWithCycle(testCase.values, testCase.pos);
        const head3 = createLinkedListWithCycle(testCase.values, testCase.pos);

        const result1 = detectCycle(head1);
        const result2 = detectCycleHashSet(head2);
        const cycleInfo = getCycleInfo(head3);

        console.log(`Floyd算法结果: ${result1 ? `节点值=${result1.val}` : 'null'}`);
        console.log(`哈希表法结果: ${result2 ? `节点值=${result2.val}` : 'null'}`);

        if (cycleInfo.hasCycle) {
            console.log(`环信息: 入口节点值=${cycleInfo.cycleStartValue}, 环外长度=${cycleInfo.beforeCycleLength}, 环长度=${cycleInfo.cycleLength}`);
        } else {
            console.log('环信息: 无环');
        }

        // 验证结果
        let passed = false;
        if (testCase.expected === null) {
            passed = result1 === null && result2 === null;
        } else {
            // 检查返回的节点是否是期望位置的节点
            const expectedNode = testCase.values[testCase.expected];
            passed = result1 && result1.val === expectedNode &&
                    result2 && result2.val === expectedNode;
        }

        console.log(`测试${passed ? '✅ 通过' : '❌ 失败'}`);

        // 详细分析第一个用例
        if (index === 0) {
            console.log('\n--- 详细分析过程 ---');
            const analysisHead = createLinkedListWithCycle(testCase.values, testCase.pos);
            detectCycleWithAnalysis(analysisHead);
        }
    });
}

/**
 * 性能测试
 */
function performanceTest() {
    console.log("\n📊 性能测试");
    console.log("===========");

    // 创建大型链表进行测试
    function createLargeList(size, cyclePos) {
        const values = Array.from({ length: size }, (_, i) => i);
        return createLinkedListWithCycle(values, cyclePos);
    }

    const testSizes = [1000, 5000, 10000];

    testSizes.forEach(size => {
        console.log(`\n链表大小: ${size}节点`);

        // 测试无环情况
        const listNoCycle = createLargeList(size, -1);

        let start = performance.now();
        const result1 = detectCycle(listNoCycle);
        let end = performance.now();
        console.log(`Floyd算法(无环): ${(end - start).toFixed(4)}ms, 结果: ${result1 ? '有环' : '无环'}`);

        start = performance.now();
        const result2 = detectCycleHashSet(createLargeList(size, -1));
        end = performance.now();
        console.log(`哈希表法(无环): ${(end - start).toFixed(4)}ms, 结果: ${result2 ? '有环' : '无环'}`);

        // 测试有环情况（环在中间）
        const cyclePos = Math.floor(size / 2);
        const listWithCycle1 = createLargeList(size, cyclePos);
        const listWithCycle2 = createLargeList(size, cyclePos);

        start = performance.now();
        const result3 = detectCycle(listWithCycle1);
        end = performance.now();
        console.log(`Floyd算法(有环): ${(end - start).toFixed(4)}ms, 结果: ${result3 ? '有环' : '无环'}`);

        start = performance.now();
        const result4 = detectCycleHashSet(listWithCycle2);
        end = performance.now();
        console.log(`哈希表法(有环): ${(end - start).toFixed(4)}ms, 结果: ${result4 ? '有环' : '无环'}`);
    });
}

/**
 * Floyd算法数学原理演示
 */
function demonstrateFloydMath() {
    console.log("\n🔬 Floyd算法数学原理演示");
    console.log("========================");

    // 创建一个示例链表：0->1->2->3->4->2 (环从索引2开始)
    const head = createLinkedListWithCycle([0, 1, 2, 3, 4], 2);
    const info = getCycleInfo(head);

    console.log('示例链表: 0->1->2->3->4->2 (环从索引2开始)');
    console.log(`环外长度(a): ${info.beforeCycleLength}`);
    console.log(`环长度(b): ${info.cycleLength}`);

    console.log('\n数学推导:');
    console.log('设快慢指针相遇时，slow走了s步，fast走了f步');
    console.log('因为fast速度是slow的2倍，所以 f = 2s');
    console.log('快指针比慢指针多走了整数圈，所以 f - s = nb (n为正整数)');
    console.log('联立方程：f = 2s 和 f = s + nb');
    console.log('得到：s = nb，即slow走了n圈的距离');
    console.log('');
    console.log('要到达环入口，需要走 a + mb 步 (m为非负整数)');
    console.log('slow已经走了nb步，还需要走 a + mb - nb = a + (m-n)b 步');
    console.log('当m=n时，还需要走a步');
    console.log('');
    console.log('因此，让一个指针从头开始，另一个从相遇点开始，');
    console.log('两者以相同速度移动a步后会在环入口相遇。');
}

// 如果在Node.js环境中运行
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ListNode,
        detectCycle,
        detectCycleHashSet,
        detectCycleWithAnalysis,
        getCycleInfo,
        detectCycleByMarking,
        createLinkedListWithCycle,
        printLinkedList,
        testDetectCycle,
        performanceTest,
        demonstrateFloydMath
    };
}

// 如果在浏览器环境中运行
if (typeof window !== 'undefined') {
    window.detectCycle = detectCycle;
    window.testDetectCycle = testDetectCycle;
}

// 运行测试
// testDetectCycle();
// performanceTest();
// demonstrateFloydMath();