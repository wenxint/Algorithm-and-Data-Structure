/**
 * 链表连接本质演示：为什么dummy能"看到"所有变化？
 *
 * 这个演示将清楚地展示：
 * 1. dummy并没有"保存"current的变化
 * 2. dummy通过链表连接访问到了所有节点
 * 3. 变量指向 vs 节点连接的区别
 */

class ListNode {
    constructor(val, next = null) {
        this.val = val;
        this.next = next;
    }
}

console.log('=== 🧩 链表连接本质演示 ===\n');

// 1. 基础概念：独立节点 vs 连接节点
console.log('1️⃣ 基础概念：独立节点 vs 连接节点');
console.log('创建三个独立节点：');
let nodeA = new ListNode(0);
let nodeB = new ListNode(1);
let nodeC = new ListNode(2);

console.log('nodeA:', { val: nodeA.val, next: nodeA.next });
console.log('nodeB:', { val: nodeB.val, next: nodeB.next });
console.log('nodeC:', { val: nodeC.val, next: nodeC.next });
console.log('这些节点彼此独立，无法相互访问');
console.log();

console.log('通过next指针连接节点：');
nodeA.next = nodeB;
nodeB.next = nodeC;

console.log('nodeA:', { val: nodeA.val, next: nodeA.next ? `Node(${nodeA.next.val})` : null });
console.log('nodeB:', { val: nodeB.val, next: nodeB.next ? `Node(${nodeB.next.val})` : null });
console.log('nodeC:', { val: nodeC.val, next: nodeC.next ? `Node(${nodeC.next.val})` : null });
console.log('现在从nodeA可以访问到整个链表！');
console.log();

// 2. 链表创建过程的详细分析
console.log('2️⃣ 链表创建过程详细分析');
let dummy = new ListNode(0);
let current = dummy;

console.log('初始状态：');
console.log('dummy指向:', dummy.val);
console.log('current指向:', current.val);
console.log('dummy === current:', dummy === current);
console.log('内存中只有一个节点：Node_0');
console.log();

// 第一次添加节点
console.log('执行：current.next = new ListNode(1)');
current.next = new ListNode(1);

console.log('操作后的状态：');
console.log('dummy指向:', dummy.val);
console.log('current指向:', current.val);
console.log('dummy === current:', dummy === current);
console.log('dummy.next存在:', dummy.next !== null);
console.log('dummy.next.val:', dummy.next.val);
console.log('关键理解：dummy和current仍指向同一个节点Node_0');
console.log('但Node_0现在连接到了Node_1');
console.log();

console.log('执行：current = current.next');
current = current.next;

console.log('操作后的状态：');
console.log('dummy指向:', dummy.val);
console.log('current指向:', current.val);
console.log('dummy === current:', dummy === current);
console.log('关键理解：现在dummy和current指向不同节点');
console.log('dummy -> Node_0, current -> Node_1');
console.log('但Node_0仍然连接到Node_1');
console.log();

// 第二次添加节点
console.log('执行：current.next = new ListNode(2)');
current.next = new ListNode(2);

console.log('操作后的状态：');
console.log('dummy指向:', dummy.val);
console.log('current指向:', current.val);
console.log('dummy.next.val:', dummy.next.val);
console.log('dummy.next.next.val:', dummy.next.next.val);
console.log('关键理解：dummy仍指向Node_0');
console.log('current仍指向Node_1');
console.log('但现在Node_1连接到了Node_2');
console.log();

console.log('执行：current = current.next');
current = current.next;

console.log('最终状态：');
console.log('dummy指向:', dummy.val);
console.log('current指向:', current.val);
console.log('dummy === current:', dummy === current);
console.log('链表连接：Node_0 -> Node_1 -> Node_2');
console.log();

