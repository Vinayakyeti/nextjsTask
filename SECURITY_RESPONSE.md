# 🔐 SECURITY INCIDENT RESPONSE

## ⚠️ Action Required: Regenerate Exposed API Key

Your Google Gemini API key was exposed in `.env.local`. Here's what to do:

### Step 1: Revoke Old API Key (CRITICAL)
```
1. Go to: https://aistudio.google.com/apikey
2. Find: AIzaSyBvw604Gt1HUa2h5bcgbYThj433O1i394k
3. Click: Delete/Revoke
4. Confirm: Yes, delete
```

**Status:** ❌ Old key is now INVALID

### Step 2: Generate New API Key
```
1. Go to: https://aistudio.google.com/apikey
2. Click: "Create API Key"
3. Choose: "Create API key in new project" (recommended)
4. Copy: Your new key (starts with AIza...)
```

**Status:** ✅ New key generated

### Step 3: Update Local Development
```
File: .env.local

OLD (INVALID):
AI_API_KEY="AIzaSyBvw604Gt1HUa2h5bcgbYThj433O1i394k"

NEW:
AI_API_KEY="AIza[NEW_KEY_HERE]"
```

### Step 4: Update Vercel Production
```
1. Go to: https://vercel.com/dashboard
2. Select: Your project
3. Settings → Environment Variables
4. Find: AI_API_KEY
5. Delete: Old value
6. Add: New value (new key)
7. Set: Production environment
8. Save
```

**Status:** ✅ Production updated

### Step 5: Verify & Deploy
```bash
# Test locally
npm run dev

# Test AI functionality:
# - Create collection
# - Ask AI a question
# - Should work with new key

# If working, push to production
git add .
git commit -m "Security: Update API key"
git push origin master

# Vercel will auto-deploy
```

---

## Files Already Secured

✅ `.env.local` - NOT in Git (.gitignore has `.env*`)
✅ `.gitignore` - Already excludes all `.env*` files
✅ `NEXTAUTH_SECRET` - Stored in Vercel (not in code)
✅ `DATABASE_URL` - Stored in Vercel (not in code)

---

## Best Practices Going Forward

### ✅ DO:
- Store secrets ONLY in `.env.local` (local development)
- Store secrets ONLY in Vercel dashboard (production)
- Add to `.gitignore` (never commit secrets)
- Rotate keys every 3 months
- Use read-only API keys when possible

### ❌ DON'T:
- Commit `.env.local` to Git
- Share API keys via chat/email
- Hardcode secrets in code
- Use same key across projects
- Leave expired keys in Vercel

---

## Verification Checklist

- [ ] Old API key revoked (no longer works)
- [ ] New API key generated
- [ ] `.env.local` updated with new key
- [ ] Vercel secrets updated with new key
- [ ] Tested locally (npm run dev)
- [ ] Tested AI functionality works
- [ ] Pushed to GitHub
- [ ] Vercel deployment successful

---

## Timeline

- **Immediately:** Revoke old key (do this now!)
- **Next 5 min:** Generate new key
- **Next 5 min:** Update local & Vercel
- **Next 10 min:** Test & deploy
- **Total:** ~20 minutes to full security

---

## Questions?

- **Lost new API key?** Generate another one at https://aistudio.google.com/apikey
- **Need to test?** Run: `npm run dev` then test AI features
- **Vercel not updating?** Clear cache and redeploy
- **Still getting errors?** Check that new key is set in ALL environments

---

**⏱️ ACTION: Start with Step 1 above (Revoke old key) RIGHT NOW!**
