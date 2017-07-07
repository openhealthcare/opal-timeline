import copy
import json

from django import template
from timeline import timelines

from opal.core.views import OpalSerializer

register = template.Library()


@register.inclusion_tag(
    'templatetags/timeline/timeline_wrapper.html', takes_context=True
)
def timeline(context, timeline_slug):
    ctx = copy.copy(context)
    ctx["timeline"] = json.dumps(
        timelines.Timeline.get(timeline_slug)().to_dict(),
        cls=OpalSerializer
    )

    return ctx
