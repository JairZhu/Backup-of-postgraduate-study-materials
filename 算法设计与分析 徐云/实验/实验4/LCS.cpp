#include<string>
#include<iostream>
using namespace std;

void LCS_length(int** c, int** b, string x, string y) {
	int m = x.length() - 1, n = y.length() - 1;
	for (int i = 0; i <= m; ++i)
		c[i][0] = 0;
	for (int j = 0; j <= n; ++j)
		c[0][j] = 0;
	for (int i = 1; i <= m; ++i) {
		for (int j = 1; j <= n; ++j) {
			if (x[i] == y[j]) {
				c[i][j] = c[i - 1][j - 1] + 1;
				b[i][j] = 0;	//指向↖
			}
			else if (c[i - 1][j] >= c[i][j - 1]) {
				c[i][j] = c[i - 1][j];
				b[i][j] = 1;	//指向↑
			}
			else {
				c[i][j] = c[i][j - 1];
				b[i][j] = 2;	//指向←
			}
		}
	}
}

void get_LCS(int** b, string x, int i, int j, string& result) {
	if (i == 0 || j == 0)
		return;
	if (b[i][j] == 0) {			//指向↖
		get_LCS(b, x, i - 1, j - 1, result);
		result.push_back(x[i]);
	}
	else if (b[i][j] == 1) {	//指向↑
		get_LCS(b, x, i - 1, j, result);
	}
	else {						//指向←
		get_LCS(b, x, i, j - 1, result);
	}
}

int main() {
	cout << "请输入text1，text2：";
	string str1, str2;
	cin >> str1 >> str2;
	str1 = ' ' + str1;
	str2 = ' ' + str2;
	int m = str1.length() - 1, n = str2.length() - 1;
	//初始化二维数组c
	int** c = new int* [m + 1];
	for (int i = 0; i <= m; ++i)
		c[i] = new int[n + 1];
	//初始化二维数组b
	int** b = new int* [m + 1];
	for (int i = 0; i <= m; ++i)
		b[i] = new int[n + 1];
	LCS_length(c, b, str1, str2);
	int len = c[m][n];
	if (len > 0) {
		string result;
		get_LCS(b, str1, m, n, result);
		cout << "LCS：" << result << ", ";
	}
	cout << "长度：" << len << endl;
	return 0;
}