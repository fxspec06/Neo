#!/bin/bash

BUILD_ANDROID="Y"
ANDROID_DEBUG="Y"
ANDROID_RELEASE="Y"


#CUSTOM ENYO MINIFY & DEPLOY SCRIPT
#BUILDS SITE FROM DROPBOX/XXX FOLDER AND
	#INSERTS DEPLOYABLE, MINIFIED APPLICATION INTO DROPBOX/PUBLIC FOLDER
#REQUIRES node.js AND git bash TO BE INSTALLED ON USER'S SYSTEM
	#FOR DROPBOX DEPLOYMENT, REQUIRES DROPBOX INSTALLED

#TO USE: cd into your app's directory and start bash
	# > BUILD=N NEW=N LOCATION="my_deploy_path/folder" ./BUILD_SITE.sh

#APP_PATH is the parent directory of the folder containing your application
	#RECOMMENDED DROPBOX FOLDER
if [ !$APP_PATH ]; then
	APP_PATH="C:/Users/Bryan/Dropbox/Jake-Bryan/"; fi

#APP_NAME is the name of your application, and the folder of your application directory
if [ !$APP_NAME ]; then
	APP_NAME="Neo"; fi

#DEPLOY_PATH is the place you wish to copy your newly minified application; USES APP_NAME as folder name
	#RECOMMENDED DROPBOX PUBLIC FOLDER
if [ !$DEPLOY_PATH ]; then
	DEPLOY_PATH="C:/Users/Bryan/Dropbox/Public/Neo"; fi

#DROPBOX_URL is the final URL to visit containing your newly minified application
if [ !$DROPBOX_URL ]; then
	DROPBOX_URL="https://dl.dropboxusercontent.com/u/40574271/Neo"; fi

clear
echo "> BUILD=$BUILD NEW=$NEW LOCATION=$LOCATION"
echo
echo "Building site for deployment..."
echo "	use BUILD=N to skip minification"
echo "	use NEW=N to skip deletion of old files before copy"
echo "	use LOCATION=\"\" to specify copy location for deployment; defaults to \"$DEPLOY_PATH\""
echo "	use BUILD_ANDROID=\"N\" to prevent automatic Android builds"
echo "		use ANDROID_DEBUG=\"N\" to prevent automatic building of debug .apk's"
echo "		use ANDROID_RELEASE=\"N\" to prevent automatic building of signed release .apk's"

echo

if [[ $BUILD != "N" ]]; then

echo "Calling deploy.js, please ensure node.js is installed on system..."

cd $APP_PATH/$APP_NAME
node enyo/tools/deploy.js

else

echo "BUILD=N target specified; skipping minification."

fi

echo

if [[ $NEW != "N" ]] && [[ !$LOCATION ]]; then

	LOCATION=$DEPLOY_PATH
	if [ -d "$LOCATION" ]; then
		rm -r -f $LOCATION
		echo "Removing old package from \"$LOCATION\"..."
	fi
	mkdir $LOCATION

elif [[ !$LOCATION ]] && [[ $NEW == "N" ]]; then

	LOCATION=$DEPLOY_PATH
	echo "NEW=N specified; keeping old files."
	echo "WARNING: Site may not load correctly unless removing all old files first! USE WITH CAUTION!"

elif [[ !$LOCATION ]] && [[ $NEW != "N" ]]; then

	echo "LOCATION specified, checking directory..."
	if [ -d "$LOCATION" ]; then
		rm -r -f $LOCATION
		echo "Removing old package from \"$LOCATION\"..."
	fi
	echo "Creating \"$LOCATION\"..."
	mkdir $LOCATION

elif [[ !$LOCATION ]] && [[ $NEW == "N" ]]; then

	LOCATION=$DEPLOY_PATH
	echo "NEW=N specified; keeping old files."
	echo "WARNING: Site may not load correctly unless removing all old files first! USE WITH CAUTION!"

fi

echo

echo "Copying minified site to \"$LOCATION\"..."
cp appinfo.json deploy/"$APP_NAME"/
cp framework_config.json deploy/"$APP_NAME"/
cp -r deploy/"$APP_NAME"/* "$LOCATION"


echo
echo "Copying minified package to NeoDroided..."
cp -r -f deploy/"$APP_NAME"/* "../Neo ANDROID/assets/"


if [[ $BUILD_ANDROID == "Y" ]]; then
	if [[ !$LOCATION ]]; then LOCATION=$DEPLOY_PATH; fi
	if [[ $LOCATION == "" ]]; then LOCATION=$DEPLOY_PATH; fi

	echo
	echo "Creating Android packages..."
	echo
	cd "$APP_PATH/Neo Android"

	echo "Cleaning Android directory..."
	echo
	ant -q clean
	echo

	#android update project -t android-11 -s -n "Neo Droided" --path .

	if [[ $ANDROID_DEBUG == "Y" ]]; then
		echo
		echo "Building debug .apk ..."
		echo
		ant -q debug
		echo
		echo "Copying 'Neo Droided-debug.apk' to "$LOCATION/../
		cp "bin/Neo Droided-debug.apk" $LOCATION/../
		echo "Success!"
		echo
	fi

	if [[ $ANDROID_RELEASE == "Y" ]]; then
		echo
		echo "Building release (signed) .apk ..."
		echo
		ant -q release
		echo
		echo "Copying 'Neo Droided-release.apk' to "$LOCATION/../
		cp "bin/Neo Droided-release.apk" $LOCATION/../
		echo "Success!"
		echo
	fi
fi

echo

if [[ $LOCATION == $DEPLOY_PATH ]]; then
	echo "Success! Please view site at: \"$DROPBOX_URL/index.html\"";
else
	echo "Success! Please view site at: \"$LOCATION/$APP_NAME/index.html\"";
fi

echo
exit 0
