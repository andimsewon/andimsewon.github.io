#!/bin/bash
# 로컬 서버 실행 스크립트

echo "🚀 로컬 서버를 시작합니다..."
echo ""

# Python 버전 확인
if command -v python3 &> /dev/null; then
    echo "✅ Python 3를 사용합니다"
    echo "📝 브라우저에서 http://localhost:8000 접속하세요"
    echo "🛑 서버를 중지하려면 Ctrl+C를 누르세요"
    echo ""
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "✅ Python을 사용합니다"
    echo "📝 브라우저에서 http://localhost:8000 접속하세요"
    echo "🛑 서버를 중지하려면 Ctrl+C를 누르세요"
    echo ""
    python -m http.server 8000
else
    echo "❌ Python이 설치되어 있지 않습니다."
    echo ""
    echo "다음 중 하나를 설치해주세요:"
    echo "  - Python 3: https://www.python.org/downloads/"
    echo "  - Node.js: https://nodejs.org/"
    echo ""
    echo "Node.js가 설치되어 있다면 다음 명령어를 사용하세요:"
    echo "  npx http-server -p 8000"
    exit 1
fi

