rsync -avr -e "ssh -l username" --exclude={'package-lock.json','.DS_Store','./node_modules/*'} ./* remote:path