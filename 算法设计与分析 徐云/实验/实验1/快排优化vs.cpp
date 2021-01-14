#include <iostream>
#include <random>
#include <algorithm>
#include <ctime>
#include <chrono>
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
	int parent = (holeindex - 1) / 2;
	while (holeindex > topindex && array[first + parent] < value) {
		array[first + holeindex] = array[first + parent];
		holeindex = parent;
		parent = (holeindex - 1) / 2;
	}
	array[first + holeindex] = value;
}

//整堆
void adjustheap(int* array, int first, int holeindex, int len, int value) {
	int topindex = holeindex;
	int secondechild = 2 * holeindex + 2;
	while (secondechild < len) {
		if (array[first + secondechild] < array[first + (secondechild - 1)])
			secondechild--;
		array[first + holeindex] = array[first + secondechild];
		holeindex = secondechild;
		secondechild = 2 * (secondechild + 1);
	}
	if (secondechild == len) {
		array[first + holeindex] = array[first + (secondechild - 1)];
		holeindex = secondechild - 1;
	}
	pushheap(array, first, holeindex, topindex, value);
}

//建堆
void makeheap(int* array, int first, int last) {
	if (last - first < 2)
		return;
	int len = last - first;
	int parent = (len - 2) / 2;
	while (true) {
		adjustheap(array, first, parent, len, array[first + parent]);
		if (parent == 0)
			return;
		parent--;
	}
}

void popheap(int* array, int first, int last, int result, int value) {
	array[result] = array[first];
	adjustheap(array, first, 0, last - first, value);
}

void sortheap(int* array, int first, int last) {
	while (last - first > 1) {
		popheap(array, first, last - 1, last - 1, array[last - 1]);
		last--;
	}
}

//堆排序
void partialsort(int* array, int first, int middle, int last) {
	makeheap(array, first, middle);
	for (int i = middle; i < last; ++i) {
		if (array[i] < array[first]) {
			popheap(array, first, middle, i, array[i]);
		}
	}
	sortheap(array, first, last);
}

//Introspective Sort
void introsort(int* array, int first, int last, int depth) {
	while (last - first > threshold) {
		if (depth == 0) {
			partialsort(array, first, last, last);
			return;
		}
		--depth;
		int middle = median(array[first], array[first + (last - first) / 2], array[last - 1]);
		int cut = partition(array, first, last, middle);
		introsort(array, cut, last, depth);
		last = cut;
	}
}

void unguardedlinearinsert(int* array, int last, int value) {
	int next = last;
	--next;
	while (value < array[next]) {
		array[last] = array[next];
		last = next;
		--next;
	}
	array[last] = value;
}

void copybackward(int* array, int first, int last) {
	int next = last - 1;
	while (next >= first) {
		array[last] = array[next];
		next--;
		last--;
	}
}

void linearinsert(int* array, int first, int last) {
	int value = array[last];
	if (value < array[first]) {
		copybackward(array, first, last);
		array[first] = value;
	}
	else
		unguardedlinearinsert(array, last, value);
}

void insertionsort(int* array, int first, int last) {
	if (first == last)
		return;
	for (int i = first + 1; i != last; ++i)
		linearinsert(array, first, i);
}

void unguardedinsertionsort(int* array, int first, int last) {
	for (int i = first; i != last; ++i) {
		unguardedlinearinsert(array, i, array[i]);
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
		introsort(array, first, last, lg(last - first) * 2);
		finalinsertionsort(array, first, last);
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
	int n = 1000000;
	int* test = new int[n];
	default_random_engine e;
	uniform_int_distribution<int> u(0, 10000000);
	e.seed(time(0));
	for (int i = 0; i < n; ++i) {
		test[i] = u(e);
	}
		
	auto starttime = clock();
	mysort(test, 0, n);
	auto endtime = clock();

	cout << "mysort有序：" << issorted(test, n) << endl;
	cout << "mysort用时：" << (double)(endtime - starttime) / CLOCKS_PER_SEC << endl;
	return 0;
}