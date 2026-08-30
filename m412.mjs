import { chromium } from 'playwright';
import Axe from '@axe-core/playwright';
const PAGES=['/','/work','/services/ai-llm-engineering','/faq','/contact'];
const b=await chromium.launch({executablePath:process.env.CHROME_PATH,args:['--no-sandbox','--disable-dev-shm-usage']});
// Lighthouse's mobile preset: Moto G Power, 412x823 CSS px, DPR 2.625.
const ctx=await b.newContext({viewport:{width:412,height:823},deviceScaleFactor:2.625,isMobile:true,hasTouch:true});
const p=await ctx.newPage();
for(const path of PAGES){
  await p.goto('http://localhost:3500'+path,{waitUntil:'networkidle'});
  const {violations}=await new Axe({page:p}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  const cc=violations.filter(v=>v.id==='color-contrast');
  console.log(path, cc.length?`FAIL ${cc[0].nodes.length} nodes`:'ok');
  for(const n of (cc[0]?.nodes||[]).slice(0,3)){
    console.log('   ', n.target.join(' ').slice(0,110));
    console.log('   ', (n.failureSummary||'').replace(/\n/g,' | ').slice(0,200));
  }
}
await b.close();
