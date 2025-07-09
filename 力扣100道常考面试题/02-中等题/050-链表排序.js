/**
 * LeetCode 148. 排序链表
 *
 * 问题描述：
 * 给你链表的头结点 head，请将其按升序排列并返回排序后的链表。
 *
 * 进阶要求：
 * - 你可以在 O(n log n) 时间复杂度和常数级空间复杂度下，对链表进行排序吗？
 *
 * 核心思想：
 * 链表排序是经典的分治算法应用，主要考察归并排序在链表上的实现
 * 关键在于链表的分割、合并操作，以及如何在不使用额外数组的情况下实现排序
 *
 * 主要解法有：
 * 1. 归并排序（递归） - O(n log n) 时间，O(log n) 空间
 * 2. 归并排序（迭代） - O(n log n) 时间，O(1) 空间
 * 3. 快速排序 - O(n log n) 平均，O(n²) 最坏
 * 4. 插入排序 - O(n²) 时间，O(1) 空间
 *
 * 示例：
 * 输入：head = [4,2,1,3]
 * 输出：[1,2,3,4]
 *
 * 输入：head = [-1,5,3,4,0]
 * 输出：[-1,0,3,4,5]
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
 * 方法一：归并排序（递归版本，推荐）
 *
 * 核心思想：
 * 使用分治的思想，将链表从中间分成两部分
 * 递归地对两部分进行排序，然后合并两个有序链表
 *
 * 算法步骤：
 * 1. 找到链表中点，将链表分成两部分
 * 2. 递归地对两部分进行排序
 * 3. 合并两个有序链表
 *
 * @param {ListNode} head - 链表头节点
 * @returns {ListNode} 排序后的链表头节点
 * @time O(n log n) 分治算法经典复杂度
 * @space O(log n) 递归栈空间
 */
function sortList(head) {
    console.log("=== 链表排序（归并排序-递归） ===");

    if (!head || !head.next) {
        console.log("链表为空或只有一个节点，无需排序");
        return head;
    }

    console.log(`原链表: ${formatList(head)}`);
    console.log(`\n开始归并排序:`);

    const result = mergeSortRecursive(head, 0);
    console.log(`\n排序完成！`);
    console.log(`最终结果: ${formatList(result)}`);

    return result;
}

/**
 * 递归归并排序核心函数
 * @param {ListNode} head - 待排序链表头
 * @param {number} depth - 递归深度（用于调试）
 * @returns {ListNode} 排序后的链表头
 */
function mergeSortRecursive(head, depth) {
    const indent = '  '.repeat(depth);
    console.log(`${indent}归并排序: ${formatList(head)}`);

    // 基础情况：空链表或单节点链表
    if (!head || !head.next) {
        console.log(`${indent}基础情况，直接返回: ${formatList(head)}`);
        return head;
    }

    // 分割链表：找到中点并分成两部分
    const [left, right] = splitList(head);
    console.log(`${indent}分割完成:`);
    console.log(`${indent}  左半部分: ${formatList(left)}`);
    console.log(`${indent}  右半部分: ${formatList(right)}`);

    // 递归排序左右两部分
    console.log(`${indent}递归排序左半部分:`);
    const sortedLeft = mergeSortRecursive(left, depth + 1);
    console.log(`${indent}递归排序右半部分:`);
    const sortedRight = mergeSortRecursive(right, depth + 1);

    // 合并两个有序链表
    console.log(`${indent}合并两个有序链表:`);
    console.log(`${indent}  左: ${formatList(sortedLeft)}`);
    console.log(`${indent}  右: ${formatList(sortedRight)}`);

    const merged = mergeTwoLists(sortedLeft, sortedRight);
    console.log(`${indent}合并结果: ${formatList(merged)}`);

    return merged;
}

/**
 * 方法二：归并排序（迭代版本，空间优化）
 *
 * 核心思想：
 * 自底向上的归并排序，从长度为1的子链表开始合并
 * 逐步增加子链表长度，直到合并整个链表
 * 实现真正的O(1)空间复杂度
 *
 * @param {ListNode} head - 链表头节点
 * @returns {ListNode} 排序后的链表头节点
 * @time O(n log n)
 * @space O(1) 真正的常数空间
 */
