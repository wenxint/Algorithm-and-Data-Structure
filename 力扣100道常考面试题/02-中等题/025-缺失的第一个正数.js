/**
 * LeetCode 027: 缺失的第一个正数 (First Missing Positive)
 *
 * 题目描述：
 * 给你一个未排序的整数数组 nums，请你找出其中没有出现的最小的正整数。
 * 请你实现时间复杂度为 O(n) 并且只使用常数级别额外空间的解决方案。
 *
 * 示例：
 * 输入: nums = [1,2,0]
 * 输出: 3
 *
 * 输入: nums = [3,4,-1,1]
 * 输出: 2
 *
 * 输入: nums = [7,8,9,11,12]
 * 输出: 1
 *
 * 核心思想：
 * 1. 原地哈希法：将数组本身作为哈希表，nums[i] = i+1
 * 2. 负数标记法：用负号标记数字的存在性
 * 3. 哈希表法：使用额外Set存储（违反空间约束）
 * 4. 排序法：先排序再遍历（违反时间约束）
 *
 * 解题要点：
 * - 理解问题本质：在[1,n+1]范围内找缺失的最小正数
 * - 利用数组索引和值的映射关系
 * - 处理负数、零和超出范围的数字
 * - 原地修改技巧：置换、标记
 */

/**
 * 方法一：原地哈希法（推荐解法）
 *
 * 核心思想：
 * 将数组本身作为哈希表，让 nums[i] = i + 1
 * 对于范围在[1,n]内的数字x，将其放到索引x-1的位置
 * 最后遍历数组，第一个不满足nums[i] = i+1的位置就是答案
 *
 * 算法步骤：
 * 1. 遍历数组，将每个在[1,n]范围内的数字放到正确位置
 * 2. 使用置换操作，确保nums[x-1] = x
 * 3. 再次遍历，找到第一个nums[i] ≠ i+1的位置
 * 4. 返回i+1作为缺失的最小正数
 *
 * @param {number[]} nums - 输入数组
 * @returns {number} 缺失的第一个正数
 * @time O(n) - 最多遍历数组常数倍
 * @space O(1) - 只使用常数额外空间
 */
function firstMissingPositive(nums) {
    const n = nums.length;

    // 步骤1：将每个数字放到正确的位置
    for (let i = 0; i < n; i++) {
        // 当前数字在有效范围内且不在正确位置时
        while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {
            // 将nums[i]放到正确位置nums[i]-1
            const correctIndex = nums[i] - 1;
            [nums[i], nums[correctIndex]] = [nums[correctIndex], nums[i]];
        }
    }

    // 步骤2：找到第一个不在正确位置的数字
    for (let i = 0; i < n; i++) {
        if (nums[i] !== i + 1) {
            return i + 1; // 缺失的第一个正数
        }
    }

    // 如果[1,n]都存在，那么缺失的是n+1
    return n + 1;
}

/**
 * 方法二：负数标记法
 *
 * 核心思想：
 * 先将所有非正数替换为n+1，然后用负号标记数字的存在
 * 对于数字x，将nums[x-1]标记为负数
 * 最后找到第一个正数位置，对应的就是缺失数字
 *
 * 算法步骤：
 * 1. 将所有≤0的数字替换为n+1
 * 2. 遍历数组，对于每个数字x的绝对值，将nums[|x|-1]标记为负数
 * 3. 找到第一个正数位置i，返回i+1
 *
 * @param {number[]} nums - 输入数组
 * @returns {number} 缺失的第一个正数
 * @time O(n) - 遍历数组三次
 * @space O(1) - 只使用常数额外空间
 */
