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

// ���������߳�
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
			cerr << "�������ر������ӣ�" << endl;
			return 0;
		}
		else if (SOCKET_ERROR == res) {
			if (WSAEWOULDBLOCK == WSAGetLastError()) {
				continue;
			}
			else {
				isConnect = false;
				cerr << "���ջ����������ã�" << endl;
				return 0;
			}
		}
	}
	return 0;
}

// ���������߳�
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
						cerr << "���ͻ����������ã�" << endl;
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
	// ��ʼ��ȫ�ֱ���
	InitializeCriticalSection(&criticalSection);
	socketClient = INVALID_SOCKET;
	isConnect = false;
	memset(sendBuffer, 0, MAX_BUFF);

	// �����׽���
	int res;
	WSADATA wsData;
	res = WSAStartup(MAKEWORD(2, 2), &wsData); // ��ʼ�� Windows Sockets Dll
	socketClient = socket(AF_INET, SOCK_STREAM, 0);
	if (INVALID_SOCKET == socketClient) {
		cerr << "�׽��ִ���ʧ�ܣ�" << endl;
		return -1;
	}
	unsigned long ul = 1;
	res = ioctlsocket(socketClient, FIONBIO, (unsigned long*)&ul);
	if (SOCKET_ERROR == res) {
		cerr << "�����׽��ַ�����ģʽʧ�ܣ�" << endl;
		return -1;
	}

	// ���ӷ�����
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
				cerr << "���ӷ�����ʧ�ܣ�" << endl;
				return -1;
			}
		}
	}
	cerr << "�ɹ����ӷ�������" << endl;
	isConnect = true;

	// �������պͷ����߳�
	unsigned long theadID;
	HANDLE threadReceive = CreateThread(nullptr, 0, receiveDataThread, nullptr, 0, &theadID);
	if (nullptr == threadReceive) {
		cerr << "���������߳�ʧ�ܣ�" << endl;
		return -1;
	}
	HANDLE threadSend = CreateThread(nullptr, 0, SendDataThread, nullptr, 0, &theadID);
	if (nullptr == threadSend) {
		cerr << "���������߳�ʧ�ܣ�" << endl;
		return -1;
	}

	// �ȴ��û�������
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

