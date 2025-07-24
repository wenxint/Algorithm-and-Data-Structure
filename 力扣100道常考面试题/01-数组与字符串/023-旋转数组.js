/**
 * LeetCode 025: 旋转数组 (Rotate Array)
 *
 * 题目描述：
 * 给你一个数组，将数组中的元素向右轮转 k 个位置，其中 k 是非负数。
 *
 * 示例：
 * 输入: nums = [1,2,3,4,5,6,7], k = 3
 * 输出: [5,6,7,1,2,3,4]
 * 解释: 向右轮转 3 步: [1,2,3,4,5,6,7] -> [7,1,2,3,4,5,6] -> [6,7,1,2,3,4,5] -> [5,6,7,1,2,3,4]
 *
 * 核心思想：
 * 1. 三次反转法：通过三次数组反转实现旋转，空间复杂度O(1)
 * 2. 循环替换法：直接移动元素到目标位置，处理循环
 * 3. 额外数组法：使用额外空间存储结果
 *
 * 解题要点：
 * - k可能大于数组长度，需要取模操作
 * - 要求原地修改数组（尽量不使用额外空间）
 * - 考虑数组长度为0或1的边界情况
 * - 理解旋转的本质：将后k个元素移到前面
 */

/**
 * 方法一：三次反转法（推荐解法）
 *
 * 核心思想：
 * 通过三次数组反转来实现旋转效果
 *
 * 算法步骤：
 * 1. 反转整个数组
 * 2. 反转前k个元素
 * 3. 反转后n-k个元素
 *
 * 示例：[1,2,3,4,5,6,7], k=3
 * 1. 反转整个数组：[7,6,5,4,3,2,1]
 * 2. 反转前3个：[5,6,7,4,3,2,1]
 * 3. 反转后4个：[5,6,7,1,2,3,4]
 *
 * @param {number[]} nums - 输入数组
 * @param {number} k - 旋转步数
 * @returns {void} 原地修改数组
 * @time O(n) - 三次遍历数组
 * @space O(1) - 只使用常数额外空间
 */
function rotate(nums, k) {
    if (!nums || nums.length <= 1) return;

    const n = nums.length;
    k = k % n; // 处理k大于数组长度的情况

    if (k === 0) return; // 不需要旋转

    /**
     * 反转数组的指定区间
     * @param {number[]} arr - 数组
     * @param {number} start - 起始索引
     * @param {number} end - 结束索引
     */
    function reverse(arr, start, end) {
        while (start < end) {
            [arr[start], arr[end]] = [arr[end], arr[start]];
            start++;
            end--;
        }
    }

    // 步骤1：反转整个数组
    reverse(nums, 0, n - 1);

    // 步骤2：反转前k个元素
    reverse(nums, 0, k - 1);

    // 步骤3：反转后n-k个元素
    reverse(nums, k, n - 1);
}

/**
 * 方法二：循环替换法
 *
 * 核心思想：
 * 直接将每个元素移动到它应该到达的位置
 * 通过最大公约数来处理可能的循环
 *
 * 算法步骤：
 * 1. 计算数组长度n和最大公约数gcd(n, k)
 * 2. 进行gcd次循环，每次循环处理一个子循环
 * 3. 在每个子循环中，将元素依次移动到正确位置
 *
 * @param {number[]} nums - 输入数组
 * @param {number} k - 旋转步数
 * @returns {void} 原地修改数组
 * @time O(n) - 每个元素移动一次
 * @space O(1) - 只使用常数额外空间
 */
function rotateCyclic(nums, k) {
    if (!nums || nums.length <= 1) return;

    const n = nums.length;
    k = k % n;

    if (k === 0) return;

    /**
     * 计算最大公约数
     * @param {number} a - 第一个数
     * @param {number} b - 第二个数
     * @returns {number} 最大公约数
     */
    function gcd(a, b) {
        while (b !== 0) {
            [a, b] = [b, a % b];
        }
        return a;
    }

    const cycles = gcd(n, k);

    // 处理每个循环
    for (let start = 0; start < cycles; start++) {
        let current = start;
        let prev = nums[start];

        do {
            const next = (current + k) % n;
            [nums[next], prev] = [prev, nums[next]];
            current = next;
        } while (start !== current);
    }
}

