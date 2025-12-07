# Deployment & CI/CD Guide

## 🚀 Vercel Deployment

### Step 1: Prepare Your Repository

1. **Ensure all changes are committed and pushed to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin master
   ```

2. **Verify all tests pass locally**
   ```bash
   npm run test:unit
   npm run test:integration
   npm run test:coverage
   ```

3. **Build locally to check for issues**
   ```bash
   npm run build
   ```

### Step 2: Connect Vercel to Your Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Select your GitHub repository: `nextjsTask`
4. Vercel will auto-detect Next.js configuration

### Step 3: Configure Environment Variables

In Vercel Dashboard → Project Settings → **Environment Variables**, add:

#### **Production Environment**
```
DATABASE_URL="mongodb+srv://[username]:[password]@[cluster].mongodb.net/interview_prep"
NEXTAUTH_SECRET="[generate-secure-random-string]"
NEXTAUTH_URL="https://your-domain.vercel.app"
AI_PROVIDER="openai"  # or "gemini" or "groq"
AI_API_KEY="[your-api-key]"
```

#### **Preview (Staging) Environment**
```
DATABASE_URL="mongodb+srv://[username]:[password]@[cluster-staging].mongodb.net/interview_prep"
NEXTAUTH_SECRET="[different-secure-random-string]"
NEXTAUTH_URL="https://[branch-name]-your-project.vercel.app"
AI_PROVIDER="openai"
AI_API_KEY="[your-api-key]"
```

#### **Development Environment**
```
NEXTAUTH_URL="http://localhost:3000"
```

### Step 4: Environment Variable Details

#### **DATABASE_URL** (Required)
- **Provider**: MongoDB Atlas
- **Format**: `mongodb+srv://username:password@cluster.mongodb.net/dbname`
- **Setup**:
  1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
  2. Create/select your cluster
  3. Click "Connect" → "Drivers"
  4. Copy connection string
  5. Replace `<username>` and `<password>` with your credentials
  6. Replace `<dbname>` with `interview_prep`

#### **NEXTAUTH_SECRET** (Required)
- **Purpose**: Encrypts session tokens
- **Generate**:
  ```bash
  openssl rand -base64 32
  ```
  Or use: https://generate-secret.vercel.app/32
- **Important**: Use DIFFERENT secrets for production and staging

#### **NEXTAUTH_URL** (Required)
- **Production**: `https://your-domain.vercel.app`
- **Staging**: `https://[preview-branch]-your-project.vercel.app`
- **Development**: `http://localhost:3000`

#### **AI_PROVIDER** (Required)
- **Options**: `openai`, `gemini`, `groq`
- **Recommended**: Start with OpenAI for stability

#### **AI_API_KEY** (Required)
- **OpenAI**: Get from https://platform.openai.com/account/api-keys
- **Google Gemini**: Get from https://aistudio.google.com/apikey
- **Groq**: Get from https://console.groq.com/keys
- **Important**: Use read-only keys where possible
- **Security**: Never commit to GitHub, always use Vercel secrets

### Step 5: Deploy

1. **Initial Deployment**
   - Vercel will automatically deploy when you push to `master` branch
   - Watch the deployment progress in Vercel Dashboard

2. **Monitor Build Logs**
   - Click on the deployment to view build logs
   - Check for any build errors

3. **Test the Deployment**
   - Visit your production URL
   - Test authentication flow
   - Test core features

### Step 6: Custom Domain (Optional)

1. Go to Project Settings → **Domains**
2. Add your custom domain
3. Update DNS records as instructed by Vercel
4. Update `NEXTAUTH_URL` environment variable with new domain

---

## 🔄 CI/CD with GitHub Actions

### Overview

Your CI/CD pipeline runs on:
- **Every pull request**: Linting, tests, build check
- **Every push to main/master**: Same checks, then deploy to staging
- **Manual trigger**: Deploy to production

### Workflow Features

✅ **Install Dependencies**: Node modules cached for speed
✅ **Lint Code**: ESLint validation
✅ **Run Tests**: Unit, integration, and coverage checks
✅ **Build Check**: Verify Next.js build succeeds
✅ **Automatic Deployment**: Optional automatic production deployment

### CI/CD File Location

File: `.github/workflows/ci.yml`

This file is already created and contains a complete workflow configuration.

### Workflow Triggers

1. **Pull Request**: Runs on all branches
   - Lint, test, build only (no deployment)
   - Blocks merge if any step fails

2. **Push to master**: Runs on master branch
   - Lint, test, build
   - Auto-deploys to Vercel if all checks pass

3. **Manual Deploy**: You can manually trigger production deployment

### Running Tests in CI

The workflow runs:

```bash
npm run test:unit        # Unit tests
npm run test:integration # Integration tests
npm run test:coverage    # Coverage report
npm run build            # Next.js build
```

All must pass before deployment is allowed.

### Viewing Workflow Status

1. Go to your repository on GitHub
2. Click **Actions** tab
3. See all workflow runs with status:
   - ✅ All checks passed
   - ❌ Some checks failed (click to see details)

4. Click on a specific workflow run to see:
   - Test results
   - Build logs
   - Coverage summary

### Troubleshooting Failed Workflows

**Common Issues:**

1. **Tests Failing**
   - Check the test output in GitHub Actions
   - Run locally: `npm run test:unit`
   - Fix the issue and push again

