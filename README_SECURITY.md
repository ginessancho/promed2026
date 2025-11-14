# Propuesta F-007 - Security Configuration

## Password Protection

This application uses password protection to secure access to the proposal content. The password is configured via an environment variable for security.

### Environment Variable

**`VITE_PROPOSAL_PASSWORD`** - The password required to access the proposal

### Current Password

The current password is: **`Prmd2026!F007#Secure`**

### Changing the Password

#### On Manus Platform:
1. Go to **Management UI** → **Settings** → **Secrets**
2. Find `VITE_PROPOSAL_PASSWORD`
3. Click **Edit** and enter the new password
4. Restart the dev server

#### For Local Development:
1. Create a `.env` file in the project root (if it doesn't exist)
2. Add: `VITE_PROPOSAL_PASSWORD=your_new_password_here`
3. Restart the development server

### Security Notes

- ✅ Password is **NOT** hardcoded in the source code
- ✅ Safe to commit code to public GitHub repositories
- ✅ Each environment (dev, staging, production) can have different passwords
- ✅ Password can be changed without modifying code

### For Deployment

When deploying to other platforms (Vercel, Netlify, etc.), make sure to set the `VITE_PROPOSAL_PASSWORD` environment variable in the platform's settings.

---

**Important:** Never commit `.env` files to version control. The `.gitignore` file is already configured to exclude them.
