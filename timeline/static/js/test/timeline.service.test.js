describe('Timeline', function(){
"use strict";
  var Timeline;

  beforeEach(function(){
    module('opal.services');
    inject(function($injector){
      Timeline = $injector.get('Timeline');
    });

  });

  it('should extract the relevent subrecords as definied in the definition', function(){

  });
});
