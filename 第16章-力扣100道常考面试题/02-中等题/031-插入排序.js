/**
 * 插入排序详解
 *
 * 问题描述：
 * 实现插入排序算法，对数组进行升序排序
 *
 * 核心思想：
 * 插入排序的工作原理类似于我们整理扑克牌的过程：
 * 1. 从第二个元素开始，将当前元素插入到前面已排序部分的正确位置
 * 2. 通过不断地将未排序元素插入到已排序部分，最终完成整个数组的排序
 *
 * 算法特点：
 * - 稳定排序：相同元素的相对顺序不会改变
 * - 原地排序：只使用常数级别的额外空间
 * - 自适应排序：对于部分有序的数组表现很好
 * - 在线排序：可以在接收数据的同时进行排序
 */

/**
 * 方法一：基础插入排序
 *
 * 核心思想：
 * 维护一个已排序区间[0, i-1]，每次将arr[i]插入到正确位置
 *
 * 算法步骤：
 * 1. 从第二个元素开始遍历（下标1）
 * 2. 将当前元素保存为key
 * 3. 从已排序部分的末尾开始向前比较
 * 4. 将大于key的元素向右移动一位
 * 5. 在正确位置插入key
 *
 * @param {number[]} arr - 待排序数组
 * @returns {number[]} 排序后的数组
 * @time O(n²) - 最坏情况下需要比较n(n-1)/2次
 * @space O(1) - 只使用常数级别的额外空间
 */
function insertionSort(arr) {
    console.log("开始插入排序:", arr.join(', '));

    // 从第二个元素开始，前面的元素默认已排序
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];  // 当前要插入的元素
        let j = i - 1;     // 已排序部分的最后一个元素索引

        console.log(`\n第${i}轮：插入元素 ${key}`);
        console.log(`已排序部分: [${arr.slice(0, i).join(', ')}]`);
        console.log(`当前状态: [${arr.join(', ')}]`);

        // 向左查找插入位置，同时右移大于key的元素
        while (j >= 0 && arr[j] > key) {
            console.log(`  ${arr[j]} > ${key}，向右移动`);
            arr[j + 1] = arr[j];  // 将大元素向右移动
            j--;
        }

        // 在正确位置插入key
        arr[j + 1] = key;
        console.log(`  插入${key}到位置${j + 1}`);
        console.log(`  结果: [${arr.join(', ')}]`);
    }

    console.log("\n排序完成:", arr.join(', '));
    return arr;
}

/**
 * 方法二：优化的插入排序（二分查找插入位置）
 *
 * 核心思想：
 * 使用二分查找来找到插入位置，减少比较次数
 *
 * 优化点：
 * - 查找插入位置的时间复杂度从O(n)降到O(log n)
 * - 但移动元素的时间复杂度仍然是O(n)
 *
 * @param {number[]} arr - 待排序数组
 * @returns {number[]} 排序后的数组
 * @time O(n²) - 移动元素仍需要O(n²)时间
 * @space O(1) - 只使用常数级别的额外空间
 */
function binaryInsertionSort(arr) {
    console.log("开始二分插入排序:", arr.join(', '));

    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];

        // 使用二分查找找到插入位置
        let left = 0, right = i;
        while (left < right) {
            let mid = Math.floor((left + right) / 2);
            if (arr[mid] <= key) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }

        console.log(`\n第${i}轮：插入${key}到位置${left}`);

        // 将元素向右移动，腾出插入位置
        for (let j = i; j > left; j--) {
            arr[j] = arr[j - 1];
        }

        // 插入元素
        arr[left] = key;
        console.log(`结果: [${arr.join(', ')}]`);
    }

    return arr;
}

/**
 * 方法三：希尔排序（插入排序的改进版）
 *
 * 核心思想：
 * 先进行粗调整（大间隔），再进行细调整（小间隔）
 * 最后一轮就是标准的插入排序（间隔为1）
 *
 * 算法步骤：
 * 1. 选择一个间隔序列（如n/2, n/4, ..., 1）
 * 2. 对每个间隔进行插入排序
 * 3. 逐步缩小间隔，直到间隔为1
 *
 * @param {number[]} arr - 待排序数组
 * @returns {number[]} 排序后的数组
 * @time O(n^1.3) - 平均时间复杂度，具体取决于间隔序列
 * @space O(1) - 只使用常数级别的额外空间
 */
