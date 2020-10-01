//<--Drawing section-->

const myCanvas = document.getElementById("myCanvas");
const ctx = myCanvas.getContext("2d");
window.alpha = 800/(400);
var bars = [];

/**
 * Draws a bar in the canvas where its height represents a numerical value.
 * Adds a new bar to bars if the bar is new
 * @param {number} xPos 
 * @param {number} height
 * @param {boolean} newBar
 */
function drawBar(xPos, height, newBar=true) { 
    ctx.fillStyle = `rgba(${Math.floor(255-(0.2*height))}, ${Math.floor(height-(0.2*height))}, ${Math.floor(0.5*height)})`;
    ctx.fillRect(xPos * window.alpha, 600-height, window.alpha, 600);
    ctx.beginPath();
    ctx.stroke();
    if (newBar) {
        bars.push(height);
    }
}

/**
 * Draws amount of random bars to the canvas.
 * Calls drawBar with a call to makeRandomNumber as the height
 * @param {number} amount 
 */
function addRandomBars(amount) {
    let delta = bars.length;
    for (var i = delta; i < amount + delta; i++) {
        drawBar(i, makeRandomNumber(0, 600));
    }
}

/**
 * If highligh is true, the bar in question highlights bar with a faded green shade above.
 * If highlight is false, any drawings above it will be removed
 * @param {Bar} bar 
 * @param {boolean} highlight
 */
function highlightBar(bar, highlight) {
    var xPos = bar.position;
    var height = bar.value;
    if (highlight) {
        ctx.fillStyle = "#bcebc7";
        ctx.fillRect(xPos * window.alpha, 0, window.alpha, 600-height);
    }
    else {
        ctx.clearRect(xPos * window.alpha, 0, window.alpha, 600-height);
    }
} 

/**
 * Used after each iteration of bars to show the changes in bars
 */
function redrawBars() {
    ctx.clearRect(0, 0, 800, 600);
    for (var i = 0; i < bars.length; i++) {
        drawBar(i, bars[i], false);
    }
}

//<--Utils section-->

/**
 * 
 * @param {number} low 
 * @param {number} high 
 * @returns {number} a random number in the range of the numbers provided above (inclusive, exclusive)
 */
function makeRandomNumber(low, high) {
    //Swithches the values of high and low if low > high
    temp = low;
    low = low * (low <= high) + high * (high < low);
    high = high * (high >= temp) + temp * (temp > high);
    return Math.round(Math.random() * (high - low) + low); 
}

/**
 * Swaps positions for the two bar objects in the bars array whilst updating the position field in
 * each bar object
 * @param {Bar} bar1 
 * @param {Bar} bar2 
 */
function swapBars(bar1, bar2, array=bars) {
    let temp = array[bar1];
    array[bar1] = array[bar2];
    array[bar2] = temp;
}

/**
 * Writes the worst case of the algorithm to the document
 * @param {number} worstCase
 */
function giveWorstCase(worstCase) {
    document.getElementById("Worst Case").innerText = "Worst Case: " + worstCase;
}

/**
 * Writes the number of operations required by the algorithm to the document
 * @param {number} res 
 */
function giveResult(res) {
    document.getElementById("result").innerText = "Operations required: " + res;
}

/**
 * Writes the execution time of the calling algorithm to the document
 * @param {number} ms 
 */
function giveTime(ms) {
    document.getElementById("time").innerText = "Time: " + Math.round(ms*1000)/1000 + " ms";
}

/**
 * Writes the name of the calling algorithm to the document
 * @param {string} algo 
 */
function giveAlgo(algo) {
    document.getElementById("algo").innerText = "Algorithm: " + algo;
}

/**
 * @param {Array} array 
 * @returns An array of equal lenght to the provided array but only holding null values
 */
function getTempArray(array) {
    let temp = [];
    for (var i = 0; i < array.length; i++) {
        temp.push(null);
    }
    return temp;
}

/**
 *@returns The value of the smallest bar
 */
function getSmallesBar() {
    var least = 600;
    for (var i = 0; i < bars.length; i++) {
        val = bars[i];
        least = val * (val < least) + least * (val >= least);
    }
    return least;
}

/**
 * @returns The value of the largest bar
 */
function getBiggestBar() {
    var largest = 0;
    for (var i = 0; i < bars.length; i++) {
        val = bars[i];
        largest = val * (val > largest) + largest * (val <= largest);
    }
    return largest;
}

/**
 * 
 * @param {Array<Bar>} array 
 */
function buildHeap(array) {
    var t = [];
    for (var i = Math.floor(array.length/2); i >= 0; i--) {
        maxHeapify(array, i);
        t = array;
    }
    return t;
}

/**
 * Heapifies array to a Max-Heap
 * @param {Array<Bar>} array 
 * @param {number} i 
 */