function firstMissingPositiveNegative(nums) {
    const n = nums.length;

    // 步骤1：将所有非正数替换为n+1
    for (let i = 0; i < n; i++) {
        if (nums[i] <= 0) {
            nums[i] = n + 1;
        }
    }

    // 步骤2：用负号标记数字的存在
    for (let i = 0; i < n; i++) {
        const num = Math.abs(nums[i]);

        // 如果数字在[1,n]范围内，标记对应位置
        if (num <= n) {
            nums[num - 1] = -Math.abs(nums[num - 1]);
        }
    }

    // 步骤3：找到第一个正数位置
    for (let i = 0; i < n; i++) {
        if (nums[i] > 0) {
            return i + 1;
        }
    }

    // 如果都被标记为负数，说明[1,n]都存在
    return n + 1;
}

/**
 * 方法三：哈希表法（违反空间约束）
 *
 * 核心思想：
 * 使用Set存储所有正数，然后从1开始查找缺失的数字
 *
 * 注意：此方法违反了O(1)空间限制
 *
 * @param {number[]} nums - 输入数组
 * @returns {number} 缺失的第一个正数
 * @time O(n) - 遍历数组和Set各一次
 * @space O(n) - 最坏情况下Set存储n个元素
 */
function firstMissingPositiveHashSet(nums) {
    const positiveSet = new Set();

    // 将所有正数加入Set
    for (const num of nums) {
        if (num > 0) {
            positiveSet.add(num);
        }
    }

    // 从1开始查找缺失的数字
    for (let i = 1; i <= nums.length + 1; i++) {
        if (!positiveSet.has(i)) {
            return i;
        }
    }

    return nums.length + 1; // 理论上不会到达这里
}

/**
 * 方法四：排序法（违反时间约束）
 *
 * 核心思想：
 * 先对数组排序，然后遍历找到缺失的第一个正数
 *
 * 注意：此方法违反了O(n)时间限制
 *
 * @param {number[]} nums - 输入数组
 * @returns {number} 缺失的第一个正数
 * @time O(n log n) - 排序的时间复杂度
 * @space O(1) - 原地排序
 */
function firstMissingPositiveSort(nums) {
    nums.sort((a, b) => a - b);

    let expected = 1;

    for (const num of nums) {
        if (num === expected) {
            expected++;
        } else if (num > expected) {
            break;
        }
        // 跳过重复数字和非正数
    }

    return expected;
}

/**
 * 方法五：分离正负数法
 *
 * 核心思想：
 * 先将正数和非正数分离，然后在正数部分使用负数标记法
 *
 * @param {number[]} nums - 输入数组
 * @returns {number} 缺失的第一个正数
 * @time O(n) - 遍历数组常数倍
 * @space O(1) - 只使用常数额外空间
 */
function firstMissingPositiveSeparate(nums) {
    const n = nums.length;

    // 步骤1：分离正数和非正数
    let positiveCount = 0;

    for (let i = 0; i < n; i++) {
        if (nums[i] > 0) {
            // 将正数移到前面
            [nums[positiveCount], nums[i]] = [nums[i], nums[positiveCount]];
            positiveCount++;
        }
    }

    // 如果没有正数，答案是1
    if (positiveCount === 0) {
        return 1;
    }

    // 步骤2：在正数部分使用负数标记法
    for (let i = 0; i < positiveCount; i++) {
        const num = Math.abs(nums[i]);

        // 如果数字在[1,positiveCount]范围内
        if (num <= positiveCount) {
            nums[num - 1] = -Math.abs(nums[num - 1]);
        }
    }

    // 步骤3：找到第一个正数位置
    for (let i = 0; i < positiveCount; i++) {
        if (nums[i] > 0) {
            return i + 1;
        }
    }

    // 如果[1,positiveCount]都存在，答案是positiveCount+1
    return positiveCount + 1;
}

/**
 * 方法六：布尔数组法（违反空间约束）
 *
 * 核心思想：
 * 使用布尔数组记录每个正数是否存在
 *
 * @param {number[]} nums - 输入数组
 * @returns {number} 缺失的第一个正数
 * @time O(n) - 遍历数组两次
 * @space O(n) - 使用布尔数组
 */
