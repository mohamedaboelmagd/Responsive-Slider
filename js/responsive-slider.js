var ResponsiveSlider = (function() {
	"use strict";

	//sliderArray array has images for slider
	var sliderArray = [];
	//urlArray array makes to get first url of json
	var urlArray = [];
	var counter = 1;
	/**
	 * Class Slider takes args{id slider}, url{path of json}
	 * @param {args} id of slider
	 * @param {url} path of json
	 */
	var Slider = function(args,url) {
		//urlArray array makes to get first url of json
		urlArray.push(url);
		this.url = url.replace('{step}',counter);
		/*
		* function urlExists to check existence of url
		* @param {url} url of json
		*/
		Slider.prototype.urlExists = function (url)
		{
		    var http = new XMLHttpRequest();
		    http.open('GET', url, false);
		    http.send();
		    return http.status!=404;
		}
		/*
		* function getCors get data from json
		* @param {url} url of json
		* @param {success} fn The callback function
		*/
	    Slider.prototype.getCors = function(url, success) {
	        var xhr = new XMLHttpRequest();
	        if (!('withCredentials' in xhr)) xhr = new XDomainRequest(); // fix IE8/9
	        xhr.open('GET', url);
	        xhr.responseType = 'application/json';
	        xhr.onload = success;
	       	xhr.send();
	        return xhr;
	    }
	    /*
		* function getData makes operations on data
		* get totalPages, nextPage from json data
		*/
	    Slider.prototype.getData = function() {
	        var that = this;

	        var xhr = that.getCors(that.url, function(request) {
	            var response = JSON.parse(request.currentTarget.response || request.target.responseText);
	            var totalPages = Math.ceil(response.meta.pagination.total / response.meta.pagination.count);

	            var nextPage = response.meta.pagination.page + 1;

	            var data = response.data;
	            //loops data to get source of image and title of image
	            for (var i = data.length - 1; i >= 0; i--) {
	                var srcImg = data[i].links.logo;
	                var titleImg = 'page' + response.meta.pagination.page + ' item' + i + ' ' + data[i].name;
	                var descriptionImg = data[i].description;

	                var node = document.createElement("img");

	                var srcNode = document.createAttribute("src");
	                srcNode.value = srcImg;
	                node.setAttributeNode(srcNode);
	                var titleNode = document.createAttribute("title");
	                titleNode.value = titleImg;
	                node.setAttributeNode(titleNode);

	                document.getElementById("slider").appendChild(node);
	            };
	            /* if nextPage is less than totalPage
	            *  or if currentPage is last page
	            *  then playSlider for next page to show more images in slider */
	            if (nextPage <= totalPages || response.meta.pagination.page == totalPages) {
	                that.playSlider(args,url).gotoSlide((response.meta.pagination.count*response.meta.pagination.page)-(response.meta.pagination.count-1));
	            }
	        });
	    }
	    /*
		* function playSlider makes to start slider
		* @param {args} element of slider
		* @param {url} url of json
		*/
	    Slider.prototype.playSlider = function(args,url) {
			var slider = new ResponsiveSlider.Slider(args,url);
		    slider.start();
		    return slider;
		}
		/*
		* function resquestSlideOfPage request new data from next page
		* @param {counter} next page
		*/
		Slider.prototype.resquestSlideOfPage = function(counter) {
			urlArray.splice(1);
		    var jsonFile = urlArray[0].replace('{step}',counter);
		    var checkerURL = new ResponsiveSlider.Slider(args,jsonFile).urlExists(jsonFile);
			//if url existence get data
		    if(checkerURL){
		        var slider = new ResponsiveSlider.Slider(args,jsonFile).getData();
		    }else{
		        this.playSlider(args,jsonFile);
		    }
		}

		/*
		* function run slider
		*/
		Slider.prototype.run = function() {
			urlArray.splice(1);
		    var jsonFile = urlArray[0].replace('{step}',counter);
		    var slider = new ResponsiveSlider.Slider(args,jsonFile).getData();
		}

		// Defaults
		this.settings = {
			selector: '',
			height: 'auto', // "auto" | px value
			initialHeight: "auto", // for "auto" | px value
			maxHeight: 600, // for "auto" | px value
			interval: 4000,
			transitionDuration: 700,
			effect: 'slide',
			disableNav: false,
			previousNavSelector: '',
			nextNavSelector: '',
			moreNavSelector: '',
			classes: {
				container: 'responsive-slider',
				slide: 'rs-slide',
				previousSlide: 'rs-previous-slide',
				currentSlide: 'rs-current-slide',
				nextSlide: 'rs-next-slide',
				previousNav: 'rs-previous-nav',
				nextNav: 'rs-next-nav',
				moreNav: 'rs-more-nav',
				directionPrevious: 'rs-direction-previous',
				directionNext: 'rs-direction-next'
			},
			onInit: function() {},
			onStart: function() {},
			onStop: function() {},
			onDestroy: function() {},
			beforeChange: function() {},
			afterChange: function() {}
		};

		// Parse args
		if (typeof args === 'string') {
			this.settings.selector = args;
		} 

		// Slider (container) element
		var sliderEl = document.querySelector(this.settings.selector);

		if (!sliderEl) return null;

		var origChildren = toArray(sliderEl.children),
			validSlides = [];
		for (var i = origChildren.length - 1; i >= 0; i--) {
			if(origChildren[i].nodeName == 'IMG'){
				sliderArray.push(origChildren[i]);
			}
		}
		var origChildren = toArray(sliderArray);
		sliderEl.innerHTML = '';
		//remove images tag inside element of slider
		Array.prototype.forEach.call( sliderEl.querySelectorAll('img'), function( node ) {
		    node.parentNode.removeChild( node );
		});

		Array.prototype.forEach.call(origChildren, function(slide, i) {
			if (slide instanceof HTMLImageElement || slide instanceof HTMLAnchorElement) {
				var slideEl = document.createElement('a'),
					href = '',
					target = '';

				if (slide instanceof HTMLAnchorElement) {
					href = slide.getAttribute('href');
					target = slide.getAttribute('target');

					var img = slide.querySelector('img');
					if (img !== null) {
						slide = img;
					} else {
						return;
					}
				}

				if (typeof slide.dataset !== 'undefined') {
					if (slide.dataset.src) {
						// Use data-src for on-demand loading
						slideEl.dataset.src = slide.dataset.src;
					} else {
						slideEl.dataset.src = slide.src;
					}
				} else {
					// IE
					if (slide.getAttribute('data-src')) {
						slideEl.setAttribute('data-src', slide.getAttribute('data-src'));
					} else {
						slideEl.setAttribute('data-src', slide.getAttribute('src'));
					}
				}

				if (href) slideEl.setAttribute('href', href);
				if (target) slideEl.setAttribute('target', target);
				if (slide.getAttribute('className')) addClass(slideEl, slide.getAttribute('className'));
				if (slide.getAttribute('id')) slideEl.setAttribute('id', slide.getAttribute('id'));
				if (slide.getAttribute('title')) slideEl.setAttribute('title', slide.getAttribute('title'));
				if (slide.getAttribute('alt')) slideEl.innerHTML = slide.getAttribute('alt');
				slideEl.setAttribute('role', 'tabpanel');
				slideEl.setAttribute('aria-hidden', 'true');

				slideEl.style.cssText += '-webkit-transition-duration:' + this.settings.transitionDuration + 'ms;-moz-transition-duration:' + this.settings.transitionDuration + 'ms;-o-transition-duration:' + this.settings.transitionDuration + 'ms;transition-duration:' + this.settings.transitionDuration + 'ms;';

				sliderEl.appendChild(slideEl);
				validSlides.push(slideEl);
			}
		}.bind(this));

		var slides = validSlides;
		if (slides.length <= 1) {
			sliderEl.innerHTML = '';
			Array.prototype.forEach.call(origChildren, function(child, i) {
				sliderEl.appendChild(child);
			});
			return null;
		}

		// Create navigation
		if (!this.settings.disableNav) {
			var previousNav, nextNav, moreNav;
			if (this.settings.previousNavSelector) {
				previousNav = document.querySelector(this.settings.previousNavSelector);
			} else {
				previousNav = document.createElement('a');
				sliderEl.appendChild(previousNav);
			}
			if (this.settings.nextNavSelector) {
				nextNav = document.querySelector(this.settings.nextNavSelector);
			} else {
				nextNav = document.createElement('a');
				sliderEl.appendChild(nextNav);
			}

			if (this.settings.moreNavSelector) {
				moreNav = document.querySelector(this.settings.moreNavSelector);
			} else {
				moreNav = document.createElement('a');
				sliderEl.appendChild(moreNav);
			}

			addClass(previousNav, this.settings.classes.previousNav);
			addClass(nextNav, this.settings.classes.nextNav);
			addClass(moreNav, this.settings.classes.moreNav);
			addEvent(previousNav, 'click', function() {
				this.stop();
				this.previousSlide();
			}.bind(this));
			addEvent(nextNav, 'click', function() {
				this.stop();
				this.nextSlide();
			}.bind(this));
			addEvent(moreNav, 'click', function() {
				this.stop();
				this.nextMoreSlide();
			}.bind(this));
		}

		// Create internal attributes
		this.attributes = {
			container: sliderEl,
			slides: slides,
			previousSlide: typeof slides[slides.length - 1] !== 'undefined' ? slides[slides.length - 1] : slides[0],
			currentSlide: slides[0],
			nextSlide: typeof slides[1] !== 'undefined' ? slides[1] : slides[0],
			timerId: 0,
			origChildren: origChildren, // Used in destroy()
			aspectWidth: 0,
			aspectHeight: 0
		};

		// Set height
		if (isInteger(this.settings.height)) {
			this.attributes.container.style.height = this.settings.height + 'px';
		} else {
			if (isInteger(this.settings.initialHeight)) {
				this.attributes.container.style.height = this.settings.initialHeight + 'px';
			}

			// If aspect ratio parse and store
			if (this.settings.height.indexOf(':') > -1) {
				var aspectRatioParts = this.settings.height.split(':');
				if (aspectRatioParts.length == 2 && isInteger(parseInt(aspectRatioParts[0], 10)) && isInteger(parseInt(aspectRatioParts[1], 10))) {
					this.attributes.aspectWidth = parseInt(aspectRatioParts[0], 10);
					this.attributes.aspectHeight = parseInt(aspectRatioParts[1], 10);
				}
			}

			addEvent(window, 'resize', function() {
				setContainerHeight(this);
			}.bind(this));
		}

		// Add classes
		addClass(sliderEl, this.settings.classes.container);
		addClass(sliderEl, 'rs-effect-' + this.settings.effect);
		Array.prototype.forEach.call(this.attributes.slides, function(slide, i) {
			addClass(slide, this.settings.classes.slide);
		}.bind(this));
		addClass(this.attributes.previousSlide, this.settings.classes.previousSlide);
		addClass(this.attributes.currentSlide, this.settings.classes.currentSlide);
		addClass(this.attributes.nextSlide, this.settings.classes.nextSlide);

		// ARIA
		this.attributes.currentSlide.setAttribute('aria-hidden', 'false');

		// Load first image
		loadImg(this.attributes.currentSlide, (function() {
			this.settings.onInit.apply(this);
			setContainerHeight(this);
		}).bind(this));
		// Preload next images
		loadImg(this.attributes.previousSlide);
		loadImg(this.attributes.nextSlide);
	};

	/*
	 * requestAnimationFrame polyfill
	 */
	var requestAnimationFrame = function(win, t) {
		return win["r" + t] || win["webkitR" + t] || win["mozR" + t] || win["msR" + t] || function(fn) {
			setTimeout(fn, 1000 / 60);
		};
	}(window, 'equestAnimationFrame');

	/**
	 * Behaves the same as setTimeout except uses requestAnimationFrame() where possible for better performance
	 * @param {function} fn The callback function
	 * @param {int} delay The delay in milliseconds
	 * @return {vallue} for animation
	 */
	var requestTimeout = function(fn, delay) {
		var start = new Date().getTime(),
			handle = {};

		function loop() {
			var current = new Date().getTime(),
				delta = current - start;

			if (delta >= delay) {
				fn.call();
			} else {
				handle.value = requestAnimationFrame(loop);
			}
		}

		handle.value = requestAnimationFrame(loop);
		return handle;
	};

	/*
	 * Helper functions
	 */
	var isInteger = function(x) {
		return Math.round(x) === x;
	};

	var hasClass = function(el, className) {
		if (!className) return false;
		if (el.classList) {
			return el.classList.contains(className);
		} else {
			return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
		}
	};

	var addClass = function(el, className) {
		if (!className) return;
		if (el.classList) {
			el.classList.add(className);
		} else {
			el.className += ' ' + className;
		}
	};

	var removeClass = function(el, className) {
		if (!className) return;
		if (el.classList) {
			el.classList.remove(className);
		} else {
			el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
		}
	};

	var toArray = function(obj) {
		return Array.prototype.slice.call(obj);
	};

	var addEvent = function(object, type, callback) {
		if (object === null || typeof(object) === 'undefined') return;

		if (object.addEventListener) {
			object.addEventListener(type, callback, false);
		} else if (object.attachEvent) {
			object.attachEvent("on" + type, callback);
		} else {
			object["on" + type] = callback;
		}
	};

	var loadImg = function(slide, callback) {
		if (!slide.style.backgroundImage) {
			var img = new Image();
			img.setAttribute('src', slide.getAttribute('data-src'));
			img.onload = function() {
				slide.style.backgroundImage = 'url(' + slide.getAttribute('data-src') + ')';
				slide.setAttribute('data-actual-width', this.naturalWidth);
				slide.setAttribute('data-actual-height', this.naturalHeight);
				if (typeof(callback) === 'function') callback(this);
			};
		}
	};

	var setContainerHeight = function(slider) {
		// If it's a fixed height then don't change the height
		if (isInteger(slider.settings.height)) {
			return;
		}

		var currentHeight = Math.round(slider.attributes.container.offsetHeight),
			newHeight = currentHeight;

		if (slider.attributes.aspectWidth && slider.attributes.aspectHeight) {
			// Aspect ratio
			newHeight = (slider.attributes.aspectHeight / slider.attributes.aspectWidth) * slider.attributes.container.offsetWidth;
		} else {
			// Auto
			var width = slider.attributes.currentSlide.getAttribute('data-actual-width');
			var height = slider.attributes.currentSlide.getAttribute('data-actual-height');

			if (width && height) {
				newHeight = (height / width) * slider.attributes.container.offsetWidth;
			}
		}

		var maxHeight = parseInt(slider.settings.maxHeight, 10);
		if (maxHeight && newHeight > maxHeight) {
			newHeight = maxHeight;
		}

		newHeight = Math.round(newHeight);
		if (newHeight === currentHeight) {
			return;
		}

		slider.attributes.container.style.height = newHeight + 'px';
	};

	/*
	* function start runs slider
	*/
	Slider.prototype.start = function() {
		if (!this.attributes) return;
		this.attributes.timerId = setInterval(this.nextSlide.bind(this), this.settings.interval);
		this.settings.onStart.apply(this);
		this.addCaptions();

		// Stop if window blur
		window.onblur = function() {
			this.stop();
		}.bind(this);
	};
	/*
	* function stop stops slider
	*/
	Slider.prototype.stop = function() {
		if (!this.attributes) return;
		clearInterval(this.attributes.timerId);
		this.attributes.timerId = 0;
		this.settings.onStop.apply(this);
	};
	/*
	* function previousSlide get previous image of slider
	*/
	Slider.prototype.previousSlide = function() {
		this.settings.beforeChange.apply(this);
		removeClass(this.attributes.previousSlide, this.settings.classes.previousSlide);
		removeClass(this.attributes.currentSlide, this.settings.classes.currentSlide);
		removeClass(this.attributes.nextSlide, this.settings.classes.nextSlide);
		this.attributes.currentSlide.setAttribute('aria-hidden', 'true');

		var slides = this.attributes.slides,
			index = slides.indexOf(this.attributes.currentSlide);
		this.attributes.nextSlide = this.attributes.currentSlide;
		this.attributes.previousSlide = slides[index - 2];
		this.attributes.currentSlide = slides[index - 1];
		if (typeof this.attributes.currentSlide === 'undefined' &&
			typeof this.attributes.previousSlide === 'undefined') {
			this.attributes.currentSlide = slides[slides.length - 1];
			this.attributes.previousSlide = slides[slides.length - 2];
		} else {
			if (typeof this.attributes.previousSlide === 'undefined') {
				this.attributes.previousSlide = slides[slides.length - 1];
			}
		}

		// Preload next image
		loadImg(this.attributes.previousSlide);

		addClass(this.attributes.previousSlide, this.settings.classes.previousSlide);
		addClass(this.attributes.currentSlide, this.settings.classes.currentSlide);
		addClass(this.attributes.nextSlide, this.settings.classes.nextSlide);
		this.attributes.currentSlide.setAttribute('aria-hidden', 'false');

		addClass(this.attributes.container, this.settings.classes.directionPrevious);
		requestTimeout(function() {
			removeClass(this.attributes.container, this.settings.classes.directionPrevious);
		}.bind(this), this.settings.transitionDuration);

		setContainerHeight(this);
		this.settings.afterChange.apply(this);
	};
	/*
	* function nextSlide get next image of slider
	*/
	Slider.prototype.nextSlide = function() {
		this.settings.beforeChange.apply(this);
		removeClass(this.attributes.previousSlide, this.settings.classes.previousSlide);
		removeClass(this.attributes.currentSlide, this.settings.classes.currentSlide);
		removeClass(this.attributes.nextSlide, this.settings.classes.nextSlide);
		this.attributes.currentSlide.setAttribute('aria-hidden', 'true');

		var slides = this.attributes.slides,
			index = slides.indexOf(this.attributes.currentSlide);
		this.attributes.previousSlide = this.attributes.currentSlide;
		this.attributes.currentSlide = slides[index + 1];
		this.attributes.nextSlide = slides[index + 2];
		
		if (typeof this.attributes.currentSlide === 'undefined' &&
			typeof this.attributes.nextSlide === 'undefined') {
			this.attributes.currentSlide = slides[0];
			this.attributes.nextSlide = slides[1];
		} else {
			if (typeof this.attributes.nextSlide === 'undefined') {
				this.attributes.nextSlide = slides[0];
			}
		}

		// Preload next image
		loadImg(this.attributes.nextSlide);

		addClass(this.attributes.previousSlide, this.settings.classes.previousSlide);
		addClass(this.attributes.currentSlide, this.settings.classes.currentSlide);
		addClass(this.attributes.nextSlide, this.settings.classes.nextSlide);
		this.attributes.currentSlide.setAttribute('aria-hidden', 'false');

		addClass(this.attributes.container, this.settings.classes.directionNext);
		requestTimeout(function() {
			removeClass(this.attributes.container, this.settings.classes.directionNext);
		}.bind(this), this.settings.transitionDuration);

		setContainerHeight(this);
		this.settings.afterChange.apply(this);
	};
	/*
	* function nextMoreSlide get next page for slider
	* @params {index} (int) index of next page 
	*/
	Slider.prototype.nextMoreSlide = function(index) {
		var slides = this.attributes.slides,
			index = slides.indexOf(this.attributes.currentSlide);
		//if (slides.length-1 == index) {
			counter++;
			this.resquestSlideOfPage(counter); 
		//}
	};
	/*
	* function gotoSlide makes index of image active
	* @params {index} (int) index of image 
	*/
	Slider.prototype.gotoSlide = function(index) {
		this.settings.beforeChange.apply(this);
		this.stop();

		removeClass(this.attributes.previousSlide, this.settings.classes.previousSlide);
		removeClass(this.attributes.currentSlide, this.settings.classes.currentSlide);
		removeClass(this.attributes.nextSlide, this.settings.classes.nextSlide);
		this.attributes.currentSlide.setAttribute('aria-hidden', 'true');

		index--; // Index should be 1-indexed
		var slides = this.attributes.slides,
			oldIndex = slides.indexOf(this.attributes.currentSlide);
		this.attributes.previousSlide = slides[index - 1];
		this.attributes.currentSlide = slides[index];
		this.attributes.nextSlide = slides[index + 1];
		if (typeof this.attributes.previousSlide === 'undefined') {
			this.attributes.previousSlide = slides[slides.length - 1];
		}
		if (typeof this.attributes.nextSlide === 'undefined') {
			this.attributes.nextSlide = slides[0];
		}

		// Load images
		loadImg(this.attributes.previousSlide);
		loadImg(this.attributes.currentSlide);
		loadImg(this.attributes.nextSlide);

		addClass(this.attributes.previousSlide, this.settings.classes.previousSlide);
		addClass(this.attributes.currentSlide, this.settings.classes.currentSlide);
		addClass(this.attributes.nextSlide, this.settings.classes.nextSlide);
		this.attributes.currentSlide.setAttribute('aria-hidden', 'false');

		if (index < oldIndex) {
			addClass(this.attributes.container, this.settings.classes.directionPrevious);
			requestTimeout(function() {
				removeClass(this.attributes.container, this.settings.classes.directionPrevious);
			}.bind(this), this.settings.transitionDuration);
		} else {
			addClass(this.attributes.container, this.settings.classes.directionNext);
			requestTimeout(function() {
				removeClass(this.attributes.container, this.settings.classes.directionNext);
			}.bind(this), this.settings.transitionDuration);
		}

		setContainerHeight(this);
		this.settings.afterChange.apply(this);
	};
	/*
	* function addCaptions add description for slides
	*/
	Slider.prototype.addCaptions = function() {
		addClass(this.attributes.container, 'rs-has-captions');

		Array.prototype.forEach.call(this.attributes.slides, function(slide, i) {
			var caption = document.createElement('div');
			addClass(caption, 'rs-caption');

			var captionContent = '';
			if (slide.getAttribute('title')) {
				captionContent += '<div class="rs-caption-title">' + slide.getAttribute('title') + '</div>';
			}
			if (slide.getAttribute('data-caption')) {
				var dataCaption = slide.getAttribute('data-caption');
				if (dataCaption.substring(0, 1) == '#' || dataCaption.substring(0, 1) == '.') {
					var external = document.querySelector(dataCaption);
					if (external) {
						captionContent += '<div class="rs-caption-content">' + external.innerHTML + '</div>';
					}
				} else {
					captionContent += '<div class="rs-caption-content">' + slide.getAttribute('data-caption') + '</div>';
				}
			} else {
				if (slide.innerHTML) {
					captionContent += '<div class="rs-caption-content">' + slide.innerHTML + '</div>';
				}
			}

			slide.innerHTML = '';
			if (captionContent) {
				caption.innerHTML = captionContent;
				slide.appendChild(caption);
			}
		}.bind(this));
	};

	return {
		hasClass: hasClass,
		addClass: addClass,
		removeClass: removeClass,
		Slider: Slider
	};

})();
