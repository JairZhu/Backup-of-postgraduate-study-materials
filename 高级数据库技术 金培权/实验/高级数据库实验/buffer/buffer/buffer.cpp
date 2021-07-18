

#include<cstdio> 
#include<cstring> 
#include<cstdlib> 
#define FrameSize 4096 
#define BufferSize 10

#define MAXPAGES 50000
using namespace std;

inline unsigned _int64 GetCycleCount() {
	_asm _emit 0x0F
	_asm _emit 0x31
}
struct bFrame
{
	char field[FrameSize];
};
struct BCB
{
	int page_id;
	int frame_id;
	int count;
	int latch;
	unsigned _int64 usedtime;
	int dirty;
	BCB* next;
};

class File
{
public: FILE* file;
		int dirsize;
		int pagesize;
		int posDataStart;
		int page_count;
		File() {}
		File(const char * filename, int* dir);
		void create();
		void close(int* dir);
};

class DSMgr
{
private:
	File* currFile;
	int numPages;
	int pages[MAXPAGES];
	int DiskIOCount;
public:
	DSMgr();
	int OpenFile(char* filename = "data.dbf");
	void CloseFile();
	void ReadPage(bFrame* frame, int page_id);
	void WritePage(int page_id, bFrame* frm);
	int get_DiskIOCount();
};
class BMgr
{
private:
	DSMgr dsmgr;
	int num_free_frames;
	int ftop[BufferSize];
	BCB* ptof[BufferSize];
	//Buffer
	bFrame buf[BufferSize];
	int hitCount;
public:
	BMgr();
	int get_hitCount();
	int get_diskIoCount();
	bFrame& Read(int page_id);
	void RemoveBCB(BCB * ptr);
	void Write(int page_id, bFrame &input);
	BCB * SelectVictim();
	BCB* Hash(int page_id);
	int FixPage(int page_id, int RorW);
	void WriteDirtys();
};
#pragma warning(disable:4996)
File::File(const char * filename, int* dir)
{
	file = fopen(filename, "rb+");
	fread(&dirsize, sizeof(int), 1, file);
	fread(&pagesize, sizeof(int), 1, file);
	fread(&posDataStart, sizeof(int), 1, file);
	fread(dir, sizeof(int), dirsize / sizeof(int), file);
	page_count = dirsize / sizeof(int);
}
void File::create()
{
	int temp;
	FILE* file_t = fopen("data.dbf", "wb+");
	temp = 4 * 50000;
	fwrite(&temp, sizeof(int), 1, file_t);
	temp = 4096;
	fwrite(&temp, sizeof(int), 1, file_t);
	if ((4 * 3 + 4 * 50000) % 4096 > 0)
		temp = (4 * 3 + 4 * 50000) / 4096 + 1;
	else
		temp = (4 * 3 + 4 * 50000) / 4096;
	fwrite(&temp, sizeof(int), 1, file_t);
	int dir_t[50000];
	for (int i = 0; i < 50000; i++)
	{
		dir_t[i] = i;
	}
	fwrite(dir_t, sizeof(int), 50000, file_t);
	fseek(file_t, temp * 4096, 0);
	char c_temp[4096];
	for (int i = 0; i < 50000; i++)
	{
		c_temp[0] = i;
		fwrite(c_temp, sizeof(c_temp), 1, file_t);
	}
	fclose(file_t);
}
void File::close(int* dir)
{
	fwrite(&dirsize, sizeof(int), 1, file);
	fwrite(&pagesize, sizeof(int), 1, file);
	fwrite(&posDataStart, sizeof(int), 1, file);
	fwrite(dir, sizeof(int), dirsize / sizeof(int), file);
	fclose(file);
}
DSMgr::DSMgr()
{
	OpenFile();
	DiskIOCount = 0;
}
int DSMgr::OpenFile(char* filename) {
	currFile = new File(filename, pages);
	numPages = currFile->page_count;
	if (currFile != NULL)
		return 1;
	else
		return 0;
}
void DSMgr::CloseFile()
{
	currFile->page_count = numPages;
	currFile->dirsize = numPages * sizeof(int);
	if ((sizeof(int) * 3 + sizeof(int)*numPages) % currFile->pagesize > 0)
		currFile->posDataStart = (sizeof(int) * 3 + sizeof(int)*currFile->pagesize) / FrameSize + 1;
	else currFile->posDataStart = (sizeof(int) * 3 + sizeof(int)*currFile->pagesize) / FrameSize; currFile->close(pages);
}
void DSMgr::ReadPage(bFrame* frame, int page_id)
{
	int offset;
	DiskIOCount++;
	offset = pages[page_id];
	fseek(currFile->file, currFile->posDataStart + offset, 0);
	fread(frame, sizeof(bFrame), 1, currFile->file);
}
void DSMgr::WritePage(int page_id, bFrame* frm)
{
	int offset;
	DiskIOCount++;
	offset = pages[page_id - 1];
	fseek(currFile->file, currFile->posDataStart + offset, 0);
	fwrite(frm, sizeof(bFrame), 1, currFile->file);
}
int DSMgr::get_DiskIOCount() {
	return DiskIOCount;
}
BMgr::BMgr()
{
	num_free_frames = BufferSize;
	hitCount = 0;
	for (int i = 0; i < BufferSize; i++)
	{
		ftop[i] = -1;
		ptof[i] = NULL;
	}
}
int BMgr::get_hitCount()
{
	return hitCount;
}
int BMgr::get_diskIoCount() {
	return dsmgr.get_DiskIOCount();
}
bFrame& BMgr::Read(int page_id) {
	return buf[FixPage(page_id, 0)];
}
void BMgr::Write(int page_id, bFrame &input)
{
	strcpy(buf[FixPage(page_id, 1)].field, input.field);
}
void BMgr::RemoveBCB(BCB * ptr)
{
	BCB* p_temp = NULL;
	p_temp = ptof[ptr->page_id%BufferSize];
	if (ptr == p_temp)
	{
		ptof[ptr->page_id%BufferSize] = ptr->next;
	}
	else
	{
		while (p_temp->next != ptr)
			p_temp = p_temp->next;
		p_temp->next = ptr->next;
	}
}
BCB * BMgr::SelectVictim()
{
	BCB *p_temp = NULL, *min_p_temp = NULL;
	unsigned _int64 min;
	min = GetCycleCount();
	min_p_temp = ptof[0];
	for (int i = 0; i < BufferSize; i++)
	{
		p_temp = ptof[i];
		while (p_temp != NULL)
		{
			if (p_temp->usedtime < min)
			{
				min_p_temp = p_temp;
				min = p_temp->usedtime;
			}
			p_temp = p_temp->next;
		}
	}
	if (min_p_temp->dirty)
	{
		dsmgr.WritePage(min_p_temp->page_id, &buf[min_p_temp->frame_id]);
	}
	RemoveBCB(min_p_temp);
	ftop[min_p_temp->frame_id] = -1;
	return min_p_temp;
}
BCB* BMgr::Hash(int page_id)   //找   page_id对应的BCB
{
	BCB* p_temp = NULL;
	p_temp = ptof[page_id%BufferSize];
	while (p_temp != NULL)
	{
		if (p_temp->page_id == page_id)
			return p_temp;
		p_temp = p_temp->next;
	}
	return NULL;
}

