#!/bin/bash

# Download Chrome Launcher Script and save to /usr/local/bin/chrome_launcher.sh
curl -s https://raw.githubusercontent.com/GoogleChromeLabs/ps-analysis-tool/4d26f3daeea86db82f1e39692e23d79713627d72/chrome_launcher.sh -o /usr/local/bin/chrome_launcher.sh

# Check Shell and auto source chrome_launcher.sh
case $SHELL in
*/zsh)
  grep "chrome_launcher.sh" ~/.zshrc
  if [ $? -ne 0 ]; then
    echo "source /usr/local/bin/chrome_launcher.sh" >> ~/.zshrc
  fi
   ;;
*/bash)
  grep "chrome_launcher.sh" ~/.bashrc
  if [ $? -ne 0 ]; then
    echo "source /usr/local/bin/chrome_launcher.sh" >> ~/.bashrc
  fi
;;
esac

# Source into current terminal session as well
source /usr/local/bin/chrome_launcher.sh
