#include "DSMgr.h"

DSMgr::DSMgr() {
	currFile = nullptr;
	numPages = 0;
	memset(pages, 0, MAXPAGES);
}

int DSMgr::OpenFile(string filename) {
	currFile = fopen(filename.c_str(), "r+");
	return 0;
}

int DSMgr::CloseFile() {
	fclose(currFile);
	return 0;
}

bFrame DSMgr::ReadPage(int page_id) {
	fseek(currFile, page_id * FRAMESIZE, SEEK_SET);
	bFrame tmp;
	fread(&tmp, sizeof(char), FRAMESIZE, currFile);
	return tmp;
}

int DSMgr::WritePage(int frame_id, bFrame frm) {
	fseek(currFile, frame_id * FRAMESIZE, SEEK_SET);
	fwrite(&frm, sizeof(char), FRAMESIZE, currFile);
	return 0;
}

int DSMgr::Seek(int offset, int pos) {
	fseek(currFile, offset, SEEK_SET);
	return 0;
}

FILE* DSMgr::GetFile() {
	return currFile;
}

void DSMgr::IncNumPages() {
	numPages++;
}

int DSMgr::GetNumPages() {
	return numPages;
}

void DSMgr::SetUse(int index, int use_bit) {
	pages[index] = use_bit;
}

int DSMgr::GetUse(int index) {
	return pages[index];
}
