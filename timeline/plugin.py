"""
Plugin definition for the timeline Opal plugin
"""
from opal.core import plugins


class TimelinePlugin(plugins.OpalPlugin):
    """
    Main entrypoint to expose this plugin to our Opal application.
    """
    javascripts = {
        # Add your javascripts here!
        'opal.controllers': [
            'js/timeline/directives.js',
        ],
        'opal.services': [
            'js/timeline/services/timeline.js',
        ]

    }

    stylesheets = [
        "css/timeline.css"
    ]

    def list_schemas(self):
        """
        Return any patient list schemas that our plugin may define.
        """
        return {}

    def roles(self, user):
        """
        Given a (Django) USER object, return any extra roles defined
        by our plugin.
        """
        return {}
