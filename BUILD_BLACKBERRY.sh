#c:\bbndk\bbndk-env
./C:/bbndk/bbndk-env.sh
cd "C:\Users\Bryan\Dropbox\Jake-Bryan\Neo"
echo beginning deploy script...
node enyo/tools/deploy.js

echo preparing webworks package...
cp config.xml deploy/Neo
cp appinfo.json deploy/Neo
cp framework_config.json deploy/Neo
cp icon_86.png deploy/Neo
cp bbsplash.png deploy/Neo
cp _icon.png deploy/Neo
rm deploy/Neo/icon.png

echo packaging zip...
rm -f deploy/Neo.zip
cd deploy/Neo
zip -r -q ./../Neo.zip *
cd ../../
echo creating signed bar for testing...

set JAVA_HOME=C:\Program Files\Java\jre

if [[ $DEBUG == "Y" ]]; then
bbwp deploy/Neo.zip -d -g hal02fan -o deploy; else
bbwp deploy/Neo.zip -g hal02fan -o deploy; fi

if [[ $TARGET == "PB" ]]; then
echo deploying to playbook...
blackberry-deploy -installApp -device 192.168.0.198 deploy/Neo.bar -password 00011000
fi

if [ $TARGET == "BB10" ]; then
echo deploying to simulator...
blackberry-deploy -installApp -device 192.168.184.138 deploy/Neo.bar -password 00011000
fi
