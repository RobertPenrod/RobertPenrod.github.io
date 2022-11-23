/*
	Dimension by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

initializeProjectDivs = function()
{
	project_divs = document.getElementsByClassName("project-div");
	console.log("Found", project_divs.length, "project divs.");
	for(var i = 0; i < project_divs.length; i++)
	{
		project_divs[i].onmouseup = function() {
			if(event.which == 1)
			{
				// Add class for mouseUp animations.
				if(!$(this).hasClass('no-mouseUp')) {
					$(this).addClass('project-div-mouseUp');
				}
			}
		};
	}
};

resetProjectDivs = function()
{
	console.log("reseting project divs");
	for(var i = 0; i < project_divs.length; i++)
	{
		$(project_divs[i]).removeClass('project-div-mouseUp');
	}
};


(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		$main_articles = $main.children('article');
		$main_divs = $main.children('div');

		// Project Divs
		initializeProjectDivs();


	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Fix: Flexbox min-height bug on IE.
		if (browser.name == 'ie') {

			var flexboxFixTimeoutId;

			$window.on('resize.flexbox-fix', function() {

				clearTimeout(flexboxFixTimeoutId);

				flexboxFixTimeoutId = setTimeout(function() {

					if ($wrapper.prop('scrollHeight') > $window.height())
						$wrapper.css('height', 'auto');
					else
						$wrapper.css('height', '100vh');

				}, 250);

			}).triggerHandler('resize.flexbox-fix');

		}

	// Nav.
		var $nav = $header.children('nav'),
			$nav_li = $nav.find('li');

		// Add "middle" alignment classes if we're dealing with an even number of items.
			if ($nav_li.length % 2 == 0) {

				$nav.addClass('use-middle');
				$nav_li.eq( ($nav_li.length / 2) ).addClass('is-middle');

			}

	// Main.
		var	delay = 325,
			locked = false;

		// Methods.
			$main._show = function(id, initial) {

//console.log("Main Function:", id);

				var $article = $main_articles.filter('#' + id);
				var $div = $main_divs.filter('#' + id);
				
//console.log($div.length);

				// No such article? Bail.
					if ($article.length == 0 && $div.length == 0) {
//console.log("bailing");
						return;
					}


				// Handle lock.

					// Already locked? Speed through "show" steps w/o delays.
						if (locked || (typeof initial != 'undefined' && initial === true)) {
//console.log("locked");
							// Mark as switching.
								$body.addClass('is-switching');

							// Mark as visible.
								$body.addClass('is-article-visible');

							// Deactivate all articles (just in case one's already active).
								$main_articles.removeClass('active');
								$main_divs.removeClass('active');

							// Hide header, footer.
								$header.hide();
								$footer.hide();

							// Show main, article.
								$main.show();
								$article.show();
								$div.show();
//console.log("Showing div");

							// Activate article.
								$article.addClass('active');
								$div.addClass('active');

							// Unlock.
								locked = false;

							// Unmark as switching.
								setTimeout(function() {
									$body.removeClass('is-switching');
									restoreScroll();
								}, (initial ? 1000 : 0));

							return;

						}

					// Lock.
						locked = true;

				// Article already visible? Just swap articles.
					if ($body.hasClass('is-article-visible')) {
//console.log("article-is-visible");
						// Deactivate current article.
							var $currentArticle = $main_articles.filter('.active');
							var $currentDiv = $main_divs.filter('.active');

							$currentArticle.removeClass('active');
							$currentDiv.removeClass('active');

						// Show article.
							setTimeout(function() {

								resetProjectDivs();

								// Hide current article.
									$currentArticle.hide();

								// Show article.
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												//.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');
											restoreScroll();
										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

				// Otherwise, handle as normal.
					else {
//console.log("else");
						// Mark as visible.
							$body
								.addClass('is-article-visible');

						// Show article.
							setTimeout(function() {
resetProjectDivs();
								// Hide header, footer.
									$header.hide();
									$footer.hide();

								// Show main, article.
									$main.show();
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

			};

			$main._hide = function(addState) {

				var $article = $main_articles.filter('.active');

				// Article not visible? Bail.
					if (!$body.hasClass('is-article-visible'))
						return;

				// Add state?
					if (typeof addState != 'undefined'
					&&	addState === true)
						history.pushState(null, null, '#');

				// Handle lock.

					// Already locked? Speed through "hide" steps w/o delays.
						if (locked) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Deactivate article.
								$article.removeClass('active');

							// Hide article, main.
								$article.hide();
								$main.hide();

							// Show footer, header.
								$footer.show();
								$header.show();

							// Unmark as visible.
								$body.removeClass('is-article-visible');

							// Unlock.
								locked = false;

							// Unmark as switching.
								$body.removeClass('is-switching');

							// Window stuff.
								$window
									.scrollTop(0)
									.triggerHandler('resize.flexbox-fix');

							return;

						}

					// Lock.
						locked = true;

				// Deactivate article.
					$article.removeClass('active');

				// Hide article.
					setTimeout(function() {

						// Hide article, main.
							$article.hide();
							$main.hide();

						// Show footer, header.
							$footer.show();
							$header.show();

						// Unmark as visible.
							setTimeout(function() {

								$body.removeClass('is-article-visible');

								// Window stuff.
									$window
										.scrollTop(0)
										.triggerHandler('resize.flexbox-fix');

								// Unlock.
									setTimeout(function() {
										locked = false;
									}, delay);

							}, 25);

					}, delay);


			};

		// Return scroll to previous position.
		$(window).scroll(function () {

			if(location.hash == '#projects')
			{
				//set scroll position in session storage
				sessionStorage.projectScrollPos = $(window).scrollTop();
				console.log("storing scroll", $(window).scrollTop());
			}
		});
		var restoreScroll = function () {
			if(location.hash == '#projects')
			{
				//return scroll position in session storage
				$(window).scrollTop(sessionStorage.projectScrollPos);
				console.log("restoring scroll to", sessionStorage.projectScrollPos);
			}
			else
			{
				//console.log("restore failed");
				$(window).scrollTop(0);
			}
		};

		// Articles.
			$main_articles.each(function() {

				var $this = $(this);

				// Close.
					$('<div class="close">Close</div>')
						.appendTo($this)
						.on('click', function() {
							location.hash = $this.hasClass("project-article")? '#projects' : '';
						});

				// Prevent clicks from inside article from bubbling.
					$this.on('click', function(event) {
						event.stopPropagation();
					});

			});

		// Events.
			$body.on('click', function(event) {

				// Article visible? Hide.
					if ($body.hasClass('is-article-visible'))
						$main._hide(true);

			});

			$window.on('keyup', function(event) {

				switch (event.keyCode) {

					case 27:

						// Article visible? Hide.
							if ($body.hasClass('is-article-visible'))
								$main._hide(true);

						break;

					default:
						break;

				}

			});

			$window.on('hashchange', function(event) {

//console.log("hashchange");
				// Empty hash?
					if (location.hash == ''
					||	location.hash == '#') {


						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Hide.
							$main._hide();
//console.log("call _hide()");
					}

				// Otherwise, check for a matching article.
					else if ($main_articles.filter(location.hash).length > 0) {
//console.log("call _show() article:", location.hash.substr(1));
						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Show article.
							$main._show(location.hash.substr(1));
					}

				// Otherwise, check for a matching div.
				else if($main_divs.filter(location.hash).length > 0) {
//console.log("call _show() div:", location.hash.substr(1));
					// Prevent default.
						event.preventDefault();
						event.stopPropagation();

					// Show article.
						$main._show(location.hash.substr(1));
				}
			});

		// Scroll restoration.
		// This prevents the page from scrolling back to the top on a hashchange.
			if ('scrollRestoration' in history)
				history.scrollRestoration = 'manual';
			else {

				var	oldScrollPos = 0,
					scrollPos = 0,
					$htmlbody = $('html,body');

				$window
					.on('scroll', function() {

						oldScrollPos = scrollPos;
						scrollPos = $htmlbody.scrollTop();

					})
					.on('hashchange', function() {
						$window.scrollTop(oldScrollPos);
					});

			}

		// Initialize.

			// Hide main, articles.
				$main.hide();
				$main_articles.hide();

			// Initial article.
				if (location.hash != ''
				&&	location.hash != '#')
					$window.on('load', function() {
						$main._show(location.hash.substr(1), true);
					});

})(jQuery);