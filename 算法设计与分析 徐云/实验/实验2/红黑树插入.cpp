#include <iostream>
#include <iomanip>
#include <typeinfo>
#include <random>
#include <algorithm>
#include <ctime>
#include <fstream>
using namespace std;

enum Color { RED, BLACK };

struct TNode {
	Color color;
	int key;
	TNode* left;
	TNode* right;
	TNode* parent;
	TNode(int k){
		color = BLACK;
		key = k;
		left = right = parent = 0;
	}
};

class redBlackTree {
public:
	TNode* root;
	TNode* nil;
	void rotateLeft(TNode*);
	void rotateRight(TNode*);
	void insertFixup(TNode*);
	redBlackTree();
	void insert(TNode*);
	void LNR(ofstream&, TNode*);
	void NLR(ofstream&, TNode*);
};

redBlackTree::redBlackTree() {
	nil = new TNode(-1);
	root = nil;
}

void redBlackTree::rotateLeft(TNode* x) {
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
}

void redBlackTree::rotateRight(TNode* y) {
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
}

void redBlackTree::insert(TNode* z) {
	TNode* y = nil, * x = root;	//y用于记录：当前扫描节点的双亲节点
	while (x != nil) {			//查找插入位置
		y = x;
		if (z->key < x->key)	//z插入x的左边
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
	insertFixup(z);
}

void redBlackTree::LNR(ofstream& outfile, TNode* p) {
	if (p == nil)
		return;
	LNR(outfile, p->left);		//中序遍历左子树
	outfile << p->key << ", " << (p->color == RED ? "red" : "black") << endl;
	LNR(outfile, p->right);		//中学遍历右子树
}

void redBlackTree::NLR(ofstream& outfile, TNode* p) {
	if (p == nil)
		return;
	outfile << p->key << ", " << (p->color == RED ? "red" : "black") << endl;
	NLR(outfile, p->left);		//先序遍历左子树
	NLR(outfile, p->right);		//先序遍历右子树
}

void redBlackTree::insertFixup(TNode* z) {
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
	ofstream outfile_NLR("NLR.txt");
	ofstream outfile_LNR("LNR.txt");
	redBlackTree rbtree;
	int n, key;
	infile >> n;
	for (int i = 0; i < n; ++i) {
		infile >> key;
		TNode* node = new TNode(key);
		rbtree.insert(node);
	}
	rbtree.LNR(outfile_LNR, rbtree.root);
	rbtree.NLR(outfile_NLR, rbtree.root);
	return 0;
}