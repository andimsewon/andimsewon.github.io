# Sewon Kim's Academic Portfolio

전북대학교 컴퓨터공학부 김세원의 개인 학술 포트폴리오 웹사이트입니다. 각 카테고리별로 독립적인 HTML 페이지로 구성되어 있으며, 다크 모드, 반응형 디자인, SEO 최적화 등이 적용되어 있습니다.

**🌐 Live Site**: [https://andimsewon.github.io](https://andimsewon.github.io)

---

## 📁 프로젝트 구조

```
andimsewon.github.io/
├── index.html              # 메인 페이지 (홈)
├── research.html           # 연구 경험 페이지
├── projects.html           # 프로젝트 페이지
├── awards.html             # 수상 내역 페이지
├── gallery.html            # 사진 갤러리 페이지
├── activities.html         # 활동 페이지
├── styles.css              # 전체 스타일시트 (라이트/다크 모드 지원)
├── README.md               # 프로젝트 설명서
├── 404.html                # GitHub Pages 404 페이지
├── robots.txt              # 검색 엔진 크롤링 지시
├── sitemap.xml             # 사이트맵 (SEO)
├── start-server.sh         # 로컬 서버 실행 스크립트
├── SewonKim_CV.pdf         # CV PDF 파일
│
├── assets/                 # 이미지 및 미디어 파일
│   ├── profile.jpeg        # 프로필 사진
│   ├── favicon.svg         # 파비콘 (SVG)
│   └── gallery/            # 갤러리 사진 폴더
│       ├── 2025Purdue_KSW.jpeg
│       └── 2025Purdue_KSW1.jpeg
│
├── ko/                     # 한국어 버전 페이지
│   ├── index.html
│   ├── research.html
│   ├── projects.html
│   ├── awards.html
│   ├── gallery.html
│   └── activities.html
│
└── js/                     # JavaScript 파일
    └── loader.js           # (현재 미사용 - 단일 페이지 구조)
```

---

## ✨ 주요 기능

### 🎨 디자인 & UI/UX

- **은은한 분홍색 테마**: 학술적이고 전문적인 느낌의 분홍색 계열 색상 팔레트
- **다크 모드 지원**: 
  - 🌙/☀️ 토글 버튼으로 라이트/다크 모드 전환
  - 시스템 설정 자동 감지 (prefers-color-scheme)
  - 사용자 선택 저장 (localStorage)
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 모든 기기에서 최적화
- **깔끔한 레이아웃**: 박스나 테두리 없이 타이포그래피와 간격으로만 구성
- **부드러운 스크롤**: 네비게이션 클릭 시 해당 섹션으로 부드럽게 이동

### 📸 갤러리 기능

- **4:3 비율 고정**: 모든 갤러리 이미지가 일관된 4:3 비율로 표시
- **라이트박스 미리보기**: 
  - 이미지 클릭 시 전체 화면 라이트박스로 확대
  - 닫기 방법: 닫기 버튼(×), 배경 클릭, ESC 키
  - 이미지 캡션 표시
- **Lazy Loading**: 이미지 지연 로딩으로 성능 최적화

### 🌐 다국어 지원

- **영어/한국어 버전**: 각 페이지별로 영어와 한국어 버전 제공
- **언어 전환 링크**: 네비게이션 바에 "한국어" 링크 포함
- **hreflang 태그**: 검색 엔진을 위한 언어 정보 제공

### 🔍 SEO & 접근성

- **Open Graph 메타 태그**: 소셜 미디어 공유 시 미리보기 최적화
- **Twitter Card**: Twitter 공유 최적화
- **Schema.org 구조화된 데이터**: Person, WebPage 타입 JSON-LD
- **robots.txt & sitemap.xml**: 검색 엔진 색인 최적화
- **키보드 접근성**: Skip link, 포커스 스타일, ARIA 레이블
- **시맨틱 HTML**: 적절한 HTML5 태그 사용
- **Canonical URL**: 중복 콘텐츠 방지

### 📱 페이지 구조

각 카테고리는 독립적인 HTML 파일로 구성:

1. **Home** (`index.html`) - 기본 정보, 교육, 기술 스킬, 개요
2. **Research** (`research.html`) - 연구 경험 및 활동
3. **Projects** (`projects.html`) - 선택된 프로젝트 목록
4. **Awards** (`awards.html`) - 수상 내역, 리더십, 자격증
5. **Gallery** (`gallery.html`) - 프로젝트 및 활동 관련 사진
6. **Activities** (`activities.html`) - 캠퍼스 활동 및 서비스

---

## 🚀 배포 방법

### GitHub Pages 배포 (현재 배포됨 ✅)

1. **저장소 확인**
   - 저장소: `andimsewon/andimsewon.github.io`
   - GitHub Pages 자동 활성화됨

2. **변경사항 배포**
   ```bash
   git add .
   git commit -m "Update content"
   git push origin main
   ```

3. **접속 확인**
   - 배포 주소: **https://andimsewon.github.io**
   - 배포에는 1-3분 정도 소요됩니다

---

## 🔧 로컬 개발 환경

### ⚡ 가장 쉬운 방법: 스크립트 실행

터미널에서 다음 명령어만 실행하면 됩니다:

```bash
./start-server.sh
```

그 다음 브라우저에서 **http://localhost:8000** 접속

### 수동으로 서버 실행

#### Python 사용 (권장)
```bash
# Python 3
python3 -m http.server 8000

# 또는 Python 2
python -m http.server 8000
```

#### Node.js 사용
```bash
npx http-server -p 8000
# 또는
npx serve
```

### ⚠️ 파일 직접 열기 주의사항

- HTML 파일을 브라우저로 직접 열면 일부 기능이 제대로 작동하지 않을 수 있습니다
- `file://` 프로토콜에서는 일부 JavaScript 기능이 보안상 제한될 수 있습니다
- **반드시 로컬 서버를 사용하는 것을 권장합니다**

---

## ✏️ 커스터마이징 가이드

### 프로필 사진 변경

- `assets/profile.jpeg` 파일을 원하는 사진으로 교체 (동일한 파일명 유지)
- 권장 크기: 280x350px 정도 (비율 4:5)

### 각 페이지 내용 수정

#### 메인 페이지 (`index.html`)
- 이름, 연락처 정보
- 개요 (At a Glance)
- 기술 스킬 (Skills & Tools)
- 교육 이력 (Education)
- 빠른 링크 (Quick Links)

#### 연구 경험 (`research.html`)
- 연구실 활동 내역
- 연구 프로젝트 설명
- 각 연구 항목을 `<li>` 태그로 추가/수정

#### 프로젝트 (`projects.html`)
- 프로젝트 목록
- 각 프로젝트의 상세 설명
- 새로운 프로젝트는 기존 형식에 맞춰 추가

#### 수상 내역 (`awards.html`)
- 수상 및 영예
- 리더십 & 서비스 활동
- 자격증 정보

#### 사진 갤러리 (`gallery.html`)
- `assets/gallery/` 폴더에 이미지 파일 추가
- HTML에서 이미지 추가:
  ```html
  <div class="gallery-item">
    <img src="./assets/gallery/your-photo.jpg" alt="설명" class="gallery-image" data-caption="캡션" loading="lazy">
    <div class="gallery-caption">캡션</div>
  </div>
  ```

### 스타일 수정 (`styles.css`)

#### 색상 테마 변경

**라이트 모드:**
```css
:root {
  --text-primary: #3b2a30;      /* 주요 텍스트 */
  --text-secondary: #6b4c57;     /* 보조 텍스트 */
  --accent: #d88ca1;            /* 강조 색상 */
  --section-title: #b25d79;     /* 섹션 제목 */
  --nav-bg: #8a425e;            /* 네비게이션 배경 */
  --bg-white: #fff7fa;          /* 배경색 */
}
```

**다크 모드:**
```css
[data-theme="dark"] {
  --text-primary: #f1e9ed;
  --text-secondary: #d8c4ce;
  --accent: #e09ab3;
  --section-title: #f0a8c2;
  --nav-bg: #4a2534;
  --bg-white: #0f0c10;
}
```

#### 폰트 변경
```css
html, body {
  font-family: '원하는 폰트', sans-serif;
}
```

### 다크 모드 커스터마이징

다크 모드 색상은 `styles.css`의 `[data-theme="dark"]` 섹션에서 수정할 수 있습니다.

---

## 🎨 디자인 특징

### 색상 팔레트

- **라이트 모드**: 부드러운 분홍색과 크림색 계열
- **다크 모드**: 어두운 배경에 밝은 분홍색 텍스트
- **강조 색상**: 분홍색 계열로 일관성 유지

### 타이포그래피

- **영문**: Nunito (Google Fonts)
- **한글**: Noto Serif KR (Google Fonts)
- **가독성**: 적절한 줄 간격과 폰트 크기

### 레이아웃

- **2단 레이아웃**: 데스크톱에서 메인 페이지는 2단 구성
- **1단 레이아웃**: 모바일에서는 1단 구성으로 자동 전환
- **그리드 시스템**: 갤러리는 반응형 그리드 (3열 → 2열 → 1열)

---

## 📱 반응형 디자인

### 브레이크포인트

- **데스크톱**: 1024px 이상 (3열 갤러리, 2단 레이아웃)
- **태블릿**: 768px - 1023px (2열 갤러리, 1단 레이아웃)
- **모바일**: 480px 이하 (1열 갤러리, 1단 레이아웃)

### 모바일 최적화

- 터치 친화적인 버튼 크기
- 가로 스크롤 방지
- 적절한 폰트 크기 조정
- 이미지 지연 로딩

---

## 🔍 SEO 최적화

### 메타 태그

- Open Graph 태그 (Facebook, LinkedIn 등)
- Twitter Card 태그
- Canonical URL
- hreflang 태그 (다국어 지원)

### 구조화된 데이터

- Schema.org Person 타입 (메인 페이지)
- Schema.org WebPage 타입 (각 페이지)

### 검색 엔진 최적화

- `robots.txt`: 크롤러 지시
- `sitemap.xml`: 사이트맵 제공
- 의미론적 HTML 구조

---

## 🐛 문제 해결

### 스타일이 적용되지 않는 경우

- `styles.css` 파일 경로 확인
- 브라우저 캐시 삭제 후 새로고침 (Ctrl+F5 또는 Cmd+Shift+R)
- 다크 모드가 활성화되어 있는지 확인

### 이미지가 표시되지 않는 경우

- 이미지 파일 경로 확인 (상대 경로: `./assets/gallery/...`)
- `assets/` 폴더 구조 확인
- 파일명 대소문자 일치 확인
- 파일 확장자 확인 (.jpeg, .jpg, .png 등)

### 다크 모드가 작동하지 않는 경우

- 브라우저 콘솔(F12)에서 JavaScript 에러 확인
- localStorage가 활성화되어 있는지 확인
- `data-theme` 속성이 HTML에 제대로 설정되는지 확인

### 라이트박스가 작동하지 않는 경우

- JavaScript가 활성화되어 있는지 확인
- 이미지에 `gallery-image` 클래스가 있는지 확인
- `data-caption` 속성이 올바르게 설정되어 있는지 확인

---

## 📝 업데이트 방법

### 내용 추가/수정

1. 해당 HTML 파일 열기
2. 내용 수정
3. Git으로 커밋 및 푸시
   ```bash
   git add .
   git commit -m "Update content"
   git push origin main
   ```

### 새 페이지 추가

1. 루트 디렉토리에 새 HTML 파일 생성 (예: `newpage.html`)
2. 기존 페이지를 참고하여 구조 복사
3. 네비게이션 바에 링크 추가 (모든 페이지)
4. 한국어 버전도 `ko/` 폴더에 추가

### 갤러리 이미지 추가

1. `assets/gallery/` 폴더에 이미지 파일 추가
2. `gallery.html` 파일 열기
3. 기존 갤러리 아이템 형식에 맞춰 추가:
   ```html
   <div class="gallery-item">
     <img src="./assets/gallery/new-image.jpg" alt="설명" class="gallery-image" data-caption="캡션" loading="lazy">
     <div class="gallery-caption">캡션</div>
   </div>
   ```

---

## 🛠️ 기술 스택

- **HTML5**: 시맨틱 마크업
- **CSS3**: 
  - CSS Variables (커스텀 속성)
  - Flexbox & Grid
  - Media Queries (반응형)
  - CSS Transitions
- **JavaScript (Vanilla)**:
  - 다크 모드 토글
  - 라이트박스 기능
  - localStorage API
  - Intersection Observer API (스크롤 스파이)
- **GitHub Pages**: 정적 호스팅

---

## 📧 연락처

- **이메일**: sewonkim1018@gmail.com
- **GitHub**: [github.com/andimsewon](https://github.com/andimsewon)
- **LinkedIn**: [linkedin.com/in/sewon-kim-742a492a6](https://www.linkedin.com/in/sewon-kim-742a492a6/)
- **웹사이트**: [andimsewon.github.io](https://andimsewon.github.io)

---

## 📄 라이선스

이 프로젝트는 개인 포트폴리오 용도로 자유롭게 사용 가능합니다.

---

**Built with ❤️ using HTML, CSS, and JavaScript**

*Last updated: 2025*
