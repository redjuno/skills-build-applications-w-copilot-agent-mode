# OctoFit Tracker 앱 개발 세션 노트

## 개요

이 문서는 OctoFit Tracker 피트니스 앱을 처음부터 구축하기 위해 진행한 전체 세션의 프롬프트와 생성된 코드를 정리한 것입니다.  
기술 스택: **Django 4.1.7 + Django REST Framework + Djongo (MongoDB) + React (프론트엔드 예정)**

---

## 1단계: 프로젝트 구조 및 환경 설정

### 사용자 프롬프트 (요약)
> OctoFit Tracker 앱의 백엔드 프로젝트를 설정해 달라. 가상 환경 생성, 패키지 설치, Django 프로젝트 생성 등을 포함한다.

### 실행 내용

#### 1-1. 디렉터리 구조 생성
```text
octofit-tracker/
├── backend/
│   ├── venv/                  ← Python 가상 환경
│   ├── requirements.txt       ← 패키지 목록
│   └── octofit_tracker/       ← Django 프로젝트 루트
│       ├── manage.py
│       └── octofit_tracker/   ← Django 앱 디렉터리
```

#### 1-2. Python 가상 환경 생성 및 패키지 설치
```bash
python3 -m venv octofit-tracker/backend/venv
source octofit-tracker/backend/venv/bin/activate
pip install -r octofit-tracker/backend/requirements.txt
```

#### 1-3. `requirements.txt` 생성
패키지 목록:
- Django==4.1.7
- djangorestframework==3.14.0
- django-allauth==0.51.0
- django-cors-headers==4.5.0
- dj-rest-auth==2.2.6
- djongo==1.3.6
- pymongo==3.12
- sqlparse==0.2.4
- 기타 유틸리티 패키지들 (sympy, tenacity, tornado, urllib3 등)

#### 1-4. Django 프로젝트 생성
```bash
django-admin startproject octofit_tracker octofit-tracker/backend/octofit_tracker
```
> **참고**: `django-admin startproject`에서 destination 디렉터리를 명시할 때, 해당 디렉터리가 먼저 존재해야 한다.

---

## 2단계: Django 설정 (`settings.py`)

### 실행 내용

`octofit-tracker/backend/octofit_tracker/octofit_tracker/settings.py` 파일을 수정하여 다음 항목을 구성:

| 항목 | 설정 내용 |
|------|----------|
| **ALLOWED_HOSTS** | `localhost`, `127.0.0.1`, Codespace URL 동적 추가 |
| **INSTALLED_APPS** | `corsheaders`, `rest_framework`, `djongo`, `octofit_tracker` 추가 |
| **MIDDLEWARE** | `CorsMiddleware` 추가 (CommonMiddleware 위) |
| **DATABASES** | Djongo 엔진으로 MongoDB(`octofit_db`) 연결 (`mongodb://localhost:27017`) |
| **CORS** | `CORS_ALLOW_ALL_ORIGINS = True`, 모든 헤더·메서드 허용 |

### 생성된 코드 핵심
```python
import os
ALLOWED_HOSTS = ['localhost', '127.0.0.1']
if os.environ.get('CODESPACE_NAME'):
    ALLOWED_HOSTS.append(f"{os.environ.get('CODESPACE_NAME')}-8000.app.github.dev")

DATABASES = {
    'default': {
        'ENGINE': 'djongo',
        'NAME': 'octofit_db',
        'CLIENT': {
            'host': 'mongodb://localhost:27017',
        },
    }
}
```

---

## 3단계: 모델 정의 (`models.py`)

### 사용자 프롬프트 (요약)
> 사용자, 팀, 활동, 리더보드, 운동 모델을 MongoDB ObjectId를 PK로 사용하여 생성해 달라.

### 생성된 모델

| 모델 | 테이블명 | 주요 필드 |
|------|----------|----------|
| **User** | `users` | `name`, `email` (unique), `hero_alias` |
| **Team** | `teams` | `name` (unique), `universe` |
| **Activity** | `activities` | FK(`user`), `activity_type`, `duration_minutes`, `calories_burned` |
| **Leaderboard** | `leaderboard` | FK(`user`), `score`, `rank` |
| **Workout** | `workouts` | FK(`user`), `workout_name`, `intensity` |

모든 모델의 PK는 `models.ObjectIdField(primary_key=True, default=ObjectId, editable=False)`로 설정.

