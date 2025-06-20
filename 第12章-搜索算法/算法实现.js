/**
 * 第12章：搜索算法 - 算法实现
 *
 * 本文件包含：
 * 1. 高级搜索算法和优化技术
 * 2. 并行搜索算法
 * 3. 实际应用场景的搜索实现
 * 4. 自适应搜索策略
 * 5. 缓存和索引优化
 *
 * 作者：数据结构与算法教程
 * 日期：2024年
 */

// ============================= 1. 高级搜索算法 =============================

/**
 * 三分搜索算法
 *
 * 核心思想：
 * 用于在单峰函数中查找最值，将搜索区间分成三部分
 * 通过比较两个中间点的函数值来缩小搜索范围
 *
 * @param {Function} fn - 单峰函数
 * @param {number} left - 左边界
 * @param {number} right - 右边界
 * @param {number} [tolerance=1e-9] - 精度
 * @returns {number} 函数最大值的x坐标
 * @time O(log n)
 * @space O(1)
 */
function ternarySearch(fn, left, right, tolerance = 1e-9) {
    while (right - left > tolerance) {
        // 将区间分成三等份
        const mid1 = left + (right - left) / 3;
        const mid2 = right - (right - left) / 3;

        if (fn(mid1) < fn(mid2)) {
            left = mid1; // 最大值在右侧
        } else {
            right = mid2; // 最大值在左侧
        }
    }

    return (left + right) / 2;
}

/**
 * 黄金分割搜索
 *
 * 核心思想：
 * 使用黄金分割比例来选择搜索点，减少函数计算次数
 * 适用于单峰函数的最值搜索
 *
 * @param {Function} fn - 单峰函数
 * @param {number} left - 左边界
 * @param {number} right - 右边界
 * @param {number} [tolerance=1e-9] - 精度
 * @returns {number} 函数最大值的x坐标
 * @time O(log n)
 * @space O(1)
 */
function goldenSectionSearch(fn, left, right, tolerance = 1e-9) {
    const phi = (1 + Math.sqrt(5)) / 2; // 黄金分割比
    const resphi = 2 - phi;

    // 初始搜索点
    let x1 = left + resphi * (right - left);
    let x2 = right - resphi * (right - left);
    let f1 = fn(x1);
    let f2 = fn(x2);

    while (Math.abs(right - left) > tolerance) {
        if (f1 > f2) {
            right = x2;
            x2 = x1;
            f2 = f1;
            x1 = left + resphi * (right - left);
            f1 = fn(x1);
        } else {
            left = x1;
            x1 = x2;
            f1 = f2;
            x2 = right - resphi * (right - left);
            f2 = fn(x2);
        }
    }

    return (left + right) / 2;
}

/**
 * 指数搜索的改进版本（带记忆化）
 *
 * 核心思想：
 * 在指数搜索的基础上添加结果缓存，适用于频繁搜索的场景
 */
class MemoizedExponentialSearch {
    constructor() {
        this.cache = new Map();
        this.hits = 0;
        this.misses = 0;
    }

    /**
     * 带缓存的指数搜索
     *
     * @param {Array} arr - 有序数组
     * @param {*} target - 目标值
     * @param {Function} [compareFn] - 比较函数
     * @returns {number} 目标元素索引，未找到返回-1
     */
    search(arr, target, compareFn = (a, b) => a - b) {
        const key = JSON.stringify({arr: arr.slice(0, 10), target}); // 简化键

        if (this.cache.has(key)) {
            this.hits++;
            return this.cache.get(key);
        }

        this.misses++;
        const result = this.exponentialSearch(arr, target, compareFn);
        this.cache.set(key, result);

        // 限制缓存大小
        if (this.cache.size > 1000) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }

