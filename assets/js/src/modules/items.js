angular.module('tscf').directive('tscfItems', [ '$http', '$window', 'ui', function($http, $window, ui){

  'use strict';

  return {
    restrict: "E",
    replace: true,
    scope: {
      fields: '=',
      i: '='
    },

    templateUrl: TSCF.template('items'),
    link: function($scope, $elem, attr){

      $scope.cols = TSCF.cols;

      $scope.types = [];

      $scope.toggle = function(target){
        ui.toggle(target);
      };

      for( var prop in TSCF.types ) {
        if ( TSCF.types.hasOwnProperty(prop) ) {
          $scope.types.push({
            name: prop,
            label: TSCF.types[prop]
          });
        }
      }

      /**
       * Fill field property
       *
       * @param {Number} i
       * @param {Object} field
       */
      function fillProp( i, field ){
        // Remove unexistent property
        for ( var prop in $scope.fields[i] ) {
          if ( 'type' != prop && ! field.hasOwnProperty( prop ) ) {
            delete $scope.fields[i][prop];
          }
        }
        // Add unsatisfied property.
        for ( prop in field ) {
          if ( ! $scope.fields[i].hasOwnProperty( prop ) ) {
            $scope.fields[i][prop] = field[prop];
          }
        }
      }

      /**
       *
       * @param i
       */
      function updateType(i){
        $http({
          method: 'GET',
          url: TSCF.endpoint.field + '&field=' + $scope.fields[i].type
        }).then(
          function(response){
            var field = response.data.field;
            fillProp( i, field );
          },
          function(response){
            // Error
          }
        ).then(function(){
          // Always
        });

      }

      /**
       * Get field
       *
       * @param {Number} i
       */
      $scope.changeType = function(i){
        if ( 'custom' == $scope.fields[i].type ) {
          return;
        }
        updateType(i);
      };




      /**
       * Remove field
       *
       * @param {Number} i
       */
      $scope.removeField = function(i){
        if ( $window.confirm( TSCF.message.delete ) ) {
          $scope.fields.splice(i, 1);
        }
      };

    }
  };
}]);


