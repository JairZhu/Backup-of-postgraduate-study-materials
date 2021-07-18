#include "BMgr.h"

// ���ѡ�����ʱ������Ԫ������ BCB �� next ���Խ��бȽ�
auto cmp = [](const BCB* x, const BCB* y) { return x->next > y->next; };

bFrame CreatePage(int num) {
	bFrame frame;
	int i = 0;

	// ���ݿ��
	auto ch = static_cast<char*>(static_cast<void*>(&num));
	copy(ch, ch + sizeof(ch), frame.field);
	i += sizeof(ch);

	// ʱ���
	unsigned int btimestamp = 0;
	ch = static_cast<char*>(static_cast<void*>(&btimestamp));
	copy(ch, ch + sizeof(ch), frame.field + i);
	i += sizeof(ch);

	// ƫ������
	unsigned short int offset[FRAMESIZE / RECORDSIZE];
	int BLOCK_HEAD = sizeof(btimestamp) + sizeof(offset);
	for (int t = 0; t < FRAMESIZE / RECORDSIZE; t++) { 
		int toffset = BLOCK_HEAD + t * RECORDSIZE;
		ch = static_cast<char*>(static_cast<void*>(&toffset));
		copy(ch, ch + sizeof(ch), frame.field + i);
		i += sizeof(ch);
	};

	for (int j = 0; j < FRAMESIZE / RECORDSIZE; ++j) {

		// д���¼
		char* p_schema = new char[4];
		copy(p_schema, p_schema + sizeof(p_schema), frame.field + i);
		i += sizeof(p_schema);
		delete p_schema;
		unsigned int timestamp = num;
		ch = static_cast<char*>(static_cast<void*>(&timestamp));
		copy(ch, ch + sizeof(ch), frame.field + i);
		i += sizeof(ch);
		unsigned int length = 316;
		ch = static_cast<char*>(static_cast<void*>(&length));
		copy(ch, ch + sizeof(ch), frame.field + i);
		i += sizeof(ch);
		char namePtr[32];
		copy(namePtr, namePtr + sizeof(namePtr), frame.field + i);
		i += sizeof(namePtr);
		char addressPtr[256];
		copy(addressPtr, addressPtr + sizeof(addressPtr), frame.field + i);
		i += sizeof(addressPtr);
		char genderPtr[4];
		copy(genderPtr, genderPtr + sizeof(genderPtr), frame.field + i);
		i += sizeof(genderPtr);
		char birthdayPtr[12];
		copy(birthdayPtr, birthdayPtr + sizeof(birthdayPtr), frame.field + i);

	}
	return frame;
}

BMgr::BMgr():bcbList(DEFBUFSIZE) {
	// �� LRUList ���С���ѣ��� Time ��Ϊ��������
	make_heap(LRUList.begin(), LRUList.end(), cmp);

	for (int i = 0; i < DEFBUFSIZE; ++i) {
		bcbList[i] = nullptr;
		ftop[i] = -1;
	}

	// ��ʼ�� buf ������
	buf = new bFrame[DEFBUFSIZE];
	cout << "buffer��С�� \t" << DEFBUFSIZE << endl;

	// �����ݿ��ļ�
	dsmgr.OpenFile("data.dbf");
	
	Time = hit = miss = Incount = Outcount = 0;
}

int BMgr::FixPage(int page_id, int prot) {
	int frame_id;
	int key = Hash(page_id);

	// �� ptof �в��� page_id �Ƿ���ڣ��� page_id �Ƿ����������ڴ�
	if (ptof.find(key) != ptof.end()) {
		for (int i = 0; i < ptof[key].size(); ++i) {
			if (ptof[key][i]->page_id == page_id) {
				frame_id = ptof[key][i]->frame_id;
				bcbList[frame_id]->count++;
				bcbList[frame_id]->latch = 1;

				// ͳ�����д���
				//cout << "���� " << frame_id << "frame" << endl;
				hit++;

				for (int k = 0; k < LRUList.size(); ++k) {
					if (LRUList[k]->page_id == page_id) {

						// ���� BCB �� Time Ԫ��
						LRUList[k]->next = Time++;

						// ���� LRUList
						push_heap(LRUList.begin(), LRUList.end(), cmp);

						return frame_id;
					}
				}
			}
		}
	}
	if (NumFreeFrames() == 0) {
		// ѡ���滻�� frame
		frame_id = SelectVictim();
	}
	else {
		for (int i = 0; i < DEFBUFSIZE; ++i) {
			// ���ҿ��е� frame
			if (bcbList[i] == nullptr) {
				frame_id = i;
				break;
			}
		}
	}

	// ͳ��δ���д���
	miss++;
	Incount++;

	// �� page �����ڴ�� frame
	buf[frame_id] = dsmgr.ReadPage(page_id);

	// ����µ� BCB �� BCB �б�
	bcbList[frame_id] = new BCB(page_id, frame_id, 1, 1, 0, Time++);

	// ���µ� BCB ���� LRUList
	LRUList.push_back(bcbList[frame_id]);
	push_heap(LRUList.begin(), LRUList.end(), cmp);

	// ���� ftop
	ftop[frame_id] = page_id;

	// ���� ptof
	if (ptof.find(key) == ptof.end()) {
		vector<BCB*> list;
		list.push_back(bcbList[frame_id]);
		ptof[key] = list;
	}
	else {
		for (int i = 0; i < ptof[key].size(); ++i) {
			if (ptof[key][i]->page_id == page_id) {
				ptof[key][i] = bcbList[frame_id];
				return frame_id;
			}
		}
		ptof[key].push_back(bcbList[frame_id]);
	}

	return frame_id;
}

