#include <iostream>
using namespace std;

template<class T>
struct Node {
	T value;
	Node<T>* next;
	Node(T t):value(t), next(0){}
};

template <class T>
class List {
public:
	Node<T>* head;
	List();
	void insert(T);
	List<T> operator-(const List<T>&) const;
	bool inOtherList(const List<T>&, const Node<T>*) const;
	friend ostream& operator<< <>(ostream&, const List<T>&);
};

template <class T>
List<T>::List() {
	head = new Node<T>(-1);
}

template <class T>
void List<T>::insert(T x) {
	Node<T>* p = head->next, *q = head;
	while (p != 0) {
		q = p;
		p = p->next;
	}
	q->next = new Node<T>(x);
}

template<class T>
bool List<T>::inOtherList(const List<T>& list, const Node<T>* target) const {
	Node<T>* p = list.head->next;
	while (p != 0) {
		if (p->value == target->value)
			return true;
		p = p->next;
	}
	return false;
}

template <class T>
List<T> List<T>::operator-(const List<T>& list) const {
	List<T> nl;
	Node<T>* p = head->next;
	while (p != 0) {
		if (!inOtherList(list, p)) 
			nl.insert(p->value);
		p = p->next;
	}
	return nl;
}

template <class T>
ostream& operator<<<>(ostream& out, const List<T>& list) {
	Node<T>* p = list.head->next;
	while (p != 0) {
		out << p->value << ", ";
		p = p->next;
	}
	return out;
}

int main() {
	List<int> list1, list2, list3;
	for (int i = 0; i < 10; ++i) {
		list1.insert(i);
		list2.insert(i + 2);
	}
	list3 = list1 - list2;
	cout << "list1:" << list1 << endl
		<< "list2:" << list2 << endl
		<< "list3:" << list3 << endl;
}

