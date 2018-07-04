tell application "iTerm" to activate
tell application "System Events"
  tell process "iTerm2"
    click menu item "New Window" of menu "Shell" of menu bar 1
--    delay 2
    keystroke "cd ~/dev/labs/cv-editor && yarn term-run"
    key code 76
  end tell
end tell
