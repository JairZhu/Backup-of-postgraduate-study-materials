#ifndef _BMGR_H_
#define _BMGR_H_

#include "DSMgr.h"
#include "Common.h"
#include <vector>
#include <map>
#include <algorithm>
#include <iostream>
using namespace std;

class BMgr {
public:
	BMgr();
	int FixPage(int page_id, int prot);
	NewPage FixNewPage();
	int UnfixPage(int page_id);
	int NumFreeFrames();
	int SelectVictim();
	int Hash(int page_id);
	int getHit();
	int getMiss();
	int getIncount();
	int getOutcount();
	void RemoveBCB(BCB* ptr, int page_id);
	void RemoveLRUEle(int frame_id);
	void SetDirty(int frame_id);
	void UnsetDirty(int frame_id);
	void WriteDirtys();
	void PrintFrame(int frame_id);
private:
	int ftop[DEFBUFSIZE];
	map<int, vector<BCB*>> ptof;
	vector<BCB*> bcbList;
	vector<BCB*> LRUList;
	DSMgr dsmgr;
	int Time;
	bFrame* buf;
	int hit;
	int miss;
	int Incount;
	int Outcount;
};

#endif // !_BMGR_H