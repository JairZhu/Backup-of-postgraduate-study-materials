#include <fstream>
#include <iostream>
#include <vector>
#include <string>
#include <iomanip>
using namespace std;

double predict(double* x, double* w, int m) {
	double y = w[m];
	for (int i = 0; i < m; ++i)
		y += x[i] * w[i];
	return y;
}

void gradient_descent(double** x, double* y, double* w, double lambda, int n, int m) {
	double* difference = new double[n];
	for (int i = 0; i < n; ++i)
		difference[i] = predict(x[i], w, m) - y[i];
	double* errors = new double[m + 1];
	for (int i = 0; i < m + 1; ++i)
		errors[i] = 0;
	for (int i = 0; i < n; ++i)		//w[m]
		errors[m] += difference[i];
	for (int i = 0; i < m; ++i) 	//w[0]~w[m-1]
		for (int j = 0; j < n; ++j) 
			errors[i] += difference[j] * x[j][i];
	for (int i = 0; i < m + 1; ++i)
		w[i] -= lambda * 2.0 / n * errors[i];
	delete[] difference;
	delete[] errors;
}

double compute_loss(double** x, double* y, double* w, double lambda, int n, int m) {
	double loss = 0;
	for (int i = 0; i < n; ++i)
		loss += (predict(x[i], w, m) - y[i]) * (predict(x[i], w, m) - y[i]);
	loss /= 2 * n;
	return loss;
}

void train(double** x, double* y, double* w, double lambda, int n, int m, int iter) {
	for (int i = 0; i < iter; ++i) {
		gradient_descent(x, y, w, lambda, n, m);
		double loss = compute_loss(x, y, w, lambda, n, m);
		cout << "µü´ú´ÎÊý£º" << i << "  " << "loss: " << loss << endl;
	}
}

int main() {
	int n = 2888, m = 38;
	double** x_array = new double*[n];
	for (int i = 0; i < n; ++i)
		x_array[i] = new double[m];
	double* y_array = new double[n];
	ifstream infile("data_train.txt");
	string head[39];
	for (int i = 0; i < m + 1; ++i) 
		infile >> head[i];
	for (int i = 0; i < n; ++i) {
		for (int j = 0; j < m; ++j)
			infile >> x_array[i][j];
		infile >> y_array[i];
	}
	double* w = new double[m + 1];
	for (int i = 0; i <= m; ++i)
		w[i] = 1;
	double lambda = 0.01;
	int iter = 1000;
	train(x_array, y_array, w, lambda, n, m, iter);
	for (int i = 0; i <= m; ++i) {
		cout << "w" << setw(2) << i << ": " << setw(12) << w[i] << "  ";
		if (i % 6 == 5)
			cout << endl;
	}
	return 0;
}