        return result;
    }

    /**
     * 指数搜索实现
     */
    exponentialSearch(arr, target, compareFn) {
        if (arr.length === 0) return -1;
        if (compareFn(arr[0], target) === 0) return 0;

        let bound = 1;
        while (bound < arr.length && compareFn(arr[bound], target) < 0) {
            bound *= 2;
        }

        return this.binarySearch(arr, target, Math.floor(bound / 2),
                                Math.min(bound, arr.length - 1), compareFn);
    }

    /**
     * 二分搜索实现
     */
    binarySearch(arr, target, left, right, compareFn) {
        while (left <= right) {
            const mid = left + Math.floor((right - left) / 2);
            const comparison = compareFn(arr[mid], target);

            if (comparison === 0) return mid;
            else if (comparison < 0) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }

    /**
     * 获取缓存统计信息
     */
    getStats() {
        return {
            cacheSize: this.cache.size,
            hits: this.hits,
            misses: this.misses,
            hitRate: this.hits / (this.hits + this.misses)
        };
    }

    /**
     * 清除缓存
     */
    clearCache() {
        this.cache.clear();
        this.hits = 0;
        this.misses = 0;
    }
}

// ============================= 2. 并行搜索算法 =============================

/**
 * 并行二分搜索
 *
 * 核心思想：
 * 将数组分成多个部分，并行在每个部分中进行搜索
 * 适用于大型数据集和多核处理器环境
 */
class ParallelBinarySearch {
    constructor(numWorkers = navigator.hardwareConcurrency || 4) {
        this.numWorkers = numWorkers;
        this.workers = [];
        this.workerCode = `
            self.onmessage = function(e) {
                const { data, target, startIndex } = e.data;

                function binarySearch(arr, target) {
                    let left = 0;
                    let right = arr.length - 1;

                    while (left <= right) {
                        const mid = left + Math.floor((right - left) / 2);

                        if (arr[mid] === target) {
                            return startIndex + mid;
                        } else if (arr[mid] < target) {
                            left = mid + 1;
                        } else {
                            right = mid - 1;
                        }
                    }

                    return -1;
                }

                const result = binarySearch(data, target);
                self.postMessage(result);
            };
        `;
    }

    /**
     * 并行搜索
     *
     * @param {Array} arr - 有序数组
     * @param {*} target - 目标值
     * @returns {Promise<number>} 目标元素索引
     */
    async search(arr, target) {
        if (arr.length === 0) return -1;

        const chunkSize = Math.ceil(arr.length / this.numWorkers);
        const promises = [];

        for (let i = 0; i < this.numWorkers; i++) {
            const start = i * chunkSize;
            const end = Math.min(start + chunkSize, arr.length);

            if (start >= arr.length) break;

            const chunk = arr.slice(start, end);

            // 检查目标值是否可能在这个块中
            if (target >= chunk[0] && target <= chunk[chunk.length - 1]) {
                promises.push(this.searchInWorker(chunk, target, start));
            }
        }

        const results = await Promise.all(promises);

        // 返回第一个找到的结果
        for (const result of results) {
            if (result !== -1) {
                return result;
            }
        }

        return -1;
    }

    /**
     * 在Worker中搜索
     */
    searchInWorker(data, target, startIndex) {
        return new Promise((resolve) => {
            const blob = new Blob([this.workerCode], { type: 'application/javascript' });
            const worker = new Worker(URL.createObjectURL(blob));

            worker.postMessage({ data, target, startIndex });

            worker.onmessage = (e) => {
                resolve(e.data);
                worker.terminate();
                URL.revokeObjectURL(blob);
            };

            worker.onerror = () => {
                resolve(-1);
                worker.terminate();
                URL.revokeObjectURL(blob);
            };
        });
    }
}

/**
 * 并行字符串搜索
 *
 * 核心思想：
 * 将文本分割成多个段落，并行搜索模式串
 * 处理跨边界的匹配情况
 */
class ParallelStringSearch {
    constructor(numWorkers = navigator.hardwareConcurrency || 4) {
        this.numWorkers = numWorkers;
    }

