from pathlib import Path
from django.conf import settings

class StorageService:
    @staticmethod
    def delete_file(file_path):
        path = Path(settings.MEDIA_ROOT) / file_path

        if path.exists():
            path.unlink

    @staticmethod
    def file_exists(file_path):
        path = Path(settings.MEDIA_ROOT) / file_path
        return path.exists()