### 생성된 코드
```python
from bson import ObjectId
from djongo import models

class User(models.Model):
    id = models.ObjectIdField(primary_key=True, default=ObjectId, editable=False)
    name = models.CharField(max_length=120)
    email = models.EmailField(unique=True)
    hero_alias = models.CharField(max_length=120)
    class Meta:
        db_table = 'users'

class Team(models.Model):
    id = models.ObjectIdField(primary_key=True, default=ObjectId, editable=False)
    name = models.CharField(max_length=80, unique=True)
    universe = models.CharField(max_length=40)
    class Meta:
        db_table = 'teams'

class Activity(models.Model):
    id = models.ObjectIdField(primary_key=True, default=ObjectId, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    activity_type = models.CharField(max_length=80)
    duration_minutes = models.PositiveIntegerField()
    calories_burned = models.PositiveIntegerField()
    class Meta:
        db_table = 'activities'

class Leaderboard(models.Model):
    id = models.ObjectIdField(primary_key=True, default=ObjectId, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='leaderboard_entries')
    score = models.PositiveIntegerField(default=0)
    rank = models.PositiveIntegerField(default=0)
    class Meta:
        db_table = 'leaderboard'

class Workout(models.Model):
    id = models.ObjectIdField(primary_key=True, default=ObjectId, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='workouts')
    workout_name = models.CharField(max_length=120)
    intensity = models.CharField(max_length=40)
    class Meta:
        db_table = 'workouts'
```

---

## 4단계: 시리얼라이저 (`serializers.py`)

### 실행 내용
ObjectId를 문자열로 변환하는 커스텀 필드 `ObjectIdStringField`를 만들고, 각 모델에 대한 ModelSerializer 생성.

### 생성된 코드
```python
from rest_framework import serializers
from .models import Activity, Leaderboard, Team, User, Workout

class ObjectIdStringField(serializers.Field):
    def to_representation(self, value):
        return str(value)
    def to_internal_value(self, data):
        return str(data)

class UserSerializer(serializers.ModelSerializer):
    id = ObjectIdStringField(read_only=True)
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'hero_alias']

# TeamSerializer, ActivitySerializer, LeaderboardSerializer, WorkoutSerializer 도 동일 패턴
```

---

## 5단계: 뷰 (`views.py`)

### 실행 내용
DRF의 `ModelViewSet`을 사용하여 각 모델에 대한 CRUD API 생성. `api_root` 함수 뷰로 API 엔트리포인트 제공.

### 생성된 코드
```python
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def api_root(request):
    return Response({
        'users': request.build_absolute_uri('/api/users/'),
        'teams': request.build_absolute_uri('/api/teams/'),
        'activities': request.build_absolute_uri('/api/activities/'),
        'leaderboard': request.build_absolute_uri('/api/leaderboard/'),
        'workouts': request.build_absolute_uri('/api/workouts/'),
    })

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('name')
    serializer_class = UserSerializer
    lookup_field = 'id'

# TeamViewSet, ActivityViewSet, LeaderboardViewSet, WorkoutViewSet 도 동일 패턴
```

---

## 6단계: URL 라우팅 (`urls.py`)

### 실행 내용
DRF의 `DefaultRouter`를 사용하여 자동 URL 라우팅 설정. Codespace 환경의 base_url 동적 생성.

### 생성된 코드
```python
import os
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'users', UserViewSet, basename='users')
router.register(r'teams', TeamViewSet, basename='teams')
router.register(r'activities', ActivityViewSet, basename='activities')
router.register(r'leaderboard', LeaderboardViewSet, basename='leaderboard')
router.register(r'workouts', WorkoutViewSet, basename='workouts')

urlpatterns = [
    path('', api_root, name='root-api'),
    path('admin/', admin.site.urls),
    path('api/', api_root, name='api-root'),
    path('api/', include(router.urls)),
]
```

### API 엔드포인트 목록
| 엔드포인트 | 설명 |
|-----------|------|
| `/api/` | API 루트 (모든 엔드포인트 목록) |
| `/api/users/` | 사용자 CRUD |
| `/api/teams/` | 팀 CRUD |
| `/api/activities/` | 활동 CRUD |
| `/api/leaderboard/` | 리더보드 CRUD |
| `/api/workouts/` | 운동 CRUD |

---

## 7단계: Django Admin 등록 (`admin.py`)

### 실행 내용
모든 모델을 Django Admin에 등록하고, `list_display`, `search_fields`, `list_filter`, `ordering` 설정.

### 생성된 코드
```python
from django.contrib import admin
from .models import Activity, Leaderboard, Team, User, Workout

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'hero_alias')
    search_fields = ('name', 'email', 'hero_alias')

@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('name', 'universe')

@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('activity_type', 'user', 'duration_minutes', 'calories_burned')
    list_filter = ('activity_type',)

@admin.register(Leaderboard)
class LeaderboardAdmin(admin.ModelAdmin):
    list_display = ('rank', 'user', 'score')
    ordering = ('rank',)

@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ('workout_name', 'user', 'intensity')
    list_filter = ('intensity',)
```

