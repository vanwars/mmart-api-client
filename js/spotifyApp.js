var musicApp = angular.module('MusicApp', []);
/*
Helper directive to handle the "enter key being pressed (i.e. submit form)"
Ignore this code for now:
*/
angular.module("MusicApp").directive('dlEnterKey', function() {
    return function(scope, element, attrs) {
    	element.bind("keydown keypress", function(event) {
            var keyCode = event.which || event.keyCode;
            if (keyCode === 13) { // If enter key is pressed
            	scope.$apply(function() {
                    // Evaluate the expression
                    scope.$eval(attrs.dlEnterKey);
                });
                event.preventDefault();
            }
        });
    };
});

/*
Your code that queries the Spotify API:
*/
var spotifyURL = "https://api.spotify.com/v1/search";
musicApp.controller('MusicController', function ($scope, $http) {
  	var processData = function(response) {
  		// add the resulting data to the scope
  		// so that your HTML template has access
  		// to it
    	console.log(response);
    	$scope.albums = response.albums;
  	};
  	$scope.doSearch = function () {
  		// issue the query:
  		$http.get(spotifyURL, {
      		params: {
        		q: $scope.searchTerm,
        		type: "album"
      		}
    	}).success(processData);
  	};
});