function maxHeapify(array, i) {
    left = 2*i+1;
    right = 2*i+2;
    var largest = i;
    if (left < array.length && array[left] > array[i]) {
        largest = left;
    }
    if (right < array.length && array[right] > array[largest]) {
        largest = right;
    }
    if (largest != i) {
        temp = array[i];
        array[i] = array[largest];
        array[largest] = temp;
        maxHeapify(array, largest);
    }
}

/**
 * 
 * @param {Bar} bar 
 * @param {number} amount_of_buckets 
 */
function assignBucket(bar, amount_of_buckets) {
    return Math.floor((bar-1*(bar == 600))/(600/amount_of_buckets));
}



//<--Sorting section-->

/**
 * Sorts bars using the bubble sort algorithm, efficency can be improved if optimized is true
 * @param {boolean} optimized
 */
function bubbleSort() {
    var t0 = performance.now()
    let sorted = false;
    var operations = 0;
    do {
        var check = true;
        for(var i = 0; i < bars.length-1; i++) {
            var bar1 = bars[i];
            var bar2 = bars[i+1];  
            if (bar1 > bar2) {
                swapBars(i, i+1);
                operations++;
                check = false;
            }
        }
        if (check == true) {
            sorted = true;
        }
    }
    while (sorted == false);
    t1 = performance.now();
    giveTime(t1-t0);
    giveWorstCase(bars.length*(bars.length-1));
    giveResult(operations);
    giveAlgo("Bubble sort");
    redrawBars();
}

/**
 * Sorts array using the insertion sort algorithm.
 * Helper determines whether performance metrics is to be written to the document
 * @param {Array<number>} array
 * @param {boolean} helper
 */
function insertionSort( array=bars, helper=false) {
    t0 = performance.now();
    var operations = 0;
    for (var i = 0; i < array.length-1; i++) {
        var bar1 = array[i];
        var bar2 = array[i+1];
        if (bar1 > bar2) {
            swapBars(i, i+1, array);
            operations++;
            for (var j = i; j >= 0; j--) {
                if (array[j] < array[j-1]) {
                    swapBars(j, j-1, array);
                    operations++;
                }
                else if (array[j] >= array[j-1]) {
                    break;
                }
            }
        }
    }
    t1 = performance.now();
    if (!helper) {
        giveTime(t1-t0);
        giveWorstCase(bars.length*(bars.length-1));
        giveResult(operations);
        giveAlgo("Insertion sort");
        redrawBars();
    }
    return operations
}

/**
 * Sorts the bars array using the selection sort algorithm
 */
function selectionSort() {
    t0 = performance.now();
    var operations = 0;
    for(var i = 0; i < bars.length; i++) {
        var least = Infinity;
        var bar;
        for (var j = i; j < bars.length; j++) {
            let currentBar = bars[j];
            if (currentBar < least) {
                bar = j;
                least = currentBar;
            }
            operations++;
        }
        swapBars(i, bar);
    }
    t1 = performance.now();
    giveTime(t1-t0);
    giveWorstCase(bars.length*(bars.length-1));
    giveResult(operations);
    giveAlgo("Selection sort");
    redrawBars();
}

/**
 * Sorts the bars array using the merge-sort algorithm
 */
function mergeSort() {
   var operations = 0;
   function merge(array, temp, lStart, rEnd) {
       if (lStart >= rEnd) {
           return;
       }
       let middle = Math.floor((lStart + rEnd)/2);
        merge(array, temp, lStart, middle);
        merge(array, temp, middle + 1, rEnd);
        operations += mergeHalves(array, temp, lStart, rEnd);
   }
   t0 = performance.now();
   merge(bars, getTempArray(bars), 0, bars.length-1);
   t1 = performance.now();
   giveTime(t1-t0);
   giveWorstCase(Math.ceil(bars.length*Math.log2(bars.length)));//TODO: check for accuracy
   giveResult(operations);
   giveAlgo("Merge sort");
   redrawBars();
}

/**
* Helper function for merging two sections of an array
* @param {Array<Bar>} array 
* @param {Array} temp 
* @param {number} lStart 
* @param {number} rEnd 
*/
function mergeHalves(array, temp, lStart, rEnd) {
    var operations = 0;
    let lEnd = Math.floor((lStart + rEnd)/2);
    let rStart = lEnd + 1;
    let size = rEnd - lStart + 1;
    let left = lStart;
    let right = rStart;
    let index = lStart;
    while (left <= lEnd && right <= rEnd) {
        operations++;
        if (array[left] <= array[right]) {
            temp[index] = array[left];
            left++;
        }

        else {
            temp[index] = array[right];
            right++;
        }
        index++;
    }
    if (right > rEnd) {
        for (var i = left; i <= lEnd; i++) {
            temp[index] = array[i];
            temp[index].position = index;
            index++;
        }
    }
    else {
        for (var i = right; i <= rEnd; i++) {
            temp[index] = array[i];
            temp[index].position = index;
            index++;
        }
    }
    for (var i = lStart; i < size + lStart; i++) {
        array[i] = temp[i];
    }
    return operations;
 }