---

## 8단계: 테스트 데이터 생성 커맨드 (`populate_db.py`)

### 사용자 프롬프트 (요약)
> Django ORM을 통해 MongoDB에 슈퍼히어로 테마의 테스트 데이터를 넣는 management command를 만들어 달라.

### 실행 내용
`octofit_tracker/management/commands/populate_db.py` 커스텀 매니지먼트 커맨드 생성.

**주입되는 데이터:**

| 카테고리 | 데이터 |
|---------|--------|
| **팀** | Marvel Team, DC Team |
| **사용자** | Peter Parker (Spider-Man), Tony Stark (Iron Man), Bruce Wayne (Batman), Diana Prince (Wonder Woman) |
| **활동** | web-slinging cardio, arc-reactor HIIT, night patrol run, amazon strength circuit |
| **운동** | Spider Agility, Stark Power Circuit, Gotham Endurance, Themyscira Core |
| **리더보드** | Batman(1위/980점), Wonder Woman(2위/950점), Spider-Man(3위/910점), Iron Man(4위/890점) |

> **참고**: Djongo ObjectId 모델에서 `bulk_create`를 사용하면 PK가 null이 되는 문제가 있어, 개별 `objects.create()`를 사용했다.

### 실행 명령
```bash
python octofit-tracker/backend/octofit_tracker/manage.py populate_db
```

---

## 9단계: 마이그레이션 실행

### 실행 내용
```bash
python octofit-tracker/backend/octofit_tracker/manage.py makemigrations
python octofit-tracker/backend/octofit_tracker/manage.py migrate
```

- **0001_initial.py**: 5개 모델 초기 생성 (User, Team, Activity, Leaderboard, Workout)
- **0002**: ObjectId 필드에 `default=bson.objectid.ObjectId`, `editable=False` 추가

---

## 10단계: API 테스트 (`tests.py`)

### 사용자 프롬프트 (요약)
> REST API 엔드포인트를 검증하는 테스트를 작성해 달라.

### 생성된 테스트 케이스

| 테스트 | 검증 내용 |
|-------|----------|
| `test_api_root_contains_all_collections` | `/api/` 응답에 5개 컬렉션 키가 모두 포함되는지 |
| `test_users_endpoint_returns_data` | `/api/users/` 200 응답 + 데이터 1건 |
| `test_teams_endpoint_returns_data` | `/api/teams/` 200 응답 + 데이터 1건 |
| `test_activities_endpoint_returns_data` | `/api/activities/` 200 응답 + 데이터 1건 |
| `test_leaderboard_endpoint_returns_data` | `/api/leaderboard/` 200 응답 + 데이터 1건 |
| `test_workouts_endpoint_returns_data` | `/api/workouts/` 200 응답 + 데이터 1건 |

### 테스트 실행
```bash
python octofit-tracker/backend/octofit_tracker/manage.py test octofit_tracker
```

---

## 포트 구성

| 포트 | 용도 | 접근성 |
|------|------|--------|
| 8000 | Django 백엔드 | public |
| 3000 | React 프론트엔드 (예정) | public |
| 27017 | MongoDB | private |

---

## MongoDB 관련 참고

- `mongod` 실행 여부 확인: `ps aux | grep mongod`
- 데이터베이스/데이터 생성은 직접 MongoDB 스크립트가 아닌 **Django ORM**을 통해 수행
- Djongo를 통해 Django ↔ MongoDB 연결

---

## 세션 중 발견된 이슈 및 해결

| 이슈 | 해결 |
|------|------|
| `django-admin startproject` destination 디렉터리 미존재 오류 | 디렉터리를 먼저 생성 후 프로젝트 생성 |
| Djongo ObjectId + `bulk_create`에서 PK가 null | 개별 `objects.create()` 호출로 대체 |

---

## 생성된 파일 목록

```
octofit-tracker/backend/
├── requirements.txt
└── octofit_tracker/
    ├── manage.py
    └── octofit_tracker/
        ├── __init__.py
        ├── admin.py
        ├── apps.py
        ├── asgi.py
        ├── models.py
        ├── serializers.py
        ├── settings.py
        ├── tests.py
        ├── urls.py
        ├── views.py
        ├── wsgi.py
        ├── management/
        │   ├── __init__.py
        │   └── commands/
        │       ├── __init__.py
        │       └── populate_db.py
        └── migrations/
            ├── __init__.py
            ├── 0001_initial.py
            └── 0002_alter_activity_id_alter_leaderboard_id_alter_team_id_and_more.py
```