    /**
     * 并行KMP搜索
     *
     * @param {string} text - 文本串
     * @param {string} pattern - 模式串
     * @returns {Promise<Array<number>>} 所有匹配位置
     */
    async kmpSearchParallel(text, pattern) {
        if (pattern.length === 0) return [0];
        if (pattern.length > text.length) return [];

        const chunkSize = Math.ceil(text.length / this.numWorkers);
        const promises = [];

        for (let i = 0; i < this.numWorkers; i++) {
            const start = i * chunkSize;
            const end = Math.min(start + chunkSize + pattern.length - 1, text.length);

            if (start >= text.length) break;

            const chunk = text.slice(start, end);
            promises.push(this.kmpSearchInWorker(chunk, pattern, start));
        }

        const results = await Promise.all(promises);

        // 合并结果并去重
        const allMatches = [];
        for (const matches of results) {
            allMatches.push(...matches);
        }

        // 去重并排序
        return [...new Set(allMatches)].sort((a, b) => a - b);
    }

    /**
     * 在Worker中执行KMP搜索
     */
    kmpSearchInWorker(text, pattern, offset) {
        return new Promise((resolve) => {
            const workerCode = `
                self.onmessage = function(e) {
                    const { text, pattern, offset } = e.data;

                    function buildKMPTable(pattern) {
                        const lps = new Array(pattern.length).fill(0);
                        let len = 0;
                        let i = 1;

                        while (i < pattern.length) {
                            if (pattern[i] === pattern[len]) {
                                len++;
                                lps[i] = len;
                                i++;
                            } else {
                                if (len > 0) {
                                    len = lps[len - 1];
                                } else {
                                    lps[i] = 0;
                                    i++;
                                }
                            }
                        }

                        return lps;
                    }

                    function kmpSearch(text, pattern) {
                        const lps = buildKMPTable(pattern);
                        const results = [];
                        let i = 0, j = 0;

                        while (i < text.length) {
                            if (text[i] === pattern[j]) {
                                i++;
                                j++;

                                if (j === pattern.length) {
                                    results.push(offset + i - j);
                                    j = lps[j - 1];
                                }
                            } else if (j > 0) {
                                j = lps[j - 1];
                            } else {
                                i++;
                            }
                        }

                        return results;
                    }

                    const matches = kmpSearch(text, pattern);
                    self.postMessage(matches);
                };
            `;

            const blob = new Blob([workerCode], { type: 'application/javascript' });
            const worker = new Worker(URL.createObjectURL(blob));

            worker.postMessage({ text, pattern, offset });

            worker.onmessage = (e) => {
                resolve(e.data);
                worker.terminate();
                URL.revokeObjectURL(blob);
            };

            worker.onerror = () => {
                resolve([]);
                worker.terminate();
                URL.revokeObjectURL(blob);
            };
        });
    }
}

// ============================= 3. 实际应用场景的搜索实现 =============================

/**
 * 搜索引擎索引系统
 *
 * 核心思想：
 * 构建倒排索引，支持快速的文本搜索和排序
 * 实现TF-IDF评分和布尔查询
 */
class SearchEngineIndex {
    constructor() {
        this.index = new Map(); // 倒排索引
        this.documents = new Map(); // 文档存储
        this.documentCount = 0;
    }

    /**
     * 添加文档到索引
     *
     * @param {string} docId - 文档ID
     * @param {string} content - 文档内容
     */
    addDocument(docId, content) {
        // 文本预处理
        const words = this.preprocessText(content);

        // 存储文档
        this.documents.set(docId, {
            content,
            words,
            wordCount: words.length
        });

        // 更新倒排索引
        const wordFreq = new Map();

        for (const word of words) {
            wordFreq.set(word, (wordFreq.get(word) || 0) + 1);

            if (!this.index.has(word)) {
                this.index.set(word, new Map());
            }

            this.index.get(word).set(docId, {
                frequency: wordFreq.get(word),
                positions: this.getWordPositions(words, word)
            });
        }

        this.documentCount++;
    }

