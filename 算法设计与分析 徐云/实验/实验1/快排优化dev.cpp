#include <iostream>
#include <cstdlib>
#include <ctime>
#include <time.h>
#include <algorithm>
#include <fstream> 
using namespace std;

const int threshold = 16;

//��log n
int lg(int n) {
	int k;
	for (k = 0; n > 1; n >>= 1)
		k++;
	return k;
}

//����
int partition(int* array, int first, int last, int pivot) {
	//ѡ������β�м�λ������ֵ���м�ֵ��Ϊpivot
	//���һ�����ڳ�������Ч����֮ǰ��ָֹ����ƶ�
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

//ȡ��ֵ
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
	int parent = (holeindex - 1) / 2;// �ҵ����ڵ�
	// ����δ�ﵽ���ˣ��Ҹ��ڵ��ֵС����ֵ��������max-heap�Ĵ������ԣ�
	while (holeindex > topindex && array[first + parent] < value) {
		array[first + holeindex] = array[first + parent];// �ƶ���ֵ�����Ŵ�
		holeindex = parent;// ��������Ϊ���ڵ�
		parent = (holeindex - 1) / 2;// �¶��ĸ��ڵ�
	} // ѭ�������ˣ���������max-heap��˳��Ϊֹ
	array[first + holeindex] = value; // ����ֵ����ѭ����õ��Ķ��ţ����push����
}

//����
void adjustheap(int* array, int first, int holeindex, int len, int value) {
	int topindex = holeindex;
	int secondechild = 2 * holeindex + 2; // holeIndex�����ӽڵ�
	while (secondechild < len) {
		// �Ƚ�holeIndex�����ӽڵ��ֵ����secondChild����ֵ�ϴ���ӽڵ�
		if (array[first + secondechild] < array[first + (secondechild - 1)])
			secondechild--;
		// ��ϴ���ֵΪ��ֵ��ע�⣺ԭ��ֵ���ں����β�value�е��Ա���
		array[first + holeindex] = array[first + secondechild];
		holeindex = secondechild; // ���ö������Ƶ����ӽڵ㴦��
		secondechild = 2 * (secondechild + 1); // ����µĶ��ڵ�����ӽڵ�
	}
	if (secondechild == len) {// ���û�����ӽڵ㣬ֻ�����ӽڵ�
		// �����ӽڵ�Ϊ��ֵ��Ȼ�󽫶������Ƶ����ӽڵ�
		array[first + holeindex] = array[first + (secondechild - 1)];
		holeindex = secondechild - 1;
	}
	// ��ԭ��ֵpush���µĶ�����
	pushheap(array, first, holeindex, topindex, value);
}

//����
void makeheap(int* array, int first, int last) {
	if (last - first < 2)// �������Ϊ0��1��������������	
		return;
	int len = last - first;
	// �ҳ���һ����Ҫ�������е�����ͷ���������һ������������parent��ǡ������κ�Ҷ�ӽڵ㶼����Ҫ����
	int parent = (len - 2) / 2;
	while (true) {
		// ������parentΪ�׵���������lenΪ������Χ
		adjustheap(array, first, parent, len, array[first + parent]);
		if (parent == 0) // ������ڵ㣬����
			return;
		parent--; // ��ǰ����ǰһ���ڵ�
	}
}

void popheap(int* array, int first, int last, int result, int value) {
	array[result] = array[first];  // ��heap����Ԫ��ֵ���� result��
	adjustheap(array, first, 0, last - first, value);// ���µ���heap������Ϊ0������������ֵΪvalue
}

void sortheap(int* array, int first, int last) {
	while (last - first > 1) { // ֱ��ֻʣһ��Ԫ��Ϊֹ
		// ��firstԪ��ֵ�������ֵ������last-1��Ȼ���ص�[first, last-1)Ϊmax-heap
		popheap(array, first, last - 1, last - 1, array[last - 1]);
		// ÿִ��һ�Σ���Χ��Сһ��
		last--;
	}
}

//������
void partialsort(int* array, int first, int middle, int last) {
	makeheap(array, first, middle); //������[first, middle)����Ϊһ���ѽṹ
	for (int i = middle; i < last; ++i) {
		if (array[i] < array[first]) {// �����������Ԫ�أ��������ŵ�Ԫ�ط������
			popheap(array, first, middle, i, array[i]);// firstֵ��i�У�i��ԭֵ����heap������
		}
	}
	sortheap(array, first, last);// �����յĶѽ�������
}

//Introspective Sort
void introsort(int* array, int first, int last, int depth) {
	while (last - first > threshold) { //���ݳ��ȴ�����С�ֶ���ֵʱ�����õݹ�
		if (depth == 0) {
			//���ݹ����������ֵʱ�����ö�����
			partialsort(array, first, last, last);
			return;
		}
		--depth;//�ݹ������ֵ��1
		//������ֵ��
		int middle = median(array[first], array[first + (last - first) / 2], array[last - 1]);
		int cut = partition(array, first, last, middle);//����
		introsort(array, cut, last, depth);//�ݹ����
		last = cut;
	}
}

void copybackward(int* array, int first, int last) {
	//�����������1λ
	int next = last - 1;
	while (next >= first) {
		array[last] = array[next];
		next--;
		last--;
	}
}

void unguardedlinearinsert(int* array, int last, int value) {
	//ʡ��Խ����Ĳ�������
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
	if (value < array[first]) { //����ǰֵ������ߵ�ֵ��Ƚ�
		copybackward(array, first, last); //��ǰ���Ѿ����кõ�������������ƶ�һλ
		array[first] = value; //����Сֵ���������
	}
	else //�Ѿ�ȷ����Сֵ�������
		unguardedlinearinsert(array, last, value); //����ʡ��Խ����Ĳ�������
}

void insertionsort(int* array, int first, int last) {
	if (first == last)
		return;
	for (int i = first + 1; i != last; ++i)
		linearinsert(array, first, i);
}

void unguardedinsertionsort(int* array, int first, int last) {
	for (int i = first; i != last; ++i) {
		unguardedlinearinsert(array, i, array[i]); //����ʡ��Խ����Ĳ�������
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
		introsort(array, first, last, lg(last - first) * 2);//���� 
		finalinsertionsort(array, first, last);//�������� 
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

	//cout << "mysort����" << issorted(test, n) << endl;
	cout << "mysort��ʱ��" << ((double)(endtime - starttime) / CLOCKS_PER_SEC) * 1000 << "ms" << endl;
	cout << "std::sort��ʱ��" << ((double)(end - start) / CLOCKS_PER_SEC) * 1000 << "ms" << endl;

	
	ofstream outfile;
	outfile.open("sorted.txt");
	for (int i = 0; i < n; ++i)
		outfile << test[i] << " ";
	
	return 0;
}
