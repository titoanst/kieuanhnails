import { readFile, mkdir, writeFile, cp } from "node:fs/promises";

const html = await readFile("index.html", "utf8");
const css = await readFile("styles.css", "utf8");
const visual = await readFile("visual.css", "utf8");
const app = await readFile("app.js", "utf8");
const assetNames = ["hero-nails.webp","nail-collection.webp","hero-cover-v2.webp","gallery-french.webp","gallery-pearl.webp","gallery-cat-eye.webp","gallery-floral.webp"];
const assets = Object.fromEntries(await Promise.all(assetNames.map(async name => [`/${name}`,(await readFile(`public/${name}`)).toString("base64")])));

await mkdir("dist/server", { recursive: true });
await mkdir("dist/.openai", { recursive: true });

const worker = `
const html=${JSON.stringify(html)},css=${JSON.stringify(css)},visual=${JSON.stringify(visual)},app=${JSON.stringify(app)},assets=${JSON.stringify(assets)};
const image=b=>Uint8Array.from(atob(b),c=>c.charCodeAt(0)),origin='https://kieuanhnails.vercel.app';
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
const clean=(value,max=160)=>String(value??'').replace(/[<>]/g,'').trim().slice(0,max);
export default{async fetch(request,env){const url=new URL(request.url);
if(url.pathname==='/api/booking'){if(request.method!=='POST')return json({ok:false},405);try{const body=await request.json(),name=clean(body.name,80),phone=clean(body.phone,24),service=clean(body.service,80),date=clean(body.date,20),time=clean(body.time,20),note=clean(body.note,500);if(!name||!service||!date||!time||!/^[0-9+ .()-]{8,18}$/.test(phone))return json({ok:false,error:'invalid'},400);if(!env.TELEGRAM_BOT_TOKEN||!env.TELEGRAM_CHAT_ID)return json({ok:false,error:'config'},503);const message=['💅 LỊCH HẸN MỚI — KIỀU ANH NAILS','','👤 Khách: '+name,'📞 SĐT: '+phone,'✨ Dịch vụ: '+service,'📅 Ngày: '+date,'🕒 Giờ: '+time,'📝 Ghi chú: '+(note||'Không có'),'','Nguồn: Website'].join('\\n');const sent=await fetch('https://api.telegram.org/bot'+env.TELEGRAM_BOT_TOKEN+'/sendMessage',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({chat_id:env.TELEGRAM_CHAT_ID,text:message})});if(!sent.ok)return json({ok:false,error:'telegram'},502);return json({ok:true})}catch{return json({ok:false,error:'request'},400)}}
if(url.pathname==='/styles.css')return new Response(css,{headers:{'content-type':'text/css; charset=utf-8','cache-control':'public, max-age=86400'}});
if(url.pathname==='/visual.css')return new Response(visual,{headers:{'content-type':'text/css; charset=utf-8','cache-control':'public, max-age=86400'}});
if(url.pathname==='/app.js')return new Response(app,{headers:{'content-type':'text/javascript; charset=utf-8','cache-control':'public, max-age=86400'}});
if(assets[url.pathname])return new Response(image(assets[url.pathname]),{headers:{'content-type':'image/webp','cache-control':'public, max-age=31536000, immutable'}});
if(url.pathname==='/robots.txt')return new Response('User-agent: *\\nAllow: /\\nSitemap: '+origin+'/sitemap.xml',{headers:{'content-type':'text/plain; charset=utf-8'}});
if(url.pathname==='/sitemap.xml')return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>'+origin+'/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url></urlset>',{headers:{'content-type':'application/xml; charset=utf-8'}});
return new Response(html,{headers:{'content-type':'text/html; charset=utf-8','cache-control':'public, max-age=300','x-content-type-options':'nosniff'}})}};`;
await writeFile("dist/server/index.js", worker);
await cp(".openai/hosting.json", "dist/.openai/hosting.json");
