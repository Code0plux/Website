# Supabase Setup Instructions

## 1. Create a Supabase Account
- Go to https://supabase.com
- Sign up for a free account
- Create a new project

## 2. Create the Products Table
Run this SQL in the Supabase SQL Editor:

```sql
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  description TEXT NOT NULL,
  images TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for development)
CREATE POLICY "Allow all operations" ON products
FOR ALL
USING (true)
WITH CHECK (true);
```

## 3. Create Storage Bucket
- Go to Storage in Supabase Dashboard
- Click "New bucket"
- Name: `product-images`
- Make it Public
- Click "Create bucket"

- Click on the bucket > Policies > New Policy
- Create policy for INSERT: Allow all users to upload
- Create policy for SELECT: Allow all users to view

## 4. Create Admin User
- Go to Authentication > Users in Supabase Dashboard
- Click "Add User" > "Create new user"
- Enter email and password for admin
- Click "Create user"

## 5. Get Your Credentials
- Go to Project Settings > API
- Copy your Project URL
- Copy your anon/public key

## 6. Update .env File
Replace the values in `.env` file:
```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## 7. Restart Development Server
After updating .env, restart your dev server:
```
npm run dev
```

## 8. Access Admin Panel
- Go to http://localhost:5173/Login
- Login with the email and password you created
- You'll be redirected to the Admin panel

## Note
- Admin panel is now protected with authentication
- Only logged-in users can access /Admin
- Products table will be empty initially
- You can now upload multiple images per product
