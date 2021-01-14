import functools
import copy
import math

def readFile():
    file = open('data.txt', 'r')
    pair = []
    for line in file.readlines():
        temp = line.strip().split(',')
        temp[0] = float(temp[0][2:])
        temp[1] = float(temp[1][1:-1])
        temp.append(line[0])
        pair.append(temp)
    return pair

def cmpX(a, b):
    if b[0] < a[0]:
        return -1
    if a[0] < b[0]:
        return 1
    return 0

def cmpY(a, b):
    if b[1] < a[1]:
        return -1
    if a[1] < b[1]:
        return 1
    return 0

def computeDistance(x, y):
    return math.sqrt((x[0] - y[0]) * (x[0] - y[0]) + (x[1] - y[1]) * (x[1] - y[1]))

def search(xpair):
    minLength = 9999999
    pair = None
    for i in range(len(xpair) - 1):
        for j in range(i + 1, len(xpair)):
            length = computeDistance(xpair[i], xpair[j])
            if length < minLength:
                minLength = length
                pair = [xpair[i][2], xpair[j][2]]
    return minLength, pair

def divide(pairs, pivot):
    pl = []
    pr = []
    for point in pairs:
        if point[0] < pivot:
            pl.append(point)
        elif point[0] > pivot:
            pr.append(point)
        else:
            pl.append(point)
            pr.append(point)
    return pl, pr

def solution(xpair, ypair):
    num = len(xpair)
    if num <= 3:
        return search(xpair)
    if num % 2 == 1:
        xmidline = xpair[int(num / 2)][0]
    else:
        xmidline = (xpair[int(num / 2)][0] + xpair[int(num / 2) - 1][0]) / 2
    xl, xr = divide(xpair, xmidline)
    yl, yr = divide(ypair, xmidline)
    llen, lpair = solution(xl, yl)
    rlen, rpair = solution(xr, yr)
    if llen < rlen:
        minlen = llen
        minpair = lpair
    else:
        minlen = rlen
        minpair = rpair
    y = []
    for point in ypair:
        if abs(point[0] - xmidline) <= minlen:
            y.append(point)
    i = 0
    while (i == 0 or i < len(y) - 7):
        for j in range(1, 8):
            if i + j >= len(y):
                break
            length = computeDistance(y[i], y[i + j])
            if length < minlen:
                minlen = length
                minpair = [y[i][2], y[i + j][2]]
        i += 1
    return minlen, minpair

if __name__ == '__main__':
    pair = readFile()
    xpair = copy.deepcopy(sorted(pair, key=functools.cmp_to_key(cmpX), reverse=True))
    ypair = copy.deepcopy(sorted(pair, key=functools.cmp_to_key(cmpY), reverse=True))
    minlen, minpair = solution(xpair, ypair)
    print("最近点对的距离：", minlen)
    print("最近点对：", minpair[0], minpair[1])