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
	LNR(out, p->left);		//中序遍历左子树
	out << p->key << ", " << p->high << endl;
	LNR(out, p->right);		//中学遍历右子树
}

void OSTree::rotateLeft(TNode* x) {
	TNode* y = x->right;	//记录指向y节点的指针
	x->right = y->left;		//y的左子节点连接到x的右
	y->left->parent = x;
	y->parent = x->parent;	//y连接到x的父节点
	if (x->parent == nil) {	//x是根节点
		root = y;			//修改树指针
	}
	else if (x == x->parent->left) {
		x->parent->left = y;//x父节点左连接y
	}
	else {
		x->parent->right = y;//x父节点右连接y
	}
	y->left = x;	//x连接到y左
	x->parent = y;
	y->high = x->high;
	x->high = tripleMax(x->left->high, x->right->high);
}

void OSTree::rotateRight(TNode* y) {
	TNode* x = y->left;		//记录指向x节点的指针
	y->left = x->right;		//x的右子节点连接到y的左
	x->right->parent = y;
	x->parent = y->parent;	//x连接到y的父节点
	if (y->parent == nil) {	//y是根节点
		root = x;			//修改树指针
	}
	else if (y == y->parent->left) {
		y->parent->left = x;//y父节点左连接x
	}
	else {
		y->parent->right = x;//y父节点右连接x
	}
	x->right = y;	//y连接到x右
	y->parent = x;
	x->high = y->high;
	y->high = tripleMax(y->left->high, y->right->high);
}

void OSTree::insert(int left, int right) {
	TNode* z = new TNode(left, right, Interval(left, right));
	TNode* y = nil, * x = root;	//y用于记录：当前扫描节点的双亲节点
	while (x != nil) {			//查找插入位置
		y = x;
		x->high = tripleMax(x->high, z->high);
		if (z->key < x->key) 	//z插入x的左边
			x = x->left;
		else 
			x = x->right;		//z插入x的右边
	}
	z->parent = y;				//y是z的双亲
	if (y == nil)				//z插入空树
		root = z;				//z是根
	else if (z->key < y->key)
		y->left = z;			//z是y的左子插入
	else
		y->right = z;			//z是y的右子插入
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
		//若z为根，则p[z]==nil[T]，其颜色为黑,不进入此循环
		//若p[z]为黑，无需调整，不进入此循环
		if (z->parent == z->parent->parent->left) {	//z的双亲p[z]是其祖父p[p[z]]的左孩子
			TNode* y = z->parent->parent->right;	//y是z的叔叔
			if (y->color == RED) {	//z的叔叔y是红色
				y->color = BLACK;
				z->parent->color = BLACK;
				z->parent->parent->color = RED;
				z = z->parent->parent;
			}
			else {	//z的叔叔y是黑色
				if (z == z->parent->right) {	//z是双亲p[z]的右孩子
					z = z->parent;
					rotateLeft(z);	//左旋
				}
				//z是双亲p[z]的左孩子
				z->parent->color = BLACK;
				z->parent->parent->color = RED;
				rotateRight(z->parent->parent);	//右旋
			}
		}
		else {	//z的双亲p[z]是其祖父p[p[z]]的右孩子
			TNode* y = z->parent->parent->left;	//y是z的叔叔
			if (y->color == RED) {	//z的叔叔y是红色
				y->color = BLACK;
				z->parent->color = BLACK;
				z->parent->parent->color = RED;
				z = z->parent->parent;
			}
			else {	//z的叔叔y是黑色
				if (z == z->parent->left) {		//z是双亲p[z]的左孩子
					z = z->parent;
					rotateRight(z);	//右旋
				}
				//z是双亲p[z]的右孩子
				z->parent->color = BLACK;
				z->parent->parent->color = RED;
				rotateLeft(z->parent->parent);	//左旋
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
	cout << "OSTree的中序遍历：\n";
	ostree.LNR(cout, ostree.getRoot());
	while (true) {
		cout << "请输入查询区间:";
		cin >> left >> right;
		Interval temp = ostree.IntervalSearch(Interval(left, right));
		if (temp.left == -1 && temp.right == -1)
			cout << "找不到重叠区间\n";
		else
			cout << "找到区间: [" << temp.left << ", " << temp.right << "]\n";
	}
	return 0;
}