function shellSort(arr) {
    console.log("开始希尔排序:", arr.join(', '));

    // 初始间隔为数组长度的一半
    for (let gap = Math.floor(arr.length / 2); gap > 0; gap = Math.floor(gap / 2)) {
        console.log(`\n使用间隔 ${gap} 进行排序:`);

        // 对每个间隔进行插入排序
        for (let i = gap; i < arr.length; i++) {
            let key = arr[i];
            let j = i;

            // 间隔为gap的插入排序
            while (j >= gap && arr[j - gap] > key) {
                arr[j] = arr[j - gap];
                j -= gap;
            }
            arr[j] = key;
        }

        console.log(`间隔${gap}排序后: [${arr.join(', ')}]`);
    }

    return arr;
}

/**
 * 方法四：递归版本的插入排序
 *
 * 核心思想：
 * 先递归排序前n-1个元素，然后将第n个元素插入到正确位置
 *
 * @param {number[]} arr - 待排序数组
 * @param {number} n - 排序前n个元素
 * @returns {number[]} 排序后的数组
 * @time O(n²) - 与迭代版本相同
 * @space O(n) - 递归调用栈的空间
 */
function recursiveInsertionSort(arr, n = arr.length) {
    // 基本情况：只有一个元素或没有元素
    if (n <= 1) return arr;

    // 先排序前n-1个元素
    recursiveInsertionSort(arr, n - 1);

    // 将第n个元素插入到正确位置
    let key = arr[n - 1];
    let j = n - 2;

    while (j >= 0 && arr[j] > key) {
        arr[j + 1] = arr[j];
        j--;
    }
    arr[j + 1] = key;

    return arr;
}

// ===========================================
// 测试用例
// ===========================================

/**
 * 测试函数
 */
function runTests() {
    console.log("=".repeat(50));
    console.log("插入排序算法测试");
    console.log("=".repeat(50));

    const testCases = [
        [64, 34, 25, 12, 22, 11, 90],
        [5, 2, 4, 6, 1, 3],
        [1],
        [],
        [3, 3, 3, 3],
        [9, 8, 7, 6, 5, 4, 3, 2, 1]
    ];

    testCases.forEach((testCase, index) => {
        console.log(`\n--- 测试用例 ${index + 1} ---`);
        console.log("原数组:", testCase.join(', '));

        // 测试基础插入排序
        const arr1 = [...testCase];
        insertionSort(arr1);

        // 测试二分插入排序
        console.log("\n二分插入排序:");
        const arr2 = [...testCase];
        binaryInsertionSort(arr2);

        // 测试希尔排序
        console.log("\n希尔排序:");
        const arr3 = [...testCase];
        shellSort(arr3);
    });
}

// ===========================================
// 性能测试
// ===========================================

/**
 * 性能测试函数
 */
function performanceTest() {
    console.log("\n" + "=".repeat(50));
    console.log("性能测试");
    console.log("=".repeat(50));

    const sizes = [100, 1000, 5000];

    sizes.forEach(size => {
        console.log(`\n测试数组大小: ${size}`);

        // 生成随机数组
        const randomArr = Array.from({length: size}, () => Math.floor(Math.random() * 1000));

        // 测试插入排序
        const arr1 = [...randomArr];
        const start1 = performance.now();
        insertionSort(arr1);
        const end1 = performance.now();
        console.log(`插入排序耗时: ${(end1 - start1).toFixed(2)}ms`);

        // 测试二分插入排序
        const arr2 = [...randomArr];
        const start2 = performance.now();
        binaryInsertionSort(arr2);
        const end2 = performance.now();
        console.log(`二分插入排序耗时: ${(end2 - start2).toFixed(2)}ms`);

        // 测试希尔排序
        const arr3 = [...randomArr];
        const start3 = performance.now();
        shellSort(arr3);
        const end3 = performance.now();
        console.log(`希尔排序耗时: ${(end3 - start3).toFixed(2)}ms`);
    });
}

// ===========================================
// 算法演示
// ===========================================

/**
 * 算法演示函数
 */
function demonstrateAlgorithm() {
    console.log("\n" + "=".repeat(50));
    console.log("插入排序算法演示");
    console.log("=".repeat(50));

    const demoArray = [5, 2, 4, 6, 1, 3];
    console.log("演示数组:", demoArray.join(', '));

    console.log("\n插入排序过程详解:");
    console.log("想象成整理手中的扑克牌：");
    console.log("1. 第一张牌默认已排序");
    console.log("2. 拿起第二张牌，与第一张比较，插入正确位置");
    console.log("3. 拿起第三张牌，在前两张中找到正确位置插入");
    console.log("4. 重复此过程直到所有牌都插入正确位置");

    const result = insertionSort([...demoArray]);

    console.log("\n时间复杂度分析:");
    console.log("- 最好情况：O(n) - 数组已经有序");
    console.log("- 平均情况：O(n²) - 随机数组");
    console.log("- 最坏情况：O(n²) - 数组逆序");

    console.log("\n空间复杂度：O(1) - 只使用常数额外空间");

    console.log("\n算法特点:");
    console.log("✅ 稳定排序");
    console.log("✅ 原地排序");
    console.log("✅ 自适应排序");
    console.log("✅ 在线排序");
    console.log("✅ 对小数组效率高");
}

