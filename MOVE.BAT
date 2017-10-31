@echo off
XCOPY D:\hongjianguo_web\dist\index.html D:\hongjianguo_http\application\index\view\test\index.html /s /f /h /y
DEL D:\hongjianguo_http\public\static\js\ /q
XCOPY D:\hongjianguo_web\dist\static\js D:\hongjianguo_http\public\static\js\ /s /f /h
DEL D:\hongjianguo_http\public\static\css\ /q
XCOPY D:\hongjianguo_web\dist\static\css D:\hongjianguo_http\public\static\css\ /s /f /h