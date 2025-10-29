---
layout: post
title: 입출력
description: 프로그램의 처리 결과를 콘솔에 출력하거나, 파일에 작성해 저장하기
date: 2025-10-29
collection_id: c-cpp
order: 6
---

## I. 표준 입출력(콘솔)
 >C언어 기본 라이브러리인 Standard Input/Output에서는 콘솔창에 문자열을 출력할 수 있는 printf 함수와, 콘솔창으로부터 입력을 받는 scanf 함수를 제공한다.

#### printf
printf는 다음과 같이 사용한다.

```c
#include <stdio.h> // Standard Input/Output 헤더 포함

void main()
{
	// 문자열 출력
	printf("Hello World");

	// 포맷 지정 문자열 출력
	int a = 10;
	printf("%d", a);
}
```

인수에 직접 문자열을 작성하거나, 포맷 지정자와 변수를 전달함으로서 원하는 값을 문자열에 포함시킬 수도 있다. 입출력에서 주로 사용되는 포맷 지정자들은 다음과 같다.

|타입|포맷 지정자|설명|
|-|-|-|
|int|%d, %i|부호 있는 정수
|unsigned int|%u|부호 없는 정수
|char|%c|문자
|char[]|%s|문자열
|float|%f|실수
|double|%lf|실수

#### scanf
콘솔로부터 입력을 받을 때는 항상 포맷 지정자를 통해 입력을 받아와야 한다.그리고 입력값을 저장할 변수도 필요하다. 

문자열을 입력받는 경우,  문자열 길이를 예상하고 이에 맞게 배열로 충분한 공간을 마련해야 한다. 이것을 '버퍼'라고 부른다.

```c
#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>

void main()
{
	char input[128];     // 버퍼
	scanf("%s", input);  // 문자열 입력
}
```

scanf에서 포맷 지정자를 사용할때는 두번째 인수로 변수가 아닌 포인터를 전달해야 한다. 배열은 변수 이름 자체가 포인터이므로 이름만 전달하면 되지만, 일반 변수의 경우 & 연산자를 앞에 붙여야 한다.

```c
#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>

void main()
{
	int input;
	scanf("%d", &input);
}
```

*보안 경고 무시 *
>`#define _CRT_SECURE_NO_WARNINGS` 는 입력 관련 보안 경고를 무시하겠다는 전처리 명령이다. scanf_s()를 사용하면 이 경고가 발생하지 않지만, visual studio 에서만 사용되기에 범용적인 문법이 아니다.

---

## II. 파일 입출력
>Standard Input/Output 라이브러리는 파일 입출력 기능도 제공하고 있다. 파일 입출력은 텍스트 파일 입출력과 이진 파일 입출력으로 나눌 수 있으며, 각각 용도가 다르므로 다루고자 하는 데이터의 유형을 중심으로 알맞은 기능을 선택해야 한다.

#### 파일 포인터
파일 입출력을 하려면 먼저 파일 포인터를 생성해야 하는데, 파일 포인터란 파일의 상태, 입출력 위치 등을 관리하는 구조체를 가리키는 포인터이다. fopen 함수는 이 구조체를 새로 생성하여 힙 메모리에 할당하는 작업을 하며, 파일이 정상적으로 열리면 그 주소값을 반환한다.

```c
#include <stdio.h>

void main()
{
	FILE* fp = fopen("fileio.txt", "w");
	if (fp == NULL) {
		printf("파일 열기 실패");
		return;
	}

	fclose(fp);
}
```

fopen 함수에 인수로 전달하는 것은 파일명과 모드이다. 파일명은 경로를 포함할 수 있고 확장자는 반드시 필요하다.
모드는 파일을 어떤 목적으로 열 것인지 명시하는 것인데, 크게는 읽기 모드와 쓰기 모드로 분류가 가능하다.
- 읽기: 해당 파일의 내용을 메모리로 읽어 변수에 저장한다.
- 쓰기: 변수에 있는 값을 해당 파일에 출력한다. 파일이 없으면 해당 이름의 파일을 새로 생성한다.

모드를 명시하기 위해 전달하는 문자열은 다음과 같은 것들이 있다.

|모드|설명|파일이 없을 때|기존 내용|쓰기 위치|읽기 위치|
|-|-|-|-|-|-|
|r|읽기 전용|오류 발생|유지|불가|처음부터|
|w|쓰기 전용|새로 생성|삭제|처음부터|불가|
|a|추가 전용|새로 생성|유지|끝에 추가|불가|
|r+|읽기/쓰기|오류 발생|유지|처음부터|처음부터|
|w+|읽기/쓰기|새로 생성|삭제|처음부터|처음부터|
|a+|읽기/추가|새로 생성|유지|끝에 추가|처음부터|

파일 포인터를 더이상 사용하지 않게 되면 반드시 fclose 함수를 호출해야 한다.



#### 텍스트 파일 입출력
텍스트 파일 출력 예제이다. 문자열만 출력하는 fputs, 포맷 지정자로 값을 출력하는 fprintf가 있다.

```c
#include <stdio.h>

void main()
{
	FILE* fp = fopen("fileio.txt", "w"); // 쓰기 모드 명시
	if (fp == NULL) {
		printf("파일 열기 실패");
		return;
	}
	// 문자열만 출력
	fputs("Hello World\n", fp);
	// 포맷 지정 출력
	int a = 100;
	fprintf(fp, "%d", a);

	fclose(fp);
}
```

