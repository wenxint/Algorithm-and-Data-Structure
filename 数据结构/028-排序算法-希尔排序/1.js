/*
 * @作者: kerwin
 */
var arr = [5, 7, 5, 4, 9, 1]

function countSort(arr) {
    if (arr.length < 2) {
        return arr
    }
    const maxValue = findMax(arr)
    // const maxValue = Math.max(...arr)
    const counts = new Array(maxValue + 1)
    arr.forEach(item => {
        if (!counts[item]) {
            counts[item] = 0
        }
        counts[item]++
    })
    // console.log(counts)
    let newarr = []
    let sortIndex = 0
    counts.forEach((item,index)=>{
        // console.log(item,index)
        while(item>0){
            newarr[sortIndex++] = index;
            item--
        }
    })
    return newarr
}

function findMax(arr) {
    let max = arr[0]
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i]
        }
    }
    return max
}

countSort(arr)