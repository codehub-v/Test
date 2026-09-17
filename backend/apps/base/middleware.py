from django.db import IntegrityError
from rest_framework.views import exception_handler
from rest_framework.response import Response


def custom_exception_handler(exc, context):

    response = exception_handler(exc, context)

    if isinstance(exc, IntegrityError):

        error_message = str(exc)

        messages = {
            "unique_color_identity_case_insensitive": {
                "field": "identity",
                "message": "Color name already exists.",
            },

            "unique_color_code_case_insensitive": {
                "field": "code",
                "message": "Color code already exists.",
            },

            "unique_fabric_identity_case_insensitive": {
                "field": "identity",
                "message": "Fabric name already exists.",
            },

            "unique_fabric_code_case_insensitive": {
                "field": "code",
                "message": "Fabric code already exists.",
            },

            "unique_size_identity_case_insensitive": {
                "field": "identity",
                "message": "Size name already exists.",
            },

            "unique_size_code_case_insensitive": {
                "field": "code",
                "message": "Size code already exists.",
            },

            "unique_unit_identity_case_insensitive": {
                "field": "identity",
                "message": "Unit name already exists.",
            },

            "unique_style_identity_case_insensitive": {
                "field": "identity",
                "message": "Style name already exists.",
            },

            "unique_style_code_case_insensitive": {
                "field": "code",
                "message": "Style code already exists.",
            },
            "unique_season_identity_case_insensitive": {
                "field": "identity",
                "message": "Season name already exists.",
            },

            "unique_season_code_case_insensitive": {
                "field": "code",
                "message": "Season code already exists.",
            },
        }

        for constraint, details in messages.items():

            if constraint in error_message:

                return Response(
                    {
                        "code": "DUPLICATE_ENTRY",
                        "field": details["field"],
                        "error": details["message"],
                    },
                    status=400,
                )

    return response