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
| **__init__.py** | **Python 패키지 인식** | 이 디렉토리가 Python 패키지임을 알려줌.                                                                                          |
| **settings.py** | **프로젝트 설정**       | Django 프로젝트의 **모든 구성**을 담고 있는 핵심 파일. 데이터베이스 연결, 애플리케이션 등록(`INSTALLED_APPS`), 미들웨어, 템플릿 경로, 정적 파일 경로 등을 설정.         |
| **urls.py**     | **URL 라우팅**       | URL과 뷰 함수(요청 처리 로직)를 연결하는 **URL 라우터.** 사용자가 요청한 주소에 따라 어떤 코드를 실행할지 결정.                                             |
| **asgi.py**     | **비동기 서버 설정**     | **ASGI(Asynchronous Server Gateway Interface)** 호환 웹 서버에서 프로젝트를 실행하기 위한 진입점. 주로 **WebSocket** 같은 비동기 통신을 사용할 때 사용. |
| **wsgi.py**     | **동기 서버 설정**      | **WSGI(Web Server Gateway Interface)** 호환 웹 서버(Gunicorn 등)에서 프로젝트를 실행하기 위한 진입점. 대부분의 **동기식** 웹 서비스 배포에 사용.         |
| **manage.py**         | **명령줄 유틸리티**      | 프로젝트를 개발하고 관리하는 데 필요한 모든 관리 작업을 수행하는 명령어 실행기                                                                       |

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
| **__init__.py**     | **Python 패키지 인식** | 해당 디렉토리가 Python 패키지임을 나타냄.                                                               |
| **admin.py**        | **관리자 사이트 설정**    | Django의 내장 **관리자 사이트**에 앱의 모델(데이터 구조)을 등록하고 표시 방식을 설정.                                   |
| **apps.py**         | **앱 설정**          | 앱의 이름과 설정 등을 정의하는 파일. 앱을 프로젝트에 등록할 때 사용.                                                 |
| **models.py**       | **데이터베이스 모델 정의**  | 앱에서 사용할 **데이터 구조** (테이블 스키마)를 정의하는 핵심 파일. Django의 ORM(Object-Relational Mapping)을 사용합니다. |
| **tests.py**        | **테스트 코드**        | 앱의 기능을 검증하기 위한 **자동화된 테스트 코드**를 작성하는 파일.                                                 |
| **views.py**        | **로직 처리 (뷰)**     | 사용자의 요청(Request)을 받아 처리하고 응답(Response)을 반환하는 **핵심 로직**을 작성하는 파일. 데이터베이스 모델과 상호작용.        |
| **migrations/** | **데이터베이스 변경 관리**  | `models.py`에 변경 사항이 생겼을 때, 이를 데이터베이스에 적용하기 위한 **마이그레이션 파일**들이 저장되는 곳.                    |

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
	"myapp.apps.MyappConfig",  # 앱 등록: myapp/apps.py의 AppConfig 경로
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
![](/assets/images/django-1.png)
이런식으로 바꿔서  url 관리를 용이하게 하는 것이다. 
![](/assets/images/django-2.png)

---

## III. Django DB 구축
Django는 기존 DB엔진으로 SQLite3를 사용한다. SQLite는 MySQL과 같은 서버 기반이 아니라 로컬 파일 기반 DB이며 가볍게 사용할 목적으로 쓰는 내장형 관계 데이터베이스이다.


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

DB에 데이터를 삽입하는 방법은 두가지가 있다.
1. 파이썬 쉘
2. Django 관리자 페이지

#### 파이썬 쉘로 DB에 레코드 추가
우선 ipython이라는 쉘 프로그램을 이용하면 좋다.

```
pip install ipython
```

ipython은 터미널에서 대화형으로 파이썬 쉘을 사용할수 있도록 한다.
![alt text](/assets/images/django-11.png)

이 쉘은 코드 여러줄을 기억하기 때문에 소스 파일과 인터프리터의 장점이 있어 편리하다.

ipython 설치 후 터미널에서 다음 명령을 실행하면 된다.

```
python manage.py shell
```

```
(django) [projectpath]>python manage.py shell
9 objects imported automatically (use -v 2 for details).

Python 3.10.18 | packaged by Anaconda, Inc. | (main, Jun  5 2025, 13:08:55) [MSC v.1929 64 bit (AMD64)]
Type 'copyright', 'credits' or 'license' for more information
IPython 8.37.0 -- An enhanced Interactive Python. Type '?' for help.

In [1]:
```

이제 쉘에 소스파일을 작성하듯 하나씩 실행하면 된다.

```python
In [1]: from myapp.models import Student
In [2]: st1 = Student(name="Jason", age="26", student_id=123)
In [3]: st1
Out[3]: <Student: Student object (None)>
```

`Student` 객체(models.py에 정의한 테이블)를 하나 생성한 후 출력해본 것이다.
이때 st1을 그냥 출력했을 때 기본적으로 클래스에 대한 정보가 출력이 되는데, 이를 메서드 오버라이딩을 통해 객체가 가진 데이터를 출력하도록 바꿀 수 있다.

models.py에 정의된 Student 클래스를 수정해주면 된다.

```python
# Create your models here.
class Student(models.Model):
    name = models.CharField(max_length=64)
    age = models.IntegerField(max_length=64)
    student_id = models.IntegerField()

    def __str__(self) -> str:
        return f'ID: {self.id} Name: {self.name} Age: {self.age}' #save() 호출시 Django가 ID를 자동으로 부여함
```

오버라이드 후

```python
Out[4]: <Student: ID: None Name: Jason Age: 26>
```

이제 st1 객체의 save()를 호출해주면 이 데이터가 DB에 작성된다.
그리고 save()를 호출한 순간 Django에 의해 st1객체에 id값이 부여된다.

```python
In [3]: st1.save()
In [4]: st1
Out[4]: <Student: ID: 4 Name: Jason Age: 26>
```

DB Browser로 데이터가 잘 저장되었는지 확인할 수 있다.

![alt text](/assets/images/django-3.png)


#### Django 관리자 페이지

Django는 Django 프로젝트 관리(관리자 등록, 권한 설정, 데이터베이스 관리)를 위해 기본적인 관리자 페이지를 제공한다.

우선 처음엔 관리자 하나도 없으므로, 최상위 관리자를 하나 만들어야 한다. 

```
python manage.py createsuperuser
```

그러면 다음과 같이 username, email, password를 입력하라고 한다.

```
Username (leave blank to use 'jason'): jason
Email address: jasontreks@icloud.com
Password:
Password (again):
Superuser created successfully.
```

이제 서버를 실행하고 /admin url로 접속해 관리자 페이지로 들어간다. 

`http://127.0.0.1:8000/admin/`

![](/assets/images/django-4.png)

방금 생성한 username과 password를 입력해 로그인하면 된다.

![alt text](/assets/images/django-5.png)

이제 여기서 다른 유저를 등록하거나 권한을 관리할 수 있다.
이 페이지에 DB에 저장된 테이블을 띄울 수 있다, 그러면 관리자 페이지에서도 직접 DB에 데이터 삽입/삭제/수정이 가능해진다.


애플리케이션 폴더의 admin.py에 다음 코드 한 줄만 추가하면 된다.

```python
from django.contrib import admin
from .models import Student # 관리자 페이지에서 띄울 테이블을 임포트

# Register your models here.
admin.site.register(Student)

```

그러면 이렇게 애플리케이션 이름의 필드가 하나 생기고, 그 안에 내가 띄우도록 한 테이블이 있다.

![alt text](/assets/images/django-6.png)

테이블을 클릭하면 이렇게 DB에 저장되어있는 데이터들을 볼 수 있으며 삽입/삭제/수정 작업도 할 수 있다.

![alt text](/assets/images/django-7.png)


---

## V. MySQL 연동하기
Django는 유연하기 때문에 프로젝트의 기본 DB 엔진을 다른것으로 쉽게 바꿀 수 있다.
대표적인 서버 기반 DB인 MySQL로 Django 프로젝트의 DB를 변경해보자.

#### MySQL Server 설치 및 DB 생성
MySQL 서버 설치후 cli에 다음 명령을 실행한다.

```sql
-- DB 생성
CREATE DATABASE dbname CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- 사용자 생성 및 권한 부여
CREATE USER 'username'@'localhost' IDENTIFIED BY '123456';
GRANT ALL PRIVILEGES ON dbname.* TO 'dbname'@'localhost';
FLUSH PRIVILEGES;
```

#### settings.py 에서 설정
프로젝트 폴더의 settings.py의 DATABASE 필드를 다음과 같이 수정한다.

```python
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": "dbname",
        "USER": "username",
        "PASSWORD": "123456",
        "HOST": "localhost",
        "PORT": 3306,
        "OPTIONS": {
            "init_command": "SET sql_mode='STRICT_TRANS_TABLES'" # 오류 발생 시 MySQL은 구문 실행을 중단하고 오류를 반환
        }
    }
}
```

#### 마이그레이션

manage.py로 한번 마이그레이션 한다.

```
python manage.py makemigrations
python manage.py migrate
```

#### superuser 계정 생성

마이그레이션이 완료되면 새롭게 생성한 DB가 구축이 완료된다. 
하지만 새 데이터베이스이므로 기존의 sqlite에 저장되어있던 superuser 정보는 없다.
따라서 새 superuser 계정을 생성한다.

```
python manage.py createsuperuser
```

#### DB 확인

이제 서버를 실행하고 관리자페이지에 접속해 확인해보자.
![alt text](/assets/images/django-8.png)

MySQL 에서 역시 마찬가지로, 관리자 페이지에서 DB 데이터를 관리할 수 있다.
![alt text](/assets/images/django-9.png)

MySQL Workbench에서도 DB가 잘 구축된것을 확인할 수 있다.
![](/assets/images/django-10.png)

관리자 페이지에서 삽입한 데이터 하나를 CLI 에서 출력해보자.

```
mysql> SELECT * FROM myapp_student;
+----+-------+-----+------------+
| id | name  | age | student_id |
+----+-------+-----+------------+
|  1 | jason |  12 |        123 |
+----+-------+-----+------------+
1 row in set (0.00 sec)
```