/**
 * Sorts bars array using the quick sort algorithm 
 */
function quickSort() {

    var operations = 0;
    function quickSort(array) {
        sort(array, 0, array.length-1);
    }

    function sort(array, left, right) {
        if (left >= right) {
            return;
        }
        index = partition(array, left, right);
        sort(array, left, index-1);
        sort(array, index, right);
    }

    function partition(array, left, right) { 
        pivot = array[Math.floor((left + right)/2)];
        while (left <= right) {
            while (array[left] < pivot) {
                left++;
            }
            while(array[right] > pivot) {
                right--;
            }
            if (left<=right) {
                operations++;
                swapBars(left, right);
                left++;
                right--;
            }
        }
        return left;
    }
    t0 = performance.now();
    quickSort(bars);
    t1 = performance.now();
    giveTime(t1-t0);
    giveWorstCase(Math.ceil(bars.length*Math.log2(bars.length)));//TODO: check for accuracy
    giveResult(operations);
    giveAlgo("Quick sort");
    redrawBars();
}

/**
 * 
 * @param {Array} A 
 * @param {number} min
 * @param {number} max 
 */
function countingSort(A=bars) {
    var operations = 0;
    let t0 = performance.now();
    min = getSmallesBar();
    max = getBiggestBar();
    c = [];
    B = []
    for (var i = min; i <= max; i++) {
        c[i] = 0;
    }
    for (var j = 0; j < A.length; j ++) {
        B[j] = 0;
        c[A[j]] += 1;
        operations++;
    }
    for (var i = min+1; i <= max; i++) {
        c[i] += c[i-1]
    }
    for (j = A.length -1; j >= 0; j--) {
        B[c[A[j]]] = A[j]
        c[A[j]]--;
        operations++;
    }
    let t1 = performance.now();
    B.shift();
    bars = B;
    redrawBars();
    giveAlgo("Counting sort");
    giveResult(operations);
    giveTime(t1-t0);
    giveWorstCase(A.length + 2*(max-min));
}

/**
 * Sorts the bars array using the heapsort algorithm
 */
function heapSort() {
    t0 = performance. now()
    var aux = bars;
    var temp = [];
    var counter = bars.length-1;
    while (aux.length > 1) {
        aux = buildHeap(aux);
        bar = aux.shift();
        bar.position = counter;
        temp.unshift(bar);
        var i = aux.length - 1;
        var top = aux[0];
        aux[0] = aux[i];
        aux[i] = top;
        counter--;
    }
    bar = aux.shift();
    bar.position = 0;
    temp.unshift(bar);
    bars = temp;
    t1 = performance.now();
    giveTime(t1-t0);
    giveWorstCase(Math.ceil(bars.length*Math.log2(bars.length)));//TODO: check for accuracy
    //giveResult(operations);
    giveAlgo("Heap sort");
    redrawBars();
}

/**
 * 
 */
function bucketSort() {
    let operations = 0;
    let t0 = performance.now();
    let buckets = [];
    let buckets_required = Math.ceil(bars.length/30);
    for (var j = 0; j < buckets_required; j++) {
        buckets.push([]);
    }
    for (var i = 0; i < bars.length; i++) {
        bar = bars[i];
        buckets[assignBucket(bar, buckets_required)].push(bar);
    }
    for (var j = 0; j < buckets.length; j++) {
        operations += insertionSort(buckets[j], true);
    }
    bars = [];
    for (var j = 0; j < buckets.length; j++) {
        bucket = buckets[j];
        for (var i = 0; i < bucket.length; i++) {
            bars.push(bucket[i]);
        }
    }
    t1 = performance.now();
    redrawBars();
    giveAlgo("Bucket sort");
    giveResult(operations);
    giveTime(t1-t0);
    giveWorstCase(buckets_required*(30*30));
}

//<--User interaction section-->

/**
 * Called when the button "Add some values" is clicked. 
 * Collects the number provided in the above input-field.
 * Restrains the width of bar objects by commensurating window.alpha and the number of bars provided.
 * Calls addRandomBars() to draw the number of requested bars to myCanvas
 */
function applyRandomBars() {
    if (bars.length >= (800/window.alpha) + 1){
        alert("Maximum number of bars have been reached");
    }
    else {
        var amount = parseInt(document.getElementById("randomBars").value);
        window.alpha = 800/(amount);
        addRandomBars(amount);
    }
}

/**
 * Removes all entries from bars and clears the canvas
 */
function removeBars() {
    bars = [];
    ctx.clearRect(0, 0, 800, 600);
}