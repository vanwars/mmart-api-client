var imageApp = angular.module('ImageApp', []);
// Some initialization code (ignore for now). 
// Used to allow this app to pull down Youtube videos:
imageApp.config(function ($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'https://www.youtube.com/**',
        'https://spotify.com/**'
    ]);
});

imageApp.controller('ImageController', function ($scope, $http) {
    var username = "vanwars";
    //$scope.APIEndpoint = "http://localhost:3000/" + username + "/images/";
    $scope.APIEndpoint = "https://mmart162-api.herokuapp.com/" + username + "/images/";
    $scope.errorMessage = null;
    $scope.image = {
        username: username
    };

    // this code updates all of the models
    // which redraws the screen because of 
    // two-way data binding:
    var processData = function (response) {
        console.log(response);
        $scope.images = response;
    };

    // this code clears the form:
    $scope.clear = function () {
        $scope.video = {};
        $scope.errorMessage = null;
    };

    // this code displays errors:
    $scope.processError = function (response) {
        console.log(response);
        $scope.errorMessage = response.error;
    };

    // this code executes if 
    $scope.processSuccess = function () {
        $scope.clear();
        $scope.getImages();
    };

    // this code queries the API using a GET request:
    $scope.getImages = function () {
        $http.get($scope.APIEndpoint, {
            params: {
                // replace this with one of the valid params in the 
                // Google Doc (youtube_id, username, genre, description)
                some_param: "some value"
            }
        }).success(processData);
    };

    // this code adds new videos:
    $scope.uploadImage = function () {
        if ($scope.image._id) {
            // if the video already exists, do a PUT request:
            $http.put($scope.APIEndpoint + $scope.image._id + "/", $scope.image)
                .success($scope.clear).error($scope.processError);
        } else {
            var fd = new FormData();
            fd.append("image", document.getElementById("image").files[0]);
            fd.append("audio", document.getElementById("audio").files[0]);
            fd.append("file", document.getElementById("file").files[0]);
            //fd.append("username", $scope.image.username);
            fd.append("name", $scope.image.name);
            fd.append("description", $scope.image.description);
            $http.post($scope.APIEndpoint, fd, {
                headers: {
                    'Content-Type': undefined
                },
                transformRequest: angular.identity
            }).success($scope.processSuccess).error($scope.processError);
        }
    };

    // this code deletes a video using the DELETE request:
    $scope.deleteImage = function (id) {
        $http.delete($scope.APIEndpoint + id + "/")
            .success(function () {
                //requery videos:
                $scope.getImages();
            }).error($scope.processError);
    };

    // this code populates the edit form based on the
    // video the user wants to edit:
    $scope.editImage = function (id) {
        for (var i = 0; i < $scope.videos.length; i++ ) {
            if ($scope.videos[i]._id == id) {
                $scope.video = $scope.videos[i];
                return;
            }
        }
    };

    // when the page initializes, 
    // call the getImages function:
    $scope.getImages();
});
