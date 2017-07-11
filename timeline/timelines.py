from opal.core import discoverable
from opal.core.views import OpalSerializer
import json


class TimelineElement(object):
    aggregate_template = "partials/timeline/aggregate_template.html"
    priority = 5

    def __init__(
        self,
        subrecord,
        group_by,
        addable=True,
        priority=None,
        aggregate_template=None
    ):
        self.subrecord = subrecord
        self.group_by = group_by

        if priority:
            self.priority = priority
        self.addable = addable
        if aggregate_template:
            self.aggregate_template = aggregate_template
        self.template = subrecord.get_display_template()

    def to_dict(self):
        return dict(
            column_name=self.subrecord.get_api_name(),
            group_by=self.group_by,
            addable=self.addable,
            priority=self.priority,
            aggregate_template=self.aggregate_template,
            template=self.template,
            display_name=self.subrecord.get_display_name(),
            icon=getattr(self.subrecord, "_icon", None)
        )


class Timeline(discoverable.DiscoverableFeature):
    module_name = "timelines"
    # at the moment we assume this is just a model
    elements = ()

    def to_dict(self):
        return sorted(
            [i.to_dict() for i in self.elements], key=lambda x: -x["priority"]
        )

    def as_json(self):
        return json.dumps(
            self.to_dict(),
            cls=OpalSerializer
        )

    def get_templates(self):
        return {i.template for i in self.elements}

    def get_aggregate_templates(self):
        return {i.aggregate_template for i in self.elements}
