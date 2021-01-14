#include <iostream>
#include <cstdlib>
#include <ctime>
#include <time.h>
#include <algorithm>
#include <fstream> 
using namespace std;

const int threshold = 16;

//求log n
int lg(int n) {
	int k;
	for (k = 0; n > 1; n >>= 1)
		k++;
	return k;
}

//分区
int partition(int* array, int first, int last, int pivot) {
	//选择是首尾中间位置三个值的中间值作为pivot
	//因此一定会在超出此有效区域之前中止指针的移动
	while (true) {
		while (array[first] < pivot)
			first++;
		--last;
		while (pivot < array[last])
			last--;
		if (!(first < last))
			return first;
		int tmp = array[first];
		array[first] = array[last];
		array[last] = tmp;
		first++;
	}
}

//取中值
int median(int i, int j, int k) {
	if (i < j) {
		if (j < k) {
			return j;
		}
		else if (i < k) {
			return k;
		}
		else
			return i;
	}
	else if (i < k)
		return i;
	else if (j < k)
		return k;
	else
		return j;
}

void pushheap(int* array, int first, int holeindex, int topindex, int value) {
	int parent = (holeindex - 1) / 2;// 找到父节点
	// 当尚未达到顶端，且父节点的值小于新值（不符合max-heap的次序特性）
	while (holeindex > topindex && array[first + parent] < value) {
		array[first + holeindex] = array[first + parent];// 移动父值到洞号处
		holeindex = parent;// 调整洞号为父节点
		parent = (holeindex - 1) / 2;// 新洞的父节点
	} // 循环到顶端，或者满足max-heap的顺序为止
	array[first + holeindex] = value; // 将新值放入循环完得到的洞号，完成push操作
}

//整堆
void adjustheap(int* array, int first, int holeindex, int len, int value) {
	int topindex = holeindex;
	int secondechild = 2 * holeindex + 2; // holeIndex的右子节点
	while (secondechild < len) {
		// 比较holeIndex两个子节点的值，用secondChild代表值较大的子节点
		if (array[first + secondechild] < array[first + (secondechild - 1)])
			secondechild--;
		// 令较大子值为洞值，注意：原洞值已在函数形参value中得以保存
		array[first + holeindex] = array[first + secondechild];
		holeindex = secondechild; // 再让洞号下移到左子节点处，
		secondechild = 2 * (secondechild + 1); // 算出新的洞节点的右子节点
	}
	if (secondechild == len) {// 如果没有右子节点，只有左子节点
		// 令左子节点为洞值，然后将洞号下移到左子节点
		array[first + holeindex] = array[first + (secondechild - 1)];
		holeindex = secondechild - 1;
	}
	// 将原洞值push到新的洞号中
	pushheap(array, first, holeindex, topindex, value);
}

//建堆
void makeheap(int* array, int first, int last) {
	if (last - first < 2)// 如果长度为0或1，不必重新排列	
		return;
	int len = last - first;
	// 找出第一个需要重新排列的子树头部（即最后一个子树），以parent标记。由于任何叶子节点都不需要处理。
	int parent = (len - 2) / 2;
	while (true) {
		// 重排以parent为首的子树，以len为操作范围
		adjustheap(array, first, parent, len, array[first + parent]);
		if (parent == 0) // 走完根节点，结束
			return;
		parent--; // 向前排列前一个节点
	}
}

void popheap(int* array, int first, int last, int result, int value) {
	array[result] = array[first];  // 将heap顶端元素值放入 result中
	adjustheap(array, first, 0, last - first, value);// 重新调整heap，洞号为0，欲调整的新值为value
}

void sortheap(int* array, int first, int last) {
	while (last - first > 1) { // 直到只剩一个元素为止
		// 将first元素值（即最大值）放入last-1，然后重调[first, last-1)为max-heap
		popheap(array, first, last - 1, last - 1, array[last - 1]);
		// 每执行一次，范围缩小一格
		last--;
	}
}

