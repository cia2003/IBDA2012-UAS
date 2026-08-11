# from supabase import create_client
# # from django.conf import settings
# import os

# supabase = create_client(
#     os.getenv("SUPABASE_PROJECT_URL"), 
#     os.getenv("SUPABASE_SERVICE_ROLE_KEY")
# )

# class StorageService:
#     @staticmethod
#     def create_signed_url(bucket: str, file_path: str, expiry: int = 60):
#         res = supabase.storage.from_(bucket).create_signed_url(
#             file_path,
#             expiry
#         )
#         return res.get("signedURL")

#     @staticmethod
#     def upload_file(bucket: str, file_path: str, file):
#         return supabase.storage.from_(bucket).upload(file_path, file)

#     @staticmethod
#     def delete_file(bucket: str, file_path: str):
#         return supabase.storage.from_(bucket).remove([file_path])