    /**
     * 搜索文档
     *
     * @param {string} query - 查询字符串
     * @param {number} [limit=10] - 返回结果数量限制
     * @returns {Array<Object>} 搜索结果
     */
    search(query, limit = 10) {
        const queryWords = this.preprocessText(query);
        const scores = new Map();

        // 计算每个文档的TF-IDF分数
        for (const word of queryWords) {
            if (this.index.has(word)) {
                const documentFreq = this.index.get(word).size;
                const idf = Math.log(this.documentCount / documentFreq);

                for (const [docId, info] of this.index.get(word)) {
                    const tf = info.frequency / this.documents.get(docId).wordCount;
                    const tfidf = tf * idf;

                    scores.set(docId, (scores.get(docId) || 0) + tfidf);
                }
            }
        }

        // 排序并返回结果
        return Array.from(scores.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([docId, score]) => ({
                docId,
                score,
                content: this.documents.get(docId).content,
                snippet: this.generateSnippet(docId, queryWords)
            }));
    }

    /**
     * 布尔查询搜索
     *
     * @param {string} query - 布尔查询（支持AND, OR, NOT）
     * @returns {Array<string>} 匹配的文档ID
     */
    booleanSearch(query) {
        // 简化的布尔查询解析
        const tokens = query.toLowerCase().split(/\s+/);
        let result = new Set();
        let operation = 'AND';

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];

            if (token === 'and' || token === 'or' || token === 'not') {
                operation = token.toUpperCase();
                continue;
            }

            const docs = this.getDocumentsForWord(token);

            if (i === 0 || operation === 'OR') {
                if (result.size === 0) {
                    result = new Set(docs);
                } else {
                    result = new Set([...result, ...docs]);
                }
            } else if (operation === 'AND') {
                result = new Set([...result].filter(doc => docs.has(doc)));
            } else if (operation === 'NOT') {
                result = new Set([...result].filter(doc => !docs.has(doc)));
            }
        }

        return Array.from(result);
    }

    /**
     * 文本预处理
     */
    preprocessText(text) {
        return text.toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 0);
    }

    /**
     * 获取单词在文档中的位置
     */
    getWordPositions(words, targetWord) {
        const positions = [];
        for (let i = 0; i < words.length; i++) {
            if (words[i] === targetWord) {
                positions.push(i);
            }
        }
        return positions;
    }

    /**
     * 获取包含指定单词的文档
     */
    getDocumentsForWord(word) {
        if (this.index.has(word)) {
            return new Set(this.index.get(word).keys());
        }
        return new Set();
    }

    /**
     * 生成搜索结果摘要
     */
    generateSnippet(docId, queryWords, maxLength = 150) {
        const content = this.documents.get(docId).content;
        const words = content.split(/\s+/);

        // 找到查询词的位置
        let bestStart = 0;
        let maxScore = 0;

        for (let i = 0; i < words.length - 10; i++) {
            let score = 0;
            const window = words.slice(i, i + 20);

            for (const word of queryWords) {
                if (window.some(w => w.toLowerCase().includes(word.toLowerCase()))) {
                    score++;
                }
            }

            if (score > maxScore) {
                maxScore = score;
                bestStart = i;
            }
        }

        const snippet = words.slice(bestStart, bestStart + 20).join(' ');
        return snippet.length > maxLength ?
               snippet.substring(0, maxLength) + '...' : snippet;
    }
}

/**
 * 地理位置搜索系统
 *
 * 核心思想：
 * 基于地理坐标的搜索，支持范围查询和最近邻搜索
 * 使用四叉树或网格索引优化搜索性能
 */
class GeographicSearch {
    constructor() {
        this.points = [];
        this.spatialIndex = new Map(); // 简化的空间索引
        this.gridSize = 0.01; // 网格大小（度）
    }

