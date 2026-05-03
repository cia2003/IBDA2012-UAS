from django.core.exceptions import ValidationError

def validate_ktp_image_size(file):
    max_size = 1 * 1024 * 1024  # 2 MB

    if file.size > max_size:
        raise ValidationError("Ukuran file KTP maksimal 1MB")


def validate_image_type(file):
    valid_types = ['image/jpeg', 'image/png']

    if file.content_type not in valid_types:
        raise ValidationError("Format file KTP harus JPG atau PNG")