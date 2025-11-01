# Cloudflare D1 Database Setup Guide

## 🚨 Current Issue: API 500 Error

The admin dashboard is experiencing a **500 Internal Server Error** when trying to fetch data from the API endpoints. This is because **Cloudflare Pages doesn't automatically use D1 bindings from `wrangler.toml` in production**.

### Error Details
- **Error**: `GET /api/notice 500 (Internal Server Error)`
- **Root Cause**: D1 Database binding (`DB`) is not configured in Cloudflare Pages dashboard
- **Impact**: All API endpoints (notices, auth, etc.) are failing

---

## ✅ Solution: Configure D1 Binding in Cloudflare Pages

### Step 1: Access Cloudflare Pages Settings

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Pages** section
3. Click on your project: **humanit-webapp**
4. Click **Settings** tab
5. Scroll to **Functions** section

### Step 2: Add D1 Database Binding

1. Find **D1 database bindings** section
2. Click **Add binding**
3. Configure the binding:
   - **Variable name**: `DB` (must match the code)
   - **D1 database**: Select `humanit-production`
   - **Database ID**: `c451e29d-38aa-462f-9763-c5c5cbdfa60a`

4. Click **Save**

### Step 3: Verify the Binding

After saving, you should see:
```
Variable name: DB
D1 database: humanit-production
Database ID: c451e29d-38aa-462f-9763-c5c5cbdfa60a
```

### Step 4: Redeploy (Automatic)

- Cloudflare Pages will **automatically redeploy** after you add the binding
- Wait 1-2 minutes for the deployment to complete
- Check the deployment status in the **Deployments** tab

### Step 5: Test the API

1. Open the admin dashboard: https://b466f4d4.humanit-webapp.pages.dev/admin
2. Login with credentials:
   - Username: `admin`
   - Password: `admin123`
3. Navigate to **공지사항 관리** (Notice Management)
4. You should now see the list of notices without errors

---

## 🔍 Debugging: Check If Binding Is Missing

The API now returns detailed error messages. If the binding is missing, you'll see:

```json
{
  "success": false,
  "message": "Database binding is not configured. Please add D1 binding in Cloudflare Pages settings.",
  "error": "DB_BINDING_MISSING"
}
```

You can check this by:
1. Opening browser Developer Tools (F12)
2. Going to **Console** tab
3. Looking for the error response

---

## 📊 Database Information

### Database Details
- **Name**: humanit-production
- **ID**: c451e29d-38aa-462f-9763-c5c5cbdfa60a
- **Location**: Asia Pacific (APAC)
- **Size**: ~12 KB (as of last check)
- **Tables**: 5 (notices, downloads, faqs, galleries, admins)

### Sample Data Loaded
- **Notices**: 3 sample notices
- **Downloads**: 2 sample files
- **FAQs**: 3 sample Q&As
- **Galleries**: 2 sample images
- **Admins**: 1 admin user (admin/admin123)

### Database Schema

#### Notices Table
```sql
CREATE TABLE notices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Admins Table
```sql
CREATE TABLE admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email TEXT,
  last_login DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔧 API Endpoints

All endpoints are now protected with DB binding validation.

### Authentication
- `POST /api/auth/login` - Admin login

### Notices (공지사항)
- `GET /api/notice` - List notices (with pagination)
- `POST /api/notice` - Create notice (requires auth)
- `GET /api/notice/:id` - Get notice details
- `PUT /api/notice/:id` - Update notice (requires auth)
- `DELETE /api/notice/:id` - Delete notice (requires auth)

### Future Endpoints (To be implemented)
- `/api/download` - Downloads (자료실)
- `/api/faq` - FAQs
- `/api/gallery` - Gallery (갤러리)

---

## 🎯 Testing Checklist

After configuring the D1 binding, test these features:

- [ ] Login to admin dashboard
- [ ] View dashboard statistics (should show counts)
- [ ] View notice list (should show 3 sample notices)
- [ ] Create a new notice
- [ ] Edit an existing notice
- [ ] Delete a notice
- [ ] Check notice views increment on detail page

---

## 📝 Additional Notes

### Why wrangler.toml Isn't Enough

- `wrangler.toml` is used for **local development** with `wrangler dev`
- **Production deployments** on Cloudflare Pages require manual binding configuration
- This is a security feature to prevent accidental database access

### Alternative: Use Wrangler CLI to Deploy

If you prefer automated binding, you can deploy using Wrangler instead of Git:

```bash
# Install Wrangler
npm install -g wrangler

# Deploy to Cloudflare Pages
wrangler pages deploy . --project-name=humanit-webapp

# This will automatically apply bindings from wrangler.toml
```

However, for continuous deployment from Git, **you must configure bindings in the dashboard**.

---

## 🚀 Next Steps After Fixing

Once the D1 binding is configured and working:

1. **Complete remaining CRUD UIs**:
   - Downloads (자료실) management
   - FAQ management
   - Gallery (갤러리) management

2. **Add file upload features**:
   - Integrate Cloudflare R2 for file storage
   - Integrate Cloudflare Images for image optimization

3. **Connect frontend to database**:
   - Make notice page dynamic
   - Load content from D1 instead of static HTML

4. **Security enhancements**:
   - Implement proper JWT authentication
   - Add rate limiting
   - Add input validation and sanitization

---

## 📞 Support

If you continue to experience issues after configuring the D1 binding:

1. Check Cloudflare Pages **Functions logs**:
   - Go to Pages > Your Project > Functions
   - Click **View logs** for detailed error messages

2. Verify database contains data:
   - Go to D1 > humanit-production
   - Run query: `SELECT COUNT(*) FROM notices;`
   - Should return 3

3. Test API directly with curl:
```bash
curl https://b466f4d4.humanit-webapp.pages.dev/api/notice
```

Expected response:
```json
{
  "success": true,
  "data": {
    "notices": [...],
    "pagination": {...}
  }
}
```

---

**Last Updated**: 2025-11-01
**Version**: 1.0
