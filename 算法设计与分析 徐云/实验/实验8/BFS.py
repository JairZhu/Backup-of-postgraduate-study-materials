class Edge:
    def __init__(self, mark = None, iVex = None, iLink = None, jVex = None, jLink = None):
        self.mark = mark
        self.iVex = iVex
        self.iLink = iLink
        self.jVex = jVex
        self.jLink = jLink

def add_edge(edges, edge, i):
    if edges[i] is None:
        edges[i] = edge
    else:
        ptr = edges[i]
        while (ptr.iVex == i and ptr.iLink is not None) or (ptr.jVex == i and ptr.jLink is not None):
            if ptr.iVex == i:
                ptr = ptr.iLink
            else:
                ptr = ptr.jLink
        if ptr.iVex == i:
            ptr.iLink = edge
        else:
            ptr.jLink = edge

def read_data():
    file = open('data.txt', 'r')
    vexs = file.readline().strip().split(',')
    edges = [None for i in vexs]
    for line in file.readlines():
        i = vexs.index(line[0])
        j = vexs.index(line[2])
        edge = Edge(False, i, None, j, None)
        add_edge(edges, edge, i)
        add_edge(edges, edge, j)
    return vexs, edges

def print_edges(vex, edges):
    for i in range(len(vexs)):
        ptr = edges[i]
        count = 0
        print(vex[i], ':')
        while ptr is not None:
            count += 1
            print(vexs[ptr.iVex], '-', vexs[ptr.jVex], end='  ')
            if ptr.iVex == i:
                ptr = ptr.iLink
            else:
                ptr = ptr.jLink
        print(count)

def BFS(vexs, edges):
    visited = [False for i in vexs]
    queue = []
    queue.append(0)
    visited[0] = True
    while len(queue) != 0:
        index = queue.pop(0)
        print(vexs[index], end=' ')
        ptr = edges[index]
        while ptr is not None:
            if ptr.iVex == index:
                if not visited[ptr.jVex]:
                    queue.append(ptr.jVex)
                    visited[ptr.jVex] = True
                ptr = ptr.iLink
            else:
                if not visited[ptr.iVex]:
                    queue.append(ptr.iVex)
                    visited[ptr.iVex] = True
                ptr = ptr.jLink

if __name__ == "__main__":
    vexs, edges = read_data()
    print_edges(vexs, edges)
    BFS(vexs, edges)