#include "BMgr.h"

// 建堆、整堆时，堆中元素依据 BCB 的 next 属性进行比较
auto cmp = [](const BCB* x, const BCB* y) { return x->next > y->next; };

bFrame CreatePage(int num) {
	bFrame frame;
	int i = 0;

	// 数据块号
	auto ch = static_cast<char*>(static_cast<void*>(&num));
	copy(ch, ch + sizeof(ch), frame.field);
	i += sizeof(ch);

	// 时间戳
	unsigned int btimestamp = 0;
	ch = static_cast<char*>(static_cast<void*>(&btimestamp));
	copy(ch, ch + sizeof(ch), frame.field + i);
	i += sizeof(ch);

	// 偏移量表
	unsigned short int offset[FRAMESIZE / RECORDSIZE];
	int BLOCK_HEAD = sizeof(btimestamp) + sizeof(offset);
	for (int t = 0; t < FRAMESIZE / RECORDSIZE; t++) { 
		int toffset = BLOCK_HEAD + t * RECORDSIZE;
		ch = static_cast<char*>(static_cast<void*>(&toffset));
		copy(ch, ch + sizeof(ch), frame.field + i);
		i += sizeof(ch);
	};

	for (int j = 0; j < FRAMESIZE / RECORDSIZE; ++j) {

		// 写入记录
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
	// 将 LRUList 变成小根堆，将 Time 作为排序依据
	make_heap(LRUList.begin(), LRUList.end(), cmp);

	for (int i = 0; i < DEFBUFSIZE; ++i) {
		bcbList[i] = nullptr;
		ftop[i] = -1;
	}

	// 初始化 buf 缓存区
	buf = new bFrame[DEFBUFSIZE];
	cout << "buffer大小： \t" << DEFBUFSIZE << endl;

	// 打开数据库文件
	dsmgr.OpenFile("data.dbf");
	
	Time = hit = miss = Incount = Outcount = 0;
}

int BMgr::FixPage(int page_id, int prot) {
	int frame_id;
	int key = Hash(page_id);

	// 在 ptof 中查找 page_id 是否存在，即 page_id 是否事先载入内存
	if (ptof.find(key) != ptof.end()) {
		for (int i = 0; i < ptof[key].size(); ++i) {
			if (ptof[key][i]->page_id == page_id) {
				frame_id = ptof[key][i]->frame_id;
				bcbList[frame_id]->count++;
				bcbList[frame_id]->latch = 1;

				// 统计命中次数
				//cout << "命中 " << frame_id << "frame" << endl;
				hit++;

				for (int k = 0; k < LRUList.size(); ++k) {
					if (LRUList[k]->page_id == page_id) {

						// 更新 BCB 的 Time 元素
						LRUList[k]->next = Time++;

						// 调整 LRUList
						push_heap(LRUList.begin(), LRUList.end(), cmp);

						return frame_id;
					}
				}
			}
		}
	}
	if (NumFreeFrames() == 0) {
		// 选择被替换的 frame
		frame_id = SelectVictim();
	}
	else {
		for (int i = 0; i < DEFBUFSIZE; ++i) {
			// 查找空闲的 frame
			if (bcbList[i] == nullptr) {
				frame_id = i;
				break;
			}
		}
	}

	// 统计未命中次数
	miss++;
	Incount++;

	// 将 page 载入内存的 frame
	buf[frame_id] = dsmgr.ReadPage(page_id);

	// 添加新的 BCB 到 BCB 列表
	bcbList[frame_id] = new BCB(page_id, frame_id, 1, 1, 0, Time++);

	// 将新的 BCB 加入 LRUList
	LRUList.push_back(bcbList[frame_id]);
	push_heap(LRUList.begin(), LRUList.end(), cmp);

	// 更新 ftop
	ftop[frame_id] = page_id;

	// 更新 ptof
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
		// 找到一个空闲的 page
		if (dsmgr.GetUse(i) == 0) {
			page_id = i;
			dsmgr.SetUse(i, 1);
			dsmgr.IncNumPages();
			break;
		}
	}
	if (NumFreeFrames() == 0) {
		// 选择被替换的 frame
		frame_id = SelectVictim();
	}
	else {
		for (int i = 0; i < DEFBUFSIZE; ++i) {
			// 查找空闲的 frame
			if (bcbList[i] == nullptr) {
				frame_id = i;
				break;
			}
		}
	}

	// 生成一个新的 page
	bFrame nframe = CreatePage(page_id);

	// 将新的 page 复制到 buffer
	copy(nframe.field, nframe.field + FRAMESIZE, buf[frame_id].field);

	// 添加新的 BCB 到 BCB 列表
	bcbList[frame_id] = new BCB(page_id, frame_id, 1, 1, 1, Time++);

	// 将新的 BCB 加入 LRUList
	LRUList.push_back(bcbList[frame_id]);
	push_heap(LRUList.begin(), LRUList.end(), cmp);

	// 更新 ftop
	ftop[frame_id] = page_id;

	int key = Hash(page_id);

	// 更新 ptof
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

	// 根据 page_id 查找对应的 BCB
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

	// 更新 BCB 的 Time
	bcb->next = Time++;

	// 调整 LRUList
	push_heap(LRUList.begin(), LRUList.end(), cmp);

	return bcb->frame_id;
}

int BMgr::NumFreeFrames() {
	return DEFBUFSIZE - LRUList.size();
}

int BMgr::SelectVictim() {

	// 选择 LRUList 中第一个 BCB，即最近没有访问过的 frame
	BCB* ptr = LRUList.front();

	// 删除 LRUList 中第一个 BCB 
	RemoveLRUEle(ptr->frame_id);

	// 如果为 dirty 则需写回磁盘
	if (bcbList[ptr->frame_id]->dirty) {
		Outcount++;
		dsmgr.WritePage(ptr->page_id, buf[ptr->frame_id]);
	}

	// 删除 BCB 列表中对应的 BCB
	RemoveBCB(ptr, ptr->page_id);

	//cout << "选择 " << ptr->frame_id << "frame 换出" << endl;
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
	// 删除 BCB 列表中对应的 BCB
	bcbList[ptr->frame_id] = nullptr;

	// 删除 ftop 对应的记录
	ftop[ptr->frame_id] = -1;
	
	// 删除 ptof 中对应的 BCB
	for (auto it = ptof[Hash(page_id)].begin(); it < ptof[Hash(page_id)].end(); ++it) {
		if ((*it)->page_id == page_id) {
			ptof[Hash(page_id)].erase(it);
			break;
		}
	}
}

void BMgr::RemoveLRUEle(int frame_id) {
	// 删除 LRUList 中对应的 BCB
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
		// 将所有 dirty 的 frame 写回磁盘
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


