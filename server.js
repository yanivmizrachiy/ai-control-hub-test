import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { Octokit } from '@octokit/rest';
import OpenAI from 'openai';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ============================================
// 1️⃣ SAFETY CHECK - Startup Validation
// ============================================
function safetyCheck() {
  console.log('\n🔐 SAFETY CHECK - Startup Validation\n');
  console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'SET ✅' : 'NOT_SET ❌');
  console.log('GITHUB_TOKEN:', process.env.GITHUB_TOKEN ? 'SET ✅' : 'NOT_SET ❌');
  console.log('GITHUB_OWNER:', process.env.GITHUB_OWNER || 'NOT_SET ❌');
  console.log('GITHUB_REPO:', process.env.GITHUB_REPO || 'NOT_SET ❌');
  console.log('\n============================================\n');
}

// ============================================
// 2️⃣ GitHub Service - Real Integration
// ============================================
class GitHubService {
  constructor() {
    if (!process.env.GITHUB_TOKEN) {
      console.error('⚠️  GitHub Token not configured');
      this.octokit = null;
    } else {
      this.octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    }
  }

  async createFile(path, content, message, sha = null) {   if (!this.octokit) throw new Error('GitHub not configured');
    if (!this.octokit) throw new Error('GitHub not configured');
    
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    
    try {
      const response = await this.octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message,
        content: Buffer.from(content).toString('base64'),
          ...(sha && { sha })
        })
      });
      return response.data;
    } catch (error) {
      throw new Error(`GitHub API Error: ${error.message}`);
    }
  }
}

const githubService = new GitHubService();

// ============================================
// 3️⃣ First Agent - Simple Report Generator
// ============================================
async function runFirstAgent() 
  // Try to get existing file SHA first
  let existingSha = null;
  try {
    const existing = await githubService.octokit.rest.repos.getContent({
      owner: process.env.GITHUB_OWNER,
      repo: process.env.GITHUB_REPO,
      path: filename
    });
    existingSha = existing.data.sha;
  } catch (error) {
    // File doesn't exist, that's OK - we'll create it
  }
  
  const date = new Date().toISOString().split('T')[0];
  const filename = `reports/${date}.md`;
  
  const content = `# AI Control Hub - Daily Report

**Date:** ${date}
**Generated:** ${new Date().toISOString()}
**Status:** ✅ PASS

## Agent Details
- Agent Type: First Agent
- Task: Create automated report
- Result: Successfully created and saved to GitHub

---
Created automatically by AI Control Hub
`;

  const result = await githubService.createFile(
    existingSha  // Use SHA if file exists, null if creating ne,    filename,
    content,
    `📊 Automated daily report - ${date}`
  );

  return {
    success: true,
    savedToGitHub: true,
    path: filename,
    commitSha: result.commit.sha,
    url: result.content.html_url
  };
}

// ============================================
// 4️⃣ API Endpoints
// ============================================

// Status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: 'running',
    timestamp: new Date().toISOString(),
    keys: {
      openai: !!process.env.OPENAI_API_KEY,
      github: !!process.env.GITHUB_TOKEN
    }
  });
});

// Run agent endpoint
app.post('/api/run-agent', async (req, res) => {
  try {
    if (!process.env.GITHUB_TOKEN) {
      return res.status(500).json({
        success: false,
        error: 'GITHUB_TOKEN not configured'
      });
    }

    const result = await runFirstAgent();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// 5️⃣ Server Startup
// ============================================
app.listen(PORT, () => {
  safetyCheck();
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`\n📡 Endpoints:`);
  console.log(`   GET  /api/status`);
  console.log(`   POST /api/run-agent`);
  console.log('\n============================================\n');
});
