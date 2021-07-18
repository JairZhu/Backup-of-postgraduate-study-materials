#ifndef _COMMON_H_
#define _COMMON_H_

#include <iostream>
using namespace std;

constexpr auto FRAMESIZE = 4096;
constexpr auto DEFBUFSIZE = 1024;
constexpr auto MAXPAGES = 50000;
constexpr auto RECORDSIZE = 316;

struct bFrame {
	char field[FRAMESIZE];
	bFrame() {
		memset(field, 0, FRAMESIZE);
	}
	bFrame(const bFrame& b) {
		for (int i = 0; i < FRAMESIZE; ++i) {
			field[i] = b.field[i];
		}
	}
	const bFrame& operator= (const bFrame& b) {
		for (int i = 0; i < FRAMESIZE; ++i) {
			field[i] = b.field[i];
		}
		return b;
	}
};

struct BCB {
	int page_id;
	int frame_id;
	int latch;
	int count;
	int dirty;
	int next;
	BCB(int pid, int fid, int lat, int cnt, int dty, int ne) :page_id(pid), frame_id(fid), latch(lat), count(cnt), dirty(dty), next(ne) {}
};

struct Record {
	int page_id;
	int slot_num;
};

struct Frame {
	int frame_id;
	int offset;
};

struct NewPage {
	int page_id;
	int frame_id;
	NewPage(int p, int f):page_id(p), frame_id(f) {}
};

#endif // !_COMMON_H_