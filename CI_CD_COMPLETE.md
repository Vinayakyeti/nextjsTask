# 🚀 Complete CI/CD & Deployment Guide

## Overview

Your Interview Prep Hub is ready for production! This guide covers:
- ✅ Vercel deployment setup (5 minutes)
- ✅ GitHub Actions CI/CD pipeline (automatic)
- ✅ Environment configuration
- ✅ Monitoring and troubleshooting

---

## Part 1: Deployment Steps (Vercel)

### Step 1: Prepare Repository

```bash
# Ensure all changes are committed
git add .
git commit -m "Prepare for production deployment"
git push origin master

# Verify tests pass locally
npm run test:unit
npm run test:integration
npm run test:coverage

# Verify build succeeds
npm run build
```

### Step 2: Create Vercel Account

1. Go to https://vercel.com
2. Sign up with GitHub
3. Grant Vercel access to your repositories

### Step 3: Connect Your Repository

1. In Vercel Dashboard, click **"Add New..."** → **"Project"**
2. Find and select **`nextjsTask`** repository
3. Click **"Import"**

**Vercel will auto-detect:**
- ✅ Next.js framework
- ✅ Build command: `npm run build`
- ✅ Output directory: `.next`

### Step 4: Configure Environment Variables

**In Vercel Dashboard:** Project Settings → Environment Variables

#### For Production

Add these variables:

```
DATABASE_URL
Value: mongodb+srv://[username]:[password]@[cluster].mongodb.net/interview_prep
Environment: Production

NEXTAUTH_SECRET
Value: [Generate new: openssl rand -base64 32]
Environment: Production

NEXTAUTH_URL
Value: https://interview-prep.vercel.app
Environment: Production

AI_PROVIDER
Value: openai
Environment: Production

AI_API_KEY
Value: sk-[your-openai-key]
Environment: Production
```

#### For Preview (Pull Requests)

```
DATABASE_URL
Value: mongodb+srv://[username]:[password]@[cluster-staging].mongodb.net/interview_prep
Environment: Preview

NEXTAUTH_SECRET
Value: [Generate different: openssl rand -base64 32]
Environment: Preview

NEXTAUTH_URL
Value: leave blank (auto-generated per preview)
Environment: Preview

AI_PROVIDER
Value: openai
Environment: Preview

AI_API_KEY
Value: [same as production]
Environment: Preview
```

#### For Development

```
DATABASE_URL
Value: mongodb://localhost:27017/interview_prep
Environment: Development

NEXTAUTH_URL
Value: http://localhost:3000
Environment: Development
```

### Step 5: Deploy

**Option A: Manual Deploy**
1. Click **"Deploy"** button in Vercel
2. Wait for build to complete (~2-3 minutes)
3. Visit deployed URL

**Option B: Auto Deploy (Recommended)**
1. Just push to master: `git push origin master`
2. Vercel automatically deploys
3. View progress in Vercel Dashboard

### Step 6: Test Production

1. Visit your production URL (from Vercel Dashboard)
2. Test authentication flow
3. Create a collection
4. Ask AI a question
5. Verify footer shows "Built by Vinayak"

### Step 7: Configure Custom Domain (Optional)

1. Go to Vercel Project Settings → **Domains**
2. Add your domain (e.g., `interviewprephub.com`)
3. Follow DNS configuration instructions
4. Update `NEXTAUTH_URL` to new domain

---

## Part 2: CI/CD Pipeline

### Overview

Your GitHub Actions workflow runs automatically on:
- **Every Pull Request**: Lint → Test → Build ✅
- **Every Push to Master**: Same checks + Deploy ✅
- **Manual Trigger**: Run workflow on demand ✅

### Workflow File

**Location:** `.github/workflows/ci.yml`

**Already configured with:**
- ✅ Node.js 18.x
- ✅ npm dependency caching
- ✅ Prisma type generation
- ✅ ESLint linting
- ✅ Unit tests (Vitest)
- ✅ Integration tests (Vitest)
- ✅ Coverage reporting
- ✅ TypeScript checking
- ✅ Next.js build verification
- ✅ E2E tests (Playwright)
- ✅ Playwright artifacts upload