function sortListIterative(head) {
    console.log("\n=== 链表排序（归并排序-迭代） ===");

    if (!head || !head.next) {
        return head;
    }

    console.log(`原链表: ${formatList(head)}`);

    // 计算链表长度
    const length = getListLength(head);
    console.log(`链表长度: ${length}`);

    // 创建虚拟头节点，便于操作
    const dummy = new ListNode(0);
    dummy.next = head;

    console.log(`\n开始自底向上归并:`);

    // 子链表长度从1开始，每次翻倍
    for (let size = 1; size < length; size *= 2) {
        console.log(`\n当前子链表长度: ${size}`);

        let prev = dummy;
        let curr = dummy.next;

        while (curr) {
            // 获取第一个子链表
            const first = curr;
            const firstTail = getSublist(curr, size);
            curr = firstTail ? firstTail.next : null;
            if (firstTail) firstTail.next = null;

            // 获取第二个子链表
            const second = curr;
            let secondTail = null;
            if (second) {
                secondTail = getSublist(curr, size);
                curr = secondTail ? secondTail.next : null;
                if (secondTail) secondTail.next = null;
            }

            console.log(`  合并子链表:`);
            console.log(`    第一个: ${formatList(first)}`);
            console.log(`    第二个: ${formatList(second)}`);

            // 合并两个子链表
            const merged = mergeTwoLists(first, second);
            console.log(`    合并结果: ${formatList(merged)}`);

            // 连接到结果链表
            prev.next = merged;
            while (prev.next) {
                prev = prev.next;
            }
        }

        console.log(`  本轮合并后: ${formatList(dummy.next)}`);
    }

    console.log(`\n迭代归并完成！`);
    console.log(`最终结果: ${formatList(dummy.next)}`);

    return dummy.next;
}

/**
 * 方法三：快速排序
 *
 * 核心思想：
 * 选择一个基准节点，将链表分为三部分：
 * 小于基准的节点、等于基准的节点、大于基准的节点
 * 递归排序小于和大于的部分，然后连接
 *
 * @param {ListNode} head - 链表头节点
 * @returns {ListNode} 排序后的链表头节点
 * @time O(n log n) 平均，O(n²) 最坏
 * @space O(log n) 递归栈
 */
function sortListQuick(head) {
    console.log("\n=== 链表排序（快速排序） ===");

    if (!head || !head.next) {
        return head;
    }

    console.log(`原链表: ${formatList(head)}`);

    const result = quickSortList(head, 0);
    console.log(`\n快速排序完成！`);
    console.log(`最终结果: ${formatList(result)}`);

    return result;
}

/**
 * 快速排序核心函数
 */
function quickSortList(head, depth) {
    const indent = '  '.repeat(depth);
    console.log(`${indent}快速排序: ${formatList(head)}`);

    if (!head || !head.next) {
        return head;
    }

    // 选择第一个节点作为基准
    const pivot = head.val;
    console.log(`${indent}选择基准值: ${pivot}`);

    // 分割链表为三部分
    const [smaller, equal, larger] = partitionList(head, pivot);

    console.log(`${indent}分割结果:`);
    console.log(`${indent}  小于${pivot}: ${formatList(smaller)}`);
    console.log(`${indent}  等于${pivot}: ${formatList(equal)}`);
    console.log(`${indent}  大于${pivot}: ${formatList(larger)}`);

    // 递归排序小于和大于的部分
    const sortedSmaller = smaller ? quickSortList(smaller, depth + 1) : null;
    const sortedLarger = larger ? quickSortList(larger, depth + 1) : null;

    // 连接三部分
    const result = connectLists(sortedSmaller, equal, sortedLarger);
    console.log(`${indent}连接结果: ${formatList(result)}`);

    return result;
}

/**
 * 方法四：插入排序（简单但低效）
 *
 * 核心思想：
 * 维护一个已排序的链表，逐个从原链表取节点插入到正确位置
 * 虽然时间复杂度高，但实现简单，适合小规模数据
 *
 * @param {ListNode} head - 链表头节点
 * @returns {ListNode} 排序后的链表头节点
 * @time O(n²)
 * @space O(1)
 */