/**
 * 方法三：额外数组法
 *
 * 核心思想：
 * 使用额外数组存储旋转后的结果，然后复制回原数组
 *
 * 算法步骤：
 * 1. 创建新数组存储结果
 * 2. 计算每个元素的新位置：(i + k) % n
 * 3. 将结果复制回原数组
 *
 * @param {number[]} nums - 输入数组
 * @param {number} k - 旋转步数
 * @returns {void} 原地修改数组
 * @time O(n) - 遍历数组两次
 * @space O(n) - 使用额外数组
 */
function rotateExtraArray(nums, k) {
    if (!nums || nums.length <= 1) return;

    const n = nums.length;
    k = k % n;

    if (k === 0) return;

    // 创建新数组
    const rotated = new Array(n);

    // 计算每个元素的新位置
    for (let i = 0; i < n; i++) {
        rotated[(i + k) % n] = nums[i];
    }

    // 复制回原数组
    for (let i = 0; i < n; i++) {
        nums[i] = rotated[i];
    }
}

/**
 * 方法四：暴力旋转法
 *
 * 核心思想：
 * 每次旋转一步，重复k次
 *
 * @param {number[]} nums - 输入数组
 * @param {number} k - 旋转步数
 * @returns {void} 原地修改数组
 * @time O(n*k) - k次旋转，每次O(n)
 * @space O(1) - 只使用常数额外空间
 */
function rotateBruteForce(nums, k) {
    if (!nums || nums.length <= 1) return;

    const n = nums.length;
    k = k % n;

    // 执行k次单步旋转
    for (let i = 0; i < k; i++) {
        const last = nums[n - 1];

        // 将所有元素向右移动一位
        for (let j = n - 1; j > 0; j--) {
            nums[j] = nums[j - 1];
        }

        nums[0] = last;
    }
}

/**
 * 方法五：分块处理法
 *
 * 核心思想：
 * 将数组分为两部分，分别处理
 * 适用于理解旋转的本质
 *
 * @param {number[]} nums - 输入数组
 * @param {number} k - 旋转步数
 * @returns {void} 原地修改数组
 * @time O(n) - 遍历数组常数次
 * @space O(n) - 使用额外数组存储分块
 */
function rotateBlockwise(nums, k) {
    if (!nums || nums.length <= 1) return;

    const n = nums.length;
    k = k % n;

    if (k === 0) return;

    // 分离前n-k个元素和后k个元素
    const part1 = nums.slice(0, n - k);
    const part2 = nums.slice(n - k);

    // 重新组合：后k个 + 前n-k个
    for (let i = 0; i < k; i++) {
        nums[i] = part2[i];
    }

    for (let i = 0; i < part1.length; i++) {
        nums[i + k] = part1[i];
    }
}

// 测试用例
function runTests() {
    console.log('=== LeetCode 025: 旋转数组 测试 ===\n');

    const testCases = [
        {
            name: '基础测试1',
            input: { nums: [1,2,3,4,5,6,7], k: 3 },
            expected: [5,6,7,1,2,3,4],
            explanation: '向右旋转3步'
        },
        {
            name: '基础测试2',
            input: { nums: [-1,-100,3,99], k: 2 },
            expected: [3,99,-1,-100],
            explanation: '向右旋转2步'
        },
        {
            name: 'k等于数组长度',
            input: { nums: [1,2,3], k: 3 },
            expected: [1,2,3],
            explanation: 'k等于n，数组不变'
        },
        {
            name: 'k大于数组长度',
            input: { nums: [1,2], k: 5 },
            expected: [2,1],
            explanation: 'k=5, n=2, 实际旋转k%n=1步'
        },
        {
            name: '单元素数组',
            input: { nums: [1], k: 1 },
            expected: [1],
            explanation: '单元素数组旋转后不变'
        },
        {
            name: '空数组',
            input: { nums: [], k: 1 },
            expected: [],
            explanation: '空数组处理'
        },
        {
            name: 'k为0',
            input: { nums: [1,2,3,4], k: 0 },
            expected: [1,2,3,4],
            explanation: '不旋转'
        },
        {
            name: '两元素数组',
            input: { nums: [1,2], k: 1 },
            expected: [2,1],
            explanation: '两元素旋转'
        },
        {
            name: '大数组测试',
            input: { nums: Array.from({length: 10}, (_, i) => i + 1), k: 3 },
            expected: [8,9,10,1,2,3,4,5,6,7],
            explanation: '10元素数组向右旋转3步'
        }
    ];

    const methods = [
        { name: '三次反转法', func: rotate },
        { name: '循环替换法', func: rotateCyclic },
        { name: '额外数组法', func: rotateExtraArray },
        { name: '暴力旋转法', func: rotateBruteForce },
        { name: '分块处理法', func: rotateBlockwise }
    ];

    testCases.forEach(testCase => {
        console.log(`测试: ${testCase.name}`);
        console.log(`输入: nums = [${testCase.input.nums.join(',')}], k = ${testCase.input.k}`);
        console.log(`期望: [${testCase.expected.join(',')}]`);
        console.log(`说明: ${testCase.explanation}`);

        methods.forEach(method => {
            const nums = [...testCase.input.nums]; // 创建副本
            method.func(nums, testCase.input.k);
            const isCorrect = JSON.stringify(nums) === JSON.stringify(testCase.expected);
            console.log(`${method.name}: [${nums.join(',')}] ${isCorrect ? '✓' : '✗'}`);
        });
        console.log('');
    });
}

