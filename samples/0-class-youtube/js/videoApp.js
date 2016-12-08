var videoApp = angular.module('VideoApp', []);
// Some initialization code (ignore for now). 
// Used to allow this app to pull down Youtube videos:
videoApp.config(function($sceDelegateProvider) {
  	$sceDelegateProvider.resourceUrlWhitelist([
    	'self',
    	'https://www.youtube.com/**',
    	'https://spotify.com/**'
  	]); 
});

var APIEndpoint = "https://mmart162-api.herokuapp.com/videos/";
//var APIEndpoint = "http://localhost:3000/videos/";
videoApp.controller('VideoController', function ($scope, $http) {

    $scope.errorMessage = null;
    $scope.video = {};

    // this code updates all of the models
    // which redraws the screen because of 
    // two-way data binding:
    var processData = function (response) {
    	$scope.videos = response;
    };

    // this code clears the form:
    $scope.clear = function () {
    	$scope.video = {};
    	$scope.errorMessage = null;
    };

    // this code displays errors:
    var processError = function (response) {
        console.log(response);
        $scope.errorMessage = response.error;
    };

    // this code executes if 
    var processSuccess = function () {
    	$scope.clear();
	    $scope.getVideos();
    }

    // this code queries the API using a GET request:
    $scope.getVideos = function () {
    	$http.get(APIEndpoint, {
      		params: {
      			// replace this with one of the valid params in the 
      			// Google Doc (youtube_id, username, genre, description)
        		some_param: "some value" 

      		}
    	}).success(processData);
    };

    // this code adds new videos:
    $scope.addVideo = function() {
    	if($scope.video._id) {
    		// if the video already exists, do a PUT request:
	        $http.put(APIEndpoint + $scope.video._id + "/", $scope.video)
	        .success($scope.clear).error(processError);
	    } else {
	    	// if it is a new video, do a POST request:
	    	$http.post(APIEndpoint, $scope.video)
	        .success(processSuccess).error(processError);
	    }

    };

    // this code deletes a video using the DELETE request:
    $scope.deleteVideo = function(id) {
    	$http.delete(APIEndpoint + id + "/")
        .success(function () {
           	//requery videos:
        	$scope.getVideos();
        }).error(processError);
    };
    $scope.getVideos();

    // this code populates the edit form based on the
    // video the user wants to edit:
    $scope.editVideo = function(id) {
    	for (var i = 0; i < $scope.videos.length; i++ ) {
    		if ($scope.videos[i]._id == id) {
    			$scope.video = $scope.videos[i];
    			return;
    		}
    	}
    };

    

    // when the page initializes, 
    // call the getVideos function:
    $scope.getVideos();
});
