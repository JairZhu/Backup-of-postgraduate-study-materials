#include <iostream>
#include <iomanip>
#include <typeinfo>
#include <random>
#include <algorithm>
#include <ctime>
#include <cmath>
#include <fstream>
using namespace std;

enum Color { RED, BLACK };

struct Interval {
	int left, right;
	Interval(int l, int r) :left(l), right(r) {}
};

struct TNode {
	Color color;
	Interval interval;
	int key;
	int high;
	TNode* left;
	TNode* right;
	TNode* parent;
	TNode(int k, int h, Interval i):interval(i){
		color = BLACK;
		key = k;
		high = h;
		left = right = parent = 0;
	}
};

int tripleMax(int x1, int x2, int x3=0) {
	return max(x1, max(x2, x3));
}

class OSTree {
	TNode* root;
	TNode* nil;
	void rotateLeft(TNode*);
	void rotateRight(TNode*);
	void insertFixup(TNode*);
public:
	OSTree();
	TNode* getRoot() { return root; }
	void LNR(ostream&, TNode*);
	void insert(int, int);
	Interval IntervalSearch(Interval);
};

OSTree::OSTree() {
	nil = new TNode(-1, -1, Interval(-1, -1));
	root = nil;
}

void OSTree::LNR(ostream& out, TNode* p) {
	if (p == nil)
		return;
	LNR(out, p->left);		//�������������
	out << p->key << ", " << p->high << endl;
	LNR(out, p->right);		//��ѧ����������
}

void OSTree::rotateLeft(TNode* x) {
	TNode* y = x->right;	//��¼ָ��y�ڵ��ָ��
	x->right = y->left;		//y�����ӽڵ����ӵ�x����
	y->left->parent = x;
	y->parent = x->parent;	//y���ӵ�x�ĸ��ڵ�
	if (x->parent == nil) {	//x�Ǹ��ڵ�
		root = y;			//�޸���ָ��
	}
	else if (x == x->parent->left) {
		x->parent->left = y;//x���ڵ�������y
	}
	else {
		x->parent->right = y;//x���ڵ�������y
	}
	y->left = x;	//x���ӵ�y��
	x->parent = y;
	y->high = x->high;
	x->high = tripleMax(x->left->high, x->right->high);
}

void OSTree::rotateRight(TNode* y) {
	TNode* x = y->left;		//��¼ָ��x�ڵ��ָ��
	y->left = x->right;		//x�����ӽڵ����ӵ�y����
	x->right->parent = y;
	x->parent = y->parent;	//x���ӵ�y�ĸ��ڵ�
	if (y->parent == nil) {	//y�Ǹ��ڵ�
		root = x;			//�޸���ָ��
	}
	else if (y == y->parent->left) {
		y->parent->left = x;//y���ڵ�������x
	}
	else {
		y->parent->right = x;//y���ڵ�������x
	}
	x->right = y;	//y���ӵ�x��
	y->parent = x;
	x->high = y->high;
	y->high = tripleMax(y->left->high, y->right->high);
}

void OSTree::insert(int left, int right) {
	TNode* z = new TNode(left, right, Interval(left, right));
	TNode* y = nil, * x = root;	//y���ڼ�¼����ǰɨ��ڵ��˫�׽ڵ�
	while (x != nil) {			//���Ҳ���λ��
		y = x;
		x->high = tripleMax(x->high, z->high);
		if (z->key < x->key) 	//z����x�����
			x = x->left;
		else 
			x = x->right;		//z����x���ұ�
	}
	z->parent = y;				//y��z��˫��
	if (y == nil)				//z�������
		root = z;				//z�Ǹ�
	else if (z->key < y->key)
		y->left = z;			//z��y�����Ӳ���
	else
		y->right = z;			//z��y�����Ӳ���
	z->left = z->right = nil;
	z->color = RED;
	z->high = tripleMax(z->left->high, z->right->high, z->high);
	insertFixup(z);
}

Interval OSTree::IntervalSearch(Interval x) {
	TNode* p = root;
	while (p != nil && (x.left > p->interval.right || x.right < p->interval.left)) {
		if (p->left != nil && p->left->high >= x.left)
			p = p->left;
		else
			p = p->right;
	}
	return p->interval;
}

void OSTree::insertFixup(TNode* z) {
	while (z->parent->color == RED) {
		//��zΪ������p[z]==nil[T]������ɫΪ��,�������ѭ��
		//��p[z]Ϊ�ڣ�����������������ѭ��
		if (z->parent == z->parent->parent->left) {	//z��˫��p[z]�����游p[p[z]]������
			TNode* y = z->parent->parent->right;	//y��z������
			if (y->color == RED) {	//z������y�Ǻ�ɫ
				y->color = BLACK;
				z->parent->color = BLACK;
				z->parent->parent->color = RED;
				z = z->parent->parent;
			}
			else {	//z������y�Ǻ�ɫ
				if (z == z->parent->right) {	//z��˫��p[z]���Һ���
					z = z->parent;
					rotateLeft(z);	//����
				}
				//z��˫��p[z]������
				z->parent->color = BLACK;
				z->parent->parent->color = RED;
				rotateRight(z->parent->parent);	//����
			}
		}
		else {	//z��˫��p[z]�����游p[p[z]]���Һ���
			TNode* y = z->parent->parent->left;	//y��z������
			if (y->color == RED) {	//z������y�Ǻ�ɫ
				y->color = BLACK;
				z->parent->color = BLACK;
				z->parent->parent->color = RED;
				z = z->parent->parent;
			}
			else {	//z������y�Ǻ�ɫ
				if (z == z->parent->left) {		//z��˫��p[z]������
					z = z->parent;
					rotateRight(z);	//����
				}
				//z��˫��p[z]���Һ���
				z->parent->color = BLACK;
				z->parent->parent->color = RED;
				rotateLeft(z->parent->parent);	//����
			}
		}
	}
	root->color = BLACK;
}

int main() {
	ifstream infile("insert.txt");
	OSTree ostree;
	int n, left, right;
	infile >> n;
	for (int i = 0; i < n; ++i) {
		infile >> left >> right;
		ostree.insert(left, right);
	}
	cout << "OSTree�����������\n";
	ostree.LNR(cout, ostree.getRoot());
	while (true) {
		cout << "�������ѯ����:";
		cin >> left >> right;
		Interval temp = ostree.IntervalSearch(Interval(left, right));
		if (temp.left == -1 && temp.right == -1)
			cout << "�Ҳ����ص�����\n";
		else
			cout << "�ҵ�����: [" << temp.left << ", " << temp.right << "]\n";
	}
	return 0;
}