NewPage BMgr::FixNewPage() {
	int frame_id, page_id;

	for (int i = 0; i < MAXPAGES; ++i) {
		// �ҵ�һ�����е� page
		if (dsmgr.GetUse(i) == 0) {
			page_id = i;
			dsmgr.SetUse(i, 1);
			dsmgr.IncNumPages();
			break;
		}
	}
	if (NumFreeFrames() == 0) {
		// ѡ���滻�� frame
		frame_id = SelectVictim();
	}
	else {
		for (int i = 0; i < DEFBUFSIZE; ++i) {
			// ���ҿ��е� frame
			if (bcbList[i] == nullptr) {
				frame_id = i;
				break;
			}
		}
	}

	// ����һ���µ� page
	bFrame nframe = CreatePage(page_id);

	// ���µ� page ���Ƶ� buffer
	copy(nframe.field, nframe.field + FRAMESIZE, buf[frame_id].field);

	// ����µ� BCB �� BCB �б�
	bcbList[frame_id] = new BCB(page_id, frame_id, 1, 1, 1, Time++);

	// ���µ� BCB ���� LRUList
	LRUList.push_back(bcbList[frame_id]);
	push_heap(LRUList.begin(), LRUList.end(), cmp);

	// ���� ftop
	ftop[frame_id] = page_id;

	int key = Hash(page_id);

	// ���� ptof
	if (ptof.find(key) == ptof.end()) {
		vector<BCB*> list;
		list.push_back(bcbList[frame_id]);
		ptof[key] = list;
	}
	else {
		for (int i = 0; i < ptof[key].size(); ++i) {
			if (ptof[key][i]->page_id == page_id) {
				ptof[key][i] = bcbList[frame_id];
			}
		}
		ptof[key].push_back(bcbList[frame_id]);
	}

	return NewPage(page_id, frame_id);
}

int BMgr::UnfixPage(int page_id) {

	// ���� page_id ���Ҷ�Ӧ�� BCB
	BCB* bcb = ptof[Hash(page_id)][0];
	for (int i = 0; i < ptof[Hash(page_id)].size(); ++i) {
		if (ptof[Hash(page_id)][i]->page_id == page_id) {
			bcb = ptof[Hash(page_id)][i];
			break;
		}
	}

	bcb->count--;
	if (bcb->count == 0) {
		bcb->latch = 0;
	}

	// ���� BCB �� Time
	bcb->next = Time++;

	// ���� LRUList
	push_heap(LRUList.begin(), LRUList.end(), cmp);

	return bcb->frame_id;
}

int BMgr::NumFreeFrames() {
	return DEFBUFSIZE - LRUList.size();
}

int BMgr::SelectVictim() {

	// ѡ�� LRUList �е�һ�� BCB�������û�з��ʹ��� frame
	BCB* ptr = LRUList.front();

	// ɾ�� LRUList �е�һ�� BCB 
	RemoveLRUEle(ptr->frame_id);

	// ���Ϊ dirty ����д�ش���
	if (bcbList[ptr->frame_id]->dirty) {
		Outcount++;
		dsmgr.WritePage(ptr->page_id, buf[ptr->frame_id]);
	}

	// ɾ�� BCB �б��ж�Ӧ�� BCB
	RemoveBCB(ptr, ptr->page_id);

	//cout << "ѡ�� " << ptr->frame_id << "frame ����" << endl;
	int frame_id = ptr->frame_id;
	delete ptr;
	return frame_id;
}

int BMgr::Hash(int page_id) {
	return page_id % DEFBUFSIZE;
}

int BMgr::getHit() {
	return hit;
}

int BMgr::getMiss() {
	return miss;
}

int BMgr::getIncount() {
	return Incount;
}

int BMgr::getOutcount() {
	return Outcount;
}

void BMgr::RemoveBCB(BCB* ptr, int page_id) {
	// ɾ�� BCB �б��ж�Ӧ�� BCB
	bcbList[ptr->frame_id] = nullptr;

	// ɾ�� ftop ��Ӧ�ļ�¼
	ftop[ptr->frame_id] = -1;
	
	// ɾ�� ptof �ж�Ӧ�� BCB
	for (auto it = ptof[Hash(page_id)].begin(); it < ptof[Hash(page_id)].end(); ++it) {
		if ((*it)->page_id == page_id) {
			ptof[Hash(page_id)].erase(it);
			break;
		}
	}
}

void BMgr::RemoveLRUEle(int frame_id) {
	// ɾ�� LRUList �ж�Ӧ�� BCB
	pop_heap(LRUList.begin(), LRUList.end(), cmp);
	LRUList.pop_back();
}

void BMgr::SetDirty(int frame_id) {
	bcbList[frame_id]->dirty = 1;
}

void BMgr::UnsetDirty(int frame_id) {
	bcbList[frame_id]->dirty = 0;
}

void BMgr::WriteDirtys() {
	for (int i = 0; i < DEFBUFSIZE; ++i) {
		// ������ dirty �� frame д�ش���
		if (bcbList[i] != nullptr && bcbList[i]->dirty == 1) {
			Outcount++;
			dsmgr.WritePage(ftop[i], buf[i]);
		}
	}
}

void BMgr::PrintFrame(int frame_id) {
	cout << "BCB: \n"
		<< "\tpage_id: " << bcbList[frame_id]->page_id << endl
		<< "\tframe_id: " << bcbList[frame_id]->frame_id << endl
		<< "\tlatch: " << bcbList[frame_id]->latch << endl
		<< "\tcount: " << bcbList[frame_id]->count << endl
		<< "\tdirty: " << bcbList[frame_id]->dirty << endl
		<< "\ttime: " << bcbList[frame_id]->next << endl;
}


