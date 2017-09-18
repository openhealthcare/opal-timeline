import copy

from django import template
from timeline import timelines


register = template.Library()


@register.inclusion_tag(
    'templatetags/timeline/timeline.html', takes_context=True
)
def timeline(context, timeline_slug):
    ctx = copy.copy(context)
    ctx["timeline"] = timelines.Timeline.get(timeline_slug)()
    return ctx
