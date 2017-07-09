from opal.core import discoverable
from opal.core.views import OpalSerializer
import json


class TimelineElement(object):
    aggregate_template = "partials/timeline/aggregate_template.html"

    def __init__(
        self,
        subrecord,
        when,
        addable=True,
        priority=None,
        aggregate_template=None
    ):
        self.subrecord = subrecord
        self.when = when
        self.priority = priority
        self.addable = addable
        if aggregate_template:
            self.aggregate_template = aggregate_template
        self.template = subrecord.get_display_template()

    def add_priority_if_not_set(self, priority):
        if not self.priority:
            priority = priority

    def to_dict(self):
        return dict(
            columnName=self.subrecord.get_api_name(),
            when=self.when,
            addable=self.addable,
            priority=self.priority,
            aggregate_template=self.aggregate_template,
            template=self.template,
            display_name=self.subrecord.get_display_name(),
        )


class Timeline(discoverable.DiscoverableFeature):
    module_name = "timelines"
    # at the moment we assume this is just a model
    elements = ()

    def to_dict(self):
        # for index, element in enumerate(elements):
        for index, element in enumerate(self.elements):
            element.add_priority_if_not_set(index)

        return [i.to_dict() for i in self.elements]

    def as_json(self):
        return json.dumps(
            self.to_dict(),
            cls=OpalSerializer
        )

    def get_templates(self):
        return {i.template for i in self.elements}

    def get_aggregate_templates(self):
        return {i.aggregate_template for i in self.elements}
