# Vercel Deployment Quick Reference

## ⚡ Quick Start (5 minutes)

### 1. Connect Vercel to GitHub
```
1. Go to https://vercel.com/new
2. Select your repository: nextjsTask
3. Click "Import"
```

### 2. Add Environment Variables
In Vercel Dashboard → Settings → Environment Variables:

```
DATABASE_URL=mongodb+srv://[user]:[pass]@[cluster].mongodb.net/interview_prep
NEXTAUTH_SECRET=[generate-secure-random]
NEXTAUTH_URL=https://your-domain.vercel.app
AI_PROVIDER=openai
AI_API_KEY=[your-openai-key]
```

### 3. Deploy
```
Click "Deploy" in Vercel Dashboard
(or just push to master - auto deploys!)
```

---

## 📋 Environment Variables Cheatsheet

| Variable | Required | Example | Where to Get |
|----------|----------|---------|--------------|
| `DATABASE_URL` | ✅ Yes | `mongodb+srv://user:pass@cluster.mongodb.net/interview_prep` | MongoDB Atlas |
| `NEXTAUTH_SECRET` | ✅ Yes | `[32 random characters]` | Generate: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | ✅ Yes | `https://app.vercel.app` | Your Vercel domain |
| `AI_PROVIDER` | ✅ Yes | `openai` | Choose: openai, gemini, or groq |
| `AI_API_KEY` | ✅ Yes | `sk-...` | OpenAI/Gemini/Groq dashboard |

---

## 🔧 Build Settings (Pre-configured)

- **Framework**: Next.js (auto-detected)
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm ci`
- **Node Version**: 18.x (default)

✅ These are pre-configured - no changes needed!

---

## ✅ Pre-Deployment Checklist

Before pushing to production:

- [ ] All tests pass: `npm run test:unit && npm run test:integration`
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] No ESLint errors: `npm run lint`
- [ ] Database URL configured in Vercel
- [ ] NEXTAUTH_SECRET generated and set
- [ ] AI_API_KEY is valid and has quota
- [ ] NEXTAUTH_URL points to correct domain
- [ ] Code pushed to GitHub master branch

---

## 🚀 Deploy in 3 Steps

1. **Ensure everything is committed and pushed**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin master
   ```

2. **Vercel auto-deploys** (watch dashboard)

3. **Test production URL** after deployment completes

---

## 🔄 GitHub Actions CI Flow

Every `push` or `pull_request` automatically:

1. ✅ Installs dependencies
2. ✅ Runs ESLint
3. ✅ Runs unit tests
4. ✅ Runs integration tests
5. ✅ Generates coverage
6. ✅ Runs TypeScript check
7. ✅ Builds Next.js app
8. ✅ (Optional) Runs E2E tests

If all pass → Ready to deploy
If any fails → Check workflow logs

---

## 🔐 Secret Management

### Secure Practices
- ✅ Use Vercel UI to set secrets (not git)
- ✅ Generate strong NEXTAUTH_SECRET
- ✅ Different secret for each environment
- ✅ Rotate secrets every 3 months
- ✅ Use environment-specific values

### Never Do
- ❌ Commit `.env` files
- ❌ Share secrets via chat/email
- ❌ Use hardcoded secrets
- ❌ Share production keys in code

---

## 📊 Monitoring After Deploy

1. **Vercel Dashboard**
   - Monitor real-time requests
   - Check error rates
   - View build logs

2. **GitHub Actions**
   - View workflow results
   - Download coverage reports
   - Check test failures

3. **Application Testing**
   - Test login flow
   - Create a collection
   - Review with AI
   - Check footer (should show "Built by Vinayak")

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Build fails | Check `.env` vars in Vercel, run `npm run build` locally |
| Tests fail in CI | Run `npm run test:unit` locally, fix issues, push again |
| Database connection error | Verify `DATABASE_URL` format, check MongoDB IP whitelist |
| NextAuth errors | Verify `NEXTAUTH_SECRET` and `NEXTAUTH_URL` are set |
| Preview deployment won't work | Check branch-specific env vars in Vercel |

---

## 📞 Vercel Support

- Docs: https://vercel.com/docs
- Status: https://www.vercelstatus.com/
- Support: https://vercel.com/support
- Discord: https://discord.gg/vercel

---

## 🎯 Next Actions

1. [ ] Go to Vercel.com and create account
2. [ ] Connect GitHub repository
3. [ ] Add environment variables
4. [ ] Click Deploy
5. [ ] Monitor first deployment
6. [ ] Test production URL
7. [ ] Share with team!

---

**Your app will be live in ~2 minutes! 🎉**
