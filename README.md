This is timeline - an [Opal](https://github.com/openhealthcare/opal) plugin.

Defining a timeline should be as simple as


from timeline.timelines import Timeline, TimelineElement
from elcid.models import MicrobiologyInput

``` python
class SampleTimeline(Timeline):
    slug = "sample"

    elements = (
        TimelineElement(subrecord=MicrobiologyInput, group_by="when"),
    )
```

Then you can put them in a template with

{% load timelines %}
{% timeline "sample" %}