    /**
     * 添加地理位置点
     *
     * @param {string} id - 点的唯一标识
     * @param {number} lat - 纬度
     * @param {number} lng - 经度
     * @param {Object} data - 附加数据
     */
    addPoint(id, lat, lng, data = {}) {
        const point = { id, lat, lng, data };
        this.points.push(point);

        // 添加到空间索引
        const gridKey = this.getGridKey(lat, lng);
        if (!this.spatialIndex.has(gridKey)) {
            this.spatialIndex.set(gridKey, []);
        }
        this.spatialIndex.get(gridKey).push(point);
    }

    /**
     * 范围搜索（矩形区域）
     *
     * @param {number} minLat - 最小纬度
     * @param {number} maxLat - 最大纬度
     * @param {number} minLng - 最小经度
     * @param {number} maxLng - 最大经度
     * @returns {Array<Object>} 在范围内的点
     */
    searchInBounds(minLat, maxLat, minLng, maxLng) {
        const results = [];

        // 计算涉及的网格
        const minGridLat = Math.floor(minLat / this.gridSize);
        const maxGridLat = Math.ceil(maxLat / this.gridSize);
        const minGridLng = Math.floor(minLng / this.gridSize);
        const maxGridLng = Math.ceil(maxLng / this.gridSize);

        for (let gridLat = minGridLat; gridLat <= maxGridLat; gridLat++) {
            for (let gridLng = minGridLng; gridLng <= maxGridLng; gridLng++) {
                const gridKey = `${gridLat},${gridLng}`;
                const gridPoints = this.spatialIndex.get(gridKey) || [];

                for (const point of gridPoints) {
                    if (point.lat >= minLat && point.lat <= maxLat &&
                        point.lng >= minLng && point.lng <= maxLng) {
                        results.push(point);
                    }
                }
            }
        }

        return results;
    }

    /**
     * 圆形范围搜索
     *
     * @param {number} centerLat - 中心纬度
     * @param {number} centerLng - 中心经度
     * @param {number} radiusKm - 半径（公里）
     * @returns {Array<Object>} 在范围内的点
     */
    searchInRadius(centerLat, centerLng, radiusKm) {
        const results = [];

        // 计算大致的边界框
        const latDelta = radiusKm / 111.32; // 1度纬度约111.32公里
        const lngDelta = radiusKm / (111.32 * Math.cos(centerLat * Math.PI / 180));

        const candidatePoints = this.searchInBounds(
            centerLat - latDelta,
            centerLat + latDelta,
            centerLng - lngDelta,
            centerLng + lngDelta
        );

        // 精确距离过滤
        for (const point of candidatePoints) {
            const distance = this.calculateDistance(
                centerLat, centerLng, point.lat, point.lng
            );

            if (distance <= radiusKm) {
                results.push({
                    ...point,
                    distance
                });
            }
        }

        return results.sort((a, b) => a.distance - b.distance);
    }

    /**
     * 最近邻搜索
     *
     * @param {number} lat - 查询点纬度
     * @param {number} lng - 查询点经度
     * @param {number} k - 返回的最近邻数量
     * @returns {Array<Object>} 最近的k个点
     */
    nearestNeighbors(lat, lng, k = 1) {
        const distances = this.points.map(point => ({
            ...point,
            distance: this.calculateDistance(lat, lng, point.lat, point.lng)
        }));

        return distances
            .sort((a, b) => a.distance - b.distance)
            .slice(0, k);
    }

    /**
     * 计算两点间的距离（Haversine公式）
     */
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // 地球半径（公里）
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLng / 2) * Math.sin(dLng / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    /**
     * 获取网格键
     */
    getGridKey(lat, lng) {
        const gridLat = Math.floor(lat / this.gridSize);
        const gridLng = Math.floor(lng / this.gridSize);
        return `${gridLat},${gridLng}`;
    }
}

// ============================= 4. 自适应搜索策略 =============================

/**
 * 自适应搜索算法选择器
 *
 * 核心思想：
 * 根据数据特征和历史性能自动选择最优的搜索算法
 * 支持在线学习和算法切换
 */
