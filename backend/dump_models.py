from django.apps import apps

with open("all_models.txt", "w", encoding="utf-8") as f:

    for model in apps.get_models():

        f.write("\n")
        f.write("=" * 80)
        f.write("\n")
        f.write(f"MODEL: {model._meta.label}\n")
        f.write("=" * 80)
        f.write("\n")

        for field in model._meta.fields:

            f.write(
                f"{field.name} | "
                f"{field.__class__.__name__} | "
                f"null={field.null} | "
                f"blank={field.blank} | "
                f"default={field.default!r}\n"
            )