function sortListInsertion(head) {
    console.log("\n=== 链表排序（插入排序） ===");

    if (!head || !head.next) {
        return head;
    }

    console.log(`原链表: ${formatList(head)}`);

    const dummy = new ListNode(0);
    let curr = head;

    console.log(`\n开始插入排序:`);

    while (curr) {
        const next = curr.next;
        curr.next = null;

        console.log(`\n插入节点 ${curr.val}:`);
        console.log(`  当前已排序: ${formatList(dummy.next)}`);

        // 在已排序链表中找到插入位置
        let prev = dummy;
        while (prev.next && prev.next.val < curr.val) {
            prev = prev.next;
        }

        // 插入节点
        curr.next = prev.next;
        prev.next = curr;

        console.log(`  插入后: ${formatList(dummy.next)}`);

        curr = next;
    }

    console.log(`\n插入排序完成！`);
    console.log(`最终结果: ${formatList(dummy.next)}`);

    return dummy.next;
}

// ===========================================
// 辅助函数
// ===========================================

/**
 * 分割链表为两部分（找中点）
 * @param {ListNode} head - 链表头
 * @returns {ListNode[]} [左半部分, 右半部分]
 */
function splitList(head) {
    if (!head || !head.next) {
        return [head, null];
    }

    // 使用快慢指针找到中点
    let slow = head;
    let fast = head;
    let prev = null;

    while (fast && fast.next) {
        prev = slow;
        slow = slow.next;
        fast = fast.next.next;
    }

    // 断开链表
    if (prev) {
        prev.next = null;
    }

    return [head, slow];
}

/**
 * 合并两个有序链表
 * @param {ListNode} l1 - 有序链表1
 * @param {ListNode} l2 - 有序链表2
 * @returns {ListNode} 合并后的有序链表
 */
function mergeTwoLists(l1, l2) {
    const dummy = new ListNode(0);
    let curr = dummy;

    while (l1 && l2) {
        if (l1.val <= l2.val) {
            curr.next = l1;
            l1 = l1.next;
        } else {
            curr.next = l2;
            l2 = l2.next;
        }
        curr = curr.next;
    }

    // 连接剩余节点
    curr.next = l1 || l2;

    return dummy.next;
}

/**
 * 获取链表长度
 * @param {ListNode} head - 链表头
 * @returns {number} 链表长度
 */
function getListLength(head) {
    let length = 0;
    while (head) {
        length++;
        head = head.next;
    }
    return length;
}

/**
 * 获取指定长度的子链表
 * @param {ListNode} head - 链表头
 * @param {number} size - 子链表长度
 * @returns {ListNode} 子链表的尾节点
 */
function getSublist(head, size) {
    let curr = head;
    for (let i = 1; i < size && curr; i++) {
        curr = curr.next;
    }
    return curr;
}

/**
 * 根据基准值分割链表
 * @param {ListNode} head - 链表头
 * @param {number} pivot - 基准值
 * @returns {ListNode[]} [smaller, equal, larger]
 */
function partitionList(head, pivot) {
    const smallerDummy = new ListNode(0);
    const equalDummy = new ListNode(0);
    const largerDummy = new ListNode(0);

    let smaller = smallerDummy;
    let equal = equalDummy;
    let larger = largerDummy;

    while (head) {
        const next = head.next;
        head.next = null;

        if (head.val < pivot) {
            smaller.next = head;
            smaller = smaller.next;
        } else if (head.val === pivot) {
            equal.next = head;
            equal = equal.next;
        } else {
            larger.next = head;
            larger = larger.next;
        }

        head = next;
    }

    return [
        smallerDummy.next,
        equalDummy.next,
        largerDummy.next
    ];
}

/**
 * 连接三个链表
 * @param {ListNode} list1 - 链表1
 * @param {ListNode} list2 - 链表2
 * @param {ListNode} list3 - 链表3
 * @returns {ListNode} 连接后的链表
 */
function connectLists(list1, list2, list3) {
    const dummy = new ListNode(0);
    let curr = dummy;

    // 连接第一个链表
    if (list1) {
        curr.next = list1;
        while (curr.next) {
            curr = curr.next;
        }
    }

    // 连接第二个链表
    if (list2) {
        curr.next = list2;
        while (curr.next) {
            curr = curr.next;
        }
    }

    // 连接第三个链表
    if (list3) {
        curr.next = list3;
    }

    return dummy.next;
}

/**
 * 格式化链表为字符串
 * @param {ListNode} head - 链表头
 * @returns {string} 格式化字符串
 */
function formatList(head) {
    if (!head) return "null";

    const values = [];
    let curr = head;
    while (curr) {
        values.push(curr.val);
        curr = curr.next;
    }
    return '[' + values.join(' -> ') + ']';
}

