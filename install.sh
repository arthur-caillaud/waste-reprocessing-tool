FG_GREEN="$(tput setaf 2)"
BG_GREEN="$(tput setab 2)"

# echo ''
# echo 'Installing global files...'
# npm install
# echo -n ${FG_GREEN}
# echo 'Global files installed successfully'

cd ./backend
echo ''
echo 'Installing backend...'
npm install
echo -n ${FG_GREEN}
echo 'Backend installed successfully'
echo $(tput sgr0)
cd ../frontend
echo 'Installing frontend...'
npm install
echo -n ${FG_GREEN}
echo 'Frontend installed successfully'
echo $(tput sgr0)


#Here we need to install Python, pip and use the command # pip3 install -r requirements.txt .
#This file is found in backend/datamanagement


echo -n ${BG_GREEN}
echo 'Installation successfully completed'
echo $(tput sgr0)
