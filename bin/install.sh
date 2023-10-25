#!/bin/bash

# create bin directory inside user home
mkdir -p ~/bin/

# Download Chrome Launcher Script and save to ~/bin/chrome_launcher.sh
curl -s https://raw.githubusercontent.com/GoogleChromeLabs/ps-analysis-tool/01c9bd6d0823e4650e12395538f7f30ff3453def/bin/chrome_launcher.sh -o ~/bin/chrome_launcher.sh

chmod 755 ~/bin/chrome_launcher.sh

# Check Shell and auto source chrome_launcher.sh
case $SHELL in
*/zsh)
  grep "chrome_launcher.sh" ~/.zshrc
  if [ $? -ne 0 ]; then
    echo "if [ -f ~/bin/chrome_launcher.sh ]; then" >> ~/.zshrc
      echo -e "\tsource ~/bin/chrome_launcher.sh" >> ~/.zshrc
    echo "fi" >> ~/.zshrc
  fi
   ;;
*/bash)
  grep "chrome_launcher.sh" ~/.bashrc
  if [ $? -ne 0 ]; then
    echo "if [ -f ~/bin/chrome_launcher.sh ]; then" >> ~/.bashrc
      echo -e "\tsource ~/bin/chrome_launcher.sh" >> ~/.bashrc
    echo "fi" >> ~/.bashrc
  fi
;;
esac

# Source into current terminal session as well
source ~/bin/chrome_launcher.sh
