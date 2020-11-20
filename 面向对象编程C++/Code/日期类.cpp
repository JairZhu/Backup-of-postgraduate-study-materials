#include <iostream>
using namespace std;

class Date {
public:
	int year, month, day;
	friend Date operator++(Date&);
	friend ostream& operator<<(ostream&, const Date&);
	friend Date operator++(Date&, int);
};

ostream& operator<<(ostream& out, const Date& date) {
	out << date.year << "-" << date.month << "-" << date.day;
	return out;
}

Date operator++(Date& date) {
	date.day++;
	if (date.day == 32 && (date.month == 1 || date.month == 3 || date.month == 5 || date.month == 7 || date.month == 8
		|| date.month == 10 || date.month == 12)) {
		date.day = 1;
		date.month++;
	}
	else if (date.day == 31 && (date.month == 4 || date.month == 6 || date.month == 9 || date.month == 11)) {
		date.day = 1;
		date.month++;
	}
	else if (date.day == 30 && date.month == 2 && ((date.year % 4 == 0 && date.year % 100 != 0) || (date.year % 400 == 0))) {
		date.day = 1;
		date.month++;
	}
	else if (date.day == 29 && date.month == 2) {
		date.day = 1;
		date.month++;
	}
	if (date.month == 13) {
		date.month = 1;
		date.year++;
	}
	return date;
}

Date operator++(Date& date, int x) {
	Date old = date;
	++date;
	return old;
}

int main() {
	Date date;
	cin >> date.year >> date.month >> date.day;
	++date;
	cout << date << endl;
	date++;
	cout << date << endl;
	return 0;
}