// 3. 验证dummy的访问能力
console.log('3️⃣ 验证dummy的访问能力');
console.log('从dummy开始遍历整个链表：');
let temp = dummy;
let step = 0;
while (temp) {
    console.log(`步骤${step}: 访问节点${temp.val}`);
    temp = temp.next;
    step++;
}
console.log('dummy能访问到所有节点！');
console.log();

// 4. 关键误区澄清
console.log('4️⃣ 关键误区澄清');
console.log('❌ 错误理解：dummy保存了current的变化');
console.log('✅ 正确理解：dummy通过链表连接访问到了所有节点');
console.log();

console.log('证明1：dummy本身从未改变');
console.log('dummy.val始终是:', dummy.val);
console.log();

console.log('证明2：dummy和current现在指向不同节点');
console.log('dummy.val:', dummy.val);
console.log('current.val:', current.val);
console.log('它们是不同的节点对象');
console.log();

console.log('证明3：如果断开连接，dummy就无法访问后续节点');
let originalNext = dummy.next;
dummy.next = null;  // 断开连接

console.log('断开连接后，从dummy遍历：');
temp = dummy;
let result = [];
while (temp) {
    result.push(temp.val);
    temp = temp.next;
}
console.log('结果:', result.join(' -> '));
console.log('只能访问到节点0，无法访问节点1和2');
console.log();

// 恢复连接
dummy.next = originalNext;
console.log('恢复连接后，从dummy遍历：');
temp = dummy;
result = [];
while (temp) {
    result.push(temp.val);
    temp = temp.next;
}
console.log('结果:', result.join(' -> '));
console.log('又能访问到所有节点了！');
console.log();

// 5. 内存结构可视化
console.log('5️⃣ 内存结构可视化');
console.log('变量指向：');
console.log('dummy -> Node_0 (val: 0)');
console.log('current -> Node_2 (val: 2)');
console.log();
console.log('节点连接：');
console.log('Node_0.next -> Node_1 (val: 1)');
console.log('Node_1.next -> Node_2 (val: 2)');
console.log('Node_2.next -> null');
console.log();
console.log('访问路径：');
console.log('dummy -> Node_0 -> Node_1 -> Node_2 -> null');
console.log('这就是链表的本质：通过指针连接形成的数据结构');
console.log();

// 6. 对比错误方法
console.log('6️⃣ 对比错误方法');
console.log('如果直接移动dummy会怎样？');

let dummy2 = new ListNode(0);
console.log('初始：dummy2指向Node_0');

dummy2.next = new ListNode(1);
console.log('连接：Node_0.next -> Node_1');

dummy2 = dummy2.next;  // 错误：移动dummy2
console.log('移动：dummy2现在指向Node_1');
console.log('问题：丢失了对Node_0的引用！');

dummy2.next = new ListNode(2);
console.log('连接：Node_1.next -> Node_2');

dummy2 = dummy2.next;  // 错误：继续移动dummy2
console.log('移动：dummy2现在指向Node_2');
console.log('问题：无法返回完整链表的头节点！');

console.log('尝试从dummy2遍历：');
temp = dummy2;
result = [];
while (temp) {
    result.push(temp.val);
    temp = temp.next;
}
console.log('结果:', result.join(' -> '));
console.log('只能看到最后一个节点，链表头丢失了！');
console.log();

console.log('=== 🎯 核心总结 ===');
console.log('1. dummy从未"保存"current的变化');
console.log('2. dummy通过链表连接关系访问到了所有节点');
console.log('3. 变量指向 ≠ 节点连接');
console.log('4. 链表的本质是通过next指针形成的连接关系');
console.log('5. 需要固定指针(dummy)保持头节点引用');
console.log('6. 需要移动指针(current)进行遍历和构建');
console.log();
console.log('💡 形象比喻：');
console.log('dummy = 火车站起点标记（固定不动）');
console.log('current = 铺设铁轨的工人（不断移动）');
console.log('next指针 = 铁轨连接');
console.log('从起点出发，沿着铁轨可以到达任何地方！');