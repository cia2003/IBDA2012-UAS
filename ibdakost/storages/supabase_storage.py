# from django.core.files.storage import Storage
# from django.conf import settings
# from django.utils.deconstruct import deconstructible
# # from ibdakost.supabase_client import supabase
# import mimetypes
# import uuid

# class SupabaseStorage(Storage):
#     bucket_name  = settings.SUPABASE_BUCKET

#     def _save(self, name, content):
#         ext = name.split('.')[-1]
#         filename = f"{uuid.uuid4()}.{ext}"
#         file_path = name.rsplit('/', 1)[0] + '/' + filename if '/' in name else filename

#         content_type, _ = mimetypes.guess_type(name)

#         supabase.storage.from_(self.bucket_name).upload(
#             file_path, 
#             content.read(),
#             {
#                 "content-type": content_type or "application/octet-stream"
#             }
#         )

#         return file_path
    
#     def url(self, name):
#         res = supabase.storage.from_(self.bucket_name).create_signed_url(name, 60)
#         return res["signedURL"]
    
#     def exists(self, name):
#         return False