export const DEPLOY_TEMPLATE = `
# server will pass to "$1" variable

ssh $1 "rm -rf ~/build.zip"

scp build.zip $1:/home/user

ssh $1 'cd /home/user && unzip build.zip /home/user/app && rm build.zip'

ssh $1 "source ~/.nvm/nvm.sh && pm2 restart [process]"

`