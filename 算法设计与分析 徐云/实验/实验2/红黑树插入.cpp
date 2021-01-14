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
}

void redBlackTree::rotateRight(TNode* y) {
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
}

void redBlackTree::insert(TNode* z) {
	TNode* y = nil, * x = root;	//y���ڼ�¼����ǰɨ��ڵ��˫�׽ڵ�
	while (x != nil) {			//���Ҳ���λ��
		y = x;
		if (z->key < x->key)	//z����x�����
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
	insertFixup(z);
}

void redBlackTree::LNR(ofstream& outfile, TNode* p) {
	if (p == nil)
		return;
	LNR(outfile, p->left);		//�������������
	outfile << p->key << ", " << (p->color == RED ? "red" : "black") << endl;
	LNR(outfile, p->right);		//��ѧ����������
}

void redBlackTree::NLR(ofstream& outfile, TNode* p) {
	if (p == nil)
		return;
	outfile << p->key << ", " << (p->color == RED ? "red" : "black") << endl;
	NLR(outfile, p->left);		//�������������
	NLR(outfile, p->right);		//�������������
}

void redBlackTree::insertFixup(TNode* z) {
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