파일을 읽을 땐 문자열 전용 fgets, 포맷 지정 fscanf 함수를 사용할 수 있다.
먼저 입력할 내용을 파일에 작성한다.

파일 포인터는 파일을 읽을 때 내용의 한 줄씩 커서를 이동해가며 읽는다. 따라서 내용이 네 줄이면 함수를 네번 호출해야 한다.

```c
void main()
{
	FILE* fp = fopen("fileio.txt", "r");
	if (fp == NULL) {
		printf("파일 열기 실패");
		return;
	}

	char buffer[256] = { 0, };
	// buffer에 "입력할 문자열 1" 저장
	fgets(buffer, sizeof(buffer), fp);
	// buffer에 "입력할 문자열 2" 저장
	fgets(buffer, sizeof(buffer), fp);
	// buffer에 "100" 저장
	fgets(buffer, sizeof(buffer), fp);
	// buffer에 "4.2341213" 저장
	fgets(buffer, sizeof(buffer), fp);
}
```

마지막 두 내용은 정수형, 실수형으로 읽을 수 있다. 이를 위해 포맷 지정이 가능한 fscanf 함수를 사용한다. 이 함수는 scanf와 마찬가지로 보안 경고를  일으키므로, \_CRT_SECURE_NO_WARNINGS 전처리를 정의한다.

```c
#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>

void main()
{
	FILE* fp = fopen("fileio.txt", "r");
	if (fp == NULL) {
		printf("파일 열기 실패");
		return;
	}

	char buffer[256] = { 0, };
	int ibuffer = 0;
	float fbuffer = 0;

	fgets(buffer, sizeof(buffer), fp);
	fgets(buffer, sizeof(buffer), fp);
	// ibuffer 변수에 100 저장
	fscanf(fp, "%d", &ibuffer);
	// fbuffer 변수에 4.2341213 저장
	fscanf(fp, "%f", &fbuffer);
}
```

#### 이진 파일 입출력
이진 파일 입출력은 굳이 텍스트의 형태로 출력할 필요가 없는, 컴퓨터만 알아볼 수 있는 데이터에 대해서 사용한다. 자료형을 거쳐 비트 해석의 과정이 생략되기 때문에 읽거나 쓰는 속도는 텍스트 파일에 비해 매우 빠르다.
또한 사용자 지정 자료형도 멤버를 일일이 입출력할 필요 없이 크기만 맞다면 변수 통째로 입출력이 가능하다는 장점도 있다.

|모드|설명|파일이 없을 때|기존 내용|쓰기 위치|읽기 위치|
|-|-|-|-|-|-|
|rb|읽기 전용|오류 발생|유지|불가|처음부터|
|wb|쓰기 전용|새로 생성|삭제|처음부터|불가|
|ab|추가 전용|새로 생성|유지|끝에 추가|불가|
|rb+|읽기/쓰기|오류 발생|유지|처음부터|처음부터|
|wb+|읽기/쓰기|새로 생성|삭제|처음부터|처음부터|
|ab+|읽기/추가|새로 생성|유지|끝에 추가|처음부터|

먼저 이진파일 입출력으로 사용할 구조체를 하나 만들고 선언해보자.

```c
#include <stdio.h>

struct Credit {
	char name[64];
	int code;
	float score;
};

void main()
{
	struct Credit credit = {"English", 100, 4.5};
}
```

이제 이 구조체의 데이터를 이진 파일로 출력해보자. fwrite 함수를 호춣하고 출력할 변수의 포인터, 자료형의 크기, 요소 갯수, 파일 포인터를 넘겨준다.

```c
#include <stdio.h>

struct Credit {
	char name[64];
	int code;
	float score;
};

void main()
{
	struct Credit credit = {"English", 100, 4.5};

	FILE* fp = fopen("fileio.bin", "wb"); // 이진 쓰기 모드
	if (fp == NULL) {
		printf("파일 열기 실패");
		return;
	}
	// credit 변수의 값을 이진 형식으로 출력
	fwrite(&credit, sizeof(struct Credit), 1, fp);

	fclose(fp);
}
```

출력된 이진 파일은 사람이 읽을 수 없다.

이제 이 파일을 읽어오자. 이진 파일을 읽어오기 위해선 정확한 입력을 위해 자료형 크기를 미리 알고있어야한다. 그래서 개발자들은 자료 구조마다 다른 확장자를 사용해 크기를 미리 구분한다.

```c
#include <stdio.h>

struct Credit {
	char name[64];
	int code;
	float score;
};

void main()
{
	struct Credit credit;

	FILE* fp = fopen("fileio.bin", "rb"); // 이진 읽기 모드
	if (fp == NULL) {
		printf("파일 열기 실패");
		return;
	}
	// 이진 형식의 데이터를 credit 변수에 입력력
	fread(&credit, sizeof(struct Credit), 1, fp);

	fclose(fp);
}
```

*이진 파일 입출력을 왜 사용할까?*
프로그램은 이미지, 3D모델링, 음원 등 매우 다양한 형태의 데이터를 처리하기 때문에 이진 파일 입출력은 필수적인 기능이다. 또한 수백 메가바이트에 달하는 대량의 데이터를 다룰 때도 이진 파일 입출력은 매우 빠른 속도를 자랑한다.
