' service/start_silent.vbs
' Launches VIVA Analyser Node Server silently in the background (0 console windows)
Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

' Get project directory
scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
projectDir = fso.GetParentFolderName(scriptDir)

' Change working directory to project root
WshShell.CurrentDirectory = projectDir

' Run node server.cjs completely hidden (window style 0)
WshShell.Run "node server.cjs", 0, False
