import { build } from 'vite'
import { execSync } from 'child_process'

async function buildForVercel() {
  console.log('🏗️  Building frontend...')
  
  // Build frontend
  await build({
    root: '.',
    build: {
      outDir: 'dist',
      emptyOutDir: true
    }
  })
  
  console.log('✅ Frontend build complete')
  
  // Build backend for serverless
  console.log('🏗️  Building backend...')
  
  execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=api --outfile=api/server.js', {
    stdio: 'inherit'
  })
  
  console.log('✅ Backend build complete')
  console.log('🚀 Ready for Vercel deployment!')
}

buildForVercel().catch(console.error)