<?php
$ds          = DIRECTORY_SEPARATOR; 
$storeFolder = 'images/slideshow';

if (!file_exists($storeFolder)) {
	mkdir($storeFolder, 0755, true);
};

if (!empty($_FILES)) { 
    $tempFile = $_FILES['file']['tmp_name'];
    $targetPath = dirname( __FILE__ ) . $ds. $storeFolder . $ds;
    $targetFile =  $targetPath. $_FILES['file']['name'];
    move_uploaded_file($tempFile,$targetFile);
};

shell_exec("assets/scripts/blur.sh $targetPath");
?> 