### Viewing Workflow Results

1. Go to your GitHub repository
2. Click **Actions** tab
3. Select a workflow run
4. View detailed logs for each step

**What each step does:**

```
✅ Checkout code              - Clones latest code
✅ Setup Node.js              - Configures Node 18.x
✅ Install dependencies       - npm ci (fast install)
✅ Generate Prisma types      - Generates TypeScript types
✅ Run ESLint                 - Checks code style
✅ Run Unit Tests             - Tests utilities, validations
✅ Run Integration Tests      - Tests API logic, auth
✅ Generate Coverage          - Reports test coverage
✅ Upload Coverage            - Sends to Codecov
✅ Build Next.js              - Compiles application
✅ Check Build Output         - Verifies .next directory
✅ TypeScript check           - Type validation
✅ E2E tests                  - Browser automation tests
✅ Quality Gate               - Ensures all checks pass
✅ Notifications              - Comments on PR
```

### Test Coverage Requirements

All tests must pass before deployment:

```
Unit Tests (9 tests)
├── Validation schemas
├── String utilities
├── Date formatting
├── Difficulty calculation
└── All passing ✅

Integration Tests (8 tests)
├── API validation
├── Authorization checks
├── Data transformation
├── Error handling
└── All passing ✅

E2E Tests (20+ scenarios)
├── Authentication flows
├── Dashboard navigation
├── Collection management
├── Question workflows
├── Footer verification
└── Ready to run ✅
```

### Workflow Triggers

**Automatic (No Manual Action Needed):**

1. **Pull Request**
   - Branch: any
   - Runs: Lint, test, build
   - Blocks merge if fails ✅

2. **Push to Master**
   - Branch: master
   - Runs: Lint, test, build
   - Deploys if all pass ✅

3. **Manual Dispatch**
   - Click "Run workflow" in Actions tab
   - Select branch
   - Runs full pipeline ✅

---

## Part 3: Environment Variables Reference

### Complete List

| Variable | Purpose | Format | Priority |
|----------|---------|--------|----------|
| `DATABASE_URL` | MongoDB connection | `mongodb+srv://user:pass@cluster.mongodb.net/db` | **CRITICAL** |
| `NEXTAUTH_SECRET` | Session encryption | 32+ random chars | **CRITICAL** |
| `NEXTAUTH_URL` | Auth callback URL | `https://domain.com` | **CRITICAL** |
| `AI_PROVIDER` | AI service | openai / gemini / groq | **CRITICAL** |
| `AI_API_KEY` | API authentication | Service-specific | **CRITICAL** |
| `NEXT_PUBLIC_API_URL` | Client-side API URL | `https://domain.com` | Optional |

### Getting Each Variable

#### DATABASE_URL
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Click "Connect"
3. Select "Drivers"
4. Copy connection string
5. Format: `mongodb+srv://username:password@cluster.mongodb.net/interview_prep`

**Steps:**
- Replace `username` with your MongoDB user
- Replace `password` with your MongoDB password
- Replace `cluster` with your cluster name
- Set database name to `interview_prep`

#### NEXTAUTH_SECRET
Generate with:
```bash
openssl rand -base64 32
```

Or use online generator: https://generate-secret.vercel.app/32

**Important:** Generate DIFFERENT secrets for production and staging!

#### NEXTAUTH_URL
Your application's public URL:
- **Production:** `https://interview-prep.vercel.app`
- **Staging:** `https://[branch]-interview-prep.vercel.app`
- **Development:** `http://localhost:3000`

#### AI_PROVIDER
Choose one:
- `openai` - Recommended, most stable
- `gemini` - Google's AI
- `groq` - Fast inference

#### AI_API_KEY

**For OpenAI:**
1. Go to https://platform.openai.com/account/api-keys
2. Create new secret key
3. Copy the key (only shown once!)
4. Format: `sk-...`

**For Google Gemini:**
1. Go to https://aistudio.google.com/apikey
2. Create API key
3. Copy and paste
4. Format: `AIza...`

**For Groq:**
1. Go to https://console.groq.com/keys
2. Create API key
3. Copy and paste
4. Format: `gsk-...`