class AdaptiveSearchSelector {
    constructor() {
        this.algorithms = {
            linear: this.linearSearch.bind(this),
            binary: this.binarySearch.bind(this),
            interpolation: this.interpolationSearch.bind(this),
            exponential: this.exponentialSearch.bind(this)
        };

        this.statistics = new Map();
        this.learningRate = 0.1;
        this.explorationRate = 0.1;
    }

    /**
     * 自适应搜索
     *
     * @param {Array} data - 数据数组
     * @param {*} target - 目标值
     * @param {Object} context - 上下文信息
     * @returns {Object} 搜索结果和选择的算法
     */
    search(data, target, context = {}) {
        const characteristics = this.analyzeData(data, context);
        const selectedAlgorithm = this.selectAlgorithm(characteristics);

        const startTime = performance.now();
        const result = this.algorithms[selectedAlgorithm](data, target);
        const endTime = performance.now();

        const executionTime = endTime - startTime;

        // 更新统计信息
        this.updateStatistics(selectedAlgorithm, characteristics, executionTime, result !== -1);

        return {
            result,
            algorithm: selectedAlgorithm,
            executionTime,
            characteristics
        };
    }

    /**
     * 分析数据特征
     */
    analyzeData(data, context) {
        return {
            size: data.length,
            isSorted: this.isSorted(data),
            dataType: this.getDataType(data),
            distribution: this.analyzeDistribution(data),
            searchFrequency: context.searchFrequency || 1,
            cacheHit: context.cacheHit || false
        };
    }

    /**
     * 选择最优算法
     */
    selectAlgorithm(characteristics) {
        // 探索策略：有一定概率随机选择算法
        if (Math.random() < this.explorationRate) {
            const algorithms = Object.keys(this.algorithms);
            return algorithms[Math.floor(Math.random() * algorithms.length)];
        }

        // 利用策略：基于特征和历史性能选择
        let bestAlgorithm = 'linear';
        let bestScore = -Infinity;

        for (const algorithm of Object.keys(this.algorithms)) {
            const score = this.calculateAlgorithmScore(algorithm, characteristics);
            if (score > bestScore) {
                bestScore = score;
                bestAlgorithm = algorithm;
            }
        }

        return bestAlgorithm;
    }

    /**
     * 计算算法得分
     */
    calculateAlgorithmScore(algorithm, characteristics) {
        const stats = this.statistics.get(algorithm) || {
            totalTime: 0,
            totalCalls: 0,
            successRate: 0
        };

        let score = 0;

        // 基于数据特征的静态评分
        if (algorithm === 'binary' && characteristics.isSorted) {
            score += 10;
        }

        if (algorithm === 'interpolation' &&
            characteristics.distribution === 'uniform' &&
            characteristics.dataType === 'number') {
            score += 8;
        }

        if (algorithm === 'exponential' && characteristics.size > 10000) {
            score += 5;
        }

        if (algorithm === 'linear' && characteristics.size < 100) {
            score += 3;
        }

        // 基于历史性能的动态评分
        if (stats.totalCalls > 0) {
            const avgTime = stats.totalTime / stats.totalCalls;
            score += (1000 / avgTime) * stats.successRate; // 时间越短，成功率越高，得分越高
        }

        return score;
    }

    /**
     * 更新统计信息
     */
    updateStatistics(algorithm, characteristics, executionTime, success) {
        if (!this.statistics.has(algorithm)) {
            this.statistics.set(algorithm, {
                totalTime: 0,
                totalCalls: 0,
                successfulCalls: 0,
                successRate: 0
            });
        }

        const stats = this.statistics.get(algorithm);
        stats.totalTime += executionTime;
        stats.totalCalls++;

        if (success) {
            stats.successfulCalls++;
        }

        stats.successRate = stats.successfulCalls / stats.totalCalls;
    }

    /**
     * 检查数组是否有序
     */
    isSorted(arr) {
        for (let i = 1; i < arr.length; i++) {
            if (arr[i] < arr[i - 1]) {
                return false;
            }
        }
        return true;
    }

