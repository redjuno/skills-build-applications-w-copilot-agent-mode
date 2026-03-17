# OctoFit Tracker 개발 요약

**기술 스택**: Django 4.1.7 + DRF + Djongo (MongoDB) + React (예정)

---

## 백엔드 구성 요약

### 모델 (5개)
- **User** — 이름, 이메일, 히어로 별칭
- **Team** — 팀명, 유니버스(Marvel/DC)
- **Activity** — 활동 유형, 시간, 칼로리 (User FK)
- **Leaderboard** — 점수, 순위 (User FK)
- **Workout** — 운동명, 강도 (User FK)

> 모든 PK는 MongoDB ObjectId 사용 (Djongo `ObjectIdField`)

### REST API 엔드포인트
| 경로 | 설명 |
|------|------|
| `/api/users/` | 사용자 CRUD |
| `/api/teams/` | 팀 CRUD |
| `/api/activities/` | 활동 CRUD |
| `/api/leaderboard/` | 리더보드 CRUD |
| `/api/workouts/` | 운동 CRUD |

### 주요 설정
- MongoDB 연결: `mongodb://localhost:27017`, DB명 `octofit_db`
- CORS 전체 허용, Codespace URL 동적 ALLOWED_HOSTS 추가
- 테스트 데이터: 슈퍼히어로 4명 (Spider-Man, Iron Man, Batman, Wonder Woman)

### 포트
| 포트 | 용도 | 접근성 |
|------|------|--------|
| 8000 | Django 백엔드 | public |
| 3000 | React 프론트엔드 | public |
| 27017 | MongoDB | private |

---

## 개발 단계 흐름

1. 가상 환경 생성 + 패키지 설치 (`requirements.txt`)
2. Django 프로젝트 생성 (`django-admin startproject`)
3. `settings.py` — DB, CORS, 앱 등록
4. `models.py` — 5개 모델 정의
5. `serializers.py` — ObjectId→문자열 변환 시리얼라이저
6. `views.py` — ModelViewSet 5개 + api_root
7. `urls.py` — DRF Router 라우팅
8. `admin.py` — Admin 등록
9. `populate_db.py` — 테스트 데이터 커맨드
10. `tests.py` — API 엔드포인트 테스트 6건

---

## 이슈 & 해결
- **startproject 디렉터리 오류** → 디렉터리 선생성 후 실행
- **Djongo bulk_create PK null** → 개별 `objects.create()` 사용
