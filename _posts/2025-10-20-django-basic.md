---
layout: post
title: Django 베이직
description: 웹 애플리케이션 프레임워크 Django
date: 2025-10-20
---
>Django는 파이썬으로 웹 애플리케이션을 개발할 수 있는 프레임워크이다.
https://youtu.be/3EzKBFc9_MQ?si=wgxWeEccNuWpiSEB

---

## I. Django 프로젝트 시작

가상 환경을 만들고 다음 pip 설치 명령을 터미널에 입력한다.

```
pip install Django
```

Django 개발에 필요한 패키지들이 설치된다. 이제 프로젝트를 생성한 경로 안에 다음 명령을 실행하면 된다.

```
django-admin startproject myproject
```

그러면 다음과 같은 폴더 구조가 만들어진다.

```
/ --- myproject
	+ --- myproject
		+ --- __init__.py
		+ --- asgi.py
		+ --- settings.py
		+ --- urls.py
		+ --- wsgi.py
		  
	+ --- manage.py
```

각 파일들의 역할은 다음과 같다.

| **파일명**           | **역할**            | **간단 설명**                                                                                                          |
| ----------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------ |
| **`__init__.py`** | **Python 패키지 인식** | 이 디렉토리가 Python 패키지임을 알려줌.                                                                                          |
| **`settings.py`** | **프로젝트 설정**       | Django 프로젝트의 **모든 구성**을 담고 있는 핵심 파일. 데이터베이스 연결, 애플리케이션 등록(`INSTALLED_APPS`), 미들웨어, 템플릿 경로, 정적 파일 경로 등을 설정.         |
| **`urls.py`**     | **URL 라우팅**       | URL과 뷰 함수(요청 처리 로직)를 연결하는 **URL 라우터.** 사용자가 요청한 주소에 따라 어떤 코드를 실행할지 결정.                                             |
| **`asgi.py`**     | **비동기 서버 설정**     | **ASGI(Asynchronous Server Gateway Interface)** 호환 웹 서버에서 프로젝트를 실행하기 위한 진입점. 주로 **WebSocket** 같은 비동기 통신을 사용할 때 사용. |
| **`wsgi.py`**     | **동기 서버 설정**      | **WSGI(Web Server Gateway Interface)** 호환 웹 서버(Gunicorn 등)에서 프로젝트를 실행하기 위한 진입점. 대부분의 **동기식** 웹 서비스 배포에 사용.         |
| manage.py         | **명령줄 유틸리티**      | 프로젝트를 개발하고 관리하는 데 필요한 모든 관리 작업을 수행하는 명령어 실행기                                                                       |

---

## II. Django 애플리케이션 생성

Django 프로젝트 안에서는 이제 여러 웹 애플리케이션을 제작하고 프로젝트에 등록할 수 있다.
프로젝트에 애플리케이션을 생성하려면 터미널에서 프로젝트 디렉터리로 이동 후 다음 명령을 입력한다.

```
python manage.py startapp myapp
```

그러면 프로젝트 디렉터리에 새 폴더가 생성된다.

```
/ --- myproject
	+ --- myproject
		+ --- __init__.py
		+ --- asgi.py
		+ --- settings.py
		+ --- urls.py
		+ --- wsgi.py

	+ --- myapp                    <
		+ --- migrations           <
		    + --- __init__.py      <
		+ --- __init__.py          <
		+ --- admin.py             <
		+ --- apps.py              <
		+ --- models.py            <
		+ --- tests.py             <
		+ --- views.py             < 
	
	+ --- db.sqlite3               <
	+ --- manage.py
```

이때 앱을 구성하는 파이썬 파일들의 역할은 다음과 같다.

