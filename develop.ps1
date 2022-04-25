start powershell.exe "sass --watch --style=compressed scss:dist"
start powershell.exe `
    '. .\dev\Watch-Concat-File-Lists.ps1; Watch-Concat-File-Lists -InFolder js -OutFolder dist'
