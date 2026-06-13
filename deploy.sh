#!/bin/bash
set -e

echo "🕌 Madani Qafilah — GitHub + Vercel Deploy Script"
echo "=================================================="
echo ""

# ── CONFIG ──────────────────────────────────────────
REPO_NAME="madani-qafilah"
REPO_DESC="Madani Qafilah Companion App — Daily schedule, Bayanaat, Duas & Sunnahs based on Path to Piety by Dawat-e-Islami"
# ────────────────────────────────────────────────────

# Check requirements
command -v git >/dev/null || { echo "❌ git not found. Install from https://git-scm.com"; exit 1; }
command -v node >/dev/null || { echo "❌ node not found. Install from https://nodejs.org"; exit 1; }
command -v npm >/dev/null || { echo "❌ npm not found."; exit 1; }

# Get GitHub username
echo "📋 Enter your GitHub username:"
read -r GH_USER

# Get GitHub token
echo ""
echo "🔑 Enter your GitHub Personal Access Token"
echo "   (Create one at: https://github.com/settings/tokens/new)"
echo "   Required scopes: repo"
read -rs GH_TOKEN
echo ""

# Step 1: Create GitHub repo via API
echo ""
echo "📦 Step 1: Creating GitHub repository..."
RESPONSE=$(curl -s -w "\n%{http_code}" \
  -H "Authorization: token $GH_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d "{\"name\":\"$REPO_NAME\",\"description\":\"$REPO_DESC\",\"private\":false,\"auto_init\":false}")

HTTP_CODE=$(echo "$RESPONSE" | tail -1)
BODY=$(echo "$RESPONSE" | head -1)

if [ "$HTTP_CODE" = "201" ]; then
  echo "✅ GitHub repo created: https://github.com/$GH_USER/$REPO_NAME"
elif echo "$BODY" | grep -q "already exists"; then
  echo "ℹ️  Repo already exists, continuing..."
else
  echo "❌ GitHub API error (HTTP $HTTP_CODE):"
  echo "$BODY"
  exit 1
fi

# Step 2: Push to GitHub
echo ""
echo "📤 Step 2: Pushing code to GitHub..."
npm install --silent

git init 2>/dev/null || true
git checkout -b main 2>/dev/null || git checkout main 2>/dev/null || true
git config user.email "${GH_USER}@users.noreply.github.com"
git config user.name "$GH_USER"

REMOTE_URL="https://${GH_TOKEN}@github.com/${GH_USER}/${REPO_NAME}.git"
git remote remove origin 2>/dev/null || true
git remote add origin "$REMOTE_URL"

git add .
git diff --cached --quiet || git commit -m "🕌 Madani Qafilah Companion App — Path to Piety"

git push -u origin main --force
echo "✅ Code pushed: https://github.com/$GH_USER/$REPO_NAME"

# Step 3: Deploy to Vercel
echo ""
echo "🚀 Step 3: Deploying to Vercel..."

if ! command -v vercel >/dev/null; then
  echo "Installing Vercel CLI..."
  npm install -g vercel --silent
fi

echo ""
echo "Vercel will ask you to log in and confirm settings."
echo "Press Enter when asked for project name (use default)."
echo ""

vercel --prod --yes 2>/dev/null || vercel --prod

echo ""
echo "=================================================="
echo "✅ ALL DONE!"
echo ""
echo "🔗 GitHub:  https://github.com/$GH_USER/$REPO_NAME"
echo "🌐 Vercel:  Check above for your deployment URL"
echo ""
echo "💡 Future deploys: just run 'vercel --prod' in this folder"
echo "   Or connect GitHub to Vercel for auto-deploy on every push:"
echo "   https://vercel.com/new"
