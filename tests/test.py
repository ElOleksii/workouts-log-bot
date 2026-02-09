def simple_search(arr, target):
    for i in arr:
        if i == target: return True
    return False

def binary_search(arr, target):
    low = 0
    high = len(arr)
    
    while(low < high):
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        
        if(target > arr[mid]): low = mid + 1
        if(target < arr[mid]): high = mid - 1   
        
    return None

print(simple_search([1, 2, 3, 4, 5, 6, 7, 8], 10))
print(binary_search([1, 2, 3, 4, 5, 6, 7, 8], 5))