---

## Part 4: Deployment Checklist

### Before Going Live

- [ ] **Repository**
  - [ ] All code committed
  - [ ] Pushed to master branch
  - [ ] GitHub Actions workflow passes
  
- [ ] **Local Testing**
  - [ ] `npm run test:unit` passes
  - [ ] `npm run test:integration` passes
  - [ ] `npm run build` succeeds
  - [ ] `npm run lint` has no errors
  
- [ ] **Vercel Setup**
  - [ ] Vercel account created
  - [ ] Repository imported
  - [ ] Project detected as Next.js
  
- [ ] **Environment Variables**
  - [ ] `DATABASE_URL` set (Production)
  - [ ] `NEXTAUTH_SECRET` generated (Production)
  - [ ] `NEXTAUTH_URL` set (Production)
  - [ ] `AI_PROVIDER` set (Production)
  - [ ] `AI_API_KEY` set (Production)
  - [ ] Preview env vars configured
  
- [ ] **Database**
  - [ ] MongoDB Atlas cluster created
  - [ ] Database user created
  - [ ] IP whitelist configured
  - [ ] Connection tested
  
- [ ] **Secrets**
  - [ ] No secrets in code
  - [ ] `.env` file in `.gitignore`
  - [ ] Different secrets for prod/staging
  
- [ ] **Testing in Staging**
  - [ ] Create PR to test preview
  - [ ] Test all features in preview URL
  - [ ] Verify auth, collections, AI review
  - [ ] Check footer branding

### Production Deployment

1. **Final Test**
   ```bash
   npm run build
   npm run test:unit
   npm run test:integration
   ```

2. **Push to Master**
   ```bash
   git push origin master
   ```

3. **Monitor Deployment**
   - Watch Vercel Dashboard
   - Check GitHub Actions
   - Verify build completes

4. **Post-Deployment Verification**
   - [ ] Site loads at production URL
   - [ ] Authentication works
   - [ ] Can create collections
   - [ ] AI review functions
   - [ ] Footer shows "Built by Vinayak"
   - [ ] No console errors
   - [ ] Performance acceptable

5. **Monitor for Issues**
   - Check error logs first 24 hours
   - Monitor database connection
   - Verify AI API calls working
   - Check for unusual activity

---

## Part 5: Rollback Procedure

### Quick Rollback via Vercel

1. Go to Vercel Dashboard → Deployments
2. Find the previous working deployment
3. Click the menu (⋮)
4. Select "Rollback to this Deployment"
5. Confirm

### Programmatic Rollback

```bash
# Find the commit to rollback to
git log --oneline

# Revert the problematic commit
git revert <commit-hash>

# Push to trigger redeployment
git push origin master
```

### Emergency: Disable Automatic Deploys

1. Vercel Dashboard → Settings → Git
2. Disable "Automatic deploys"
3. Deploy manually after fixing issue

---

## Part 6: Monitoring & Maintenance

### Daily Monitoring

- [ ] Check Vercel dashboard for errors
- [ ] Monitor GitHub Actions workflow status
- [ ] Review application logs
- [ ] Check database connection status

### Weekly Tasks

- [ ] Review error logs
- [ ] Check performance metrics
- [ ] Monitor API usage
- [ ] Verify backups are working

### Monthly Tasks

- [ ] Analyze performance trends
- [ ] Review security logs
- [ ] Test recovery procedures
- [ ] Rotate secrets (every 3 months)
- [ ] Update dependencies

### Tools to Consider Adding

1. **Error Tracking:** Sentry.io (tracks exceptions)
2. **Performance:** Vercel Analytics (built-in)
3. **Uptime:** UptimeRobot (monitors site health)
4. **Database:** MongoDB Atlas Charts (visualize data)

---

## Part 7: Troubleshooting

### Deployment Fails

**Build Error:**
1. Check Vercel build logs
2. Run `npm run build` locally
3. Fix any errors
4. Push to master

**Environment Variable Missing:**
1. Check Vercel Settings → Environment Variables
2. Verify variable name matches
3. Set for correct environment (Production/Preview)
4. Redeploy

