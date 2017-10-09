/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

'use strict';

var errorElement = document.querySelector('#errorMsg');
var video = document.querySelector('video');

// Put variables in global scope to make them available to the browser console.
var constraints = window.constraints = {
  audio: false,
  video: true
};

function handleSuccess(stream) {
  var videoTracks = stream.getVideoTracks();
  console.log('Got stream with constraints:', constraints);
  console.log('Using video device: ' + videoTracks[0].label);
  stream.oninactive = function() {
    console.log('Stream inactive');
  };
  window.stream = stream; // make variable available to browser console
  video.srcObject = stream;

  var detector = new FaceDetector();
  detector.detect(video)
      .then(detectedFaces => {
        for (var i = 0; i < detectedFaces.length; i++) {
          var boundingBox = detectedFaces[i].boundingBox;
          var result = boundingBox.x + "," + boundingBox.y + "," +
                       boundingBox.width + "," + boundingBox.height;
          results += result + "#";

          context.beginPath();
          context.rect(detectedFaces[i].boundingBox.x, detectedFaces[i].boundingBox.y, detectedFaces[i].boundingBox.width, detectedFaces[i].boundingBox.height);
          // for (i = 0; i < detectedObjects[0].cornerPoints.length; i ++) {
          //   context.arc(detectedObjects[0].cornerPoints[i].x, detectedObjects[0].cornerPoints[i].y, 5, 0, 2 * Math.PI, false);
          // }
          // context.lineWidth = 2;
          context.strokeStyle = 'yellow';
          context.stroke();
        }
        console.log("=====the detected faces is " + detectedFaces.length + " boundingBox is " + results);
      })
      .catch(error => {
        document.title = 'Error during detection: ' + error.message;
      });
}

function handleError(error) {
  if (error.name === 'ConstraintNotSatisfiedError') {
    errorMsg('The resolution ' + constraints.video.width.exact + 'x' +
        constraints.video.width.exact + ' px is not supported by your device.');
  } else if (error.name === 'PermissionDeniedError') {
    errorMsg('Permissions have not been granted to use your camera and ' +
      'microphone, you need to allow the page access to your devices in ' +
      'order for the demo to work.');
  }
  errorMsg('getUserMedia error: ' + error.name, error);
}

function errorMsg(msg, error) {
  errorElement.innerHTML += '<p>' + msg + '</p>';
  if (typeof error !== 'undefined') {
    console.error(error);
  }
}

navigator.mediaDevices.getUserMedia(constraints).
    then(handleSuccess).catch(handleError);
