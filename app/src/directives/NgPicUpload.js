/**
 * Taken from:
 * https://github.com/Mischi/angularjs-imageupload-directive
 */
angular.module('NgPicUpload', []).directive('image', ['$http', function($http) {
    'use strict'

    var URL = window.URL || window.webkitURL;

    var getResizeArea = () => {
        var resizeAreaId = 'fileupload-resize-area';
        var resizeArea = document.getElementById(resizeAreaId);

        if (!resizeArea) {
            resizeArea = document.createElement('canvas');
            resizeArea.id = resizeAreaId;
            resizeArea.style.visibility = 'hidden';
            resizeArea.style.position = 'fixed';
            resizeArea.style.top = '0';
            resizeArea.style.right = '-10px';
            document.body.appendChild(resizeArea);
        }

        return resizeArea;
    }

    var resizeImage = (origImage, options) => {
        var maxHeight = options.resizeMaxHeight || 300;
        var maxWidth = options.resizeMaxWidth || 250;
        var maxSquare = options.resizeSquare || null;
        var quality = options.resizeQuality || 0.7;
        var type = options.resizeType || 'image/jpg';
        var canvas = getResizeArea();
        var height = origImage.height;
        var width = origImage.width;

        if (maxSquare) {
            // If maxSquare is set, create a "covered" square, cutting off
            // any parts of the image that do not fit into the square.
            // ...
            width = maxSquare;
            height = maxSquare;
        } else {
            // Calculate the width and height, constraining the proportions
            if (width > height) {
                if (width > maxWidth) {
                    height = Math.round(height *= maxWidth / width);
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = Math.round(width *= maxHeight / height);
                    height = maxHeight;
                }
            }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw image and get data from canvas.
        var ctx = canvas.getContext("2d");
        ctx.drawImage(origImage, 0, 0, width, height);
        return canvas.toDataURL(type, quality);
    };

    var createImage = url => {
        return new Promise((resolve, reject) => {
            var image = new Image();
            image.onload = () => resolve(image);
            image.src = url;
        });
    };

    var fileToDataURL = file => {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.readAsDataURL(file);
        });
    };


    return {
        restrict: 'A',
        scope: {
            image: '=',
            resizeMaxHeight: '@?',
            resizeMaxWidth: '@?',
            resizeSquare: '@?',
            resizeQuality: '@?',
            resizeType: '@?',
            uploadTarget: '@?', 
            beforeUpload: '&?',
            afterUpload: '&?',
        },
        link: function postLink(scope, element, attrs, ctrl) {

            var doResizing = imageResult => createImage(imageResult.url).then(image => {
                var dataURL = resizeImage(image, scope);
                imageResult.resized = {
                    dataURL: dataURL,
                    type: dataURL.match(/:(.+\/.+);/)[1],
                };
                return imageResult;
            });

            var applyScope = imageResult => scope.$apply(() => {
                if (attrs.multiple)
                    scope.image.push(imageResult);
                else
                    scope.image = imageResult; 
            });

            var doUpload = imageResult => {
                // Upload the image to the URL in "scope.uploadTarget".
                console.log('### SAVE FILE TO SERVER: ', imageResult.resized);
                return $http
                .put(scope.uploadTarget, { 'pic': imageResult.resized })
                .then(response => imageResult);
            }

            element.bind('change', event => {
                let imageResult = {
                    file: event.target.files[0],
                    url: URL.createObjectURL(event.target.files[0])
                };

                fileToDataURL(event.target.files[0])
                .then(dataURL => { imageResult.dataURL = dataURL; return imageResult; })
                .then(imageResult => doResizing(imageResult))
                .then(imageResult => doUpload(imageResult))
                .then(imageResult => {
                    applyScope(imageResult);
                    scope.afterUpload();
                })
                .catch(err => console.log('UPLOAD ERROR: ', err));
            });
        }
    };
}]);