**Database Connection Error:**
1. Verify `DATABASE_URL` format
2. Check MongoDB IP whitelist
3. Test connection locally
4. Verify credentials

### Tests Fail in CI

1. Go to GitHub Actions
2. Click failed workflow
3. Expand the failing step
4. Read error message
5. Run locally: `npm run test:unit`
6. Fix and push again

### NextAuth Errors

**Session validation failed:**
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches domain
- Clear browser cookies and retry

**Callback URL mismatch:**
- Ensure `NEXTAUTH_URL` includes protocol (https://)
- Match exactly what browsers will visit
- No trailing slash

### Performance Issues

1. Check Core Web Vitals in Vercel Analytics
2. Analyze API response times
3. Check database query performance
4. Consider caching strategies

---

## Part 8: Security Best Practices

### Secrets Management

✅ **DO:**
- Use Vercel's environment variable UI
- Generate strong, random secrets
- Different secrets per environment
- Rotate every 3 months
- Use read-only API keys where possible

❌ **DON'T:**
- Commit `.env` to Git
- Share secrets via chat/email
- Hardcode secrets
- Reuse secrets across projects
- Use predictable values

### Database Security

✅ **DO:**
- Use MongoDB Atlas IP whitelist
- Enable database authentication
- Use strong passwords
- Enable SSL/TLS
- Regular automated backups

❌ **DON'T:**
- Allow 0.0.0.0/0 IP access
- Use weak passwords
- Disable authentication
- Skip backups

### API Key Security

✅ **DO:**
- Restrict API keys to specific domains
- Set usage quotas/limits
- Monitor for unusual activity
- Regenerate compromised keys immediately

❌ **DON'T:**
- Use unlimited API keys
- Share keys across services
- Use account-level keys

---

## Part 9: Useful Commands

### Local Development

```bash
# Start dev server
npm run dev

# Run all tests
npm run test:unit
npm run test:integration
npm run test:e2e

# Build production
npm run build

# Check for lint issues
npm run lint

# Type checking
npx tsc --noEmit

# View test coverage
npm run test:coverage
```

### Git & Deployment

```bash
# Commit changes
git add .
git commit -m "message"

# Push to master (triggers deployment)
git push origin master

# Create pull request branch (tests in CI)
git checkout -b feature/name
git push origin feature/name
# Then create PR on GitHub

# View deployment logs
# → Vercel Dashboard → Deployments

# View CI logs
# → GitHub → Actions → Workflow runs
```

---

## Part 10: Resources

### Documentation

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [GitHub Actions](https://docs.github.com/en/actions)
- [NextAuth.js](https://next-auth.js.org/)
- [MongoDB Atlas](https://docs.atlas.mongodb.com/)

### Tutorials

- [Vercel + Next.js Guide](https://vercel.com/guides/deploying-nextjs-with-vercel)
- [GitHub Actions for Node.js](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [NextAuth.js Production Setup](https://next-auth.js.org/deployment)

### Community

- [Vercel Discord](https://discord.gg/vercel)
- [Next.js Discord](https://discord.gg/nextjs)
- [GitHub Support](https://github.com/support)

---

## Summary

Your app is ready for production! Here's what's in place:

✅ **Deployment**: One-click Vercel setup
✅ **CI/CD**: Automatic testing on every push
✅ **Security**: Environment variables properly configured
✅ **Monitoring**: Vercel Analytics and GitHub Actions logs
✅ **Testing**: 17+ automated tests + E2E coverage
✅ **Documentation**: This complete guide + configuration examples

### Next Steps

1. **Today**: Set up Vercel account and connect repository
2. **Today**: Configure environment variables
3. **Today**: Deploy to production
4. **Tomorrow**: Monitor first 24 hours
5. **This week**: Set up monitoring tools
6. **This month**: Gather user feedback

**Your Interview Prep Hub is going live! 🎉**

---

**Questions?** Check the relevant documentation file:
- `DEPLOYMENT.md` - Detailed deployment guide
- `VERCEL_QUICK_START.md` - Quick reference
- `.github/workflows/ci.yml` - CI configuration
- `TESTING.md` - Test configuration