/**
 * 从数组创建链表
 * @param {number[]} arr - 数值数组
 * @returns {ListNode} 链表头节点
 */
function createListFromArray(arr) {
    if (!arr || arr.length === 0) return null;

    const dummy = new ListNode(0);
    let curr = dummy;

    for (const val of arr) {
        curr.next = new ListNode(val);
        curr = curr.next;
    }

    return dummy.next;
}

/**
 * 将链表转换为数组
 * @param {ListNode} head - 链表头
 * @returns {number[]} 数值数组
 */
function listToArray(head) {
    const result = [];
    while (head) {
        result.push(head.val);
        head = head.next;
    }
    return result;
}

/**
 * 验证链表是否有序
 * @param {ListNode} head - 链表头
 * @returns {boolean} 是否有序
 */
function isListSorted(head) {
    if (!head || !head.next) return true;

    while (head.next) {
        if (head.val > head.next.val) {
            return false;
        }
        head = head.next;
    }
    return true;
}

/**
 * 验证所有方法的结果一致性
 * @param {number[]} arr - 测试数组
 * @returns {boolean} 是否一致
 */
function validateMethods(arr) {
    console.log("\n=== 方法结果验证 ===");

    const methods = [
        { name: "归并排序(递归)", func: sortList },
        { name: "归并排序(迭代)", func: sortListIterative },
        { name: "快速排序", func: sortListQuick },
        { name: "插入排序", func: sortListInsertion }
    ];

    const results = [];
    const expected = [...arr].sort((a, b) => a - b);

    console.log(`输入数组: [${arr.join(', ')}]`);
    console.log(`期望结果: [${expected.join(', ')}]`);

    for (const method of methods) {
        try {
            const head = createListFromArray([...arr]);
            const sortedHead = method.func(head);
            const result = listToArray(sortedHead);
            results.push(result);

            const isCorrect = JSON.stringify(result) === JSON.stringify(expected);
            const isSorted = isListSorted(createListFromArray(result));

            console.log(`${method.name}:`);
            console.log(`  结果: [${result.join(', ')}]`);
            console.log(`  正确性: ${isCorrect ? '✅' : '❌'}`);
            console.log(`  有序性: ${isSorted ? '✅' : '❌'}`);
        } catch (error) {
            console.log(`${method.name}: 执行失败 - ${error.message}`);
            results.push(null);
        }
    }

    // 检查结果一致性
    const validResults = results.filter(r => r !== null);
    let isConsistent = true;

    if (validResults.length > 1) {
        for (let i = 1; i < validResults.length; i++) {
            if (JSON.stringify(validResults[i]) !== JSON.stringify(validResults[0])) {
                isConsistent = false;
                break;
            }
        }
    }

    console.log(`结果一致性: ${isConsistent ? '✅ 所有方法结果一致' : '❌ 方法结果不一致'}`);

    return isConsistent;
}

/**
 * 性能测试
 */
function performanceTest() {
    console.log("\n=== 性能测试 ===");

    const testCases = [
        {
            input: [4,2,1,3],
            desc: "小数组测试"
        },
        {
            input: Array.from({length: 20}, () => Math.floor(Math.random() * 50)),
            desc: "中等随机数组"
        },
        {
            input: Array.from({length: 20}, (_, i) => 20 - i),
            desc: "逆序数组"
        },
        {
            input: Array.from({length: 20}, () => 5),
            desc: "重复元素数组"
        },
        {
            input: [],
            desc: "空数组"
        },
        {
            input: [1],
            desc: "单元素数组"
        }
    ];

    // 只测试高效算法
    const methods = [
        { name: "归并排序(递归)", func: sortList },
        { name: "归并排序(迭代)", func: sortListIterative }
    ];

    for (const testCase of testCases) {
        const { input, desc } = testCase;

        console.log(`\n测试用例: ${desc} (长度${input.length})`);
        console.log(`输入: [${input.slice(0, 10).join(', ')}${input.length > 10 ? '...' : ''}]`);

        for (const method of methods) {
            try {
                const head = createListFromArray([...input]);
                const startTime = performance.now();
                const result = method.func(head);
                const endTime = performance.now();

                const resultArray = listToArray(result);
                const isCorrect = isListSorted(result);

                console.log(`${method.name}: ${isCorrect ? '✅' : '❌'} 耗时${(endTime - startTime).toFixed(3)}ms`);
            } catch (error) {
                console.log(`${method.name}: ❌ 执行失败`);
            }
        }
    }
}