// 性能测试
function performanceTest() {
    console.log('=== 性能测试 ===\n');

    const testCases = [
        { size: 1000, k: 100, desc: '中等数组' },
        { size: 10000, k: 1000, desc: '大数组' },
        { size: 100000, k: 10000, desc: '超大数组' },
        { size: 1000, k: 1999, desc: 'k > n 的情况' }
    ];

    const methods = [
        { name: '三次反转法', func: rotate },
        { name: '循环替换法', func: rotateCyclic },
        { name: '额外数组法', func: rotateExtraArray },
        { name: '分块处理法', func: rotateBlockwise }
        // 跳过暴力法，因为时间复杂度太高
    ];

    testCases.forEach(testCase => {
        console.log(`测试: ${testCase.desc} (n=${testCase.size}, k=${testCase.k})`);
        const testArray = Array.from({length: testCase.size}, (_, i) => i + 1);

        methods.forEach(method => {
            const nums = [...testArray];
            const startTime = performance.now();
            method.func(nums, testCase.k);
            const endTime = performance.now();

            console.log(`${method.name}: ${(endTime - startTime).toFixed(2)}ms`);
        });
        console.log('');
    });
}

// 算法演示
function demonstrateAlgorithm() {
    console.log('=== 算法演示 ===\n');

    const nums = [1, 2, 3, 4, 5, 6, 7];
    const k = 3;

    console.log(`演示数组: [${nums.join(',')}]`);
    console.log(`旋转步数: k = ${k}`);
    console.log(`数组长度: n = ${nums.length}`);
    console.log(`实际旋转: k % n = ${k % nums.length} 步\n`);

    console.log('三次反转法过程：');

    // 创建演示用的数组副本
    const demo = [...nums];

    console.log(`初始数组: [${demo.join(',')}]`);

    // 步骤1：反转整个数组
    function reverseDemo(arr, start, end, stepName) {
        console.log(`\n${stepName}:`);
        console.log(`  反转范围: [${start}, ${end}]`);
        console.log(`  反转前: [${arr.join(',')}]`);

        while (start < end) {
            [arr[start], arr[end]] = [arr[end], arr[start]];
            start++;
            end--;
        }

        console.log(`  反转后: [${arr.join(',')}]`);
    }

    reverseDemo(demo, 0, demo.length - 1, '步骤1: 反转整个数组');
    reverseDemo(demo, 0, k - 1, `步骤2: 反转前${k}个元素`);
    reverseDemo(demo, k, demo.length - 1, `步骤3: 反转后${demo.length - k}个元素`);

    console.log(`\n最终结果: [${demo.join(',')}]`);

    // 演示循环替换法
    console.log('\n\n循环替换法过程：');
    const nums2 = [...nums];

    function gcd(a, b) {
        while (b !== 0) {
            [a, b] = [b, a % b];
        }
        return a;
    }

    const cycles = gcd(nums2.length, k);
    console.log(`GCD(${nums2.length}, ${k}) = ${cycles}`);
    console.log(`需要处理 ${cycles} 个循环\n`);

    for (let start = 0; start < cycles; start++) {
        console.log(`循环 ${start + 1}:`);
        console.log(`  起始位置: ${start}`);

        let current = start;
        let prev = nums2[start];
        let step = 1;

        do {
            const next = (current + k) % nums2.length;
            console.log(`  步骤${step}: 位置${current} -> 位置${next}, 值${prev} -> 位置${next}`);

            [nums2[next], prev] = [prev, nums2[next]];
            current = next;
            step++;

            console.log(`    当前数组: [${nums2.join(',')}]`);
        } while (start !== current);

        console.log(`  循环${start + 1}完成\n`);
    }

    console.log(`最终结果: [${nums2.join(',')}]`);
}