function firstMissingPositiveBoolean(nums) {
    const n = nums.length;
    const exists = new Array(n + 2).fill(false); // [0, n+1]

    // 标记存在的正数
    for (const num of nums) {
        if (num > 0 && num <= n + 1) {
            exists[num] = true;
        }
    }

    // 找到第一个不存在的正数
    for (let i = 1; i <= n + 1; i++) {
        if (!exists[i]) {
            return i;
        }
    }

    return n + 2; // 理论上不会到达这里
}

// 测试用例
function runTests() {
    console.log('=== LeetCode 027: 缺失的第一个正数 测试 ===\n');

    const testCases = [
        {
            name: '基础测试1',
            input: [1, 2, 0],
            expected: 3,
            explanation: '缺失3'
        },
        {
            name: '基础测试2',
            input: [3, 4, -1, 1],
            expected: 2,
            explanation: '缺失2'
        },
        {
            name: '基础测试3',
            input: [7, 8, 9, 11, 12],
            expected: 1,
            explanation: '缺失1'
        },
        {
            name: '单元素正数',
            input: [1],
            expected: 2,
            explanation: '只有1，缺失2'
        },
        {
            name: '单元素非正数',
            input: [0],
            expected: 1,
            explanation: '只有0，缺失1'
        },
        {
            name: '连续正数',
            input: [1, 2, 3, 4, 5],
            expected: 6,
            explanation: '连续1-5，缺失6'
        },
        {
            name: '乱序连续',
            input: [5, 3, 4, 1, 2],
            expected: 6,
            explanation: '乱序1-5，缺失6'
        },
        {
            name: '有重复数字',
            input: [1, 1, 2, 2],
            expected: 3,
            explanation: '重复1和2，缺失3'
        },
        {
            name: '全是负数',
            input: [-1, -2, -3],
            expected: 1,
            explanation: '没有正数，缺失1'
        },
        {
            name: '包含大数',
            input: [1, 1000],
            expected: 2,
            explanation: '有1和1000，缺失2'
        },
        {
            name: '空数组',
            input: [],
            expected: 1,
            explanation: '空数组，缺失1'
        },
        {
            name: '混合情况',
            input: [3, 4, -1, 1, 0, 6, 2],
            expected: 5,
            explanation: '有1,2,3,4,6，缺失5'
        }
    ];

    const methods = [
        { name: '原地哈希法', func: firstMissingPositive },
        { name: '负数标记法', func: firstMissingPositiveNegative },
        { name: '哈希表法', func: firstMissingPositiveHashSet },
        { name: '排序法', func: firstMissingPositiveSort },
        { name: '分离正负数法', func: firstMissingPositiveSeparate },
        { name: '布尔数组法', func: firstMissingPositiveBoolean }
    ];

    testCases.forEach(testCase => {
        console.log(`测试: ${testCase.name}`);
        console.log(`输入: [${testCase.input.join(',')}]`);
        console.log(`期望: ${testCase.expected}`);
        console.log(`说明: ${testCase.explanation}`);

        methods.forEach(method => {
            const nums = [...testCase.input]; // 创建副本避免修改原数组
            const result = method.func(nums);
            const isCorrect = result === testCase.expected;
            console.log(`${method.name}: ${result} ${isCorrect ? '✓' : '✗'}`);
        });
        console.log('');
    });
}

// 性能测试
function performanceTest() {
    console.log('=== 性能测试 ===\n');

    const testCases = [
        { size: 1000, desc: '中等数组' },
        { size: 10000, desc: '大数组' },
        { size: 100000, desc: '超大数组' }
    ];

    const methods = [
        { name: '原地哈希法', func: firstMissingPositive },
        { name: '负数标记法', func: firstMissingPositiveNegative },
        { name: '哈希表法', func: firstMissingPositiveHashSet },
        { name: '分离正负数法', func: firstMissingPositiveSeparate }
        // 跳过排序法，因为时间复杂度过高
    ];

    testCases.forEach(testCase => {
        console.log(`测试: ${testCase.desc} (n=${testCase.size})`);

        // 生成测试数组：随机整数，包含负数、零、正数
        const testArray = Array.from({length: testCase.size}, () =>
            Math.floor(Math.random() * testCase.size * 2) - testCase.size
        );

        methods.forEach(method => {
            const nums = [...testArray];
            const startTime = performance.now();
            const result = method.func(nums);
            const endTime = performance.now();

            console.log(`${method.name}: ${(endTime - startTime).toFixed(2)}ms (结果: ${result})`);
        });
        console.log('');
    });
}