2. **Build Failing**
   - Check Next.js build errors
   - Run locally: `npm run build`
   - Verify environment variables are set

3. **Linting Errors**
   - Run locally: `npm run lint`
   - Fix errors before pushing

---

## 📋 Deployment Checklist

Before deploying to production:

- [ ] All tests passing locally
- [ ] Build successful locally (`npm run build`)
- [ ] Environment variables configured in Vercel
- [ ] Database migrations complete
- [ ] AI service API keys valid
- [ ] NEXTAUTH_SECRET generated and set
- [ ] Custom domain configured (if applicable)
- [ ] Backup of current database
- [ ] Staging deployment tested
- [ ] Production NEXTAUTH_URL correct

---

## 🔐 Security Best Practices

### Secrets Management

✅ **DO:**
- Use Vercel's environment variables UI
- Generate unique NEXTAUTH_SECRET for production
- Use read-only API keys where possible
- Rotate secrets periodically (every 3 months)
- Use different secrets for prod/staging

❌ **DON'T:**
- Commit `.env` files to GitHub
- Share secrets via chat or email
- Use same secret across environments
- Use predictable secret generation
- Store secrets in code comments

### Database Security

✅ **DO:**
- Use MongoDB Atlas IP whitelist
- Enable database authentication
- Use strong passwords
- Enable SSL/TLS connections
- Regular backups enabled

❌ **DON'T:**
- Allow 0.0.0.0/0 IP access
- Use simple passwords
- Disable authentication

### API Keys

✅ **DO:**
- Restrict API key usage to specific domains
- Set usage limits/quotas
- Monitor usage for unusual activity
- Regenerate compromised keys immediately

❌ **DON'T:**
- Use unrestricted API keys
- Share API keys across services
- Use account-level keys for applications

---

## 📊 Monitoring & Logs

### Vercel Dashboard

1. **Deployments**: View all deployment history
2. **Analytics**: Monitor page views, performance
3. **Edge Functions**: Monitor middleware execution
4. **Build Info**: Check build time and size

### GitHub Actions

1. **Actions Tab**: View all workflow runs
2. **Workflow Details**: Click workflow for logs
3. **Artifacts**: Download test coverage reports

### Application Monitoring (Next Steps)

Consider adding:
- **Error Tracking**: Sentry.io
- **Performance Monitoring**: Vercel Analytics (built-in)
- **Uptime Monitoring**: UptimeRobot
- **Database Monitoring**: MongoDB Atlas Charts

---

## 🔄 Rollback Procedure

If production deployment has issues:

### Option 1: Quick Rollback via Vercel
1. Go to Vercel Dashboard → Deployments
2. Find the previous working deployment
3. Click the 3-dots menu
4. Select "Rollback to this Deployment"

### Option 2: Re-deploy Previous Commit
1. Go to GitHub, find the working commit
2. Create a tag: `git tag v1.0.1 [commit-hash]`
3. Push the tag: `git push origin v1.0.1`
4. Vercel will auto-detect and deploy

### Option 3: Manual Git Push
1. Revert the problematic commit: `git revert [commit-hash]`
2. Push to master: `git push origin master`
3. Vercel will auto-deploy

---

## 📈 Scaling Considerations

### As Your App Grows

1. **Database Optimization**
   - Add database indexes
   - Archive old data
   - Enable read replicas (MongoDB Atlas)

2. **Caching Strategy**
   - Implement Redis for sessions
   - Add ISR (Incremental Static Regeneration)
   - Use API route caching

3. **Performance**
   - Monitor Core Web Vitals
   - Optimize images and assets
   - Consider Edge Middleware for geolocation

4. **Cost Optimization**
   - Monitor Vercel usage
   - Adjust OpenAI/AI model choices
   - Use spot instances for background jobs

---

## 🎯 Next Steps

1. **Immediate**
   - [ ] Set up Vercel project
   - [ ] Configure environment variables
   - [ ] Run first deployment

2. **Short Term (1 week)**
   - [ ] Test all features in production
   - [ ] Monitor logs for errors
   - [ ] Get team feedback

3. **Medium Term (1 month)**
   - [ ] Add monitoring/alerting
   - [ ] Expand test coverage
   - [ ] Optimize performance

4. **Long Term (ongoing)**
   - [ ] Regular security audits
   - [ ] Performance optimization
   - [ ] Feature expansion based on usage

---

## ❓ FAQ

**Q: How often does deployment happen?**
A: Every push to `master` triggers a deployment. Pull requests deploy to preview URLs.

**Q: Can I manually deploy?**
A: Yes, use GitHub Actions "Run workflow" button or redeploy from Vercel dashboard.

**Q: What if build fails?**
A: Check the workflow/build logs. The most common issues are missing env vars or test failures.

**Q: How do I see test results?**
A: In GitHub Actions workflow logs, or check `npm run test:coverage` locally.

**Q: Can I change the deployment branch?**
A: Yes, in Vercel project settings under "Git" section.

**Q: How do I add more environment variables?**
A: Vercel Dashboard → Project Settings → Environment Variables

---

## 📚 Useful Resources

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [NextAuth.js Production](https://next-auth.js.org/deployment)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)

---

**Questions? Check the CI workflow file at `.github/workflows/ci.yml`**