// 可视化旋转过程
function visualizeRotation() {
    console.log('=== 旋转过程可视化 ===\n');

    const originalNums = [1, 2, 3, 4, 5, 6, 7];
    const k = 3;

    console.log('逐步旋转可视化：');
    console.log(`原数组: [${originalNums.join(',')}]`);
    console.log(`目标: 向右旋转 ${k} 步\n`);

    // 模拟每一步的旋转
    let nums = [...originalNums];
    console.log('每步旋转过程：');

    for (let step = 1; step <= k; step++) {
        const last = nums[nums.length - 1];

        // 所有元素向右移动一位
        for (let i = nums.length - 1; i > 0; i--) {
            nums[i] = nums[i - 1];
        }
        nums[0] = last;

        console.log(`第${step}步: [${nums.join(',')}]`);
    }

    console.log('\n位置映射分析：');
    console.log('旋转后每个元素的新位置：');

    for (let i = 0; i < originalNums.length; i++) {
        const newPos = (i + k) % originalNums.length;
        console.log(`位置${i}(值${originalNums[i]}) -> 位置${newPos}`);
    }

    console.log('\n数组分割视角：');
    const n = originalNums.length;
    const part1 = originalNums.slice(0, n - k);
    const part2 = originalNums.slice(n - k);

    console.log(`原数组: [${originalNums.join(',')}]`);
    console.log(`前${n - k}个: [${part1.join(',')}]`);
    console.log(`后${k}个: [${part2.join(',')}]`);
    console.log(`重新组合: [${part2.join(',')}] + [${part1.join(',')}] = [${[...part2, ...part1].join(',')}]`);
}

// 边界情况分析
function edgeCaseAnalysis() {
    console.log('=== 边界情况分析 ===\n');

    const edgeCases = [
        {
            name: '空数组',
            input: { nums: [], k: 5 },
            analysis: '空数组无需处理，直接返回'
        },
        {
            name: '单元素数组',
            input: { nums: [42], k: 100 },
            analysis: '单元素数组旋转后仍为自身'
        },
        {
            name: 'k为0',
            input: { nums: [1,2,3,4], k: 0 },
            analysis: '不需要旋转，数组保持不变'
        },
        {
            name: 'k等于n',
            input: { nums: [1,2,3], k: 3 },
            analysis: 'k%n=0，相当于不旋转'
        },
        {
            name: 'k大于n',
            input: { nums: [1,2], k: 7 },
            analysis: 'k%n=1，实际只旋转1步'
        },
        {
            name: 'k为n的倍数',
            input: { nums: [1,2,3,4], k: 8 },
            analysis: 'k%n=0，数组保持不变'
        },
        {
            name: '两元素数组奇数k',
            input: { nums: [1,2], k: 3 },
            analysis: 'k%n=1，两元素交换位置'
        },
        {
            name: '两元素数组偶数k',
            input: { nums: [1,2], k: 4 },
            analysis: 'k%n=0，数组保持不变'
        }
    ];

    edgeCases.forEach(testCase => {
        console.log(`情况: ${testCase.name}`);
        console.log(`输入: nums=[${testCase.input.nums.join(',')}], k=${testCase.input.k}`);
        console.log(`分析: ${testCase.analysis}`);

        const nums = [...testCase.input.nums];
        rotate(nums, testCase.input.k);
        console.log(`结果: [${nums.join(',')}]`);
        console.log('');
    });
}

