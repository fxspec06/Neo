<!DOCTYPE html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<title>HANSKOKXphotography beta</title>
	<!--[if lt IE 9]>
		<script type="text/javascript">
			window.location = "ie.html";
		</script>
	<![endif]-->
	
	<!-- Favicon -->
	<link rel="icon" type="image/png" href="favicon.png">
	
	<!-- Javascript -->
	<script src="http://code.jquery.com/jquery-latest.min.js" type="text/javascript"></script>
	<script src="./assets/js/slideshow.js" type="text/javascript"></script>

	<!-- Stylesheets -->
	<link rel="stylesheet" href="./styles.css" media="screen" type="text/css" />
	<link rel="stylesheet" href="./assets/css/button.css" media="all" type="text/css" />
	<link rel="stylesheet" href="./assets/css/slideshow.css" media="screen" type="text/css" />

	<!-- jQuery -->
	<script type="text/javascript">
		var startTime = (new Date()).getTime();
		console.log('Please wait while the site is loaded...');
		
		function preload(arrayOfImages) {
			$(arrayOfImages).each(function () {
				$('<img />').attr('src',this).appendTo('body').css('display','none');
			});
		};

		preload([
			'/images/dark.png',
			'/images/spinner-dark.gif',
			'/images/light.jpg'
		]);

		$(window).load(function () {
		    $('#loading_container').fadeOut(1000, function () {
		        $(this).remove();
		    });
		    var endTime = (new Date()).getTime();
		    var millisecondsLoading = (endTime - startTime) / 1000;
		    console.log('Site loaded in ' + millisecondsLoading + ' seconds.');
		});

		$(document).ready(function () {
		    $(window).resize(function () {
		        $('#loading').css({
		            top: $('#loading_container').height() / 2 - $('#loading').outerHeight() / 2
		        });
		    });

		    $(window).resize();
		});
	</script>
</head>
<body>
	<header>
		<div id="header_text" class="cursor_default">
			<div class="logo_mini"></div>
			<div class="name">HANS KOKX</div>
			<div class="title">photography</div>
		</div>
		<div id="login_button" class="button blue user-select-none">Login</div>
	</header>
	<div id="background-container">
		<div id="loading_container">
			<div id="loading">
				<div class="name" style="padding-top: 20px;">HANS KOKX</div>
				<div class="title">photography</div>
				<span class="scrim"></span>
				<div id="loadingbg" class="box-shadow"></div>
			</div>
		</div>
		<!-- Background -->
		<!-- DEBUG <div class="clearpx"></div> -->
			<div id="photos">
			<div id="default-background" class="background-photo active" style="background: url('/images/bg.png') no-repeat center center fixed; display: block;"></div>
			        <?
		            $dir = "images/slideshow/";
		            $narray=array();
		            $dh = @opendir($dir);
		            $i=0;

		            if (is_dir($dir)) {
		                if ($dh = opendir($dir)) {
		                    while($file = readdir($dh))
		                        {
		                                if(is_dir($file))
		                                {
		                                        continue;
		                                }
		                                else if(pathinfo($file, PATHINFO_EXTENSION) == 'jpg')
		                                {
		                                        $narray[$i]=$file;
		                                        $i++;
		                                }
		                        }
		                        rsort($narray);

		                        for($i=sizeof($narray)-1; $i>-1; $i--)
		                        {
		                            echo '				<div id="'.$narray[$i].'" class="background-photo">
				<img class="background-photo-img" alt="'.$dir.$narray[$i].'" src="'.$dir.$narray[$i].'" />
			</div>
';
		                        }
		                    }
		                    closedir($dh);
		                }
		echo '			</div>
		<div id="bullet_container" class="box-shadow user-select-none" style="opacity: 0; transition: opacity 1s;">
			<span id="li_slideshow_default" class="li_slideshow active" style="position: absolute; display: none;"></span>
';		        
	for($i=sizeof($narray)-1; $i>-1; $i--)
	{
		echo '				<span id="li_'.$narray[$i].'" class="li_slideshow"></span>
';
	}
	?>
		</div>
		
		<span class="arrow previous"></span>
		<span class="arrow next"></span>
	</div>
	<footer>
test
	</footer>
</body>
</html>