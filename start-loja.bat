@echo off
title Loja - Servidor

echo.
echo [LOJA] Iniciando servico...
echo.

cd /d %~dp0

echo [LOJA] Verificando dependencias...
call npm install

echo.
echo [LOJA] Subindo aplicacao...
echo.

call npm start

echo.
echo [LOJA] Processo finalizado.
pause
ypo