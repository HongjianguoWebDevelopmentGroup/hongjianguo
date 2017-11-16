@echo off
XCOPY D:\hongjianguo\dist\index.html D:\hjg_enterprise_cvte\application\index\view\test\index.html /s /f /h /y
DEL D:\hjg_enterprise_cvte\public\static\js\ /q
XCOPY D:\hongjianguo\dist\static\js D:\hjg_enterprise_cvte\public\static\js\ /s /f /h
DEL D:\hjg_enterprise_cvte\public\static\css\ /q
XCOPY D:\hongjianguo\dist\static\css D:\hjg_enterprise_cvte\public\static\css\ /s /f /h