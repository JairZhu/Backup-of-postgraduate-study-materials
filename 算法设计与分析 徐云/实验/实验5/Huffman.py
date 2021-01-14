import functools

def compare(node1, node2):
    """定义sort函数中比较方式"""
    if node1.prob > node2.prob:
        return 1
    elif node1.prob == node2.prob:
        return 0
    else:
        return -1

class Node:
    """定义结点"""
    def __init__(self, value, prob, left, right):
        self.value = value
        self.prob = prob
        self.left = left
        self.right = right

class Huffman:

    def __init__(self):
        self.root = None
        self.nodeDict = {}

    def buildTree(self, dataNode):
        """建树"""
        while len(dataNode) > 1:
            dataNode = sorted(dataNode, key=functools.cmp_to_key(compare))
            node1 = dataNode[0]
            node2 = dataNode[1]
            newNode = Node(None, node1.prob + node2.prob, node1, node2)
            del dataNode[0]
            del dataNode[0]
            dataNode.append(newNode)
        self.root = dataNode[0]

    def dfs(self, node, str):
        """先序遍历树，得到每个字符的编码方式"""
        if node.left is None and node.right is None:
            self.nodeDict[node.value] = str
        if node.left is not None:
            self.dfs(node.left, str + '1')
        if node.right is not None:
            self.dfs(node.right, str + '0')

    def encode(self, freqList):
        dataNode = []
        for item in freqList:
            dataNode.append(Node(item[0], item[1], None, None))
        self.buildTree(dataNode)
        self.dfs(self.root, '')

if __name__ == "__main__":
    file = open("data.txt")
    data = file.readline().strip()
    charDict = {}
    """统计字符出现的次数"""
    for i in range(len(data)):
        if data[i] not in charDict.keys():
            charDict[data[i]] = 1
        else:
            charDict[data[i]] += 1
    dataList = []
    for key, value in charDict.items():
        dataList.append([key, value])
    huffman = Huffman()
    huffman.encode(dataList)
    print("字符编码方式:", huffman.nodeDict)

    encodeText = ""
    for i in range(len(data)):
        encodeText += huffman.nodeDict[data[i]]
    print("Huffman编码:", encodeText)

    length = len(dataList)
    count = 0
    while length > 1:
        length /= 2
        count += 1
    print("压缩率:", len(encodeText) * 1.0 / (count * len(data)))

    with open("encode.txt", "w") as outfile:
        for i in range(len(data)):
            outfile.write(huffman.nodeDict[data[i]])