int BMgr::FixPage(int page_id, int RorW) {
	BCB* p_temp = NULL;
	p_temp = Hash(page_id);
	if (p_temp != NULL)
	{
		hitCount++;
		if (RorW)
			p_temp->dirty = RorW;
		p_temp->usedtime = GetCycleCount();
		return p_temp->frame_id;
	}
	else
	{
		if (num_free_frames > 0)
		{
			num_free_frames--;
			for (int i = 0; i < BufferSize; i++)
			{
				if (ftop[i] == -1)
				{
					p_temp = new BCB();
					p_temp->count = 1;
					p_temp->dirty = RorW;
					p_temp->frame_id = i;
					p_temp->latch = 0;
					p_temp->next = NULL;
					p_temp->page_id = page_id;
					p_temp->usedtime = GetCycleCount();
					ftop[i] = page_id;
					p_temp->next = ptof[page_id%BufferSize];
					ptof[page_id%BufferSize] = p_temp;
					if (RorW == 0) dsmgr.ReadPage(&buf[i], page_id);
					return i;
				}
			}
		}
		else
		{
			p_temp = SelectVictim();
			ftop[p_temp->frame_id] = page_id;
			p_temp->count = 1;
			p_temp->dirty = RorW;
			p_temp->latch = 0;
			p_temp->next = NULL;
			p_temp->page_id = page_id;
			p_temp->usedtime = GetCycleCount();
			p_temp->next = ptof[page_id%BufferSize];
			ptof[page_id%BufferSize] = p_temp;
			if (RorW == 0)
				dsmgr.ReadPage(&buf[p_temp->frame_id], page_id);
			return p_temp->frame_id;
		}
	}
}
void BMgr::WriteDirtys() {
	BCB* p_temp = NULL;
	for (int i = 0; i < BufferSize; i++)
	{
		p_temp = ptof[i];
		while (p_temp != NULL)
		{
			if (p_temp->dirty)
			{
				dsmgr.WritePage(p_temp->page_id, &buf[p_temp->frame_id]);
			} p_temp = p_temp->next;
		}
	}
	dsmgr.CloseFile();
}

int main() {
	//File file;
	//file.create();
	int pageid, io;
	int * temp = NULL;
	FILE* fp = fopen("data-5w-50w-zipf.txt", "rt");
	BMgr bmgr;
	bFrame frame; //一个帧
	strcpy(frame.field, "I am a new page");
	temp = (int *)(frame.field + 16);
	_int64 freq = 3.8E6, cycle;
	int i;
	cycle = GetCycleCount();
	for (i = 0; i < 500000 && fp != NULL; i++)
	{
		fscanf(fp, "%d,%d", &io, &pageid);
		if (io == 0)
			bmgr.Read(50000 - pageid);
		else
		{
			*temp = pageid;
			bmgr.Write(pageid, frame);
		}
	}
	bmgr.WriteDirtys();
	cycle = (GetCycleCount() - cycle) / freq;
	printf("磁盘IO总次数: %d\n", bmgr.get_diskIoCount());
	printf("Buffer上的命中总次数: %d\n", bmgr.get_hitCount());
	printf("在Buffer上的命中率: %lf\%\n", (double)(bmgr.get_hitCount()) / i * 100);
	printf("记录访问总时间: %lld ms\n", cycle);
	system("pause");
	return 0;
}

