angular.module('opal.services').service('Timeline', function(){
  "use strict";
  /*
  * The timeline takes in a definition which is an array of elements
  * the timeline element defines subrecord and a group_by field
  * this is a date or datetime field on the subrecord
  * it also takes in an episode.
  *
  * We create a list of timeline elments with the
  * related subrecords attatched as a subrecord
  * field on the timeline element.
  *
  * We then group these by the date/datetime as
  * defined by the group by field.
  *
  */

  var Timeline = function(timelineDefinition, episode){
    this.timelineDefinition = timelineDefinition;
    this.episode = episode;

    // gets an array of all the relevent subrecords
    var timelineRecords = this.getReleventSubrecords(this.episode);

    // constructs an array of meta data where each one has a subrecord attatched
    // note there can be more than one per subrecord
    var timelineElements = this.constructTimelineElements(timelineRecords);

    // we sort the data via date string
    this.indexedTimeLineElements = this.indexTimelineData(timelineElements)
  };

  Timeline.prototype = {
    getReleventSubrecords: function(){
        var api_names = this.getColumnNames()
        return _.reduce(_.keys(this.episode), function(memo, k){
            if(_.contains(api_names, k)){
              memo = memo.concat(this.episode[k]);
            }

            return memo;
        }, [], this);
    },
    getMetaDataForSubrecord: function(item){
        return _.filter(this.timelineDefinition, function(x){
            return x.api_name === item.columnName;
        });
    },
    getElementsForElementDefinition: function(someElements, elementDefintion){
      return _.filter(someElements, function(x){
        return x.api_name === elementDefintion.api_name
      });
    },
    constructTimelineElements: function(subrecords){
      var timelineElements = [];
      _.each(subrecords, function(subrecord){
          var metaData = this.getMetaDataForSubrecord(subrecord);
           _.each(metaData, function(x){
             if(subrecord[x.group_by]){
                var metaDataCopy = angular.copy(x);
                metaDataCopy.subrecord = subrecord;
                timelineElements.push(metaDataCopy);
             }
          });
      }, this);
      return timelineElements;
    },
    getGroupBy: function(metadata){
      return metadata.subrecord[metadata.group_by].format("DD/MM/YYYY");
    },
    sortOrder: function(te1, te2){
      if(te1.priority !== te2.priority){
        return te1 < te2
      }

      if(te1.api_name !== te2.api_name){
        return te1.api_name < te2.api_name;
      }

      return te1.group_by < te2.group_by;
    },
    indexTimelineData: function(timelineData){
      var newMetaDataInformation = {};
      _.each(timelineData, function(metaData){
          var group_by = this.getGroupBy(metaData);

          if(!newMetaDataInformation[group_by]){
            newMetaDataInformation[group_by] = [];
          }
          newMetaDataInformation[group_by].push(metaData)
      }, this);

      _.each(newMetaDataInformation, function(v){
         v.sort(this.sortOrder);
      }, this);
      return newMetaDataInformation;
    },
    getColumnNames: function(){
      return _.unique(_.pluck(this.timelineDefinition, "api_name"));
    },
    getDates: function(){
      var allDates = _.reduce(this.indexedTimeLineElements, function(memo, v, k){
          memo.push(moment(k, "DD/MM/YYYY"));
          return memo;
      }, []);

      var allDatesSorted = _.sortBy(allDates, function(x){
          return x.toDate();
      }).reverse();

      return _.map(allDatesSorted, function(sortedDate){
        return sortedDate.format("DD/MM/YYYY");
      });
    }
  }

  return Timeline;
});
