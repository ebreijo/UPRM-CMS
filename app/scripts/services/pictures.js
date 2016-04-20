'use strict';

var app = angular.module('uprmcmsApp');

app.factory('Pictures', function() {
  var obj = {
    pictures: [
      {
        id: 1,
        fileLabel: 'photo1',
        filePath: '../../media/landing/slide-1.jpg'
      },
      {
        id: 2,
        fileLabel: 'photo2',
        filePath: '../../media/landing/slide-2.jpg'
      },
      {
        id: 3,
        fileLabel: 'photo3',
        filePath: '../../media/landing/slide-3.jpg'
      },
      {
        id: 4,
        fileLabel: 'photo4',
        filePath: '../../media/landing/slide-3.jpg'
      },
      {
        id: 5,
        fileLabel: 'photo5',
        filePath: '../../media/landing/slide-3.jpg'
      }
    ]
  };

  return obj;
});