// 复杂度分析
function complexityAnalysis() {
    console.log('=== 复杂度分析 ===\n');

    const methods = [
        {
            name: '三次反转法',
            timeComplexity: 'O(n)',
            spaceComplexity: 'O(1)',
            description: '三次遍历数组，原地操作'
        },
        {
            name: '循环替换法',
            timeComplexity: 'O(n)',
            spaceComplexity: 'O(1)',
            description: '每个元素移动一次，原地操作'
        },
        {
            name: '额外数组法',
            timeComplexity: 'O(n)',
            spaceComplexity: 'O(n)',
            description: '两次遍历，需要额外数组'
        },
        {
            name: '暴力旋转法',
            timeComplexity: 'O(n×k)',
            spaceComplexity: 'O(1)',
            description: 'k次单步旋转，每次O(n)'
        },
        {
            name: '分块处理法',
            timeComplexity: 'O(n)',
            spaceComplexity: 'O(n)',
            description: '线性时间，需要额外数组存储分块'
        }
    ];

    console.log('各方法复杂度对比：');
    console.log('方法\t\t\t时间复杂度\t空间复杂度\t说明');
    console.log('-'.repeat(80));

    methods.forEach(method => {
        console.log(`${method.name.padEnd(15)}\t${method.timeComplexity}\t\t${method.spaceComplexity}\t\t${method.description}`);
    });

    console.log('\n最优解法分析：');
    console.log('1. 三次反转法：时间O(n)，空间O(1)，思路清晰');
    console.log('2. 循环替换法：时间O(n)，空间O(1)，但实现较复杂');
    console.log('3. 额外数组法：时间O(n)，空间O(n)，最直观');
    console.log('4. 推荐解法：三次反转法（面试首选）');
}

// 数学原理解释
function mathematicalAnalysis() {
    console.log('=== 数学原理解释 ===\n');

    console.log('1. 旋转的本质：');
    console.log('   向右旋转k步 = 将数组分为两部分并交换');
    console.log('   [a₁,a₂,...,aₙ₋ₖ, aₙ₋ₖ₊₁,...,aₙ] -> [aₙ₋ₖ₊₁,...,aₙ, a₁,a₂,...,aₙ₋ₖ]');

    console.log('\n2. 三次反转的数学证明：');
    console.log('   设数组 A = [P, Q]，其中P是前n-k个元素，Q是后k个元素');
    console.log('   目标：A = [P, Q] -> [Q, P]');
    console.log('   ');
    console.log('   步骤：');
    console.log('   1) reverse(A) = reverse([P, Q]) = [reverse(Q), reverse(P)]');
    console.log('   2) reverse前k个 = [Q, reverse(P)]');
    console.log('   3) reverse后n-k个 = [Q, P]');

    console.log('\n3. 循环替换的数学原理：');
    console.log('   元素i移动到位置(i+k)%n');
    console.log('   需要gcd(n,k)个独立的循环');
    console.log('   每个循环长度为n/gcd(n,k)');

    // 示例计算
    console.log('\n示例计算：n=6, k=4');
    const n = 6, k = 4;

    function gcd(a, b) {
        while (b !== 0) {
            [a, b] = [b, a % b];
        }
        return a;
    }

    const g = gcd(n, k);
    console.log(`gcd(${n}, ${k}) = ${g}`);
    console.log(`循环数量: ${g}`);
    console.log(`每个循环长度: ${n / g}`);

    console.log('\n位置映射：');
    for (let i = 0; i < n; i++) {
        const newPos = (i + k) % n;
        console.log(`位置${i} -> 位置${newPos}`);
    }
}

