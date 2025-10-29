---
layout: post
title:  논리 제어문
description: 프로그램이 의도한대로 작동하도록 하는 프로그래밍의 기본기
date: 2025-10-29
collection_id: c-cpp
order: 7
---

## I. 조건문
>조건문은 어떠한 값을 조건에 맞게 판별하여 개발자가 원하는 논리 흐름을 만들수 있게 한다. 점수를 입력해 등급을 분류하거나, 플레이어의 체력이 0이 되면 사망으로 처리되는 등, 프로그램을 이루는 다양한 논리 제어가 조건문으로 만들어진다.

#### if문
if문은 어떤 조건이 참이면 코드 블록을 실행시키는 기능을 한다. 이 문법에서 사용되는 제어문에는 if, else if, else가 있는데, 비슷하지만 각각 다른 용도로 사용된다.

```c
#include <stdio.h>

void main()
{
	int age;
	
	if (age > 35) {
		// age > 35 가 참일 때 실행
		printf("중년");
	}
	else if (age > 19) {
		// 35 >= age, age > 19 가 참일 때 실행
		printf("청년");
	}
	else {
		// 위 조건이 전부 거짓일때 실행
		printf("청소년");
	}
}
```

#### switch문
한 값에 대하여 여러 경우를 판별할 때 사용하는 문법이며, 분기문이라고도 한다.

```c
#include <stdio.h>

void main()
{
	int rank;
	
	switch (rank) {
		case 1:
			printf("최고"); // rank == 1 일때 실행
			break;
		case 2:
			printf("중간"); // rank == 2 일때 실행
			break;
		case 3:
			printf("최하"); // rank == 3 일때 실행
			break;
	}
}
```

case 키워드는 == 연산자처럼 비교할 두 대상이 일치하는지 판단한다. 일치하면 들여쓰기 된 코드 블록을 실행한다. 여기서 break 키워드를 만난다면 switch문을 탈출한다.

break가 없다면 다음 case로 넘어간다.  이러한 사용법은 범위를 묶어서 비교할 때 유용하다.

```c
#include <stdio.h>

void main()
{
	int age;

	switch (age) {
	case 1:
		printf("신생아"); // age == 1
		break;
	case 2:
	case 3:
	case 4:
		printf("유아"); // age == 2 ~ 4
		break;
	case 5:
	case 6:
	case 7:
		printf("유치원생"); // age == 5 ~ 7
		break;
	}
}
```


#### 삼항 연산자 (한줄 조건문)
if와 else로 구성되어야 하는 조건문을 if문 없이 한 줄의 연산식으로 간단하게 표현할 수 있다. 세 개의 항을 연산자로 잇기 때문에 삼항 연산자라고 하는데, A ? B : C 형식이다. 'A가 참이면 B, 거짓이면 C'로 해석된된다.

```c
#include <stdio.h>

void main()
{
	int age;

	// 대입 연산자와 삼항 연산자
	char* result = (age >= 20) ? "성인" : "미성년자";
	printf(result);

	// 삼항 연산자와 함수
	age >= 20 ? printf("성인") : printf("미성년자");
}
```

---

## II. 반복문
>반복문은 특정한 코드 블록을 일정 횟수만큼 재실행해 반복 작업을 수행하거나, 의도한 조건이 발생할때까지 끊임없이 프로그램의 일부분을 유지하기 위해 사용된다.
>여러 수를 합산하는 수학 계산, 자료 구조를 순환하며 어떤 조건에 부합하는 값을 찾는 탐색 알고리즘, 프로그램이 종료되지 않고 실행 상태를 유지하기 위한 시스템 루프 등은 반복문을 베이스로 하는 알고리즘의 예시이다.

####  while문
어떤 조건이 참일 때 코드 블록을 반복하는 간단한 형태의 반복문이다. 사전에 반복 횟수가 정해져있지 않거나, 종료 조건이 사용자 의도에 달린 경우 이 문법을 사용한다.

```c
#include <stdio.h>

void main()
{
	// 정해진 반복 횟수가 없을 때
	int num;
	while (num > 0)
	{
		printf("num은 양수");
		num--;
	}

	// 시스템 루프를 유지할 때
	char command[16];
	int keepSystem = 1;
	while (keepSystem)
	{
		// 시스템 루프

		// 종료 조건
		if (command == "quit") {
			keepSystem = 0;
		}
	}
}
```

#### for문
선언, 조건, 증감으로 구성되어 좀더 복잡한 형태의 반복문이다. 주로 횟수가 정해져있을 때 사용하기 때문에 배열과 같은 여러 값이 들어있는 자료 구조의 순환에서 유용하다.

```c
#include <stdio.h>

void main()
{
	float scores[5] = { 2.6, 1.7, 4.3, 3.4, 3.9 };
	for (int i = 0; i < 5; i++) {
		// 배열의 0 인덱스부터 4 인덱스까지 값을 차례로 출력
		printf("점수: %f\n", scores[i]);
	}
}

```

또는 범위가 있는 수열의 합산에도 활용할 수 있다.
```c
void main()
{
	int total = 0;
	for (int i = 1; i <= 100; i++) {
		// 1부터 100까지의 수를 합함
		total += i;
	}
}
```

#### continue와 break
이 두 제어문은 반복문의 흐름을 직접 제어해야 하는 코드를 작성할 때 사용된다. 
- continue: 반복문을 유지하되 특정 조건에서 아래 코드를 더이상 실행하지 않고 다음 회차로 건너뛸 때 사용
- break: 특정 조건에서 반복문을 탈출할 때 사용

이 두 제어문은 조건문과 함께 사용된다.

```c
#include <stdio.h>

void main()
{
	// while문에서의 흐름 제어
	char command[32];
	while (1) {
		
		// 반복 내용

		if (command == 'skip') {
			continue; // 반복문의 첫 줄로 복귀
		}

		if (command == 'quit') {
			break;    // 반복문 탈출
		}
	}

	// for문에서의 흐름 제어
	int total = 0;
	for (int i = 1; i <= 100; i++) {
		// 홀수만 더하고, 짝수는 더하지 않음
		if (i % 2 == 0) {
			continue;
		}
		total += i;
	}
}
```


