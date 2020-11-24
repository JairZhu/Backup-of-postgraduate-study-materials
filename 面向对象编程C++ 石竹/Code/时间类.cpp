#include <iostream>
using namespace std;

class myTime {
public:
	int hour, minute, second;
	bool negative;
	myTime():hour(0), minute(0), second(0), negative(false){}
	myTime(int h, int m, int s){
		minute = m;
		second = s;
		if (h < 0) {
			hour = abs(h);
			negative = true;
		}
		else {
			hour = h;
			negative = false;
		}
	}
	myTime operator+(const myTime&) const;
	myTime operator-(const myTime&) const;
};

myTime myTime::operator+(const myTime& time) const {

}