#!/bin/bash
set -euo pipefail

# Prompt for inputs (no -e; use printf for portability)
printf "Output HTML filename (e.g. save-to-github.html): "
read -r repofile
printf "GitHub repo name: "
read -r REPO
printf "GitHub owner/org: "
read -r OWNER
printf "GitHub token (repo contents RW): "
read -r TOKEN

# Ensure non-empty
if [[ -z "${repofile}" || -z "${REPO}" || -z "${OWNER}" || -z "${TOKEN}" ]]; then
  echo "All fields are required." >&2
  exit 1
fi

# Export for envsubst
export REPO OWNER TOKEN

# Generate file with envsubst, keeping JS template literals (`...`) intact
# Use single-quoted EOF so the shell doesn't expand anything; envsubst will.
envsubst '${REPO} ${OWNER} ${TOKEN}' > "$repofile" <<'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Save Note to ${OWNER}/${REPO}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body{font-family:sans-serif;background:#f9fafb;margin:0;padding:20px;}
    .box{max-width:800px;margin:auto;background:#fff;padding:20px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);}
    h1{margin-top:0;}
    label{font-weight:600;display:block;margin-top:12px;}
    input,textarea{width:100%;padding:8px;margin-top:4px;border:1px solid #ddd;border-radius:6px;font-size:14px;}
    textarea{min-height:200px;resize:vertical;}
    button{margin-top:16px;background:#2563eb;color:#fff;padding:10px 18px;border:0;border-radius:6px;cursor:pointer;font-weight:600;}
    button:disabled{opacity:.5;cursor:not-allowed;}
    .status{margin-top:12px;}
    .ok{color:green;}
    .err{color:red;}
    .small{font-size:.85em;color:#666;}
  </style>
</head>
<body>
  <div class="box">
    <h1>Save to ${OWNER}/${REPO}</h1>
    <p class="small">⚠️ Token is embedded in this page for quick local use only.</p>
    <form id="form">
      <label style="display:none;">GitHub Token
        <input id="token" type="password" value="${TOKEN}" required>
      </label>
      <label style="display:none;">Owner / Org
        <input id="owner" type="text" value="${OWNER}" required>
      </label>
      <label style="display:none;">Repository
        <input id="repo" type="text" value="${REPO}" required>
      </label>
      <label style="display:none;">Branch
        <input id="branch" type="text" value="main">
      </label>

      <label>Path prefix (optional)
        <input id="prefix" type="text" placeholder="e.g. notes/2025">
      </label>

      <label>Filename
        <input id="filename" type="text" placeholder="note.md" required>
      </label>

      <label>Content
        <textarea id="content" required></textarea>
      </label>

      <button id="save" type="submit">Save to Repo</button>
      <div id="status" class="status"></div>
    </form>
  </div>

  <script>
    const $ = id => document.getElementById(id);
    const els = {
      token:$('token'),owner:$('owner'),repo:$('repo'),
      branch:$('branch'),prefix:$('prefix'),
      filename:$('filename'),content:$('content'),
      form:$('form'),save:$('save'),status:$('status')
    };

    els.form.addEventListener('submit', async e=>{
      e.preventDefault();
      clearStatus();

      const token=els.token.value.trim();
      const owner=els.owner.value.trim();
      const repo=els.repo.value.trim();
      const branch=els.branch.value.trim()||'main';
      const prefix=trimSlashes(els.prefix.value.trim());
      const filename=els.filename.value.trim();
      const content=els.content.value;

      if(!token||!owner||!repo||!filename||!content){return setErr('All fields required');}

      if(!/^(?:[a-zA-Z0-9._-]+\/)*[a-zA-Z0-9._-]+$/.test(filename) || filename.includes('..') || filename.startsWith('/')){
        return setErr('Invalid filename. Use letters, numbers, "-", "_", ".", and "/" for folders.');
      }

      const path=(prefix?prefix+'/':'')+filename;
      els.save.disabled=true; setStatus('Saving…');

      try{
        const apiBase=`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;

        // Check if file exists to get SHA
        let sha=null;
        const getUrl = `${apiBase}/contents/${encodePath(path)}?ref=${encodeURIComponent(branch)}`;
        const head=await fetch(getUrl,{headers:ghHeaders(token)});
        if(head.status===200){
          const j=await head.json();
          if(j && j.sha){ sha=j.sha; }
        } else if (head.status!==404){
          const t=await head.text();
          throw new Error(`Lookup failed ${head.status}: ${t}`);
        }

        const payload={
          message:`${sha?'Update':'Create'} ${path}`,
          content:base64Encode(content),
          branch
        };
        if(sha) payload.sha=sha;

        const put=await fetch(`${apiBase}/contents/${encodePath(path)}`,{
          method:'PUT',
          headers:ghHeaders(token),
          body:JSON.stringify(payload)
        });
        if(!put.ok){
          const t=await put.text();
          throw new Error(`PUT failed ${put.status}: ${t}`);
        }
        const res=await put.json();
        const url=res?.content?.html_url||res?.commit?.html_url||'';
        setOk(`Saved ✅ ${url?`<a href="${url}" target="_blank" rel="noopener">View</a>`:''}`);
      }catch(err){
        setErr(err.message||String(err));
      }finally{
        els.save.disabled=false;
      }
    });

    function ghHeaders(token){return{
      'Accept':'application/vnd.github+json',
      'Authorization':'Bearer '+token,
      'User-Agent':'client-repo-save',
      'Content-Type':'application/json'
    }}
    function encodePath(path){return path.split('/').map(encodeURIComponent).join('/');}
    function trimSlashes(s){return s.replace(/^\/+|\/+$/g,'');}
    function base64Encode(str){return btoa(unescape(encodeURIComponent(str)));}
    function clearStatus(){els.status.textContent='';els.status.className='status';}
    function setStatus(m){els.status.textContent=m;}
    function setOk(m){els.status.className='status ok';els.status.innerHTML=m;}
    function setErr(m){els.status.className='status err';els.status.textContent='Error: '+m;}
  </script>
</body>
</html>
EOF

echo "Wrote: $repofile"
