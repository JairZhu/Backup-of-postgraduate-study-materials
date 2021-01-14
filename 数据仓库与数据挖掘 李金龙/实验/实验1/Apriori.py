import copy
import time

def load_data():
    data = []
    file = open("data.txt")
    lines = file.readlines()
    for line in lines:
        data.append([x for x in line.split()])
    return data

def satisfy_apriori(Ck_item, Lk_1):
    for item in Ck_item:
        sub_Ck = Ck_item - frozenset([item])
        if sub_Ck not in Lk_1:
            return False
    return True

def generate_Ck(Lk_1, k):
    Ck = set()
    Lk_1_len = len(Lk_1)
    Lk_1_list = list(Lk_1)
    for i in range(Lk_1_len):
        for j in range(1, Lk_1_len):
            li = list(Lk_1_list[i])
            lj = list(Lk_1_list[j])
            li.sort()
            lj.sort()
            if li[0:k-2] == lj[0:k-2]:
                Ck_item = Lk_1_list[i] | Lk_1_list[j]
                if satisfy_apriori(Ck_item, Lk_1):
                    Ck.add(Ck_item)
    return Ck

def generate_Lk_from_Ck(data, Ck, min_support, support_dict):
    Lk = set()
    item_count_dict = {}
    for line in data:
        for item in Ck:
            if item.issubset(line):
                if item not in item_count_dict.keys():
                    item_count_dict[item] = 1
                else:
                    item_count_dict[item] += 1
    data_len = float(len(data))
    for item in item_count_dict.keys():
        if item_count_dict[item] / data_len >= min_support:
            Lk.add(item)
            support_dict[item] = item_count_dict[item] / data_len
    return Lk

def generate_L_and_support_dict(data, min_support):
    support_dict = {}
    C1 = set()
    for line in data:
        for item in line:
            C1.add(frozenset([item]))
    Li = generate_Lk_from_Ck(data, C1, min_support, support_dict)
    Lk_1 = copy.deepcopy(Li)
    L = []
    k = 2
    while Li:
        L.append(Lk_1)
        Ci = generate_Ck(Lk_1, k)
        Li = generate_Lk_from_Ck(data, Ci, min_support, support_dict)
        Lk_1 = copy.deepcopy(Li)
        k += 1
    return L, support_dict

if __name__ == "__main__":
    min_support = 0.5
    data = load_data()
    start_time = time.time()
    L, support_dict = generate_L_and_support_dict(data, min_support)
    end_time = time.time()
    count = 0
    for Li in L:
        for item in Li:
            count += 1
            print("频繁项集:", list(item))
    print("频繁项集数量:", count)
    print("用时:", end_time - start_time, 's')