| **파일/디렉토리**           | **역할**            | **간단 설명**                                                                                |
| --------------------- | ----------------- | ---------------------------------------------------------------------------------------- |
| **`__init__.py`**     | **Python 패키지 인식** | 해당 디렉토리가 Python 패키지임을 나타냄.                                                               |
| **`admin.py`**        | **관리자 사이트 설정**    | Django의 내장 **관리자 사이트**에 앱의 모델(데이터 구조)을 등록하고 표시 방식을 설정.                                   |
| **`apps.py`**         | **앱 설정**          | 앱의 이름과 설정 등을 정의하는 파일. 앱을 프로젝트에 등록할 때 사용.                                                 |
| **`models.py`**       | **데이터베이스 모델 정의**  | 앱에서 사용할 **데이터 구조** (테이블 스키마)를 정의하는 핵심 파일. Django의 ORM(Object-Relational Mapping)을 사용합니다. |
| **`tests.py`**        | **테스트 코드**        | 앱의 기능을 검증하기 위한 **자동화된 테스트 코드**를 작성하는 파일.                                                 |
| **`views.py`**        | **로직 처리 (뷰)**     | 사용자의 요청(Request)을 받아 처리하고 응답(Response)을 반환하는 **핵심 로직**을 작성하는 파일. 데이터베이스 모델과 상호작용.        |
| **`migrations` 디렉토리** | **데이터베이스 변경 관리**  | `models.py`에 변경 사항이 생겼을 때, 이를 데이터베이스에 적용하기 위한 **마이그레이션 파일**들이 저장되는 곳.                    |

또한 Django의 기본 데이터베이스 엔진이 SQLite3 이기떄문에, 기본 DB파일이 함께 생성된다.

#### 앱 등록
앱을 생성하고 나서, 프로젝트의 settings.py 파일의 INSTALLED_APPS 배열에 다음 리터럴을 추가해야 한다.

```python
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    'myapp.apps.MyappConfig' # <--- 이 내용 추가
]
```

이것은 방금 만든 앱의 기본 정보를 담고있는 클래스의 경로이다.(myapp/apps.py 의 `MyappConfig` 클래스)
#### URL 라우팅 설정
url 라우팅은 기본적으로 프로젝트 폴더의 urls.py 안에 작성이 된다.
하지만 프로젝트를 개발하다보면 그 규모가 점점 커지고 애플리케이션이 많이질 것이므로, 각 앱마다 URL 라우팅을 개별 설정 후 프로젝트 폴더의 urls.py에 모조리 incude 해주면 관리가 용이할것이다.

이를 위해 방금 만든 앱 폴더에 urls.py 파일을 새로 만든다.

```
/ --- myproject
	+ --- myproject
		+ --- __init__.py
		+ --- asgi.py
		+ --- settings.py
		+ --- urls.py
		+ --- wsgi.py

	+ --- myapp
		+ --- migrations
		    + --- __init__.py
		+ --- __init__.py
		+ --- admin.py
		+ --- apps.py
		+ --- models.py
		+ --- tests.py
		+ --- views.py
		+ --- urls.py                 <
	
	+ --- db.sqlite3
	+ --- manage.py
```

그리고 **views.py**에는 다음과 같이 기본적인 요청 함수를 하나 만든다.

```python
from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def index(request):
    return HttpResponse('My App')
```

이제 **myapp/urls.py**에서 요청에 대한 응답인 `index()` 함수를 URL과 연결지어줄 것이다.

```python
from django.urls import path
import views # 요청 응답 함수가 들어있는 소스파일
  
urlpatterns = [
    path('', views.index)

]
```

그리고 이 URL 라우팅을 **myproject/urls.py** 에서 include 한다.

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path('', include('myapp.urls')) # include

]
```


이런식으로 구축되어있던 URL 라우팅을
![[Pasted image 20251021004133.png]]
이런식으로 바꿔서  url 관리를 용이하게 하는 것이다. 
![[Pasted image 20251021004159.png]]

---

## III. Django DB 구축
애플리케이션 폴더의 models.py 에 파이썬 클래스 문법으로 데이터 구조를 정의할 수 있다.

```python
from django.db import models

# Create your models here.
class Student(models.Model):
    name = models.CharField(max_length=64)
    age = models.IntegerField(max_length=64)
    student_id = models.IntegerField()

class Subject(models.Model):
    name = models.CharField(max_length=64)
    professor = models.CharField(max_length=64)
    classroom = models.IntegerField()
```

그리고 터미널에 다음 명령을 입력한다.
```
python manage.py makemigrations
```

그러면 마이그레이션을 만든 순서대로 넘버링된 파이썬 파일이 생성되고, 거기에는 작성한 모델에 맞게 DB를 설계하도록 파이썬 명령이 자동 작성된다.

그리고 `migrate` 명령을 실행하면 최종적으로 프로젝트의 db.splite3 파일에 DB가 작성된다.
```
python manage.py migrate
```

---

## IV. DB에 레코드 추가

