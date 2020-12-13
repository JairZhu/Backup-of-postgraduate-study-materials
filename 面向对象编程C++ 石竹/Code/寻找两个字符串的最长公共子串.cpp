#include <iostream>
#include <string>
//#include <math.h>
using namespace std;


int main()
{
    string x1, x2;
    cin >> x1 >> x2;
    string minString = x1, maxString = x2;
    if (x1.length() > x2.length()) {
        maxString = x1;
        minString = x2;
    }
    for (int i = 0; i < minString.length(); ++i) {
        for (int start = 0, end = minString.length() - i; end <= minString.length(); start++, end++) {
            string sub = minString.substr(start, end - start);
            if (maxString.find(sub) != -1) {
                cout << sub;
                return 1;
            }
        }
    }
    cout << "No match";
    return 0;
}


