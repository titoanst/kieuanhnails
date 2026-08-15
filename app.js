const modal=document.querySelector('#bookingModal'),service=modal.querySelector('[name="service"]'),form=document.querySelector('#bookingForm'),success=document.querySelector('.booking-success');document.querySelectorAll('.js-book').forEach(b=>b.onclick=()=>{if(b.dataset.service)service.value=b.dataset.service;form.hidden=false;success.hidden=true;modal.showModal()});document.querySelector('.modal-close').onclick=()=>modal.close();modal.onclick=e=>{if(e.target===modal)modal.close()};document.querySelectorAll('.quick-services button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.quick-services button').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');service.value=b.dataset.service});document.querySelectorAll('.date-row button,.time-row button').forEach(b=>b.onclick=()=>{[...b.parentElement.children].forEach(x=>x.classList.remove('selected'));b.classList.add('selected')});document.querySelectorAll('.filters button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.filters button').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.querySelectorAll('.nail-look').forEach(c=>c.classList.toggle('hidden',b.dataset.filter!=='all'&&c.dataset.cat!==b.dataset.filter))});document.querySelectorAll('.nail-look').forEach(c=>c.onclick=()=>{service.value=c.dataset.service||'Thiết kế theo yêu cầu';form.querySelector('[name="note"]').value='Mẫu tham khảo: '+(c.querySelector('strong')?.textContent||'Mẫu đã chọn');form.hidden=false;success.hidden=true;modal.showModal()});
form.onsubmit=async e=>{e.preventDefault();const submit=form.querySelector('[type="submit"]'),data=Object.fromEntries(new FormData(form)),payload=JSON.stringify(data),onVercel=location.hostname.endsWith('vercel.app');submit.disabled=true;submit.textContent='Đang gửi yêu cầu…';try{if(onVercel){await fetch('https://kieu-anh-nails.titoan.chatgpt.site/api/booking',{method:'POST',mode:'no-cors',headers:{'content-type':'text/plain;charset=UTF-8'},body:payload,cache:'no-store'})}else{const response=await fetch('/api/booking',{method:'POST',headers:{'content-type':'application/json'},body:payload,cache:'no-store'});if(!response.ok)throw new Error('send_failed')}form.hidden=true;success.hidden=false;document.querySelectorAll('.modal-progress i').forEach(x=>x.classList.add('active'));form.reset();startedAt.value=Date.now()}catch{alert('Chưa gửi được yêu cầu. Anh/chị vui lòng thử lại hoặc liên hệ Zalo 0878 804 489.')}finally{submit.disabled=false;submit.textContent='Gửi yêu cầu đặt lịch →'}};

const dateInput=form.querySelector('[name="date"]'),startedAt=document.querySelector('#formStartedAt'),dynamicDates=document.querySelector('#dynamicDates');
const localISO=date=>{const copy=new Date(date);copy.setMinutes(copy.getMinutes()-copy.getTimezoneOffset());return copy.toISOString().slice(0,10)};
const now=new Date(),today=localISO(now);dateInput.min=today;startedAt.value=Date.now();
const week=['CN','TH 2','TH 3','TH 4','TH 5','TH 6','TH 7'];
for(let offset=0;offset<4;offset++){const day=new Date(now);day.setDate(now.getDate()+offset);const button=document.createElement('button');button.type='button';button.dataset.date=localISO(day);button.innerHTML=`<small>${offset===0?'HÔM NAY':week[day.getDay()]}</small><b>${day.getDate()}</b>`;if(offset===0)button.classList.add('selected');button.onclick=()=>{[...dynamicDates.children].forEach(x=>x.classList.remove('selected'));button.classList.add('selected');dateInput.value=button.dataset.date};dynamicDates.append(button)}
dateInput.value=today;
modal.addEventListener('close',()=>{startedAt.value=Date.now()});
let lastSubmit=0;
form.addEventListener('submit',e=>{const current=Date.now();if(current-lastSubmit<15000){e.preventDefault();e.stopImmediatePropagation();alert('Vui lòng chờ một chút trước khi gửi lại.');return}lastSubmit=current},{capture:true});

document.querySelectorAll('.price-group header').forEach((header,i)=>{header.tabIndex=0;header.setAttribute('role','button');header.setAttribute('aria-expanded',i===1?'true':'false');header.addEventListener('click',()=>{if(innerWidth>600)return;const group=header.closest('.price-group'),open=group.classList.toggle('price-open');header.setAttribute('aria-expanded',String(open))});header.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();header.click()}})});

const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reduced){
  const revealItems=document.querySelectorAll('.service-card,.nail-look,.price-group,.booking-card,.local-card,.testimonial blockquote');
  revealItems.forEach((el,i)=>{el.classList.add('depth-reveal');el.style.setProperty('--delay',`${i%4*70}ms`)});
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.14,rootMargin:'0px 0px -6% 0px'});
  revealItems.forEach(el=>observer.observe(el));
  if(matchMedia('(hover:hover) and (pointer:fine)').matches){
    document.querySelectorAll('.nail-look,.service-card,.price-group,.booking-card').forEach(card=>{
      card.classList.add('tilt-3d');
      card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;card.style.setProperty('--rx',`${(0.5-y)*7}deg`);card.style.setProperty('--ry',`${(x-0.5)*9}deg`);card.style.setProperty('--gx',`${x*100}%`);card.style.setProperty('--gy',`${y*100}%`)});
      card.addEventListener('pointerleave',()=>{card.style.setProperty('--rx','0deg');card.style.setProperty('--ry','0deg')});
    });
    document.querySelector('.hero')?.addEventListener('pointermove',e=>{const x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;document.documentElement.style.setProperty('--hero-x',`${x*10}px`);document.documentElement.style.setProperty('--hero-y',`${y*7}px`)});
  }
}
