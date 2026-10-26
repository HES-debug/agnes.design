(function(){
    var t=document.getElementById('qtrack');
    function step(d){ if(!t) return; var c=t.querySelector('.q'); var w=c?c.getBoundingClientRect().width+28:t.clientWidth; t.scrollBy({left:d*w,behavior:'smooth'}); }
    var p=document.getElementById('qprev'), n=document.getElementById('qnext');
    if(p) p.addEventListener('click',function(){step(-1)});
    if(n) n.addEventListener('click',function(){step(1)});
    function top(){ var h=location.hash.slice(1); var el=h&&document.getElementById(h); if(el&&el.classList.contains('view')) window.scrollTo(0,0); }
    window.addEventListener('hashchange',top); top();
  })();

  (function(){
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.querySelectorAll('video[data-autoplay]').forEach(function(v){
      if(!('IntersectionObserver' in window)) return;
      new IntersectionObserver(function(es){es.forEach(function(e){ if(e.isIntersecting){ var p=v.play(); if(p&&p.catch) p.catch(function(){}); } else v.pause(); })},{threshold:.4}).observe(v);
    });
  })();

  (function(){
    document.querySelectorAll('dialog.lightbox').forEach(function(d){
      if(typeof d.showModal!=='function') return;
      var scope=d.closest('article')||document;
      var img=d.querySelector('img'),cap=d.querySelector('figcaption'),cnt=d.querySelector('.lb-count'),nav=d.querySelector('.lb-nav'),list=[],caps=[],i=0;
      function show(){img.src=list[i];img.alt=caps[i]||'';cap.textContent=caps[i]||'';cnt.textContent=(i+1)+' / '+list.length;nav.hidden=list.length<2}
      function step(n){i=(i+n+list.length)%list.length;show()}
      scope.querySelectorAll('[data-images]').forEach(function(a){
        a.addEventListener('click',function(e){
          e.preventDefault();list=a.dataset.images.split(',');caps=(a.dataset.captions||'').split('|');i=0;show();d.showModal();
        });
      });
      d.querySelectorAll('[data-lb]').forEach(function(b){b.addEventListener('click',function(){step(Number(b.dataset.lb))})});
      d.querySelector('.lb-close').addEventListener('click',function(){d.close()});
      d.addEventListener('click',function(e){if(e.target===d)d.close()});
      d.addEventListener('keydown',function(e){if(list.length<2)return;if(e.key==='ArrowRight')step(1);if(e.key==='ArrowLeft')step(-1)});
    });
  })();

  // Ask about Agnes: a prewritten Q&A panel (no AI API). Answers only use facts already on this site.
  (function(){
    var root=document.querySelector('.ask');if(!root)return;
    var QA={
      hire:{q:'I\u2019m hiring. What should I know?',a:['Agnes is a product designer in Singapore, and lived in Sydney before that.','She works end to end, from research through to developer hand-off, and has designed for nbn, Atlassian and Colonial First State.','A highlight: her first Field Toolkit prototype secured continued funding, and 20% of technicians adopted it in its first month.'],next:['best','team','contact']},
      best:{q:'What\u2019s her best project?',a:['Field Toolkit, the app nbn\u2019s field technicians use to run their jobs.','It had stalled and faced a funding cut. She interviewed technicians, mapped their day and rebuilt it mobile-first to WCAG 2.2.','Her first prototype secured continued funding, and it\u2019s still in daily use across Australia. <a href="#field-toolkit">See the case study \u2192</a>'],next:['ai','team','contact']},
      ai:{q:'How does she use AI?',a:['She designed First Coach, a concept AI coach for Colonial First State super members: it answers what it safely can and hands off to people when it should.','Outside work she vibe codes small projects for fun. <a href="#cfs-chatbot">See the AI chatbot \u2192</a>'],next:['hire','team','life']},
      team:{q:'What\u2019s she like to work with?',a:['From people she\u2019s worked with: \u201ca great communicator who showed strong attention to detail, delivered creative solutions, and was a wonderful collaborator.\u201d','Another said she \u201chit the ground running\u201d and \u201cculturally fit in well with the team from day one.\u201d'],next:['best','life','contact']},
      life:{q:'What does she do outside work?',a:['You\u2019ll find her with a <a href="#books">book</a>, in a <a href="#museums">museum</a>, painting, or vibe coding.','She also builds brands for small businesses through Arkhive Studio, and worked in fashion before tech. <a href="#beyond">See Beyond tech \u2192</a>'],next:['hire','best','contact']},
      contact:{q:'How do I reach her?',a:['She\u2019s open to work in Singapore.','Email <a href="mailto:helloagneslim@gmail.com">helloagneslim@gmail.com</a> or find her on <a href="https://www.linkedin.com/in/helloagneslim" target="_blank" rel="noopener">LinkedIn</a>.'],next:['hire','best','ai']}
    };
    var btn=root.querySelector('.ask-btn'),panel=root.querySelector('.ask-panel'),log=root.querySelector('.ask-log'),box=root.querySelector('.ask-chips');
    var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,busy=false,started=false;
    var wait=function(ms){return new Promise(function(r){setTimeout(r,reduce?0:ms)})};
    btn.innerHTML='<span class="ask-dot" aria-hidden="true"></span><span class="ask-label">Ask about Agnes</span>';btn.setAttribute('aria-label','Ask about Agnes');
    function msg(cls,html){var d=document.createElement('div');d.className='m '+cls;d.innerHTML=html;log.appendChild(d);log.scrollTop=log.scrollHeight;return d}
    function chips(keys){box.innerHTML='';keys.forEach(function(k){var b=document.createElement('button');b.type='button';b.textContent=QA[k].q;b.addEventListener('click',function(){ask(k)});box.appendChild(b)})}
    async function ask(k){if(busy)return;busy=true;box.innerHTML='';msg('me',QA[k].q);
      for(var i=0;i<QA[k].a.length;i++){var line=QA[k].a[i];await wait(300);var t=msg('bot','<span class="ask-typing"><i></i><i></i><i></i></span>');await wait(450+line.length*5);t.innerHTML=line;log.scrollTop=log.scrollHeight}
      chips(QA[k].next);busy=false}
    async function open(){panel.hidden=false;btn.setAttribute('aria-expanded','true');
      if(!started){started=true;msg('bot','Hi, I\u2019m Agnes\u2019s portfolio assistant.');await wait(350);msg('bot','What would you like to know?');chips(['hire','ai','life'])}
      var f=box.querySelector('button');if(f)f.focus()}
    function close(){panel.hidden=true;btn.setAttribute('aria-expanded','false')}
    btn.addEventListener('click',function(){panel.hidden?open():(close(),btn.focus())});
    root.querySelector('.ask-x').addEventListener('click',function(){close();btn.focus()});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!panel.hidden){close();btn.focus()}});
    log.addEventListener('click',function(e){var a=e.target.closest('a[href^="#"]');if(a)close()});
    root.hidden=false;
  })();

  // Custom cursor: only for a real mouse. Square by default, caret over text, label over projects.
  (function(){
    if(!matchMedia('(hover: hover) and (pointer: fine)').matches)return;
    var c=document.createElement('div');c.className='cur';c.setAttribute('aria-hidden','true');c.innerHTML='<i></i><span></span>';
    document.body.appendChild(c);document.documentElement.classList.add('has-cur');
    var label=c.querySelector('span'),x=-100,y=-100,raf=0;
    var VIEW='#projects .card,.wl-row,.bp-card,.next a';
    function place(){raf=0;var t=c.classList.contains('is-text')?'translate(-1.5px,-10px)':(c.classList.contains('is-link')?'translate(-6px,-6px)':'translate(-4px,-4px)');c.style.transform='translate('+x+'px,'+y+'px) '+t}
    document.addEventListener('pointermove',function(e){
      if(e.pointerType!=='mouse')return;x=e.clientX;y=e.clientY;c.classList.add('on');
      var el=e.target,v=el.closest&&el.closest(VIEW),l=!v&&el.closest&&el.closest('a,button,summary,label,[tabindex]');
      var txt=!v&&!l&&el.closest&&el.closest('p,h1,h2,h3,h4,li,blockquote,dd,dt,figcaption,small');
      c.classList.toggle('is-view',!!v);c.classList.toggle('is-link',!!l);c.classList.toggle('is-text',!!txt);
      if(v)label.textContent=v.classList.contains('bp-card')?'See the work':'View project';
      if(!raf)raf=requestAnimationFrame(place)},{passive:true});
    document.addEventListener('pointerdown',function(){c.classList.add('is-down')});
    document.addEventListener('pointerup',function(){c.classList.remove('is-down')});
    document.documentElement.addEventListener('mouseleave',function(){c.classList.remove('on')});
    document.addEventListener('mouseover',function(e){if(!e.relatedTarget)c.classList.add('on')});
  })();
