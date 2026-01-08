# Security Policy

## 🔒 Security Best Practices

This document outlines security practices for the TeacherLoggg application.

---

## 🚨 Critical: Environment Variables

### ⚠️ NEVER Commit Secrets

**The following files must NEVER be committed to version control:**
- `.env`
- `backend/.env`
- `frontend/.env`
- Any file containing API keys, tokens, or passwords

### ✅ Proper Secret Management

1. **Local Development**:
   - Copy `.env.example` to `.env`
   - Fill in your actual credentials in `.env`
   - `.env` is in `.gitignore` and will not be committed

2. **Production Deployment**:
   - Use platform environment variables (Emergent, Vercel, Render, etc.)
   - Use secret managers (AWS Secrets Manager, HashiCorp Vault, etc.)
   - Use Docker secrets for containerized deployments

3. **CI/CD**:
   - Use GitHub Secrets for Actions
   - Use GitLab CI/CD variables
   - Never expose secrets in logs

---

## 🔑 API Key Security

### OpenAI API Key

**Location**: Should be set as environment variable `OPENAI_API_KEY`

**Protection Measures**:
- ✅ Never commit to git
- ✅ Rotate keys regularly
- ✅ Use separate keys for dev/staging/production
- ✅ Monitor usage for anomalies
- ✅ Set spending limits in OpenAI dashboard
- ✅ Revoke compromised keys immediately

**If compromised**:
1. Immediately revoke the key at https://platform.openai.com/api-keys
2. Generate a new key
3. Update all environments with new key
4. Review usage logs for unauthorized access
5. Check git history and remove exposed keys

---

## 🛡️ CORS Configuration

**Current Setting**: `CORS_ORIGINS=*`

**Security Recommendation**:
- For production, restrict CORS to your actual domains:
  ```bash
  CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
  ```
- Only use `*` for development/testing

---

## 🗄️ Database Security

### MongoDB Connection

**Best Practices**:
- Use strong authentication (username/password)
- Enable MongoDB authentication
- Use TLS/SSL for connections
- Restrict network access (firewall rules)
- Use MongoDB Atlas for managed security
- Regular backups

**Production Connection String Example**:
```bash
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
```

---

## 📋 Security Checklist

Before deploying to production:

- [ ] All `.env` files are in `.gitignore`
- [ ] No secrets committed to git history
- [ ] Environment variables set in deployment platform
- [ ] CORS restricted to actual domains
- [ ] MongoDB authentication enabled
- [ ] OpenAI API key has spending limits
- [ ] HTTPS enabled for production
- [ ] Regular security updates applied
- [ ] Dependencies audited (`npm audit`, `pip-audit`)
- [ ] Error messages don't expose sensitive data

---

## 🔍 Auditing Dependencies

### Frontend (Node.js)
```bash
cd frontend
npm audit
npm audit fix
```

### Backend (Python)
```bash
cd backend
pip install pip-audit
pip-audit
```

---

## 📞 Reporting Security Issues

If you discover a security vulnerability:

1. **DO NOT** open a public GitHub issue
2. Email: security@yourproject.com
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if available)

We will respond within 48 hours.

---

## 🔄 Regular Security Maintenance

### Monthly Tasks:
- Review and rotate API keys
- Update dependencies
- Review access logs
- Check for exposed secrets in git history

### Quarterly Tasks:
- Full security audit
- Penetration testing
- Review user permissions
- Update security documentation

---

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OpenAI Security Best Practices](https://platform.openai.com/docs/guides/safety-best-practices)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)
- [Docker Security](https://docs.docker.com/engine/security/)

---

## 🏆 Security Commitment

We are committed to maintaining the security and privacy of our users' data. Security is an ongoing process, and we continuously work to improve our practices.

**Last Updated**: January 2025