// 扩展应用
function extendedApplications() {
    console.log('=== 扩展应用 ===\n');

    console.log('1. 字符串旋转：');

    function rotateString(s, k) {
        if (!s) return s;
        const n = s.length;
        k = k % n;

        const chars = s.split('');

        // 使用三次反转
        function reverse(arr, start, end) {
            while (start < end) {
                [arr[start], arr[end]] = [arr[end], arr[start]];
                start++;
                end--;
            }
        }

        reverse(chars, 0, n - 1);
        reverse(chars, 0, k - 1);
        reverse(chars, k, n - 1);

        return chars.join('');
    }

    const testString = 'abcdefg';
    console.log(`字符串旋转示例：`);
    console.log(`原字符串: "${testString}"`);
    for (let k = 1; k <= 3; k++) {
        console.log(`向右旋转${k}步: "${rotateString(testString, k)}"`);
    }

    console.log('\n2. 循环队列实现：');

    class CircularQueue {
        constructor(capacity) {
            this.data = new Array(capacity);
            this.capacity = capacity;
            this.front = 0;
            this.size = 0;
        }

        enqueue(item) {
            if (this.size === this.capacity) {
                throw new Error('Queue is full');
            }

            const rear = (this.front + this.size) % this.capacity;
            this.data[rear] = item;
            this.size++;
        }

        dequeue() {
            if (this.size === 0) {
                throw new Error('Queue is empty');
            }

            const item = this.data[this.front];
            this.front = (this.front + 1) % this.capacity;
            this.size--;
            return item;
        }

        // 旋转队列（改变起始位置）
        rotate(k) {
            k = k % this.size;
            this.front = (this.front + k) % this.capacity;
        }

        toArray() {
            const result = [];
            for (let i = 0; i < this.size; i++) {
                result.push(this.data[(this.front + i) % this.capacity]);
            }
            return result;
        }
    }

    console.log('循环队列示例：');
    const queue = new CircularQueue(5);
    [1, 2, 3, 4].forEach(x => queue.enqueue(x));

    console.log(`初始队列: [${queue.toArray().join(',')}]`);
    queue.rotate(2);
    console.log(`旋转2步后: [${queue.toArray().join(',')}]`);

    console.log('\n3. 图像旋转：');
    console.log('   - 90度旋转矩阵');
    console.log('   - 像素数组的行/列变换');
    console.log('   - 利用旋转算法优化内存使用');
}

// 实际应用示例
function practicalExample() {
    console.log('=== 实际应用示例 ===\n');

    console.log('场景1：轮播图实现');

    class ImageCarousel {
        constructor(images) {
            this.images = [...images];
            this.currentIndex = 0;
        }

        // 向前轮播k张图片
        rotateForward(k = 1) {
            k = k % this.images.length;
            this.currentIndex = (this.currentIndex + k) % this.images.length;
        }

        // 向后轮播k张图片
        rotateBackward(k = 1) {
            k = k % this.images.length;
            this.currentIndex = (this.currentIndex - k + this.images.length) % this.images.length;
        }

        getCurrentImage() {
            return this.images[this.currentIndex];
        }

        getVisibleImages(count = 3) {
            const result = [];
            for (let i = 0; i < count; i++) {
                const index = (this.currentIndex + i) % this.images.length;
                result.push(this.images[index]);
            }
            return result;
        }

        // 重新排列图片数组（基于当前位置）
        rearrangeFromCurrent() {
            const rotated = [...this.images];

            // 使用三次反转法
            function reverse(arr, start, end) {
                while (start < end) {
                    [arr[start], arr[end]] = [arr[end], arr[start]];
                    start++;
                    end--;
                }
            }

            const k = this.currentIndex;
            const n = rotated.length;

            reverse(rotated, 0, n - 1);
            reverse(rotated, 0, k - 1);
            reverse(rotated, k, n - 1);

            return rotated;
        }
    }

    const images = ['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg'];
    const carousel = new ImageCarousel(images);

    console.log(`初始图片: [${images.join(', ')}]`);
    console.log(`当前显示: ${carousel.getCurrentImage()}`);
    console.log(`可见图片: [${carousel.getVisibleImages().join(', ')}]`);

    carousel.rotateForward(2);
    console.log(`\n向前轮播2张后:`);
    console.log(`当前显示: ${carousel.getCurrentImage()}`);
    console.log(`可见图片: [${carousel.getVisibleImages().join(', ')}]`);
    console.log(`重排数组: [${carousel.rearrangeFromCurrent().join(', ')}]`);

    console.log('\n场景2：时间序列数据窗口滑动');

    class SlidingWindow {
        constructor(data, windowSize) {
            this.data = [...data];
            this.windowSize = windowSize;
            this.startIndex = 0;
        }

        // 滑动窗口
        slide(steps = 1) {
            this.startIndex = (this.startIndex + steps) % (this.data.length - this.windowSize + 1);
        }

        // 获取当前窗口数据
        getCurrentWindow() {
            return this.data.slice(this.startIndex, this.startIndex + this.windowSize);
        }

        // 循环滑动（将数据看作环形）
        circularSlide(steps) {
            // 使用旋转数组的思想
            const rotated = [...this.data];
            const k = steps % this.data.length;

            function reverse(arr, start, end) {
                while (start < end) {
                    [arr[start], arr[end]] = [arr[end], arr[start]];
                    start++;
                    end--;
                }
            }

            reverse(rotated, 0, this.data.length - 1);
            reverse(rotated, 0, k - 1);
            reverse(rotated, k, this.data.length - 1);

            this.data = rotated;
            this.startIndex = 0; // 重置起始位置
        }

        getAllWindows() {
            const windows = [];
            const maxStart = this.data.length - this.windowSize;

            for (let i = 0; i <= maxStart; i++) {
                windows.push(this.data.slice(i, i + this.windowSize));
            }

            return windows;
        }
    }

    const timeSeriesData = [10, 20, 30, 40, 50, 60, 70, 80, 90];
    const window = new SlidingWindow(timeSeriesData, 3);

    console.log(`时间序列数据: [${timeSeriesData.join(', ')}]`);
    console.log(`窗口大小: ${window.windowSize}`);
    console.log(`初始窗口: [${window.getCurrentWindow().join(', ')}]`);

    window.slide(2);
    console.log(`滑动2步后: [${window.getCurrentWindow().join(', ')}]`);

    window.circularSlide(3);
    console.log(`循环滑动3步后: [${window.getCurrentWindow().join(', ')}]`);
    console.log(`新数据序列: [${window.data.join(', ')}]`);
}

