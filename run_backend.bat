@echo off
echo ========================================================
echo   Starting Bangladesh Legal Copilot FastAPI Backend
echo   FastAPI + CrewAI Agents + RAG Engine (Port 8000)
echo ========================================================
cd /d "%~dp0backend"
python -m uvicorn main:app --reload --port 8000
pause

