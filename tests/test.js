function generateUnsortedArr(n = 10) {
  const arr = [];
  for (let i = 0; i < n; i++) {
    arr.push(Math.floor(Math.random() * n));
  }
  return arr;
}
const arr = generateUnsortedArr(10);
console.log(arr);
// 5 7 8 3 2

function findSmallers(arr) {}

function selectionSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    let minIdx = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }

    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }

  return arr;
}

console.log(selectionSort(arr));
