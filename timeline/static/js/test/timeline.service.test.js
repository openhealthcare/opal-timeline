describe('Timeline', function(){
  "use strict";
  var Timeline, timelineDefinition, episode, timeline, $rootScope;
  var testHelper, Episode;

  var _timelineDefinition = [
    {
      display_name: "Investigation",
      priority: 5,
      addable: true,
      group_by: "date_ordered",
      template: "records/investigation.html",
      aggregate_template: "partials/timeline/aggregate_template.html",
      icon: "fa fa-comments",
      api_name: "investigation"
    },
    {
      display_name: "Diagnosis / Issues",
      priority: 6,
      addable: true,
      group_by: "date_of_diagnosis",
      template: "records/diagnosis.html",
      aggregate_template: "partials/timeline/aggregate_template.html",
      icon: "fa fa-stethoscope",
      api_name: "diagnosis"
    }
  ];

  beforeEach(function(){
    module('opal.services');
    module('opal.test');

    var episodeData = {
      id: 123,
      diagnosis: [
        {
          id: 102,
          condition: 'Dengue',
          provisional: true,
          date_of_diagnosis: '01/06/2013',
          episode_id: 123
        },
        {
          id: 103,
          condition: 'Malaria',
          provisional: false,
          date_of_diagnosis: '01/07/2013',
          episode_id: 123
        }
      ],
      investigation: [{
        id: 405,
        result: 'ADD',
        date_ordered: '01/07/2013',
        episode_id: 123
      }],
      demographics:[{
        id: 10,
        first_name: "Wilma",
        patient_id: 1
      }]
    }

    inject(function($injector){
      Timeline = $injector.get('Timeline');
      $rootScope = $injector.get('$rootScope');
      testHelper = $injector.get('opalTestHelper');
      Episode = $injector.get('Episode');
    });
    timelineDefinition = angular.copy(_timelineDefinition);
    $rootScope.fields = testHelper.getRecordLoaderData();
    episode = new Episode(episodeData);
    timeline = new Timeline(timelineDefinition, episode);
  });

  it('should get us the dates of the subrecords as strings in reverse date order', function(){
    var expected = ['01/07/2013', '01/06/2013'];
    expect(timeline.getDates()).toEqual(expected);
  });

  it('should get the relevant subrecords', function(){
    var releventSubrecords = timeline.getReleventSubrecords(episode);
    expect(releventSubrecords.length).toBe(3);
    expect(_.pluck(releventSubrecords, "columnName")).toEqual(
      [ 'diagnosis', 'diagnosis', 'investigation']
    );
    expect(_.pluck(releventSubrecords, "id")).toEqual(
      [103, 102, 405]
    );
  });

  it('should produce an indexed timeline keyed with the dates', function(){
    // we should have two subrecords for 01/07, the diagnosis and the investigation
    expect(timeline.indexedTimeLineElements['01/07/2013'].length).toBe(2);
    expect(timeline.indexedTimeLineElements['01/07/2013'][0].display_name).toBe('Diagnosis / Issues');
    expect(timeline.indexedTimeLineElements['01/07/2013'][1].display_name).toBe('Investigation');
  });

  it('should return a unique list of column names from getColumnNames', function(){
    expect(timeline.getColumnNames()).toEqual([ 'investigation', 'diagnosis' ])
  });

  it('getElementsForElementDefinition should filter a list of elements by subrecord type', function(){
    var result =  timeline.getElementsForElementDefinition(
      timeline.indexedTimeLineElements['01/07/2013'],
      timelineDefinition[0]
    )
    expect(result.length).toBe(1);
    expect(result[0].api_name).toBe("investigation")
  })
});