// ===========================================
// 边界情况分析
// ===========================================

/**
 * 边界情况测试
 */
function edgeCaseAnalysis() {
    console.log("\n" + "=".repeat(50));
    console.log("边界情况分析");
    console.log("=".repeat(50));

    console.log("\n1. 空数组:");
    console.log("输入: []");
    console.log("输出:", insertionSort([]).join(', '));

    console.log("\n2. 单元素数组:");
    console.log("输入: [42]");
    console.log("输出:", insertionSort([42]).join(', '));

    console.log("\n3. 已排序数组:");
    console.log("输入: [1, 2, 3, 4, 5]");
    console.log("输出:", insertionSort([1, 2, 3, 4, 5]).join(', '));

    console.log("\n4. 逆序数组:");
    console.log("输入: [5, 4, 3, 2, 1]");
    console.log("输出:", insertionSort([5, 4, 3, 2, 1]).join(', '));

    console.log("\n5. 重复元素:");
    console.log("输入: [3, 1, 3, 1, 3]");
    console.log("输出:", insertionSort([3, 1, 3, 1, 3]).join(', '));
}

// ===========================================
// 复杂度分析
// ===========================================

/**
 * 复杂度分析
 */
function complexityAnalysis() {
    console.log("\n" + "=".repeat(50));
    console.log("算法复杂度详细分析");
    console.log("=".repeat(50));

    console.log("\n时间复杂度分析:");
    console.log("┌─────────────┬─────────────┬─────────────────┐");
    console.log("│    情况     │ 时间复杂度  │      说明       │");
    console.log("├─────────────┼─────────────┼─────────────────┤");
    console.log("│  最好情况   │    O(n)     │ 数组已经有序    │");
    console.log("│  平均情况   │   O(n²)     │ 随机排列数组    │");
    console.log("│  最坏情况   │   O(n²)     │ 数组完全逆序    │");
    console.log("└─────────────┴─────────────┴─────────────────┘");

    console.log("\n空间复杂度: O(1)");
    console.log("- 只使用了常数个额外变量");
    console.log("- 是原地排序算法");

    console.log("\n各版本比较:");
    console.log("┌─────────────────┬─────────────┬─────────────┬──────────┐");
    console.log("│     算法版本    │ 时间复杂度  │ 空间复杂度  │   特点   │");
    console.log("├─────────────────┼─────────────┼─────────────┼──────────┤");
    console.log("│   基础插入排序  │   O(n²)     │    O(1)     │  简单直观 │");
    console.log("│   二分插入排序  │   O(n²)     │    O(1)     │  减少比较 │");
    console.log("│     希尔排序    │  O(n^1.3)   │    O(1)     │  性能更好 │");
    console.log("│   递归插入排序  │   O(n²)     │    O(n)     │  理解递归 │");
    console.log("└─────────────────┴─────────────┴─────────────┴──────────┘");
}

// ===========================================
// 扩展应用
// ===========================================

/**
 * 扩展应用示例
 */