//堆排序
void partialsort(int* array, int first, int middle, int last) {
	makeheap(array, first, middle); //将区间[first, middle)构造为一个堆结构
	for (int i = middle; i < last; ++i) {
		if (array[i] < array[first]) {// 遍历堆以外的元素，并将更优的元素放入堆中
			popheap(array, first, middle, i, array[i]);// first值放i中，i的原值融入heap并调整
		}
	}
	sortheap(array, first, last);// 对最终的堆进行排序
}

//Introspective Sort
void introsort(int* array, int first, int last, int depth) {
	while (last - first > threshold) { //数据长度大于最小分段阈值时，采用递归
		if (depth == 0) {
			//当递归次数超过阈值时，调用堆排序
			partialsort(array, first, last, last);
			return;
		}
		--depth;//递归深度阈值减1
		//三点中值法
		int middle = median(array[first], array[first + (last - first) / 2], array[last - 1]);
		int cut = partition(array, first, last, middle);//分区
		introsort(array, cut, last, depth);//递归调用
		last = cut;
	}
}

void copybackward(int* array, int first, int last) {
	//数据整体后移1位
	int next = last - 1;
	while (next >= first) {
		array[last] = array[next];
		next--;
		last--;
	}
}

void unguardedlinearinsert(int* array, int last, int value) {
	//省略越界检查的插入排序
	int next = last;
	--next;
	while (value < array[next]) {
		array[last] = array[next];
		last = next;
		--next;
	}
	array[last] = value;
}

void linearinsert(int* array, int first, int last) {
	int value = array[last];
	if (value < array[first]) { //将当前值与最左边的值相比较
		copybackward(array, first, last); //将前面已经排列好的数据整体向后移动一位
		array[first] = value; //将最小值放在最左边
	}
	else //已经确保最小值在最左边
		unguardedlinearinsert(array, last, value); //调用省略越界检查的插入排序
}

void insertionsort(int* array, int first, int last) {
	if (first == last)
		return;
	for (int i = first + 1; i != last; ++i)
		linearinsert(array, first, i);
}

void unguardedinsertionsort(int* array, int first, int last) {
	for (int i = first; i != last; ++i) {
		unguardedlinearinsert(array, i, array[i]); //调用省略越界检查的插入排序
	}
}

void finalinsertionsort(int* array, int first, int last) {
	if (last - first > threshold) {
		insertionsort(array, first, first + threshold);
		unguardedinsertionsort(array, first + threshold, last);
	}
	else
		insertionsort(array, first, last);
}

void mysort(int* array, int first, int last) {
	if (first != last) {
		introsort(array, first, last, lg(last - first) * 2);//快排 
		finalinsertionsort(array, first, last);//插入排序 
	}
}

bool issorted(int* array, int n) {
	if (n == 1)
		return true;
	for (int i = 0; i < n - 1; ++i)
		if (array[i] > array[i + 1])
			return false;
	return true;
}

int main() {
	ifstream infile("data.txt");
	int n;
	infile >> n; 
	int* test = new int[n];
	int* array = new int[n];
	for (int i = 0; i < n; ++i) {
		infile >> test[i];
		array[i] = test[i];
	}
		
	clock_t starttime = clock();
	mysort(test, 0, n);
	clock_t endtime = clock();

	clock_t start = clock();
	sort(array, array + n);
	clock_t end = clock();

	//cout << "mysort有序：" << issorted(test, n) << endl;
	cout << "mysort用时：" << ((double)(endtime - starttime) / CLOCKS_PER_SEC) * 1000 << "ms" << endl;
	cout << "std::sort用时：" << ((double)(end - start) / CLOCKS_PER_SEC) * 1000 << "ms" << endl;

	
	ofstream outfile;
	outfile.open("sorted.txt");
	for (int i = 0; i < n; ++i)
		outfile << test[i] << " ";
	
	return 0;
}
