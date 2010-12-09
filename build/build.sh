java \
 	-jar google-compiler-20100917.jar \
 	--js ../src/jpath.js \
 	--js_output_file ../dist/jpath-min.js
cp ../redist/* ../dist