// 算法演示
function demonstrateAlgorithm() {
    console.log('=== 原地哈希法演示 ===\n');

    const nums = [3, 4, -1, 1];
    console.log(`演示数组: [${nums.join(',')}]`);
    console.log(`数组长度: ${nums.length}`);
    console.log(`目标: 让nums[i] = i + 1，即nums[0]=1, nums[1]=2, nums[2]=3, nums[3]=4`);

    console.log('\n第一阶段：数字归位');

    for (let i = 0; i < nums.length; i++) {
        console.log(`\n处理位置${i}:`);
        console.log(`  当前数组: [${nums.join(',')}]`);
        console.log(`  当前数字: ${nums[i]}`);

        if (nums[i] > 0 && nums[i] <= nums.length) {
            const targetIndex = nums[i] - 1;
            console.log(`  数字${nums[i]}应该放在位置${targetIndex}`);

            if (nums[targetIndex] !== nums[i]) {
                console.log(`  交换nums[${i}]=${nums[i]}和nums[${targetIndex}]=${nums[targetIndex]}`);
                [nums[i], nums[targetIndex]] = [nums[targetIndex], nums[i]];
                console.log(`  交换后: [${nums.join(',')}]`);
                i--; // 重新处理当前位置
            } else {
                console.log(`  数字${nums[i]}已经在正确位置`);
            }
        } else {
            console.log(`  数字${nums[i]}超出范围，跳过`);
        }
    }

    console.log('\n第二阶段：查找缺失数字');
    console.log(`最终数组: [${nums.join(',')}]`);

    for (let i = 0; i < nums.length; i++) {
        console.log(`  位置${i}: 期望${i + 1}, 实际${nums[i]} ${nums[i] === i + 1 ? '✓' : '✗'}`);

        if (nums[i] !== i + 1) {
            console.log(`\n找到缺失的第一个正数: ${i + 1}`);
            return;
        }
    }

    console.log(`\n所有位置都正确，缺失的是: ${nums.length + 1}`);
}

// 负数标记法演示
function demonstrateNegativeMarking() {
    console.log('=== 负数标记法演示 ===\n');

    const nums = [3, 4, -1, 1];
    console.log(`演示数组: [${nums.join(',')}]`);

    // 步骤1：处理非正数
    console.log('\n步骤1：将非正数替换为n+1');
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] <= 0) {
            console.log(`  位置${i}: ${nums[i]} -> ${nums.length + 1}`);
            nums[i] = nums.length + 1;
        }
    }
    console.log(`处理后: [${nums.join(',')}]`);

    // 步骤2：负数标记
    console.log('\n步骤2：用负号标记数字存在');
    const original = [...nums];

    for (let i = 0; i < nums.length; i++) {
        const num = Math.abs(nums[i]);
        console.log(`\n  位置${i}的数字: ${original[i]} (绝对值: ${num})`);

        if (num <= nums.length) {
            const markIndex = num - 1;
            console.log(`    数字${num}存在，标记位置${markIndex}`);
            console.log(`    将nums[${markIndex}]=${nums[markIndex]}标记为负数`);
            nums[markIndex] = -Math.abs(nums[markIndex]);
            console.log(`    标记后: [${nums.join(',')}]`);
        } else {
            console.log(`    数字${num}超出范围，跳过`);
        }
    }

    // 步骤3：查找缺失数字
    console.log('\n步骤3：查找第一个正数位置');
    console.log(`最终数组: [${nums.join(',')}]`);

    for (let i = 0; i < nums.length; i++) {
        console.log(`  位置${i}: ${nums[i]} ${nums[i] > 0 ? '(正数,缺失' + (i + 1) + ')' : '(负数,存在)'}`);

        if (nums[i] > 0) {
            console.log(`\n找到缺失的第一个正数: ${i + 1}`);
            return;
        }
    }

    console.log(`\n所有位置都是负数，缺失的是: ${nums.length + 1}`);
}

