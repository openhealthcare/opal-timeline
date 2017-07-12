from opal.core.test import OpalTestCase
from opal.tests.models import Birthday, DogOwner
from mock import patch
import json

from timeline.timelines import Timeline, TimelineElement


class TimelineElementTestCase(OpalTestCase):
    def setUp(self):
        with patch.object(Birthday, "get_display_name") as gdn:
            with patch.object(Birthday, "get_api_name") as gan:
                gdn.return_value = "Bday"
                gan.return_value = "bday"

                self.timeline_element = TimelineElement(
                    Birthday,
                    "birth_date",
                    addable=False,
                    priority=1,
                    aggregate_template="some_template.html",
                    template="some_birthday.html"
                )

    def test_init(self):
        te = self.timeline_element
        self.assertEqual(
            te.subrecord, Birthday
        )
        self.assertEqual(
            te.group_by, "birth_date"
        )
        self.assertFalse(te.addable)
        self.assertEqual(te.priority, 1)
        self.assertEqual(te.aggregate_template, "some_template.html")
        self.assertEqual(te.api_name, "bday")
        self.assertEqual(te.display_name, "Bday")
        self.assertEqual(te.template, "some_birthday.html")

    def test_init_overrides(self):
        with patch.object(Birthday, "get_display_template") as gdt:
            gdt.return_value = "btemplate"
            te = TimelineElement(
                Birthday,
                "birth_date",
            )
        self.assertTrue(te.addable)
        self.assertEqual(te.priority, 5)
        self.assertEqual(te.template, "btemplate")
        self.assertEqual(
            te.aggregate_template,
            "partials/timeline/aggregate_template.html"
        )

    def test_to_dict(self):
        expected = dict(
            api_name="bday",
            display_name="Bday",
            group_by="birth_date",
            addable=False,
            priority=1,
            aggregate_template='some_template.html',
            template='some_birthday.html',
            icon=None
        )
        self.assertEqual(
            self.timeline_element.to_dict(),
            expected
        )


class TimelineTestCase(OpalTestCase):
    def setUp(self):
        class SomeTimeline(Timeline):
            elements = (
                TimelineElement(
                    Birthday,
                    "birth_day",
                    template="some_template.html",
                    aggregate_template="some_aggregate_template.html"
                ),
                TimelineElement(
                    DogOwner,
                    "ownership_start_date",
                    template="some_template.html",
                    aggregate_template="some_aggregate_template.html"
                )
            )
        self.tl = SomeTimeline()

    def test_get_templates(self):
        self.assertEqual(
            self.tl.get_templates(),
            {"some_template.html"}
        )

    def get_aggregate_templates(self):
        self.assertEqual(
            self.tl.get_aggregate_templates(),
            {"some_aggregate_template.html"}
        )

    def test_to_dict(self):
        with patch.object(self.tl.elements[0], "to_dict") as t1:
            with patch.object(self.tl.elements[1], "to_dict") as t2:
                t1.return_value = {
                    "api_name": "bday",
                    "priority": 1,
                }
                t2.return_value = {
                    "api_name": "dog",
                    "priority": 2,
                }
                self.assertEqual(
                    self.tl.to_dict(),
                    [
                        dict(
                            api_name="dog",
                            priority=2
                        ),
                        dict(
                            api_name="bday",
                            priority=1
                        )
                    ]
                )

    def test_as_json(self):
        with patch.object(self.tl.elements[0], "to_dict") as t1:
            with patch.object(self.tl.elements[1], "to_dict") as t2:
                t1.return_value = {
                    "api_name": "bday",
                    "priority": 1,
                }
                t2.return_value = {
                    "api_name": "dog",
                    "priority": 2,
                }
                self.assertEqual(
                    json.loads(self.tl.as_json()),
                    [
                        dict(
                            api_name="dog",
                            priority=2
                        ),
                        dict(
                            api_name="bday",
                            priority=1
                        )
                    ]
                )