// ===========================================
// 测试用例
// ===========================================

/**
 * 测试函数
 */
function runTests() {
    console.log("=".repeat(50));
    console.log("链表排序算法测试");
    console.log("=".repeat(50));

    const testCases = [
        {
            input: [4,2,1,3],
            expected: [1,2,3,4],
            description: "基础排序测试"
        },
        {
            input: [-1,5,3,4,0],
            expected: [-1,0,3,4,5],
            description: "包含负数的排序"
        },
        {
            input: [],
            expected: [],
            description: "空链表"
        },
        {
            input: [1],
            expected: [1],
            description: "单节点链表"
        },
        {
            input: [2,1],
            expected: [1,2],
            description: "两节点链表"
        },
        {
            input: [3,3,3],
            expected: [3,3,3],
            description: "重复元素"
        },
        {
            input: [5,4,3,2,1],
            expected: [1,2,3,4,5],
            description: "逆序链表"
        },
        {
            input: [1,2,3,4,5],
            expected: [1,2,3,4,5],
            description: "已排序链表"
        },
        {
            input: [1,3,2,4,6,5],
            expected: [1,2,3,4,5,6],
            description: "部分有序链表"
        },
        {
            input: [0,-1,2,-3,4],
            expected: [-3,-1,0,2,4],
            description: "正负数混合"
        }
    ];

    testCases.forEach((testCase, index) => {
        console.log(`\n${"=".repeat(30)}`);
        console.log(`测试用例 ${index + 1}: ${testCase.description}`);
        console.log(`${"=".repeat(30)}`);

        const { input, expected } = testCase;
        console.log(`输入: [${input.join(', ')}]`);
        console.log(`期望结果: [${expected.join(', ')}]`);

        // 验证所有方法
        const isValid = validateMethods(input);
        console.log(`验证结果: ${isValid ? '✅' : '❌'}`);

        // 单独测试归并排序
        const head = createListFromArray([...input]);
        const result = sortList(head);
        const resultArray = listToArray(result);
        const isCorrect = JSON.stringify(resultArray) === JSON.stringify(expected);
        console.log(`实际结果: [${resultArray.join(', ')}]`);
        console.log(`测试通过: ${isCorrect ? '✅' : '❌'}`);
    });

    // 性能测试
    performanceTest();
}

// ===========================================
// 算法演示
// ===========================================

/**
 * 算法演示函数
 */
function demonstrateAlgorithm() {
    console.log("\n" + "=".repeat(50));
    console.log("链表排序算法演示");
    console.log("=".repeat(50));

    console.log("链表排序问题的核心特点:");
    console.log("1. 分治思想：归并排序的经典应用");
    console.log("2. 链表操作：分割、合并的指针技巧");
    console.log("3. 空间优化：迭代版本实现O(1)空间");
    console.log("4. 稳定排序：保持相等元素的原始顺序");

    const demoArray = [4,2,1,3];
    console.log(`\n演示数组: [${demoArray.join(', ')}]`);
    const demoHead = createListFromArray(demoArray);
    console.log(`创建链表: ${formatList(demoHead)}`);

    console.log("\n算法方法对比:");
    console.log("1. 归并排序(递归)：经典分治，O(log n)空间");
    console.log("2. 归并排序(迭代)：自底向上，O(1)空间");
    console.log("3. 快速排序：平均O(n log n)，最坏O(n²)");
    console.log("4. 插入排序：简单直观，O(n²)时间");

    console.log("\n详细演示 - 归并排序:");
    const sortedHead = sortList(createListFromArray(demoArray));

    console.log("\n算法应用场景:");
    console.log("- 大数据量链表的高效排序");
    console.log("- 内存受限环境的排序算法");
    console.log("- 稳定排序需求的数据处理");
    console.log("- 分布式系统中的数据合并");
}

// ===========================================
// 面试要点
// ===========================================

/**
 * 面试关键点总结
 */