// 边界情况分析
function edgeCaseAnalysis() {
    console.log('=== 边界情况分析 ===\n');

    const edgeCases = [
        {
            name: '空数组',
            input: [],
            analysis: '没有任何数字，缺失的第一个正数是1'
        },
        {
            name: '单元素1',
            input: [1],
            analysis: '只有1，缺失的第一个正数是2'
        },
        {
            name: '单元素非1',
            input: [2],
            analysis: '只有2，缺失的第一个正数是1'
        },
        {
            name: '全负数',
            input: [-1, -2, -3],
            analysis: '没有正数，缺失的第一个正数是1'
        },
        {
            name: '全大于n',
            input: [4, 5, 6],
            analysis: '所有数都大于数组长度，缺失的是1'
        },
        {
            name: '连续从1开始',
            input: [1, 2, 3],
            analysis: '连续1-3，缺失的是4'
        },
        {
            name: '连续不从1开始',
            input: [2, 3, 4],
            analysis: '连续2-4，缺失的是1'
        },
        {
            name: '有重复',
            input: [1, 1, 1],
            analysis: '全是1，缺失的是2'
        },
        {
            name: '乱序完整',
            input: [3, 1, 2, 4],
            analysis: '乱序的1-4，缺失的是5'
        }
    ];

    edgeCases.forEach(testCase => {
        console.log(`情况: ${testCase.name}`);
        console.log(`输入: [${testCase.input.join(',')}]`);
        console.log(`分析: ${testCase.analysis}`);

        const result = firstMissingPositive([...testCase.input]);
        console.log(`结果: ${result}`);
        console.log('');
    });
}

// 复杂度分析
function complexityAnalysis() {
    console.log('=== 复杂度分析 ===\n');

    const methods = [
        {
            name: '原地哈希法',
            timeComplexity: 'O(n)',
            spaceComplexity: 'O(1)',
            meetRequirements: true,
            description: '最优解法，满足所有约束'
        },
        {
            name: '负数标记法',
            timeComplexity: 'O(n)',
            spaceComplexity: 'O(1)',
            meetRequirements: true,
            description: '满足约束，实现相对简单'
        },
        {
            name: '分离正负数法',
            timeComplexity: 'O(n)',
            spaceComplexity: 'O(1)',
            meetRequirements: true,
            description: '思路清晰，分步处理'
        },
        {
            name: '哈希表法',
            timeComplexity: 'O(n)',
            spaceComplexity: 'O(n)',
            meetRequirements: false,
            description: '违反空间约束'
        },
        {
            name: '布尔数组法',
            timeComplexity: 'O(n)',
            spaceComplexity: 'O(n)',
            meetRequirements: false,
            description: '违反空间约束'
        },
        {
            name: '排序法',
            timeComplexity: 'O(n log n)',
            spaceComplexity: 'O(1)',
            meetRequirements: false,
            description: '违反时间约束'
        }
    ];

    console.log('各方法复杂度对比：');
    console.log('方法\t\t\t时间复杂度\t空间复杂度\t满足约束\t说明');
    console.log('-'.repeat(80));

    methods.forEach(method => {
        const meets = method.meetRequirements ? '✓' : '✗';
        console.log(`${method.name.padEnd(15)}\t${method.timeComplexity.padEnd(12)}\t${method.spaceComplexity}\t\t${meets}\t\t${method.description}`);
    });

    console.log('\n推荐解法排序：');
    console.log('1. 原地哈希法：思路清晰，数字归位');
    console.log('2. 负数标记法：实现简单，易于理解');
    console.log('3. 分离正负数法：分步处理，逻辑清楚');
}

