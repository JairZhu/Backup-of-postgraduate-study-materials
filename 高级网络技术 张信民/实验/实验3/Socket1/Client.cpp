#include <iostream>
#include <WinSock2.h>
#include <process.h>
#pragma comment(lib, "WS2_32.lib")
using namespace std;

constexpr auto ServerIP = "127.0.0.1";
constexpr auto ServerPort = 10086;
constexpr auto MAX_BUFF = 60;

SOCKET socketClient;
char sendBuffer[MAX_BUFF];
bool isConnect, isSend = false;
CRITICAL_SECTION criticalSection;

// 接收数据线程
DWORD __stdcall receiveDataThread(void* param) {
	int res;
	char receiveBuffer[MAX_BUFF];
	memset(receiveBuffer, 0, MAX_BUFF);
	while (isConnect) {
		res = recv(socketClient, receiveBuffer, MAX_BUFF, 0);
		if (res > 0) {
			cout << receiveBuffer << endl;
		}
		else if (0 == res) {
			isConnect = false;
			isSend = false;
			memset(receiveBuffer, 0, MAX_BUFF);
			cerr << "服务器关闭了连接！" << endl;
			return 0;
		}
		else if (SOCKET_ERROR == res) {
			if (WSAEWOULDBLOCK == WSAGetLastError()) {
				continue;
			}
			else {
				isConnect = false;
				cerr << "接收缓冲区不可用！" << endl;
				return 0;
			}
		}
	}
	return 0;
}

// 发送数据线程
DWORD __stdcall SendDataThread(void* param) {
	while (isConnect) {
		if (isSend) {
			EnterCriticalSection(&criticalSection);
			while (true) {
				int res = send(socketClient, sendBuffer, MAX_BUFF, 0);
				if (SOCKET_ERROR == res) {
					if (WSAEWOULDBLOCK == WSAGetLastError()) {
						continue;
					}
					else {
						LeaveCriticalSection(&criticalSection);
						cerr << "发送缓冲区不可用！" << endl;
						return 0;
					}
				}
				isSend = false;
				break;
			}
			LeaveCriticalSection(&criticalSection);
		}
	}
	return 0;
}

int main() {
	// 初始化全局变量
	InitializeCriticalSection(&criticalSection);
	socketClient = INVALID_SOCKET;
	isConnect = false;
	memset(sendBuffer, 0, MAX_BUFF);

	// 创建套接字
	int res;
	WSADATA wsData;
	res = WSAStartup(MAKEWORD(2, 2), &wsData); // 初始化 Windows Sockets Dll
	socketClient = socket(AF_INET, SOCK_STREAM, 0);
	if (INVALID_SOCKET == socketClient) {
		cerr << "套接字创建失败！" << endl;
		return -1;
	}
	unsigned long ul = 1;
	res = ioctlsocket(socketClient, FIONBIO, (unsigned long*)&ul);
	if (SOCKET_ERROR == res) {
		cerr << "设置套接字非阻塞模式失败！" << endl;
		return -1;
	}

	// 连接服务器
	sockaddr_in serverAddress;
	serverAddress.sin_family = AF_INET;
	serverAddress.sin_port = htons(ServerPort);
	serverAddress.sin_addr.S_un.S_addr = inet_addr(ServerIP);
	while (true) {
		res = connect(socketClient, (sockaddr*)&serverAddress, sizeof(serverAddress));
		if (0 == res) {
			break;
		}
		if (SOCKET_ERROR == res) {
			int errorCode = WSAGetLastError();
			if (WSAEWOULDBLOCK == errorCode || WSAEINVAL == errorCode) {
				continue;
			}
			else if (WSAEISCONN == errorCode) {
				break;
			}
			else {
				cerr << "连接服务器失败！" << endl;
				return -1;
			}
		}
	}
	cerr << "成功连接服务器！" << endl;
	isConnect = true;

	// 创建接收和发送线程
	unsigned long theadID;
	HANDLE threadReceive = CreateThread(nullptr, 0, receiveDataThread, nullptr, 0, &theadID);
	if (nullptr == threadReceive) {
		cerr << "创建接收线程失败！" << endl;
		return -1;
	}
	HANDLE threadSend = CreateThread(nullptr, 0, SendDataThread, nullptr, 0, &theadID);
	if (nullptr == threadSend) {
		cerr << "创建发送线程失败！" << endl;
		return -1;
	}

	// 等待用户的输入
	char inputBuffer[MAX_BUFF];
	while (isConnect) {
		memset(inputBuffer, 0, MAX_BUFF);
		cin.getline(sendBuffer, MAX_BUFF);
		EnterCriticalSection(&criticalSection);
		memcpy(sendBuffer, inputBuffer, strlen(inputBuffer));
		LeaveCriticalSection(&criticalSection);
		isSend = true;
		cin.sync();
	}

	return 0;
}

