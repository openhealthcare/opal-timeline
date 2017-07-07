from opal.core import discoverable


class TimelineElement(object):
    pass


class Timeline(discoverable.DiscoverableFeature):
    module_name = "timelines"
    # at the moment we assume this is just a model
    elements = ()

    def to_dict(self):
        # for index, element in enumerate(elements):
        return [dict(
            columnName="microbiology_input",
            when='when',
            addable=True,
            priority=5
        )]


class SampleTimeline(Timeline):
    display_name = "Sample Timeline"
    slug = "sample"

# so what do we have...
# we need a to_dict method that outputs to the the front end, the question is
# how much can we actually declare a model to the front end..
