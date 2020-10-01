
//<-- Drawing -->
window.alpha = 600/(30);
const myCanvas = document.getElementById("myCanvas");
const ctx = myCanvas.getContext("2d");

function drawGrid() {
    for (var row = 1; row < (600/20); row++) {
        ctx.beginPath();
        ctx.moveTo(0, row*window.alpha);
        ctx.lineTo(600, row*window.alpha);
        ctx.moveTo(row*window.alpha, 0);
        ctx.lineTo(row*window.alpha, 600);
        ctx.stroke();
    }
}

function makeGridWithSortedValues() {

}


//<-- Util -->
/**
 * @param {number} low 
 * @param {number} high 
 * @returns {number} a randdom integer within the range(low, high) -- Inclusive/Exclusive
 */
function makeRandomInt(low, high) {
    return Math.floor(Math.random() * (high -low) + low);
}

/**
 * 
 * @param {number} size
 * @returns {Array<number>} A sorted array with random numbers
 */
function makeSortedArray(size) {
    let array = [];
    for (var i = 0; i < size; i++) {
        array.push(makeRandomInt(0, 100));
    }
    quickSort(array);
    return array;
}

/**
 * @param {Array} array 
 * @returns A sorted version of array
 */
function quickSort(array) {

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
               temp = array[left];
               array[left] = array[right];
               array[right] = temp;
                left++;
                right--;
            }
        }
        return left;
    }
    quickSort(array);
}


//<--User interaction section-->

