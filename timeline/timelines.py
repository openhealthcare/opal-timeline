from opal.core import discoverable
from opal.core.views import OpalSerializer
import json


class TimelineElement(object):
    def __init__(
        self,
        subrecord,
        group_by,
        addable=True,
        priority=5,
        template=None,
        aggregate_template="partials/timeline/aggregate_template.html"
    ):
        self.api_name = subrecord.get_api_name()
        self.display_name = subrecord.get_display_name()
        self.subrecord = subrecord
        self.group_by = group_by
        self.priority = priority
        self.addable = addable
        self.aggregate_template = aggregate_template
        if template:
            self.template = template
        else:
            self.template = subrecord.get_display_template()
        self.icon = getattr(self.subrecord, "_icon", None)

    def to_dict(self):
        return dict(
            api_name=self.api_name,
            group_by=self.group_by,
            addable=self.addable,
            priority=self.priority,
            aggregate_template=self.aggregate_template,
            template=self.template,
            display_name=self.display_name,
            icon=self.icon
        )


class Timeline(discoverable.DiscoverableFeature):
    module_name = "timelines"
    # at the moment we assume this is just a model
    elements = ()
    add_visible = False

    def to_dict(self):
        return {
            'add_visible': self.add_visible,
            'elements'   : sorted(
                [i.to_dict() for i in self.elements],
                key=lambda x: -x["priority"]
            )
        }

    def as_json(self):
        return json.dumps(
            self.to_dict(),
            cls=OpalSerializer
        )

    def get_templates(self):
        return {i.template for i in self.elements}

    def get_aggregate_templates(self):
        return {i.aggregate_template for i in self.elements}
