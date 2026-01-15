# 🚀 AI Control Hub - Setup Guide

## מה בנוי כאן?

מערכת אוטונומית **שעובדת אמיתית** ולא דמו:

✅ **Safety Check** - בדיקת מפתחות אוטומטית בהפעלה  
✅ **GitHub Integration** - שמירת קבצים אמיתית ב-GitHub  
✅ **First Agent** - סוכן פשוט שיוצר קובץ דוח יומי  
✅ **API Endpoints** - `/api/status` + `/api/run-agent`  

---

## 📋 דרישות מקדימות

- **Node.js** (v18+)
- **npm** או **yarn**
- **GitHub Personal Access Token** (למטה הוראות)

---

## ⚡ התקנה מהירה (3 צעדים)

### 1️⃣ Clone + Install

```bash
git clone https://github.com/yanivmizrachiy/ai-control-hub-test.git
cd ai-control-hub-test
npm install
```

### 2️⃣ הגדרת מפתחות

העתק את הקובץ `.env.example` ל-`.env`:

```bash
cp .env.example .env
```

ערוך את `.env` והדבק את המפתחות שלך:

```env
GITHUB_TOKEN=ghp_YourActualTokenHere
GITHUB_OWNER=yanivmizrachiy
GITHUB_REPO=ai-control-hub-test
```

**איך מקבלים GitHub Token?**

1. לך ל: https://github.com/settings/tokens
2. לחץ **"Generate new token (classic)"**
3. תן שם: `AI Control Hub`
4. בחר הרשאה: ✅ **repo** (Full control)
5. לחץ **Generate token**
6. **העתק מיד!** (לא תראה שוב)

### 3️⃣ הרצת השרת

```bash
npm start
```

**או במצב פיתוח (עם hot-reload):**

```bash
npm run dev
```

---

## ✅ אימות שהכל עובד

### בדוק את Safety Check

כשהשרת עולה, אתה צריך לראות:

```
🔐 SAFETY CHECK - Startup Validation

OPENAI_API_KEY: NOT_SET ❌
GITHUB_TOKEN: SET ✅
GITHUB_OWNER: yanivmizrachiy
GITHUB_REPO: ai-control-hub-test

============================================

🚀 Server running on http://localhost:3000

📡 Endpoints:
   GET  /api/status
   POST /api/run-agent
```

### בדוק את ה-API

**1. Status Check:**

```bash
curl http://localhost:3000/api/status
```

**תוצאה צפויה:**
```json
{
  "status": "running",
  "timestamp": "2026-01-15T05:00:00.000Z",
  "keys": {
    "openai": false,
    "github": true
  }
}
```

**2. הרץ את הסוכן הראשון:**

```bash
curl -X POST http://localhost:3000/api/run-agent
```

**תוצאה צפויה:**
```json
{
  "success": true,
  "savedToGitHub": true,
  "path": "reports/2026-01-15.md",
  "commitSha": "abc123...",
  "url": "https://github.com/yanivmizrachiy/ai-control-hub-test/blob/main/reports/2026-01-15.md"
}
```

**3. בדוק ב-GitHub:**

לך ל-`reports/` בריפו - תראה קובץ חדש עם התאריך של היום!

---

## 🐛 פתרון בעיות

### "GITHUB_TOKEN: NOT_SET ❌"

➡️ בדוק ש:  
1. הקובץ `.env` קיים (לא `.env.example`)  
2. `GITHUB_TOKEN=` לא ריק  
3. הפעלת מחדש את השרת אחרי העדכון

### "GitHub API Error: 403"

➡️ ה-Token לא בתוקף או חסרות הרשאות:  
1. צור Token חדש  
2. וודא ש-**repo** מסומן

### "GitHub API Error: 404"

➡️ שם הריפו שגוי:  
1. בדוק `GITHUB_OWNER` ו-`GITHUB_REPO` ב-`.env`  
2. וודא שהריפו קיים ואתה הבעלים

---

## 📊 מבנה הפרויקט

```
ai-control-hub-test/
├── server.js           # שרת Express מרכזי
├── package.json        # תלויות
├── .env.example        # תבנית מפתחות
├── .env               # מפתחות אמיתיים (לא ב-Git!)
├── reports/           # דוחות שנוצרו אוטומטית
└── SETUP.md           # המדריך הזה
```

---

## 🎯 מה הלאה?

המערכת מוכנה! עכשיו אתה יכול:

1. ✅ **להריץ סוכנים** - `curl -X POST http://localhost:3000/api/run-agent`
2. ✅ **לבדוק סטטוס** - `curl http://localhost:3000/api/status`
3. ✅ **לראות תוצאות ב-GitHub** - תיקייה `reports/`

---

**זהו! המערכת פועלת באמת ✅**