function interviewKeyPoints() {
    console.log("\n" + "=".repeat(50));
    console.log("面试关键点");
    console.log("=".repeat(50));

    console.log("\n🎯 核心概念:");
    console.log("1. 分治思想：将大问题分解为小问题递归解决");
    console.log("2. 链表分割：快慢指针找中点，断开链表连接");
    console.log("3. 链表合并：双指针合并两个有序链表");
    console.log("4. 空间优化：迭代版本避免递归栈开销");

    console.log("\n🔧 实现技巧:");
    console.log("1. 快慢指针：快指针走两步，慢指针走一步找中点");
    console.log("2. 虚拟头节点：简化链表操作，避免空指针判断");
    console.log("3. 链表断开：正确处理prev指针，避免循环引用");
    console.log("4. 迭代合并：自底向上，子链表长度逐步翻倍");

    console.log("\n❗ 常见陷阱:");
    console.log("1. 忘记断开链表连接导致无限循环");
    console.log("2. 快慢指针边界条件处理不当");
    console.log("3. 合并链表时漏掉剩余节点的连接");
    console.log("4. 迭代版本的子链表长度计算错误");
    console.log("5. 空链表和单节点链表的特殊情况");

    console.log("\n🎨 变体问题:");
    console.log("1. 合并K个升序链表（LeetCode 23）");
    console.log("2. 链表的中间结点（LeetCode 876）");
    console.log("3. 分隔链表（LeetCode 86）");
    console.log("4. 重排链表（LeetCode 143）");
    console.log("5. 对链表进行插入排序（LeetCode 147）");

    console.log("\n📊 复杂度分析:");
    console.log("时间复杂度:");
    console.log("- 归并排序: O(n log n) 分治算法标准复杂度");
    console.log("- 快速排序: O(n log n) 平均，O(n²) 最坏");
    console.log("- 插入排序: O(n²) 简单但低效");

    console.log("\n空间复杂度:");
    console.log("- 递归归并: O(log n) 递归栈空间");
    console.log("- 迭代归并: O(1) 真正的常数空间");
    console.log("- 快速排序: O(log n) 递归栈空间");

    console.log("\n💡 面试技巧:");
    console.log("1. 先说明分治思想，画图演示分割过程");
    console.log("2. 重点讲解快慢指针找中点的技巧");
    console.log("3. 详细说明链表合并的双指针操作");
    console.log("4. 讨论递归和迭代版本的空间差异");
    console.log("5. 提及稳定排序的重要性");

    console.log("\n🔍 相关概念:");
    console.log("1. 分治算法的设计思想和应用场景");
    console.log("2. 链表操作的常用技巧和注意事项");
    console.log("3. 排序算法的稳定性和复杂度权衡");
    console.log("4. 递归与迭代的空间复杂度差异");

    console.log("\n🌟 实际应用:");
    console.log("1. 数据库系统中大型记录集的排序");
    console.log("2. 分布式系统中数据流的合并排序");
    console.log("3. 内存受限环境下的外部排序");
    console.log("4. 实时数据处理中的增量排序");
    console.log("5. 文件系统中链式存储的数据排序");

    console.log("\n📋 链表排序解题模板:");
    console.log("```javascript");
    console.log("function sortList(head) {");
    console.log("    // 基础情况");
    console.log("    if (!head || !head.next) return head;");
    console.log("    ");
    console.log("    // 分割链表");
    console.log("    const [left, right] = splitList(head);");
    console.log("    ");
    console.log("    // 递归排序");
    console.log("    const sortedLeft = sortList(left);");
    console.log("    const sortedRight = sortList(right);");
    console.log("    ");
    console.log("    // 合并有序链表");
    console.log("    return mergeTwoLists(sortedLeft, sortedRight);");
    console.log("}");
    console.log("```");

    console.log("\n🚀 关键操作要点:");
    console.log("1. 快慢指针找中点：while (fast && fast.next)");
    console.log("2. 断开链表：prev.next = null");
    console.log("3. 合并链表：比较节点值，连接较小者");
    console.log("4. 虚拟头节点：简化边界条件处理");
    console.log("5. 迭代合并：子链表长度从1开始翻倍");
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ListNode,
        sortList,
        sortListIterative,
        sortListQuick,
        sortListInsertion,
        createListFromArray,
        listToArray,
        formatList,
        isListSorted,
        mergeTwoLists,
        splitList,
        validateMethods,
        performanceTest,
        runTests,
        demonstrateAlgorithm,
        interviewKeyPoints
    };
}

// 如果在浏览器环境中，运行演示
if (typeof window !== 'undefined') {
    runTests();
    demonstrateAlgorithm();
    interviewKeyPoints();
}