from passlib.context import CryptContext

# পাসওয়ার্ড হ্যাশ করার জন্য passlib কনফিগারেশন (bcrypt ব্যবহার করা হচ্ছে)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# পাসওয়ার্ড হ্যাশ করার ফাংশন (রেজিস্ট্রেশনের সময় ব্যবহার হয়)
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

# প্লেন পাসওয়ার্ড এবং হ্যাশড পাসওয়ার্ড ম্যাচ করার ফাংশন (লগইনের সময় ব্যবহার হয়)
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)