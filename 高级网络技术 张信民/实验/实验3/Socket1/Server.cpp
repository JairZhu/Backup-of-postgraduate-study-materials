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

// �����߳�
DWORD __stdcall receiveDataThread(void* param) {
	Param* client = (Param*)param;
	int res;
	char buffer[MAX_BUFF];
	while (true) {
		memset(buffer, 0, MAX_BUFF);
		res = recv(client->socket, buffer, MAX_BUFF, 0);
		if (0 == res) {
			cerr << inet_ntoa(client->address.sin_addr) << ':' << ntohs(client->address.sin_port) << "\t�Ͽ����ӣ�\t" << "error code: " << res << endl;
			break;
		}
		if (SOCKET_ERROR == res) {
			if (WSAEWOULDBLOCK == WSAGetLastError()) {
				continue;
			}
			else {
				cerr << inet_ntoa(client->address.sin_addr) << ':' << ntohs(client->address.sin_port) << "\t�Ͽ����ӣ�\t" << "error code: " << WSAGetLastError() << endl;
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
			str += "˵�� ";
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

// �����߳�
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
					cerr << inet_ntoa(client->address.sin_addr) << ':' << ntohs(client->address.sin_port) << "\t�Ͽ����ӣ�" << endl
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
	// ��ʼ��ȫ�ֱ���
	InitializeCriticalSection(&criticalSection);
	memset(writeBuffer, 0, MAX_BUFF);
	socketServer = INVALID_SOCKET;

	// ����������ģʽ�׽���
	int res;
	WSADATA wsData;
	res = WSAStartup(MAKEWORD(2, 2), &wsData);
	socketServer = socket(AF_INET, SOCK_STREAM, 0);
	if (INVALID_SOCKET == socketServer) {
		cerr << "�׽��ִ���ʧ�ܣ�" << endl;
		return -1;
	}
	unsigned long ul = 1;
	res = ioctlsocket(socketServer, FIONBIO, (unsigned long*)&ul);
	if (SOCKET_ERROR == res) {
		cerr << "�����׽��ַ�����ģʽʧ�ܣ�" << endl;
		return -1;
	}

	// ��IP�Ͷ˿ڣ������ͻ��˵���������
	sockaddr_in serverAddress;
	serverAddress.sin_family = AF_INET;
	serverAddress.sin_port = htons(ServerPort);
	serverAddress.sin_addr.S_un.S_addr = INADDR_ANY;
	res = bind(socketServer, (sockaddr*)&serverAddress, sizeof(serverAddress));
	if (SOCKET_ERROR == res) {
		cerr << "�׽��ְ�ʧ�ܣ�" << endl;
		return -1;
	}
	res = listen(socketServer, MAX_CONNECT);
	if (SOCKET_ERROR == res) {
		cerr << "�����׽���ʧ�ܣ�" << endl;
		return -1;
	}

	// ���ܿͻ��˵�����
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
				cerr << "���ܿͻ��˵�����ʧ�ܣ�" << endl;
				cerr << "error code: " << WSAGetLastError() << endl;
				break;
			}
		}
		else {
			cout << "���ӿͻ��ˣ�" << inet_ntoa(clientAddress.sin_addr) << ":" << ntohs(clientAddress.sin_port) << endl;
			unsigned long ul;
			clientMap[socketAccept] = false;
			HANDLE receiveThread = CreateThread(nullptr, 0, receiveDataThread, new Param(socketAccept, clientAddress), 0, &ul);
			if (nullptr == receiveThread) {
				cerr << "���������̴߳���ʧ�ܣ�" << endl;
				break;
			}
			HANDLE sendThread = CreateThread(nullptr, 0, sendDataThread, new Param(socketAccept, clientAddress), 0, &ul);
			if (nullptr == sendThread) {
				cerr << "���������̴߳���ʧ�ܣ�" << endl;
				break;
			}
		}
	}
	return 0;
}