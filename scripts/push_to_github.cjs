const { spawn, execSync } = require('child_process');

function getCredentials() {
  return new Promise((resolve, reject) => {
    const p = spawn('C:/Program Files/Git/mingw64/bin/git-credential-manager.exe', ['get'], {
      stdio: ['pipe', 'pipe', 'pipe']
    });
    let out = '';
    p.stdout.on('data', d => { out += d.toString(); });
    p.stdin.write('protocol=https\nhost=github.com\nusername=mugunthanramesh2010-ux\n\n');
    p.on('close', code => {
      const match = out.match(/password=(.+)/);
      if (match) {
        resolve(match[1].trim());
      } else {
        reject(new Error('Password/Token not found in credential manager'));
      }
    });
  });
}

async function run() {
  try {
    const token = await getCredentials();
    const repoUrl = `https://${token}@github.com/mugunthanramesh2010-ux/FIRST-PROJECT.git`;
    
    console.log('Setting remote url for origin...');
    try {
      execSync(`git remote set-url origin "${repoUrl}"`, { stdio: 'ignore' });
    } catch (e) {
      execSync(`git remote add origin "${repoUrl}"`, { stdio: 'ignore' });
    }
    
    console.log('Pushing to github.com/mugunthanramesh2010-ux/FIRST-PROJECT.git main branch...');
    execSync('git push -u origin main', {
      env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
      stdio: 'inherit'
    });
    
    console.log('SUCCESS: All files successfully uploaded to FIRST-PROJECT on GitHub!');
  } catch (err) {
    console.error('Push error:', err.message);
    process.exit(1);
  }
}

run();