// 算法设计分析
function algorithmDesignAnalysis() {
    console.log('=== 算法设计分析 ===\n');

    console.log('1. 问题本质分析：');
    console.log('   - 在[1, n+1]范围内找缺失的最小正数');
    console.log('   - 数组长度为n，最多包含n个不同的正数');
    console.log('   - 如果[1,n]都存在，答案就是n+1');
    console.log('   - 关键是高效地检测哪些数字存在');

    console.log('\n2. 空间约束的突破：');
    console.log('   - 不能使用额外的哈希表或数组');
    console.log('   - 利用原数组本身作为"哈希表"');
    console.log('   - 索引i对应数字i+1');
    console.log('   - 通过位置关系建立映射');

    console.log('\n3. 原地哈希的精髓：');
    console.log('   - 数字x应该放在位置x-1');
    console.log('   - 通过交换操作实现数字归位');
    console.log('   - 只处理[1,n]范围内的数字');
    console.log('   - 超出范围的数字直接忽略');

    console.log('\n4. 负数标记的巧思：');
    console.log('   - 利用数字的正负性标记存在性');
    console.log('   - 先统一处理非正数，避免干扰');
    console.log('   - 数字x存在时，将nums[x-1]变为负数');
    console.log('   - 最后找第一个正数位置');

    console.log('\n5. 算法的鲁棒性：');
    console.log('   - 处理各种边界情况');
    console.log('   - 重复数字的处理');
    console.log('   - 超出范围数字的忽略');
    console.log('   - 空数组和单元素的特殊处理');
}

// 面试要点总结
function interviewKeyPoints() {
    console.log('=== 面试要点总结 ===\n');

    console.log('🎯 核心考点：');
    console.log('1. 在严格约束下的算法设计');
    console.log('2. 原地哈希表的构造技巧');
    console.log('3. 利用数组索引的巧妙映射');
    console.log('4. 时间空间复杂度的权衡');

    console.log('\n💡 解题思路：');
    console.log('1. 理解问题：在[1,n+1]中找缺失数字');
    console.log('2. 原地哈希：nums[i] = i+1的映射关系');
    console.log('3. 负数标记：利用符号位标记存在性');
    console.log('4. 范围过滤：只关心[1,n]范围的数字');

    console.log('\n🔍 常见陷阱：');
    console.log('1. 忽略超出范围的数字处理');
    console.log('2. 重复数字导致的无限循环');
    console.log('3. 负数和零的特殊处理');
    console.log('4. 边界情况：空数组、单元素');

    console.log('\n📈 优化技巧：');
    console.log('1. while循环实现数字归位');
    console.log('2. 交换操作避免额外空间');
    console.log('3. 绝对值操作保持标记信息');
    console.log('4. 范围检查减少不必要操作');

    console.log('\n🎪 相关问题：');
    console.log('1. 缺失数字（单个缺失）');
    console.log('2. 数组中重复的数字');
    console.log('3. 找到所有数组中消失的数字');
    console.log('4. 第k个缺失的正整数');

    console.log('\n💼 实际应用：');
    console.log('1. 内存分配中的空闲块查找');
    console.log('2. 数据库中的ID生成');
    console.log('3. 资源管理中的可用资源检测');
    console.log('4. 游戏中的可用位置查找');
}

// 导出所有方法
module.exports = {
    firstMissingPositive,
    firstMissingPositiveNegative,
    firstMissingPositiveHashSet,
    firstMissingPositiveSort,
    firstMissingPositiveSeparate,
    firstMissingPositiveBoolean,
    runTests,
    performanceTest,
    demonstrateAlgorithm,
    demonstrateNegativeMarking,
    edgeCaseAnalysis,
    complexityAnalysis,
    algorithmDesignAnalysis,
    interviewKeyPoints
};

// 如果直接运行此文件，则执行测试
if (require.main === module) {
    runTests();
    performanceTest();
    demonstrateAlgorithm();
    demonstrateNegativeMarking();
    edgeCaseAnalysis();
    complexityAnalysis();
    algorithmDesignAnalysis();
    interviewKeyPoints();
}