function extendedApplications() {
    console.log("\n" + "=".repeat(50));
    console.log("插入排序的扩展应用");
    console.log("=".repeat(50));

    // 1. 部分排序
    console.log("\n1. 部分排序 - 只排序数组的一部分:");
    function partialInsertionSort(arr, start, end) {
        for (let i = start + 1; i <= end; i++) {
            let key = arr[i];
            let j = i - 1;
            while (j >= start && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
        return arr;
    }

    const partialArr = [3, 7, 1, 9, 2, 8, 4];
    console.log("原数组:", partialArr.join(', '));
    console.log("排序索引2-5:", partialInsertionSort([...partialArr], 2, 5).join(', '));

    // 2. 对象排序
    console.log("\n2. 对象数组排序:");
    function insertionSortObjects(arr, keyFunc) {
        for (let i = 1; i < arr.length; i++) {
            let key = arr[i];
            let j = i - 1;
            while (j >= 0 && keyFunc(arr[j]) > keyFunc(key)) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
        return arr;
    }

    const students = [
        {name: "Alice", score: 85},
        {name: "Bob", score: 92},
        {name: "Charlie", score: 78}
    ];
    console.log("原数组:", students.map(s => `${s.name}:${s.score}`).join(', '));
    const sortedStudents = insertionSortObjects([...students], s => s.score);
    console.log("按分数排序:", sortedStudents.map(s => `${s.name}:${s.score}`).join(', '));

    // 3. 链表插入排序
    console.log("\n3. 插入排序的实际应用场景:");
    console.log("- 数据库中的小表排序");
    console.log("- 在线算法：数据流排序");
    console.log("- 混合排序算法的子过程（如快速排序的小数组处理）");
    console.log("- 游戏开发中的得分排序");
    console.log("- 嵌入式系统中的简单排序");
}

// ===========================================
// 实际案例
// ===========================================

/**
 * 实际案例演示
 */
function practicalExamples() {
    console.log("\n" + "=".repeat(50));
    console.log("实际案例演示");
    console.log("=".repeat(50));

    // 案例1：扑克牌排序
    console.log("\n案例1：扑克牌排序");
    const cards = ["K", "3", "A", "7", "J", "2", "Q"];
    const cardValues = {"A": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7,
                       "8": 8, "9": 9, "10": 10, "J": 11, "Q": 12, "K": 13};

    function sortCards(cards) {
        for (let i = 1; i < cards.length; i++) {
            let key = cards[i];
            let j = i - 1;
            while (j >= 0 && cardValues[cards[j]] > cardValues[key]) {
                cards[j + 1] = cards[j];
                j--;
            }
            cards[j + 1] = key;
        }
        return cards;
    }

    console.log("原牌:", cards.join(', '));
    console.log("排序后:", sortCards([...cards]).join(', '));

    // 案例2：成绩排序
    console.log("\n案例2：学生成绩排序");
    const grades = [88, 76, 92, 64, 85, 91, 73];
    console.log("原成绩:", grades.join(', '));
    console.log("排序后:", insertionSort([...grades]).join(', '));

    // 案例3：时间排序
    console.log("\n案例3：时间点排序");
    const times = ["14:30", "09:15", "18:45", "12:00", "07:30"];
    function timeToMinutes(time) {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }

    function sortTimes(times) {
        for (let i = 1; i < times.length; i++) {
            let key = times[i];
            let j = i - 1;
            while (j >= 0 && timeToMinutes(times[j]) > timeToMinutes(key)) {
                times[j + 1] = times[j];
                j--;
            }
            times[j + 1] = key;
        }
        return times;
    }

    console.log("原时间:", times.join(', '));
    console.log("排序后:", sortTimes([...times]).join(', '));
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
    console.log("1. 插入排序是稳定的原地排序算法");
    console.log("2. 核心思想：维护已排序区间，逐个插入新元素");
    console.log("3. 类似于整理扑克牌的过程");

    console.log("\n🔧 实现技巧:");
    console.log("1. 从第二个元素开始遍历（第一个元素默认已排序）");
    console.log("2. 使用while循环向左查找插入位置");
    console.log("3. 边比较边移动元素，避免额外的交换操作");

    console.log("\n⚡ 优化方向:");
    console.log("1. 二分查找优化：减少比较次数");
    console.log("2. 希尔排序：先粗调整后细调整");
    console.log("3. 哨兵优化：减少边界检查");

    console.log("\n❗ 常见陷阱:");
    console.log("1. 边界条件：空数组和单元素数组");
    console.log("2. 索引越界：while循环的边界条件");
    console.log("3. 稳定性：相同元素的处理");

    console.log("\n🔗 相关问题:");
    console.log("1. 与其他O(n²)排序算法的比较");
    console.log("2. 什么情况下选择插入排序");
    console.log("3. 插入排序的优化版本");
    console.log("4. 混合排序算法中的应用");
}

// ===========================================
// 导出所有方法
// ===========================================

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        insertionSort,
        binaryInsertionSort,
        shellSort,
        recursiveInsertionSort,
        runTests,
        performanceTest,
        demonstrateAlgorithm,
        edgeCaseAnalysis,
        complexityAnalysis,
        extendedApplications,
        practicalExamples,
        interviewKeyPoints
    };
}

// 如果在浏览器环境中，运行演示
if (typeof window !== 'undefined') {
    // 运行所有演示
    runTests();
    performanceTest();
    demonstrateAlgorithm();
    edgeCaseAnalysis();
    complexityAnalysis();
    extendedApplications();
    practicalExamples();
    interviewKeyPoints();
}