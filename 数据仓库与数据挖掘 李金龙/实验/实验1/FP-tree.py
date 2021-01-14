import time

def load_data():
    data = []
    file = open("data.txt")
    lines = file.readlines()
    for line in lines:
        data.append([x for x in line.split()])
    data_dict = {}
    for line in data:
        data_dict[frozenset(line)] = data_dict.get(frozenset(line), 0) + 1
    return data_dict

class Node:
    def __init__(self, value, count, parent):
        self.value = value
        self.count = count
        self.link = None
        self.parent = parent
        self.children = {}

    def inc(self, count):
        self.count += count

    def __lt__(self, other):
        return self.count < other.count

def create_tree(data_dict, min_support):
    head_table = {}
    for line in data_dict:
        for item in line:
            head_table[item] = head_table.get(item, 0) + data_dict[line]
    for k in list(head_table.keys()):
        if head_table[k] / 2000.0 < min_support:
            head_table.pop(k)
    item_set = set(head_table.keys())
    if not item_set:
        return None, None
    for key in head_table.keys():
        head_table[key] = [head_table[key], None]
    tree = Node("null set", 1, None)
    for tran_set, count in data_dict.items():
        local = {}
        for item in tran_set:
            if item in item_set:
                local[item] = head_table[item][0]
        if len(local) > 0:
            order_items = [x[0] for x in sorted(local.items(), key=lambda p: p[1], reverse=True)]
            update_tree(order_items, tree, head_table, count)
    return tree, head_table

def update_tree(items, tree, head_table, count):
    if items[0] in tree.children:
        tree.children[items[0]].inc(count)
    else:
        tree.children[items[0]] = Node(items[0], count, tree)
        if head_table[items[0]][1] == None:
            head_table[items[0]][1] = tree.children[items[0]]
        else:
            update_head(head_table[items[0]][1], tree.children[items[0]])
    if len(items) > 1:
        update_tree(items[1::], tree.children[items[0]], head_table, count)

def update_head(test, target):
    while test.link != None:
        test = test.link
    test.link = target

def ascend_tree(leaf, prefix_path):
    if leaf.parent != None:
        prefix_path.append(leaf.value)
        ascend_tree(leaf.parent, prefix_path)

def find_prefix_path(base, tree_node):
    cond_pats = {}
    while tree_node != None:
        prefix_path = []
        ascend_tree(tree_node, prefix_path)
        if len(prefix_path) > 1:
            cond_pats[frozenset(prefix_path[1:])] = tree_node.count
        tree_node = tree_node.link
    return cond_pats

def mine_tree(tree, head_table, min_support, pre_fix, freq_item_list):
    big = [k for k, v in sorted(head_table.items(), key=lambda p: p[1][0])]
    for base in big:
        new_freq_set = pre_fix.copy()
        new_freq_set.add(base)
        freq_item_list.append(new_freq_set)
        cond_pat_base = find_prefix_path(base, head_table[base][1])
        cond_tree, head = create_tree(cond_pat_base, min_support)
        if head != None:
            mine_tree(cond_tree, head, min_support, new_freq_set, freq_item_list)

if __name__ == "__main__":
    min_support = 0.5
    data_dict = load_data()
    fp_tree, head_table = create_tree(data_dict, min_support)
    freq_list = []
    start_time = time.time()
    mine_tree(fp_tree, head_table, min_support, set([]), freq_list)
    end_time = time.time()
    for item in freq_list:
        print("频繁项集:", item)
    print("频繁项集数量:", len(freq_list))
    print("用时:", end_time - start_time, 's')