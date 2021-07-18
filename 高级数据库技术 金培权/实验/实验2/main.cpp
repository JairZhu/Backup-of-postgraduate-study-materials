#include "BMgr.h"
#include <fstream>
#include <string>
#include <iostream>
#include <vector>
using namespace std;

int main() {
	BMgr bmgr;

	// ���� FixNewPage 50000���Խ��� data.dbf �ļ� 
	/*for (int i = 0; i < MAXPAGES; ++i) {
		bmgr.FixNewPage();
	}
	bmgr.WriteDirtys();*/

	fstream file;
	file.open("data-5w-50w-zipf.txt");
	vector<pair<int, int>> opList;

	// ��ȡ trace �ļ����ɲ����б�
	while (file.good()) {
		pair<int, int> op;
		char t;
		file >> op.first;
		file >> t;
		file >> op.second;
		opList.push_back(op);
	}

	// ���ݲ����б�ģ�����ݿ���ʴ���
	for (int i = 0; i < opList.size(); ++i) {
		int page_id = opList[i].second;
		int dirty = opList[i].first;
		int frame_id = bmgr.FixPage(page_id, 0);
		if (dirty) {
			bmgr.SetDirty(frame_id);
		}
		bmgr.UnfixPage(page_id);
 	}

	// ���ݿ�ر�ǰ�� dirty frame д����� 
	bmgr.WriteDirtys();

	cout << "���д�����\t" << bmgr.getHit() << endl
		<< "�����ʣ� \t" << 1.0 * bmgr.getHit() / opList.size() << endl
		<< "δ���д�����\t" << bmgr.getMiss() << endl
		<< "��ȡ���̴�����\t" << bmgr.getIncount() << endl
		<< "д����̴�����\t" << bmgr.getOutcount() << endl;
	return 0;
}