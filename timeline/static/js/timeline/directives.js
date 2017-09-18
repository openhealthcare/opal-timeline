directives.directive("timeline", function ($rootScope, $parse, Timeline, recordLoader) {
  return {
    scope: true,
    link: function(scope, element, attrs){
        "use strict";

        var timelineDefinition = $parse(attrs.timeline)(scope);
        scope.episode = $parse(attrs.episode)(scope);
        scope.today = new Date();
        scope.timelineAddVisible = false;

        var constructTimeline = function(){
          // gets an array of all the relevent subrecords
          // var timelineRecords = getReleventSubrecords();

          // constructs an array of meta data where each one has a subrecord attatched
          // note there can be more than one per subrecord
          // var timelineData = constructTimelineMetaData(timelineRecords);
          //
          scope.timeline = new Timeline(timelineDefinition, scope.episode);
          // remove the dates for display
          scope.dates = scope.timeline.getDates();
        };

        recordLoader.load().then(function(){
          scope.editItem = function(subrecord){
              var idx = _.findIndex(scope.episode[subrecord.columnName], function(episodeSubrecord){
                   return episodeSubrecord.id === subrecord.id;
              });
              scope.episode.recordEditor.editItem(subrecord.columnName, idx)
          };
        })

        var api_names = _.unique(_.pluck(timelineDefinition, "api_name"));

        _.each(api_names, function(api_name){
            // watching episode subrecords
            // creates a circular referene
            // as they have a pointer to episode
            $rootScope.$watch("state", function(){
              constructTimeline();
            }, true);
        });

        constructTimeline();
    }
  };
});
