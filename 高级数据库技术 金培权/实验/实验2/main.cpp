#include "BMgr.h"
#include <fstream>
#include <string>
#include <iostream>
#include <vector>
using namespace std;

int main() {
	BMgr bmgr;

	// 调用 FixNewPage 50000次以建立 data.dbf 文件 
	/*for (int i = 0; i < MAXPAGES; ++i) {
		bmgr.FixNewPage();
	}
	bmgr.WriteDirtys();*/

	fstream file;
	file.open("data-5w-50w-zipf.txt");
	vector<pair<int, int>> opList;

	// 读取 trace 文件生成操作列表
	while (file.good()) {
		pair<int, int> op;
		char t;
		file >> op.first;
		file >> t;
		file >> op.second;
		opList.push_back(op);
	}

	// 依据操作列表模拟数据库访问磁盘
	for (int i = 0; i < opList.size(); ++i) {
		int page_id = opList[i].second;
		int dirty = opList[i].first;
		int frame_id = bmgr.FixPage(page_id, 0);
		if (dirty) {
			bmgr.SetDirty(frame_id);
		}
		bmgr.UnfixPage(page_id);
 	}

	// 数据库关闭前将 dirty frame 写入磁盘 
	bmgr.WriteDirtys();

	cout << "命中次数：\t" << bmgr.getHit() << endl
		<< "命中率： \t" << 1.0 * bmgr.getHit() / opList.size() << endl
		<< "未命中次数：\t" << bmgr.getMiss() << endl
		<< "读取磁盘次数：\t" << bmgr.getIncount() << endl
		<< "写入磁盘次数：\t" << bmgr.getOutcount() << endl;
	return 0;
}