/* angularjs Scroll Glue
 * version 2.1.0
 * https://github.com/Luegg/angularjs-scroll-glue
 * An AngularJs directive that automatically scrolls to the bottom of an element on changes in it's scope.
*/

// Allow module to be loaded via require when using common js. e.g. npm
if (typeof module === "object" && module.exports) {
    module.exports = 'sevenpk.notificationcounter';
}

(function (angular, undefined) {
    'use strict';
    angular.module("sevenpk.notificationcounter", []).provider("notificationcounter", function () {
        var options = { url: "http://messages.oforge.com:8084/notifications/users/", interval: 5000, userId: null };
        var data = {};
        var registered = {};

        function updateRegistered() {
            for (var k in registered) {
                registered[k].scope[registered[k].name] = data;
            }
        }

        function update($http, $interval) {
            $interval(() => {
                if (options.userId != null) {
                    $http({
                        method: 'GET',
                        url: options.url + options.userId
                    }).then(function successCallback(response) {
                        data = response.data;

                        updateRegistered();
                    }, function errorCallback(response) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
                };
            }, options.interval);
        };

        this.$get = ($http, $interval, $httpParamSerializer) => {
            update($http, $interval);


            return {
                data: function () {
                    return data;
                },
                registerScope: function (scope, targetName) {
                    registered[scope.$id] = { name: targetName, scope: scope };
                    updateRegistered();
                },
                setUserId: (userId) => {
                    options.userId = userId;

                    update($http, $interval);
                },
                setOptions: (setoptions) => {
                    options = setoptions;
                },
                read: function (data) {
                    $http({
                        method: 'DELETE',
                        headers: {
                            'Content-Type': "application/x-www-form-urlencoded"
                        },
                        url: options.url + options.userId,
                        data: $httpParamSerializer(data)
                    }).then(function successCallback(response) {
                        data = response.data;
                    }, function errorCallback(response) {
                        console.log(response);
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
                }
            };
        };
    });

}(angular));
