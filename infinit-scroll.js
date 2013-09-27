/* ng-infinite-scroll - v1.0.0 - 2013-07-03 */
var mod;

mod = angular.module('infinite-scroll', []);

mod.directive('infiniteScroll', [
  '$rootScope', '$window', '$timeout', function($rootScope, $window, $timeout) {
    return {
      link: function(scope, elem, attrs) {
        var checkWhenEnabled, handler, scrollDistance, scrollEnabled, throttle;
        scrollDistance = 0;
        if (attrs.infiniteScrollDistance != null) {
          scope.$watch(attrs.infiniteScrollDistance, function(value) {
            return scrollDistance = parseInt(value, 10);
          });
        }
        scrollEnabled = true;
        checkWhenEnabled = false;
        if (attrs.infiniteScrollDisabled != null) {
          scope.$watch(attrs.infiniteScrollDisabled, function(value) {
            scrollEnabled = !value;
            if (scrollEnabled && checkWhenEnabled) {
              checkWhenEnabled = false;
              return handler();
            }
          });
        }
        throttle = function(fn, delay) {
          var timer;
          if (delay === 0) {
            return fn;
          }
          timer = false;
          return function() {
            if (timer) {
              return;
            }
            timer = true;
            if (delay !== -1) {
              $timeout((function() {
                return timer = false;
              }), delay);
            }
            return fn.apply(null, arguments);
          };
        };
        handler = function() {
          var element, elementBottom, remaining, shouldScroll, windowBottom;
          element = elem[0];
          windowBottom = $window.document.documentElement.clientHeight + ($window.scrollY || $window.document.documentElement.scrollTop || $window.document.body.scrollTop);
          elementBottom = element.offsetTop + element.clientHeight;
          remaining = elementBottom - windowBottom;
          shouldScroll = remaining <= $window.innerHeight * scrollDistance;
          if (shouldScroll && scrollEnabled) {
            if ($rootScope.$$phase) {
              return scope.$eval(attrs.infiniteScroll);
            } else {
              return scope.$apply(attrs.infiniteScroll);
            }
          } else if (shouldScroll) {
            return checkWhenEnabled = true;
          }
        };
        $window.onscroll = throttle(handler, 100);
        scope.$on('$destroy', function() {
          return $window.onscroll = null;
        });
        return $timeout((function() {
          if (attrs.infiniteScrollImmediateCheck) {
            if (scope.$eval(attrs.infiniteScrollImmediateCheck)) {
              return handler();
            }
          } else {
            return handler();
          }
        }), 0);
      }
    };
  }
]);