FG_GREEN="$(tput setaf 2)"
BG_GREEN="$(tput setab 2)"


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

echo -n ${BG_GREEN}
echo 'Installation successfully completed'
echo $(tput sgr0)

