# 김세원 개인 포트폴리오 웹사이트

전북대학교 컴퓨터공학부 김세원의 개인 CV 포트폴리오 웹사이트입니다. 모듈화된 구조로 각 카테고리별로 파일이 분리되어 있어 유지보수가 쉽습니다.

## 📁 프로젝트 구조

```
andimsewon.github.io/
├── index.html              # 메인 HTML 파일 (레이아웃 및 네비게이션)
├── styles.css              # 전체 스타일시트 (은은한 분홍색 테마)
├── README.md               # 프로젝트 설명서
├── 404.html                # GitHub Pages 404 페이지
├── robots.txt              # 검색 엔진 크롤링 지시
├── sitemap.xml             # 간단한 사이트맵 (SEO)
├── assets/                 # 이미지 및 미디어 파일
│   ├── profile.jpeg        # 프로필 사진
│   └── favicon.svg         # 파비콘 (브라우저 탭 아이콘)
│   └── gallery/           # 갤러리 사진 폴더
├── sections/               # 각 카테고리별 모듈화된 섹션
│   ├── main.html          # 메인 페이지 (기본 정보, 교육, 기술 스킬, 교수 경험)
│   ├── research.html      # 연구 경험 섹션
│   ├── projects.html      # 선택된 프로젝트 섹션
│   ├── awards.html        # 수상 내역, 리더십, 자격증 섹션
│   └── gallery.html       # 사진 갤러리 섹션
└── js/                    # JavaScript 파일
    └── loader.js          # 섹션 동적 로더 (사용 중)
```

## 🚀 배포 방법

### GitHub Pages 배포

1. **저장소 생성**
   - GitHub에서 `<your-username>.github.io` 이름으로 저장소 생성
   - 또는 기존 저장소의 Settings > Pages에서 GitHub Pages 활성화

2. **파일 업로드**
   ```bash
   git clone <your-repo-url>
   cd andimsewon.github.io
   # 파일들을 모두 복사한 후
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

3. **접속 확인**
   - 브라우저에서 `https://<your-username>.github.io` 접속
   - 배포에는 몇 분 정도 소요될 수 있습니다

## ✏️ 커스터마이징 가이드

### 프로필 사진 변경
- `assets/profile.jpeg` 파일을 원하는 사진으로 교체 (동일한 파일명 유지)
- 권장 크기: 280x350px 정도 (비율 4:5)

### 각 섹션 내용 수정

#### 메인 페이지 (`sections/main.html`)
- 이름, 연락처 정보
- 연구 관심 주제
- 교육 이력
- 기술 스킬
- 교수 경험

#### 연구 경험 (`sections/research.html`)
- 연구실 활동 내역
- 연구 프로젝트 설명
- 각 연구 항목을 `<li>` 태그로 추가/수정

#### 프로젝트 (`sections/projects.html`)
- 프로젝트 목록
- 각 프로젝트의 상세 설명
- 새로운 프로젝트는 기존 형식에 맞춰 추가

#### 수상 내역 (`sections/awards.html`)
- 수상 및 영예
- 리더십 & 서비스 활동
- 자격증 정보

#### 사진 갤러리 (`sections/gallery.html`)
- `assets/gallery/` 폴더에 이미지 파일 추가
- HTML에서 플레이스홀더를 실제 이미지로 교체:
  ```html
  <img src="./assets/gallery/your-photo.jpg" alt="설명">
  ```

### 스타일 수정 (`styles.css`)

#### 색상 테마 변경
```css
:root {
  --section-title: #b87a95;      /* 섹션 제목 색상 (분홍색) */
  --accent-dark: #c88fa3;         /* 링크 색상 */
  --bg-white: #fefefe;            /* 배경색 */
  /* 원하는 색상으로 변경 가능 */
}
```

#### 폰트 변경
```css
html, body {
  font-family: '원하는 폰트', sans-serif;
}
```

## 🎨 디자인 특징

- **은은한 분홍색 테마**: 학술적이고 전문적인 느낌의 분홍색 계열 색상
- **모듈화된 구조**: 각 섹션이 별도 파일로 분리되어 관리 용이
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 모든 기기에서 최적화
- **부드러운 스크롤**: 네비게이션 클릭 시 해당 섹션으로 부드럽게 이동
- **깔끔한 레이아웃**: 박스나 테두리 없이 타이포그래피와 간격으로만 구성

## 📱 네비게이션 구조

웹사이트는 다음 5개 카테고리로 구성됩니다:

1. **Main page** - 기본 정보, 교육, 기술 스킬, 교수 경험
2. **Research** - 연구 경험 및 활동
3. **Projects** - 선택된 프로젝트 목록
4. **Awards** - 수상 내역, 리더십, 자격증
5. **Gallery** - 프로젝트 및 활동 관련 사진

## 🔧 로컬 개발 환경

### 간단한 HTTP 서버 실행

Python이 설치되어 있다면:
```bash
python -m http.server 8000
# 브라우저에서 http://localhost:8000 접속
```

Node.js가 설치되어 있다면:
```bash
npx http-server
# 또는
npx serve
```

### 파일 직접 열기
- `index.html` 파일을 브라우저로 직접 열어도 확인 가능합니다
- 단, 동적 로딩 기능은 로컬 서버에서만 정상 작동합니다

## 📝 업데이트 방법

### 내용 추가/수정
1. 해당 섹션 파일 (`sections/` 폴더 내) 열기
2. HTML 내용 수정
3. Git으로 커밋 및 푸시
   ```bash
   git add sections/your-section.html
   git commit -m "Update section content"
   git push
   ```

### 새 섹션 추가
1. `sections/` 폴더에 새 HTML 파일 생성
2. `index.html`의 `sections` 배열에 새 파일 경로 추가:
   ```javascript
   const sections = [
     'sections/main.html',
     'sections/your-new-section.html',  // 추가
     // ...
   ];
   ```

## 🐛 문제 해결

### 섹션이 로드되지 않는 경우
- 브라우저 콘솔(F12)에서 에러 확인
- 파일 경로가 정확한지 확인
- GitHub Pages에서는 상대 경로 사용 확인
 - JavaScript가 비활성화되어 있으면 로드되지 않습니다 (noscript 안내 메시지 표시)

### 스타일이 적용되지 않는 경우
- `styles.css` 파일 경로 확인
- 브라우저 캐시 삭제 후 새로고침 (Ctrl+F5 또는 Cmd+Shift+R)

## 🔍 SEO/접근성 개선 사항

- Open Graph/Twitter 메타 태그 추가로 링크 공유 미리보기 개선
- `robots.txt`, `sitemap.xml` 추가로 검색 엔진 색인 도움
- 키보드 사용자 위한 Skip link, 포커스 스타일, 활성 네비게이션 표시

### 이미지가 표시되지 않는 경우
- 이미지 파일 경로 확인
- `assets/` 폴더 구조 확인
- 파일명 대소문자 일치 확인

## 📄 라이선스

이 프로젝트는 개인 포트폴리오 용도로 자유롭게 사용 가능합니다.

## 📧 연락처

- **이메일**: sewonkim1018@gmail.com
- **GitHub**: [github.com/andimsewon](https://github.com/andimsewon)

---

**Built with ❤️ using HTML, CSS, and JavaScript**