    /**
     * 获取数据类型
     */
    getDataType(arr) {
        if (arr.length === 0) return 'unknown';

        const firstType = typeof arr[0];
        return arr.every(item => typeof item === firstType) ? firstType : 'mixed';
    }

    /**
     * 分析数据分布
     */
    analyzeDistribution(arr) {
        if (arr.length < 2 || typeof arr[0] !== 'number') {
            return 'unknown';
        }

        const differences = [];
        for (let i = 1; i < arr.length; i++) {
            differences.push(arr[i] - arr[i - 1]);
        }

        const avgDiff = differences.reduce((sum, diff) => sum + diff, 0) / differences.length;
        const variance = differences.reduce((sum, diff) => sum + Math.pow(diff - avgDiff, 2), 0) / differences.length;

        return variance < avgDiff * 0.1 ? 'uniform' : 'non-uniform';
    }

    // 算法实现
    linearSearch(arr, target) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === target) return i;
        }
        return -1;
    }

    binarySearch(arr, target) {
        let left = 0, right = arr.length - 1;
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            if (arr[mid] === target) return mid;
            else if (arr[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }

    interpolationSearch(arr, target) {
        let left = 0, right = arr.length - 1;
        while (left <= right && target >= arr[left] && target <= arr[right]) {
            if (left === right) return arr[left] === target ? left : -1;

            const pos = left + Math.floor(
                ((target - arr[left]) / (arr[right] - arr[left])) * (right - left)
            );

            if (arr[pos] === target) return pos;
            else if (arr[pos] < target) left = pos + 1;
            else right = pos - 1;
        }
        return -1;
    }

    exponentialSearch(arr, target) {
        if (arr.length === 0) return -1;
        if (arr[0] === target) return 0;

        let bound = 1;
        while (bound < arr.length && arr[bound] < target) {
            bound *= 2;
        }

        return this.binarySearchRange(arr, target, Math.floor(bound / 2),
                                     Math.min(bound, arr.length - 1));
    }

    binarySearchRange(arr, target, left, right) {
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            if (arr[mid] === target) return mid;
            else if (arr[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }

    /**
     * 获取性能统计
     */
    getPerformanceStats() {
        const stats = {};
        for (const [algorithm, data] of this.statistics) {
            stats[algorithm] = {
                ...data,
                averageTime: data.totalCalls > 0 ? data.totalTime / data.totalCalls : 0
            };
        }
        return stats;
    }
}

// ============================= 5. 测试和使用示例 =============================

/**
 * 测试高级搜索算法
 */
function testAdvancedSearchAlgorithms() {
    console.log("=== 高级搜索算法测试 ===");

    // 测试三分搜索
    const singlePeakFunction = x => -(x - 5) * (x - 5) + 25; // 峰值在x=5
    const maxPoint = ternarySearch(singlePeakFunction, 0, 10);
    console.log(`三分搜索找到的最大值点: ${maxPoint.toFixed(4)}`);

    // 测试黄金分割搜索
    const goldenMaxPoint = goldenSectionSearch(singlePeakFunction, 0, 10);
    console.log(`黄金分割搜索找到的最大值点: ${goldenMaxPoint.toFixed(4)}`);

    // 测试记忆化指数搜索
    const memoSearch = new MemoizedExponentialSearch();
    const testArray = Array.from({length: 10000}, (_, i) => i * 2);

    console.log("记忆化指数搜索结果:", memoSearch.search(testArray, 1000));
    console.log("第二次搜索相同目标:", memoSearch.search(testArray, 1000));
    console.log("缓存统计:", memoSearch.getStats());
}

/**
 * 测试搜索引擎索引
 */
function testSearchEngineIndex() {
    console.log("\n=== 搜索引擎索引测试 ===");

    const searchEngine = new SearchEngineIndex();

    // 添加文档
    searchEngine.addDocument("doc1", "JavaScript is a programming language for web development");
    searchEngine.addDocument("doc2", "Python is a versatile programming language");
    searchEngine.addDocument("doc3", "Web development with JavaScript and HTML");
    searchEngine.addDocument("doc4", "Machine learning with Python programming");

    // 搜索测试
    console.log("搜索 'programming':");
    console.log(searchEngine.search("programming"));

    console.log("\n搜索 'JavaScript web':");
    console.log(searchEngine.search("JavaScript web"));

    console.log("\n布尔搜索 'programming AND JavaScript':");
    console.log(searchEngine.booleanSearch("programming AND JavaScript"));
}

/**
 * 测试地理位置搜索
 */
function testGeographicSearch() {
    console.log("\n=== 地理位置搜索测试 ===");

    const geoSearch = new GeographicSearch();

    // 添加一些地点（以北京为中心的示例）
    geoSearch.addPoint("point1", 39.9042, 116.4074, {name: "天安门"});
    geoSearch.addPoint("point2", 39.9163, 116.3972, {name: "北京大学"});
    geoSearch.addPoint("point3", 39.9996, 116.3273, {name: "清华大学"});
    geoSearch.addPoint("point4", 40.0081, 116.3241, {name: "颐和园"});

    // 范围搜索
    console.log("在指定范围内的地点:");
    console.log(geoSearch.searchInBounds(39.9, 40.1, 116.3, 116.5));

    // 圆形范围搜索
    console.log("\n距离天安门5公里内的地点:");
    console.log(geoSearch.searchInRadius(39.9042, 116.4074, 5));

    // 最近邻搜索
    console.log("\n距离指定点最近的2个地点:");
    console.log(geoSearch.nearestNeighbors(39.95, 116.35, 2));
}

/**
 * 测试自适应搜索选择器
 */
function testAdaptiveSearchSelector() {
    console.log("\n=== 自适应搜索选择器测试 ===");

    const adaptiveSearch = new AdaptiveSearchSelector();

    // 测试不同类型的数据
    const sortedData = Array.from({length: 1000}, (_, i) => i);
    const uniformData = Array.from({length: 1000}, (_, i) => i * 10);
    const smallData = [1, 3, 5, 7, 9];

    console.log("有序数据搜索:");
    console.log(adaptiveSearch.search(sortedData, 500));

    console.log("\n均匀分布数据搜索:");
    console.log(adaptiveSearch.search(uniformData, 5000));

    console.log("\n小数据集搜索:");
    console.log(adaptiveSearch.search(smallData, 5));

    // 多次搜索后的性能统计
    for (let i = 0; i < 50; i++) {
        adaptiveSearch.search(sortedData, Math.floor(Math.random() * 1000));
    }

    console.log("\n性能统计:");
    console.log(adaptiveSearch.getPerformanceStats());
}

/**
 * 运行所有高级算法测试
 */
function runAdvancedSearchTests() {
    console.log("搜索算法高级实现测试开始...\n");

    testAdvancedSearchAlgorithms();
    testSearchEngineIndex();
    testGeographicSearch();
    testAdaptiveSearchSelector();

    console.log("\n所有高级算法测试完成！");
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // 高级搜索算法
        ternarySearch,
        goldenSectionSearch,
        MemoizedExponentialSearch,

        // 并行搜索算法
        ParallelBinarySearch,
        ParallelStringSearch,

        // 应用场景搜索
        SearchEngineIndex,
        GeographicSearch,

        // 自适应搜索
        AdaptiveSearchSelector,

        // 测试函数
        runAdvancedSearchTests
    };
}

// 如果在浏览器环境中运行
if (typeof window !== 'undefined') {
    window.AdvancedSearchAlgorithms = {
        ternarySearch,
        goldenSectionSearch,
        MemoizedExponentialSearch,
        ParallelBinarySearch,
        ParallelStringSearch,
        SearchEngineIndex,
        GeographicSearch,
        AdaptiveSearchSelector
    };
    window.runAdvancedSearchTests = runAdvancedSearchTests;
}

// 自动运行测试（如果直接执行此文件）
if (typeof require !== 'undefined' && require.main === module) {
    runAdvancedSearchTests();
}