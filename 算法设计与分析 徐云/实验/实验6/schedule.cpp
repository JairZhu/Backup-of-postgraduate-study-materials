#include <fstream>
#include <iostream>
#include <map>
#include <string>
using namespace std;

int n, machine;
double time[100], minTime = INT_MAX, machineTime[100];
map<int, int> temp, schedule;

double max(double array[]) {
	double MM = 0;
	for (int i = 1; i <= machine; ++i) 
		if (array[i] > MM)
			MM = array[i];
	return MM;
}

void dfs(int i, double curTime) {
	if (i > n) {
		if (curTime < minTime) {
			minTime = curTime;
			schedule = temp;
		}
		return;
	}
	if (curTime > minTime)
		return;
	for (int j = 1; j <= machine; ++j) {
		machineTime[j] += time[i];
		temp[i] = j;
		curTime = max(machineTime);
		dfs(i + 1, curTime);
		machineTime[j] -= time[i];
	}
}

int main() {
	ifstream infile("data.txt");
	infile >> n >> machine;
	for (int i = 1; i <= n; ++i)
		infile >> time[i];
	dfs(1, 0);
	for (int i = 1; i <= machine; ++i) {
		cout << "Machine" << i << ':';
		for (int j = 1; j <= n; ++j) {
			if (schedule[j] == i) {
				cout << '<' << j << ", " << time[j] << ">, ";
			}
		}
		cout << endl;
	}
	cout << "×ÜÊ±¼ä£º" << minTime;
	return 0;
}