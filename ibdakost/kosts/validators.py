from PIL import Image

from django.core.exceptions import ValidationError

def validate_file_size(file):
    max_size = 2 * 1024 * 1024  # 2 MB

    if file.size > max_size:
        raise ValidationError("Ukuran file maksimal 2MB")