// 面试要点总结
function interviewKeyPoints() {
    console.log('=== 面试要点总结 ===\n');

    console.log('🎯 核心考点：');
    console.log('1. 数组操作和原地算法');
    console.log('2. 空间复杂度优化思想');
    console.log('3. 数学建模能力（取模运算）');
    console.log('4. 边界条件处理');

    console.log('\n💡 解题思路：');
    console.log('1. 理解旋转的本质：数组分割和重组');
    console.log('2. 三次反转法：reverse(all) -> reverse(front) -> reverse(back)');
    console.log('3. 循环替换法：直接移动到目标位置');
    console.log('4. 处理k>n的情况：k = k % n');

    console.log('\n🔍 常见陷阱：');
    console.log('1. 忘记处理k大于数组长度的情况');
    console.log('2. 边界条件：空数组、单元素、k=0');
    console.log('3. 原地操作要求vs使用额外空间');
    console.log('4. 循环替换法的最大公约数计算');

    console.log('\n📈 优化技巧：');
    console.log('1. k % n预处理减少不必要操作');
    console.log('2. 三次反转法：直观且高效');
    console.log('3. 早期返回：k=0或数组长度<=1');
    console.log('4. 位运算优化（如果k是2的幂）');

    console.log('\n🎪 变形问题：');
    console.log('1. 字符串旋转');
    console.log('2. 链表旋转');
    console.log('3. 矩阵旋转');
    console.log('4. 搜索旋转排序数组');

    console.log('\n💼 实际应用：');
    console.log('1. 轮播图组件');
    console.log('2. 循环缓冲区');
    console.log('3. 时间序列数据处理');
    console.log('4. 游戏中的循环列表');

    console.log('\n🏆 面试策略：');
    console.log('1. 首先说明三次反转法（最推荐）');
    console.log('2. 解释为什么这样做（数学原理）');
    console.log('3. 分析时间空间复杂度');
    console.log('4. 讨论其他解法的优缺点');
    console.log('5. 处理边界情况和优化');
}

// 导出所有方法
module.exports = {
    rotate,
    rotateCyclic,
    rotateExtraArray,
    rotateBruteForce,
    rotateBlockwise,
    runTests,
    performanceTest,
    demonstrateAlgorithm,
    visualizeRotation,
    edgeCaseAnalysis,
    complexityAnalysis,
    mathematicalAnalysis,
    extendedApplications,
    practicalExample,
    interviewKeyPoints
};

// 如果直接运行此文件，则执行测试
if (require.main === module) {
    runTests();
    performanceTest();
    demonstrateAlgorithm();
    visualizeRotation();
    edgeCaseAnalysis();
    complexityAnalysis();
    mathematicalAnalysis();
    extendedApplications();
    practicalExample();
    interviewKeyPoints();
}