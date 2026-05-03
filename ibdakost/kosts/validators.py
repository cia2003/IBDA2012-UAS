from django.core.exceptions import ValidationError

def validate_file_size(file):
    max_size = 2 * 1024 * 1024  # 2 MB

    if file.size > max_size:
        raise ValidationError("Ukuran file maksimal 2MB")


def validate_image_type(file):
    valid_types = ['image/jpeg', 'image/png']

    if file.content_type not in valid_types:
        raise ValidationError("Format harus JPG atau PNG")