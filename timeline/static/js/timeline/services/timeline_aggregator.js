angular.module('opal.services').service('TimelineAggregator', function(){
  "use strict";
  /*
  *
  */

  var metaInformation, column_names;

  var TimelineAggregator = function(timelineData){
    this.timelineData = timelineData;

    metaInformation = _.sortBy(timelineData, function(x){
      return x.priority;
    }).reverse();

    column_names = _.unique(_.pluck(metaInformation, "column_name"));
  };

  var getReleventSubrecords = function(episode){
      return _.reduce(_.keys(episode), function(memo, k){
          if(_.contains(column_names, k)){
            memo = memo.concat(episode[k]);
          }

          return memo;
      }, []);
  }

  var getWhen = function(metaData){
      return metaData.subrecord[metaData.when].format("DD/MM/YYYY");
  };

  var getMetaDataForSubrecord = function(item){
      return _.filter(metaInformation, function(x){
          return x.column_name === item.columnName;
      });
  };

  var constructTimelineMetaData = function(subrecords){
      var timelineMetaData = [];
      _.each(subrecords, function(subrecord){
          var metaData = getMetaDataForSubrecord(subrecord);
           _.each(metaData, function(x){
             if(subrecord[x.when]){
                var metaDataCopy = angular.copy(x);
                metaDataCopy.subrecord = subrecord;
                timelineMetaData.push(metaDataCopy);
             }
          });
      });
      return timelineMetaData;
  }

  var reduceMetaData = function(timelineData){
      var newMetaDataInformation = {};
      _.each(timelineData, function(metaData){
          var when = getWhen(metaData);
          var priority = String(metaData.priority);

          if(!newMetaDataInformation[when]){
            newMetaDataInformation[when] = {};
          }

          if(!newMetaDataInformation[when][priority]){
            newMetaDataInformation[when][priority] = {};
          }

          if(!newMetaDataInformation[when][priority][metaData.column_name]){
            newMetaDataInformation[when][priority][metaData.column_name] = {};
          }

          if(!newMetaDataInformation[when][priority][metaData.column_name][metaData.when]){
            newMetaDataInformation[when][priority][metaData.column_name][metaData.when] = [];
          }

          newMetaDataInformation[when][priority][metaData.column_name][metaData.when].push(metaData);
      });

      return newMetaDataInformation;
  };

  TimelineAggregator.prototype = {
    aggregateSubrecords: function(episode){
      // gets an array of all the relevent subrecords
      var timelineRecords = getReleventSubrecords(episode);

      // constructs an array of meta data where each one has a subrecord attatched
      // note there can be more than one per subrecord
      var timelineData = constructTimelineMetaData(timelineRecords);

      // we sort the data via date string
      var result = reduceMetaData(timelineData)
      return result;
    }
  }

  return TimelineAggregator;
});
