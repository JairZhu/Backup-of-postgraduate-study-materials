#include <iostream>
#include <map>
#include <string>
#include <WinSock2.h>
#include <process.h>
#pragma comment(lib, "ws2_32.lib")
using namespace std;

constexpr auto ServerPort = 10086;
constexpr auto MAX_BUFF = 64;
constexpr auto MAX_CONNECT = 10;

struct Param {
	SOCKET socket;
	sockaddr_in address;
	Param(SOCKET soc, sockaddr_in add) :socket(soc), address(add) {}
};

char writeBuffer[MAX_BUFF];
SOCKET socketServer;
CRITICAL_SECTION criticalSection;
map<SOCKET, bool> clientMap;

// 接收线程
DWORD __stdcall receiveDataThread(void* param) {
	Param* client = (Param*)param;
	int res;
	char buffer[MAX_BUFF];
	while (true) {
		memset(buffer, 0, MAX_BUFF);
		res = recv(client->socket, buffer, MAX_BUFF, 0);
		if (0 == res) {
			cerr << inet_ntoa(client->address.sin_addr) << ':' << ntohs(client->address.sin_port) << "\t断开连接！\t" << "error code: " << res << endl;
			break;
		}
		if (SOCKET_ERROR == res) {
			if (WSAEWOULDBLOCK == WSAGetLastError()) {
				continue;
			}
			else {
				cerr << inet_ntoa(client->address.sin_addr) << ':' << ntohs(client->address.sin_port) << "\t断开连接！\t" << "error code: " << WSAGetLastError() << endl;
				break;
			}
		}
		if (res > 0) {
			cout << inet_ntoa(client->address.sin_addr) << ':' << ntohs(client->address.sin_port) << "\t" << buffer << endl;
			EnterCriticalSection(&criticalSection);
			memset(writeBuffer, 0, MAX_BUFF);
			string str = inet_ntoa(client->address.sin_addr);
			str += ":";
			str += to_string((unsigned int)ntohs(client->address.sin_port));
			str += "说： ";
			str += buffer;
			memcpy(writeBuffer, str.c_str(), str.length());
			for (auto iter = clientMap.begin(); iter != clientMap.end(); ++iter) {
				if (iter->first != client->socket) {
					iter->second = true;
				}
			}
			LeaveCriticalSection(&criticalSection);
			memset(buffer, 0, MAX_BUFF);
		}
	}
	return 0;
}

// 发送线程
DWORD __stdcall sendDataThread(void* param) {
	Param* client = (Param*)param;
	while (true) {
		EnterCriticalSection(&criticalSection);
		if (clientMap[client->socket]) {
			int res = send(client->socket, writeBuffer, strlen(writeBuffer), 0);
			if (SOCKET_ERROR == res) {
				if (WSAEWOULDBLOCK == WSAGetLastError()) {
					continue;
				}
				else {
					cerr << inet_ntoa(client->address.sin_addr) << ':' << ntohs(client->address.sin_port) << "\t断开连接！" << endl
						<< "error code: " << WSAGetLastError() << endl;
					LeaveCriticalSection(&criticalSection);
					break;
				}
			}
			clientMap[client->socket] = false;
		}
		LeaveCriticalSection(&criticalSection);
	}
	return 0;
}

int main() {
	// 初始化全局变量
	InitializeCriticalSection(&criticalSection);
	memset(writeBuffer, 0, MAX_BUFF);
	socketServer = INVALID_SOCKET;

	// 创建非阻塞模式套接字
	int res;
	WSADATA wsData;
	res = WSAStartup(MAKEWORD(2, 2), &wsData);
	socketServer = socket(AF_INET, SOCK_STREAM, 0);
	if (INVALID_SOCKET == socketServer) {
		cerr << "套接字创建失败！" << endl;
		return -1;
	}
	unsigned long ul = 1;
	res = ioctlsocket(socketServer, FIONBIO, (unsigned long*)&ul);
	if (SOCKET_ERROR == res) {
		cerr << "设置套接字非阻塞模式失败！" << endl;
		return -1;
	}

	// 绑定IP和端口，监听客户端的连接请求
	sockaddr_in serverAddress;
	serverAddress.sin_family = AF_INET;
	serverAddress.sin_port = htons(ServerPort);
	serverAddress.sin_addr.S_un.S_addr = INADDR_ANY;
	res = bind(socketServer, (sockaddr*)&serverAddress, sizeof(serverAddress));
	if (SOCKET_ERROR == res) {
		cerr << "套接字绑定失败！" << endl;
		return -1;
	}
	res = listen(socketServer, MAX_CONNECT);
	if (SOCKET_ERROR == res) {
		cerr << "监听套接字失败！" << endl;
		return -1;
	}

	// 接受客户端的连接
	SOCKET socketAccept;
	sockaddr_in clientAddress;
	while (true) {
		memset(&clientAddress, 0, sizeof(sockaddr_in));
		int sockaddr_in_len = sizeof(sockaddr_in);
		socketAccept = accept(socketServer, (sockaddr*)&clientAddress, &sockaddr_in_len);
		if (INVALID_SOCKET == socketAccept) {
			if (WSAEWOULDBLOCK == WSAGetLastError()) {
				Sleep(500);
				continue;
			}
			else {
				cerr << "接受客户端的连接失败！" << endl;
				cerr << "error code: " << WSAGetLastError() << endl;
				break;
			}
		}
		else {
			cout << "连接客户端：" << inet_ntoa(clientAddress.sin_addr) << ":" << ntohs(clientAddress.sin_port) << endl;
			unsigned long ul;
			clientMap[socketAccept] = false;
			HANDLE receiveThread = CreateThread(nullptr, 0, receiveDataThread, new Param(socketAccept, clientAddress), 0, &ul);
			if (nullptr == receiveThread) {
				cerr << "接收数据线程创建失败！" << endl;
				break;
			}
			HANDLE sendThread = CreateThread(nullptr, 0, sendDataThread, new Param(socketAccept, clientAddress), 0, &ul);
			if (nullptr == sendThread) {
				cerr << "发送数据线程创建失败！" << endl;
				break;
			}
		}
	}
	return 0;
}