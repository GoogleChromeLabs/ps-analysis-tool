#!/bin/bash

# create bin directory inside user home
mkdir -p ~/bin/

# Download Chrome Launcher Script and save to ~/bin/chrome_launcher.sh
curl -s https://raw.githubusercontent.com/GoogleChromeLabs/ps-analysis-tool/Setup-Different-Chrome-For-Demo/bin/chrome_launcher.sh -o ~/bin/chrome_launcher.sh

chmod 755 ~/bin/chrome_launcher.sh

# Check Shell and auto source chrome_launcher.sh
case $SHELL in
*/zsh)
  grep "chrome_launcher.sh" ~/.zshrc > /dev/null
  if [ $? -ne 0 ]; then
    {
      echo "if [ -f ~/bin/chrome_launcher.sh ]; then"
        echo -e "\tsource ~/bin/chrome_launcher.sh"
      echo "fi"
    } >> ~/.zshrc
  fi
  echo -e "Script added to ~/.zshrc, please restart your terminal session or run: \n\tsource ~/.zshrc"
   ;;
*/bash)
  grep "chrome_launcher.sh" ~/.bashrc > /dev/null
  if [ $? -ne 0 ]; then
    {
      echo "if [ -f ~/bin/chrome_launcher.sh ]; then"
        echo -e "\tsource ~/bin/chrome_launcher.sh"
      echo "fi"
    } >> ~/.bashrc
  fi
  echo -e "Script added to ~/.bashrc, please restart your terminal session or run: \n\tsource ~/.bashrc"
   ;;
esac

echo -e "New commands that will be available in new terminal session: \n\tchrome-default \n\tchrome-3pcd \n\tchrome-default-ps \n\tchrome-3pcd-ps"

# Source into current terminal session as well
source ~/bin/chrome_launcher.sh
