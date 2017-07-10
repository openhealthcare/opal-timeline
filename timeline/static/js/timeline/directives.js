directives.directive("timeline", function ($rootScope, $parse, TimelineAggregator) {
  return {
    scope: false,
    link: function(scope, element, attrs){
        "use strict";

        scope.timelineData = $parse(attrs.timeline)(scope);
        scope.episode = $parse(attrs.episode)(scope);

        scope.today = new Date();

        scope.timelineAddVisible = false;

        var column_names = _.unique(_.pluck(scope.metaInformation, "column_name"));

        var getDates = function(timelineData){
            var allDates = _.reduce(timelineData, function(memo, v, k){
                memo.push(moment(k, "DD/MM/YYYY"));
                return memo;
            }, []);

            return _.sortBy(allDates, function(x){
                return x.toDate();
            }).reverse();
        };

        scope.getSubrecordFromDateAndMetaInfo = function(someMoment, fieldMetaData){
            /*
            * takes in meta data and pulls out the subrecords
            */
            var dateString = someMoment.format("DD/MM/YYYY");
            var priority = String(fieldMetaData.priority);

            var keys = [dateString, priority, fieldMetaData.column_name, fieldMetaData.when];
            var searchingFor = scope.reducedMetaData;
            var found = true;
            keys.every(function(key){
                if(searchingFor[key]){
                    searchingFor = searchingFor[key];
                    return true;
                }
                else{
                    found = false;
                    return false;
                }
            });

            if(!found){
              return [];
            }
            var result =  _.map(searchingFor, function(searched){
              return searched.subrecord;
            });

            return result;
        };

        var constructTimeline = function(){
          // gets an array of all the relevent subrecords
          // var timelineRecords = getReleventSubrecords();

          // constructs an array of meta data where each one has a subrecord attatched
          // note there can be more than one per subrecord
          // var timelineData = constructTimelineMetaData(timelineRecords);
          //
          var timelineAggregator = new TimelineAggregator(scope.timelineData);

          scope.metaInformation = scope.timelineData;
          scope.reducedMetaData = timelineAggregator.aggregateSubrecords(scope.episode);

          // remove the dates for display
          scope.dates = getDates(scope.reducedMetaData);
        };

        var getPriorityForSubrecord = function(subrecord){
           return _.findIndex(scope.episode[subrecord.column_name], function(episodeSubrecord){
                return episodeSubrecord.id === subrecord.id;
           });
        };

        scope.editItem = function(item){
            scope.episode.recordEditor.editItem(item.column_name, getPriorityForSubrecord(item))
        };

        var metaInformationDisplay = _.reduce(
            _.filter(scope.metaInformation, function(mi){ return mi.addable}),
            function(memo, mi){
                memo[mi.column_name] = {column_name: mi.column_name, icon: mi.icon, display_name: mi.display_name}
                return memo;
            }, {});

        scope.metaInformationDisplay = _.map(metaInformationDisplay, function(v, k){
            return v;
        });

        _.each(column_names, function(column_name){
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
